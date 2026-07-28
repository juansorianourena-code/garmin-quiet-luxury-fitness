/**
 * Módulo 2: Entrenamiento Adaptativo y Diario de Fuerza
 * Incorpora:
 * - Selección de Días / Frecuencia Semanal Personalizada (3, 4, 5, 6 días).
 * - Asistente IA Entrenador Experto en Biomecánica (Chat inline para solicitar cambios de ejercicios).
 * - Función para cambiar TODAS las rutinas de la semana o SOLO LA RUTA DE UN DÍA.
 * - Sustitución de ejercicios por acordeón inline (0 Modales/Pop-ups).
 * - Autorregulación Garmin (-20% volumen por fatiga).
 * Quiet Luxury estricto: 0 emojis.
 */

import { garminState } from '../garminState.js';
import { appState } from '../appState.js';

let activeRestTimer = null;
let restTimeRemaining = 0;

export function renderWorkoutModule(container) {
  const gData = garminState.getData();
  const program = appState.workoutProgram;
  const currentDay = appState.getCurrentDay();

  // Auto-regulation set factor
  const targetSetsCount = gData.isHighFatigue ? 2 : 3;

  const p = appState.userProfile;

  const goalInfo = {
    fat_loss: {
      title: "Perder Grasa / Adelgazar",
      desc: "Series de alta densidad metabólica, descansos de 60s y balance en déficit."
    },
    recomp: {
      title: "Recomposición Corporal",
      desc: "Enfoque equilibrado en hipertrofia (8-12 reps), descansos de 75-90s y mantenimiento."
    },
    muscle_gain: {
      title: "Ganar Masa Muscular (Volumen Limpio)",
      desc: "Sobrecarga progresiva (6-10 reps), descansos de 90-120s y superávit anabólico."
    }
  }[p.goal] || { title: "Objetivo Personalizado", desc: "Programa adaptado." };

  container.innerHTML = `
    <!-- Header & Frequency Selector -->
    <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px; margin-bottom: 12px;">
      <div>
        <div class="card-title-sm">Módulo de Entrenamiento Adaptativo & Programación IA</div>
        <h2 style="font-size: 1.4rem; font-weight: 500; color: var(--text-main);">${currentDay.dayName}</h2>
      </div>

      <!-- Acciones de Cambio de Rutina -->
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <button id="btn-toggle-change-one-day" class="inline-btn inline-btn-secondary" style="padding: 6px 12px; font-size: 0.78rem;">
          Cambiar Solo Este Día
        </button>
        <button id="btn-toggle-change-all-days" class="inline-btn inline-btn-secondary" style="padding: 6px 12px; font-size: 0.78rem;">
          Cambiar Todas las Rutinas
        </button>
      </div>
    </div>

    <!-- BANNER DE ADAPTACIÓN SEGÚN OBJETIVO BIOMÉTRICO (ADELGAZAR / VOLUMEN / RECOMP) -->
    <div style="background: var(--bg-card); padding: 10px 14px; border: 1px solid var(--border-line-strong); border-radius: var(--radius-sm); margin-bottom: 14px; font-size: 0.8rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
      <div>
        <strong>Enfoque Adaptado:</strong> <span style="color: var(--accent-optimal); font-weight: 600;">${goalInfo.title}</span>
        <div style="font-size: 0.74rem; color: var(--text-muted); margin-top: 1px;">${goalInfo.desc}</div>
      </div>
      <span style="font-size: 0.72rem; font-family: var(--font-mono); color: var(--text-muted); background: var(--bg-main); padding: 3px 8px; border-radius: 4px; border: 1px solid var(--border-line);">
        Target: ${p.targetCalories} kcal
      </span>
    </div>

    <!-- SELECCIÓN DE FRECUENCIA DE DÍAS Y DURACIÓN DE SESIÓN -->
    <div class="card" style="padding: 12px 14px; margin-bottom: 16px;">
      <div style="font-size: 0.75rem; font-weight: 600; text-transform: uppercase; color: var(--text-main); margin-bottom: 8px; letter-spacing: 0.05em;">
        Personalización de Sesión: Frecuencia, Duración & N° Ejercicios
      </div>

      <!-- 1. Frecuencia Semanal -->
      <div style="font-size: 0.72rem; color: var(--text-muted); margin-bottom: 4px;">Frecuencia Semanal:</div>
      <div class="days-frequency-selector" style="margin-bottom: 10px;">
        <div class="day-pill btn-set-freq ${program.daysCount === 3 ? 'active' : ''}" data-freq="3">3 Días / Sem</div>
        <div class="day-pill btn-set-freq ${program.daysCount === 4 ? 'active' : ''}" data-freq="4">4 Días / Sem</div>
        <div class="day-pill btn-set-freq ${program.daysCount === 5 ? 'active' : ''}" data-freq="5">5 Días / Sem</div>
        <div class="day-pill btn-set-freq ${program.daysCount === 6 ? 'active' : ''}" data-freq="6">6 Días / Sem</div>
      </div>

      <!-- 2. Duración deseada -->
      <div style="font-size: 0.72rem; color: var(--text-muted); margin-bottom: 4px;">Duración Estimada de la Sesión:</div>
      <div class="days-frequency-selector" style="margin-bottom: 10px;">
        ${[30, 45, 60, 75, 90].map(mins => `
          <div class="day-pill btn-set-duration ${program.targetDurationMinutes === mins ? 'active' : ''}" data-duration="${mins}">${mins} min</div>
        `).join('')}
      </div>

      <!-- 3. Número de Ejercicios por Sesión -->
      <div style="font-size: 0.72rem; color: var(--text-muted); margin-bottom: 4px;">Número de Ejercicios por Sesión:</div>
      <div class="days-frequency-selector" style="margin-bottom: 4px;">
        ${[3, 4, 5, 6, 7, 8].map(count => `
          <div class="day-pill btn-set-ex-count ${(currentDay.exercises || []).length === count ? 'active' : ''}" data-ex-count="${count}">${count} Ejercicios</div>
        `).join('')}
      </div>
    </div>

    <!-- ACORDEÓN INLINE: CAMBIAR SOLO ESTE DÍA (0 POP-UPS) -->
    <div id="accordion-change-one-day" class="accordion-wrapper">
      <div class="accordion-content" style="margin-bottom: 16px;">
        <div class="card-title-sm">Sustituir Rutina de ${currentDay.dayName}</div>
        <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 10px;">Selecciona el nuevo enfoque únicamente para el día activo:</div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 8px;">
          <button class="inline-btn inline-btn-secondary btn-apply-one-day" data-name="Día ${program.activeDayIndex + 1}: Torso A (Fuerza Horizontal)" data-pattern="Empuje / Tirón Torso" style="font-size: 0.78rem;">
            Torso A (Fuerza Horizontal)
          </button>
          <button class="inline-btn inline-btn-secondary btn-apply-one-day" data-name="Día ${program.activeDayIndex + 1}: Pecho & Tríceps Hipertrofia" data-pattern="Empuje Pecho / Tríceps" style="font-size: 0.78rem;">
            Pecho & Tríceps Especialización
          </button>
          <button class="inline-btn inline-btn-secondary btn-apply-one-day" data-name="Día ${program.activeDayIndex + 1}: Espalda & Bíceps Especialización" data-pattern="Tirón Espalda / Bíceps" style="font-size: 0.78rem;">
            Espalda & Bíceps Especialización
          </button>
          <button class="inline-btn inline-btn-secondary btn-apply-one-day" data-name="Día ${program.activeDayIndex + 1}: Pierna & Glúteos Anabólico" data-pattern="Cuádriceps / Cadera" style="font-size: 0.78rem;">
            Pierna & Glúteos Anabólico
          </button>
        </div>
      </div>
    </div>

    <!-- ACORDEÓN INLINE: CAMBIAR TODAS LAS RUTINAS / SPLIT COMPLETO (0 POP-UPS) -->
    <div id="accordion-change-all-days" class="accordion-wrapper">
      <div class="accordion-content" style="margin-bottom: 16px;">
        <div class="card-title-sm">Re-programar Todas las Rutinas de la Semana</div>
        <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 10px;">Selecciona la plantilla experta para reestructurar toda tu semana:</div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 8px;">
          ${program.availableSplits.map(split => `
            <button class="inline-btn inline-btn-secondary btn-apply-split" data-split-id="${split.id}" style="font-size: 0.78rem; text-align: left; display: block;">
              <strong>${split.name}</strong>
            </button>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- PÍLDORAS NAVEGADORAS DE DÍAS (DÍA 1, DÍA 2, DÍA 3...) -->
    <div style="display: flex; gap: 8px; margin-bottom: 20px; overflow-x: auto; padding-bottom: 4px;">
      ${program.days.map((day, idx) => `
        <button class="day-pill btn-switch-day ${program.activeDayIndex === idx ? 'active' : ''}" data-day-idx="${idx}">
          ${day.dayName.split(':')[0]} ${day.isRestDay ? ' (Descanso)' : ''}
        </button>
      `).join('')}
    </div>

    <!-- ASISTENTE IA EXPERTO EN ENTRENAMIENTO & BIOMECÁNICA (CHAT INLINE SIN POP-UPS) -->
    <div class="ai-coach-box">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="font-size: 0.85rem; font-weight: 600; color: var(--accent-optimal); letter-spacing: 0.05em;">
            ASISTENTE IA ENTRENADOR EXPERTO
          </div>
        </div>
        <span style="font-size: 0.72rem; color: var(--text-muted);">Escribe cualquier solicitud biomecánica</span>
      </div>

      <div class="ai-chat-history">
        ${appState.aiCoachHistory.map(msg => `
          <div class="ai-msg ${msg.role}">${msg.text}</div>
        `).join('')}
      </div>

      <div class="ai-input-row">
        <input type="text" id="ai-user-input" placeholder="Ej: Tengo molestia en hombro, cámbiame el ejercicio..." />
        <button id="btn-send-ai" class="inline-btn inline-btn-accent" style="padding: 6px 14px; font-size: 0.8rem;">
          Consultar IA
        </button>
      </div>
    </div>

    <!-- Banner de Autorregulación Garmin -->
    ${gData.isHighFatigue ? `
      <div class="autoreg-banner">
        <div class="autoreg-text">
          <div class="autoreg-title">Autorregulación Garmin Activada (-20% Volumen)</div>
          Debido a tu elevado nivel de fatiga / bajo descanso (Body Battery: ${gData.bodyBattery}%, Estrés: ${gData.stressLevel}), hemos ajustado automáticamente el volumen objetivo a ${targetSetsCount} series efectivas por ejercicio para optimizar tu recuperación.
        </div>
      </div>
    ` : ''}

    <!-- Rest Timer Inline Box -->
    <div id="rest-timer-box" class="rest-timer-inline" style="display: ${activeRestTimer ? 'flex' : 'none'};">
      <span>Temporizador de Descanso Inter-Series</span>
      <div style="display: flex; align-items: center; gap: 12px;">
        <span id="rest-time-display" class="rest-timer-time">01:30</span>
        <button id="btn-stop-timer" class="inline-btn inline-btn-secondary" style="padding: 4px 8px; font-size: 0.75rem;">Detener</button>
      </div>
    </div>

    <!-- DIA DE DESCANSO / O LISTA DE EJERCICIOS DEL DÍA SELECCIONADO -->
    ${currentDay.isRestDay ? `
      <div class="card" style="text-align: center; padding: 36px 20px;">
        <h3 style="font-size: 1.2rem; font-weight: 500; color: var(--text-main);">Día de Descanso & Recuperación Biológica</h3>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 6px; max-width: 460px; margin-left: auto; margin-right: auto;">
          Garmin indica ${gData.recoveryHours} horas estimadas de recuperación. Aprovecha para realizar movilidad suave, caminatas o estiramientos.
        </p>
      </div>
    ` : `
      <div class="exercises-container">
        ${(currentDay.exercises || []).map((ex, index) => {
          const displayedSets = ex.sets.slice(0, targetSetsCount);
          return `
            <div class="card exercise-card" data-ex-id="${ex.id}" style="position: relative;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; flex-wrap: wrap; gap: 10px;">
                <div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 0.75rem; font-family: var(--font-mono); color: var(--text-muted);">#0${index + 1}</span>
                    <h3 style="font-size: 1.15rem; font-weight: 500; color: var(--text-main);">${ex.name}</h3>
                    ${ex.isSubstituted ? `<span style="font-size: 0.7rem; padding: 2px 6px; background: var(--accent-optimal-light); color: var(--accent-optimal); border-radius: 3px; font-weight: 600;">Sustituido</span>` : ''}
                  </div>
                  <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 2px;">
                    Biomecánica: <strong>${ex.category}</strong> · ${ex.targetMuscle}
                  </div>
                </div>

                <div style="display: flex; gap: 8px;">
                  ${ex.isSubstituted ? `
                    <button class="inline-btn inline-btn-secondary btn-restore-ex" data-ex-id="${ex.id}" style="padding: 6px 12px; font-size: 0.78rem;">
                      Restaurar Original
                    </button>
                  ` : ''}
                  <button class="inline-btn inline-btn-secondary btn-toggle-substitute" data-ex-id="${ex.id}" style="padding: 6px 12px; font-size: 0.78rem;">
                    Cambiar ejercicio
                  </button>
                </div>
              </div>

              <!-- ACORDEÓN INLINE VERTICAL (0 POP-UPS) DE SUSTITUCIÓN -->
              <div id="accordion-${ex.id}" class="accordion-wrapper">
                <div class="accordion-content">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <div class="card-title-sm" style="margin-bottom: 0;">Sustituciones Biomecánicas Disponibles</div>
                    <span style="font-size: 0.75rem; color: var(--text-muted);">Mismo grupo muscular y patrón</span>
                  </div>
                  <div class="substitute-options-list">
                    ${ex.alternatives.map(alt => `
                      <div class="substitute-item btn-select-substitute" data-ex-id="${ex.id}" data-alt-name="${alt.name}">
                        <div>
                          <div class="substitute-name">${alt.name}</div>
                          <div class="substitute-meta">${alt.note}</div>
                        </div>
                        <span class="inline-btn inline-btn-secondary" style="padding: 4px 10px; font-size: 0.75rem;">Seleccionar</span>
                      </div>
                    `).join('')}
                  </div>
                </div>
              </div>

              <!-- TABLA DE LOG DE SERIES EN VIVO -->
              <div style="margin-top: 14px; border-top: 1px solid var(--border-line); padding-top: 10px;">
                <div class="set-row" style="font-size: 0.75rem; font-weight: 600; text-transform: uppercase; color: var(--text-muted); border-bottom: 1px solid var(--border-line); padding-bottom: 6px;">
                  <span>Serie</span>
                  <span style="text-align: center;">Carga (kg)</span>
                  <span style="text-align: center;">Reps</span>
                  <span style="text-align: center;">RPE (6-10)</span>
                  <span style="text-align: center;">Estado</span>
                </div>

                ${displayedSets.map(set => `
                  <div class="set-row">
                    <span style="font-family: var(--font-mono); font-weight: 600; color: var(--text-main);">#0${set.setNum}</span>
                    <div>
                      <input type="number" class="input-set-field" data-ex-id="${ex.id}" data-set-num="${set.setNum}" data-field="weight" value="${set.weight}" step="0.5" />
                    </div>
                    <div>
                      <input type="number" class="input-set-field" data-ex-id="${ex.id}" data-set-num="${set.setNum}" data-field="reps" value="${set.reps}" />
                    </div>
                    <div>
                      <input type="number" class="input-set-field" data-ex-id="${ex.id}" data-set-num="${set.setNum}" data-field="rpe" value="${set.rpe}" step="0.5" min="6" max="10" />
                    </div>
                    <div style="text-align: center;">
                      <button class="btn-toggle-set inline-btn ${set.completed ? 'inline-btn-accent' : 'inline-btn-secondary'}" data-ex-id="${ex.id}" data-set-num="${set.setNum}" style="padding: 4px 8px; font-size: 0.75rem;">
                        ${set.completed ? 'COMPLETADO' : 'PENDIENTE'}
                      </button>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `}
  `;

  // Attach Frequency Pills Click Listeners
  container.querySelectorAll('.btn-set-freq').forEach(pill => {
    pill.addEventListener('click', (e) => {
      const freq = parseInt(e.currentTarget.getAttribute('data-freq'));
      appState.setDaysFrequency(freq);
      renderWorkoutModule(container);
    });
  });

  // Attach Duration Pills Click Listeners
  container.querySelectorAll('.btn-set-duration').forEach(pill => {
    pill.addEventListener('click', (e) => {
      const duration = parseInt(e.currentTarget.getAttribute('data-duration'));
      appState.setTargetDuration(duration);
      renderWorkoutModule(container);
    });
  });

  // Attach Exercise Count Pills Click Listeners
  container.querySelectorAll('.btn-set-ex-count').forEach(pill => {
    pill.addEventListener('click', (e) => {
      const count = parseInt(e.currentTarget.getAttribute('data-ex-count'));
      appState.setTargetExerciseCount(count);
      renderWorkoutModule(container);
    });
  });

  // Attach Switch Active Day Listeners
  container.querySelectorAll('.btn-switch-day').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const dayIdx = parseInt(e.currentTarget.getAttribute('data-day-idx'));
      appState.setActiveDay(dayIdx);
      renderWorkoutModule(container);
    });
  });

  // Toggle Accordion: Change One Day
  const btnToggleOneDay = container.querySelector('#btn-toggle-change-one-day');
  if (btnToggleOneDay) {
    btnToggleOneDay.addEventListener('click', () => {
      const acc = container.querySelector('#accordion-change-one-day');
      if (acc) acc.classList.toggle('expanded');
    });
  }

  // Apply One Day Routine Swap
  container.querySelectorAll('.btn-apply-one-day').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const name = e.currentTarget.getAttribute('data-name');
      const pattern = e.currentTarget.getAttribute('data-pattern');
      appState.swapCurrentDayRoutine(name, pattern);
      renderWorkoutModule(container);
    });
  });

  // Toggle Accordion: Change All Days
  const btnToggleAllDays = container.querySelector('#btn-toggle-change-all-days');
  if (btnToggleAllDays) {
    btnToggleAllDays.addEventListener('click', () => {
      const acc = container.querySelector('#accordion-change-all-days');
      if (acc) acc.classList.toggle('expanded');
    });
  }

  // Apply All Days Split Swap
  container.querySelectorAll('.btn-apply-split').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const splitId = e.currentTarget.getAttribute('data-split-id');
      appState.applySplitPreset(splitId);
      renderWorkoutModule(container);
    });
  });

  // AI Assistant Chat Submit
  const btnSendAi = container.querySelector('#btn-send-ai');
  const aiInput = container.querySelector('#ai-user-input');

  const handleAiSend = () => {
    const txt = aiInput.value.trim();
    if (txt) {
      appState.sendAiPrompt(txt);
      renderWorkoutModule(container);
    }
  };

  if (btnSendAi && aiInput) {
    btnSendAi.addEventListener('click', handleAiSend);
    aiInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleAiSend();
    });
  }

  // Exercise Accordion Substitution Toggles
  container.querySelectorAll('.btn-toggle-substitute').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const exId = e.currentTarget.getAttribute('data-ex-id');
      const accordion = container.querySelector(`#accordion-${exId}`);
      if (accordion) accordion.classList.toggle('expanded');
    });
  });

  // Select Substitute Option
  container.querySelectorAll('.btn-select-substitute').forEach(item => {
    item.addEventListener('click', (e) => {
      const exId = e.currentTarget.getAttribute('data-ex-id');
      const altName = e.currentTarget.getAttribute('data-alt-name');
      appState.substituteExercise(exId, altName);
      renderWorkoutModule(container);
    });
  });

  // Restore Original Exercise
  container.querySelectorAll('.btn-restore-ex').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const exId = e.currentTarget.getAttribute('data-ex-id');
      appState.resetExerciseSubstitution(exId);
      renderWorkoutModule(container);
    });
  });

  // Set Inputs Change Listener
  container.querySelectorAll('.input-set-field').forEach(input => {
    input.addEventListener('change', (e) => {
      const exId = e.currentTarget.getAttribute('data-ex-id');
      const setNum = parseInt(e.currentTarget.getAttribute('data-set-num'));
      const field = e.currentTarget.getAttribute('data-field');
      const val = parseFloat(e.currentTarget.value);
      appState.updateSet(exId, setNum, field, val);
    });
  });

  // Set Completion Toggle & Timer Trigger
  container.querySelectorAll('.btn-toggle-set').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const exId = e.currentTarget.getAttribute('data-ex-id');
      const setNum = parseInt(e.currentTarget.getAttribute('data-set-num'));
      appState.toggleSetCompleted(exId, setNum);
      
      startRestTimer(90, container);
      renderWorkoutModule(container);
    });
  });

  // Stop Timer Button
  const btnStop = container.querySelector('#btn-stop-timer');
  if (btnStop) {
    btnStop.addEventListener('click', () => {
      stopRestTimer();
      const timerBox = container.querySelector('#rest-timer-box');
      if (timerBox) timerBox.style.display = 'none';
    });
  }
}

function startRestTimer(seconds, container) {
  stopRestTimer();
  restTimeRemaining = seconds;
  updateTimerDisplay(container);

  activeRestTimer = setInterval(() => {
    restTimeRemaining--;
    if (restTimeRemaining <= 0) {
      stopRestTimer();
      const timerBox = document.querySelector('#rest-timer-box');
      if (timerBox) timerBox.style.display = 'none';
    } else {
      updateTimerDisplay(document.querySelector('#workout-module-page'));
    }
  }, 1000);
}

function stopRestTimer() {
  if (activeRestTimer) {
    clearInterval(activeRestTimer);
    activeRestTimer = null;
  }
}

function updateTimerDisplay(container) {
  if (!container) return;
  const display = container.querySelector('#rest-time-display');
  const timerBox = container.querySelector('#rest-timer-box');
  if (display && timerBox) {
    timerBox.style.display = 'flex';
    const mins = Math.floor(restTimeRemaining / 60);
    const secs = restTimeRemaining % 60;
    display.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}
