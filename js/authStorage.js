// FitExpert Studio - Secure Profile Authentication, Lock Screen & Zero-Loss Data Persistence Engine

export function initAuthStorage() {
  requestSafariPersistentStorage();
  setupAuthUI();
  checkAppLockState();
}

/**
 * Requests browser persistent storage to prevent Safari / Chrome from purging LocalStorage during low disk cleanup.
 */
async function requestSafariPersistentStorage() {
  if (navigator.storage && navigator.storage.persist) {
    const isPersisted = await navigator.storage.persisted();
    if (!isPersisted) {
      await navigator.storage.persist();
    }
  }
}

function setupAuthUI() {
  const modal = document.getElementById('authModal');
  const lockScreen = document.getElementById('appLockScreen');

  const btnSetupPass = document.getElementById('btnSetupPassword');
  const btnLockNow = document.getElementById('btnLockAppNow');
  const formSetup = document.getElementById('setupPasswordForm');
  const formUnlock = document.getElementById('unlockAppForm');

  if (btnSetupPass) {
    btnSetupPass.addEventListener('click', () => {
      if (modal) modal.classList.add('active');
    });
  }

  if (btnLockNow) {
    btnLockNow.addEventListener('click', () => {
      lockApp();
    });
  }

  if (formSetup) {
    formSetup.addEventListener('submit', (e) => {
      e.preventDefault();
      const pass = document.getElementById('newPassInput').value.trim();
      const hint = document.getElementById('newPassHintInput').value.trim();

      if (pass.length < 3) {
        alert('La contraseña debe tener al menos 3 caracteres.');
        return;
      }

      localStorage.setItem('fitexpert_auth_pass', hashPassword(pass));
      localStorage.setItem('fitexpert_auth_hint', hint);
      
      alert('¡Perfil protegido con contraseña correctamente! Tu app ahora requerirá esta clave para ingresar.');
      if (modal) modal.classList.remove('active');
      updateAuthBadgeUI();
    });
  }

  if (formUnlock) {
    formUnlock.addEventListener('submit', (e) => {
      e.preventDefault();
      const enteredPass = document.getElementById('unlockPassInput').value.trim();
      const savedHash = localStorage.getItem('fitexpert_auth_pass');

      if (hashPassword(enteredPass) === savedHash) {
        document.getElementById('unlockPassInput').value = '';
        if (lockScreen) lockScreen.style.display = 'none';
        sessionStorage.setItem('fitexpert_unlocked', 'true');
      } else {
        const errorElem = document.getElementById('unlockErrorText');
        const hintStr = localStorage.getItem('fitexpert_auth_hint');
        if (errorElem) {
          errorElem.textContent = `Contraseña incorrecta.${hintStr ? ' Pista: ' + hintStr : ''}`;
        }
      }
    });
  }

  updateAuthBadgeUI();
}

function checkAppLockState() {
  const savedHash = localStorage.getItem('fitexpert_auth_pass');
  const isUnlocked = sessionStorage.getItem('fitexpert_unlocked') === 'true';

  if (savedHash && !isUnlocked) {
    lockApp();
  }
}

export function lockApp() {
  const savedHash = localStorage.getItem('fitexpert_auth_pass');
  if (!savedHash) {
    alert('Primero debes configurar una contraseña pulsando el botón "Proteger Perfil".');
    return;
  }

  sessionStorage.removeItem('fitexpert_unlocked');
  const lockScreen = document.getElementById('appLockScreen');
  const errorElem = document.getElementById('unlockErrorText');
  if (errorElem) errorElem.textContent = '';
  if (lockScreen) lockScreen.style.display = 'flex';
}

function updateAuthBadgeUI() {
  const badge = document.getElementById('authStatusBadge');
  const savedHash = localStorage.getItem('fitexpert_auth_pass');

  if (badge) {
    if (savedHash) {
      badge.className = 'badge badge-emerald';
      badge.innerHTML = `<i class="fa-solid fa-lock"></i> Perfil Protegido`;
    } else {
      badge.className = 'badge badge-purple';
      badge.innerHTML = `<i class="fa-solid fa-lock-open"></i> Sin Contraseña`;
    }
  }
}

/**
 * Simple hash mechanism for local security check.
 */
function hashPassword(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return 'fx_' + Math.abs(hash);
}
