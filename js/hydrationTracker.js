// FitExpert Studio - Hydration & Electrolyte Tracker
let currentWaterML = 0;
let targetWaterML = 3000;

export function initHydrationTracker() {
  loadHydrationData();
  setupHydrationControls();
  renderHydrationUI();
}

function loadHydrationData() {
  const savedDate = localStorage.getItem('fitexpert_water_date');
  const today = new Date().toISOString().split('T')[0];

  if (savedDate !== today) {
    localStorage.setItem('fitexpert_water_date', today);
    localStorage.setItem('fitexpert_water_ml', '0');
    currentWaterML = 0;
  } else {
    currentWaterML = parseInt(localStorage.getItem('fitexpert_water_ml')) || 0;
  }

  // Calculate target based on profile weight: 35ml per kg + 500ml for workout
  const savedProfileStr = localStorage.getItem('fitexpert_profile');
  if (savedProfileStr) {
    try {
      const p = JSON.parse(savedProfileStr);
      if (p.weight) targetWaterML = Math.round(parseFloat(p.weight) * 35 + 500);
    } catch (e) {}
  }
}

function setupHydrationControls() {
  const btnAdd250 = document.getElementById('btnWaterAdd250');
  const btnAdd500 = document.getElementById('btnWaterAdd500');
  const btnReset = document.getElementById('btnWaterReset');

  if (btnAdd250) {
    btnAdd250.onclick = () => addWater(250);
  }
  if (btnAdd500) {
    btnAdd500.onclick = () => addWater(500);
  }
  if (btnReset) {
    btnReset.onclick = () => {
      currentWaterML = 0;
      saveWaterData();
      renderHydrationUI();
    };
  }
}

function addWater(amountML) {
  currentWaterML += amountML;
  saveWaterData();
  renderHydrationUI();
}

function saveWaterData() {
  localStorage.setItem('fitexpert_water_ml', currentWaterML.toString());
}

function renderHydrationUI() {
  const valueElem = document.getElementById('resWaterValue');
  const fillElem = document.getElementById('barWaterFill');
  const textElem = document.getElementById('resWaterText');

  const currentLiters = (currentWaterML / 1000).toFixed(2);
  const targetLiters = (targetWaterML / 1000).toFixed(2);
  const pct = Math.min(100, Math.round((currentWaterML / targetWaterML) * 100));

  if (valueElem) valueElem.textContent = `${currentLiters} L / ${targetLiters} L`;
  if (fillElem) fillElem.style.width = `${pct}%`;
  if (textElem) textElem.textContent = `${pct}% de tu objetivo de hidratación diario cumplido.`;
}
