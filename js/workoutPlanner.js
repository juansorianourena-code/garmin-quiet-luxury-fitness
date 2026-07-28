// FitExpert Studio - Workout Planner & Progressive Overload Tracker Module
import { EXERCISE_DATABASE, generatePersonalizedRoutine } from './exerciseLibrary.js';

let activeTemplate = null;
let activeDayIndex = 0;
let volumeChartInstance = null;

export function initWorkoutPlanner() {
  // Load user profile to generate personalized routine automatically
  loadPersonalizedRoutine();

  const savedLogs = getWorkoutLogs();
  setupWorkoutLogForm();
  renderVolumeChart(savedLogs);
  renderHistoryList(savedLogs);

  // Re-generate routine if user changes template button
  const btnTemplate = document.getElementById('btnSelectTemplate');
  if (btnTemplate) {
    btnTemplate.addEventListener('click', () => {
      loadPersonalizedRoutine();
    });
  }

  // Listen for profile changes from Calculator tab
  window.addEventListener('profileUpdated', () => {
    loadPersonalizedRoutine();
  });
}

export function loadPersonalizedRoutine() {
  let profile = null;
  const savedProfileStr = localStorage.getItem('fitexpert_profile');

  if (savedProfileStr) {
    try {
      profile = JSON.parse(savedProfileStr);
    } catch (e) {
      console.warn('Error reading profile', e);
    }
  }

  activeTemplate = generatePersonalizedRoutine(profile);
  activeDayIndex = 0;
  renderRoutineUI(profile);
}

function renderRoutineUI(profile) {
  if (!activeTemplate) return;

  const goalName = profile && profile.macroResults ? profile.macroResults.deficitOrSurplusLabel : 'Preservación Muscular & Pérdida de Grasa';
  const targetKcal = profile && profile.macroResults ? profile.macroResults.targetCalories : 2100;

  document.getElementById('currentRoutineName').innerHTML = `<i class="fa-solid fa-dumbbell"></i> ${activeTemplate.name}`;
  document.getElementById('routineDaysBadge').textContent = `${activeTemplate.days.length} Días / Personalizada`;

  // Render Day Tabs
  const dayTabsContainer = document.getElementById('workoutDayTabs');
  dayTabsContainer.innerHTML = '';

  activeTemplate.days.forEach((day, index) => {
    const btn = document.createElement('button');
    btn.className = `day-tab-btn ${index === activeDayIndex ? 'active' : ''}`;
    btn.textContent = day.dayName;
    btn.addEventListener('click', () => {
      activeDayIndex = index;
      renderRoutineUI(profile);
    });
    dayTabsContainer.appendChild(btn);
  });

  // Render Exercise Cards for Active Day
  const currentDay = activeTemplate.days[activeDayIndex];
  const listContainer = document.getElementById('exerciseListContainer');
  const selectLog = document.getElementById('logExerciseSelect');

  listContainer.innerHTML = `
    <div style="background: rgba(0,242,254,0.06); border: 1px solid rgba(0,242,254,0.25); padding: 12px 14px; border-radius: var(--radius-md); font-size: 12px; color: var(--text-main); margin-bottom: 14px;">
      <i class="fa-solid fa-graduation-cap" style="color:var(--accent-cyan);"></i> 
      <strong>Adaptado a tus métricas:</strong> Esta rutina ha sido modulada para tu objetivo de <strong>${goalName}</strong> (${targetKcal} kcal/día). ${activeTemplate.description}
    </div>
  `;
  selectLog.innerHTML = '';

  currentDay.exercises.forEach((item) => {
    const exData = EXERCISE_DATABASE.find(e => e.id === item.exerciseId);
    if (!exData) return;

    // Add option to log select dropdown
    const option = document.createElement('option');
    option.value = exData.name;
    option.textContent = exData.name;
    selectLog.appendChild(option);

    // Create Exercise Card
    const card = document.createElement('div');
    card.className = 'exercise-card';
    card.innerHTML = `
      <div class="ex-info">
        <h4>${exData.name}</h4>
        <div class="ex-meta">
          <span class="ex-target"><i class="fa-solid fa-crosshair"></i> ${exData.targetMuscles.join(', ')}</span>
          <span><i class="fa-solid fa-repeat"></i> ${item.sets} series x ${item.reps}</span>
          <span class="badge badge-purple">${item.rpe ? 'RPE Target: ' + item.rpe : 'RPE ' + exData.rpeTarget}</span>
        </div>
      </div>
      <button class="btn btn-outline btn-sm btn-detail" data-id="${exData.id}">
        <i class="fa-solid fa-circle-info"></i> Técnica
      </button>
    `;

    card.querySelector('.btn-detail').addEventListener('click', () => {
      openExerciseModal(exData);
    });

    listContainer.appendChild(card);
  });
}

