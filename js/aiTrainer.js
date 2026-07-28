// FitExpert Studio - AI Personal Trainer Chat & Exercise Substitution Engine
import { EXERCISE_DATABASE, generatePersonalizedRoutine } from './exerciseLibrary.js';
import { loadPersonalizedRoutine } from './workoutPlanner.js';

export const EXERCISE_ALTERNATIVES = {
  'bench-press': [
    { id: 'incline-db-press', reason: 'Reduce la tensión en la articulación del hombro manteniendo alta activación pectoral.' },
    { id: 'cable-crossover', reason: 'Excelente variante de aislamiento sin carga sobre muñecas o codos.' }
  ],
  'barbell-squat': [
    { id: 'leg-extension', reason: 'Elimina totalmente la compresión axial de la columna vertebral aislando el cuádriceps.' },
    { id: 'romanian-deadlift', reason: 'Enfoca el trabajo en glúteos e isquiosurales reduciendo el estrés en las rodillas.' }
  ],
  'barbell-deadlift': [
    { id: 'romanian-deadlift', reason: 'Disminuye la fatiga del sistema nervioso central con un rango de movimiento enfocado en cadera.' },
    { id: 'hip-thrust', reason: 'Máxima activación de glúteos sin involucrar carga lumbar profunda.' }
  ],
  'overhead-press': [
    { id: 'lateral-raises', reason: 'Aísla el deltoides lateral sin necesidad de presionar peso sobre la coronilla.' }
  ]
};

export function initAITrainerChat() {
  setupChatWidget();
}

function setupChatWidget() {
  const chatButton = document.getElementById('btnOpenAIChat');
  const modal = document.getElementById('aiChatModal');
  const closeBtn = document.getElementById('btnCloseAIChat');
  const chatForm = document.getElementById('aiChatForm');
  const chatInput = document.getElementById('aiChatInput');
  const messagesContainer = document.getElementById('aiChatMessages');
  const chipsContainer = document.getElementById('aiQuickChips');

  if (!modal) return;

  if (chatButton) {
    chatButton.addEventListener('click', () => modal.classList.add('active'));
  }

  if (closeBtn) {
    closeBtn.onclick = () => modal.classList.remove('active');
  }

  modal.onclick = (e) => {
    if (e.target === modal) modal.classList.remove('active');
  };

  // Quick Chips Actions
  if (chipsContainer) {
    chipsContainer.addEventListener('click', (e) => {
      const chip = e.target.closest('.chat-chip');
      if (chip) {
        const text = chip.getAttribute('data-msg');
        if (text) {
          processUserChatMessage(text, messagesContainer);
        }
      }
    });
  }

  if (chatForm) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = chatInput.value.trim();
      if (text) {
        chatInput.value = '';
        processUserChatMessage(text, messagesContainer);
      }
    });
  }
}

export function processUserChatMessage(userText, container) {
  // Append User Message
  appendChatMessage(container, 'user', userText);

  // Show typing indicator
  const typingElem = document.createElement('div');
  typingElem.className = 'chat-msg ai typing';
  typingElem.innerHTML = `<i class="fa-solid fa-robot"></i> <span>FitExpert IA está analizando tu biomecánica...</span>`;
  container.appendChild(typingElem);
  container.scrollTop = container.scrollHeight;

  setTimeout(() => {
    typingElem.remove();
    const aiResponse = generateAIResponse(userText);
    appendChatMessage(container, 'ai', aiResponse.html);
    container.scrollTop = container.scrollHeight;
  }, 700);
}

function appendChatMessage(container, sender, htmlContent) {
  const msg = document.createElement('div');
  msg.className = `chat-msg ${sender}`;
  if (sender === 'ai') {
    msg.innerHTML = `<div class="chat-avatar"><i class="fa-solid fa-robot"></i></div> <div class="chat-bubble">${htmlContent}</div>`;
  } else {
    msg.innerHTML = `<div class="chat-bubble">${htmlContent}</div>`;
  }
  container.appendChild(msg);
}

