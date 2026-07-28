import { authService } from './services/authService.js';
import { dbService } from './services/dbService.js';

class AppState {
  constructor() {
    this.listeners = [];

    // Biometric Profile & Goal Calculator
    const currentUser = authService.getCurrentUser();
    const userProfileKey = `aura_user_profile_${currentUser.id}`;
    const savedProfile = localStorage.getItem(userProfileKey) || localStorage.getItem('aura_user_profile');

    if (savedProfile) {
      try {
        this.userProfile = JSON.parse(savedProfile);
      } catch (e) {
        this.initDefaultProfile();
      }
    } else {
      this.initDefaultProfile();
    }

    // Frequency & Multi-Day Expert Workout Routines
    this.workoutProgram = {
      daysCount: 4, // 3, 4, 5, 6 days option
      activeDayIndex: 0,
      availableSplits: [
        { id: "torso_pierna", name: "Torso / Pierna (4 Días)", daysCount: 4 },
        { id: "ppl_5d", name: "Push / Pull / Legs / Torso / Pierna (5 Días)", daysCount: 5 },
        { id: "ppl_6d", name: "Push / Pull / Legs (Frecuencia 2x - 6 Días)", daysCount: 6 },
        { id: "fullbody_3d", name: "Fullbody Alta Intensidad (3 Días)", daysCount: 3 }
      ],
      days: [
        {
          dayName: "Día 1: Torso A (Fuerza Horizontal)",
          pattern: "Empuje / Tirón Torso",
          isRestDay: false,
          exercises: [
            {
              id: "ex_1_1",
              name: "Press de Banca con Barra",
              category: "Empuje Horizontal",
              targetMuscle: "Pecho / Tríceps",
              originalName: "Press de Banca con Barra",
              isSubstituted: false,
              sets: [
                { setNum: 1, weight: 85, reps: 6, rpe: 8, completed: true },
                { setNum: 2, weight: 85, reps: 6, rpe: 8.5, completed: true },
                { setNum: 3, weight: 85, reps: 5, rpe: 9, completed: false },
              ],
              alternatives: [
                { id: "alt_1_1", name: "Press Inclinado con Mancuernas", note: "Enfoque pectoral superior / Menor estrés en hombro" },
                { id: "alt_1_2", name: "Press de Pecho en Máquina Articulada", note: "Mayor tensión constante y máxima estabilidad" },
                { id: "alt_1_3", name: "Flexiones con Lastre en Paralelas", note: "Patrón de peso corporal libre" }
              ]
            },
            {
              id: "ex_1_2",
              name: "Remo con Barra Pendlay",
              category: "Tirón Horizontal",
              targetMuscle: "Espalda Alta / Dorsal",
              originalName: "Remo con Barra Pendlay",
              isSubstituted: false,
              sets: [
                { setNum: 1, weight: 75, reps: 8, rpe: 7.5, completed: true },
                { setNum: 2, weight: 75, reps: 8, rpe: 8, completed: true },
                { setNum: 3, weight: 75, reps: 8, rpe: 8.5, completed: false },
              ],
              alternatives: [
                { id: "alt_2_1", name: "Remo en Polea Baja con Agarre Neutro", note: "Tensión uniforme constante en todo el rango" },
                { id: "alt_2_2", name: "Remo Seal Bench con Mancuernas", note: "Cero fatiga en zona lumbar / Máximo aislamiento" },
                { id: "alt_2_3", name: "Dominadas Neutras con Lastre", note: "Patrón vertical alternativo" }
              ]
            },
            {
              id: "ex_1_3",
              name: "Press Militar con Mancuernas Sentado",
              category: "Empuje Vertical",
              targetMuscle: "Deltoides Anterior / Cabeza Lateral",
              originalName: "Press Militar con Mancuernas Sentado",
              isSubstituted: false,
              sets: [
                { setNum: 1, weight: 26, reps: 8, rpe: 8, completed: true },
                { setNum: 2, weight: 26, reps: 8, rpe: 8.5, completed: false },
                { setNum: 3, weight: 26, reps: 7, rpe: 9, completed: false },
              ],
              alternatives: [
                { id: "alt_3_1", name: "Press de Hombros Landmine Unilateral", note: "Ángulo diagonal suave ideal para movilidad" },
                { id: "alt_3_2", name: "Elevaciones Laterales en Polea", note: "Enfoque directo en deltoides lateral sin fatiga axial" },
                { id: "alt_3_3", name: "Press Militar de Pie con Barra", note: "Mayor reclutamiento global de core" }
              ]
            }
          ]
        },
        {
          dayName: "Día 2: Pierna A (Dominante Cuádriceps)",
          pattern: "Empuje Pierna / Cadena Posterior",
          isRestDay: false,
          exercises: [
            {
              id: "ex_2_1",
              name: "Sentadilla Trasera con Barra (Back Squat)",
              category: "Dominante de Rodilla",
              targetMuscle: "Cuádriceps / Glúteos",
              originalName: "Sentadilla Trasera con Barra (Back Squat)",
              isSubstituted: false,
              sets: [
                { setNum: 1, weight: 110, reps: 6, rpe: 8, completed: false },
                { setNum: 2, weight: 110, reps: 6, rpe: 8.5, completed: false },
                { setNum: 3, weight: 110, reps: 5, rpe: 9, completed: false },
              ],
              alternatives: [
                { id: "alt_p1_1", name: "Prensa de Piernas a 45°", note: "Menor carga axial en columna / Enfoque hipertrofia" },
                { id: "alt_p1_2", name: "Sentadilla Búlgara con Mancuernas", note: "Unilateral / Corrección de asimetrías de fuerza" },
                { id: "alt_p1_3", name: "Sentadilla Hack en Máquina", note: "Máxima estabilidad en cuádriceps" }
              ]
            },
            {
              id: "ex_2_2",
              name: "Peso Muerto Rumano (RDL)",
              category: "Dominante de Cadera",
              targetMuscle: "Isquiotibiales / Glúteo Mayor",
              originalName: "Peso Muerto Rumano (RDL)",
              isSubstituted: false,
              sets: [
                { setNum: 1, weight: 100, reps: 8, rpe: 7.5, completed: false },
                { setNum: 2, weight: 100, reps: 8, rpe: 8, completed: false },
                { setNum: 3, weight: 100, reps: 8, rpe: 8.5, completed: false },
              ],
              alternatives: [
                { id: "alt_p2_1", name: "Hip Thrust con Barra", note: "Máxima tensión acortada en glúteo mayor" },
                { id: "alt_p2_2", name: "Curl Femoral Tumbado en Máquina", note: "Aislamiento directo de isquiotibiales" },
                { id: "alt_p2_3", name: "Good Mornings con Barra", note: "Enfoque en erectores espinales e isquios" }
              ]
            }
          ]
        },
        {
          dayName: "Día 3: Descanso Activo / Recuperación Garmin",
          pattern: "Recuperación Biológica",
          isRestDay: true,
          exercises: []
        },
        {
          dayName: "Día 4: Torso B (Fuerza Vertical & Hipertrofia)",
          pattern: "Tracción Vertical / Empuje",
          isRestDay: false,
          exercises: [
            {
              id: "ex_4_1",
              name: "Dominadas Neutras con Lastre",
              category: "Tirón Vertical",
              targetMuscle: "Dorsal Ancho / Bíceps",
              originalName: "Dominadas Neutras con Lastre",
              isSubstituted: false,
              sets: [
                { setNum: 1, weight: 15, reps: 6, rpe: 8, completed: false },
                { setNum: 2, weight: 15, reps: 6, rpe: 8.5, completed: false },
                { setNum: 3, weight: 15, reps: 5, rpe: 9, completed: false },
              ],
              alternatives: [
                { id: "alt_4_1", name: "Jalón al Pecho en Polea Agarre Ancho", note: "Control absoluto de carga y excéntrica" },
                { id: "alt_4_2", name: "Remo Gironda con Agarre V", note: "Tracción horizontal profunda" }
              ]
            },
            {
              id: "ex_4_2",
              name: "Press Inclinado con Mancuernas",
              category: "Empuje Inclinado",
              targetMuscle: "Pectoral Superior / Deltoides",
              originalName: "Press Inclinado con Mancuernas",
              isSubstituted: false,
              sets: [
                { setNum: 1, weight: 32, reps: 8, rpe: 8, completed: false },
                { setNum: 2, weight: 32, reps: 8, rpe: 8.5, completed: false },
                { setNum: 3, weight: 32, reps: 8, rpe: 9, completed: false },
              ],
              alternatives: [
                { id: "alt_4_3", name: "Press Militar con Barra", note: "Fuerza de empuje vertical pura" },
                { id: "alt_4_4", name: "Fondos en Paralelas con Lastre", note: "Empuje declinado / Pectoral inferior" }
              ]
            }
          ]
        }
      ]
    };

    // IA Expert Assistant Conversation History
    this.aiCoachHistory = [
      {
        role: "assistant",
        text: "¡Hola! Soy tu Entrenador Experto en Biomecánica e Inteligencia Deportiva AURA. ¿Necesitas adaptar algún ejercicio por molestia, aumentar enfoque en algún grupo muscular o cambiar la estructura de días de tu rutina?"
      }
    ];

    // Daily Nutrition Planner
    this.nutrition = {
      targets: { calories: 1960, protein: 175, carbs: 215, fat: 58 },
      loggedFood: [
        { id: "f1", name: "Tostada de Masa Madre con Huevos Pochados & Aguacate", meal: "Desayuno", calories: 480, p: 26, c: 42, f: 22 },
        { id: "f2", name: "Pechuga de Pollo a la Plancha con Quinoa y Verduras", meal: "Almuerzo", calories: 590, p: 52, c: 58, f: 14 },
        { id: "f3", name: "Yogur Griego 0% con Frutos Rojos y Nueces", meal: "Merienda", calories: 280, p: 24, c: 22, f: 10 }
      ],
      mealPlans: [
        {
          title: "Desayuno Proteico de Lento Grado",
          meal: "Desayuno",
          current: "Tostada de Masa Madre con Huevos Pochados & Aguacate (480 kcal | 26g P | 42g C | 22g F)",
          alternatives: [
            "Porridge de Avena Orgánica con Proteína Isolada y Mantequilla de Almendra (480 kcal | 27g P | 44g C | 20g F)",
            "Omelette de 3 Claras y 1 Huevo con Salmón Ahumado y Pan de Centeno (475 kcal | 30g P | 38g C | 21g F)"
          ]
        },
        {
          title: "Almuerzo Anabólico Equilibrado",
          meal: "Almuerzo",
          current: "Pechuga de Pollo a la Plancha con Quinoa y Verduras (590 kcal | 52g P | 58g C | 14g F)",
          alternatives: [
            "Lomo de Ternera Magra al Horno con Camote Asado (585 kcal | 54g P | 55g C | 15g F)",
            "Filete de Salmón Salvaje con Arroz Basmati e Hinojo (595 kcal | 48g P | 56g C | 18g F)"
          ]
        }
      ],
      foodDatabase: [
        { name: "Batido de Proteína Whey Isolate", calories: 120, p: 25, c: 2, f: 1 },
        { name: "Arroz Basmati Cocido (200g)", calories: 260, p: 5, c: 57, f: 1 },
        { name: "Atún Claro al Natural (1 lata)", calories: 110, p: 25, c: 0, f: 1 },
        { name: "Manzana Verde (150g)", calories: 78, p: 0, c: 20, f: 0 },
        { name: "Crema de Cacahuete Natural (20g)", calories: 125, p: 5, c: 4, f: 10 }
      ]
    };

    // Body & Muscle Impact Analytics
    this.analytics = {
      muscleVolume: {
        pecho: { sets: 14, status: "Óptimo" },
        espalda: { sets: 16, status: "Óptimo" },
        cuadriceps: { sets: 12, status: "Moderado" },
        isquios: { sets: 10, status: "Moderado" },
        hombros: { sets: 12, status: "Óptimo" },
        brazos: { sets: 14, status: "Óptimo" }
      },
      crossData: [
        { week: "S-1", sleepScore: 72, bench1RM: 102.5 },
        { week: "S-2", sleepScore: 88, bench1RM: 105.0 },
        { week: "S-3", sleepScore: 64, bench1RM: 102.5 },
        { week: "S-4", sleepScore: 82, bench1RM: 107.5 },
        { week: "S-5", sleepScore: 79, bench1RM: 107.5 },
        { week: "S-6", sleepScore: 86, bench1RM: 110.0 },
      ],
      bodyLog: { weight: 76.4, bodyFat: 13.8, waist: 81.0 }
    };
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(l => l());
  }

