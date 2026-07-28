// FitExpert Studio - Main Application Controller
import { initCalorieCalculator } from './calorieCalculator.js';
import { initWorkoutPlanner } from './workoutPlanner.js';
import { initMealPlanner } from './mealPlanner.js';
import { initScienceHub } from './scienceHub.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Header Navigation Tabs
  setupTabNavigation();

  // Initialize Modules
  initCalorieCalculator((profileData) => {
    console.log('Profile updated:', profileData);
  });

  initWorkoutPlanner();
  initMealPlanner();
  initScienceHub();

  // Export / Reset Data Actions
  setupDataActions();
});

function setupTabNavigation() {
  const navContainer = document.getElementById('mainNav');
  if (!navContainer) return;

  const navBtns = navContainer.querySelectorAll('.nav-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTabId = btn.getAttribute('data-tab');

      navBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(tc => tc.classList.remove('active'));

      btn.classList.add('active');
      const targetContent = document.getElementById(targetTabId);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
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
