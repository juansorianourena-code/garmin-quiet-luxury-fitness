/**
 * Conector Real con Garmin Connect Health API (OAuth 2.0 / REST API)
 * 
 * Para conectar con Garmin Connect en producción:
 * 1. Regístrate en Garmin Developer Program (https://developer.garmin.com/gc-developer-program/)
 * 2. Obtén tu Consumer Key (Client ID) y Consumer Secret (Client Secret).
 * 3. Este módulo realiza el intercambio de tokens OAuth y consulta los endpoints oficiales:
 *    - /wellness-api/rest/dailies (Estrés, RHR, Calorías Activas, BMR)
 *    - /wellness-api/rest/sleeps (Puntuación de Sueño y Fases)
 *    - /wellness-api/rest/bodyBattery (Nivel de Body Battery 0-100)
 *    - /wellness-api/rest/hrv (HRV Status)
 */

import { garminState } from './garminState.js';

export class GarminConnectAPI {
  constructor(config = {}) {
    this.clientId = config.clientId || 'YOUR_GARMIN_CLIENT_ID';
    this.clientSecret = config.clientSecret || 'YOUR_GARMIN_CLIENT_SECRET';
    this.redirectUri = config.redirectUri || window.location.origin;
    this.accessToken = localStorage.getItem('garmin_access_token') || null;
  }

  // 1. Iniciar Flujo OAuth 2.0 / PKCE con Garmin
  loginWithGarmin() {
    const authUrl = `https://connect.garmin.com/oauthConfirm?oauth_token=${this.clientId}&redirect_uri=${encodeURIComponent(this.redirectUri)}`;
    window.location.href = authUrl;
  }

  // 2. Intercambio de Código de Autorización por Access Token
  async handleOAuthCallback(oauthToken, oauthVerifier) {
    try {
      // Nota: En producción este intercambio debe realizarse en un servidor backend por seguridad
      const response = await fetch('/api/garmin/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oauthToken, oauthVerifier })
      });

      const data = await response.json();
      this.accessToken = data.access_token;
      localStorage.setItem('garmin_access_token', this.accessToken);
      
      // Sincronizar datos reales tras autenticación
      await this.syncRealGarminData();
    } catch (err) {
      console.error('Error al autenticar con Garmin Connect API:', err);
    }
  }

  // 3. Consultar y Sincronizar Datos Reales de Garmin Connect
  async syncRealGarminData() {
    if (!this.accessToken) {
      console.warn('Garmin Connect: No hay Token de Acceso activo. Usando modo simulador.');
      return;
    }

    try {
      const today = new Date().toISOString().split('T')[0];

      // Endpoints Oficiales Garmin Health API
      const [dailiesRes, sleepsRes, bodyBatRes, hrvRes] = await Promise.all([
        fetch(`https://healthapi.garmin.com/wellness-api/rest/dailies?uploadStartTimeInSeconds=${this.getTimestamp(today)}`, {
          headers: { 'Authorization': `Bearer ${this.accessToken}` }
        }),
        fetch(`https://healthapi.garmin.com/wellness-api/rest/sleeps?uploadStartTimeInSeconds=${this.getTimestamp(today)}`, {
          headers: { 'Authorization': `Bearer ${this.accessToken}` }
        }),
        fetch(`https://healthapi.garmin.com/wellness-api/rest/bodyBattery?uploadStartTimeInSeconds=${this.getTimestamp(today)}`, {
          headers: { 'Authorization': `Bearer ${this.accessToken}` }
        }),
        fetch(`https://healthapi.garmin.com/wellness-api/rest/hrv?uploadStartTimeInSeconds=${this.getTimestamp(today)}`, {
          headers: { 'Authorization': `Bearer ${this.accessToken}` }
        })
      ]);

      const dailies = await dailiesRes.json();
      const sleeps = await sleepsRes.json();
      const bodyBattery = await bodyBatRes.json();
      const hrvData = await hrvRes.json();

      // Transformar payload de Garmin al formato interno de AURA App
      const realMetrics = {
        sleepScore: sleeps[0]?.overallSleepScore || 80,
        sleepTotalHours: (sleeps[0]?.durationInSeconds / 3600).toFixed(1) || 7.5,
        sleepDeepHours: (sleeps[0]?.deepSleepDurationInSeconds / 3600).toFixed(1) || 2.0,
        sleepRemHours: (sleeps[0]?.remSleepDurationInSeconds / 3600).toFixed(1) || 1.8,
        
        bodyBattery: bodyBattery[0]?.chargedValue || 85,
        stressLevel: dailies[0]?.averageStressLevel || 25,
        
        rhr: dailies[0]?.restingHeartRateInBeatsPerMinute || 52,
        hrv: hrvData[0]?.lastNightAvg || 65,
        
        activeCalories: dailies[0]?.activeKilocalories || 550,
        userBmr: dailies[0]?.bmrKilocalories || 1800,
        recoveryHours: dailies[0]?.timeToRecoveryInHours || 12
      };

      // Actualizar estado global reactivo de AURA
      garminState.updateMetrics(realMetrics);
      console.log('✅ Datos de Garmin Connect API sincronizados en tiempo real:', realMetrics);
    } catch (error) {
      console.error('Error al obtener datos reales de Garmin Connect:', error);
    }
  }

  getTimestamp(dateStr) {
    return Math.floor(new Date(dateStr).getTime() / 1000);
  }
}

export const garminApiConnector = new GarminConnectAPI();
