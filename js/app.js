/**
 * Main Application Router & Entry Point
 * Quiet Luxury Fitness, Nutrition & Garmin Connect Application
 */

import { garminState } from './garminState.js';
import { appState } from './appState.js';

import { renderDashboardModule } from './components/dashboardModule.js';
import { renderWorkoutModule } from './components/workoutModule.js';
import { renderNutritionModule } from './components/nutritionModule.js';
import { renderAnalyticsModule } from './components/analyticsModule.js';
import { renderGarminControlPanel } from './components/garminControlPanel.js';

import { syncGarminDirectClient } from './garminDirectClient.js';

import { authService } from './services/authService.js';

let currentTab = 'dashboard';

document.addEventListener('DOMContentLoaded', () => {
  // Clear legacy PWA caches if registered
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      for (let registration of registrations) {
        registration.unregister();
      }
    });
  }
  initApp();
});

function initApp() {
  // Navigation tabs click listeners
  const tabs = document.querySelectorAll('.nav-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      const targetTab = e.currentTarget.getAttribute('data-tab');
      switchTab(targetTab);
    });
  });

  // Subscribe to state updates
  garminState.subscribe(() => {
    renderCurrentModule();
    updateHeaderGarminBadge();
  });

  appState.subscribe(() => {
    renderCurrentModule();
  });

  // Header Refresh Button Ruleta listener & Hard Reload Trigger
  const btnHeaderRefresh = document.querySelector('#header-refresh-btn');
  const btnForceReload = document.querySelector('#btn-force-hard-reload');
  const headerSpinner = document.querySelector('#header-spinner-icon');

  const executeHardReload = async () => {
    if (headerSpinner) headerSpinner.classList.add('spinning');

    // 1. Clear all browser PWA/ServiceWorker caches
    if ('caches' in window) {
      try {
        const keys = await caches.keys();
        await Promise.all(keys.map(k => caches.delete(k)));
      } catch (e) {}
    }

    if ('serviceWorker' in navigator) {
      try {
        const regs = await navigator.serviceWorker.getRegistrations();
        for (let r of regs) await r.unregister();
      } catch (e) {}
    }

    // 2. Perform Garmin sync if credentials exist
    const savedEmail = localStorage.getItem('aura_garmin_email');
    const savedPass = localStorage.getItem('aura_garmin_pass');
    if (savedEmail && savedPass) {
      try { await syncGarminDirectClient(savedEmail, savedPass); } catch (err) {}
    }

    // 3. Force browser hard reload with timestamp cache-buster
    setTimeout(() => {
      window.location.href = window.location.pathname + '?v=' + Date.now();
    }, 300);
  };

  if (btnHeaderRefresh) {
    btnHeaderRefresh.addEventListener('click', executeHardReload);
  }
  if (btnForceReload) {
    btnForceReload.addEventListener('click', executeHardReload);
  }

  // Account Menu Accordion & Auth Handlers
  initAccountAuthUI();

  // Initial render
  switchTab('dashboard');
  renderGarminControlPanel(document.querySelector('#garmin-simulator-container'));
  updateHeaderGarminBadge();
  updateHeaderUserBadge();
}

