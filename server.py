#!/usr/bin/env python3
"""
Custom HTTP Server + Garmin Connect Sync API (Servidor de Red Red Abierto con CORS)
Permite conectar tanto desde la Mac como desde cualquier teléfono móvil en la misma red Wi-Fi.
"""

import http.server
import socketserver
import json
import os
import subprocess

PORT = 8765

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Habilitar CORS para permitir llamadas desde móviles y navegadores externos
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        this_end = self.end_headers()

    def do_POST(self):
        if self.path == '/api/garmin-sync':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            
            try:
                payload = json.loads(post_data.decode('utf-8'))
                email = payload.get('email')
                password = payload.get('password')

                if not email or not password:
                    self.send_response(400)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({"status": "error", "message": "Email y contraseña requeridos"}).encode())
                    return

                print(f"🔄 Sincronizando datos de Garmin Connect para '{email}'...")
                
                # Ejecutar script garmin_sync.py
                sync_script = os.path.join(os.path.dirname(__file__), "garmin_sync.py")
                res = subprocess.run(
                    ["python3", sync_script, email, password],
                    capture_output=True,
                    text=True
                )

                if res.returncode == 0:
                    json_path = os.path.join(os.path.dirname(__file__), "garmin_data.json")
                    if os.path.exists(json_path):
                        with open(json_path, 'r', encoding='utf-8') as f:
                            sync_result = json.load(f)
                    else:
                        sync_result = {"status": "success", "message": "Sincronizado correctamente"}

                    self.send_response(200)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps(sync_result).encode())
                else:
                    self.send_response(500)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({"status": "error", "message": res.stderr or "Error en autenticación de Garmin Connect"}).encode())

            except Exception as e:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": str(e)}).encode())
        else:
            super().do_POST()

def run_server():
    os.chdir(os.path.dirname(__file__))
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("0.0.0.0", PORT), CustomHandler) as httpd:
        print(f"🚀 Servidor AURA + Garmin API activo en toda la red Wi-Fi:")
        print(f"   👉 En Mac: http://localhost:{PORT}")
        print(f"   👉 En Móvil: http://192.168.10.190:{PORT}")
        httpd.serve_forever()

if __name__ == '__main__':
    run_server()
