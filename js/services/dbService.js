/**
 * Motor de Base de Datos IndexedDB Persistente e Inalterable (Triple Redundancia)
 * Lock de Almacenamiento Permanente + Respaldo en LocalStorage + Exportación JSON.
 * Estética Quiet Luxury estricta.
 */

class DBService {
  constructor() {
    this.dbName = 'AuraFitnessDB';
    this.dbVersion = 1;
    this.db = null;
    this.initDB();
    this.requestStoragePersistence();
  }

  async requestStoragePersistence() {
    if (navigator.storage && navigator.storage.persist) {
      try {
        const isPersisted = await navigator.storage.persisted();
        if (!isPersisted) {
          await navigator.storage.persist();
        }
      } catch (e) {
        console.warn("Storage persistence request handled:", e);
      }
    }
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
    const entry = {
      id: `${userId}_${dateStr}_${dayData.dayName || 'workout'}`,
      userId,
      dateStr,
      timestamp: new Date().toISOString(),
      dayName: dayData.dayName,
      exercises: dayData.exercises || []
    };

    // Capa 1: IndexedDB
    const tx = db.transaction(['workout_logs'], 'readwrite');
    tx.objectStore('workout_logs').put(entry);

    // Capa 2: LocalStorage Dual Mirror Backup
    try {
      const backupKey = `aura_backup_workouts_${userId}`;
      const existing = JSON.parse(localStorage.getItem(backupKey)) || [];
      const idx = existing.findIndex(x => x.id === entry.id);
      if (idx >= 0) existing[idx] = entry;
      else existing.push(entry);
      localStorage.setItem(backupKey, JSON.stringify(existing));
    } catch (e) {}

    return entry;
  }

  async getWorkoutLogs(userId) {
    const db = await this.getDB();
    return new Promise((resolve) => {
      const tx = db.transaction(['workout_logs'], 'readonly');
      const store = tx.objectStore('workout_logs');
      const request = store.getAll();
      request.onsuccess = () => {
        const all = request.result || [];
        const filtered = all.filter(item => item.userId === userId);
        
        // Backup fallback if IndexedDB is empty
        if (filtered.length === 0) {
          try {
            const backup = JSON.parse(localStorage.getItem(`aura_backup_workouts_${userId}`)) || [];
            resolve(backup);
            return;
          } catch (e) {}
        }
        resolve(filtered);
      };
      request.onerror = () => resolve([]);
    });
  }

  // --- SAVE NUTRITION LOG ---
  async saveNutritionLog(userId, dateStr, nutritionData) {
    const db = await this.getDB();
    const entry = {
      id: `${userId}_${dateStr}`,
      userId,
      dateStr,
      timestamp: new Date().toISOString(),
      targets: nutritionData.targets,
      totals: nutritionData.totals,
      loggedFood: nutritionData.loggedFood || []
    };

    const tx = db.transaction(['nutrition_logs'], 'readwrite');
    tx.objectStore('nutrition_logs').put(entry);

    // Dual LocalStorage backup
    try {
      const backupKey = `aura_backup_nutrition_${userId}`;
      const existing = JSON.parse(localStorage.getItem(backupKey)) || [];
      const idx = existing.findIndex(x => x.id === entry.id);
      if (idx >= 0) existing[idx] = entry;
      else existing.push(entry);
      localStorage.setItem(backupKey, JSON.stringify(existing));
    } catch (e) {}

    return entry;
  }

  async getNutritionLogs(userId) {
    const db = await this.getDB();
    return new Promise((resolve) => {
      const tx = db.transaction(['nutrition_logs'], 'readonly');
      const store = tx.objectStore('nutrition_logs');
      const request = store.getAll();
      request.onsuccess = () => {
        const all = request.result || [];
        const filtered = all.filter(item => item.userId === userId);
        if (filtered.length === 0) {
          try {
            const backup = JSON.parse(localStorage.getItem(`aura_backup_nutrition_${userId}`)) || [];
            resolve(backup);
            return;
          } catch (e) {}
        }
        resolve(filtered);
      };
      request.onerror = () => resolve([]);
    });
  }

  // --- SAVE BIOMETRIC LOG ---
  async saveBiometricLog(userId, dateStr, profileData) {
    const db = await this.getDB();
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

    const tx = db.transaction(['biometric_logs'], 'readwrite');
    tx.objectStore('biometric_logs').put(entry);
    return entry;
  }

  async getBiometricLogs(userId) {
    const db = await this.getDB();
    return new Promise((resolve) => {
      const tx = db.transaction(['biometric_logs'], 'readonly');
      const store = tx.objectStore('biometric_logs');
      const request = store.getAll();
      request.onsuccess = () => {
        const all = request.result || [];
        resolve(all.filter(item => item.userId === userId));
      };
      request.onerror = () => resolve([]);
    });
  }

  // --- EXPORT JSON BACKUP FILE ---
  async exportFullBackupJSON(userId) {
    const workouts = await this.getWorkoutLogs(userId);
    const nutrition = await this.getNutritionLogs(userId);
    const biometrics = await this.getBiometricLogs(userId);

    const fullData = {
      userId,
      exportDate: new Date().toISOString(),
      workouts,
      nutrition,
      biometrics
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `AURA_Fitness_Backup_${userId}_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }
}

export const dbService = new DBService();
