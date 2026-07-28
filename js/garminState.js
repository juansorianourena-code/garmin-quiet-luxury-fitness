/**
 * Garmin State Manager & Dynamic Calculator (Medical Grade Sports Science)
 * Handles simulated live Garmin Connect API feed, real garmin_data.json sync,
 * Auto-regulation logic, and BMR + Active Calories Dynamic Deficit calculations.
 * Estética Quiet Luxury (0 Emojis, alta precisión clínica).
 */

class GarminState {
  constructor() {
    // Initial Garmin data (Medical Grade Precision Metrics)
    this.data = {
      sleepScore: 88, // 0 - 100
      sleepTotalHours: 7.8,
      sleepDeepHours: 2.1,
      sleepRemHours: 1.9,
      sleepLightHours: 3.8,
      sleepAwakeMinutes: 12,
      sleepEfficiency: 94, // %
      
      bodyBattery: 88, // 0 - 100
      stressLevel: 24, // 0 - 100 (Average daily)
      stressCharge: 72,
      stressDrain: -65,
      
      rhr: 50, // bpm (Resting Heart Rate)
      hrv: 68, // ms (HRV Status: Balanced)
      hrvBaseline: "62 - 74 ms",
      hrvNightly7dAvg: 66,
      
      spo2Avg: 98, // % SpO2
      spo2Min: 95,
      respirationRate: 13.5, // rpm
      
      vo2Max: 54.5, // ml/kg/min
      fitnessAge: 21, // Fitness Age (years)
      lactateThresholdPace: "4:15 min/km",
      lactateThresholdHr: 168, // bpm
      
      activeCalories: 640, // kcal burned from movement/workouts today
      recoveryHours: 14, // Estimated recovery hours remaining
      stepsToday: 11420,
      distanceKm: 8.4,
      
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
      // garmin_data.json not created yet, default to simulator
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
    
    // Auto-regulation evaluation
    const isHighFatigue = this.data.bodyBattery < 30 || this.data.stressLevel > 75 || this.data.sleepScore < 55;
    const suggestedVolumeReduction = isHighFatigue ? 20 : 0; // -20% volume

    // Status message synthesis
    let statusMessage = "Estado: Recuperación Óptima · Body Battery " + this.data.bodyBattery + "%";
    let statusLevel = "optimal"; // 'optimal' | 'fatigue' | 'moderate'

    if (isHighFatigue) {
      statusLevel = "fatigue";
      statusMessage = "Aviso Garmin: Alta Fatiga Detectada · Sugerido -20% Volumen";
    } else if (this.data.bodyBattery < 50 || this.data.stressLevel > 50) {
      statusLevel = "moderate";
      statusMessage = "Estado: Recuperación Moderada · Carga Controlada";
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
