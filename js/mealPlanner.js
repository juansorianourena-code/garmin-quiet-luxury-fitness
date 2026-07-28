// FitExpert Studio - Dynamic Weekly Meal Planner & Grocery Engine
import { MEAL_DATABASE } from './mealDatabase.js';

let activeDay = 'Lunes';
let generatedWeeklyMenu = {};

export function initMealPlanner() {
  setupDayNavigation();
  setupDietaryControls();
  
  // Load saved allergies text from LocalStorage
  const savedAllergies = localStorage.getItem('fitexpert_allergies');
  const inputElem = document.getElementById('customAllergiesInput');
  if (savedAllergies && inputElem) {
    inputElem.value = savedAllergies;
  }

  generatePersonalizedMenu();
  setupGroceryModal();

  window.addEventListener('profileUpdated', () => {
    generatePersonalizedMenu();
  });
}

function setupDayNavigation() {
  const container = document.getElementById('weekDayNav');
  if (!container) return;

  const buttons = container.querySelectorAll('.day-nav-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeDay = btn.getAttribute('data-day');
      renderActiveDayMenu();
    });
  });
}

function setupDietaryControls() {
  const form = document.getElementById('dietaryControlsForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Save custom typed allergies to LocalStorage
    const inputElem = document.getElementById('customAllergiesInput');
    if (inputElem) {
      localStorage.setItem('fitexpert_allergies', inputElem.value.trim());
    }

    generatePersonalizedMenu();
  });
}

export function generatePersonalizedMenu() {
  const savedProfileStr = localStorage.getItem('fitexpert_profile');
  let profile = null;
  if (savedProfileStr) {
    try { profile = JSON.parse(savedProfileStr); } catch (e) {}
  }

  const menuStyle = document.getElementById('menuStyle') ? document.getElementById('menuStyle').value : 'all';
  
  // Read custom typed allergies line
  const customAllergiesInput = document.getElementById('customAllergiesInput');
  const typedText = customAllergiesInput ? customAllergiesInput.value.trim() : (localStorage.getItem('fitexpert_allergies') || '');
  
  // Split user typed allergies by commas, spaces, or semicolons
  const allergyTerms = typedText.toLowerCase().split(/[,;]+/).map(s => s.trim()).filter(s => s.length > 0);

  // Filter recipes dynamically
  const filterRecipe = (recipe) => {
    if (menuStyle !== 'all' && recipe.style !== menuStyle) return false;

    if (allergyTerms.length > 0) {
      const recipeText = (recipe.name + ' ' + recipe.ingredients.join(' ') + ' ' + recipe.allergies.join(' ')).toLowerCase();
      
      // If recipe contains any of the forbidden allergy words, exclude it!
      for (const term of allergyTerms) {
        if (recipeText.includes(term)) {
          return false;
        }
      }
    }
    return true;
  };

  const breakfasts = MEAL_DATABASE.filter(m => m.category === 'Desayuno' && filterRecipe(m));
  const lunches = MEAL_DATABASE.filter(m => m.category === 'Comida' && filterRecipe(m));
  const snacks = MEAL_DATABASE.filter(m => m.category === 'Merienda' && filterRecipe(m));
  const dinners = MEAL_DATABASE.filter(m => m.category === 'Cena' && filterRecipe(m));

  // Safe fallbacks if custom allergy filters exclude all specific recipes
  const bList = breakfasts.length > 0 ? breakfasts : MEAL_DATABASE.filter(m => m.category === 'Desayuno');
  const lList = lunches.length > 0 ? lunches : MEAL_DATABASE.filter(m => m.category === 'Comida');
  const sList = snacks.length > 0 ? snacks : MEAL_DATABASE.filter(m => m.category === 'Merienda');
  const dList = dinners.length > 0 ? dinners : MEAL_DATABASE.filter(m => m.category === 'Cena');

  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  generatedWeeklyMenu = {};

  days.forEach((day, idx) => {
    generatedWeeklyMenu[day] = {
      breakfast: bList[idx % bList.length],
      lunch: lList[idx % lList.length],
      snack: sList[idx % sList.length],
      dinner: dList[idx % dList.length]
    };
  });

  renderActiveDayMenu();
}