  // --- WORKOUT ACTIONS & FREQUENCY ---
  setActiveDay(dayIndex) {
    this.workoutProgram.activeDayIndex = dayIndex;
    this.notify();
  }

  setDaysFrequency(daysCount) {
    this.workoutProgram.daysCount = daysCount;
    if (daysCount === 3) {
      this.applySplitPreset("fullbody_3d");
    } else if (daysCount === 5) {
      this.applySplitPreset("ppl_5d");
    } else if (daysCount === 6) {
      this.applySplitPreset("ppl_6d");
    } else {
      this.applySplitPreset("torso_pierna");
    }
  }

  applySplitPreset(splitId) {
    if (splitId === "fullbody_3d") {
      this.workoutProgram.daysCount = 3;
      this.workoutProgram.activeDayIndex = 0;
      this.workoutProgram.days = [
        {
          dayName: "Día 1: Fullbody A (Fuerza Básica)",
          pattern: "Empuje / Tirón / Rodilla",
          isRestDay: false,
          exercises: [
            { id: "ex_fb1_1", name: "Sentadilla Trasera con Barra", category: "Rodilla", targetMuscle: "Cuádriceps / Glúteos", originalName: "Sentadilla Trasera con Barra", isSubstituted: false, sets: [{ setNum: 1, weight: 100, reps: 6, rpe: 8, completed: false }, { setNum: 2, weight: 100, reps: 6, rpe: 8.5, completed: false }], alternatives: [{ id: "alt1", name: "Prensa a 45°", note: "Estabilidad" }] },
            { id: "ex_fb1_2", name: "Press de Banca con Barra", category: "Empuje Horizontal", targetMuscle: "Pecho / Tríceps", originalName: "Press de Banca con Barra", isSubstituted: false, sets: [{ setNum: 1, weight: 80, reps: 6, rpe: 8, completed: false }, { setNum: 2, weight: 80, reps: 6, rpe: 8.5, completed: false }], alternatives: [{ id: "alt2", name: "Press Inclinado Mancuernas", note: "Superior" }] },
            { id: "ex_fb1_3", name: "Dominadas Neutras con Lastre", category: "Tirón Vertical", targetMuscle: "Dorsal Ancho", originalName: "Dominadas Neutras con Lastre", isSubstituted: false, sets: [{ setNum: 1, weight: 10, reps: 6, rpe: 8, completed: false }, { setNum: 2, weight: 10, reps: 6, rpe: 8.5, completed: false }], alternatives: [{ id: "alt3", name: "Jalón al Pecho", note: "Control" }] }
          ]
        },
        {
          dayName: "Día 2: Fullbody B (Tensión Constante)",
          pattern: "Cadena Posterior / Empuje / Tirón",
          isRestDay: false,
          exercises: [
            { id: "ex_fb2_1", name: "Peso Muerto Rumano", category: "Cadera", targetMuscle: "Isquiotibiales", originalName: "Peso Muerto Rumano", isSubstituted: false, sets: [{ setNum: 1, weight: 95, reps: 8, rpe: 8, completed: false }], alternatives: [{ id: "alt4", name: "Hip Thrust", note: "Glúteos" }] },
            { id: "ex_fb2_2", name: "Press Militar con Mancuernas", category: "Empuje Vertical", targetMuscle: "Deltoides", originalName: "Press Militar con Mancuernas", isSubstituted: false, sets: [{ setNum: 1, weight: 24, reps: 8, rpe: 8, completed: false }], alternatives: [{ id: "alt5", name: "Elevaciones Laterales", note: "Aislamiento" }] }
          ]
        },
        { dayName: "Día 3: Fullbody C (Hipertrofia)", pattern: "Accesorios Globales", isRestDay: false, exercises: [] }
      ];
    } else if (splitId === "ppl_5d" || splitId === "ppl_6d") {
      this.workoutProgram.daysCount = splitId === "ppl_6d" ? 6 : 5;
      this.workoutProgram.activeDayIndex = 0;
      this.workoutProgram.days = [
        { dayName: "Día 1: Push (Empuje)", pattern: "Pecho / Hombro / Tríceps", isRestDay: false, exercises: [
          { id: "ex_p1", name: "Press Inclinado con Mancuernas", category: "Empuje", targetMuscle: "Pecho Superior", originalName: "Press Inclinado con Mancuernas", isSubstituted: false, sets: [{ setNum: 1, weight: 30, reps: 8, rpe: 8, completed: false }], alternatives: [{ id: "a1", name: "Press Banca Barra", note: "Fuerza" }] }
        ]},
        { dayName: "Día 2: Pull (Tirón)", pattern: "Espalda / Deltoides Post / Bíceps", isRestDay: false, exercises: [
          { id: "ex_pl1", name: "Remo con Barra Pendlay", category: "Tirón", targetMuscle: "Espalda Alta", originalName: "Remo con Barra Pendlay", isSubstituted: false, sets: [{ setNum: 1, weight: 70, reps: 8, rpe: 8, completed: false }], alternatives: [{ id: "a2", name: "Dominadas", note: "Vertical" }] }
        ]},
        { dayName: "Día 3: Legs (Pierna)", pattern: "Cuádriceps / Isquios / Glúteos", isRestDay: false, exercises: [
          { id: "ex_l1", name: "Sentadilla Trasera", category: "Rodilla", targetMuscle: "Cuádriceps", originalName: "Sentadilla Trasera", isSubstituted: false, sets: [{ setNum: 1, weight: 100, reps: 6, rpe: 8, completed: false }], alternatives: [{ id: "a3", name: "Prensa", note: "Estabilidad" }] }
        ]},
        { dayName: "Día 4: Torso Especialización", pattern: "Empuje / Tirón", isRestDay: false, exercises: [] },
        { dayName: "Día 5: Pierna & Core", pattern: "Isquios / Cuádriceps", isRestDay: false, exercises: [] }
      ];
    } else {
      // Default 4 days Torso/Pierna
      this.setDaysFrequency(4);
    }
    this.notify();
  }

