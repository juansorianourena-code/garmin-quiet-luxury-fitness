// FitExpert Studio - Calorie & Macronutrient Calculator Module
import { calculateBMR, calculateTDEE, calculateMacroSplit } from './scienceBase.js';

let macrosChartInstance = null;

export function initCalorieCalculator(onProfileUpdated) {
  const form = document.getElementById('calculatorForm');
  if (!form) return;

  // Load saved profile if exists
  const savedProfile = localStorage.getItem('fitexpert_profile');
  if (savedProfile) {
    try {
      const data = JSON.parse(savedProfile);
      document.getElementById('gender').value = data.gender || 'male';
      document.getElementById('age').value = data.age || 26;
      document.getElementById('weight').value = data.weight || 75;
      document.getElementById('height').value = data.height || 178;
      document.getElementById('bodyFat').value = data.bodyFat || '';
      document.getElementById('activityLevel').value = data.activityLevel || 'moderate';
      document.getElementById('fitnessGoal').value = data.fitnessGoal || 'deficit_moderate';
    } catch (e) {
      console.warn('Could not parse stored profile', e);
    }
  }

  // Handle Form Submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const gender = document.getElementById('gender').value;
    const age = parseFloat(document.getElementById('age').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    const bodyFatVal = document.getElementById('bodyFat').value;
    const bodyFat = bodyFatVal ? parseFloat(bodyFatVal) : null;
    const activityLevel = document.getElementById('activityLevel').value;
    const fitnessGoal = document.getElementById('fitnessGoal').value;

    const bmr = calculateBMR(gender, weight, height, age, bodyFat);
    const tdee = calculateTDEE(bmr, activityLevel);
    const macroResults = calculateMacroSplit(tdee, fitnessGoal, weight);

    const profileData = {
      gender, age, weight, height, bodyFat, activityLevel, fitnessGoal,
      bmr, tdee, macroResults
    };

    // Save to LocalStorage
    localStorage.setItem('fitexpert_profile', JSON.stringify(profileData));

    // Update UI Elements
    renderCalculatorResults(profileData);

    if (onProfileUpdated) {
      onProfileUpdated(profileData);
    }
  });

  // Initial Calculation Run
  form.dispatchEvent(new Event('submit'));
}

export function renderCalculatorResults(profileData) {
  const { bmr, tdee, macroResults } = profileData;

  document.getElementById('resBMR').textContent = bmr.toLocaleString('es-ES');
  document.getElementById('resTDEE').textContent = tdee.toLocaleString('es-ES');
  document.getElementById('resTargetCalories').textContent = macroResults.targetCalories.toLocaleString('es-ES');
  document.getElementById('resGoalTitle').textContent = macroResults.deficitOrSurplusLabel;

  // Macro Grams & Kcals
  document.getElementById('resProtGram').textContent = `${macroResults.proteinGrams} g`;
  document.getElementById('resProtKcal').textContent = `${macroResults.proteinCalories} kcal (${macroResults.proteinPct}%)`;
  document.getElementById('barProt').style.width = `${macroResults.proteinPct}%`;

  document.getElementById('resCarbsGram').textContent = `${macroResults.carbGrams} g`;
  document.getElementById('resCarbsKcal').textContent = `${macroResults.carbCalories} kcal (${macroResults.carbPct}%)`;
  document.getElementById('barCarbs').style.width = `${macroResults.carbPct}%`;

  document.getElementById('resFatGram').textContent = `${macroResults.fatGrams} g`;
  document.getElementById('resFatKcal').textContent = `${macroResults.fatCalories} kcal (${macroResults.fatPct}%)`;
  document.getElementById('barFat').style.width = `${macroResults.fatPct}%`;

  // Render Chart.js Doughnut Chart
  renderChart(macroResults);
}

function renderChart(macroResults) {
  const ctx = document.getElementById('macrosChart');
  if (!ctx) return;

  if (macrosChartInstance) {
    macrosChartInstance.destroy();
  }

  macrosChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Proteínas (g)', 'Carbohidratos (g)', 'Grasas (g)'],
      datasets: [{
        data: [macroResults.proteinCalories, macroResults.carbCalories, macroResults.fatCalories],
        backgroundColor: ['#00f2fe', '#10b981', '#f59e0b'],
        borderWidth: 0,
        hoverOffset: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#94a3b8',
            font: { family: 'Outfit', size: 12 }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.raw || 0;
              return ` ${label}: ${value} kcal`;
            }
          }
        }
      },
      cutout: '70%'
    }
  });
}