function renderActiveDayMenu() {
  const title = document.getElementById('activeDayMealTitle');
  if (title) title.innerHTML = `<i class="fa-solid fa-calendar-day"></i> Menú del Día: ${activeDay}`;

  const dayMenu = generatedWeeklyMenu[activeDay];
  if (!dayMenu) return;

  const gridContainer = document.getElementById('mealsGridContainer');
  gridContainer.innerHTML = '';

  let dayCalories = 0;
  let dayProtein = 0;
  let dayCarbs = 0;
  let dayFat = 0;

  const mealTypes = [
    { key: 'breakfast', title: 'Desayuno', icon: 'fa-sun' },
    { key: 'lunch', title: 'Comida Principal', icon: 'fa-utensils' },
    { key: 'snack', title: 'Merienda / Snack', icon: 'fa-apple-whole' },
    { key: 'dinner', title: 'Cena de Recuperación', icon: 'fa-moon' }
  ];

  mealTypes.forEach(type => {
    const mealData = dayMenu[type.key];
    if (!mealData) return;

    dayCalories += mealData.calories;
    dayProtein += mealData.protein;
    dayCarbs += mealData.carbs;
    dayFat += mealData.fat;

    const card = document.createElement('div');
    card.className = 'meal-item-card';
    card.innerHTML = `
      <div class="meal-cat"><i class="fa-solid ${type.icon}"></i> ${type.title}</div>
      <div class="meal-name">${mealData.name}</div>
      <div class="meal-macros mb-2">
        <span style="color:var(--accent-cyan); font-weight:700;"><i class="fa-solid fa-fire"></i> ${mealData.calories} kcal</span>
        <span style="color:var(--accent-cyan);">P: ${mealData.protein}g</span>
        <span style="color:var(--accent-emerald);">C: ${mealData.carbs}g</span>
        <span style="color:var(--accent-amber);">G: ${mealData.fat}g</span>
      </div>

      <div style="background: rgba(11,15,25,0.4); padding: 8px 10px; border-radius: var(--radius-sm); font-size: 11px; color: var(--text-muted);">
        <strong style="color: var(--text-main);">Ingredientes:</strong>
        <ul style="margin-top: 4px; padding-left: 14px;">
          ${mealData.ingredients.map(ing => `<li>${ing}</li>`).join('')}
        </ul>
      </div>
    `;

    gridContainer.appendChild(card);
  });

  const summaryContainer = document.getElementById('activeDayMacroSummary');
  if (summaryContainer) {
    summaryContainer.innerHTML = `
      <span class="badge badge-cyan" style="font-size:12px; padding:4px 10px;">
        <i class="fa-solid fa-calculator"></i> Total Día: ${dayCalories} kcal | P: ${dayProtein}g | C: ${dayCarbs}g | G: ${dayFat}g
      </span>
    `;
  }
}

function setupGroceryModal() {
  const btnOpen = document.getElementById('btnOpenGrocery');
  const modal = document.getElementById('groceryModal');
  const btnClose = document.getElementById('btnCloseGroceryModal');
  const listContainer = document.getElementById('groceryItemsList');

  if (!btnOpen || !modal) return;

  btnOpen.addEventListener('click', () => {
    const allIngredients = new Set();
    Object.values(generatedWeeklyMenu).forEach(dayMenu => {
      Object.values(dayMenu).forEach(meal => {
        if (meal && meal.ingredients) {
          meal.ingredients.forEach(ing => allIngredients.add(ing));
        }
      });
    });

    listContainer.innerHTML = '';
    allIngredients.forEach(itemStr => {
      const row = document.createElement('div');
      row.style.cssText = 'display:flex; align-items:center; gap:8px; padding:6px 0; border-bottom:1px solid rgba(255,255,255,0.05); font-size:12px; color:var(--text-main);';
      row.innerHTML = `
        <input type="checkbox" style="width:16px; height:16px; accent-color:var(--accent-emerald);">
        <span>${itemStr}</span>
      `;
      listContainer.appendChild(row);
    });

    modal.classList.add('active');
  });

  if (btnClose) {
    btnClose.onclick = () => modal.classList.remove('active');
  }
  modal.onclick = (e) => {
    if (e.target === modal) modal.classList.remove('active');
  };
}
