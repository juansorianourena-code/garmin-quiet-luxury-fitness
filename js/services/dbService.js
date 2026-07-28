/**
 * Motor de Base de Datos IndexedDB Persistente e Inalterable
 * Guarda todo el historial de entrenamientos, nutrición, biometría y Garmin por fecha.
 */

class DBService {
  constructor() {
    this.dbName = 'AuraFitnessDB';
    this.dbVersion = 1;
    this.db = null;
    this.initDB();
  }

  async initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onupgradeneeded = (e) => {
        const db = e.target.result;

        if (!db.objectStoreNames.contains('workout_logs')) {
          const store = db.createObjectStore('workout_logs', { keyPath: 'id' });
          store.createIndex('userId_date', ['userId', 'dateStr'], { unique: false });
        }

        if (!db.objectStoreNames.contains('nutrition_logs')) {
          const store = db.createObjectStore('nutrition_logs', { keyPath: 'id' });
          store.createIndex('userId_date', ['userId', 'dateStr'], { unique: false });
        }

        if (!db.objectStoreNames.contains('biometric_logs')) {
          const store = db.createObjectStore('biometric_logs', { keyPath: 'id' });
          store.createIndex('userId_date', ['userId', 'dateStr'], { unique: false });
        }

        if (!db.objectStoreNames.contains('garmin_logs')) {
          const store = db.createObjectStore('garmin_logs', { keyPath: 'id' });
          store.createIndex('userId_date', ['userId', 'dateStr'], { unique: false });
        }
      };

      request.onsuccess = (e) => {
        this.db = e.target.result;
        resolve(this.db);
      };

      request.onerror = (e) => {
        reject(e.target.error);
      };
    });
  }

  async getDB() {
    if (this.db) return this.db;
    return await this.initDB();
  }

  // --- SAVE WORKOUT LOG ---
  async saveWorkoutLog(userId, dateStr, dayData) {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(['workout_logs'], 'readwrite');
      const store = tx.objectStore('workout_logs');
      const entry = {
        id: `${userId}_${dateStr}_${dayData.dayName || 'workout'}`,
        userId,
        dateStr,
        timestamp: new Date().toISOString(),
        dayName: dayData.dayName,
        exercises: dayData.exercises || []
      };
      store.put(entry);
      tx.oncomplete = () => resolve(entry);
      tx.onerror = (e) => reject(e.target.error);
    });
  }

  async getWorkoutLogs(userId) {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(['workout_logs'], 'readonly');
      const store = tx.objectStore('workout_logs');
      const request = store.getAll();
      request.onsuccess = () => {
        const all = request.result || [];
        resolve(all.filter(item => item.userId === userId));
      };
      request.onerror = (e) => reject(e.target.error);
    });
  }

  // --- SAVE NUTRITION LOG ---
  async saveNutritionLog(userId, dateStr, nutritionData) {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(['nutrition_logs'], 'readwrite');
      const store = tx.objectStore('nutrition_logs');
      const entry = {
        id: `${userId}_${dateStr}`,
        userId,
        dateStr,
        timestamp: new Date().toISOString(),
        targets: nutritionData.targets,
        totals: nutritionData.totals,
        loggedFood: nutritionData.loggedFood || []
      };
      store.put(entry);
      tx.oncomplete = () => resolve(entry);
      tx.onerror = (e) => reject(e.target.error);
    });
  }

  async getNutritionLogs(userId) {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(['nutrition_logs'], 'readonly');
      const store = tx.objectStore('nutrition_logs');
      const request = store.getAll();
      request.onsuccess = () => {
        const all = request.result || [];
        resolve(all.filter(item => item.userId === userId));
      };
      request.onerror = (e) => reject(e.target.error);
    });
  }

  // --- SAVE BIOMETRIC LOG ---
  async saveBiometricLog(userId, dateStr, profileData) {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(['biometric_logs'], 'readwrite');
      const store = tx.objectStore('biometric_logs');
      const entry = {
        id: `${userId}_${dateStr}`,
        userId,
        dateStr,
        timestamp: new Date().toISOString(),
        weight: profileData.weight,
        height: profileData.height,
        goal: profileData.goal,
        bmr: profileData.bmr,
        tdee: profileData.tdee,
        targetCalories: profileData.targetCalories
      };
      store.put(entry);
      tx.oncomplete = () => resolve(entry);
      tx.onerror = (e) => reject(e.target.error);
    });
  }

  async getBiometricLogs(userId) {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(['biometric_logs'], 'readonly');
      const store = tx.objectStore('biometric_logs');
      const request = store.getAll();
      request.onsuccess = () => {
        const all = request.result || [];
        resolve(all.filter(item => item.userId === userId));
      };
      request.onerror = (e) => reject(e.target.error);
    });
  }

  // --- SAVE GARMIN LOG ---
  async saveGarminLog(userId, dateStr, garminData) {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(['garmin_logs'], 'readwrite');
      const store = tx.objectStore('garmin_logs');
      const entry = {
        id: `${userId}_${dateStr}`,
        userId,
        dateStr,
        timestamp: new Date().toISOString(),
        sleepScore: garminData.sleepScore,
        stressLevel: garminData.stressLevel,
        bodyBattery: garminData.bodyBattery,
        activeCalories: garminData.activeCalories,
        totalExpenditure: garminData.totalExpenditure
      };
      store.put(entry);
      tx.oncomplete = () => resolve(entry);
      tx.onerror = (e) => reject(e.target.error);
    });
  }

  async getGarminLogs(userId) {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(['garmin_logs'], 'readonly');
      const store = tx.objectStore('garmin_logs');
      const request = store.getAll();
      request.onsuccess = () => {
        const all = request.result || [];
        resolve(all.filter(item => item.userId === userId));
      };
      request.onerror = (e) => reject(e.target.error);
    });
  }
}

export const dbService = new DBService();
