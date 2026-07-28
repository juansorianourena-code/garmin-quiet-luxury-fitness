// FitExpert Studio - AI Personal Trainer Chat & Exercise Substitution Engine
import { EXERCISE_DATABASE, generatePersonalizedRoutine } from './exerciseLibrary.js';
import { loadPersonalizedRoutine } from './workoutPlanner.js';

export function initAITrainerChat() {
  setupChatWidget();
}

function setupChatWidget() {
  const modal = document.getElementById('aiChatModal');
  const closeBtn = document.getElementById('btnCloseAIChat');
  const chatForm = document.getElementById('aiChatForm');
  const chatInput = document.getElementById('aiChatInput');
  const messagesContainer = document.getElementById('aiChatMessages');
  const chipsContainer = document.getElementById('aiQuickChips');

  if (!modal) return;

  // Bind all buttons that open the AI Chat Modal
  const openButtons = [
    document.getElementById('btnOpenAIChat'),
    document.getElementById('btnWorkoutAIChat'),
    document.getElementById('btnMobileAIChat')
  ];

  openButtons.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.add('active');
      });
    }
  });

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
  appendChatMessage(container, 'user', userText);

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
  }, 600);
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

  if (lower.includes('daño') || lower.includes('molesta') || lower.includes('duele') || lower.includes('no me gusta') || lower.includes('cambiar ejercicio') || lower.includes('sustituye')) {
    
    if (lower.includes('banca') || lower.includes('pecho') || lower.includes('press')) {
      swapExerciseInActiveRoutine('bench-press', 'incline-db-press');
      return {
        html: `¡Entendido! Si sientes molestias en el <strong>Press de Banca</strong>, lo he sustituido en tu rutina por <strong>Press Inclinado con Mancuernas (30°)</strong>. Las mancuernas permiten una rotación natural del hombro reduciendo el estrés acromial. ¡Ya está actualizado en tu pestaña de Rutinas!`
      };
    }
    
    if (lower.includes('sentadilla') || lower.includes('rodilla') || lower.includes('pierna')) {
      swapExerciseInActiveRoutine('barbell-squat', 'leg-extension');
      return {
        html: `Hecho. Para proteger tus articulaciones y evitar molestias en <strong>Sentadilla</strong>, la he reemplazado por <strong>Extensión de Cuádriceps en Máquina</strong>. Aísla el cuádriceps al 100% sin carga en rodillas ni columna.`
      };
    }

    if (lower.includes('muerto') || lower.includes('espalda') || lower.includes('lumbar')) {
      swapExerciseInActiveRoutine('barbell-deadlift', 'hip-thrust');
      return {
        html: `Comprendido. He cambiado el <strong>Peso Muerto</strong> por <strong>Hip Thrust en Banco</strong> para eliminar la tensión lumbar manteniendo la activación de glúteos.`
      };
    }

    return {
      html: `Dime qué ejercicio te molesta (ej: <em>"Me molesta la banca"</em> o <em>"Cambiar sentadilla"</em>) y lo sustituiré en tu rutina por la variante más segura.`
    };
  }

  if (lower.includes('rutina') || lower.includes('cansado') || lower.includes('cambiar de rutina') || lower.includes('otra rutina') || lower.includes('renovar')) {
    loadPersonalizedRoutine();
    return {
      html: `¡Perfecto! He renovado tu plan de entrenamiento en la pestaña de <strong>Rutinas</strong> modulando la estructura para evitar el estancamiento de volumen.`
    };
  }

  if (lower.includes('sobrecarga') || lower.includes('peso') || lower.includes('progresar')) {
    return {
      html: `Para aplicar la <strong>Sobrecarga Progresiva</strong> esta semana: cuando logres completar todas las series objetivo manteniendo un <strong>RPE 8</strong>, añade entre 1.25kg y 2.5kg en tu próxima sesión.`
    };
  }

  return {
    html: `Hola, soy tu <strong>Entrenadora IA FitExpert</strong>. Puedo ajustar tu rutina en tiempo real. Dime si deseas cambiar algún ejercicio (ej: <em>"Me molesta la banca"</em>) o si quieres renovar tu rutina entera.`
  };
}

function swapExerciseInActiveRoutine(oldExId, newExId) {
  const savedProfileStr = localStorage.getItem('fitexpert_profile');
  let profile = savedProfileStr ? JSON.parse(savedProfileStr) : null;

  let routine = generatePersonalizedRoutine(profile);

  routine.days.forEach(day => {
    day.exercises.forEach(ex => {
      if (ex.exerciseId === oldExId) {
        ex.exerciseId = newExId;
      }
    });
  });

  loadPersonalizedRoutine();
}