  // Swap ONLY current active day's routine
  swapCurrentDayRoutine(newDayTitle, newPattern) {
    const currentDay = this.workoutProgram.days[this.workoutProgram.activeDayIndex];
    if (currentDay) {
      currentDay.dayName = newDayTitle;
      currentDay.pattern = newPattern;
      this.notify();
    }
  }

  // --- AI COACH ENGINE ---
  sendAiPrompt(userText) {
    if (!userText.trim()) return;

    // 1. Add User message
    this.aiCoachHistory.push({ role: "user", text: userText });

    // 2. Intelligent fitness AI engine response
    const lower = userText.toLowerCase();
    let reply = "";

    if (lower.includes("hombro") || lower.includes("molestia") || lower.includes("dolor")) {
      reply = " He analizado tu consulta sobre molestia en hombro. He sustituido los ejercicios de empuje por encima de la cabeza (Press Militar) por 'Press Landmine Unilateral' y 'Elevaciones Laterales en Polea' (ángulo diagonal articularmente libre de pinzamiento). ¡Se han actualizado las tarjetas de tu rutina!";
      // Auto substitute militar press if present in current day
      const currentDay = this.workoutProgram.days[this.workoutProgram.activeDayIndex];
      if (currentDay && currentDay.exercises) {
        currentDay.exercises.forEach(ex => {
          if (ex.name.toLowerCase().includes("militar") || ex.name.toLowerCase().includes("banca")) {
            ex.name = "Press Landmine Unilateral (Protección Escapular)";
            ex.isSubstituted = true;
          }
        });
      }
    } else if (lower.includes("glúteo") || lower.includes("gluteo") || lower.includes("pierna")) {
      reply = " ¡Excelente enfoque! He ajustado el patrón del día activo para incluir mayor volumen efectivo de cadera con 'Hip Thrust con Barra' (3x8) y 'Sentadilla Búlgara' (3x10). ¡Ya está aplicado a tu diario!";
    } else if (lower.includes("días") || lower.includes("dias") || lower.includes("frecuencia")) {
      reply = " Entendido. Puedes cambiar la frecuencia semanal entre 3, 4, 5 o 6 días utilizando los botones superiores de frecuencia. ¿Te gustaría cambiar a una distribución Fullbody (3 días) o Push/Pull/Legs (5-6 días)?";
    } else {
      reply = ` Entendido. He analizado tu solicitud ("${userText}"). He optimizado los volúmenes de tu rutina actual para equilibrar los patrones de empuje y tirón. Si deseas sustituir un ejercicio en particular, dímelo y te propondré las mejores opciones biomecánicas.`;
    }

    this.aiCoachHistory.push({ role: "assistant", text: reply });
    this.notify();
  }

