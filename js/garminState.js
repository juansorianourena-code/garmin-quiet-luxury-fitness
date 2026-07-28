/**
 * Garmin State Manager & Dynamic Calculator (Focus: Gym / Strength & Hardware Compatibility)
 * Soporte activo para Garmin Forerunner 55 actual y preparación de la suite completa Forerunner 165.
 * Estética Quiet Luxury (0 Emojis, precisión de laboratorio biomecánico).
 */

class GarminState {
  constructor() {
    // Current Active Watch: Garmin Forerunner 55
    // Future Upgrade Ready: Garmin Forerunner 165
    this.data = {
      deviceModel: "Garmin Forerunner 55",
      futureModelReady: "Garmin Forerunner 165",
      sensorEngine: "Garmin Elevate™ Optical HR",
      
      // 1. Fisiología Cardíaca & Autonómica para Gimnasio (Disponibles en Forerunner 55 & 165)
      rhr: 50, // ppm (Resting Heart Rate)
      hrv: 68, // ms (HRV Status: Balanced)
      hrvBaseline: "62 - 74 ms",
      hrvNightly7dAvg: 66,
      stressLevel: 24, // 0 - 100 (Average daily stress)
      stressCharge: 72,
      stressDrain: -65,
      bodyBattery: 88, // 0 - 100 (Reserva de energía para gimnasio)
      
      // 2. Sueño & Recuperación Muscular (Forerunner 55 & 165)
      sleepScore: 88, // 0 - 100
      sleepTotalHours: 7.8,
      sleepDeepHours: 2.1, // Horas de recuperación física muscular
      sleepRemHours: 1.9,
      sleepLightHours: 3.8,
      sleepAwakeMinutes: 12,
      sleepEfficiency: 94, // %
      
      // 3. Métricas Exclusivas de Forerunner 165 (Pendientes `--` hasta vincular el nuevo reloj)
      spo2Avg: null, // Pendiente Forerunner 165 (SpO2 %)
      spo2Min: null,
      napMinutes: null, // Detección de siestas
      runningPowerWatts: null, // W
      cadenceSpm: null,
      strideLengthMeters: null,
      groundContactTimeMs: null,
      verticalOscillationCm: null,
      
      // 4. Métricas de Respiración y Gimnasio (Forerunner 55 & 165)
      respirationRate: 13.5, // brpm
      vo2Max: 54.5, // ml/kg/min
      fitnessAge: 21, // Edad Fisiológica
      
      // 5. Gasto Activo en Gimnasio y Pasos (Forerunner 55)
      activeCalories: 640, // kcal quemadas en entrenamiento de fuerza y movimiento
      recoveryHours: 14, // Horas de recuperación estimadas para la siguiente sesión de pesas
      stepsToday: 11420,
      
      // 6. Configuración Fisiológica Base
      userBmr: 1820, // Basal Metabolic Rate (kcal/day)
      targetDeficit: 500, // Target deficit (kcal/day)
      isRealSync: false,
      lastSyncTime: null
    };

    this.listeners = [];
    
    // Auto-fetch real garmin_data.json if exists
    this.fetchRealGarminJson();
  }

  async fetchRealGarminJson() {
    try {
      const res = await fetch('garmin_data.json');
      if (res.ok) {
        const payload = await res.json();
        if (payload && payload.status === 'success' && payload.data) {
          this.updateMetrics({
            ...payload.data,
            isRealSync: true,
            lastSyncTime: payload.lastSync
          });
        }
      }
    } catch (e) {
      // garmin_data.json not created yet
    }
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(l => l(this.getData()));
  }

  getData() {
    const totalExpenditure = this.data.userBmr + this.data.activeCalories;
    const targetIntake = totalExpenditure - this.data.targetDeficit;
    
    // Auto-regulation evaluation for GYM & STRENGTH TRAINING
    const isHighFatigue = this.data.bodyBattery < 30 || this.data.stressLevel > 75 || this.data.sleepScore < 55;
    const suggestedVolumeReduction = isHighFatigue ? 20 : 0; // -20% de series en el gimnasio

    // Status message synthesis for GYM WORKOUTS
    let statusMessage = `Estado Gimnasio (${this.data.deviceModel}): Recuperación Óptima · Body Battery ${this.data.bodyBattery}%`;
    let statusLevel = "optimal"; // 'optimal' | 'fatigue' | 'moderate'

    if (isHighFatigue) {
      statusLevel = "fatigue";
      statusMessage = `Aviso Carga (${this.data.deviceModel}): Alta Fatiga Central · Sugerido -20% Volumen en Pesas`;
    } else if (this.data.bodyBattery < 50 || this.data.stressLevel > 50) {
      statusLevel = "moderate";
      statusMessage = `Estado Gimnasio (${this.data.deviceModel}): Recuperación Moderada · Mantener Cargas Estables`;
    }

    return {
      ...this.data,
      totalExpenditure,
      targetIntake,
      isHighFatigue,
      suggestedVolumeReduction,
      statusMessage,
      statusLevel
    };
  }

  updateMetrics(partialData) {
    this.data = { ...this.data, ...partialData };
    this.notify();
  }
}

export const garminState = new GarminState();
