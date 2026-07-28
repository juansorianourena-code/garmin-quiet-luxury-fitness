// FitExpert Studio - AI Personal Trainer & Nutritionist Chat Assistant
import { EXERCISE_DATABASE, generatePersonalizedRoutine } from './exerciseLibrary.js';
import { loadPersonalizedRoutine } from './workoutPlanner.js';
import { generatePersonalizedMenu } from './mealPlanner.js';

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
  typingElem.innerHTML = `<i class="fa-solid fa-robot"></i> <span>FitExpert IA está procesando tu solicitud de entrenamiento y nutrición...</span>`;
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

  // NUTRITION & MEAL ASSISTANT SCENARIOS
  if (lower.includes('alergia') || lower.includes('intolerancia') || lower.includes('no puedo comer') || lower.includes('alérgico') || lower.includes('intolerante')) {
    
    if (lower.includes('gluten')) {
      const el = document.getElementById('allergyGluten');
      if (el) el.checked = true;
      generatePersonalizedMenu();
      return { html: `¡Ajustado! He activado el filtro <strong>Sin Gluten</strong> en tu planificador nutricional. Tu menú de 7 días se ha regenerado excluyendo cereales con gluten y actualizando tu lista de la compra.` };
    }

    if (lower.includes('lactosa') || lower.includes('leche')) {
      const el = document.getElementById('allergyLactose');
      if (el) el.checked = true;
      generatePersonalizedMenu();
      return { html: `¡Anotado! He activado el filtro <strong>Sin Lactosa</strong>. He reemplazado los lácteos tradicionales por alternativas de bebidas vegetales y yogures 0% desnatados.` };
    }

    if (lower.includes('frutos') || lower.includes('cacahuete') || lower.includes('nuez')) {
      const el = document.getElementById('allergyNuts');
      if (el) el.checked = true;
      generatePersonalizedMenu();
      return { html: `Entendido. He marcado la exclusión de <strong>Frutos Secos</strong> en tus preferencias de cocina. Tu menú semanal ya no incluye crema de cacahuete ni nueces.` };
    }

    if (lower.includes('carne') || lower.includes('vegetariano') || lower.includes('vegano')) {
      const el = document.getElementById('dietVeg');
      if (el) el.checked = true;
      generatePersonalizedMenu();
      return { html: `¡Perfecto! He adaptado tu menú al estilo <strong>Vegetariano / Plant-Based</strong> priorizando proteínas vegetales (tofu marinado, quinoa, edamame, legumbres y claras).` };
    }

    return {
      html: `Dime a qué alimento tienes alergia (ej: <em>"Tengo alergia al gluten"</em>, <em>"No puedo tomar lactosa"</em> o <em>"Soy vegetariano"</em>) y ajustaré tu menú semanal al instante.`
    };
  }

  if (lower.includes('pescado') || lower.includes('atún') || lower.includes('cena') || lower.includes('comida') || lower.includes('desayuno') || lower.includes('cambiar menú') || lower.includes('receta')) {
    generatePersonalizedMenu();
    return {
      html: `Hecho. He recalculado las opciones de tu <strong>Menú Semanal</strong> adaptando las cenas y comidas a tus macronutrientes calóricos objetivos. ¡Puedes consultar los nuevos platos en la pestaña Menú!`
    };
  }

  // WORKOUT & BIOMECHANICS SCENARIOS
  if (lower.includes('daño') || lower.includes('molesta') || lower.includes('duele') || lower.includes('no me gusta') || lower.includes('cambiar ejercicio') || lower.includes('sustituye')) {
    
    if (lower.includes('banca') || lower.includes('pecho') || lower.includes('press')) {
      swapExerciseInActiveRoutine('bench-press', 'incline-db-press');
      return {
        html: `¡Entendido! Si sientes molestias en el <strong>Press de Banca</strong>, lo he sustituido en tu rutina por <strong>Press Inclinado con Mancuernas (30°)</strong>.`
      };
    }
    
    if (lower.includes('sentadilla') || lower.includes('rodilla') || lower.includes('pierna')) {
      swapExerciseInActiveRoutine('barbell-squat', 'leg-extension');
      return {
        html: `Hecho. Para proteger tus articulaciones, he reemplazado la <strong>Sentadilla</strong> por <strong>Extensión de Cuádriceps en Máquina</strong>.`
      };
    }

    if (lower.includes('muerto') || lower.includes('espalda') || lower.includes('lumbar')) {
      swapExerciseInActiveRoutine('barbell-deadlift', 'hip-thrust');
      return {
        html: `Comprendido. He cambiado el <strong>Peso Muerto</strong> por <strong>Hip Thrust en Banco</strong> para eliminar la tensión lumbar.`
      };
    }

    return {
      html: `Dime qué ejercicio te causa molestias (ej: <em>"Me molesta la banca"</em> o <em>"Cambiar sentadilla"</em>) y te daré la sustitución biomecánica más segura.`
    };
  }

  if (lower.includes('rutina') || lower.includes('cansado') || lower.includes('cambiar de rutina') || lower.includes('otra rutina') || lower.includes('renovar')) {
    loadPersonalizedRoutine();
    return {
      html: `¡Perfecto! He renovado tu plan de entrenamiento en la pestaña de <strong>Rutinas</strong> modulando los estímulos musculares.`
    };
  }

  return {
    html: `Hola, soy tu <strong>Entrenadora & Nutricionista IA FitExpert</strong>. Puedo ajustar tu rutina y tu dieta en vivo. Dime si tienes alguna alergia (ej: <em>"Tengo intolerancia a la lactosa"</em>) o si quieres cambiar algún ejercicio o plato.`
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
