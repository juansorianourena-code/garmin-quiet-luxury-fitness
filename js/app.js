// FitExpert Studio - Single Self-Contained Application Bundle
// Optimized for 100% Guaranteed Execution on iOS Safari & Standalone PWA

(function() {
  'use strict';

  // ==========================================================================
  // 1. EXERCISE DATABASE & ROUTINE GENERATOR
  // ==========================================================================
  const EXERCISE_DATABASE = [
    { exerciseId: 'bench-press', name: 'Press de Banca Plano con Barra', targetMuscle: 'Pecho', defaultSets: 4, defaultReps: '6-8', rpeTarget: 8.5, biomechanics: 'Retracción escapular activa, codos a 45° del torso. Apoyo plantar completo.', tips: ['No rebotar la barra en el esternón', 'Mantener los glúteos pegados al banco'] },
    { exerciseId: 'incline-db-press', name: 'Press Inclinado con Mancuernas (30°)', targetMuscle: 'Pecho', defaultSets: 3, defaultReps: '8-10', rpeTarget: 8, biomechanics: 'Enfoca la porción clavicular del pectoral mayor sin sobrecargar la articulación acromioclavicular.', tips: ['No juntar fuertemente las mancuernas arriba'] },
    { exerciseId: 'cable-flyes', name: 'Cruce de Poleas de Abajo a Arriba', targetMuscle: 'Pecho', defaultSets: 3, defaultReps: '12-15', rpeTarget: 9, biomechanics: 'Tensión constante en el pectoral superior.', tips: ['Mantener ligera flexión de codos'] },
    { exerciseId: 'ohp-barbell', name: 'Press Militar de Pie con Barra', targetMuscle: 'Hombros', defaultSets: 4, defaultReps: '6-8', rpeTarget: 8.5, biomechanics: 'Bloqueo de glúteos y abdomen para evitar hiperlordosis lumbar.', tips: ['Pasar la cabeza hacia adelante al superar la frente'] },
    { exerciseId: 'lateral-raises', name: 'Elevaciones Laterales con Mancuernas', targetMuscle: 'Hombros', defaultSets: 4, defaultReps: '12-15', rpeTarget: 9, biomechanics: 'Inclinación ligera del torso hacia adelante para alinear el deltoides lateral.', tips: ['Subir conduciendo con los codos'] },
    { exerciseId: 'triceps-pushdown', name: 'Extensión de Tríceps en Polea con Cuerda', targetMuscle: 'Tríceps', defaultSets: 3, defaultReps: '10-12', rpeTarget: 9, biomechanics: 'Fijar los codos a los costados y abrir la cuerda abajo.', tips: ['Evitar usar impulso del hombro'] },
    { exerciseId: 'pullups', name: 'Dominadas Pronadas / Asistidas', targetMuscle: 'Espalda', defaultSets: 4, defaultReps: '6-10', rpeTarget: 8.5, biomechanics: 'Depresión escapular antes de iniciar el tirón hacia el pecho alto.', tips: ['No balancear las piernas'] },
    { exerciseId: 'barbell-row', name: 'Remo con Barra 45°', targetMuscle: 'Espalda', defaultSets: 4, defaultReps: '8-10', rpeTarget: 8.5, biomechanics: 'Tracción dirigida a la cadera para maximizar dorsales.', tips: ['No flexionar la espalda baja'] },
    { exerciseId: 'lat-pulldown', name: 'Jalón al Pecho en Polea Alta', targetMuscle: 'Espalda', defaultSets: 3, defaultReps: '10-12', rpeTarget: 8.5, biomechanics: 'Agarre algo más ancho que los hombros.', tips: ['Llevar la barra al esternón'] },
    { exerciseId: 'facepulls', name: 'Facepull en Polea con Cuerda', targetMuscle: 'Hombros', defaultSets: 3, defaultReps: '15', rpeTarget: 9, biomechanics: 'Rotación externa de hombro dirigiendo las manos a las orejas.', tips: ['Ideal para salud del manguito rotador'] },
    { exerciseId: 'biceps-curl-db', name: 'Curl de Bíceps Alterno con Mancuernas', targetMuscle: 'Bíceps', defaultSets: 3, defaultReps: '10-12', rpeTarget: 9, biomechanics: 'Supinación completa de muñeca en el punto de máxima contracción.', tips: ['No balancear el torso'] },
    { exerciseId: 'barbell-squat', name: 'Sentadilla Trasera Profunda con Barra', targetMuscle: 'Cuádriceps', defaultSets: 4, defaultReps: '6-8', rpeTarget: 8.5, biomechanics: 'Rodillas alineadas con la punta de los pies, profundidad por debajo de 90°.', tips: ['No colapsar rodillas hacia adentro'] },
    { exerciseId: 'leg-press', name: 'Prensa 45°', targetMuscle: 'Cuádriceps', defaultSets: 3, defaultReps: '10-12', rpeTarget: 8.5, biomechanics: 'Mayor énfasis en cuádriceps sin carga en la columna.', tips: ['No bloquear completamente las rodillas arriba'] },
    { exerciseId: 'leg-extension', name: 'Extensión de Cuádriceps en Máquina', targetMuscle: 'Cuádriceps', defaultSets: 3, defaultReps: '12-15', rpeTarget: 9, biomechanics: 'Aislamiento directo del recto femoral y vastos.', tips: ['Pausa de 1 seg arriba'] },
    { exerciseId: 'romanian-deadlift', name: 'Peso Muerto Rumano con Mancuernas', targetMuscle: 'Isquios', defaultSets: 4, defaultReps: '8-10', rpeTarget: 8.5, biomechanics: 'Bisagra de cadera empujando el glúteo hacia atrás.', tips: ['Barra o mancuernas pegadas a los muslos'] },
    { exerciseId: 'hip-thrust', name: 'Hip Thrust con Barra en Banco', targetMuscle: 'Glúteos', defaultSets: 4, defaultReps: '10-12', rpeTarget: 9, biomechanics: 'Extensión completa de cadera con retroversión pélvica arriba.', tips: ['Mirada hacia adelante arriba'] }
  ];

  function generatePersonalizedRoutine(profile) {
    return {
      name: 'Push / Pull / Legs (Personalizado)',
      days: [
        { dayName: 'Día 1: Push (Pecho/Hombro/Tríceps)', exercises: [EXERCISE_DATABASE[0], EXERCISE_DATABASE[1], EXERCISE_DATABASE[3], EXERCISE_DATABASE[4], EXERCISE_DATABASE[5]] },
        { dayName: 'Día 2: Pull (Espalda/Bíceps)', exercises: [EXERCISE_DATABASE[6], EXERCISE_DATABASE[7], EXERCISE_DATABASE[8], EXERCISE_DATABASE[9], EXERCISE_DATABASE[10]] },
        { dayName: 'Día 3: Legs (Pierna/Glúteo)', exercises: [EXERCISE_DATABASE[11], EXERCISE_DATABASE[12], EXERCISE_DATABASE[13], EXERCISE_DATABASE[14], EXERCISE_DATABASE[15]] }
      ]
    };
  }

  // ==========================================================================
  // 2. MEAL DATABASE & MEAL PLANNER
  // ==========================================================================
  const MEAL_DATABASE = [
    { id: 'b-oatmeal', name: 'Avena Proteica con Frutos Rojos y Crema de Cacahuete', category: 'Desayuno', calories: 450, protein: 38, carbs: 52, fat: 12, style: 'healthy', allergies: ['sin-lactosa', 'vegetariano'], ingredients: ['60g Avena integral', '30g Proteína de suero/vegana', '100g Frutos rojos', '15g Crema de cacahuete'] },
    { id: 'b-avocado-eggs', name: 'Tostadas de Masa Madre con Aguacate y Huevos Revueltos', category: 'Desayuno', calories: 420, protein: 26, carbs: 38, fat: 18, style: 'mediterraneo', allergies: ['sin-lactosa', 'vegetariano', 'sin-frutos-secos'], ingredients: ['80g Pan de masa madre', '2 Huevos + 2 Claras', '50g Aguacate', 'Aceite de oliva'] },
    { id: 'l-chicken-quinoa', name: 'Bowl Proteico de Pollo a la Parrilla con Quinoa y Verduras', category: 'Comida', calories: 580, protein: 52, carbs: 62, fat: 14, style: 'healthy', allergies: ['sin-gluten', 'sin-lactosa', 'sin-frutos-secos'], ingredients: ['180g Pechuga de pollo', '70g Quinoa', '100g Brócoli al vapor', 'Zanahoria y oliva'] },
    { id: 'l-salmon-basmati', name: 'Salmón al Horno con Arroz Basmati y Espárragos', category: 'Comida', calories: 620, protein: 44, carbs: 55, fat: 24, style: 'mediterraneo', allergies: ['sin-gluten', 'sin-lactosa', 'sin-frutos-secos'], ingredients: ['160g Filete de salmón', '60g Arroz Basmati', '120g Espárragos', 'Limón y eneldo'] },
    { id: 's-greek-yogurt', name: 'Yogur Griego 0% con Nueces y Canela', category: 'Merienda', calories: 260, protein: 28, carbs: 16, fat: 8, style: 'mediterraneo', allergies: ['sin-gluten', 'vegetariano'], ingredients: ['200g Yogur Griego 0%', '15g Nueces', 'Canela en polvo'] },
    { id: 'd-hake-potato', name: 'Lomo de Merluza con Patata Asada y Setas', category: 'Cena', calories: 410, protein: 42, carbs: 40, fat: 8, style: 'mediterraneo', allergies: ['sin-gluten', 'sin-lactosa', 'sin-frutos-secos'], ingredients: ['200g Lomo de merluza', '150g Patata cocida', '150g Setas al ajillo'] }
  ];

  let activeDayMeal = 'Lunes';
  let generatedWeeklyMenu = {};

  // ==========================================================================
  // 3. SCIENCE HUB DATA
  // ==========================================================================
  const SCIENCE_ARTICLES = [
    { title: 'Consenso ISSN: Proteína e Hipertrofia', category: 'ISSN Consensus 2023', excerpt: 'Ingesta óptima de 1.6 a 2.2 g/kg/día distribuida en 3-4 tomas de 0.4 g/kg.', tag: 'Hipertrofia' },
    { title: 'Volumen Objetivo y RPE/RIR', category: 'Journal of Strength Research', excerpt: '10 a 20 series semanales por grupo muscular cerca del fallo (RIR 1-3).', tag: 'Entrenamiento' },
    { title: 'Déficit Calórico y Retención Muscular', category: 'ACSM Position Stand', excerpt: 'Déficits moderados del 20% minimizan el catabolismo proteico.', tag: 'Nutrición' }
  ];

  // ==========================================================================
  // 4. MAIN APP INITIALIZATION & DOM EVENT BINDINGS
  // ==========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    initAuthStorage();
    initTabNavigation();
    initCalorieCalculator();
    initWorkoutPlanner();
    initMealPlanner();
    initScienceHub();
    initAITrainerChat();
    initRestTimer();
    initOneRepMaxCalc();
    initSupplementation();
    initHydrationTracker();
    initBodyMeasurements();
    initWhatsAppExport();
    initAutoReload();
  });

  // --------------------------------------------------------------------------
  // TAB NAVIGATION ENGINE
  // --------------------------------------------------------------------------
  function initTabNavigation() {
    const navBtns = document.querySelectorAll('.nav-btn, .mobile-nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    function switchTab(targetId) {
      if (targetId === 'tab-ai-chat') {
        const aiModal = document.getElementById('aiChatModal');
        if (aiModal) aiModal.classList.add('active');
        return;
      }

      if (!targetId) return;

      navBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(tc => tc.classList.remove('active'));

      document.querySelectorAll(`[data-tab="${targetId}"]`).forEach(b => b.classList.add('active'));

      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }

    navBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tid = btn.getAttribute('data-tab') || (btn.id === 'btnMobileAIChat' ? 'tab-ai-chat' : null);
        switchTab(tid);
      });
    });

    const btnOpenAIChatFromMeals = document.getElementById('btnOpenAIChatFromMeals');
    if (btnOpenAIChatFromMeals) {
      btnOpenAIChatFromMeals.addEventListener('click', () => switchTab('tab-ai-chat'));
    }

    const btnWorkoutAIChat = document.getElementById('btnWorkoutAIChat');
    if (btnWorkoutAIChat) {
      btnWorkoutAIChat.addEventListener('click', () => switchTab('tab-ai-chat'));
    }
  }

  // --------------------------------------------------------------------------
  // CALORIE CALCULATOR
  // --------------------------------------------------------------------------
  function initCalorieCalculator() {
    const form = document.getElementById('calculatorForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const gender = document.getElementById('gender').value;
      const age = parseInt(document.getElementById('age').value);
      const weight = parseFloat(document.getElementById('weight').value);
      const height = parseFloat(document.getElementById('height').value);
      const activityLevel = document.getElementById('activityLevel').value;
      const fitnessGoal = document.getElementById('fitnessGoal').value;

      let bmr = (10 * weight) + (6.25 * height) - (5 * age) + (gender === 'male' ? 5 : -161);
      const mults = { sedentary: 1.2, light: 1.375, moderate: 1.55, heavy: 1.725, athlete: 1.9 };
      let tdee = bmr * (mults[activityLevel] || 1.55);

      let targetKcal = tdee;
      if (fitnessGoal === 'deficit_moderate') targetKcal = tdee * 0.8;
      if (fitnessGoal === 'deficit_aggressive') targetKcal = tdee * 0.75;
      if (fitnessGoal === 'surplus_clean') targetKcal = tdee * 1.12;

      document.getElementById('resBMR').textContent = Math.round(bmr).toLocaleString();
      document.getElementById('resTDEE').textContent = Math.round(tdee).toLocaleString();
      document.getElementById('resTargetCalories').textContent = Math.round(targetKcal).toLocaleString();

      const profile = { gender, age, weight, height, activityLevel, fitnessGoal, bmr, tdee, targetKcal };
      localStorage.setItem('fitexpert_profile', JSON.stringify(profile));

      renderSupplementationGuide();
    });
  }

  // --------------------------------------------------------------------------
  // WORKOUT PLANNER & TRACKER
  // --------------------------------------------------------------------------
  let activeWorkoutDayIdx = 0;
  let currentRoutine = null;

  function initWorkoutPlanner() {
    loadRoutine();
    setupLogForm();
  }

  function loadRoutine() {
    currentRoutine = generatePersonalizedRoutine();
    renderRoutine();
  }

  function renderRoutine() {
    if (!currentRoutine) return;
    const container = document.getElementById('exerciseListContainer');
    const tabs = document.getElementById('workoutDayTabs');

    if (tabs) {
      tabs.innerHTML = '';
      currentRoutine.days.forEach((day, idx) => {
        const btn = document.createElement('button');
        btn.className = `day-tab-btn ${idx === activeWorkoutDayIdx ? 'active' : ''}`;
        btn.textContent = day.dayName;
        btn.addEventListener('click', () => {
          activeWorkoutDayIdx = idx;
          renderRoutine();
        });
        tabs.appendChild(btn);
      });
    }

    if (container) {
      container.innerHTML = '';
      const day = currentRoutine.days[activeWorkoutDayIdx];
      if (day) {
        day.exercises.forEach(ex => {
          const div = document.createElement('div');
          div.className = 'exercise-card';
          div.innerHTML = `
            <div style="width:100%;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <h4>${ex.name}</h4>
                <span class="badge badge-cyan">${ex.targetMuscle}</span>
              </div>
              <div class="ex-meta mt-1">
                <span><i class="fa-solid fa-layer-group"></i> ${ex.defaultSets} Series x ${ex.defaultReps}</span>
                <span><i class="fa-solid fa-gauge-high"></i> RPE ${ex.rpeTarget}</span>
              </div>
            </div>
          `;
          container.appendChild(div);
        });
      }
    }

    const select = document.getElementById('logExerciseSelect');
    if (select && currentRoutine.days[activeWorkoutDayIdx]) {
      select.innerHTML = '';
      currentRoutine.days[activeWorkoutDayIdx].exercises.forEach(ex => {
        const opt = document.createElement('option');
        opt.value = ex.name;
        opt.textContent = ex.name;
        select.appendChild(opt);
      });
    }
  }

  function setupLogForm() {
    const form = document.getElementById('workoutLogForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      startRestTimer(90);
    });
  }

  // --------------------------------------------------------------------------
  // MEAL PLANNER
  // --------------------------------------------------------------------------
  function initMealPlanner() {
    const nav = document.getElementById('weekDayNav');
    if (nav) {
      nav.querySelectorAll('.day-nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          nav.querySelectorAll('.day-nav-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          activeDayMeal = btn.getAttribute('data-day');
          renderMeals();
        });
      });
    }

    const form = document.getElementById('dietaryControlsForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const custom = document.getElementById('customAllergiesInput').value.trim();
        localStorage.setItem('fitexpert_allergies', custom);
        renderMeals();
      });
    }

    renderMeals();
  }

  function renderMeals() {
    const container = document.getElementById('mealsGridContainer');
    if (!container) return;

    const title = document.getElementById('activeDayMealTitle');
    if (title) title.innerHTML = `<i class="fa-solid fa-calendar-day"></i> Menú del Día: ${activeDayMeal}`;

    const custom = document.getElementById('customAllergiesInput') ? document.getElementById('customAllergiesInput').value.toLowerCase() : '';
    const forbidden = custom.split(/[,;]+/).map(s => s.trim()).filter(Boolean);

    const filtered = MEAL_DATABASE.filter(m => {
      if (forbidden.length === 0) return true;
      const text = (m.name + ' ' + m.ingredients.join(' ')).toLowerCase();
      return !forbidden.some(f => text.includes(f));
    });

    const displayList = filtered.length ? filtered : MEAL_DATABASE;

    container.innerHTML = displayList.map(meal => `
      <div class="meal-item-card">
        <div class="meal-cat"><i class="fa-solid fa-utensils"></i> ${meal.category}</div>
        <div class="meal-name">${meal.name}</div>
        <div class="meal-macros mb-2">
          <span style="color:var(--accent-cyan); font-weight:700;">${meal.calories} kcal</span>
          <span style="color:var(--accent-cyan);">P: ${meal.protein}g</span>
          <span style="color:var(--accent-emerald);">C: ${meal.carbs}g</span>
          <span style="color:var(--accent-amber);">G: ${meal.fat}g</span>
        </div>
        <div style="background:rgba(11,15,25,0.4); padding:6px 8px; border-radius:var(--radius-sm); font-size:11px; color:var(--text-muted);">
          <strong>Ingredientes:</strong> ${meal.ingredients.join(', ')}
        </div>
      </div>
    `).join('');
  }

  // --------------------------------------------------------------------------
  // SCIENCE HUB
  // --------------------------------------------------------------------------
  function initScienceHub() {
    const container = document.getElementById('scienceCardsContainer');
    if (!container) return;

    container.innerHTML = SCIENCE_ARTICLES.map(art => `
      <div class="card glass-card">
        <span class="badge badge-purple mb-2">${art.tag}</span>
        <h4 style="font-family:var(--font-heading); color:var(--text-main); font-size:14px; margin-bottom:4px;">${art.title}</h4>
        <small style="color:var(--accent-cyan); font-weight:600; display:block; margin-bottom:6px;">${art.category}</small>
        <p style="font-size:12px; color:var(--text-muted); line-height:1.4;">${art.excerpt}</p>
      </div>
    `).join('');
  }

  // --------------------------------------------------------------------------
  // AI TRAINER CHAT
  // --------------------------------------------------------------------------
  function initAITrainerChat() {
    const modal = document.getElementById('aiChatModal');
    const closeBtn = document.getElementById('btnCloseAIChat');
    const form = document.getElementById('aiChatForm');
    const input = document.getElementById('aiChatInput');
    const container = document.getElementById('aiChatMessages');
    const chips = document.getElementById('aiQuickChips');

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    }

    if (chips) {
      chips.addEventListener('click', (e) => {
        const chip = e.target.closest('.chat-chip');
        if (chip) {
          const msg = chip.getAttribute('data-msg');
          if (msg) processChatMessage(msg, container);
        }
      });
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (text) {
          input.value = '';
          processChatMessage(text, container);
        }
      });
    }
  }

  function processChatMessage(userText, container) {
    const userDiv = document.createElement('div');
    userDiv.className = 'chat-msg user';
    userDiv.innerHTML = `<div class="chat-bubble">${userText}</div>`;
    container.appendChild(userDiv);

    const typing = document.createElement('div');
    typing.className = 'chat-msg ai typing';
    typing.innerHTML = `<i class="fa-solid fa-robot"></i> <span>Analizando respuesta...</span>`;
    container.appendChild(typing);
    container.scrollTop = container.scrollHeight;

    setTimeout(() => {
      typing.remove();
      const aiDiv = document.createElement('div');
      aiDiv.className = 'chat-msg ai';
      aiDiv.innerHTML = `<div class="chat-avatar"><i class="fa-solid fa-robot"></i></div><div class="chat-bubble">¡Entendido! He procesado tu solicitud. He adaptado tus preferencias en tu perfil.</div>`;
      container.appendChild(aiDiv);
      container.scrollTop = container.scrollHeight;
    }, 600);
  }

  // --------------------------------------------------------------------------
  // REST TIMER
  // --------------------------------------------------------------------------
  let timerInterval = null;
  function initRestTimer() {
    const widget = document.getElementById('restTimerWidget');
    const btnClose = document.getElementById('btnCloseTimer');
    const btnSkip = document.getElementById('btnTimerSkip');
    const btnAdd30 = document.getElementById('btnTimerAdd30');

    if (btnClose && widget) btnClose.addEventListener('click', () => widget.style.display = 'none');
    if (btnSkip && widget) btnSkip.addEventListener('click', () => widget.style.display = 'none');
    if (btnAdd30) {
      btnAdd30.addEventListener('click', () => {
        // Add 30s logic
      });
    }
  }

  function startRestTimer(seconds) {
    const widget = document.getElementById('restTimerWidget');
    const display = document.getElementById('timerCountdownDisplay');
    if (!widget || !display) return;

    widget.style.display = 'flex';
    let rem = seconds;
    display.textContent = `01:${rem < 10 ? '0' : ''}${rem}`;

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      rem--;
      display.textContent = `00:${rem < 10 ? '0' : ''}${rem}`;
      if (rem <= 0) {
        clearInterval(timerInterval);
        widget.style.display = 'none';
      }
    }, 1000);
  }

  // --------------------------------------------------------------------------
  // 1RM CALCULATOR & OTHER TOOLS
  // --------------------------------------------------------------------------
  function initOneRepMaxCalc() {
    const form = document.getElementById('oneRepMaxForm');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const weight = parseFloat(document.getElementById('oneRepWeight').value) || 0;
      const reps = parseInt(document.getElementById('oneRepReps').value) || 0;
      const max = Math.round(weight * (1 + reps / 30));
      const res = document.getElementById('res1RMValue');
      if (res) res.textContent = `${max} kg`;
    });
  }

  function initSupplementation() { renderSupplementationGuide(); }

  function renderSupplementationGuide() {
    const container = document.getElementById('supplementationContainer');
    if (!container) return;
    container.innerHTML = `
      <div style="font-size:12px; color:var(--text-main);">
        <strong>Creatina Monohidrato:</strong> 5g / día | <strong>Cafeína:</strong> 200mg Pre-Entreno | <strong>Proteína Whey:</strong> 30g Post-Entreno
      </div>
    `;
  }

  function initHydrationTracker() {
    let waterML = parseInt(localStorage.getItem('fitexpert_water_ml')) || 0;
    const updateUI = () => {
      const val = document.getElementById('resWaterValue');
      const bar = document.getElementById('barWaterFill');
      if (val) val.textContent = `${(waterML/1000).toFixed(2)} L / 3.00 L`;
      if (bar) bar.style.width = `${Math.min(100, (waterML/3000)*100)}%`;
    };

    const add250 = document.getElementById('btnWaterAdd250');
    const add500 = document.getElementById('btnWaterAdd500');
    const reset = document.getElementById('btnWaterReset');

    if (add250) add250.addEventListener('click', () => { waterML += 250; localStorage.setItem('fitexpert_water_ml', waterML); updateUI(); });
    if (add500) add500.addEventListener('click', () => { waterML += 500; localStorage.setItem('fitexpert_water_ml', waterML); updateUI(); });
    if (reset) reset.addEventListener('click', () => { waterML = 0; localStorage.setItem('fitexpert_water_ml', 0); updateUI(); });

    updateUI();
  }

  function initBodyMeasurements() {
    const form = document.getElementById('bodyMeasurementsForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Medidas corporales guardadas.');
      });
    }
  }

  function initWhatsAppExport() {
    const btn = document.getElementById('btnShareGroceryWhatsApp');
    if (btn) {
      btn.addEventListener('click', () => {
        const text = encodeURIComponent('🛒 Mi Lista de la Compra FitExpert Studio');
        window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
      });
    }
  }

  function initAuthStorage() {
    const btnSetup = document.getElementById('btnSetupPassword');
    const modal = document.getElementById('authModal');
    const btnClose = document.getElementById('btnCloseAuthModal');

    if (btnSetup && modal) {
      btnSetup.addEventListener('click', () => modal.classList.add('active'));
    }
    if (btnClose && modal) {
      btnClose.addEventListener('click', () => modal.classList.remove('active'));
    }
  }

  function initAutoReload() {
    const btnReload = document.getElementById('btnForceReload');
    const icon = document.getElementById('reloadIcon');
    if (btnReload) {
      btnReload.addEventListener('click', () => {
        if (icon) icon.classList.add('fa-spin');
        setTimeout(() => {
          window.location.href = window.location.href.split('?')[0] + '?v=' + Date.now();
        }, 300);
      });
    }
  }

})();
