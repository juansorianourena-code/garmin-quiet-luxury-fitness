# AURA · Quiet Luxury Fitness, Nutrition & Garmin Connect

Aplicación de rendimiento personal, entrenamiento adaptativo y balance nutricional dinámico conectada con Garmin Connect API.

##  Filosofía Estética ("Quiet Luxury")
- **Paleta de Colores**:
  - Fondo Principal: `#F9F8F6`
  - Tarjetas y Contenedores: `#F0EEE9`
  - Texto Principal y Trazos: `#1B263B`
  - Accento Estado Óptimo: `#4A5D4E` (Verde Oliva Oscuro)
  - Accento Fatiga / Ajustes: `#9E6B55` (Terracota Apagado)
- **Regla Cero Modales / Pop-Ups**: Interacción 100% ininterrumpida mediante acordeones inline en la propia capa y transiciones horizontales fluidas.

## 🚀 Módulos
1. **Hub de Control Diario**: Sintetizador de estado Garmin, Matriz de salud y Calculadora de Déficit Dinámico ($BMR + \text{Active Garmin Calories}$).
2. **Entrenamiento Adaptativo**: Rutinas por patrón de movimiento, sustitución de ejercicios por acordeón inline y autorregulación por fatiga de Garmin (-20% volumen / deload).
3. **Nutrición & Balance**: Planificador por macros, intercambio de platos en desplegable inline y registrador de alimentos.
4. **Descanso & Analítica**: Mapa de impacto muscular 2D en trazo fino, gráficos cruzados de Sueño vs 1RM y seguimiento corporal.

## 🛠️ Ejecución Local
```bash
python3 -m http.server 8765
```
Abre en el navegador: `http://localhost:8765`