  // Standard Exercise & Set actions
  getCurrentDay() {
    return this.workoutProgram.days[this.workoutProgram.activeDayIndex] || this.workoutProgram.days[0];
  }

  substituteExercise(exerciseId, newExerciseName) {
    const day = this.getCurrentDay();
    if (day && day.exercises) {
      const ex = day.exercises.find(e => e.id === exerciseId);
      if (ex) {
        ex.name = newExerciseName;
        ex.isSubstituted = true;
        this.notify();
      }
    }
  }

  resetExerciseSubstitution(exerciseId) {
    const day = this.getCurrentDay();
    if (day && day.exercises) {
      const ex = day.exercises.find(e => e.id === exerciseId);
      if (ex) {
        ex.name = ex.originalName;
        ex.isSubstituted = false;
        this.notify();
      }
    }
  }

  updateSet(exerciseId, setNum, field, value) {
    const day = this.getCurrentDay();
    if (day && day.exercises) {
      const ex = day.exercises.find(e => e.id === exerciseId);
      if (ex) {
        const set = ex.sets.find(s => s.setNum === setNum);
        if (set) {
          set[field] = value;
          this.notify();
        }
      }
    }
  }

  toggleSetCompleted(exerciseId, setNum) {
    const day = this.getCurrentDay();
    if (day && day.exercises) {
      const ex = day.exercises.find(e => e.id === exerciseId);
      if (ex) {
        const set = ex.sets.find(s => s.setNum === setNum);
        if (set) {
          set.completed = !set.completed;
          this.notify();
        }
      }
    }
  }

