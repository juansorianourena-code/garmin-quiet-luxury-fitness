// FitExpert Studio - Main Application Controller
import { initCalorieCalculator } from './calorieCalculator.js';
import { initWorkoutPlanner } from './workoutPlanner.js';
import { initMealPlanner } from './mealPlanner.js';
import { initScienceHub } from './scienceHub.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Header & Mobile Navigation Tabs
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
  const desktopNav = document.getElementById('mainNav');
  const mobileNav = document.getElementById('mobileNav');

  const allNavBtns = document.querySelectorAll('.nav-btn, .mobile-nav-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  allNavBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTabId = btn.getAttribute('data-tab');

      // Deactivate all buttons across header & mobile nav
      allNavBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(tc => tc.classList.remove('active'));

      // Activate all matching tab buttons for targetTabId
      document.querySelectorAll(`[data-tab="${targetTabId}"]`).forEach(b => b.classList.add('active'));

      // Activate target tab section
      const targetContent = document.getElementById(targetTabId);
      if (targetContent) {
        targetContent.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
