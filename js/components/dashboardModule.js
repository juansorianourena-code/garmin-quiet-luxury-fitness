/**
 * Módulo 1: Hub de Control Diario (Dashboard Principal)
 * Cuadrante 2x2 Estricto (4 Tarjetas en Matriz Cuadrada)
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

  container.innerHTML = `
    <!-- Synthesized Status Header Card -->
    <div class="card" style="border-left: 4px solid ${gData.isHighFatigue ? 'var(--accent-fatigue)' : 'var(--accent-optimal)'}; margin-bottom: 12px;">
      <div class="card-title-sm" style="margin-bottom: 4px;">Sintetizador de Estado Garmin</div>
      <div class="header-status-message" style="font-weight: 500; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
        <span>${gData.statusMessage}</span>
        <span style="font-size: 0.85rem; font-family: var(--font-mono); color: var(--text-muted);">Recuperación: ${gData.recoveryHours}h</span>
      </div>
    </div>

    <!-- MATRIZ DE SALUD EN CUADRADO 2x2 (2 COLUMNAS X 2 FILAS GARANTIZADO) -->
    <div style="display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 8px !important; margin-bottom: 14px !important; width: 100% !important; box-sizing: border-box !important;">
      
      <!-- 1. Sueño (Arriba Izquierda) -->
      <div class="grid-cell accent-optimal-border" style="padding: 10px 12px !important; margin: 0 !important; box-sizing: border-box !important; display: flex !important; flex-direction: column !important; justify-content: space-between !important;">
        <div>
          <div class="card-title-sm" style="color: var(--accent-optimal); margin-bottom: 4px; font-size: 0.68rem;">Sueño (Garmin)</div>
          <div class="metric-number-lg" style="color: var(--accent-optimal); font-size: 1.8rem; line-height: 1.1;">${gData.sleepScore}<span class="unit" style="font-size: 0.75rem;">/100</span></div>
        </div>
        <div style="margin-top: 6px; font-size: 0.7rem; color: var(--text-muted); font-family: var(--font-mono); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
          Total: ${gData.sleepTotalHours}h (REM ${gData.sleepRemHours}h)
        </div>
      </div>

      <!-- 2. Estrés (Arriba Derecha) -->
      <div class="grid-cell accent-navy-border" style="padding: 10px 12px !important; margin: 0 !important; box-sizing: border-box !important; display: flex !important; flex-direction: column !important; justify-content: space-between !important;">
        <div>
          <div class="card-title-sm" style="margin-bottom: 4px; font-size: 0.68rem;">Estrés Promedio</div>
          <div class="metric-number-lg" style="font-size: 1.8rem; line-height: 1.1;">${gData.stressLevel}<span class="unit" style="font-size: 0.75rem;">/100</span></div>
        </div>
        <div style="margin-top: 6px; font-size: 0.7rem; color: var(--text-muted); font-family: var(--font-mono); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
          HRV: ${gData.hrv}ms · RHR ${gData.rhr}
        </div>
      </div>

      <!-- 3. Body Battery (Abajo Izquierda) -->
      <div class="grid-cell" style="padding: 10px 12px !important; margin: 0 !important; box-sizing: border-box !important; display: flex !important; flex-direction: column !important; justify-content: space-between !important;">
        <div>
          <div class="card-title-sm" style="margin-bottom: 4px; font-size: 0.68rem;">Body Battery</div>
          <div class="metric-number-md" style="font-size: 1.5rem; line-height: 1.1;">${gData.bodyBattery}<span class="unit" style="font-size: 0.75rem;">%</span></div>
        </div>
        <div style="margin-top: 6px; font-size: 0.7rem; color: var(--text-muted);">
          Energía residual
        </div>
      </div>

      <!-- 4. Gasto Activo (Abajo Derecha) -->
      <div class="grid-cell" style="padding: 10px 12px !important; margin: 0 !important; box-sizing: border-box !important; display: flex !important; flex-direction: column !important; justify-content: space-between !important;">
        <div>
          <div class="card-title-sm" style="margin-bottom: 4px; font-size: 0.68rem;">Gasto Activo</div>
          <div class="metric-number-md" style="font-family: var(--font-mono); font-size: 1.5rem; line-height: 1.1;">${gData.activeCalories}<span class="unit" style="font-size: 0.75rem;">kcal</span></div>
        </div>
        <div style="margin-top: 6px; font-size: 0.7rem; color: var(--text-muted);">
          BMR: ${gData.userBmr} kcal
        </div>
      </div>
    </div>

    <!-- Calculadora y Semáforo de Déficit Dinámico -->
    <div class="card">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px;">
        <div>
          <div class="card-title-sm">Calculadora Energética Adaptada (${appState.userProfile.goal === 'fat_loss' ? '📉 Déficit' : appState.userProfile.goal === 'muscle_gain' ? '📈 Superávit' : '⚖️ Mantenimiento'})</div>
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
          <div class="gauge-fill ${currentDeficit < 0 ? 'warning' : ''}" style="width: ${deficitPct}%;"></div>
        </div>
        <div class="deficit-stats-row">
          <span>Ingesta Registrada: <strong class="deficit-val">${currentIntake} kcal</strong></span>
          <span>Presupuesto Consumo Recomendado: <strong class="deficit-val">${appState.userProfile.targetCalories} kcal</strong></span>
        </div>
      </div>
    </div>

    <!-- Accesos Rápido Inline -->
    <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 10px;">
      <button id="btn-quick-workout" class="inline-btn" style="flex: 1;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6.5 6.5h11M6.5 17.5h11M4 12h16M2 7v10M22 7v10"/></svg>
        Iniciar Entrenamiento del Día
      </button>

      <button id="btn-quick-food" class="inline-btn inline-btn-secondary" style="flex: 1;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
        Registrar Comida
      </button>
    </div>
  `;

  // Inline transition events without popups
  container.querySelector('#btn-quick-workout').addEventListener('click', () => {
    onNavigate('workout');
  });

  container.querySelector('#btn-quick-food').addEventListener('click', () => {
    onNavigate('nutrition');
  });
}
