/**
 * Módulo 3: Nutrición y Balance Energético
 * Planificador de Menús, Calculadora Biométrica BMR/TDEE, Alergias/Intolerancias y Estilo de Dieta.
 * Diseño Quiet Luxury estricto (0 Emojis, tipografía limpia e iconos vectoriales finos).
 */

import { appState } from '../appState.js';
import { garminState } from '../garminState.js';

export function renderNutritionModule(container) {
  const nState = appState.nutrition;
  const totals = appState.getTotals();
  const gData = garminState.getData();
  const p = appState.userProfile;

  const proteinPct = Math.min(Math.round((totals.protein / nState.targets.protein) * 100), 100);
  const carbsPct = Math.min(Math.round((totals.carbs / nState.targets.carbs) * 100), 100);
  const fatPct = Math.min(Math.round((totals.fat / nState.targets.fat) * 100), 100);

  const goalLabels = {
    fat_loss: "Perder Grasa / Adelgazar (-500 kcal)",
    recomp: "Recomposición Corporal (Mantenimiento)",
    muscle_gain: "Ganar Masa Muscular / Volumen (+350 kcal)"
  };

  const dietLabels = {
    omnivore: "Omnívora Equilibrada",
    mediterranean: "Mediterránea Flexitariana",
    keto: "Keto / Cetogénica",
    vegetarian: "Vegetariana",
    vegan: "Vegana (100% Vegetal)",
    high_protein: "Alta en Proteínas"
  };

  const allergyList = [
    { id: "lactosa", label: "Lactosa / Lácteos" },
    { id: "gluten", label: "Gluten / Celíaco" },
    { id: "frutos_secos", label: "Frutos Secos / Cacahuetes" },
    { id: "huevo", label: "Huevo" },
    { id: "pescado", label: "Pescado / Marisco" },
    { id: "soya", label: "Soya" }
  ];

  const userAllergies = p.allergies || [];

  container.innerHTML = `
    <!-- Header -->
    <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 16px;">
      <div>
        <div class="card-title-sm">Módulo 3: Nutrición & Balance Energético</div>
        <h2 style="font-size: 1.4rem; font-weight: 500; color: var(--text-main);">Perfil Biométrico, Alergias & Dieta</h2>
      </div>
      <span style="font-size: 0.8rem; font-family: var(--font-mono); color: var(--accent-optimal); background: var(--bg-card); padding: 4px 10px; border-radius: 4px; border: 1px solid var(--border-line);">
        Meta: ${p.targetCalories} kcal/día
      </span>
    </div>

    <!-- ACCORDEÓN DESPLEGABLE: CALCULADORA BIOMÉTRICA, ALERGIAS & DIETA (SIN MODALES / SIN EMOJIS) -->
    <div class="card" style="border: 1px solid var(--border-line-strong); background-color: rgba(27, 38, 59, 0.02); margin-bottom: 20px;">
      <div style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;" id="btn-toggle-biometrics">
        <div>
          <div style="font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; color: var(--text-main);">
            Configuración Nutricional: Datos, Alergias & Tipo de Dieta
          </div>
          <div style="font-size: 0.82rem; color: var(--text-muted); margin-top: 2px;">
            ${p.weight} kg · ${p.height} cm | <strong>${dietLabels[p.dietType] || 'Omnívora'}</strong> | ${userAllergies.length > 0 ? `<span style="color: var(--accent-fatigue); font-weight: 600;">${userAllergies.length} Alergia(s) Activas</span>` : 'Sin Alergias'}
          </div>
        </div>
        <button class="inline-btn inline-btn-secondary" style="padding: 4px 10px; font-size: 0.72rem;">
          Configurar Perfil / Objetivo
        </button>
      </div>

      <!-- FORMS DESPLEGABLE INLINE -->
      <div id="biometrics-accordion-body" class="accordion-wrapper" style="margin-top: 14px;">
        <div style="background: var(--bg-main); padding: 16px; border: 1px solid var(--border-line-strong); border-radius: var(--radius-md);">
          
          <!-- 1. DATOS FÍSICOS -->
          <div style="font-size: 0.78rem; font-weight: 600; text-transform: uppercase; color: var(--text-main); margin-bottom: 10px; letter-spacing: 0.05em;">
            1. Tus Datos Físicos (Para Cálculo BMR y TDEE):
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px; margin-bottom: 16px;">
            <div class="garmin-field-group">
              <label class="garmin-input-label">Altura (cm):</label>
              <input type="number" id="input-profile-height" value="${p.height}" class="garmin-text-input" style="padding: 8px 10px;" />
            </div>

            <div class="garmin-field-group">
              <label class="garmin-input-label">Peso Actual (kg):</label>
              <input type="number" step="0.5" id="input-profile-weight" value="${p.weight}" class="garmin-text-input" style="padding: 8px 10px;" />
            </div>

            <div class="garmin-field-group">
              <label class="garmin-input-label">Edad (años):</label>
              <input type="number" id="input-profile-age" value="${p.age}" class="garmin-text-input" style="padding: 8px 10px;" />
            </div>

            <div class="garmin-field-group">
              <label class="garmin-input-label">Sexo Biológico:</label>
              <select id="select-profile-gender" class="garmin-text-input" style="padding: 8px 10px; background: var(--bg-main);">
                <option value="male" ${p.gender === 'male' ? 'selected' : ''}>Hombre</option>
                <option value="female" ${p.gender === 'female' ? 'selected' : ''}>Mujer</option>
              </select>
            </div>

            <div class="garmin-field-group" style="grid-column: span 2;">
              <label class="garmin-input-label">Nivel de Actividad Diaria:</label>
              <select id="select-profile-activity" class="garmin-text-input" style="padding: 8px 10px; background: var(--bg-main);">
                <option value="1.2" ${p.activityLevel == 1.2 ? 'selected' : ''}>Sedentario (Oficina / Poco movimiento)</option>
                <option value="1.375" ${p.activityLevel == 1.375 ? 'selected' : ''}>Ligeramente Activo (1-3 días de ejercicio)</option>
                <option value="1.55" ${p.activityLevel == 1.55 ? 'selected' : ''}>Moderadamente Activo (3-5 días intenso)</option>
                <option value="1.725" ${p.activityLevel == 1.725 ? 'selected' : ''}>Muy Activo (6-7 días / Trabajo físico)</option>
              </select>
            </div>
          </div>

          <!-- 2. ALERGIAS E INTOLERANCIAS ALIMENTARIAS -->
          <div style="font-size: 0.78rem; font-weight: 600; text-transform: uppercase; color: var(--text-main); margin-bottom: 8px; letter-spacing: 0.05em;">
            2. Alergias e Intolerancias (Filtra Platos y Recetas Automáticamente):
          </div>

          <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px;">
            ${allergyList.map(a => {
              const isChecked = userAllergies.includes(a.id);
              return `
                <button class="day-pill btn-toggle-allergy ${isChecked ? 'active' : ''}" data-allergy-id="${a.id}" style="${isChecked ? 'background-color: var(--accent-fatigue); border-color: var(--accent-fatigue); color: white;' : ''}">
                  ${isChecked ? '[EXCLUIDO]' : '+'} ${a.label}
                </button>
              `;
            }).join('')}
          </div>

          <div class="garmin-field-group" style="margin-bottom: 16px;">
            <label class="garmin-input-label">Otras Alergias o Intolerancias Específicas:</label>
            <input type="text" id="input-profile-custom-allergies" placeholder="Ej: Fructosa, Sorbitol, Mariscos específicos..." value="${p.customAllergies || ''}" class="garmin-text-input" style="padding: 8px 10px;" />
          </div>

          <!-- 3. TIPO / ESTILO DE DIETA -->
          <div style="font-size: 0.78rem; font-weight: 600; text-transform: uppercase; color: var(--text-main); margin-bottom: 8px; letter-spacing: 0.05em;">
            3. Tipo de Dieta Preferida:
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 8px; margin-bottom: 16px;">
            ${Object.keys(dietLabels).map(key => `
              <button class="inline-btn btn-diet-option ${p.dietType === key ? 'active' : 'inline-btn-secondary'}" data-diet="${key}" style="padding: 8px 10px; font-size: 0.78rem; text-align: left;">
                ${dietLabels[key]}
              </button>
            `).join('')}
          </div>

          <!-- 4. OBJETIVO / FINALIDAD PRINCIPAL -->
          <div style="font-size: 0.78rem; font-weight: 600; text-transform: uppercase; color: var(--text-main); margin-bottom: 8px; letter-spacing: 0.05em;">
            4. Objetivo Principal (Finalidad):
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 8px; margin-bottom: 16px;">
            <button class="inline-btn btn-goal-option ${p.goal === 'fat_loss' ? 'active' : 'inline-btn-secondary'}" data-goal="fat_loss" style="padding: 10px; font-size: 0.8rem; text-align: center;">
              Perder Grasa<br><span style="font-size: 0.7rem; font-weight: 400; opacity: 0.8;">Déficit (-500 kcal)</span>
            </button>

            <button class="inline-btn btn-goal-option ${p.goal === 'recomp' ? 'active' : 'inline-btn-secondary'}" data-goal="recomp" style="padding: 10px; font-size: 0.8rem; text-align: center;">
              Recomposición<br><span style="font-size: 0.7rem; font-weight: 400; opacity: 0.8;">Mantenimiento Calórico</span>
            </button>

            <button class="inline-btn btn-goal-option ${p.goal === 'muscle_gain' ? 'active' : 'inline-btn-secondary'}" data-goal="muscle_gain" style="padding: 10px; font-size: 0.8rem; text-align: center;">
              Ganar Músculo<br><span style="font-size: 0.7rem; font-weight: 400; opacity: 0.8;">Superávit (+350 kcal)</span>
            </button>
          </div>

          <!-- RESULTADOS EN TIEMPO REAL -->
          <div style="background: var(--bg-card); padding: 12px 14px; border: 1px solid var(--border-line); border-radius: var(--radius-sm); font-size: 0.8rem;">
            <div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px; font-family: var(--font-mono);">
              <span>BMR: <strong>${p.bmr} kcal</strong></span>
              <span>TDEE Base: <strong>${p.tdee} kcal</strong></span>
              <span>Objetivo Diario: <strong style="color: var(--accent-optimal);">${p.targetCalories} kcal</strong></span>
            </div>
            <div style="margin-top: 6px; font-size: 0.75rem; color: var(--text-muted);">
              Macros adaptados: <strong>${p.targetProtein}g Proteína</strong> | <strong>${p.targetCarbs}g Carbos</strong> | <strong>${p.targetFat}g Grasas</strong>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Resumen de Macros -->
    <div class="fine-grid" style="grid-template-columns: repeat(3, 1fr); margin-bottom: 20px;">
      <!-- Proteínas -->
      <div class="grid-cell accent-optimal-border">
        <div class="card-title-sm" style="color: var(--accent-optimal);">Proteínas</div>
        <div class="metric-number-md">${totals.protein}<span class="unit">/ ${nState.targets.protein}g</span></div>
        <div class="gauge-track" style="margin-top: 8px; height: 6px;">
          <div class="gauge-fill" style="width: ${proteinPct}%;"></div>
        </div>
      </div>

      <!-- Carbohidratos -->
      <div class="grid-cell accent-navy-border">
        <div class="card-title-sm">Carbohidratos</div>
        <div class="metric-number-md">${totals.carbs}<span class="unit">/ ${nState.targets.carbs}g</span></div>
        <div class="gauge-track" style="margin-top: 8px; height: 6px;">
          <div class="gauge-fill" style="width: ${carbsPct}%; background-color: var(--text-main);"></div>
        </div>
      </div>

      <!-- Grasas -->
      <div class="grid-cell accent-fatigue-border">
        <div class="card-title-sm" style="color: var(--accent-fatigue);">Grasas</div>
        <div class="metric-number-md">${totals.fat}<span class="unit">/ ${nState.targets.fat}g</span></div>
        <div class="gauge-track" style="margin-top: 8px; height: 6px;">
          <div class="gauge-fill" style="width: ${fatPct}%; background-color: var(--accent-fatigue);"></div>
        </div>
      </div>
    </div>

    <!-- PLANIFICADOR Y INTERCAMBIO DE PLATOS ADAPTADOS A ALERGIAS -->
    <div class="card">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 8px;">
        <div class="card-title-sm" style="margin-bottom: 0;">Planificador Adaptado (Sin Alérgenos & Dieta ${dietLabels[p.dietType] || ''})</div>
        ${userAllergies.length > 0 ? `<span style="font-size: 0.72rem; padding: 2px 8px; background: rgba(158, 107, 85, 0.15); color: var(--accent-fatigue); border-radius: 4px; font-weight: 600;">Platos Filtrados para ${userAllergies.length} Alergias</span>` : ''}
      </div>

      <div style="display: flex; flex-direction: column; gap: 14px; margin-top: 12px;">
        ${nState.mealPlans.map((plan, idx) => `
          <div style="background: var(--bg-main); padding: 14px 18px; border: 1px solid var(--border-line); border-radius: var(--radius-sm);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px;">
              <div>
                <span style="font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted);">${plan.meal}</span>
                <div style="font-weight: 500; color: var(--text-main); margin-top: 2px;">${plan.current}</div>
              </div>
              <button class="inline-btn inline-btn-secondary btn-toggle-meal-swap" data-plan-idx="${idx}" style="padding: 4px 10px; font-size: 0.75rem; white-space: nowrap;">
                Intercambiar Plato
              </button>
            </div>

            <!-- ACORDEÓN INLINE DESPLEGABLE DE INTERCAMBIO -->
            <div id="meal-accordion-${idx}" class="accordion-wrapper">
              <div class="accordion-content" style="margin-top: 10px; padding: 12px 14px;">
                <div style="font-size: 0.75rem; font-weight: 600; color: var(--text-muted); margin-bottom: 8px;">Alternativas Seguras con Equivalencia Exacta:</div>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                  ${plan.alternatives.map(alt => `
                    <div class="substitute-item btn-select-meal-alt" data-plan-idx="${idx}" data-alt-text="${alt}" style="padding: 10px 14px;">
                      <span style="font-size: 0.85rem; color: var(--text-main);">${alt}</span>
                      <span class="inline-btn inline-btn-secondary" style="padding: 2px 8px; font-size: 0.72rem;">Aplicar</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- REGISTRO DE ALIMENTOS DIARIOS E INLINE ADD -->
    <div class="card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <div class="card-title-sm" style="margin-bottom: 0;">Alimentos Registrados Hoy (${totals.calories} kcal)</div>
        <button id="btn-toggle-add-food" class="inline-btn" style="padding: 6px 12px; font-size: 0.78rem;">
          + Agregar Alimento Inline
        </button>
      </div>

      <!-- FORMULARIO INLINE DESPLEGABLE PARA AGREGAR ALIMENTO (SIN MODALES) -->
      <div id="add-food-accordion" class="accordion-wrapper">
        <div class="accordion-content" style="margin-bottom: 14px;">
          <div class="card-title-sm">Buscador y Creador Rápido de Alimento</div>
          
          <!-- Buscador Rápido -->
          <div style="margin-bottom: 12px;">
            <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 6px;">Selección rápida de Base de Datos:</div>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              ${nState.foodDatabase.map(dbFood => `
                <button class="inline-btn inline-btn-secondary btn-quick-add-db" data-name="${dbFood.name}" data-cal="${dbFood.calories}" data-p="${dbFood.p}" data-c="${dbFood.c}" data-f="${dbFood.f}" style="padding: 4px 10px; font-size: 0.75rem;">
                  + ${dbFood.name} (${dbFood.calories} kcal)
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Campos Manuales -->
          <div style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr; gap: 8px; margin-top: 10px;">
            <input type="text" id="food-input-name" placeholder="Nombre del alimento" style="padding: 6px 10px; border: 1px solid var(--border-line-strong); border-radius: var(--radius-sm); font-size: 0.85rem;" />
            <input type="number" id="food-input-cal" placeholder="kcal" style="padding: 6px 10px; border: 1px solid var(--border-line-strong); border-radius: var(--radius-sm); font-size: 0.85rem;" />
            <input type="number" id="food-input-p" placeholder="P (g)" style="padding: 6px 10px; border: 1px solid var(--border-line-strong); border-radius: var(--radius-sm); font-size: 0.85rem;" />
            <input type="number" id="food-input-c" placeholder="C (g)" style="padding: 6px 10px; border: 1px solid var(--border-line-strong); border-radius: var(--radius-sm); font-size: 0.85rem;" />
            <input type="number" id="food-input-f" placeholder="G (g)" style="padding: 6px 10px; border: 1px solid var(--border-line-strong); border-radius: var(--radius-sm); font-size: 0.85rem;" />
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 10px;">
            <button id="btn-submit-food" class="inline-btn inline-btn-accent" style="padding: 6px 14px; font-size: 0.8rem;">Guardar e Integrar en Déficit</button>
          </div>
        </div>
      </div>

      <!-- Lista de alimentos guardados -->
      <div style="display: flex; flex-direction: column; gap: 8px;">
        ${nState.loggedFood.length === 0 ? `
          <div style="font-size: 0.82rem; color: var(--text-muted); padding: 16px; text-align: center; background: var(--bg-main); border: 1px dashed var(--border-line-strong); border-radius: var(--radius-sm);">
            Sin alimentos registrados hoy (0 kcal | 0g Proteína). Registra tus comidas usando el botón superior o aplica una opción del planificador.
          </div>
        ` : nState.loggedFood.map(item => `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: var(--bg-main); border: 1px solid var(--border-line); border-radius: var(--radius-sm);">
            <div>
              <span style="font-size: 0.72rem; font-weight: 600; text-transform: uppercase; color: var(--text-muted);">${item.meal}</span>
              <div style="font-weight: 500; color: var(--text-main); font-size: 0.9rem;">${item.name}</div>
            </div>
            <div style="display: flex; align-items: center; gap: 14px;">
              <div style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-main); text-align: right;">
                <strong>${item.calories} kcal</strong>
                <div style="font-size: 0.72rem; color: var(--text-muted);">${item.p}g P | ${item.c}g C | ${item.f}g G</div>
              </div>
              <button class="btn-remove-food" data-id="${item.id}" style="background: none; border: none; color: var(--accent-fatigue); cursor: pointer; font-size: 1.1rem;">×</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  // Attach Biometrics Accordion Toggle
  const btnToggleBio = container.querySelector('#btn-toggle-biometrics');
  if (btnToggleBio) {
    btnToggleBio.addEventListener('click', () => {
      const body = container.querySelector('#biometrics-accordion-body');
      if (body) body.classList.toggle('expanded');
    });
  }

  // Attach Biometric Input Changes
  const inputH = container.querySelector('#input-profile-height');
  const inputW = container.querySelector('#input-profile-weight');
  const inputA = container.querySelector('#input-profile-age');
  const selectG = container.querySelector('#select-profile-gender');
  const selectAct = container.querySelector('#select-profile-activity');
  const inputCustomAlg = container.querySelector('#input-profile-custom-allergies');

  const onProfileInput = () => {
    appState.updateUserProfile({
      height: parseFloat(inputH.value) || 175,
      weight: parseFloat(inputW.value) || 70,
      age: parseInt(inputA.value) || 25,
      gender: selectG.value,
      activityLevel: parseFloat(selectAct.value),
      customAllergies: inputCustomAlg ? inputCustomAlg.value : ""
    });
  };

  if (inputH) inputH.addEventListener('change', onProfileInput);
  if (inputW) inputW.addEventListener('change', onProfileInput);
  if (inputA) inputA.addEventListener('change', onProfileInput);
  if (selectG) selectG.addEventListener('change', onProfileInput);
  if (selectAct) selectAct.addEventListener('change', onProfileInput);
  if (inputCustomAlg) inputCustomAlg.addEventListener('change', onProfileInput);

  // Toggle Allergy Pills
  container.querySelectorAll('.btn-toggle-allergy').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const allergyId = e.currentTarget.getAttribute('data-allergy-id');
      appState.toggleAllergy(allergyId);
      renderNutritionModule(container);
    });
  });

  // Diet Selection Options
  container.querySelectorAll('.btn-diet-option').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const dietType = e.currentTarget.getAttribute('data-diet');
      appState.updateUserProfile({ dietType });
      renderNutritionModule(container);
    });
  });

  // Goal Option Selection
  container.querySelectorAll('.btn-goal-option').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const goal = e.currentTarget.getAttribute('data-goal');
      appState.updateUserProfile({ goal });
      renderNutritionModule(container);
    });
  });

  // Attach Meal Swap Accordion Toggles
  container.querySelectorAll('.btn-toggle-meal-swap').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = e.currentTarget.getAttribute('data-plan-idx');
      const accordion = container.querySelector(`#meal-accordion-${idx}`);
      if (accordion) accordion.classList.toggle('expanded');
    });
  });

  // Attach Meal Alternative Selection
  container.querySelectorAll('.btn-select-meal-alt').forEach(item => {
    item.addEventListener('click', (e) => {
      const idx = parseInt(e.currentTarget.getAttribute('data-plan-idx'));
      const altText = e.currentTarget.getAttribute('data-alt-text');
      appState.swapMealPlan(idx, altText);
      renderNutritionModule(container);
    });
  });

  // Toggle Add Food Accordion
  const btnToggleAdd = container.querySelector('#btn-toggle-add-food');
  if (btnToggleAdd) {
    btnToggleAdd.addEventListener('click', () => {
      const acc = container.querySelector('#add-food-accordion');
      if (acc) acc.classList.toggle('expanded');
    });
  }

  // Quick Add from Food DB
  container.querySelectorAll('.btn-quick-add-db').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const name = e.currentTarget.getAttribute('data-name');
      const cal = parseInt(e.currentTarget.getAttribute('data-cal'));
      const p = parseInt(e.currentTarget.getAttribute('data-p'));
      const c = parseInt(e.currentTarget.getAttribute('data-c'));
      const f = parseInt(e.currentTarget.getAttribute('data-f'));
      
      appState.addFoodLog({ name, meal: "Snack", calories: cal, p, c, f });
      renderNutritionModule(container);
    });
  });

  // Submit Manual Food Form
  const btnSubmit = container.querySelector('#btn-submit-food');
  if (btnSubmit) {
    btnSubmit.addEventListener('click', () => {
      const name = container.querySelector('#food-input-name').value || "Alimento Manual";
      const cal = parseInt(container.querySelector('#food-input-cal').value) || 0;
      const p = parseInt(container.querySelector('#food-input-p').value) || 0;
      const c = parseInt(container.querySelector('#food-input-c').value) || 0;
      const f = parseInt(container.querySelector('#food-input-f').value) || 0;

      if (cal > 0) {
        appState.addFoodLog({ name, meal: "Registro Directo", calories: cal, p, c, f });
        renderNutritionModule(container);
      }
    });
  }

  // Remove Food Item
  container.querySelectorAll('.btn-remove-food').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      appState.removeFoodLog(id);
      renderNutritionModule(container);
    });
  });
}
