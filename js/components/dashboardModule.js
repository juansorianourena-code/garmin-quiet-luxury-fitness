/**
 * Módulo 1: Hub de Control Diario (Dashboard Principal)
 * 0 Nombres de Relojes, 0 Cuadros Vacíos. Matriz 2x2 Limpia Quiet Luxury.
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
        <div class="card-title-sm" style="margin-bottom: 2px;">Telemetría Hub & Recuperación</div>
        <span style="font-size: 0.72rem; font-family: var(--font-mono); color: var(--accent-optimal); font-weight: 600;">Monitoreo Activo</span>
      </div>
      <div class="header-status-message" style="font-weight: 500; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
        <span>${gData.statusMessage}</span>
        <span style="font-size: 0.82rem; font-family: var(--font-mono); color: var(--text-muted);">Recuperación: ${gData.recoveryHours}h</span>
      </div>
    </div>

    <!-- MATRIZ EN CUADRADO 2x2 (4 TARJETAS RELLENAS CON DATOS UTILES DE GIMNASIO) -->
    <div style="display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 8px !important; margin-bottom: 14px !important;">
      
      <!-- 1. Body Battery & Recuperación Muscular -->
      <div class="grid-cell accent-optimal-border" style="padding: 10px 12px;">
        <div class="card-title-sm" style="color: var(--accent-optimal); margin-bottom: 4px; font-size: 0.68rem;">Body Battery</div>
        <div class="metric-number-lg" style="color: var(--accent-optimal); font-size: 1.8rem; line-height: 1.1;">${gData.bodyBattery}<span class="unit" style="font-size: 0.75rem;">%</span></div>
        <div style="margin-top: 4px; font-size: 0.68rem; color: var(--text-muted); font-family: var(--font-mono);">
          Recuperación: ${gData.recoveryHours}h
        </div>
      </div>

      <!-- 2. Sueño & Reparación Física -->
      <div class="grid-cell accent-navy-border" style="padding: 10px 12px;">
        <div class="card-title-sm" style="margin-bottom: 4px; font-size: 0.68rem;">Sueño & Reparación</div>
        <div class="metric-number-lg" style="font-size: 1.8rem; line-height: 1.1;">${gData.sleepScore}<span class="unit" style="font-size: 0.75rem;">/100</span></div>
        <div style="margin-top: 4px; font-size: 0.68rem; color: var(--text-muted); font-family: var(--font-mono);">
          Profundo: ${gData.sleepDeepHours}h (${gData.sleepTotalHours}h total)
        </div>
      </div>

      <!-- 3. Estrés SNC & Variabilidad Cardíaca -->
      <div class="grid-cell" style="padding: 10px 12px;">
        <div class="card-title-sm" style="margin-bottom: 4px; font-size: 0.68rem;">Estrés Sistema Nervioso</div>
        <div class="metric-number-md" style="font-size: 1.5rem; line-height: 1.1;">${gData.stressLevel}<span class="unit" style="font-size: 0.75rem;">/100</span></div>
        <div style="margin-top: 4px; font-size: 0.68rem; color: var(--text-muted);">
          VFC: ${gData.hrv} ms · RHR ${gData.rhr} ppm
        </div>
      </div>

      <!-- 4. Gasto Activo en Entrenamientos -->
      <div class="grid-cell" style="padding: 10px 12px;">
        <div class="card-title-sm" style="margin-bottom: 4px; font-size: 0.68rem;">Gasto Activo</div>
        <div class="metric-number-md" style="font-family: var(--font-mono); font-size: 1.5rem; line-height: 1.1;">${gData.activeCalories}<span class="unit" style="font-size: 0.75rem;">kcal</span></div>
        <div style="margin-top: 4px; font-size: 0.68rem; color: var(--text-muted);">
          BMR Basal: ${gData.userBmr} kcal
        </div>
      </div>
    </div>

    <!-- Calculadora y Semáforo de Déficit Dinámico -->
    <div class="card">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px;">
        <div>
          <div class="card-title-sm">Calculadora Energética (${goalText})</div>
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
