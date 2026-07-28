/**
 * Garmin State Manager & Dynamic Calculator (Quiet Luxury Aesthetic)
 * Mediciones biométricas nativas y soporte telemétrico limpio.
 */

class GarminState {
  constructor() {
    this.data = {
      // Fisiología Cardíaca & Autonómica para Gimnasio
      rhr: 50, // ppm (Resting Heart Rate)
      hrv: 68, // ms (HRV Status: Balanced)
      hrvBaseline: "62 - 74 ms",
      hrvNightly7dAvg: 66,
      stressLevel: 24, // 0 - 100
      stressCharge: 72,
      stressDrain: -65,
      bodyBattery: 88, // 0 - 100
      
      // Sueño & Recuperación Muscular
      sleepScore: 88, // 0 - 100
      sleepTotalHours: 7.8,
      sleepDeepHours: 2.1,
      sleepRemHours: 1.9,
      sleepLightHours: 3.8,
      sleepAwakeMinutes: 12,
      sleepEfficiency: 94, // %
      
      // Pulsioximetría, Potencia & Sensores Avanzados (Se rellenan automáticamente al recibir lectura)
      spo2Avg: null, // % SpO2
      spo2Min: null,
      runningPowerWatts: null, // W
      cadenceSpm: null,
      napMinutes: null,
      
      // Métricas de Respiración y Fisiología
      respirationRate: 13.5, // brpm
      vo2Max: 54.5, // ml/kg/min
      fitnessAge: 21, // Edad Fisiológica
      
      // Gasto Activo en Gimnasio
      activeCalories: 640, // kcal quemadas en entrenamiento
      recoveryHours: 14, // Horas de recuperación estimadas
      stepsToday: 11420,
      
      // Configuración Fisiológica Base
      userBmr: 1820, // Basal Metabolic Rate (kcal/day)
      targetDeficit: 500, // Target deficit (kcal/day)
      isRealSync: false,
      lastSyncTime: null
    };

    this.listeners = [];
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
    } catch (e) {}
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
    const suggestedVolumeReduction = isHighFatigue ? 20 : 0;

    // Status message synthesis for GYM WORKOUTS (0 Device Names)
    let statusMessage = `Estado: Recuperación Óptima · Body Battery ${this.data.bodyBattery}%`;
    let statusLevel = "optimal";

    if (isHighFatigue) {
      statusLevel = "fatigue";
      statusMessage = `Aviso: Alta Fatiga Central · Sugerido -20% Volumen en Pesas`;
    } else if (this.data.bodyBattery < 50 || this.data.stressLevel > 50) {
      statusLevel = "moderate";
      statusMessage = `Estado: Recuperación Moderada · Mantener Cargas Estables`;
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
