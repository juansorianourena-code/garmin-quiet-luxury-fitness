// FitExpert Studio - Main Application Controller
import { initCalorieCalculator } from './calorieCalculator.js';
import { initWorkoutPlanner } from './workoutPlanner.js';
import { initMealPlanner } from './mealPlanner.js';
import { initScienceHub } from './scienceHub.js';
import { initAITrainerChat } from './aiTrainer.js';

// New ES Modules
import { initRestTimer } from './restTimer.js';
import { initOneRepMaxCalc } from './oneRepMaxCalc.js';
import { initSupplementation } from './supplementation.js';
import { initHydrationTracker } from './hydrationTracker.js';
import { initBodyMeasurements } from './bodyMeasurements.js';
import { initWhatsAppExport } from './whatsappExport.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Setup Navigation Event Listeners
  try { setupTabNavigation(); } catch (err) { console.error(err); }

  // 2. Setup Auto Reload & Update System
  try { setupAutoReloadSystem(); } catch (err) { console.error(err); }

  // 3. Initialize Core Modules
  try { initCalorieCalculator(); } catch (err) { console.error(err); }
  try { initWorkoutPlanner(); } catch (err) { console.error(err); }
  try { initMealPlanner(); } catch (err) { console.error(err); }
  try { initScienceHub(); } catch (err) { console.error(err); }
  try { initAITrainerChat(); } catch (err) { console.error(err); }

  // 4. Initialize New Premium Features
  try { initRestTimer(); } catch (err) { console.error(err); }
  try { initOneRepMaxCalc(); } catch (err) { console.error(err); }
  try { initSupplementation(); } catch (err) { console.error(err); }
  try { initHydrationTracker(); } catch (err) { console.error(err); }
  try { initBodyMeasurements(); } catch (err) { console.error(err); }
  try { initWhatsAppExport(); } catch (err) { console.error(err); }

  // 5. Setup Data Actions
  try { setupDataActions(); } catch (err) { console.error(err); }
});

function setupTabNavigation() {
  const allNavBtns = document.querySelectorAll('.nav-btn, .mobile-nav-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  allNavBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetTabId = btn.getAttribute('data-tab');

      if (targetTabId === 'tab-ai-chat' || btn.id === 'btnMobileAIChat') {
        e.preventDefault();
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
}

function setupDataActions() {
  const btnExport = document.getElementById('btnExportData');
  if (btnExport) {
    btnExport.addEventListener('click', () => {
      const exportData = {
        profile: localStorage.getItem('fitexpert_profile'),
        workoutLogs: localStorage.getItem('fitexpert_workout_logs'),
        waterLogs: localStorage.getItem('fitexpert_water_ml'),
        bodyMeasurements: localStorage.getItem('fitexpert_body_measurements'),
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
}
