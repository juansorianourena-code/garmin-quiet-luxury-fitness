// FitExpert Studio - Workout & Progress Tracker Engine
import { WORKOUT_TEMPLATES, generatePersonalizedRoutine } from './exerciseLibrary.js';
import { startRestTimer } from './restTimer.js';

let activeDayIndex = 0;
let currentRoutine = null;

export function initWorkoutPlanner() {
  loadPersonalizedRoutine();
  setupWorkoutLogForm();
  renderWorkoutProgressChart();
  renderWorkoutLogHistory();
}

export function loadPersonalizedRoutine() {
  const savedProfileStr = localStorage.getItem('fitexpert_profile');
  let profile = null;
  if (savedProfileStr) {
    try { profile = JSON.parse(savedProfileStr); } catch (e) {}
  }

  currentRoutine = generatePersonalizedRoutine(profile);
  renderRoutineUI();
}

function renderRoutineUI() {
  if (!currentRoutine) return;

  const nameElem = document.getElementById('currentRoutineName');
  const badgeElem = document.getElementById('routineDaysBadge');
  const tabsContainer = document.getElementById('workoutDayTabs');

  if (nameElem) nameElem.innerHTML = `<i class="fa-solid fa-dumbbell"></i> ${currentRoutine.name}`;
  if (badgeElem) badgeElem.textContent = `${currentRoutine.days.length} Días / Sem`;

  if (tabsContainer) {
    tabsContainer.innerHTML = '';
    currentRoutine.days.forEach((day, idx) => {
      const btn = document.createElement('button');
      btn.className = `day-tab-btn ${idx === activeDayIndex ? 'active' : ''}`;
      btn.textContent = day.dayName;
      btn.addEventListener('click', () => {
        activeDayIndex = idx;
        renderRoutineUI();
      });
      tabsContainer.appendChild(btn);
    });
  }

  renderActiveDayExercises();
  populateExerciseSelectDropdown();
}

function renderActiveDayExercises() {
  const container = document.getElementById('exerciseListContainer');
  if (!container || !currentRoutine) return;

  container.innerHTML = '';
  const activeDay = currentRoutine.days[activeDayIndex];

  if (!activeDay) return;

  activeDay.exercises.forEach(ex => {
    const card = document.createElement('div');
    card.className = 'exercise-card';
    card.innerHTML = `
      <div class="ex-info" style="width:100%;">
        <div style="display:flex; justify-content:space-between; align-items:center; width:100%;">
          <h4>${ex.name}</h4>
          <span class="badge badge-cyan">${ex.targetMuscle}</span>
        </div>
        <div class="ex-meta mt-1">
          <span><i class="fa-solid fa-layer-group"></i> ${ex.defaultSets} Series x ${ex.defaultReps} Reps</span>
          <span><i class="fa-solid fa-gauge-high"></i> RPE Objetivo: ${ex.rpeTarget}</span>
        </div>
      </div>
      <button class="btn btn-outline btn-sm btn-detail btn-block mt-2" data-exid="${ex.exerciseId}">
        <i class="fa-solid fa-circle-info"></i> Ver Guía de Ejecución & Biomecánica
      </button>
    `;

    const detailBtn = card.querySelector('.btn-detail');
    detailBtn.addEventListener('click', () => {
      openExerciseDetailModal(ex);
    });

    container.appendChild(card);
  });
}

function openExerciseDetailModal(exercise) {
  const modal = document.getElementById('exerciseModal');
  const content = document.getElementById('modalExerciseContent');
  if (!modal || !content) return;

  content.innerHTML = `
    <h3 style="font-family:var(--font-heading); color:var(--text-main); margin-bottom:8px;">
      <i class="fa-solid fa-dumbbell" style="color:var(--accent-cyan);"></i> ${exercise.name}
    </h3>
    <span class="badge badge-purple mb-3">${exercise.targetMuscle}</span>

    <div style="background:rgba(11,15,25,0.6); padding:12px; border-radius:var(--radius-md); margin-bottom:12px;">
      <h4 style="font-size:12px; color:var(--accent-emerald); font-weight:700; margin-bottom:4px;">Biomecánica & Técnica</h4>
      <p style="font-size:12px; color:var(--text-muted); line-height:1.4;">${exercise.biomechanics || 'Mantén el core activado y ejecuta un rango completo de movimiento sin impulso.'}</p>
    </div>

    <div style="background:rgba(11,15,25,0.6); padding:12px; border-radius:var(--radius-md);">
      <h4 style="font-size:12px; color:var(--accent-amber); font-weight:700; margin-bottom:4px;">Errores Comunes a Evitar</h4>
      <ul style="font-size:12px; color:var(--text-muted); padding-left:16px;">
        ${exercise.tips ? exercise.tips.map(t => `<li>${t}</li>`).join('') : '<li>Evitar encoger hombros</li><li>Controlar la fase excéntrica</li>'}
      </ul>
    </div>
  `;

  modal.classList.add('active');
}

