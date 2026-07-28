// FitExpert Studio - Secure Profile Authentication, Lock Screen & Zero-Loss Data Persistence Engine

export function initAuthStorage() {
  requestSafariPersistentStorage();
  setupAuthUI();
  checkAppLockState();
}

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
    btnSetupPass.addEventListener('click', (e) => {
      e.preventDefault();
      if (modal) modal.classList.add('active');
    });
  }

  if (btnLockNow) {
    btnLockNow.addEventListener('click', (e) => {
      e.preventDefault();
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
      
      alert('¡Perfil protegido con contraseña correctamente!');
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
        if (lockScreen) {
          lockScreen.style.display = 'none';
          lockScreen.classList.remove('active');
        }
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
  } else {
    const lockScreen = document.getElementById('appLockScreen');
    if (lockScreen) lockScreen.style.display = 'none';
  }
}

export function lockApp() {
  const savedHash = localStorage.getItem('fitexpert_auth_pass');
  if (!savedHash) {
    alert('Primero debes configurar una contraseña pulsando el botón de la llave 🔑.');
    return;
  }

  sessionStorage.removeItem('fitexpert_unlocked');
  const lockScreen = document.getElementById('appLockScreen');
  const errorElem = document.getElementById('unlockErrorText');
  if (errorElem) errorElem.textContent = '';
  if (lockScreen) {
    lockScreen.style.display = 'flex';
    lockScreen.classList.add('active');
  }
}

function updateAuthBadgeUI() {
  const badge = document.getElementById('authStatusBadge');
  const savedHash = localStorage.getItem('fitexpert_auth_pass');

  if (badge) {
    if (savedHash) {
      badge.className = 'badge badge-emerald';
      badge.innerHTML = `<i class="fa-solid fa-lock"></i> Protegido`;
    } else {
      badge.className = 'badge badge-purple';
      badge.innerHTML = `<i class="fa-solid fa-lock-open"></i> Sin Clave`;
    }
  }
}

function hashPassword(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return 'fx_' + Math.abs(hash);
}