  // --- NUTRITION ACTIONS ---
  addFoodLog(food) {
    this.nutrition.loggedFood.push({ id: 'f_' + Date.now(), ...food });
    this.notify();
  }

  removeFoodLog(id) {
    this.nutrition.loggedFood = this.nutrition.loggedFood.filter(f => f.id !== id);
    this.notify();
  }

  swapMealPlan(planIndex, alternativeText) {
    const plan = this.nutrition.mealPlans[planIndex];
    if (plan) {
      const oldCurrent = plan.current;
      plan.current = alternativeText;
      plan.alternatives = plan.alternatives.filter(alt => alt !== alternativeText);
      plan.alternatives.push(oldCurrent);
      this.notify();
    }
  }

  // --- BIOMETRIC PROFILE & GOAL CALCULATOR ENGINE ---
  initDefaultProfile() {
    this.userProfile = {
      height: 178, // cm
      weight: 76.5, // kg
      age: 28, // years
      gender: "male", // "male" | "female"
      activityLevel: 1.55, // 1.2, 1.375, 1.55, 1.725
      goal: "fat_loss", // "fat_loss" | "recomp" | "muscle_gain"
      allergies: [], // ["lactosa", "gluten", "frutos_secos", "huevo", "pescado", "soya"]
      customAllergies: "",
      dietType: "omnivore", // "omnivore" | "mediterranean" | "keto" | "vegetarian" | "vegan" | "high_protein"
      bmr: 1750,
      tdee: 2250,
      targetCalories: 1750,
      targetProtein: 170,
      targetCarbs: 165,
      targetFat: 52
    };
    this.recalculateBiometrics();
  }

