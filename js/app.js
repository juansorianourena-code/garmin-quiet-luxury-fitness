// FitExpert Studio - Main Application Controller
import { initCalorieCalculator } from './calorieCalculator.js';
import { initWorkoutPlanner } from './workoutPlanner.js';
import { initMealPlanner } from './mealPlanner.js';
import { initScienceHub } from './scienceHub.js';
import { initAITrainerChat } from './aiTrainer.js';

document.addEventListener('DOMContentLoaded', () => {
  // Setup Tab Navigation
  setupTabNavigation();

  // Setup Auto Reload on App Launch / Foreground & Top-Right Reload Button
  setupAutoReloadSystem();

  // Initialize Modules
  initCalorieCalculator((profileData) => {
    console.log('Profile updated:', profileData);
  });

  initWorkoutPlanner();
  initMealPlanner();
  initScienceHub();
  initAITrainerChat();

  // Export / Reset Data Actions
  setupDataActions();
});

function setupTabNavigation() {
  const allNavBtns = document.querySelectorAll('.nav-btn, .mobile-nav-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  allNavBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTabId = btn.getAttribute('data-tab');

      allNavBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(tc => tc.classList.remove('active'));

      document.querySelectorAll(`[data-tab="${targetTabId}"]`).forEach(b => b.classList.add('active'));

      const targetContent = document.getElementById(targetTabId);
      if (targetContent) {
        targetContent.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });
}

function setupAutoReloadSystem() {
  const btnReload = document.getElementById('btnForceReload');
  const icon = document.getElementById('reloadIcon');

  if (btnReload) {
    btnReload.addEventListener('click', () => {
      if (icon) icon.classList.add('fa-spin');

      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => caches.delete(name));
        });
      }

      setTimeout(() => {
        const cleanUrl = window.location.href.split('?')[0];
        window.location.href = `${cleanUrl}?v=${Date.now()}`;
      }, 350);
    });
  }

  let lastFocusedTime = Date.now();

  const handleForegroundCheck = () => {
    const timePassed = Date.now() - lastFocusedTime;
    if (timePassed > 30000) {
      lastFocusedTime = Date.now();
      const cleanUrl = window.location.href.split('?')[0];
      window.location.href = `${cleanUrl}?v=${Date.now()}`;
    }
  };

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      handleForegroundCheck();
    }
  });

  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      handleForegroundCheck();
    }
  });
}

function setupDataActions() {
  const btnExport = document.getElementById('btnExportData');
  const btnReset = document.getElementById('btnResetData');

  if (btnExport) {
    btnExport.addEventListener('click', () => {
      const exportData = {
        profile: localStorage.getItem('fitexpert_profile'),
        workoutLogs: localStorage.getItem('fitexpert_workout_logs'),
        exportDate: new Date().toISOString()
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `fitexpert_backup_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    });
  }

  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (confirm('¿Estás seguro de que deseas reiniciar todos los datos locales (rutinas y perfil calórico)?')) {
        localStorage.clear();
        window.location.reload();
      }
    });
  }
}
