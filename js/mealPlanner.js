// FitExpert Studio - Weekly Meal Planner & Grocery Generator Module
import { MEAL_DATABASE, DEFAULT_WEEKLY_MENU } from './mealDatabase.js';

let activeDay = 'Lunes';

export function initMealPlanner() {
  setupDayNavigation();
  renderMealPlan();
  setupGroceryModal();
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
      renderMealPlan();
    });
  });
}

export function renderMealPlan() {
  const title = document.getElementById('activeDayMealTitle');
  if (title) title.innerHTML = `<i class="fa-solid fa-calendar-day"></i> Menú del Día: ${activeDay}`;

  const dayMenuIds = DEFAULT_WEEKLY_MENU[activeDay] || DEFAULT_WEEKLY_MENU['Lunes'];
  const gridContainer = document.getElementById('mealsGridContainer');
  gridContainer.innerHTML = '';

  let dayCalories = 0;
  let dayProtein = 0;
  let dayCarbs = 0;
  let dayFat = 0;

  const mealTypes = [
    { key: 'breakfast', title: 'Desayuno Proteico', icon: 'fa-sun' },
    { key: 'lunch', title: 'Comida Principal (Almuerzo)', icon: 'fa-utensils' },
    { key: 'snack', title: 'Merienda / Snack Pre-Entreno', icon: 'fa-apple-whole' },
    { key: 'dinner', title: 'Cena Ligera de Recuperación', icon: 'fa-moon' }
  ];

  mealTypes.forEach(type => {
    const mealId = dayMenuIds[type.key];
    const mealData = MEAL_DATABASE.find(m => m.id === mealId);

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

      <div style="background: rgba(11,15,25,0.4); padding: 10px 12px; border-radius: var(--radius-sm); font-size: 12px; color: var(--text-muted);">
        <strong style="color: var(--text-main);">Ingredientes:</strong>
        <ul style="margin-top: 4px; padding-left: 16px;">
          ${mealData.ingredients.map(ing => `<li>${ing}</li>`).join('')}
        </ul>
      </div>
    `;

    gridContainer.appendChild(card);
  });

  // Update Summary Header Badge
  const summaryContainer = document.getElementById('activeDayMacroSummary');
  if (summaryContainer) {
    summaryContainer.innerHTML = `
      <span class="badge badge-cyan" style="font-size:14px; padding:6px 14px;">
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
    // Aggregate ingredients for all 7 days
    const allIngredients = new Set();
    Object.values(DEFAULT_WEEKLY_MENU).forEach(dayMenu => {
      Object.values(dayMenu).forEach(mealId => {
        const meal = MEAL_DATABASE.find(m => m.id === mealId);
        if (meal) {
          meal.ingredients.forEach(ing => allIngredients.add(ing));
        }
      });
    });

    listContainer.innerHTML = '';
    allIngredients.forEach(itemStr => {
      const row = document.createElement('div');
      row.style.cssText = 'display:flex; align-items:center; gap:10px; padding:8px 0; border-bottom:1px solid rgba(255,255,255,0.05); font-size:13px; color:var(--text-main);';
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