function populateExerciseSelectDropdown() {
  const select = document.getElementById('logExerciseSelect');
  if (!select || !currentRoutine) return;

  select.innerHTML = '';
  currentRoutine.days.forEach(day => {
    day.exercises.forEach(ex => {
      const opt = document.createElement('option');
      opt.value = ex.name;
      opt.textContent = `${ex.name} (${day.dayName})`;
      select.appendChild(opt);
    });
  });
}

function setupWorkoutLogForm() {
  const form = document.getElementById('workoutLogForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const exerciseName = document.getElementById('logExerciseSelect').value;
    const sets = parseInt(document.getElementById('logSets').value);
    const reps = parseInt(document.getElementById('logReps').value);
    const weight = parseFloat(document.getElementById('logWeight').value);
    const rpe = parseFloat(document.getElementById('logRPE').value);

    const volume = sets * reps * weight;

    const newLog = {
      id: Date.now(),
      date: new Date().toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
      exerciseName,
      sets, reps, weight, rpe, volume
    };

    saveWorkoutLog(newLog);
    renderWorkoutLogHistory();
    renderWorkoutProgressChart();

    // Trigger Rest Timer automatically (90 seconds)
    startRestTimer(90);
  });
}

function saveWorkoutLog(logEntry) {
  const savedLogsStr = localStorage.getItem('fitexpert_workout_logs');
  const logs = savedLogsStr ? JSON.parse(savedLogsStr) : [];
  logs.unshift(logEntry);
  localStorage.setItem('fitexpert_workout_logs', JSON.stringify(logs));
}

function renderWorkoutLogHistory() {
  const container = document.getElementById('logHistoryList');
  if (!container) return;

  const savedLogsStr = localStorage.getItem('fitexpert_workout_logs');
  const logs = savedLogsStr ? JSON.parse(savedLogsStr) : [];

  if (logs.length === 0) {
    container.innerHTML = `<p style="font-size:11px; color:var(--text-muted); text-align:center; padding:10px;">Sin registros guardados aún.</p>`;
    return;
  }

  container.innerHTML = logs.slice(0, 4).map(l => `
    <div style="background:rgba(11,15,25,0.5); padding:6px 8px; border-radius:var(--radius-sm); border:1px solid var(--border-color); margin-bottom:4px; font-size:11px; display:flex; justify-content:space-between; align-items:center;">
      <div>
        <strong style="color:var(--text-main); display:block;">${l.exerciseName}</strong>
        <span style="color:var(--text-muted); font-size:10px;">${l.sets}x${l.reps} @ ${l.weight}kg (RPE ${l.rpe})</span>
      </div>
      <span class="badge badge-cyan">${l.volume} kg vol</span>
    </div>
  `).join('');
}

function renderWorkoutProgressChart() {
  const canvas = document.getElementById('volumeChart');
  if (!canvas) return;

  const savedLogsStr = localStorage.getItem('fitexpert_workout_logs');
  const logs = savedLogsStr ? JSON.parse(savedLogsStr) : [];

  const chartData = logs.slice(0, 7).reverse();
  const labels = chartData.map(l => l.date);
  const dataPoints = chartData.map(l => l.volume);

  if (window.volumeChartInstance) window.volumeChartInstance.destroy();

  const ctx = canvas.getContext('2d');
  window.volumeChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels.length ? labels : ['Sesión 1', 'Sesión 2', 'Sesión 3'],
      datasets: [{
        label: 'Volumen Total (kg)',
        data: dataPoints.length ? dataPoints : [1200, 1450, 1600],
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.15)',
        fill: true,
        tension: 0.35,
        borderWidth: 2,
        pointBackgroundColor: '#8b5cf6'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: '#94a3b8', font: { size: 9 } }, grid: { display: false } },
        y: { ticks: { color: '#94a3b8', font: { size: 9 } }, grid: { color: 'rgba(255,255,255,0.05)' } }
      }
    }
  });
}
