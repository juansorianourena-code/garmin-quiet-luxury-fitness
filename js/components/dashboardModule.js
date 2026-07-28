/**
 * Módulo 1: Hub de Control Diario (Dashboard Principal Garmin Forerunner 165)
 * Telemetría de Sensores en Vivo: SpO2, VFC Status, Potencia en Muñeca (W) y Fisiología.
 * Estética Quiet Luxury estricta: 0 emojis.
 */

import { garminState } from '../garminState.js';
import { appState } from '../appState.js';

export function renderDashboardModule(container, onNavigate) {
  const gData = garminState.getData();
  const nTotals = appState.getTotals();

  // BMR + Active Garmin Calories
  const totalExpenditure = gData.totalExpenditure;
  const currentIntake = nTotals.calories;
  const targetDeficit = gData.targetDeficit;
  
  // Real time remaining calories for deficit target
  const currentDeficit = totalExpenditure - currentIntake;
  const deficitPct = Math.min(Math.max((currentDeficit / targetDeficit) * 100, 0), 100);

  const goalText = appState.userProfile.goal === 'fat_loss' ? 'Déficit' : appState.userProfile.goal === 'muscle_gain' ? 'Superávit' : 'Mantenimiento';

  container.innerHTML = `
    <!-- Synthesized Status Header Card -->
    <div class="card" style="border-left: 4px solid ${gData.isHighFatigue ? 'var(--accent-fatigue)' : 'var(--accent-optimal)'}; margin-bottom: 12px;">
      <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 8px;">
        <div class="card-title-sm" style="margin-bottom: 2px;">Telemetría Hub · Garmin Forerunner 165</div>
        <span style="font-size: 0.72rem; font-family: var(--font-mono); color: var(--accent-optimal); font-weight: 600;">Sensor Elevate™ V4 Activo</span>
      </div>
      <div class="header-status-message" style="font-weight: 500; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
        <span>${gData.statusMessage}</span>
        <span style="font-size: 0.82rem; font-family: var(--font-mono); color: var(--text-muted);">Recuperación: ${gData.recoveryHours}h</span>
      </div>
    </div>

    <!-- MATRIZ DE TELEMETRÍA DE SENSORES EN CUADRADO (6 TARJETAS DE ALTA DENSIDAD) -->
    <div style="display: grid !important; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)) !important; gap: 8px !important; margin-bottom: 14px !important;">
      
      <!-- 1. SpO2 Promedio (Oxígeno en Sangre) -->
      <div class="grid-cell accent-optimal-border" style="padding: 10px 12px;">
        <div class="card-title-sm" style="color: var(--accent-optimal); margin-bottom: 4px; font-size: 0.68rem;">Oxígeno Sangre (SpO2)</div>
        <div class="metric-number-lg" style="color: var(--accent-optimal); font-size: 1.7rem; line-height: 1.1;">${gData.spo2Avg || 98}<span class="unit" style="font-size: 0.75rem;">%</span></div>
        <div style="margin-top: 4px; font-size: 0.68rem; color: var(--text-muted); font-family: var(--font-mono);">
          Mínimo Nocturno: ${gData.spo2Min || 95}%
        </div>
      </div>

      <!-- 2. VFC Status / HRV -->
      <div class="grid-cell accent-navy-border" style="padding: 10px 12px;">
        <div class="card-title-sm" style="margin-bottom: 4px; font-size: 0.68rem;">VFC Nocturna (HRV)</div>
        <div class="metric-number-lg" style="font-size: 1.7rem; line-height: 1.1;">${gData.hrv}<span class="unit" style="font-size: 0.75rem;">ms</span></div>
        <div style="margin-top: 4px; font-size: 0.68rem; color: var(--text-muted); font-family: var(--font-mono);">
          Equilibrado (${gData.hrvBaseline || '62-74ms'})
        </div>
      </div>

      <!-- 3. Potencia en Muñeca (W) -->
      <div class="grid-cell" style="padding: 10px 12px;">
        <div class="card-title-sm" style="margin-bottom: 4px; font-size: 0.68rem;">Potencia Carrera</div>
        <div class="metric-number-md" style="font-size: 1.5rem; line-height: 1.1;">${gData.runningPowerWatts || 245}<span class="unit" style="font-size: 0.75rem;">W</span></div>
        <div style="margin-top: 4px; font-size: 0.68rem; color: var(--text-muted);">
          Sin pod externo
        </div>
      </div>

      <!-- 4. Body Battery & Siesta -->
      <div class="grid-cell" style="padding: 10px 12px;">
        <div class="card-title-sm" style="margin-bottom: 4px; font-size: 0.68rem;">Body Battery</div>
        <div class="metric-number-md" style="font-size: 1.5rem; line-height: 1.1;">${gData.bodyBattery}<span class="unit" style="font-size: 0.75rem;">%</span></div>
        <div style="margin-top: 4px; font-size: 0.68rem; color: var(--text-muted);">
          Siesta: +${gData.napMinutes || 25}min recarga
        </div>
      </div>

      <!-- 5. Sueño Polisomnografía -->
      <div class="grid-cell" style="padding: 10px 12px;">
        <div class="card-title-sm" style="margin-bottom: 4px; font-size: 0.68rem;">Polisomnografía</div>
        <div class="metric-number-md" style="font-size: 1.5rem; line-height: 1.1;">${gData.sleepScore}<span class="unit" style="font-size: 0.75rem;">/100</span></div>
        <div style="margin-top: 4px; font-size: 0.68rem; color: var(--text-muted);">
          Profundo: ${gData.sleepDeepHours}h
        </div>
      </div>

      <!-- 6. Gasto Activo (kcal) -->
      <div class="grid-cell" style="padding: 10px 12px;">
        <div class="card-title-sm" style="margin-bottom: 4px; font-size: 0.68rem;">Gasto Activo</div>
        <div class="metric-number-md" style="font-family: var(--font-mono); font-size: 1.5rem; line-height: 1.1;">${gData.activeCalories}<span class="unit" style="font-size: 0.75rem;">kcal</span></div>
        <div style="margin-top: 4px; font-size: 0.68rem; color: var(--text-muted);">
          Pasos: ${gData.stepsToday || 11420}
        </div>
      </div>
    </div>

    <!-- Calculadora y Semáforo de Déficit Dinámico -->
    <div class="card">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px;">
        <div>
          <div class="card-title-sm">Calculadora Energética Adaptada (${goalText})</div>
          <div style="font-size: 1.05rem; font-weight: 500;">
            Balance Diario: <span style="font-family: var(--font-mono); font-weight: 600; color: ${currentDeficit >= targetDeficit ? 'var(--accent-optimal)' : 'var(--text-main)'};">${currentDeficit} kcal</span>
            <span style="font-size: 0.8rem; font-weight: 400; color: var(--text-muted);"> (Meta: ${appState.userProfile.targetCalories} kcal)</span>
          </div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted);">Gasto Total Dinámico</div>
          <div style="font-family: var(--font-mono); font-weight: 600; font-size: 1.15rem;">${totalExpenditure} kcal</div>
        </div>
      </div>

      <div class="deficit-gauge-container">
        <div class="gauge-track">
          <div class="gauge-fill" style="width: ${deficitPct}%;"></div>
        </div>
        <div class="gauge-labels">
          <span>0 kcal</span>
          <span>Actual: ${currentIntake} kcal</span>
          <span>Gasto Total: ${totalExpenditure} kcal</span>
        </div>
      </div>
    </div>
  `;
}