function openExerciseModal(exData) {
  const modal = document.getElementById('exerciseModal');
  const content = document.getElementById('modalExerciseContent');

  content.innerHTML = `
    <h3 style="font-family: var(--font-heading); margin-bottom: 8px;"><i class="fa-solid fa-dumbbell"></i> ${exData.name}</h3>
    <div style="display:flex; gap:8px; margin-bottom: 16px;">
      <span class="badge badge-cyan">${exData.category}</span>
      <span class="badge badge-purple">${exData.mechanics}</span>
      <span class="badge badge-emerald">${exData.equipment}</span>
    </div>
    
    <div style="background: rgba(11,15,25,0.5); padding: 14px; border-radius: var(--radius-md); margin-bottom: 14px;">
      <h5 style="color: var(--accent-cyan); margin-bottom: 6px;"><i class="fa-solid fa-bullseye"></i> Músculos Objetivos:</h5>
      <p style="color: var(--text-main); font-size: 14px;">${exData.targetMuscles.join(', ')}</p>
    </div>

    <div style="background: rgba(11,15,25,0.5); padding: 14px; border-radius: var(--radius-md); margin-bottom: 14px;">
      <h5 style="color: var(--accent-emerald); margin-bottom: 6px;"><i class="fa-solid fa-lightbulb"></i> Claves Biomecánicas de Ejecución:</h5>
      <p style="color: var(--text-muted); font-size: 13px; line-height: 1.5;">${exData.cues}</p>
    </div>

    <div style="display:flex; justify-content:space-between; font-size: 13px; color: var(--text-muted);">
      <span><strong>Rango de Repeticiones:</strong> ${exData.repRange}</span>
      <span><strong>RPE Recomendado:</strong> ${exData.rpeTarget}</span>
    </div>
  `;

  modal.classList.add('active');

  const closeBtn = document.getElementById('btnCloseModal');
  closeBtn.onclick = () => modal.classList.remove('active');
  modal.onclick = (e) => {
    if (e.target === modal) modal.classList.remove('active');
  };
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

    const totalVolume = Math.round(sets * reps * weight);
    const dateStr = new Date().toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });

    const newEntry = {
      id: Date.now(),
      date: dateStr,
      exercise: exerciseName,
      sets, reps, weight, rpe, totalVolume
    };

    const logs = getWorkoutLogs();
    logs.push(newEntry);
    localStorage.setItem('fitexpert_workout_logs', JSON.stringify(logs));

    renderVolumeChart(logs);
    renderHistoryList(logs);
  });
}

function getWorkoutLogs() {
  const data = localStorage.getItem('fitexpert_workout_logs');
  return data ? JSON.parse(data) : [
    { id: 1, date: '15 Jul', exercise: 'Press de Banca', sets: 4, reps: 8, weight: 65, rpe: 8, totalVolume: 2080 },
    { id: 2, date: '18 Jul', exercise: 'Press de Banca', sets: 4, reps: 8, weight: 67.5, rpe: 8.5, totalVolume: 2160 },
    { id: 3, date: '22 Jul', exercise: 'Press de Banca', sets: 4, reps: 8, weight: 70, rpe: 8.5, totalVolume: 2240 }
  ];
}

function renderVolumeChart(logs) {
  const ctx = document.getElementById('volumeChart');
  if (!ctx) return;

  const recentLogs = logs.slice(-8);
  const labels = recentLogs.map(l => l.date);
  const volumes = recentLogs.map(l => l.totalVolume);

  if (volumeChartInstance) {
    volumeChartInstance.destroy();
  }

  volumeChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Volumen Total Cargado (kg)',
        data: volumes,
        borderColor: '#00f2fe',
        backgroundColor: 'rgba(0, 242, 254, 0.1)',
        fill: true,
        tension: 0.3,
        pointBackgroundColor: '#8b5cf6',
        pointRadius: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
        y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}

function renderHistoryList(logs) {
  const container = document.getElementById('logHistoryList');
  if (!container) return;

  container.innerHTML = '<h5 style="color:var(--text-muted); font-size:12px; margin: 14px 0 8px 0;">Historial Reciente:</h5>';
  const recent = logs.slice(-4).reverse();

  recent.forEach(log => {
    const item = document.createElement('div');
    item.style.cssText = 'display:flex; justify-content:space-between; font-size:12px; padding:6px 0; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);';
    item.innerHTML = `
      <span><strong>${log.exercise}</strong> (${log.sets}x${log.reps} @ ${log.weight}kg)</span>
      <span style="color:var(--accent-cyan); font-weight:600;">${log.totalVolume} kg (RPE ${log.rpe})</span>
    `;
    container.appendChild(item);
  });
}
