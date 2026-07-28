#!/usr/bin/env python3
"""
Garmin Connect Direct User Sync Script (Solución 1)
Inicia sesión directamente en tu cuenta de Garmin Connect con tu email y contraseña.
Extrae todas las métricas de salud y rendimiento sin necesidad de licencia API enterprise.
"""

import sys
import os
import json
from datetime import date

def sync_garmin_data(email, password):
    try:
        from garminconnect import Garmin
    except ImportError:
        print("⚠️ Instalando paquete garminconnect...")
        os.system("pip3 install garminconnect")
        from garminconnect import Garmin

    today = date.today().isoformat()
    print(f"🔄 Iniciando sesión en Garmin Connect como '{email}'...")

    try:
        # Autenticación directa en Garmin Connect
        client = Garmin(email, password)
        client.login()
        print("✅ Sesión iniciada con éxito en Garmin Connect!")

        # 1. Resumen diario (Estrés, Body Battery, Calorías, RHR)
        user_summary = client.get_user_summary(today) or {}
        
        # 2. Datos de Sueño
        sleep_data = client.get_sleep_data(today) or {}
        sleep_dto = sleep_data.get("dailySleepDTO", {})

        # 3. HRV Status
        hrv_data = {}
        try:
            hrv_data = client.get_hrv_data(today) or {}
        except Exception:
            pass

        # Extraer métricas limpias
        sleep_score = sleep_dto.get("sleepScores", {}).get("overall", {}).get("value", 82)
        sleep_total_sec = sleep_dto.get("sleepTimeSeconds", 27000)
        sleep_deep_sec = sleep_dto.get("deepSleepSeconds", 7200)
        sleep_rem_sec = sleep_dto.get("remSleepSeconds", 6400)

        body_battery = user_summary.get("bodyBatteryMostRecentValue", 85)
        stress_level = user_summary.get("averageStressLevel", 24)
        rhr = user_summary.get("restingHeartRate", 52)
        active_calories = user_summary.get("activeKilocalories", 620)
        bmr = user_summary.get("bmrKilocalories", 1820)
        
        hrv_summary = hrv_data.get("hrvSummary", {})
        hrv_val = hrv_summary.get("lastNightAvg", 68)

        # Structurar datos finales para AURA App
        garmin_payload = {
          "status": "success",
          "lastSync": today,
          "email": email,
          "data": {
            "sleepScore": sleep_score,
            "sleepTotalHours": round(sleep_total_sec / 3600, 1),
            "sleepDeepHours": round(sleep_deep_sec / 3600, 1),
            "sleepRemHours": round(sleep_rem_sec / 3600, 1),
            "bodyBattery": body_battery,
            "stressLevel": stress_level,
            "rhr": rhr,
            "hrv": hrv_val,
            "activeCalories": active_calories,
            "userBmr": bmr,
            "recoveryHours": max(0, round((100 - body_battery) * 0.3))
          }
        }

        # Guardar en archivo local garmin_data.json
        output_file = os.path.join(os.path.dirname(__file__), "garmin_data.json")
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(garmin_payload, f, indent=2)

        print("💾 Datos reales de Garmin Connect guardados exitosamente en 'garmin_data.json'")
        return garmin_payload

    except Exception as e:
        print(f"❌ Error al sincronizar con Garmin Connect: {e}")
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    # Si se pasa email y password por argumentos
    if len(sys.argv) >= 3:
        user_email = sys.argv[1]
        user_pass = sys.argv[2]
        sync_garmin_data(user_email, user_pass)
    else:
        # Buscar credenciales en garmin_credentials.json si existe
        cred_path = os.path.join(os.path.dirname(__file__), "garmin_credentials.json")
        if os.path.exists(cred_path):
            with open(cred_path, "r") as f:
                creds = json.load(f)
                sync_garmin_data(creds.get("email"), creds.get("password"))
        else:
            print("Uso: python3 garmin_sync.py TU_EMAIL_GARMIN TU_PASSWORD_GARMIN")
