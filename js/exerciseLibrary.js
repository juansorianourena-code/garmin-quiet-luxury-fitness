// FitExpert Studio - Exercise Library & Science-Based Workout Templates

export const EXERCISE_DATABASE = [
  // PECHO / PUSH
  {
    id: 'bench-press',
    name: 'Press de Banca Plano con Barra',
    category: 'Pecho',
    equipment: 'Barra & Banco',
    mechanics: 'Compuesto',
    targetMuscles: ['Pectoral Mayor', 'Tríceps Braquial', 'Deltoides Anterior'],
    cues: 'Retracción escapular activa, leg drive firme en el suelo, codos en ángulo de 45° a 75° respecto al torso.',
    rpeTarget: 'RPE 7.5 - 9',
    repRange: '6 - 10 repeticiones'
  },
  {
    id: 'incline-db-press',
    name: 'Press Inclinado con Mancuernas (30°)',
    category: 'Pecho',
    equipment: 'Mancuernas',
    mechanics: 'Compuesto',
    targetMuscles: ['Pectoral Superior (Clavicular)', 'Deltoides Anterior'],
    cues: 'Inclinación de banco a 30° para maximizar estimulación clavicular reduciendo el estrés en el hombro.',
    rpeTarget: 'RPE 8 - 9',
    repRange: '8 - 12 repeticiones'
  },
  {
    id: 'cable-crossover',
    name: 'Cruce de Poleas de Alto a Bajo',
    category: 'Pecho',
    equipment: 'Polea',
    mechanics: 'Aislamiento',
    targetMuscles: ['Pectoral Inferior y Medio'],
    cues: 'Mantener un pico de contracción de 1 segundo al cruzar las manos en la línea media del cuerpo.',
    rpeTarget: 'RPE 8.5 - 10',
    repRange: '12 - 15 repeticiones'
  },

  // ESPALDA / PULL
  {
    id: 'barbell-deadlift',
    name: 'Peso Muerto Convencional con Barra',
    category: 'Espalda / Cadena Posterior',
    equipment: 'Barra',
    mechanics: 'Compuesto',
    targetMuscles: ['Erectores Espinales', 'Glúteo Mayor', 'Isquiosurales', 'Dorsal Ancho'],
    cues: 'Espina neutra, empujar el suelo con las piernas antes de extender la cadera (hip hinge). No redondear zona lumbar.',
    rpeTarget: 'RPE 7 - 8.5',
    repRange: '4 - 8 repeticiones'
  },
  {
    id: 'lat-pulldown',
    name: 'Jalón al Pecho con Agarre Neutro/Ancho',
    category: 'Espalda',
    equipment: 'Polea',
    mechanics: 'Compuesto',
    targetMuscles: ['Dorsal Ancho', 'Redondo Mayor', 'Bíceps'],
    cues: 'Llevar los codos hacia las caderas, no impulsarse exageradamente hacia atrás.',
    rpeTarget: 'RPE 8 - 9',
    repRange: '8 - 12 repeticiones'
  },
  {
    id: 'barbell-row',
    name: 'Remo con Barra Inclinado (Pendlay / Convencional)',
    category: 'Espalda',
    equipment: 'Barra',
    mechanics: 'Compuesto',
    targetMuscles: ['Romboides', 'Trapecio Medio/Inferior', 'Dorsal'],
    cues: 'Mantener torso a 45°, jalar el peso hacia el ombligo contrayendo la escápula.',
    rpeTarget: 'RPE 8 - 9',
    repRange: '8 - 10 repeticiones'
  },

  // HOMBROS / PUSH
  {
    id: 'overhead-press',
    name: 'Press Militar de Pie con Barra (OHP)',
    category: 'Hombro',
    equipment: 'Barra',
    mechanics: 'Compuesto',
    targetMuscles: ['Deltoides Anterior', 'Tríceps', 'Core'],
    cues: 'Contraer glúteos y abdomen firme. Bloquear la barra directamente sobre la coronilla.',
    rpeTarget: 'RPE 8 - 9',
    repRange: '6 - 8 repeticiones'
  },
  {
    id: 'lateral-raises',
    name: 'Elevaciones Laterales con Mancuerna o Polea',
    category: 'Hombro',
    equipment: 'Mancuernas / Polea',
    mechanics: 'Aislamiento',
    targetMuscles: ['Deltoides Lateral'],
    cues: 'Ligeras inclinación hacia adelante, elevar en el plano de la escápula (30° adelantado a los hombros).',
    rpeTarget: 'RPE 9 - 10',
    repRange: '12 - 20 repeticiones'
  },

  // PIERNAS / LEGS
  {
    id: 'barbell-squat',
    name: 'Sentadilla Trasera con Barra (Barra Alta/Baja)',
    category: 'Pierna',
    equipment: 'Barra & Rack',
    mechanics: 'Compuesto',
    targetMuscles: ['Cuádriceps', 'Glúteo Mayor', 'Aductores'],
    cues: 'Rodillas alineadas con la punta del pie, descender al menos hasta el paralelo (90° de rodilla).',
    rpeTarget: 'RPE 7.5 - 9',
    repRange: '6 - 10 repeticiones'
  },
  {
    id: 'romanian-deadlift',
    name: 'Peso Muerto Rumano (RDL)',
    category: 'Pierna',
    equipment: 'Barra / Mancuernas',
    mechanics: 'Compuesto',
    targetMuscles: ['Isquiosurales', 'Glúteos'],
    cues: 'Llevar las caderas hacia atrás sintiendo el estiramiento profundo en isquios. Mantener rodillas con flexión leve.',
    rpeTarget: 'RPE 8 - 9',
    repRange: '8 - 12 repeticiones'
  },
  {
    id: 'hip-thrust',
    name: 'Hip Thrust en Banco con Barra',
    category: 'Pierna / Glúteo',
    equipment: 'Barra & Banco',
    mechanics: 'Compuesto',
    targetMuscles: ['Glúteo Mayor (Máxima activación)'],
    cues: 'Pies a la anchura de hombros, retroversión pélvica al final del recorrido manteniendo barbilla en el pecho.',
    rpeTarget: 'RPE 8 - 9.5',
    repRange: '8 - 12 repeticiones'
  },
  {
    id: 'leg-extension',
    name: 'Extensión de Cuádriceps en Máquina',
    category: 'Pierna',
    equipment: 'Máquina',
    mechanics: 'Aislamiento',
    targetMuscles: ['Cuádriceps (Recto Femoral)'],
    cues: 'Pausa de 1 segundo arriba. Controlar la fase excéntrica en 2-3 segundos.',
    rpeTarget: 'RPE 9 - 10',
    repRange: '12 - 15 repeticiones'
  },

  // BRAZOS
  {
    id: 'db-biceps-curl',
    name: 'Curl de Bíceps en Banco Inclinado',
    category: 'Brazos',
    equipment: 'Mancuernas',
    mechanics: 'Aislamiento',
    targetMuscles: ['Bíceps Braquial (Cabeza Larga)'],
    cues: 'Permite un estiramiento profundo en la posición inicial debido a la inclinación del banco.',
    rpeTarget: 'RPE 8.5 - 10',
    repRange: '10 - 12 repeticiones'
  },
  {
    id: 'triceps-rope-pushdown',
    name: 'Extensión de Tríceps en Polea con Cuerda',
    category: 'Brazos',
    equipment: 'Polea',
    mechanics: 'Aislamiento',
    targetMuscles: ['Tríceps Braquial (Cabeza Lateral/Medial)'],
    cues: 'Codos pegados al torso, abrir la cuerda al final de la extensión.',
    rpeTarget: 'RPE 9 - 10',
    repRange: '12 - 15 repeticiones'
  }
];

