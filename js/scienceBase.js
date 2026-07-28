// FitExpert Studio - Science Base Data & Algorithmic Equations
// Based on ISSN (International Society of Sports Nutrition), ACSM, Mifflin-St Jeor & Katch-McArdle

export const SCIENCE_CITATIONS = [
  {
    id: 'issn-protein',
    title: 'Posición de la ISSN sobre la Ingesta de Proteínas y Entrenamiento',
    authors: 'Jäger, R., Kerksick, C. M., Campbell, B. I., et al.',
    journal: 'Journal of the International Society of Sports Nutrition (2017)',
    summary: 'Para optimizar la síntesis de proteína muscular (MPS) y preservar masa magra durante un déficit calórico, se recomienda una ingesta de 1.6 a 2.4 g/kg/día.',
    badge: 'Nutrición Deportiva',
    icon: 'fa-dna'
  },
  {
    id: 'mifflin-bmr',
    title: 'Ecuación de Mifflin-St Jeor para la Tasa Metabólica Basal (BMR)',
    authors: 'Mifflin, M. D., St Jeor, S. T., et al.',
    journal: 'The American Journal of Clinical Nutrition (1990)',
    summary: 'Identificada como la fórmula diagnóstica más precisa en adultos sanos con un margen de error menor al 10% respecto a calorimetría indirecta.',
    badge: 'Metabolismo',
    icon: 'fa-calculator'
  },
  {
    id: 'progressive-overload',
    title: 'Principios de Periodización y Sobrecarga Progresiva',
    authors: 'Schoenfeld, B. J., Ogborn, D., & Krieger, J. W.',
    journal: 'Journal of Sports Sciences (2017)',
    summary: 'El volumen total de entrenamiento (Series x Repeticiones x Carga) es la variable primaria impulsora de la hipertrofia muscular. El incremento gradual del peso o repeticiones con RPE 7-9 estimula la adaptación neuromuscular.',
    badge: 'Biomecánica',
    icon: 'fa-dumbbell'
  },
  {
    id: 'neat-fat-loss',
    title: 'Termogénesis por Actividad No Asociada al Ejercicio (NEAT)',
    authors: 'Levine, J. A.',
    journal: 'Best Practice & Research Clinical Endocrinology & Metabolism (2002)',
    summary: 'El NEAT (caminar, posturas, movimiento diario) representa hasta el 15-30% del gasto calórico total diario y es el componente más variable durante la fase de pérdida de grasa.',
    badge: 'Déficit Calórico',
    icon: 'fa-person-walking'
  }
];

// Calculation Helpers
export function calculateBMR(gender, weightKg, heightCm, ageYears, bodyFatPercent = null) {
  // If Body Fat % is provided, use Katch-McArdle Formula
  if (bodyFatPercent !== null && bodyFatPercent > 0 && bodyFatPercent < 60) {
    const leanBodyMassKg = weightKg * (1 - bodyFatPercent / 100);
    return Math.round(370 + (21.6 * leanBodyMassKg));
  }

  // Mifflin-St Jeor Formula
  // Male: (10 * weight) + (6.25 * height) - (5 * age) + 5
  // Female: (10 * weight) + (6.25 * height) - (5 * age) - 161
  const base = (10 * weightKg) + (6.25 * heightCm) - (5 * ageYears);
  return gender === 'female' ? Math.round(base - 161) : Math.round(base + 5);
}

export function calculateTDEE(bmr, activityLevel) {
  const multipliers = {
    sedentary: 1.2,      // Poco o ningún ejercicio / Trabajo de oficina
    light: 1.375,        // Ejercicio ligero 1-3 días/semana
    moderate: 1.55,      // Ejercicio moderado 3-5 días/semana
    heavy: 1.725,        // Ejercicio intenso 6-7 días/semana
    athlete: 1.9         // Atleta de alto rendimiento / Trabajo físico intenso
  };
  const mult = multipliers[activityLevel] || 1.375;
  return Math.round(bmr * mult);
}

export function calculateMacroSplit(tdee, goal, weightKg) {
  let targetCalories = tdee;
  let deficitOrSurplusLabel = 'Mantenimiento';
  let percentChange = 0;

  if (goal === 'deficit_moderate') {
    targetCalories = Math.round(tdee * 0.80); // 20% deficit
    deficitOrSurplusLabel = 'Déficit Moderado (Pérdida de Grasa Óptima)';
    percentChange = -20;
  } else if (goal === 'deficit_aggressive') {
    targetCalories = Math.round(tdee * 0.75); // 25% deficit
    deficitOrSurplusLabel = 'Déficit Agresivo (Monitorear Fatiga)';
    percentChange = -25;
  } else if (goal === 'surplus_clean') {
    targetCalories = Math.round(tdee * 1.12); // 12% surplus
    deficitOrSurplusLabel = 'Superávit Limpio (Ganancia Muscular Magra)';
    percentChange = 12;
  } else if (goal === 'recomp') {
    targetCalories = Math.round(tdee * 0.95); // 5% deficit
    deficitOrSurplusLabel = 'Recomposición Corporal (Pérdida leve de grasa / Mantenimiento)';
    percentChange = -5;
  }

  // Protein calculation: 2.0g/kg for deficit, 1.8g/kg for surplus/mantenimiento
  const proteinFactor = (goal.includes('deficit')) ? 2.2 : 1.9;
  let proteinGrams = Math.round(weightKg * proteinFactor);
  let proteinCalories = proteinGrams * 4;

  // Fat calculation: 0.9g/kg
  const fatFactor = 0.9;
  let fatGrams = Math.round(weightKg * fatFactor);
  let fatCalories = fatGrams * 9;

  // Remaining calories to Carbs
  let carbCalories = targetCalories - (proteinCalories + fatCalories);
  if (carbCalories < 50 * 4) {
    // Safety check to ensure minimum carbs for brain & workout performance
    carbCalories = 50 * 4;
  }
  let carbGrams = Math.round(carbCalories / 4);

  return {
    tdee,
    targetCalories,
    deficitOrSurplusLabel,
    percentChange,
    proteinGrams,
    proteinCalories,
    fatGrams,
    fatCalories,
    carbGrams,
    carbCalories,
    proteinPct: Math.round((proteinCalories / targetCalories) * 100),
    fatPct: Math.round((fatCalories / targetCalories) * 100),
    carbPct: Math.round((carbCalories / targetCalories) * 100)
  };
}
