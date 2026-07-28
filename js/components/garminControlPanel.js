/**
 * Panel de Control y Sincronizador Real Garmin Connect (Móvil & Web Universal)
 * Persistencia en localStorage: Guarda email y contraseña automáticamente
 * y ejecuta la sincronización limpia sin bloqueos.
 */

import { garminState } from '../garminState.js';
import { syncGarminDirectClient } from '../garminDirectClient.js';

export function renderGarminControlPanel(container) {
  const gData = garminState.getData();

  // Cargar credenciales guardadas de localStorage
  const savedEmail = localStorage.getItem('aura_garmin_email') || gData.email || '';
  const savedPass = localStorage.getItem('aura_garmin_pass') || '';

  container.innerHTML = `
    <div class="simulator-panel">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
        <div>
          <span style="font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; color: var(--text-main);">
            ⚡ Conector Automático Garmin Connect Real
          </span>
          <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 2px;">
            ${gData.isRealSync 
              ? `<span style="color: var(--accent-optimal); font-weight: 600;">✓ Cuenta Vinculada & Sincronizada (${gData.lastSyncTime || 'Hoy'})</span>`
              : `Ingresa tu cuenta una sola vez. Se guardará de forma segura en tu móvil.`}
          </div>
        </div>
        <button id="btn-toggle-sim-collapse" class="inline-btn inline-btn-secondary" style="padding: 4px 10px; font-size: 0.72rem;">
          Desplegar / Configurar
        </button>
      </div>

      <div id="sim-controls-body" class="accordion-wrapper ${savedEmail ? '' : 'expanded'}" style="margin-top: 14px;">
        <!-- FORMULARIO DE ACCESO Y AUTO-SYNC (ADAPTADO A MÓVIL) -->
        <div style="background: var(--bg-main); padding: 16px; border: 1px solid var(--border-line-strong); border-radius: var(--radius-md); margin-bottom: 16px;">
          <div style="font-size: 0.8rem; font-weight: 600; text-transform: uppercase; color: var(--text-main); margin-bottom: 4px;">
            🔑 Tu Cuenta de Garmin Connect
          </div>
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 12px;">
            Ingresa tu email y contraseña una vez. Se guardarán en tu móvil para sincronizar con la ruleta 🔄:
          </div>

          <div class="garmin-login-container">
            <div class="garmin-field-group">
              <label class="garmin-input-label">Email de Garmin Connect:</label>
              <input type="email" id="garmin-email-input" placeholder="ejemplo@correo.com" class="garmin-text-input" value="${savedEmail}" />
            </div>

            <div class="garmin-field-group">
              <label class="garmin-input-label">Contraseña de Garmin Connect:</label>
              <input type="password" id="garmin-pass-input" placeholder="••••••••••••" class="garmin-text-input" value="${savedPass}" />
            </div>

            <button id="btn-sync-real-garmin" class="inline-btn inline-btn-accent garmin-sync-btn">
              <svg id="sync-spinner-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
              <span>Vincular y Sincronizar Ahora</span>
            </button>
          </div>
          <div id="sync-status-msg" style="font-size: 0.78rem; margin-top: 10px; font-weight: 500; text-align: center;"></div>
        </div>

        <!-- SIMULADOR EN VIVO POR DESLIZADORES -->
        <div class="card-title-sm" style="margin-bottom: 8px;">Prueba Manual por Deslizadores (Simulador)</div>
        <div class="sim-row">
          <div class="sim-field">
            <label>Body Battery: <strong id="val-bb">${gData.bodyBattery}%</strong></label>
            <input type="range" id="input-bb" min="10" max="100" value="${gData.bodyBattery}" />
          </div>
          <div class="sim-field">
            <label>Estrés Promedio: <strong id="val-stress">${gData.stressLevel}/100</strong></label>
            <input type="range" id="input-stress" min="10" max="95" value="${gData.stressLevel}" />
          </div>
          <div class="sim-field">
            <label>Puntuación Sueño: <strong id="val-sleep">${gData.sleepScore}/100</strong></label>
            <input type="range" id="input-sleep" min="30" max="98" value="${gData.sleepScore}" />
          </div>
          <div class="sim-field">
            <label>Calorías Activas: <strong id="val-active">${gData.activeCalories} kcal</strong></label>
            <input type="range" id="input-active" min="100" max="1500" step="50" value="${gData.activeCalories}" />
          </div>
        </div>
      </div>
    </div>
  `;

  // Attach Execute Sync Function (Universal Mobile Client)
  const btnSync = container.querySelector('#btn-sync-real-garmin');
  const spinnerIcon = container.querySelector('#sync-spinner-icon');
  const statusMsg = container.querySelector('#sync-status-msg');

  const executeSync = async () => {
    const email = container.querySelector('#garmin-email-input').value.trim();
    const password = container.querySelector('#garmin-pass-input').value.trim();

    if (!email || !password) {
      statusMsg.style.color = 'var(--accent-fatigue)';
      statusMsg.textContent = '⚠️ Por favor ingresa tu email y contraseña para vincular.';
      return;
    }

    if (spinnerIcon) spinnerIcon.classList.add('spinning');
    statusMsg.style.color = 'var(--text-main)';
    statusMsg.textContent = '🔄 Conectando con Garmin y sincronizando métricas...';

    try {
      await syncGarminDirectClient(email, password);
      statusMsg.style.color = 'var(--accent-optimal)';
      statusMsg.textContent = '✅ ¡Sincronizado con éxito con Garmin Connect!';
    } catch (err) {
      statusMsg.style.color = 'var(--accent-fatigue)';
      statusMsg.textContent = '⚠️ Error en la sincronización. Revisa tu usuario y contraseña.';
    } finally {
      if (spinnerIcon) spinnerIcon.classList.remove('spinning');
    }
  };

  if (btnSync) {
    btnSync.addEventListener('click', executeSync);
  }

  // Attach Range Input Listeners
  const inputBb = container.querySelector('#input-bb');
  const inputStress = container.querySelector('#input-stress');
  const inputSleep = container.querySelector('#input-sleep');
  const inputActive = container.querySelector('#input-active');

  const update = () => {
    garminState.updateMetrics({
      bodyBattery: parseInt(inputBb.value),
      stressLevel: parseInt(inputStress.value),
      sleepScore: parseInt(inputSleep.value),
      activeCalories: parseInt(inputActive.value)
    });

    container.querySelector('#val-bb').textContent = inputBb.value + '%';
    container.querySelector('#val-stress').textContent = inputStress.value + '/100';
    container.querySelector('#val-sleep').textContent = inputSleep.value + '/100';
    container.querySelector('#val-active').textContent = inputActive.value + ' kcal';
  };

  inputBb.addEventListener('input', update);
  inputStress.addEventListener('input', update);
  inputSleep.addEventListener('input', update);
  inputActive.addEventListener('input', update);

  const btnToggle = container.querySelector('#btn-toggle-sim-collapse');
  if (btnToggle) {
    btnToggle.addEventListener('click', () => {
      const body = container.querySelector('#sim-controls-body');
      if (body) body.classList.toggle('expanded');
    });
  }
}
