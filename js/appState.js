/**
 * AppState - Central State Management Engine
 * Incluye Sistema de Autenticación, Base de Datos Histórica (IndexedDB),
 * Programa de Entrenamiento Personalizable (30-90min, 3-8 ex) y Plan Nutricional de 7 Días x 5 Comidas
 * con Filtrado Implacable de Alérgenos y Generador de Lista de la Compra.
 * Estética Quiet Luxury estricta: 0 Emojis.
 */

import { authService } from './services/authService.js';
import { dbService } from './services/dbService.js';

class AppState {
  constructor() {
    this.listeners = [];

    // User Profile & Biometrics
    this.userProfile = {
      height: 178, // cm
      weight: 74.5, // kg
      age: 28,
      gender: "male",
      activityLevel: 1.55,
      goal: "fat_loss", // 'fat_loss' | 'recomp' | 'muscle_gain'
      dietType: "omnivore", // 'omnivore' | 'mediterranean' | 'keto' | 'vegetarian' | 'vegan' | 'high_protein'
      allergies: [], // ['lactosa', 'gluten', 'frutos_secos', 'huevo', 'pescado', 'soya']
      customAllergies: "", // Texto libre
      bmr: 1750,
      tdee: 2712,
      targetCalories: 2212,
      targetProtein: 175,
      targetCarbs: 215,
      targetFat: 58
    };

    const savedProfile = localStorage.getItem("aura_user_profile");
    if (savedProfile) {
      try {
        this.userProfile = { ...this.userProfile, ...JSON.parse(savedProfile) };
      } catch (e) {}
    } else {
      this.initDefaultProfile();
    }

    // Frequency, Duration, Exercise Count & Real Biomechanical Routines
    this.workoutProgram = {
      daysCount: 4,
      targetDurationMinutes: 60,
      targetExerciseCount: 5,
      equipment: "full_gym",
      activeDayIndex: 0,
      availableSplits: [
        { id: "torso_pierna", name: "Torso / Pierna (4 Días)", daysCount: 4 },
        { id: "ppl_5d", name: "Push / Pull / Legs / Torso / Pierna (5 Días)", daysCount: 5 },
        { id: "ppl_6d", name: "Push / Pull / Legs (Frecuencia 2x - 6 Días)", daysCount: 6 },
        { id: "fullbody_3d", name: "Fullbody Alta Intensidad (3 Días)", daysCount: 3 }
      ],
      realExercisePool: [
        { id: "ex_banca", name: "Press de Banca con Barra", category: "Empuje Horizontal", targetMuscle: "Pectoral Mayor / Tríceps", equipment: "full_gym", altNotes: "Fuerza máxima y reclutamiento global" },
        { id: "ex_incl_manc", name: "Press Inclinado con Mancuernas", category: "Empuje Inclinado", targetMuscle: "Pectoral Superior / Deltoides", equipment: "dumbbells", altNotes: "Mayor rango de recorrido libre" },
        { id: "ex_remo_bar", name: "Remo Pendlay con Barra", category: "Tirón Horizontal", targetMuscle: "Espalda Alta / Dorsal", equipment: "full_gym", altNotes: "Potencia desde el suelo sin inercia" },
        { id: "ex_dominadas", name: "Dominadas Neutras con Lastre", category: "Tirón Vertical", targetMuscle: "Dorsal Ancho / Bíceps", equipment: "bodyweight", altNotes: "Tracción vertical biomecánicamente limpia" },
        { id: "ex_militar_manc", name: "Press Militar con Mancuernas Sentado", category: "Empuje Vertical", targetMuscle: "Deltoides Anterior / Lateral", equipment: "dumbbells", altNotes: "Estabilidad escapular sin pinzamiento" },
        { id: "ex_squat", name: "Sentadilla Trasera con Barra (Back Squat)", category: "Dominante Rodilla", targetMuscle: "Cuádriceps / Glúteos", equipment: "full_gym", altNotes: "Carga axial pura de cadena anterior" },
        { id: "ex_rdl", name: "Peso Muerto Rumano con Barra (RDL)", category: "Dominante Cadera", targetMuscle: "Isquiotibiales / Glúteo Mayor", equipment: "full_gym", altNotes: "Estiramiento bajo carga excéntrica" },
        { id: "ex_hip_thrust", name: "Hip Thrust con Barra", category: "Dominante Cadera", targetMuscle: "Glúteo Mayor", equipment: "full_gym", altNotes: "Máxima tensión en posición acortada" },
        { id: "ex_prensa", name: "Prensa de Piernas a 45°", category: "Dominante Rodilla", targetMuscle: "Cuádriceps", equipment: "cables_machines", altNotes: "Aislamiento de cuádriceps sin fatiga lumbar" },
        { id: "ex_elev_lat", name: "Elevaciones Laterales en Polea Baja", category: "Aislamiento Hombro", targetMuscle: "Deltoides Lateral", equipment: "cables_machines", altNotes: "Tensión uniforme en todo el rango" },
        { id: "ex_bantara", name: "Sentadilla Búlgara con Mancuernas", category: "Unilateral Pierna", targetMuscle: "Cuádriceps / Glúteo Medio", equipment: "dumbbells", altNotes: "Corrección de asimetrías bilaterales" },
        { id: "ex_curl_inc", name: "Curl de Bíceps Inclinado con Mancuernas", category: "Aislamiento Brazo", targetMuscle: "Bíceps Braquial (Cabeza Larga)", equipment: "dumbbells", altNotes: "Máximo estiramiento de la cabeza larga" },
        { id: "ex_triceps_polea", name: "Extensiones de Tríceps en Polea Alta con Cuerda", category: "Aislamiento Brazo", targetMuscle: "Tríceps (Cabeza Lateral y Medial)", equipment: "cables_machines", altNotes: "Tensión constante con separación final" }
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
                { setNum: 1, weight: 85, reps: 6, rpe: 8, completed: false },
                { setNum: 2, weight: 85, reps: 6, rpe: 8.5, completed: false },
                { setNum: 3, weight: 85, reps: 5, rpe: 9, completed: false },
              ],
              alternatives: [
                { id: "alt_1_1", name: "Press Inclinado con Mancuernas", note: "Enfoque pectoral superior / Menor estrés en hombro" },
                { id: "alt_1_2", name: "Press de Pecho en Máquina Articulada", note: "Mayor tensión constante y máxima estabilidad" }
              ]
            },
            {
              id: "ex_1_2",
              name: "Remo Pendlay con Barra",
              category: "Tirón Horizontal",
              targetMuscle: "Espalda Alta / Dorsal",
              originalName: "Remo Pendlay con Barra",
              isSubstituted: false,
              sets: [
                { setNum: 1, weight: 75, reps: 8, rpe: 7.5, completed: false },
                { setNum: 2, weight: 75, reps: 8, rpe: 8, completed: false },
                { setNum: 3, weight: 75, reps: 8, rpe: 8.5, completed: false },
              ],
              alternatives: [
                { id: "alt_2_1", name: "Remo en Polea Baja con Agarre Neutro", note: "Tensión uniforme constante en todo el rango" },
                { id: "alt_2_2", name: "Remo Seal Bench con Mancuernas", note: "Cero fatiga en zona lumbar / Máximo aislamiento" }
              ]
            },
            {
              id: "ex_1_3",
              name: "Press Militar con Mancuernas Sentado",
              category: "Empuje Vertical",
              targetMuscle: "Deltoides Anterior / Lateral",
              originalName: "Press Militar con Mancuernas Sentado",
              isSubstituted: false,
              sets: [
                { setNum: 1, weight: 26, reps: 8, rpe: 8, completed: false },
                { setNum: 2, weight: 26, reps: 8, rpe: 8.5, completed: false },
                { setNum: 3, weight: 26, reps: 7, rpe: 9, completed: false },
              ],
              alternatives: [
                { id: "alt_3_1", name: "Press de Hombros Landmine Unilateral", note: "Ángulo diagonal suave ideal para movilidad" },
                { id: "alt_3_2", name: "Elevaciones Laterales en Polea", note: "Enfoque directo en deltoides lateral sin fatiga axial" }
              ]
            },
            {
              id: "ex_1_4",
              name: "Elevaciones Laterales en Polea Baja",
              category: "Aislamiento Hombro",
              targetMuscle: "Deltoides Lateral",
              originalName: "Elevaciones Laterales en Polea Baja",
              isSubstituted: false,
              sets: [
                { setNum: 1, weight: 12, reps: 12, rpe: 8, completed: false },
                { setNum: 2, weight: 12, reps: 12, rpe: 8.5, completed: false },
                { setNum: 3, weight: 12, reps: 10, rpe: 9, completed: false },
              ],
              alternatives: [
                { id: "alt_4_1", name: "Elevaciones Laterales con Mancuernas", note: "Mancuernas en banco inclinado" }
              ]
            },
            {
              id: "ex_1_5",
              name: "Extensiones de Tríceps en Polea Alta con Cuerda",
              category: "Aislamiento Brazo",
              targetMuscle: "Tríceps",
              originalName: "Extensiones de Tríceps en Polea Alta con Cuerda",
              isSubstituted: false,
              sets: [
                { setNum: 1, weight: 25, reps: 12, rpe: 8, completed: false },
                { setNum: 2, weight: 25, reps: 12, rpe: 8.5, completed: false },
                { setNum: 3, weight: 25, reps: 10, rpe: 9, completed: false },
              ],
              alternatives: [
                { id: "alt_5_1", name: "Press Francés con Barra Z", note: "Fuerza pura de tríceps" }
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
                { id: "alt_p1_2", name: "Sentadilla Búlgara con Mancuernas", note: "Unilateral / Corrección de asimetrías" }
              ]
            },
            {
              id: "ex_2_2",
              name: "Peso Muerto Rumano con Barra (RDL)",
              category: "Dominante de Cadera",
              targetMuscle: "Isquiotibiales / Glúteo Mayor",
              originalName: "Peso Muerto Rumano con Barra (RDL)",
              isSubstituted: false,
              sets: [
                { setNum: 1, weight: 100, reps: 8, rpe: 7.5, completed: false },
                { setNum: 2, weight: 100, reps: 8, rpe: 8, completed: false },
                { setNum: 3, weight: 100, reps: 8, rpe: 8.5, completed: false },
              ],
              alternatives: [
                { id: "alt_p2_1", name: "Hip Thrust con Barra", note: "Máxima tensión acortada en glúteo mayor" }
              ]
            },
            {
              id: "ex_2_3",
              name: "Prensa de Piernas a 45°",
              category: "Dominante Rodilla",
              targetMuscle: "Cuádriceps",
              originalName: "Prensa de Piernas a 45°",
              isSubstituted: false,
              sets: [
                { setNum: 1, weight: 180, reps: 10, rpe: 8, completed: false },
                { setNum: 2, weight: 180, reps: 10, rpe: 8.5, completed: false },
                { setNum: 3, weight: 180, reps: 8, rpe: 9, completed: false }
              ],
              alternatives: [
                { id: "alt_p3_1", name: "Sentadilla Hack en Máquina", note: "Aislamiento constante" }
              ]
            },
            {
              id: "ex_2_4",
              name: "Hip Thrust con Barra",
              category: "Dominante Cadera",
              targetMuscle: "Glúteo Mayor",
              originalName: "Hip Thrust con Barra",
              isSubstituted: false,
              sets: [
                { setNum: 1, weight: 120, reps: 10, rpe: 8, completed: false },
                { setNum: 2, weight: 120, reps: 10, rpe: 8.5, completed: false },
                { setNum: 3, weight: 120, reps: 8, rpe: 9, completed: false }
              ],
              alternatives: [
                { id: "alt_p4_1", name: "Extensiones de Cadera en Banco a 45°", note: "Glúteo excéntrico" }
              ]
            },
            {
              id: "ex_2_5",
              name: "Sentadilla Búlgara con Mancuernas",
              category: "Unilateral Pierna",
              targetMuscle: "Cuádriceps / Glúteo Medio",
              originalName: "Sentadilla Búlgara con Mancuernas",
              isSubstituted: false,
              sets: [
                { setNum: 1, weight: 20, reps: 10, rpe: 8, completed: false },
                { setNum: 2, weight: 20, reps: 10, rpe: 8.5, completed: false },
                { setNum: 3, weight: 20, reps: 10, rpe: 9, completed: false }
              ],
              alternatives: [
                { id: "alt_p5_1", name: "Zancadas Caminando con Mancuernas", note: "Unilateral dinámico" }
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
                { id: "alt_4_1", name: "Jalón al Pecho en Polea Agarre Ancho", note: "Control absoluto de carga" }
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
                { id: "alt_4_3", name: "Fondos en Paralelas con Lastre", note: "Empuje declinado" }
              ]
            },
            {
              id: "ex_4_3",
              name: "Curl de Bíceps Inclinado con Mancuernas",
              category: "Aislamiento Brazo",
              targetMuscle: "Bíceps Braquial",
              originalName: "Curl de Bíceps Inclinado con Mancuernas",
              isSubstituted: false,
              sets: [
                { setNum: 1, weight: 14, reps: 10, rpe: 8, completed: false },
                { setNum: 2, weight: 14, reps: 10, rpe: 8.5, completed: false },
                { setNum: 3, weight: 14, reps: 8, rpe: 9, completed: false }
              ],
              alternatives: [
                { id: "alt_4_4", name: "Curl Martillo en Polea", note: "Braquiorradial" }
              ]
            },
            {
              id: "ex_4_4",
              name: "Extensiones de Tríceps en Polea Alta con Cuerda",
              category: "Aislamiento Brazo",
              targetMuscle: "Tríceps",
              originalName: "Extensiones de Tríceps en Polea Alta con Cuerda",
              isSubstituted: false,
              sets: [
                { setNum: 1, weight: 25, reps: 12, rpe: 8, completed: false },
                { setNum: 2, weight: 25, reps: 12, rpe: 8.5, completed: false },
                { setNum: 3, weight: 25, reps: 10, rpe: 9, completed: false }
              ],
              alternatives: [
                { id: "alt_4_5", name: "Press Francés con Barra Z", note: "Fuerza tríceps" }
              ]
            },
            {
              id: "ex_4_5",
              name: "Elevaciones Laterales en Polea Baja",
              category: "Aislamiento Hombro",
              targetMuscle: "Deltoides Lateral",
              originalName: "Elevaciones Laterales en Polea Baja",
              isSubstituted: false,
              sets: [
                { setNum: 1, weight: 12, reps: 12, rpe: 8, completed: false },
                { setNum: 2, weight: 12, reps: 12, rpe: 8.5, completed: false },
                { setNum: 3, weight: 12, reps: 10, rpe: 9, completed: false }
              ],
              alternatives: [
                { id: "alt_4_6", name: "Pajaro en Polea Alta", note: "Deltoides posterior" }
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
        text: "¡Hola! Soy tu Entrenador Experto en Biomecánica AURA. ¿Deseas personalizar la duración de tu sesión, el número de ejercicios o adaptar algún movimiento por molestia articular?"
      }
    ];

    // Daily & Weekly Nutrition Planner (7 Días x 5 Comidas Diarias con Filtrado de Alérgenos)
    this.nutrition = {
      activeWeekDayIndex: 0, // 0: Lunes, 1: Martes, 2: Miércoles, 3: Jueves, 4: Viernes, 5: Sábado, 6: Domingo
      targets: { calories: 1960, protein: 175, carbs: 215, fat: 58 },
      loggedFood: [], // REGLA ESTRICTA: 0 ALIMENTOS REGISTRADOS POR DEFECTO PARA EL DÍA
      weeklyPlan: [
        // DÍA 0: LUNES
        {
          dayName: "Lunes",
          meals: [
            {
              meal: "Desayuno",
              title: "Omelette de 3 Claras y 1 Huevo con Espinacas y Pan de Centeno",
              allergens: ["huevo", "gluten"],
              ingredients: ["Claras de Huevo (150g)", "Huevo Entero (1 ud)", "Pan de Centeno Orgánico (60g)", "Espinacas Frescas (50g)", "Aceite de Oliva EV (5g)"],
              calories: 420, p: 32, c: 38, f: 14,
              alternatives: [
                { title: "Porridge de Avena con Proteína Vegetal, Chía y Frambuesas", allergens: [], ingredients: ["Avena en Copos (60g)", "Proteína Isolate Vegetal (30g)", "Semillas de Chía (15g)", "Frambuesas Frescas (80g)"], calories: 425, p: 31, c: 42, f: 12 },
                { title: "Revuelto de Tofu con Cúrcuma, Aguacate y Pan de Arroz Sin Gluten", allergens: ["soya"], ingredients: ["Tofu Firme (180g)", "Aguacate (50g)", "Pan de Arroz Sin Gluten (60g)", "Tomate (80g)"], calories: 415, p: 28, c: 36, f: 16 }
              ]
            },
            {
              meal: "Media Mañana",
              title: "Yogur Griego 0% con Frutos Rojos y Nueces de Brasil",
              allergens: ["lactosa", "frutos_secos"],
              ingredients: ["Yogur Griego 0% (200g)", "Arándanos (60g)", "Nueces de Brasil (15g)"],
              calories: 240, p: 22, c: 18, f: 8,
              alternatives: [
                { title: "Batido de Proteína Isolada sin Lactosa con Manzana Verde", allergens: [], ingredients: ["Proteína Whey Isolada Cero Lactosa (30g)", "Manzana Verde (150g)"], calories: 210, p: 26, c: 20, f: 2 },
                { title: "Pudín de Chía con Leche de Coco y Semillas de Calabaza", allergens: [], ingredients: ["Semillas de Chía (25g)", "Leche de Coco (150ml)", "Semillas de Calabaza (15g)"], calories: 235, p: 12, c: 15, f: 14 }
              ]
            },
            {
              meal: "Almuerzo",
              title: "Pechuga de Pollo a la Plancha con Quinoa y Espárragos Verdes",
              allergens: [],
              ingredients: ["Pechuga de Pollo (200g)", "Quinoa Cocida (180g)", "Espárragos Verdes (120g)", "Aceite de Oliva EV (8g)"],
              calories: 580, p: 52, c: 54, f: 12,
              alternatives: [
                { title: "Lomo de Ternera Magra al Horno con Boniato Asado", allergens: [], ingredients: ["Ternera Magra (190g)", "Boniato/Camote (200g)", "Brócoli al Vapor (150g)"], calories: 575, p: 54, c: 52, f: 13 },
                { title: "Filete de Merluza a la Plancha con Arroz Basmati e Hinojo", allergens: ["pescado"], ingredients: ["Filete de Merluza (220g)", "Arroz Basmati Cocido (180g)", "Hinojo y Calabacín (150g)"], calories: 560, p: 48, c: 56, f: 10 }
              ]
            },
            {
              meal: "Merienda",
              title: "Tostada Integral con Atún Claro al Natural y Pimientos de Padrón",
              allergens: ["gluten", "pescado"],
              ingredients: ["Pan Integral de Masa Madre (60g)", "Atún Claro al Natural (110g)", "Pimientos (80g)"],
              calories: 290, p: 28, c: 32, f: 5,
              alternatives: [
                { title: "Tortitas de Arroz Sin Gluten con Pechuga de Pavo Extramagra", allergens: [], ingredients: ["Tortitas de Arroz Integral (4 uds)", "Fiambre de Pavo 95% (100g)"], calories: 260, p: 25, c: 28, f: 3 },
                { title: "Hummus Tradicional de Garbanzos con Bastones de Zanahoria", allergens: [], ingredients: ["Hummus de Garbanzo (80g)", "Zanahoria Fresca (150g)"], calories: 270, p: 10, c: 32, f: 11 }
              ]
            },
            {
              meal: "Cena",
              title: "Filete de Salmón Salvaje al Horno con Crema de Calabacín",
              allergens: ["pescado"],
              ingredients: ["Salmón Salvaje (180g)", "Calabacín (200g)", "Cebolla (50g)", "Aceite de Oliva EV (5g)"],
              calories: 440, p: 38, c: 14, f: 22,
              alternatives: [
                { title: "Pechuga de Pavo a la Plancha con Ensalada Canónigos y Semillas", allergens: [], ingredients: ["Pechuga de Pavo (200g)", "Canónigos (100g)", "Semillas de Girasol (15g)"], calories: 410, p: 44, c: 10, f: 12 },
                { title: "Revuelto de Claras con Champiñones Portobello y Aguacate", allergens: ["huevo"], ingredients: ["Claras de Huevo (200g)", "Champiñones (150g)", "Aguacate (50g)"], calories: 390, p: 32, c: 12, f: 15 }
              ]
            }
          ]
        },
        // DÍA 1: MARTES
        {
          dayName: "Martes",
          meals: [
            {
              meal: "Desayuno",
              title: "Porridge de Avena Orgánica con Proteína Whey Isolada y Plátano",
              allergens: ["lactosa", "gluten"],
              ingredients: ["Avena (60g)", "Proteína Whey Isolada (30g)", "Plátano (100g)", "Agua o Leche"],
              calories: 430, p: 32, c: 56, f: 6,
              alternatives: [
                { title: "Tortilla de Claras con Salmón Ahumado y Pan Sin Gluten", allergens: ["huevo", "pescado"], ingredients: ["Claras (180g)", "Salmón Ahumado (50g)", "Pan Sin Gluten (50g)"], calories: 410, p: 35, c: 30, f: 12 },
                { title: "Batido de Proteína Vegetal de Guisante con Frutos Rojos y Chía", allergens: [], ingredients: ["Proteína de Guisante (35g)", "Frutos Rojos (100g)", "Semillas Chía (15g)"], calories: 395, p: 30, c: 38, f: 10 }
              ]
            },
            {
              meal: "Media Mañana",
              title: "Fiambre de Pavo 95% con Almendras Tostadas Naturales",
              allergens: ["frutos_secos"],
              ingredients: ["Pechuga de Pavo (100g)", "Almendras Tostadas Sin Sal (20g)"],
              calories: 230, p: 25, c: 4, f: 12,
              alternatives: [
                { title: "Manzana Verde con Proteína en Polvo Cero Lactosa", allergens: [], ingredients: ["Manzana (150g)", "Proteína aislada en agua (30g)"], calories: 200, p: 25, c: 20, f: 1 },
                { title: "Queso Fresco Batido 0% con Pipas de Calabaza", allergens: ["lactosa"], ingredients: ["Queso Batido 0% (200g)", "Pipas de Calabaza (15g)"], calories: 220, p: 24, c: 10, f: 8 }
              ]
            },
            {
              meal: "Almuerzo",
              title: "Lomo de Ternera Magra a la Plancha con Arroz Basmati y Brócoli",
              allergens: [],
              ingredients: ["Ternera Magra (190g)", "Arroz Basmati (180g)", "Brócoli al Vapor (150g)"],
              calories: 590, p: 54, c: 56, f: 12,
              alternatives: [
                { title: "Pechuga de Pollo con Patata Asada y Ensalada Mixta", allergens: [], ingredients: ["Pollo (200g)", "Patata Asada (220g)", "Lechuga y Tomate (150g)"], calories: 570, p: 50, c: 58, f: 10 },
                { title: "Garbanzos Estofados con Verduras y Bacalao Desmigado", allergens: ["pescado"], ingredients: ["Garbanzos Cocidos (200g)", "Bacalao (150g)", "Espinacas y Pimientos (150g)"], calories: 580, p: 46, c: 60, f: 11 }
              ]
            },
            {
              meal: "Merienda",
              title: "Batido Pre-Entreno con Proteína Isolada y Harina de Avena",
              allergens: ["lactosa", "gluten"],
              ingredients: ["Proteína Isolada (30g)", "Harina de Avena (40g)", "Agua (300ml)"],
              calories: 280, p: 28, c: 32, f: 4,
              alternatives: [
                { title: "Latita de Atún al Natural con Tortitas de Maíz Sin Gluten", allergens: ["pescado"], ingredients: ["Atún (100g)", "Tortitas de Maíz (4 uds)"], calories: 245, p: 26, c: 24, f: 3 },
                { title: "Crema de Cacahuete Natural sobre Bastones de Manzana", allergens: ["frutos_secos"], ingredients: ["Crema de Cacahuete (25g)", "Manzana Verde (150g)"], calories: 250, p: 7, c: 24, f: 14 }
              ]
            },
            {
              meal: "Cena",
              title: "Filete de Dorada al Horno con Salteado de Setas y Asparagus",
              allergens: ["pescado"],
              ingredients: ["Dorada (200g)", "Setas variadas (150g)", "Espárragos (100g)"],
              calories: 420, p: 40, c: 12, f: 16,
              alternatives: [
                { title: "Pechuga de Pollo a la Parrilla con Puré de Calabaza", allergens: [], ingredients: ["Pollo (200g)", "Calabaza Asada (250g)"], calories: 390, p: 45, c: 22, f: 8 },
                { title: "Hamburguesa de Pavo Casera con Ensalada de Pepino y Aguacate", allergens: [], ingredients: ["Carne de Pavo (180g)", "Pepino (150g)", "Aguacate (40g)"], calories: 410, p: 38, c: 10, f: 18 }
              ]
            }
          ]
        },
        // DÍA 2: MIÉRCOLES
        {
          dayName: "Miércoles",
          meals: [
            {
              meal: "Desayuno",
              title: "Tostadas de Pan Centeno con Aguacate y Pechuga de Pavo",
              allergens: ["gluten"],
              ingredients: ["Pan Centeno (60g)", "Aguacate (50g)", "Fiambre Pavo 95% (80g)"],
              calories: 410, p: 26, c: 38, f: 16,
              alternatives: [
                { title: "Pancakes Proteicos de Avena y Claras con Arándanos", allergens: ["huevo", "gluten"], ingredients: ["Harina Avena (50g)", "Claras (150g)", "Arándanos (50g)"], calories: 390, p: 30, c: 45, f: 5 },
                { title: "Bowl de Chía y Proteína de Arroz con Leche de Almendras", allergens: [], ingredients: ["Chía (20g)", "Proteína Arroz (30g)", "Leche Almendra (200ml)"], calories: 380, p: 28, c: 35, f: 12 }
              ]
            },
            {
              meal: "Media Mañana",
              title: "Proteína Whey en Agua con Nueces de Nogal",
              allergens: ["lactosa", "frutos_secos"],
              ingredients: ["Whey Isolate (30g)", "Nueces (15g)"],
              calories: 220, p: 25, c: 4, f: 10,
              alternatives: [
                { title: "Huevos Cocidos (2 uds) con Tomates Cherry", allergens: ["huevo"], ingredients: ["Huevos Cocidos (2 uds)", "Tomates Cherry (100g)"], calories: 170, p: 14, c: 4, f: 11 },
                { title: "Edamame al Vapor con Sal Escamada", allergens: ["soya"], ingredients: ["Vainas de Edamame (150g)"], calories: 180, p: 17, c: 14, f: 8 }
              ]
            },
            {
              meal: "Almuerzo",
              title: "Solomillo de Pavo al Ajillo con Arroz Integral y Salteado de Verduras",
              allergens: [],
              ingredients: ["Solomillo Pavo (200g)", "Arroz Integral (170g)", "Verduras (150g)"],
              calories: 575, p: 52, c: 55, f: 11,
              alternatives: [
                { title: "Tacos de Atún Rojo a la Plancha con Sésamo y Quinoa", allergens: ["pescado"], ingredients: ["Atún Rojo (180g)", "Quinoa (170g)", "Sésamo (10g)"], calories: 585, p: 50, c: 48, f: 16 },
                { title: "Lentejas Pardinas Guisadas con Hortalizas y Tofu", allergens: ["soya"], ingredients: ["Lentejas Cocidas (220g)", "Tofu (100g)", "Zanahoria y Cebolla (150g)"], calories: 550, p: 38, c: 65, f: 10 }
              ]
            },
            {
              meal: "Merienda",
              title: "Yogur Proteico Cero Grasa con Semillas de Lino",
              allergens: ["lactosa"],
              ingredients: ["Yogur Proteico (200g)", "Semillas de Lino (10g)"],
              calories: 190, p: 22, c: 12, f: 5,
              alternatives: [
                { title: "Fiambre de Pavo con Bastones de Pepino", allergens: [], ingredients: ["Pavo (100g)", "Pepino (150g)"], calories: 120, p: 22, c: 4, f: 2 },
                { title: "Batido de Proteína de Guisante con Leche de Coco", allergens: [], ingredients: ["Proteína Guisante (30g)", "Leche Coco (200ml)"], calories: 210, p: 24, c: 8, f: 9 }
              ]
            },
            {
              meal: "Cena",
              title: "Wok de Pollo con Verduras Crujientes y Brotes de Soja",
              allergens: ["soya"],
              ingredients: ["Tiras de Pollo (200g)", "Brotes de Soja (100g)", "Pimientos y Calabacín (150g)"],
              calories: 400, p: 48, c: 16, f: 10,
              alternatives: [
                { title: "Lubina al Horno con Ensalada Verde de Canónigos", allergens: ["pescado"], ingredients: ["Lubina (200g)", "Canónigos (100g)", "Aceite EV (8g)"], calories: 380, p: 42, c: 4, f: 18 },
                { title: "Tortilla Francesa de 3 Claras con Espárragos Trigueros", allergens: ["huevo"], ingredients: ["Claras (200g)", "Espárragos (150g)", "Aceite EV (5g)"], calories: 250, p: 26, c: 6, f: 7 }
              ]
            }
          ]
        },
        // DÍA 3: JUEVES
        {
          dayName: "Jueves",
          meals: [
            {
              meal: "Desayuno",
              title: "Bowl de Yogur Griego 0% con Chía, Fresas y Avellanas",
              allergens: ["lactosa", "frutos_secos"],
              ingredients: ["Yogur Griego 0% (200g)", "Semillas Chía (15g)", "Fresas (100g)", "Avellanas (15g)"],
              calories: 380, p: 26, c: 28, f: 14,
              alternatives: [
                { title: "Tostada Sin Gluten con Aguacate y Huevo Pochado", allergens: ["huevo"], ingredients: ["Pan Sin Gluten (60g)", "Aguacate (50g)", "Huevo (1 ud)"], calories: 390, p: 16, c: 32, f: 20 },
                { title: "Batido de Proteína Isolate con Harina de Arroz y Canela", allergens: [], ingredients: ["Proteína Isolate (30g)", "Harina Arroz (40g)", "Canela"], calories: 370, p: 28, c: 50, f: 3 }
              ]
            },
            {
              meal: "Media Mañana",
              title: "Pechuga de Pavo con Tortitas de Espelta",
              allergens: ["gluten"],
              ingredients: ["Pavo (90g)", "Tortitas Espelta (3 uds)"],
              calories: 210, p: 22, c: 22, f: 2,
              alternatives: [
                { title: "Proteína Whey Isolada sin Lactosa en Agua", allergens: [], ingredients: ["Whey Cero Lactosa (30g)"], calories: 120, p: 26, c: 2, f: 1 },
                { title: "Nueces de Macadamia con Manzana", allergens: ["frutos_secos"], ingredients: ["Macadamia (15g)", "Manzana (150g)"], calories: 210, p: 3, c: 22, f: 12 }
              ]
            },
            {
              meal: "Almuerzo",
              title: "Pechuga de Pollo al Limón con Patata Asada y Judías Verdes",
              allergens: [],
              ingredients: ["Pollo (200g)", "Patata Asada (200g)", "Judías Verdes (150g)"],
              calories: 560, p: 50, c: 54, f: 10,
              alternatives: [
                { title: "Hamburguesas de Ternera Magra con Quinoa al Curry", allergens: [], ingredients: ["Ternera (180g)", "Quinoa (170g)"], calories: 580, p: 52, c: 48, f: 14 },
                { title: "Filete de Salmón con Arroz Salvaje y Verduras", allergens: ["pescado"], ingredients: ["Salmón (180g)", "Arroz Salvaje (160g)"], calories: 590, p: 44, c: 50, f: 18 }
              ]
            },
            {
              meal: "Merienda",
              title: "Atún al Natural con Bastones de Apio y Caracolas Sin Gluten",
              allergens: ["pescado"],
              ingredients: ["Atún (100g)", "Apio (150g)"],
              calories: 160, p: 25, c: 6, f: 2,
              alternatives: [
                { title: "Proteína de Suero sin Lactosa con Fresa", allergens: [], ingredients: ["Whey Cero Lactosa (30g)", "Fresas (100g)"], calories: 160, p: 25, c: 10, f: 1 },
                { title: "Kéfir de Cabra con Semillas de Sésamo", allergens: ["lactosa"], ingredients: ["Kéfir (200ml)", "Sésamo (10g)"], calories: 170, p: 12, c: 10, f: 9 }
              ]
            },
            {
              meal: "Cena",
              title: "Crema de Calabaza y Calabacín con Tacos de Pechuga de Pavo",
              allergens: [],
              ingredients: ["Calabaza y Calabacín (300g)", "Pechuga de Pavo (180g)"],
              calories: 360, p: 42, c: 24, f: 6,
              alternatives: [
                { title: "Filete de Lenguado a la Plancha con Espárragos", allergens: ["pescado"], ingredients: ["Lenguado (220g)", "Espárragos (150g)"], calories: 340, p: 44, c: 6, f: 8 },
                { title: "Salteado de Tofu con Verduras y Aceite de Sésamo", allergens: ["soya"], ingredients: ["Tofu (180g)", "Verduras (200g)"], calories: 350, p: 26, c: 14, f: 16 }
              ]
            }
          ]
        },
        // DÍA 4: VIERNES
        {
          dayName: "Viernes",
          meals: [
            {
              meal: "Desayuno",
              title: "Revuelto de 3 Claras y 1 Huevo con Champiñones y Pan Centeno",
              allergens: ["huevo", "gluten"],
              ingredients: ["Claras (150g)", "Huevo (1 ud)", "Champiñones (100g)", "Pan Centeno (60g)"],
              calories: 400, p: 30, c: 36, f: 12,
              alternatives: [
                { title: "Porridge de Avena sin Gluten con Proteína Isolada", allergens: [], ingredients: ["Avena Sin Gluten (60g)", "Proteína Isolada (30g)"], calories: 390, p: 32, c: 46, f: 5 },
                { title: "Tostadas Sin Gluten con Hummus y Tomate", allergens: [], ingredients: ["Pan Sin Gluten (60g)", "Hummus (60g)", "Tomate (100g)"], calories: 370, p: 12, c: 45, f: 12 }
              ]
            },
            {
              meal: "Media Mañana",
              title: "Queso Cabaña / Cottage 0% con Arándanos",
              allergens: ["lactosa"],
              ingredients: ["Cottage 0% (200g)", "Arándanos (80g)"],
              calories: 210, p: 24, c: 16, f: 2,
              alternatives: [
                { title: "Pechuga de Pavo con Pepinillos y Tortitas de Arroz", allergens: [], ingredients: ["Pavo (100g)", "Tortitas Arroz (3 uds)"], calories: 190, p: 24, c: 20, f: 2 },
                { title: "Proteína de Arroz y Guisante con Agua de Coco", allergens: [], ingredients: ["Proteína Vegetal (30g)", "Agua Coco (250ml)"], calories: 200, p: 25, c: 18, f: 2 }
              ]
            },
            {
              meal: "Almuerzo",
              title: "Solomillo de Ternera a la Parrilla con Boniato y Canónigos",
              allergens: [],
              ingredients: ["Ternera (190g)", "Boniato (200g)", "Canónigos (100g)"],
              calories: 580, p: 54, c: 50, f: 14,
              alternatives: [
                { title: "Pechuga de Pollo al Curry con Arroz Basmati", allergens: [], ingredients: ["Pollo (200g)", "Arroz Basmati (180g)"], calories: 570, p: 50, c: 56, f: 10 },
                { title: "Tacos de Bonito del Norte con Patata Cocida", allergens: ["pescado"], ingredients: ["Bonito (180g)", "Patata (220g)"], calories: 560, p: 48, c: 52, f: 11 }
              ]
            },
            {
              meal: "Merienda",
              title: "Batido Proteico Cero Lactosa con Fresas",
              allergens: [],
              ingredients: ["Proteína Isolada Cero Lactosa (30g)", "Fresas (120g)"],
              calories: 170, p: 26, c: 12, f: 1,
              alternatives: [
                { title: "Atún en Lata al Natural con Tomate Cuchillo", allergens: ["pescado"], ingredients: ["Atún (100g)", "Tomate (150g)"], calories: 150, p: 25, c: 8, f: 2 },
                { title: "Almendras Tostadas con Té Verde", allergens: ["frutos_secos"], ingredients: ["Almendras (20g)"], calories: 130, p: 5, c: 3, f: 11 }
              ]
            },
            {
              meal: "Cena",
              title: "Filete de Merluza con Verduras al Vapor y Aceite de Oliva",
              allergens: ["pescado"],
              ingredients: ["Merluza (220g)", "Verduras variadas (200g)", "Aceite EV (8g)"],
              calories: 370, p: 42, c: 14, f: 12,
              alternatives: [
                { title: "Pechuga de Pollo con Ensalada Rúcula y Tomate", allergens: [], ingredients: ["Pollo (200g)", "Rúcula y Tomate (150g)"], calories: 350, p: 46, c: 8, f: 9 },
                { title: "Revuelto de Claras con Espinacas y Gambas", allergens: ["huevo", "pescado"], ingredients: ["Claras (200g)", "Espinacas (100g)", "Gambas (100g)"], calories: 340, p: 44, c: 6, f: 6 }
              ]
            }
          ]
        },
        // DÍA 5: SÁBADO
        {
          dayName: "Sábado",
          meals: [
            {
              meal: "Desayuno",
              title: "Tortilla de 3 Claras y Aguacate con Pan Sin Gluten",
              allergens: ["huevo"],
              ingredients: ["Claras (200g)", "Aguacate (50g)", "Pan Sin Gluten (60g)"],
              calories: 410, p: 28, c: 34, f: 16,
              alternatives: [
                { title: "Porridge de Avena con Proteína de Suero Cero Lactosa", allergens: [], ingredients: ["Avena Sin Gluten (60g)", "Whey Cero Lactosa (30g)"], calories: 400, p: 32, c: 48, f: 5 },
                { title: "Bowl de Yogur de Coco con Chía y Fruta", allergens: [], ingredients: ["Yogur Coco (200g)", "Chía (15g)", "Fruta (100g)"], calories: 380, p: 12, c: 38, f: 18 }
              ]
            },
            {
              meal: "Media Mañana",
              title: "Pechuga de Pavo con Nueces de Brasil",
              allergens: ["frutos_secos"],
              ingredients: ["Pavo (100g)", "Nueces Brasil (15g)"],
              calories: 220, p: 24, c: 2, f: 11,
              alternatives: [
                { title: "Proteína Whey Isolada en Agua con Arándanos", allergens: [], ingredients: ["Whey Cero Lactosa (30g)", "Arándanos (60g)"], calories: 160, p: 25, c: 10, f: 1 },
                { title: "Huevos Cocidos (2 uds)", allergens: ["huevo"], ingredients: ["Huevos (2 uds)"], calories: 150, p: 13, c: 1, f: 10 }
              ]
            },
            {
              meal: "Almuerzo",
              title: "Pechuga de Pollo al Horno con Camote Asado y Brócoli",
              allergens: [],
              ingredients: ["Pollo (200g)", "Camote (200g)", "Brócoli (150g)"],
              calories: 575, p: 52, c: 54, f: 11,
              alternatives: [
                { title: "Entrecot de Ternera Magra con Patata y Pimientos", allergens: [], ingredients: ["Ternera (190g)", "Patata (200g)", "Pimientos (100g)"], calories: 590, p: 52, c: 48, f: 16 },
                { title: "Filete de Salmón con Quinoa y Espárragos", allergens: ["pescado"], ingredients: ["Salmón (180g)", "Quinoa (160g)", "Espárragos (120g)"], calories: 580, p: 46, c: 46, f: 18 }
              ]
            },
            {
              meal: "Merienda",
              title: "Atún Claro al Natural con Tortitas de Maíz",
              allergens: ["pescado"],
              ingredients: ["Atún (110g)", "Tortitas Maíz (3 uds)"],
              calories: 200, p: 26, c: 18, f: 2,
              alternatives: [
                { title: "Batido Proteico de Guisante con Fresa", allergens: [], ingredients: ["Proteína Guisante (30g)", "Fresas (100g)"], calories: 160, p: 24, c: 10, f: 2 },
                { title: "Queso Batido 0% con Semillas de Chía", allergens: ["lactosa"], ingredients: ["Queso Batido (200g)", "Chía (10g)"], calories: 180, p: 22, c: 10, f: 5 }
              ]
            },
            {
              meal: "Cena",
              title: "Hamburguesa de Pavo Casera con Ensalada Verde y Aguacate",
              allergens: [],
              ingredients: ["Pavo Picado (180g)", "Ensalada (150g)", "Aguacate (40g)"],
              calories: 400, p: 40, c: 10, f: 18,
              alternatives: [
                { title: "Lenguado al Limón con Salteado de Calabacín", allergens: ["pescado"], ingredients: ["Lenguado (200g)", "Calabacín (200g)"], calories: 350, p: 42, c: 8, f: 10 },
                { title: "Revuelto de Claras con Champiñones", allergens: ["huevo"], ingredients: ["Claras (200g)", "Champiñones (150g)"], calories: 230, p: 26, c: 6, f: 5 }
              ]
            }
          ]
        },
        // DÍA 6: DOMINGO
        {
          dayName: "Domingo",
          meals: [
            {
              meal: "Desayuno",
              title: "Omelette Proteico de 3 Claras con Espinacas y Tomate",
              allergens: ["huevo"],
              ingredients: ["Claras (200g)", "Espinacas (80g)", "Tomate (80g)", "Aceite EV (5g)"],
              calories: 260, p: 28, c: 8, f: 8,
              alternatives: [
                { title: "Porridge de Avena Sin Gluten con Proteína Isolada", allergens: [], ingredients: ["Avena Sin Gluten (60g)", "Proteína Isolada (30g)"], calories: 390, p: 32, c: 46, f: 5 },
                { title: "Batido de Proteína Vegetal con Plátano y Leche de Almendras", allergens: [], ingredients: ["Proteína Vegetal (30g)", "Plátano (100g)", "Leche Almendra (200ml)"], calories: 370, p: 28, c: 48, f: 4 }
              ]
            },
            {
              meal: "Media Mañana",
              title: "Yogur Proteico Cero Lactosa con Almendras",
              allergens: ["frutos_secos"],
              ingredients: ["Yogur Proteico Cero Lactosa (200g)", "Almendras (15g)"],
              calories: 210, p: 22, c: 12, f: 8,
              alternatives: [
                { title: "Fiambre de Pavo 95% con Bastones de Zanahoria", allergens: [], ingredients: ["Pavo (100g)", "Zanahoria (150g)"], calories: 150, p: 22, c: 10, f: 2 },
                { title: "Proteína Whey Isolada en Agua", allergens: [], ingredients: ["Whey Isolate (30g)"], calories: 120, p: 26, c: 2, f: 1 }
              ]
            },
            {
              meal: "Almuerzo",
              title: "Pechuga de Pollo a la Parrilla con Arroz Basmati y Verduras",
              allergens: [],
              ingredients: ["Pollo (200g)", "Arroz Basmati (180g)", "Verduras (150g)"],
              calories: 570, p: 50, c: 56, f: 10,
              alternatives: [
                { title: "Ternera Magra al Horno con Boniato", allergens: [], ingredients: ["Ternera (190g)", "Boniato (200g)"], calories: 580, p: 54, c: 50, f: 13 },
                { title: "Dorada a la Plancha con Quinoa", allergens: ["pescado"], ingredients: ["Dorada (200g)", "Quinoa (160g)"], calories: 560, p: 44, c: 44, f: 14 }
              ]
            },
            {
              meal: "Merienda",
              title: "Tortitas de Arroz Sin Gluten con Pechuga de Pavo",
              allergens: [],
              ingredients: ["Tortitas Arroz (4 uds)", "Pavo (90g)"],
              calories: 230, p: 22, c: 24, f: 2,
              alternatives: [
                { title: "Atún al Natural con Tomate", allergens: ["pescado"], ingredients: ["Atún (100g)", "Tomate (150g)"], calories: 150, p: 25, c: 8, f: 2 },
                { title: "Semillas de Chía en Leche de Coco", allergens: [], ingredients: ["Chía (20g)", "Leche Coco (150ml)"], calories: 190, p: 6, c: 12, f: 12 }
              ]
            },
            {
              meal: "Cena",
              title: "Crema de Verduras Mixtas con Filete de Pavo a la Plancha",
              allergens: [],
              ingredients: ["Crema Verduras (250g)", "Pavo (180g)"],
              calories: 360, p: 42, c: 20, f: 7,
              alternatives: [
                { title: "Salmón Salvaje con Ensalada Verde", allergens: ["pescado"], ingredients: ["Salmón (180g)", "Ensalada (150g)"], calories: 420, p: 38, c: 6, f: 22 },
                { title: "Revuelto de Claras con Champiñones", allergens: ["huevo"], ingredients: ["Claras (200g)", "Champiñones (150g)"], calories: 230, p: 26, c: 6, f: 5 }
              ]
            }
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
      bodyLog: {
        weight: 74.5,
        bodyFat: 14.5,
        waist: 78
      }
    };
  }

  initDefaultProfile() {
    this.recalculateMetabolism();
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

  // --- WORKOUT ACTIONS ---
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

  setTargetDuration(durationMinutes) {
    this.workoutProgram.targetDurationMinutes = durationMinutes;
    let count = 5;
    if (durationMinutes <= 30) count = 3;
    else if (durationMinutes <= 45) count = 4;
    else if (durationMinutes <= 60) count = 5;
    else if (durationMinutes <= 75) count = 6;
    else count = 7;
    
    this.setTargetExerciseCount(count, false);
    this.notify();
  }

  setTargetExerciseCount(count, shouldNotify = true) {
    this.workoutProgram.targetExerciseCount = count;
    const day = this.getCurrentDay();
    if (day && day.exercises) {
      if (day.exercises.length < count) {
        const pool = this.workoutProgram.realExercisePool || [];
        while (day.exercises.length < count && pool.length > 0) {
          const poolEx = pool[day.exercises.length % pool.length];
          const newExId = `ex_cust_${Date.now()}_${day.exercises.length}`;
          day.exercises.push({
            id: newExId,
            name: poolEx.name,
            category: poolEx.category,
            targetMuscle: poolEx.targetMuscle,
            originalName: poolEx.name,
            isSubstituted: false,
            sets: [
              { setNum: 1, weight: 20, reps: 10, rpe: 8, completed: false },
              { setNum: 2, weight: 20, reps: 10, rpe: 8.5, completed: false },
              { setNum: 3, weight: 20, reps: 8, rpe: 9, completed: false }
            ],
            alternatives: [
              { id: `alt_${newExId}`, name: poolEx.altNotes || "Alternativa equivalente", note: poolEx.altNotes || "Mismo patrón biomecánico" }
            ]
          });
        }
      } else if (day.exercises.length > count) {
        day.exercises = day.exercises.slice(0, count);
      }
    }
    if (shouldNotify) this.notify();
  }

  applySplitPreset(splitId) {
    if (splitId === "fullbody_3d") {
      this.workoutProgram.daysCount = 3;
      this.workoutProgram.activeDayIndex = 0;
    } else if (splitId === "ppl_5d") {
      this.workoutProgram.daysCount = 5;
      this.workoutProgram.activeDayIndex = 0;
    } else if (splitId === "ppl_6d") {
      this.workoutProgram.daysCount = 6;
      this.workoutProgram.activeDayIndex = 0;
    } else {
      this.workoutProgram.daysCount = 4;
      this.workoutProgram.activeDayIndex = 0;
    }
    this.notify();
  }

  getCurrentDay() {
    return this.workoutProgram.days[this.workoutProgram.activeDayIndex] || this.workoutProgram.days[0];
  }

  toggleSetCompleted(exerciseId, setNum) {
    const day = this.getCurrentDay();
    if (!day || !day.exercises) return;

    const exercise = day.exercises.find(e => e.id === exerciseId);
    if (exercise && exercise.sets) {
      const set = exercise.sets.find(s => s.setNum === setNum);
      if (set) {
        set.completed = !set.completed;
        this.saveCurrentStateToHistory();
        this.notify();
      }
    }
  }

  substituteExercise(exerciseId, alternativeId) {
    const day = this.getCurrentDay();
    if (!day || !day.exercises) return;

    const exercise = day.exercises.find(e => e.id === exerciseId);
    if (exercise && exercise.alternatives) {
      const alt = exercise.alternatives.find(a => a.id === alternativeId);
      if (alt) {
        exercise.name = alt.name;
        exercise.isSubstituted = true;
        this.notify();
      }
    }
  }

  // --- NUTRITION & ALLERGEN ENGINE (7 DÍAS X 5 COMIDAS) ---
  setNutritionActiveWeekDay(dayIndex) {
    this.nutrition.activeWeekDayIndex = dayIndex;
    this.notify();
  }

  toggleAllergy(allergyId) {
    const idx = this.userProfile.allergies.indexOf(allergyId);
    if (idx >= 0) {
      this.userProfile.allergies.splice(idx, 1);
    } else {
      this.userProfile.allergies.push(allergyId);
    }
    this.saveUserProfileToStorage();
    this.autoEnforceSafeMeals();
    this.notify();
  }

  // MOTOR DE FILTRADO IMPLACABLE DE ALÉRGENOS
  isMealSafe(mealObj) {
    const activeAllergies = this.userProfile.allergies || [];
    const customAllergies = (this.userProfile.customAllergies || "").toLowerCase().trim();

    // Check pre-tagged allergens
    const mealAllergens = mealObj.allergens || [];
    const hasPresetConflict = mealAllergens.some(a => activeAllergies.includes(a));
    if (hasPresetConflict) return false;

    // Check ingredient text against custom allergies
    if (customAllergies.length > 0) {
      const customList = customAllergies.split(',').map(s => s.trim()).filter(Boolean);
      const ingredientsText = (mealObj.ingredients || []).join(' ').toLowerCase() + ' ' + (mealObj.title || '').toLowerCase();
      const hasCustomConflict = customList.some(c => ingredientsText.includes(c));
      if (hasCustomConflict) return false;
    }

    return true;
  }

  // AUTOGESTIÓN DE EXCLUSIÓN: Reemplaza comidas prohibidas automáticamente por la primera alternativa segura
  autoEnforceSafeMeals() {
    if (!this.nutrition || !this.nutrition.weeklyPlan) return;

    this.nutrition.weeklyPlan.forEach(day => {
      day.meals.forEach(m => {
        if (!this.isMealSafe(m)) {
          // Find first safe alternative
          const safeAlt = (m.alternatives || []).find(alt => this.isMealSafe(alt));
          if (safeAlt) {
            m.title = safeAlt.title;
            m.allergens = safeAlt.allergens;
            m.ingredients = safeAlt.ingredients;
            m.calories = safeAlt.calories;
            m.p = safeAlt.p;
            m.c = safeAlt.c;
            m.f = safeAlt.f;
          }
        }
      });
    });
  }

  swapWeeklyMeal(dayIndex, mealIndex, altObj) {
    const day = this.nutrition.weeklyPlan[dayIndex];
    if (day && day.meals[mealIndex]) {
      const m = day.meals[mealIndex];
      m.title = altObj.title;
      m.allergens = altObj.allergens;
      m.ingredients = altObj.ingredients;
      m.calories = altObj.calories;
      m.p = altObj.p;
      m.c = altObj.c;
      m.f = altObj.f;
      this.notify();
    }
  }

  addFoodLog(item) {
    const newLog = {
      id: "f_" + Date.now(),
      name: item.name,
      meal: item.meal || "Adicional",
      calories: item.calories,
      p: item.p,
      c: item.c,
      f: item.f
    };
    this.nutrition.loggedFood.push(newLog);
    this.saveCurrentStateToHistory();
    this.notify();
  }

  removeFoodLog(id) {
    this.nutrition.loggedFood = this.nutrition.loggedFood.filter(f => f.id !== id);
    this.saveCurrentStateToHistory();
    this.notify();
  }

  getTotals() {
    return this.nutrition.loggedFood.reduce(
      (acc, curr) => ({
        calories: acc.calories + curr.calories,
        protein: acc.protein + curr.p,
        carbs: acc.carbs + curr.c,
        fat: acc.fat + curr.f
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }

  // GENERADOR DE LISTA DE LA COMPRA SEMANAL CONSOLIDADA
  generateGroceryList() {
    const list = {};
    if (!this.nutrition || !this.nutrition.weeklyPlan) return [];

    this.nutrition.weeklyPlan.forEach(day => {
      day.meals.forEach(m => {
        if (this.isMealSafe(m) && m.ingredients) {
          m.ingredients.forEach(ing => {
            list[ing] = (list[ing] || 0) + 1;
          });
        }
      });
    });

    return Object.keys(list).map(ing => `${ing} (x${list[ing]} tomas)`);
  }

  // --- USER PROFILE & METABOLISM ---
  updateUserProfile(partialProfile) {
    this.userProfile = { ...this.userProfile, ...partialProfile };
    this.recalculateMetabolism();
    this.saveUserProfileToStorage();
    this.autoEnforceSafeMeals();
    this.notify();
  }

  recalculateMetabolism() {
    const p = this.userProfile;
    let bmr = 10 * p.weight + 6.25 * p.height - 5 * p.age + (p.gender === 'male' ? 5 : -161);
    bmr = Math.round(bmr);

    let tdee = Math.round(bmr * p.activityLevel);

    let targetCal = tdee;
    if (p.goal === 'fat_loss') targetCal = tdee - 500;
    else if (p.goal === 'muscle_gain') targetCal = tdee + 350;

    let proteinGrams = Math.round(p.weight * 2.2);
    let fatGrams = Math.round((targetCal * 0.25) / 9);
    let carbsGrams = Math.round((targetCal - (proteinGrams * 4 + fatGrams * 9)) / 4);

    if (p.dietType === 'keto') {
      carbsGrams = 30;
      proteinGrams = Math.round(p.weight * 2.0);
      fatGrams = Math.round((targetCal - (proteinGrams * 4 + carbsGrams * 4)) / 9);
    } else if (p.dietType === 'high_protein') {
      proteinGrams = Math.round(p.weight * 2.5);
      carbsGrams = Math.round((targetCal * 0.40) / 4);
      fatGrams = Math.round((targetCal - (proteinGrams * 4 + carbsGrams * 4)) / 9);
    }

    this.userProfile.bmr = bmr;
    this.userProfile.tdee = tdee;
    this.userProfile.targetCalories = targetCal;
    this.userProfile.targetProtein = proteinGrams;
    this.userProfile.targetCarbs = carbsGrams;
    this.userProfile.targetFat = fatGrams;
    this.nutrition.targets = { calories: targetCal, protein: proteinGrams, carbs: carbsGrams, fat: fatGrams };
  }

  saveUserProfileToStorage() {
    localStorage.setItem("aura_user_profile", JSON.stringify(this.userProfile));
  }

  // HISTÓRICO PERSISTENTE INDEXEDDB
  async saveCurrentStateToHistory() {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) return;

      const dateStr = new Date().toISOString().split('T')[0];
      const activeDay = this.getCurrentDay();

      if (activeDay) {
        await dbService.saveWorkoutLog(currentUser.id, dateStr, activeDay);
      }

      await dbService.saveNutritionLog(currentUser.id, dateStr, {
        targets: this.nutrition.targets,
        totals: this.getTotals(),
        loggedFood: this.nutrition.loggedFood
      });
    } catch (e) {}
  }
}

export const appState = new AppState();