// Pre-configured Science-Based Templates
export const WORKOUT_TEMPLATES = {
  ppl: {
    id: 'ppl',
    name: 'Push / Pull / Legs (Frecuencia 2 - 6 días/semana)',
    description: 'La división más validada por la ciencia para hipertrofia. Agrupa músculos agonistas y permite 48-72h de recuperación entre sesiones.',
    days: [
      {
        dayName: 'Día 1: Push (Empuje - Pecho, Hombro, Tríceps)',
        exercises: [
          { exerciseId: 'bench-press', sets: 4, reps: '6-8', rpe: '8' },
          { exerciseId: 'incline-db-press', sets: 3, reps: '8-10', rpe: '8.5' },
          { exerciseId: 'overhead-press', sets: 3, reps: '8-10', rpe: '8' },
          { exerciseId: 'lateral-raises', sets: 4, reps: '12-15', rpe: '9' },
          { exerciseId: 'triceps-rope-pushdown', sets: 3, reps: '12-15', rpe: '9.5' }
        ]
      },
      {
        dayName: 'Día 2: Pull (Jalón - Espalda, Deltoides Posterior, Bíceps)',
        exercises: [
          { exerciseId: 'barbell-deadlift', sets: 3, reps: '5-6', rpe: '7.5' },
          { exerciseId: 'lat-pulldown', sets: 4, reps: '8-10', rpe: '8.5' },
          { exerciseId: 'barbell-row', sets: 3, reps: '8-10', rpe: '8' },
          { exerciseId: 'db-biceps-curl', sets: 4, reps: '10-12', rpe: '9' }
        ]
      },
      {
        dayName: 'Día 3: Legs (Pierna Completa & Core)',
        exercises: [
          { exerciseId: 'barbell-squat', sets: 4, reps: '6-8', rpe: '8' },
          { exerciseId: 'romanian-deadlift', sets: 3, reps: '8-10', rpe: '8.5' },
          { exerciseId: 'hip-thrust', sets: 3, reps: '8-12', rpe: '8.5' },
          { exerciseId: 'leg-extension', sets: 3, reps: '12-15', rpe: '9.5' }
        ]
      }
    ]
  },
  upper_lower: {
    id: 'upper_lower',
    name: 'Torso / Pierna (Frecuencia 2 - 4 días/semana)',
    description: 'Excelente balance entre volumen de entrenamiento y recuperación. Ideal para intermedios y etapas de déficit calórico.',
    days: [
      {
        dayName: 'Día 1: Torso Enfoque Fuerza & Densidad',
        exercises: [
          { exerciseId: 'bench-press', sets: 4, reps: '6-8', rpe: '8' },
          { exerciseId: 'barbell-row', sets: 4, reps: '6-8', rpe: '8' },
          { exerciseId: 'overhead-press', sets: 3, reps: '8-10', rpe: '8' },
          { exerciseId: 'lat-pulldown', sets: 3, reps: '10-12', rpe: '8.5' },
          { exerciseId: 'lateral-raises', sets: 3, reps: '12-15', rpe: '9' }
        ]
      },
      {
        dayName: 'Día 2: Pierna Enfoque Cadena Anterior & Posterior',
        exercises: [
          { exerciseId: 'barbell-squat', sets: 4, reps: '6-8', rpe: '8' },
          { exerciseId: 'romanian-deadlift', sets: 4, reps: '8-10', rpe: '8.5' },
          { exerciseId: 'hip-thrust', sets: 3, reps: '10-12', rpe: '8.5' },
          { exerciseId: 'leg-extension', sets: 3, reps: '12-15', rpe: '9' }
        ]
      }
    ]
  }
};
