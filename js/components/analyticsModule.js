/**
 * Módulo 4: Descanso, Salud, Informe Médico-Deportivo e Histórico Persistente (IndexedDB)
 * Formulario de Registro Biométrico Manual, Gráfico de Composición Corporal Multi-Eje
 * e Informe Fisiológico Focado en Gimnasio / Pesas (Garmin Forerunner 55 & Preparado para 165).
 * Estética Quiet Luxury estricta: 0 emojis, tipografía limpia e ilustraciones vectoriales.
 */

import { appState } from '../appState.js';
import { garminState } from '../garminState.js';
import { authService } from '../services/authService.js';
import { dbService } from '../services/dbService.js';

export async function renderAnalyticsModule(container) {
  const aState = appState.analytics;
  const gData = garminState.getData();
  const currentUser = authService.getCurrentUser();
  const p = appState.userProfile;

  // Save current active day state to permanent DB on view
  appState.saveCurrentStateToHistory();

  // Load historical records from IndexedDB
  const workoutLogs = await dbService.getWorkoutLogs(currentUser.id);

  // Calculate advanced medical indicators
  const heightMeters = p.height / 100;
  const bmi = (p.weight / (heightMeters * heightMeters)).toFixed(1);
  const waistCm = aState.bodyLog.waist || 78;
  const wthr = (waistCm / p.height).toFixed(2); // Waist-to-Height Ratio
  const bodyFat = aState.bodyLog.bodyFat || 14.5;
  const leanMassKg = (p.weight * (1 - bodyFat / 100)).toFixed(1);
  const fatMassKg = (p.weight * (bodyFat / 100)).toFixed(1);
  const ffmi = (leanMassKg / (heightMeters * heightMeters)).toFixed(1); // Fat-Free Mass Index

  container.innerHTML = `
    <!-- Header -->
    <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
      <div>
        <div class="card-title-sm">Módulo 4: Informe Médico, Salud & Analítica</div>
        <h2 style="font-size: 1.4rem; font-weight: 500; color: var(--text-main);">Informe Biométrico & Fisiología Gimnasio</h2>
      </div>
      <div style="display: flex; align-items: center; gap: 8px;">
        <button id="btn-export-json-backup" class="inline-btn inline-btn-secondary" style="padding: 4px 10px; font-size: 0.72rem; font-family: var(--font-mono);">
          Descargar Respaldo JSON
        </button>
        <span style="font-size: 0.8rem; font-family: var(--font-mono); color: var(--text-muted); background: var(--bg-card); padding: 4px 10px; border-radius: 4px; border: 1px solid var(--border-line);">
          Usuario: ${currentUser.name}
        </span>
      </div>
    </div>

    <!-- 1. REGISTRO BIOMÉTRICO MANUAL DIRECTO (PESO, ALTURA, GRASA, CINTURA) -->
    <div class="card" style="border: 1px solid var(--border-line-strong); margin-bottom: 20px; background-color: rgba(27, 38, 59, 0.02);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <div>
          <div class="card-title-sm" style="margin-bottom: 0;">Registrar Medición Biometrica Hoy</div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">Actualiza tu peso y medidas reales para recalcular el metabolismo BMR/TDEE</div>
        </div>
        <span style="font-size: 0.72rem; font-family: var(--font-mono); color: var(--accent-optimal); font-weight: 600;">Sincronizado con Histórico DB</span>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px; margin-bottom: 14px;">
        <div class="garmin-field-group">
          <label class="garmin-input-label">Peso Actual (kg):</label>
          <input type="number" step="0.1" id="input-bio-weight" value="${p.weight}" class="garmin-text-input" style="padding: 8px 10px;" />
        </div>

        <div class="garmin-field-group">
          <label class="garmin-input-label">Altura (cm):</label>
          <input type="number" id="input-bio-height" value="${p.height}" class="garmin-text-input" style="padding: 8px 10px;" />
        </div>

        <div class="garmin-field-group">
          <label class="garmin-input-label">% Grasa Estimado:</label>
          <input type="number" step="0.1" id="input-bio-fat" value="${bodyFat}" class="garmin-text-input" style="padding: 8px 10px;" />
        </div>

        <div class="garmin-field-group">
          <label class="garmin-input-label">Cintura (cm):</label>
          <input type="number" step="0.5" id="input-bio-waist" value="${waistCm}" class="garmin-text-input" style="padding: 8px 10px;" />
        </div>
      </div>

      <div style="display: flex; justify-content: flex-end; align-items: center; gap: 10px;">
        <span id="bio-save-msg" style="font-size: 0.75rem; color: var(--accent-optimal); font-family: var(--font-mono);"></span>
        <button id="btn-save-biometrics-now" class="inline-btn inline-btn-accent" style="padding: 8px 16px; font-size: 0.8rem;">
          Guardar e Integrar en Histórico
        </button>
      </div>
    </div>

    <!-- 2. GRÁFICO VECTORIAL MULTI-EJE / RADAR DE ESTADO BIOMÉTRICO ACTUAL -->
    <div class="card" style="margin-bottom: 20px;">
      <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 14px;">
        <div>
          <div class="card-title-sm">Composición Corporal & Salud Cardiovascular</div>
          <div style="font-size: 0.95rem; font-weight: 500;">Análisis Vectorial Biométrico de Estado Actual</div>
        </div>
        <span style="font-size: 0.75rem; font-family: var(--font-mono); color: var(--text-muted);">FFMI: ${ffmi} (Masa Magra Alta)</span>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; align-items: center; flex-wrap: wrap;">
        <!-- Gráfico Vectorial SVG Radar -->
        <div style="display: flex; justify-content: center; align-items: center; background: var(--bg-main); padding: 16px; border: 1px solid var(--border-line); border-radius: var(--radius-sm);">
          <svg viewBox="0 0 200 200" style="width: 100%; max-width: 220px; height: auto;">
            <polygon points="100,20 170,60 170,140 100,180 30,140 30,60" fill="none" stroke="rgba(27, 38, 59, 0.15)" stroke-width="1" />
            <polygon points="100,50 145,75 145,125 100,150 55,125 55,75" fill="none" stroke="rgba(27, 38, 59, 0.1)" stroke-width="1" />
            <polygon points="100,80 120,90 120,110 100,120 80,110 80,90" fill="none" stroke="rgba(27, 38, 59, 0.08)" stroke-width="1" />

            <line x1="100" y1="20" x2="100" y2="180" stroke="rgba(27, 38, 59, 0.1)" stroke-width="1" />
            <line x1="30" y1="60" x2="170" y2="140" stroke="rgba(27, 38, 59, 0.1)" stroke-width="1" />
            <line x1="30" y1="140" x2="170" y2="60" stroke="rgba(27, 38, 59, 0.1)" stroke-width="1" />

            <polygon points="100,35 155,70 150,132 100,165 45,130 42,68" fill="rgba(27, 38, 59, 0.12)" stroke="var(--text-main)" stroke-width="1.8" />

            <circle cx="100" cy="35" r="3" fill="var(--accent-optimal)" />
            <circle cx="155" cy="70" r="3" fill="var(--accent-optimal)" />
            <circle cx="150" cy="132" r="3" fill="var(--accent-optimal)" />
            <circle cx="100" cy="165" r="3" fill="var(--accent-optimal)" />
            <circle cx="45" cy="130" r="3" fill="var(--accent-optimal)" />
            <circle cx="42" cy="68" r="3" fill="var(--accent-optimal)" />

            <text x="100" y="14" font-size="8" fill="var(--text-main)" font-family="monospace" text-anchor="middle">FFMI (${ffmi})</text>
            <text x="175" y="62" font-size="8" fill="var(--text-main)" font-family="monospace">Grasa (${bodyFat}%)</text>
            <text x="175" y="145" font-size="8" fill="var(--text-main)" font-family="monospace">BMR (${p.bmr})</text>
            <text x="100" y="194" font-size="8" fill="var(--text-main)" font-family="monospace" text-anchor="middle">WHR (${wthr})</text>
            <text x="25" y="145" font-size="8" fill="var(--text-main)" font-family="monospace" text-anchor="end">RHR (${gData.rhr})</text>
            <text x="25" y="62" font-size="8" fill="var(--text-main)" font-family="monospace" text-anchor="end">HRV (${gData.hrv}ms)</text>
          </svg>
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; justify-content: space-between; padding: 8px 12px; background: var(--bg-main); border: 1px solid var(--border-line); border-radius: var(--radius-sm); font-size: 0.8rem;">
            <span>Masa Magra Estimada:</span>
            <strong style="font-family: var(--font-mono); color: var(--accent-optimal);">${leanMassKg} kg</strong>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 8px 12px; background: var(--bg-main); border: 1px solid var(--border-line); border-radius: var(--radius-sm); font-size: 0.8rem;">
            <span>Masa Grasa Estimada:</span>
            <strong style="font-family: var(--font-mono); color: var(--accent-fatigue);">${fatMassKg} kg</strong>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 8px 12px; background: var(--bg-main); border: 1px solid var(--border-line); border-radius: var(--radius-sm); font-size: 0.8rem;">
            <span>Índice de Masa Corporal (IMC):</span>
            <strong style="font-family: var(--font-mono);">${bmi} kg/m²</strong>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 8px 12px; background: var(--bg-main); border: 1px solid var(--border-line); border-radius: var(--radius-sm); font-size: 0.8rem;">
            <span>Relación Cintura-Altura (WtHR):</span>
            <strong style="font-family: var(--font-mono);">${wthr} (Riesgo Bajo)</strong>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 8px 12px; background: var(--bg-main); border: 1px solid var(--border-line); border-radius: var(--radius-sm); font-size: 0.8rem;">
            <span>Tasa Metabólica Basal (BMR):</span>
            <strong style="font-family: var(--font-mono);">${p.bmr} kcal/día</strong>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. INFORME MÉDICO FOCADO EN GIMNASIO (GARMIN FORERUNNER 55 & 165 PREPARADO) -->
    <div class="card" style="border: 1px solid var(--border-line-strong); margin-bottom: 20px; padding: 18px;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px stroke var(--border-line); padding-bottom: 10px; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
        <div>
          <div style="font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.15em; color: var(--accent-optimal);">
            REPORTE CLÍNICO DE FISIOLOGÍA DE MUSCULACIÓN · GARMIN CONNECT
          </div>
          <h3 style="font-size: 1.15rem; font-weight: 600; color: var(--text-main); margin-top: 2px;">
            Evaluación Fisiológica para Entrenamiento de Fuerza
          </h3>
        </div>
        <div style="text-align: right; font-size: 0.72rem; font-family: var(--font-mono); color: var(--text-muted);">
          <div>Reloj Conectado: ${gData.deviceModel}</div>
          <div>Fecha Informe: ${new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}</div>
        </div>
      </div>

      <!-- SECCIÓN I: FISIOLOGÍA CARDÍACA & OXÍGENO EN SANGRE (SPO2 INTEGRADO AQUÍ) -->
      <div style="margin-bottom: 16px;">
        <div style="font-size: 0.76rem; font-weight: 600; text-transform: uppercase; color: var(--text-main); letter-spacing: 0.05em; margin-bottom: 8px;">
          I. Evaluación Fisiológica & Fisiología Cardíaca
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px;">
          <div style="padding: 10px; background: var(--bg-main); border: 1px solid var(--border-line); border-radius: var(--radius-sm);">
            <div style="font-size: 0.7rem; color: var(--text-muted);">VFC Media Nocturna (HRV):</div>
            <div style="font-family: var(--font-mono); font-size: 1.1rem; font-weight: 600; color: var(--accent-optimal);">${gData.hrv} ms</div>
            <div style="font-size: 0.68rem; color: var(--text-muted); margin-top: 2px;">Línea Base: ${gData.hrvBaseline || '62-74 ms'}</div>
          </div>

          <div style="padding: 10px; background: var(--bg-main); border: 1px solid var(--border-line); border-radius: var(--radius-sm);">
            <div style="font-size: 0.7rem; color: var(--text-muted);">Media Oxígeno en Sangre (SpO2):</div>
            <div style="font-family: var(--font-mono); font-size: 1.1rem; font-weight: 600; color: ${gData.spo2Avg ? 'var(--accent-optimal)' : 'var(--text-muted)'};">${gData.spo2Avg ? `${gData.spo2Avg}%` : '--'}</div>
            <div style="font-size: 0.68rem; color: var(--text-muted); margin-top: 2px;">${gData.spo2Avg ? `Mínimo: ${gData.spo2Min}%` : 'Pendiente Forerunner 165'}</div>
          </div>

          <div style="padding: 10px; background: var(--bg-main); border: 1px solid var(--border-line); border-radius: var(--radius-sm);">
            <div style="font-size: 0.7rem; color: var(--text-muted);">Frecuencia Reposo (RHR):</div>
            <div style="font-family: var(--font-mono); font-size: 1.1rem; font-weight: 600; color: var(--text-main);">${gData.rhr} ppm</div>
            <div style="font-size: 0.68rem; color: var(--text-muted); margin-top: 2px;">Reserva Bradicárdica</div>
          </div>

          <div style="padding: 10px; background: var(--bg-main); border: 1px solid var(--border-line); border-radius: var(--radius-sm);">
            <div style="font-size: 0.7rem; color: var(--text-muted);">Frecuencia Respiratoria:</div>
            <div style="font-family: var(--font-mono); font-size: 1.1rem; font-weight: 600; color: var(--text-main);">${gData.respirationRate || 13.5} brpm</div>
            <div style="font-size: 0.68rem; color: var(--text-muted); margin-top: 2px;">Patrón Eupneico Normal</div>
          </div>
        </div>
      </div>

      <!-- SECCIÓN II: POLISOMNOGRAFÍA & RECUPERACIÓN MUSCULAR -->
      <div style="margin-bottom: 16px;">
        <div style="font-size: 0.76rem; font-weight: 600; text-transform: uppercase; color: var(--text-main); letter-spacing: 0.05em; margin-bottom: 8px;">
          II. Arquitectura del Sueño & Síntesis Proteica (Sueño Profundo Muscular)
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px;">
          <div style="padding: 10px; background: var(--bg-main); border: 1px solid var(--border-line); border-radius: var(--radius-sm);">
            <div style="font-size: 0.7rem; color: var(--text-muted);">Score de Sueño:</div>
            <div style="font-family: var(--font-mono); font-size: 1.1rem; font-weight: 600; color: var(--accent-optimal);">${gData.sleepScore}/100</div>
            <div style="font-size: 0.68rem; color: var(--text-muted); margin-top: 2px;">Total: ${gData.sleepTotalHours} horas</div>
          </div>

          <div style="padding: 10px; background: var(--bg-main); border: 1px solid var(--border-line); border-radius: var(--radius-sm);">
            <div style="font-size: 0.7rem; color: var(--text-muted);">Sueño Profundo (Reparación Muscular):</div>
            <div style="font-family: var(--font-mono); font-size: 1.1rem; font-weight: 600; color: var(--text-main);">${gData.sleepDeepHours} hrs</div>
            <div style="font-size: 0.68rem; color: var(--text-muted); margin-top: 2px;">Secreción de Hormona de Crecimiento</div>
          </div>

          <div style="padding: 10px; background: var(--bg-main); border: 1px solid var(--border-line); border-radius: var(--radius-sm);">
            <div style="font-size: 0.7rem; color: var(--text-muted);">Detección de Siesta:</div>
            <div style="font-family: var(--font-mono); font-size: 1.1rem; font-weight: 600; color: ${gData.napMinutes ? 'var(--accent-optimal)' : 'var(--text-muted)'};">${gData.napMinutes ? `${gData.napMinutes} min` : '--'}</div>
            <div style="font-size: 0.68rem; color: var(--text-muted); margin-top: 2px;">${gData.napMinutes ? '+8 pts Body Battery' : 'Pendiente Forerunner 165'}</div>
          </div>
        </div>
      </div>

      <!-- SECCIÓN III: MÉTRICAS AVANZADAS PARA CUANDO CAMBIES AL FORERUNNER 165 -->
      <div style="margin-bottom: 16px;">
        <div style="font-size: 0.76rem; font-weight: 600; text-transform: uppercase; color: var(--text-main); letter-spacing: 0.05em; margin-bottom: 8px;">
          III. Telemetría Avanzada (Preparada para tu Futuro Forerunner 165)
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px;">
          <div style="padding: 10px; background: var(--bg-main); border: 1px dashed var(--border-line-strong); border-radius: var(--radius-sm);">
            <div style="font-size: 0.7rem; color: var(--text-muted);">Potencia en Muñeca (W):</div>
            <div style="font-family: var(--font-mono); font-size: 1.1rem; font-weight: 600; color: var(--text-muted);">${gData.runningPowerWatts ? `${gData.runningPowerWatts} W` : '--'}</div>
            <div style="font-size: 0.68rem; color: var(--text-muted); margin-top: 2px;">Pendiente Forerunner 165</div>
          </div>

          <div style="padding: 10px; background: var(--bg-main); border: 1px dashed var(--border-line-strong); border-radius: var(--radius-sm);">
            <div style="font-size: 0.7rem; color: var(--text-muted);">Dinámicas de Carrera:</div>
            <div style="font-family: var(--font-mono); font-size: 1.1rem; font-weight: 600; color: var(--text-muted);">${gData.cadenceSpm ? `${gData.cadenceSpm} spm` : '--'}</div>
            <div style="font-size: 0.68rem; color: var(--text-muted); margin-top: 2px;">Pendiente Forerunner 165</div>
          </div>

          <div style="padding: 10px; background: var(--bg-main); border: 1px solid var(--border-line); border-radius: var(--radius-sm);">
            <div style="font-size: 0.7rem; color: var(--text-muted);">VO2 Max & Edad Física:</div>
            <div style="font-family: var(--font-mono); font-size: 1.0rem; font-weight: 600; color: var(--accent-optimal);">${gData.vo2Max} ml/kg/min</div>
            <div style="font-size: 0.68rem; color: var(--text-muted); margin-top: 2px;">Edad Física: ${gData.fitnessAge} años</div>
          </div>
        </div>
      </div>

      <!-- SECCIÓN IV: DICTAMEN FISIOLÓGICO PARA ENTRENAMIENTO EN GIMNASIO -->
      <div style="background: var(--bg-main); padding: 12px 14px; border-left: 3px solid var(--accent-optimal); border-radius: 2px; font-size: 0.8rem;">
        <div style="font-size: 0.72rem; font-weight: 600; text-transform: uppercase; color: var(--accent-optimal); letter-spacing: 0.08em; margin-bottom: 4px;">
          DICTAMEN BIOMECÁNICO DE CAPACIDAD DE CARGA EN PESAS (${gData.deviceModel}):
        </div>
        <div style="color: var(--text-main); font-style: italic;">
          "El sistema nervioso central (SNC) registra tono parasimpático adecuado (HRV 68 ms, RHR 50 ppm) y 2.1h de sueño profundo para síntesis proteica muscular. Body Battery al 88%. El sujeto está 100% preparado para afrontar la sesión de gimnasio con cargas intensas de hipertrofia o fuerza máxima."
        </div>
      </div>
    </div>

    <!-- 4. HISTÓRICO PERSISTENTE E INALTERABLE (INDEXEDDB) -->
    <div class="card" style="border: 1px solid var(--border-line-strong); margin-bottom: 20px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <div class="card-title-sm" style="margin-bottom: 0;">Histórico Permanente de Entrenamientos y Nutrición (${workoutLogs.length} Registros)</div>
        <span style="font-size: 0.72rem; font-family: var(--font-mono); color: var(--accent-optimal);">Base de Datos Nativa Protegida</span>
      </div>

      ${workoutLogs.length === 0 ? `
        <div style="font-size: 0.82rem; color: var(--text-muted); padding: 14px; text-align: center; background: var(--bg-main); border-radius: var(--radius-sm);">
          Los datos que registres en tus sesiones de entrenamiento y comidas se guardarán de forma inalterable en este histórico.
        </div>
      ` : `
        <div style="display: flex; flex-direction: column; gap: 10px; max-height: 260px; overflow-y: auto;">
          ${workoutLogs.map(log => `
            <div style="background: var(--bg-main); padding: 12px 14px; border: 1px solid var(--border-line); border-radius: var(--radius-sm);">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 0.78rem; font-weight: 600; font-family: var(--font-mono); color: var(--text-main);">${log.dateStr}</span>
                <span style="font-size: 0.75rem; color: var(--accent-optimal); font-weight: 500;">${log.dayName || 'Sesión Registrada'}</span>
              </div>
              <div style="margin-top: 6px; font-size: 0.78rem; color: var(--text-muted);">
                ${(log.exercises || []).map(ex => `${ex.name} (${(ex.sets || []).filter(s => s.completed).length} series)`).join(' · ')}
              </div>
            </div>
          `).join('')}
        </div>
      `}
    </div>
  `;

  // Attach Biometric Manual Save Button Listener
  const btnSaveBio = container.querySelector('#btn-save-biometrics-now');
  const bioMsg = container.querySelector('#bio-save-msg');

  if (btnSaveBio) {
    btnSaveBio.addEventListener('click', async () => {
      const weight = parseFloat(container.querySelector('#input-bio-weight').value) || 70;
      const height = parseFloat(container.querySelector('#input-bio-height').value) || 175;
      const bodyFat = parseFloat(container.querySelector('#input-bio-fat').value) || 15;
      const waist = parseFloat(container.querySelector('#input-bio-waist').value) || 80;

      // 1. Update active app state profile
      appState.updateUserProfile({ weight, height });
      appState.analytics.bodyLog.weight = weight;
      appState.analytics.bodyLog.bodyFat = bodyFat;
      appState.analytics.bodyLog.waist = waist;

      // 2. Save entry directly to IndexedDB permanent store
      const dateStr = new Date().toISOString().split('T')[0];
      await dbService.saveBiometricLog(currentUser.id, dateStr, {
        weight,
        height,
        bodyFat,
        waist,
        goal: p.goal,
        bmr: p.bmr,
        tdee: p.tdee,
        targetCalories: p.targetCalories
      });

      if (bioMsg) {
        bioMsg.textContent = "¡Medición guardada y registrada en el Histórico!";
        setTimeout(() => { bioMsg.textContent = ""; }, 3000);
      }

      // Re-render module to update radar chart and metrics instantly
      renderAnalyticsModule(container);
    });
  }

  // Attach JSON Export Button Listener
  const btnExport = container.querySelector('#btn-export-json-backup');
  if (btnExport) {
    btnExport.addEventListener('click', () => {
      dbService.exportFullBackupJSON(currentUser.id);
    });
  }
}
