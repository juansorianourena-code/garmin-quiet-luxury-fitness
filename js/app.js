// FitExpert Studio - Main Application Controller
import { initCalorieCalculator } from './calorieCalculator.js';
import { initWorkoutPlanner } from './workoutPlanner.js';
import { initMealPlanner } from './mealPlanner.js';
import { initScienceHub } from './scienceHub.js';
import { initAITrainerChat } from './aiTrainer.js';

// Premium Modules
import { initRestTimer } from './restTimer.js';
import { initOneRepMaxCalc } from './oneRepMaxCalc.js';
import { initSupplementation } from './supplementation.js';
import { initHydrationTracker } from './hydrationTracker.js';
import { initBodyMeasurements } from './bodyMeasurements.js';
import { initWhatsAppExport } from './whatsappExport.js';
import { initAuthStorage } from './authStorage.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Profile Security & Persistence
  try { initAuthStorage(); } catch (err) { console.error(err); }

  // 2. Setup Navigation Event Listeners
  try { setupTabNavigation(); } catch (err) { console.error(err); }

  // 3. Setup Auto Reload System
  try { setupAutoReloadSystem(); } catch (err) { console.error(err); }

  // 4. Initialize Core Modules
  try { initCalorieCalculator(); } catch (err) { console.error(err); }
  try { initWorkoutPlanner(); } catch (err) { console.error(err); }
  try { initMealPlanner(); } catch (err) { console.error(err); }
  try { initScienceHub(); } catch (err) { console.error(err); }
  try { initAITrainerChat(); } catch (err) { console.error(err); }

  // 5. Initialize Premium Modules
  try { initRestTimer(); } catch (err) { console.error(err); }
  try { initOneRepMaxCalc(); } catch (err) { console.error(err); }
  try { initSupplementation(); } catch (err) { console.error(err); }
  try { initHydrationTracker(); } catch (err) { console.error(err); }
  try { initBodyMeasurements(); } catch (err) { console.error(err); }
  try { initWhatsAppExport(); } catch (err) { console.error(err); }

  // 6. Setup Data Import/Export Actions & Global Print Handlers
  try { setupDataActions(); } catch (err) { console.error(err); }
});

function setupTabNavigation() {
  const allNavBtns = document.querySelectorAll('.nav-btn, .mobile-nav-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  const handleTabSwitch = (btn, e) => {
    const targetTabId = btn.getAttribute('data-tab');

    if (targetTabId === 'tab-ai-chat' || btn.id === 'btnMobileAIChat' || btn.id === 'btnOpenAIChatFromMeals') {
      const aiModal = document.getElementById('aiChatModal');
      if (aiModal) aiModal.classList.add('active');
      return;
    }

    if (!targetTabId) return;

    allNavBtns.forEach(b => b.classList.remove('active'));
    tabContents.forEach(tc => tc.classList.remove('active'));

    document.querySelectorAll(`[data-tab="${targetTabId}"]`).forEach(b => b.classList.add('active'));

    const targetContent = document.getElementById(targetTabId);
    if (targetContent) {
      targetContent.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  allNavBtns.forEach(btn => {
    btn.addEventListener('click', (e) => handleTabSwitch(btn, e));
  });

  const btnOpenAIChatFromMeals = document.getElementById('btnOpenAIChatFromMeals');
  if (btnOpenAIChatFromMeals) {
    btnOpenAIChatFromMeals.addEventListener('click', () => {
      const aiModal = document.getElementById('aiChatModal');
      if (aiModal) aiModal.classList.add('active');
    });
  }
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
      }, 300);
    });
  }
}

function setupDataActions() {
  const btnExport = document.getElementById('btnExportData');
  const btnImport = document.getElementById('btnImportData');
  const fileInput = document.getElementById('importFileInput');
  const btnCloseAuth = document.getElementById('btnCloseAuthModal');

  const btnPrintRoutine = document.getElementById('btnPrintRoutineBtn');
  const btnPrintMenu = document.getElementById('btnPrintMenuBtn');

  if (btnPrintRoutine) {
    btnPrintRoutine.addEventListener('click', () => window.print());
  }
  if (btnPrintMenu) {
    btnPrintMenu.addEventListener('click', () => window.print());
  }

  if (btnCloseAuth) {
    btnCloseAuth.addEventListener('click', () => {
      const modal = document.getElementById('authModal');
      if (modal) modal.classList.remove('active');
    });
  }

  if (btnExport) {
    btnExport.addEventListener('click', () => {
      const exportData = {
        profile: localStorage.getItem('fitexpert_profile'),
        workoutLogs: localStorage.getItem('fitexpert_workout_logs'),
        waterLogs: localStorage.getItem('fitexpert_water_ml'),
        bodyMeasurements: localStorage.getItem('fitexpert_body_measurements'),
        allergies: localStorage.getItem('fitexpert_allergies'),
        authPass: localStorage.getItem('fitexpert_auth_pass'),
        authHint: localStorage.getItem('fitexpert_auth_hint'),
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

  if (btnImport && fileInput) {
    btnImport.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target.result);
          if (imported.profile) localStorage.setItem('fitexpert_profile', imported.profile);
          if (imported.workoutLogs) localStorage.setItem('fitexpert_workout_logs', imported.workoutLogs);
          if (imported.waterLogs) localStorage.setItem('fitexpert_water_ml', imported.waterLogs);
          if (imported.bodyMeasurements) localStorage.setItem('fitexpert_body_measurements', imported.bodyMeasurements);
          if (imported.allergies) localStorage.setItem('fitexpert_allergies', imported.allergies);
          if (imported.authPass) localStorage.setItem('fitexpert_auth_pass', imported.authPass);
          if (imported.authHint) localStorage.setItem('fitexpert_auth_hint', imported.authHint);

          alert('¡Copia de seguridad restaurada al 100%! La aplicación se recargará ahora.');
          window.location.reload();
        } catch (err) {
          alert('El archivo seleccionado no es un archivo de copia de seguridad válido de FitExpert.');
        }
      };
      reader.readAsText(file);
    });
  }
}