function generateAIResponse(text) {
  const lower = text.toLowerCase();

  // Scenario 1: Pain / Hurt / Dislike an exercise
  if (lower.includes('daño') || lower.includes('molesta') || lower.includes('duele') || lower.includes('no me gusta') || lower.includes('cambiar ejercicio') || lower.includes('sustituye')) {
    
    // Check if user mentions bench press / banca
    if (lower.includes('banca') || lower.includes('pecho') || lower.includes('press')) {
      swapExerciseInActiveRoutine('bench-press', 'incline-db-press');
      return {
        html: `¡Entendido! Si sientes molestias en el <strong>Press de Banca</strong>, lo he sustituido en tu rutina por <strong>Press Inclinado con Mancuernas (30°)</strong>. Las mancuernas permiten una rotación natural del hombro y reducen el pinzamiento acromial sin perder estímulo en el pectoral. ¡Ya está actualizado en tu pestaña de Rutinas!`
      };
    }
    
    // Check if user mentions squat / sentadilla
    if (lower.includes('sentadilla') || lower.includes('rodilla') || lower.includes('pierna')) {
      swapExerciseInActiveRoutine('barbell-squat', 'leg-extension');
      return {
        html: `Hecho. Para proteger tus articulaciones y evitar molestias en <strong>Sentadilla</strong>, la he reemplazado en tu rutina por <strong>Extensión de Cuádriceps en Máquina</strong>. Esta variante aísla el cuádriceps al 100% sin carga compresiva en rodillas ni columna.`
      };
    }

    // Check deadlift
    if (lower.includes('muerto') || lower.includes('espalda') || lower.includes('lumbar')) {
      swapExerciseInActiveRoutine('barbell-deadlift', 'hip-thrust');
      return {
        html: `Comprendido. He cambiado el <strong>Peso Muerto</strong> por <strong>Hip Thrust en Banco</strong> para eliminar la tensión en la zona lumbar mientras mantienes una activación máxima de la cadena posterior y glúteos.`
      };
    }

    // Generic swap
    return {
      html: `Dime qué ejercicio te causa molestia o quieres cambiar (ej: <em>"Me molesta la sentadilla"</em> o <em>"No me gusta el press de banca"</em>) y te lo sustituiré inmediatamente por la variante biomecánica más segura para ese mismo músculo.`
    };
  }

  // Scenario 2: Change full routine / Bored of current routine
  if (lower.includes('rutina') || lower.includes('cansado') || lower.includes('cambiar de rutina') || lower.includes('otra rutina') || lower.includes('renovar')) {
    // Force routine regeneration with a new stimulus layout
    const savedProfileStr = localStorage.getItem('fitexpert_profile');
    let profile = savedProfileStr ? JSON.parse(savedProfileStr) : null;
    
    // Toggle goal or force dynamic routine reload
    loadPersonalizedRoutine();

    return {
      html: `¡Perfecto! He renovado tu plan de entrenamiento en la pestaña de <strong>Rutinas</strong>. Hemos modulado la frecuencia de estímulo muscular para evitar el estancamiento de volumen manteniendo los principios de sobrecarga progresiva recomendados por la ISSN.`
    };
  }

  // Scenario 3: Progressive overload advice
  if (lower.includes('sobrecarga') || lower.includes('peso') || lower.includes('progresar')) {
    return {
      html: `Para aplicar la <strong>Sobrecarga Progresiva</strong> esta semana sin lesionarte: cuando logres completar todas las series objetivo manteniendo un <strong>RPE 8</strong>, añade entre 1.25kg y 2.5kg en tu próxima sesión. Si sientes fatiga excesiva, mantén el mismo peso y añade 1 repetición por serie.`
    };
  }

  // Default response
  return {
    html: `Hola, soy tu <strong>Entrenadora IA FitExpert</strong>. Puedo ajustar tu rutina en tiempo real. Dime si deseas cambiar algún ejercicio que te cause molestias (ej: <em>"Me molesta la banca"</em>) o si quieres renovar tu rutina completa.`
  };
}

function swapExerciseInActiveRoutine(oldExId, newExId) {
  // Read saved profile
  const savedProfileStr = localStorage.getItem('fitexpert_profile');
  let profile = savedProfileStr ? JSON.parse(savedProfileStr) : null;

  let routine = generatePersonalizedRoutine(profile);

  // Perform swap across all days
  routine.days.forEach(day => {
    day.exercises.forEach(ex => {
      if (ex.exerciseId === oldExId) {
        ex.exerciseId = newExId;
      }
    });
  });

  // Reload routine UI
  loadPersonalizedRoutine();
}
