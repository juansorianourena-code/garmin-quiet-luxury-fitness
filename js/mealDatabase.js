// FitExpert Studio - Expanded Meal Database & Personalized Dietary Engine

export const MEAL_DATABASE = [
  // DESAYUNOS
  {
    id: 'b-oatmeal-fit',
    name: 'Avena Proteica con Frutos Rojos y Crema de Cacahuete',
    category: 'Desayuno',
    calories: 450, protein: 38, carbs: 52, fat: 12,
    style: 'healthy',
    goalFit: ['deficit', 'surplus', 'recomp'],
    allergies: ['sin-lactosa', 'vegetariano'],
    ingredients: [
      '60g Avena integral en copos',
      '30g Proteína aislada (Whey/Vegana)',
      '100g Frutos rojos mixtos',
      '15g Crema de cacahuete 100% natural',
      '200ml Bebida vegetal de almendras sin azúcar'
    ]
  },
  {
    id: 'b-avocado-eggs',
    name: 'Tostadas de Masa Madre con Aguacate y Huevos Revueltos',
    category: 'Desayuno',
    calories: 420, protein: 26, carbs: 38, fat: 18,
    style: 'mediterraneo',
    goalFit: ['deficit', 'recomp'],
    allergies: ['sin-lactosa', 'vegetariano', 'sin-frutos-secos'],
    ingredients: [
      '2 rebanadas (80g) Pan de masa madre integral',
      '2 Huevos enteros L + 2 Claras',
      '50g Aguacate maduro',
      'Aceite de oliva y sal marina'
    ]
  },
  {
    id: 'b-pancakes-fit',
    name: 'Tortitas Fit de Plátano y Proteína con Miel',
    category: 'Desayuno',
    calories: 490, protein: 36, carbs: 62, fat: 10,
    style: 'healthy',
    goalFit: ['surplus', 'recomp'],
    allergies: ['sin-lactosa', 'vegetariano', 'sin-frutos-secos'],
    ingredients: [
      '1 Plátano maduro',
      '50g Harina de avena integral',
      '30g Proteína de vainilla',
      '100ml Claras de huevo',
      '10g Miel pura'
    ]
  },
  {
    id: 'b-keto-omelette',
    name: 'Omelette de Pavo, Queso Feta y Espinacas',
    category: 'Desayuno',
    calories: 380, protein: 34, carbs: 6, fat: 24,
    style: 'keto',
    goalFit: ['deficit'],
    allergies: ['sin-gluten', 'sin-frutos-secos'],
    ingredients: [
      '3 Huevos enteros',
      '60g Pechuga de pavo en lonchas',
      '40g Queso Feta',
      '50g Espinacas frescas',
      '5g Aceite de oliva'
    ]
  },

  // ALMUERZOS / COMIDAS
  {
    id: 'l-chicken-quinoa',
    name: 'Bowl Proteico de Pollo a la Parrilla con Quinoa y Verduras',
    category: 'Comida',
    calories: 580, protein: 52, carbs: 62, fat: 14,
    style: 'healthy',
    goalFit: ['deficit', 'surplus', 'recomp'],
    allergies: ['sin-gluten', 'sin-lactosa', 'sin-frutos-secos'],
    ingredients: [
      '180g Pechuga de pollo',
      '70g Quinoa en seco (cocida ~200g)',
      '100g Brócoli al vapor',
      '80g Zanahoria y calabacín',
      '10g Aceite de oliva virgen extra'
    ]
  },
  {
    id: 'l-salmon-basmati',
    name: 'Salmón al Horno con Arroz Basmati y Espárragos',
    category: 'Comida',
    calories: 620, protein: 44, carbs: 55, fat: 24,
    style: 'mediterraneo',
    goalFit: ['surplus', 'recomp'],
    allergies: ['sin-gluten', 'sin-lactosa', 'sin-frutos-secos'],
    ingredients: [
      '160g Filete de salmón fresco',
      '60g Arroz Basmati',
      '120g Espárragos trigueros',
      'Eneldo fresco y limón'
    ]
  },
  {
    id: 'l-pasta-beef',
    name: 'Pasta Integral Boloñesa Magra con Ternera 95/5',
    category: 'Comida',
    calories: 640, protein: 48, carbs: 75, fat: 16,
    style: 'meal-prep',
    goalFit: ['surplus', 'recomp'],
    allergies: ['sin-lactosa', 'sin-frutos-secos'],
    ingredients: [
      '80g Pasta integral en seco',
      '160g Ternera picada magra 95/5',
      '150g Salsa de tomate casera',
      'Orégano y ajo molido'
    ]
  },
  {
    id: 'l-tofu-rice-bowl',
    name: 'Poke Bowl Vegano de Tofu Marinado y Edamame',
    category: 'Comida',
    calories: 510, protein: 32, carbs: 60, fat: 15,
    style: 'healthy',
    goalFit: ['deficit', 'recomp'],
    allergies: ['sin-gluten', 'sin-lactosa', 'vegetariano'],
    ingredients: [
      '180g Tofu firme marinado en soja',
      '60g Arroz salvaje',
      '80g Edamame desgranado',
      '50g Aguacate y pepino'
    ]
  },

  // MERIENDAS
  {
    id: 's-greek-yogurt',
    name: 'Yogur Griego 0% con Nueces y Canela',
    category: 'Merienda',
    calories: 260, protein: 28, carbs: 16, fat: 8,
    style: 'mediterraneo',
    goalFit: ['deficit', 'recomp'],
    allergies: ['sin-gluten', 'vegetariano'],
    ingredients: [
      '200g Yogur Griego 0%',
      '15g Nueces troceadas',
      'Canela en polvo'
    ]
  },
  {
    id: 's-shake-banana',
    name: 'Batido Proteico de Plátano y Crema de Almendras',
    category: 'Merienda',
    calories: 340, protein: 32, carbs: 38, fat: 8,
    style: 'healthy',
    goalFit: ['surplus', 'recomp'],
    allergies: ['sin-gluten', 'sin-lactosa', 'vegetariano'],
    ingredients: [
      '1 Plátano maduro',
      '30g Proteína de suero o vegetal',
      '15g Crema de almendras 100%',
      '250ml Leche de almendras'
    ]
  },

  // CENAS
  {
    id: 'd-hake-potato',
    name: 'Lomo de Merluza con Patata Asada y Setas',
    category: 'Cena',
    calories: 410, protein: 42, carbs: 40, fat: 8,
    style: 'mediterraneo',
    goalFit: ['deficit', 'recomp'],
    allergies: ['sin-gluten', 'sin-lactosa', 'sin-frutos-secos'],
    ingredients: [
      '200g Lomo de merluza',
      '150g Patata cocida/asada',
      '150g Setas al ajillo',
      '5g Aceite de oliva'
    ]
  },
  {
    id: 'd-tuna-salad',
    name: 'Ensalada Completa de Atún, Huevo Cocido y Garbanzos',
    category: 'Cena',
    calories: 450, protein: 38, carbs: 36, fat: 16,
    style: 'meal-prep',
    goalFit: ['deficit', 'recomp'],
    allergies: ['sin-gluten', 'sin-lactosa', 'sin-frutos-secos'],
    ingredients: [
      '1 lata (80g) Atún al natural',
      '1 Huevo duro',
      '100g Garbanzos cocidos',
      'Mezcla de canónigos y rúcula',
      '10g Aceite de oliva'
    ]
  },
  {
    id: 'd-turkey-wrap',
    name: 'Wrap Integral de Pavo, Hummus y Canónigos',
    category: 'Cena',
    calories: 480, protein: 36, carbs: 48, fat: 14,
    style: 'healthy',
    goalFit: ['surplus', 'recomp'],
    allergies: ['sin-lactosa', 'sin-frutos-secos'],
    ingredients: [
      '1 Tortilla Wrap integral grande',
      '140g Pechuga de pavo a la plancha',
      '40g Hummus de garbanzo',
      'Tomate en rodajas y rúcula'
    ]
  }
];
