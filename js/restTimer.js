// FitExpert Studio - Rest Timer Engine
let restTimerInterval = null;
let remainingSeconds = 0;

export function initRestTimer() {
  setupTimerUI();
}

function setupTimerUI() {
  const timerOverlay = document.getElementById('restTimerWidget');
  if (!timerOverlay) return;

  const btnClose = document.getElementById('btnCloseTimer');
  const btnAdd30 = document.getElementById('btnTimerAdd30');
  const btnSkip = document.getElementById('btnTimerSkip');

  if (btnClose) btnClose.onclick = stopRestTimer;
  if (btnSkip) btnSkip.onclick = stopRestTimer;
  if (btnAdd30) {
    btnAdd30.onclick = () => {
      remainingSeconds += 30;
      updateTimerDisplay();
    };
  }
}

export function startRestTimer(durationSeconds = 90) {
  const timerOverlay = document.getElementById('restTimerWidget');
  if (!timerOverlay) return;

  clearInterval(restTimerInterval);
  remainingSeconds = durationSeconds;
  timerOverlay.classList.add('active');
  updateTimerDisplay();

  restTimerInterval = setInterval(() => {
    remainingSeconds--;
    updateTimerDisplay();

    if (remainingSeconds <= 0) {
      clearInterval(restTimerInterval);
      playTimerSound();
      setTimeout(() => {
        timerOverlay.classList.remove('active');
      }, 1500);
    }
  }, 1000);
}

export function stopRestTimer() {
  clearInterval(restTimerInterval);
  const timerOverlay = document.getElementById('restTimerWidget');
  if (timerOverlay) timerOverlay.classList.remove('active');
}

function updateTimerDisplay() {
  const display = document.getElementById('timerCountdownDisplay');
  if (!display) return;

  const mins = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;
  display.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function playTimerSound() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 880; // A5 pitch
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.8);
    setTimeout(() => osc.stop(), 800);
  } catch (e) {}
}
