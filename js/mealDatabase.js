// FitExpert Studio - Meal Database & Nutritional Templates

export const MEAL_DATABASE = [
  // DESAYUNOS
  {
    id: 'breakfast-1',
    name: 'Tazón de Avena Proteica con Frutos Rojos y Crema de Cacahuete',
    category: 'Desayuno',
    calories: 450,
    protein: 38,
    carbs: 52,
    fat: 12,
    ingredients: [
      '60g Avena integral en copos',
      '30g Proteína de suero (Whey) de Vainilla o Chocolate',
      '100g Frutos rojos mixtos (arándanos, frambuesas)',
      '15g Crema de cacahuete 100% natural',
      '200ml Leche desnatada o bebida vegetal de almendras sin azúcar'
    ],
    instructions: 'Cocinar la avena con la leche durante 3 minutos. Retirar del fuego y mezclar la proteína. Servir con frutos rojos y la crema de cacahuete arriba.'
  },
  {
    id: 'breakfast-2',
    name: 'Tostadas de Pan de Masa Madre con Aguacate y Huevos Revueltos',
    category: 'Desayuno',
    calories: 420,
    protein: 26,
    carbs: 38,
    fat: 18,
    ingredients: [
      '2 rebanadas (80g) Pan de masa madre integral',
      '2 Huevos enteros L + 2 Claras',
      '50g Aguacate maduro',
      'Sal marina, pimienta negra y pimentón dulce'
    ],
    instructions: 'Tostar el pan. Batir los huevos con las claras y cocinar a fuego lento en sartén antiadherente. Añadir el aguacate machacado sobre el pan y colocar los huevos revueltos encima.'
  },

  // ALMUERZOS / ALMUERZO MEDIODÍA
  {
    id: 'lunch-1',
    name: 'Bowl Proteico de Pollo a la Parrilla con Quinoa y Verduras',
    category: 'Comida',
    calories: 580,
    protein: 52,
    carbs: 62,
    fat: 14,
    ingredients: [
      '180g Pechuga de pollo desgrasada',
      '70g Quinoa en seco (cocida rinde ~200g)',
      '100g Brócoli al vapor',
      '80g Zanahoria rallada y calabacín a la plancha',
      '10g Aceite de oliva virgen extra (AOVE)'
    ],
    instructions: 'Sazonar el pollo con orégano, ajo y pimienta. Asar a la plancha con la mitad del AOVE. Servir sobre la base de quinoa y verduras al vapor aliñadas con el resto de AOVE.'
  },
  {
    id: 'lunch-2',
    name: 'Salmón al Horno con Arroz Basmati y Espárragos',
    category: 'Comida',
    calories: 620,
    protein: 44,
    carbs: 55,
    fat: 24,
    ingredients: [
      '160g Filete de salmón fresco',
      '60g Arroz Basmati en seco',
      '120g Espárragos trigueros verdes',
      'Eneldo fresco y zumo de limón'
    ],
    instructions: 'Hornear el salmón y espárragos a 200°C durante 15 minutos. Servir con el arroz basmati cocido al vapor y unas gotas de limón fresco.'
  },

  // MERIENDAS / SNACKS
  {
    id: 'snack-1',
    name: 'Yogur Griego 0% con Nueces y Proteína Crispy',
    category: 'Merienda',
    calories: 280,
    protein: 30,
    carbs: 18,
    fat: 9,
    ingredients: [
      '200g Yogur Griego 0% materia grasa',
      '15g Nueces troceadas',
      '15g Proteína aislada o proteína crispy',
      'Canela en polvo'
    ],
    instructions: 'Mezclar el yogur griego con la proteína en polvo y canela. Coronar con las nueces troceadas.'
  },
  {
    id: 'snack-2',
    name: 'Batido Anabólico de Plátano y Proteína',
    category: 'Merienda',
    calories: 310,
    protein: 32,
    carbs: 38,
    fat: 4,
    ingredients: [
      '1 Plátano mediano maduro (100g)',
      '30g Proteína en polvo (Whey)',
      '250ml Bebida de almendras',
      'Hielo al gusto'
    ],
    instructions: 'Triturar todos los ingredientes en batidora durante 45 segundos hasta obtener una consistencia cremosa.'
  },

  // CENAS
  {
    id: 'dinner-1',
    name: 'Merluza a la Plancha con Salteado de Setas y Patata Asada',
    category: 'Cena',
    calories: 410,
    protein: 42,
    carbs: 40,
    fat: 8,
    ingredients: [
      '200g Lomo de merluza fresca',
      '150g Patata mediana cocida o asada',
      '150g Setas/champiñones variados',
      'Ajo, perejil y 5g de AOVE'
    ],
    instructions: 'Asar la patata con piel al microondas o horno. Dorar el ajo con las setas en sartén y cocinar la merluza 3 min por lado.'
  },
  {
    id: 'dinner-2',
    name: 'Ensalada Completa de Atún, Huevo Cocido y Garbanzos',
    category: 'Cena',
    calories: 460,
    protein: 38,
    carbs: 36,
    fat: 16,
    ingredients: [
      '1 Canasta de atún al natural (80g escurrido)',
      '1 Huevo cocido',
      '100g Garbanzos cocidos de bote lavados',
      'Mezcla de canónigos y rúcula',
      '10g Aceite de oliva y vinagre de manzana'
    ],
    instructions: 'Mezclar la base vegetal con los garbanzos, atún desmigado y huevo duro cortado en cuartos. Aliñar al gusto.'
  }
];

export const DEFAULT_WEEKLY_MENU = {
  Lunes: { breakfast: 'breakfast-1', lunch: 'lunch-1', snack: 'snack-1', dinner: 'dinner-1' },
  Martes: { breakfast: 'breakfast-2', lunch: 'lunch-2', snack: 'snack-2', dinner: 'dinner-2' },
  Miércoles: { breakfast: 'breakfast-1', lunch: 'lunch-1', snack: 'snack-1', dinner: 'dinner-1' },
  Jueves: { breakfast: 'breakfast-2', lunch: 'lunch-2', snack: 'snack-2', dinner: 'dinner-2' },
  Viernes: { breakfast: 'breakfast-1', lunch: 'lunch-1', snack: 'snack-1', dinner: 'dinner-1' },
  Sábado: { breakfast: 'breakfast-2', lunch: 'lunch-2', snack: 'snack-2', dinner: 'dinner-2' },
  Domingo: { breakfast: 'breakfast-1', lunch: 'lunch-1', snack: 'snack-1', dinner: 'dinner-1' }
};