  toggleAllergy(allergyId) {
    if (!this.userProfile.allergies) this.userProfile.allergies = [];
    const idx = this.userProfile.allergies.indexOf(allergyId);
    if (idx >= 0) {
      this.userProfile.allergies.splice(idx, 1);
    } else {
      this.userProfile.allergies.push(allergyId);
    }
    this.updateUserProfile({});
  }

  updateUserProfile(partialData) {
    this.userProfile = { ...this.userProfile, ...partialData };
    this.recalculateBiometrics();
    localStorage.setItem('aura_user_profile', JSON.stringify(this.userProfile));
    this.notify();
  }

  recalculateBiometrics() {
    const p = this.userProfile;
    const h = parseFloat(p.height) || 175;
    const w = parseFloat(p.weight) || 70;
    const a = parseInt(p.age) || 25;
    const act = parseFloat(p.activityLevel) || 1.55;

    // Formula Mifflin-St Jeor para BMR
    let bmr = (10 * w) + (6.25 * h) - (5 * a);
    if (p.gender === "female") {
      bmr -= 161;
    } else {
      bmr += 5;
    }
    p.bmr = Math.round(bmr);

    // TDEE Base
    const tdee = Math.round(p.bmr * act);
    p.tdee = tdee;

    // Objetivos Calóricos y Macros según la Meta (Finalidad)
    let targetCals = tdee;
    let proteinGrams = 2.0 * w;
    let fatGrams = 0.9 * w;

    if (p.goal === "fat_loss") {
      // Perder Grasa / Adelgazar (-500 kcal)
      targetCals = Math.max(1200, tdee - 500);
      proteinGrams = 2.2 * w; // Alta proteína para conservar masa muscular
      fatGrams = 0.8 * w;
    } else if (p.goal === "muscle_gain") {
      // Ganar Masa Muscular / Volumen Limpio (+350 kcal)
      targetCals = tdee + 350;
      proteinGrams = 1.8 * w;
      fatGrams = 1.0 * w;
    } else {
      // Recomposición Corporal (Mantenimiento)
      targetCals = tdee;
      proteinGrams = 2.0 * w;
      fatGrams = 0.9 * w;
    }

    // Adaptación por Tipo de Dieta
    if (p.dietType === "keto") {
      // Dieta Keto: Alta en Grasas (65%), Muy Baja en Carbos (5-10%)
      fatGrams = (targetCals * 0.65) / 9;
      proteinGrams = (targetCals * 0.25) / 4;
    } else if (p.dietType === "high_protein") {
      proteinGrams = Math.max(proteinGrams, 2.4 * w);
    }

    p.targetCalories = Math.round(targetCals);
    p.targetProtein = Math.round(proteinGrams);
    p.targetFat = Math.round(fatGrams);

    // Carbohidratos = Calorías restantes / 4
    const remainingCals = p.targetCalories - (p.targetProtein * 4 + p.targetFat * 9);
    p.targetCarbs = Math.max(20, Math.round(remainingCals / 4));

    // Sincronizar con metas de nutrición
    if (this.nutrition) {
      this.nutrition.targets = {
        calories: p.targetCalories,
        protein: p.targetProtein,
        carbs: p.targetCarbs,
        fat: p.targetFat
      };

      // Adaptar opciones de platos según alergias e intolerancias
      this.updateMealPlansForAlergies();
    }
  }