function initAccountAuthUI() {
  const btnToggleAccount = document.querySelector('#btn-toggle-account-menu');
  const accountAccordion = document.querySelector('#account-menu-accordion');
  const btnLogin = document.querySelector('#btn-auth-login');
  const btnRegister = document.querySelector('#btn-auth-register');
  const feedbackMsg = document.querySelector('#auth-feedback-msg');

  if (btnToggleAccount && accountAccordion) {
    btnToggleAccount.addEventListener('click', () => {
      accountAccordion.classList.toggle('expanded');
      renderRegisteredAccountsList();
    });
  }

  if (btnLogin) {
    btnLogin.addEventListener('click', () => {
      const email = document.querySelector('#auth-input-email').value;
      const pass = document.querySelector('#auth-input-pass').value;
      try {
        const user = authService.login(email, pass);
        feedbackMsg.style.color = 'var(--accent-optimal)';
        feedbackMsg.textContent = `Sesión iniciada como ${user.name}`;
        updateHeaderUserBadge();
        renderRegisteredAccountsList();
        setTimeout(() => location.reload(), 500);
      } catch (err) {
        feedbackMsg.style.color = 'var(--accent-fatigue)';
        feedbackMsg.textContent = err.message;
      }
    });
  }

  if (btnRegister) {
    btnRegister.addEventListener('click', () => {
      const name = document.querySelector('#auth-input-name').value;
      const email = document.querySelector('#auth-input-email').value;
      const pass = document.querySelector('#auth-input-pass').value;
      try {
        const user = authService.register(email, pass, name);
        feedbackMsg.style.color = 'var(--accent-optimal)';
        feedbackMsg.textContent = `Cuenta creada e iniciada como ${user.name}`;
        updateHeaderUserBadge();
        renderRegisteredAccountsList();
        setTimeout(() => location.reload(), 500);
      } catch (err) {
        feedbackMsg.style.color = 'var(--accent-fatigue)';
        feedbackMsg.textContent = err.message;
      }
    });
  }

  renderRegisteredAccountsList();
}

function renderRegisteredAccountsList() {
  const container = document.querySelector('#accounts-registered-list');
  if (!container) return;

  const users = authService.getUsers();
  const current = authService.getCurrentUser();

  container.innerHTML = users.map(u => `
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 10px; background: var(--bg-card); border: 1px solid var(--border-line); border-radius: var(--radius-sm); font-size: 0.78rem;">
      <div>
        <strong>${u.name}</strong> <span style="color: var(--text-muted); font-size: 0.7rem;">(${u.email})</span>
        ${u.id === current.id ? `<span style="font-size: 0.65rem; padding: 1px 5px; background: var(--accent-optimal-light); color: var(--accent-optimal); border-radius: 3px; font-weight: 600; margin-left: 4px;">Activa</span>` : ''}
      </div>
      ${u.id !== current.id ? `
        <button class="inline-btn inline-btn-secondary btn-switch-user" data-email="${u.email}" data-pass="${u.passwordHash}" style="padding: 2px 6px; font-size: 0.7rem;">
          Conectar
        </button>
      ` : ''}
    </div>
  `).join('');

  container.querySelectorAll('.btn-switch-user').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const email = e.currentTarget.getAttribute('data-email');
      const pass = e.currentTarget.getAttribute('data-pass');
      authService.login(email, pass);
      updateHeaderUserBadge();
      location.reload();
    });
  });
}

function updateHeaderUserBadge() {
  const current = authService.getCurrentUser();
  const badgeName = document.querySelector('#header-user-name');
  if (badgeName && current) {
    badgeName.textContent = current.name.toUpperCase();
  }
}

function switchTab(tabName) {
  currentTab = tabName;

  // Update tab active classes
  document.querySelectorAll('.nav-tab').forEach(tab => {
    if (tab.getAttribute('data-tab') === tabName) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  // Update page visibility
  document.querySelectorAll('.module-page').forEach(page => {
    page.classList.remove('active');
  });

  const activePage = document.querySelector(`#${tabName}-module-page`);
  if (activePage) {
    activePage.classList.add('active');
  }

  // Scroll smoothly to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  renderCurrentModule();
}

function renderCurrentModule() {
  if (currentTab === 'dashboard') {
    const page = document.querySelector('#dashboard-module-page');
    if (page) renderDashboardModule(page, (target) => switchTab(target));
  } else if (currentTab === 'workout') {
    const page = document.querySelector('#workout-module-page');
    if (page) renderWorkoutModule(page);
  } else if (currentTab === 'nutrition') {
    const page = document.querySelector('#nutrition-module-page');
    if (page) renderNutritionModule(page);
  } else if (currentTab === 'analytics') {
    const page = document.querySelector('#analytics-module-page');
    if (page) renderAnalyticsModule(page);
  }
}

function updateHeaderGarminBadge() {
  const gData = garminState.getData();
  const badgeText = document.querySelector('#garmin-badge-text');
  if (badgeText) {
    badgeText.textContent = `Garmin Connect Live · Battery ${gData.bodyBattery}%`;
  }
}
