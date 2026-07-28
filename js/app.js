// FitExpert Studio - Main Application Controller
import { initCalorieCalculator } from './calorieCalculator.js';
import { initWorkoutPlanner } from './workoutPlanner.js';
import { initMealPlanner } from './mealPlanner.js';
import { initScienceHub } from './scienceHub.js';
import { initAITrainerChat } from './aiTrainer.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Setup Navigation Event Listeners
  try {
    setupTabNavigation();
  } catch (err) {
    console.error('Error setting up navigation:', err);
  }

  // 2. Setup Auto Reload & Update System
  try {
    setupAutoReloadSystem();
  } catch (err) {
    console.error('Error setting up reload system:', err);
  }

  // 3. Initialize Modules Safely
  try {
    initCalorieCalculator((profileData) => {
      console.log('Profile updated:', profileData);
    });
  } catch (err) {
    console.error('Error initCalorieCalculator:', err);
  }

  try {
    initWorkoutPlanner();
  } catch (err) {
    console.error('Error initWorkoutPlanner:', err);
  }

  try {
    initMealPlanner();
  } catch (err) {
    console.error('Error initMealPlanner:', err);
  }

  try {
    initScienceHub();
  } catch (err) {
    console.error('Error initScienceHub:', err);
  }

  try {
    initAITrainerChat();
  } catch (err) {
    console.error('Error initAITrainerChat:', err);
  }

  // 4. Setup Data Actions
  try {
    setupDataActions();
  } catch (err) {
    console.error('Error setting up data actions:', err);
  }
});

function setupTabNavigation() {
  const allNavBtns = document.querySelectorAll('.nav-btn, .mobile-nav-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  allNavBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetTabId = btn.getAttribute('data-tab');

      // If button triggers AI Chat Modal directly
      if (targetTabId === 'tab-ai-chat' || btn.id === 'btnMobileAIChat') {
        e.preventDefault();
        const aiModal = document.getElementById('aiChatModal');
        if (aiModal) aiModal.classList.add('active');
        return;
      }

      if (!targetTabId) return;

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