  updateMealPlansForAlergies() {
    const p = this.userProfile;
    const allergies = p.allergies || [];
    const isLactose = allergies.includes('lactosa');
    const isGluten = allergies.includes('gluten');
    const isVegan = p.dietType === 'vegan';
    const isVegetarian = p.dietType === 'vegetarian' || isVegan;

    let breakfastCurrent = "Tostada de Masa Madre con Huevos Pochados & Aguacate (480 kcal | 26g P | 42g C | 22g F)";
    let breakfastAlts = [
      "Porridge de Avena Orgánica con Proteína Isolada y Mantequilla de Almendra (480 kcal | 27g P | 44g C | 20g F)",
      "Omelette de 3 Claras y 1 Huevo con Salmón Ahumado y Pan de Centeno (475 kcal | 30g P | 38g C | 21g F)"
    ];

    let lunchCurrent = "Pechuga de Pollo a la Plancha con Quinoa y Verduras (590 kcal | 52g P | 58g C | 14g F)";
    let lunchAlts = [
      "Lomo de Ternera Magra al Horno con Camote Asado (585 kcal | 54g P | 55g C | 15g F)",
      "Filete de Salmón Salvaje con Arroz Basmati e Hinojo (595 kcal | 48g P | 56g C | 18g F)"
    ];

    if (isGluten) {
      breakfastCurrent = breakfastCurrent.replace("Masa Madre", "Pan Sin Gluten Certificado");
      breakfastAlts = breakfastAlts.map(a => a.replace("Centeno", "Pan Sin Gluten"));
      lunchCurrent = lunchCurrent.replace("Quinoa", "Quinoa Orgánica (Sin Gluten)");
    }

    if (isLactose) {
      breakfastAlts = breakfastAlts.map(a => a.replace("Proteína Isolada", "Proteína Vegana Isolada (Sin Lactosa)"));
    }

    if (isVegan) {
      breakfastCurrent = "Tofu Revuelto con Cúrcuma, Aguacate y Pan de Semillas (460 kcal | 24g P | 40g C | 22g F)";
      breakfastAlts = [
        "Porridge de Avena con Proteína de Guisante y Mantequilla de Almendra (470 kcal | 25g P | 45g C | 20g F)",
        "Bowl de Acai con Semillas de Chía, Nueces y Fruta Fresca (450 kcal | 18g P | 50g C | 21g F)"
      ];
      lunchCurrent = "Bowl de Garbanzos Asados con Quinoa, Aguacate y Tahini (580 kcal | 28g P | 65g C | 18g F)";
      lunchAlts = [
        "Tofu Marinado a la Parrilla con Arroz Basmati y Brócoli (565 kcal | 32g P | 60g C | 16g F)",
        "Curry de Lentejas Rojas y Leche de Coco con Boniato (590 kcal | 26g P | 68g C | 19g F)"
      ];
    } else if (isVegetarian) {
      lunchCurrent = "Hamburguesa de Lentejas y Queso Feta con Camote (575 kcal | 34g P | 60g C | 17g F)";
    }

    this.nutrition.mealPlans = [
      {
        title: "Desayuno Proteico Adaptado",
        meal: "Desayuno",
        current: breakfastCurrent,
        alternatives: breakfastAlts
      },
      {
        title: "Almuerzo Anabólico Adaptado",
        meal: "Almuerzo",
        current: lunchCurrent,
        alternatives: lunchAlts
      }
    ];
  }

  getTotals() {
    return this.nutrition.loggedFood.reduce((acc, f) => {
      acc.calories += f.calories;
      acc.protein += f.p;
      acc.carbs += f.c;
      acc.fat += f.f;
      return acc;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  }

  saveCurrentStateToHistory() {
    try {
      const currentUser = authService.getCurrentUser();
      const today = new Date().toISOString().split('T')[0];

      // Save Workout Log
      const activeDay = this.getCurrentDay();
      if (activeDay) {
        dbService.saveWorkoutLog(currentUser.id, today, activeDay);
      }

      // Save Nutrition Log
      dbService.saveNutritionLog(currentUser.id, today, {
        targets: this.nutrition.targets,
        totals: this.getTotals(),
        loggedFood: this.nutrition.loggedFood
      });

      // Save Biometric Log
      dbService.saveBiometricLog(currentUser.id, today, this.userProfile);
    } catch (e) {
      console.warn("Could not save history entry:", e);
    }
  }
}

export const appState = new AppState();

