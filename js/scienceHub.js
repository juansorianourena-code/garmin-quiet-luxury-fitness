// FitExpert Studio - Science & Expert Evidence Hub
import { SCIENCE_CITATIONS } from './scienceBase.js';

export function initScienceHub() {
  const container = document.getElementById('scienceCardsContainer');
  if (!container) return;

  container.innerHTML = '';

  SCIENCE_CITATIONS.forEach(citation => {
    const card = document.createElement('div');
    card.className = 'card glass-card';
    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 12px;">
        <span class="badge badge-purple"><i class="fa-solid ${citation.icon}"></i> ${citation.badge}</span>
        <i class="fa-solid fa-bookmark" style="color:var(--accent-cyan); font-size:14px;"></i>
      </div>
      <h3 style="font-family:var(--font-heading); font-size:18px; font-weight:700; color:var(--text-main); margin-bottom: 8px; line-height:1.3;">
        ${citation.title}
      </h3>
      <p style="font-size:12px; color:var(--accent-cyan); font-weight:600; margin-bottom: 12px;">
        <i class="fa-solid fa-user-graduate"></i> ${citation.authors}
      </p>
      <div style="background:rgba(11,15,25,0.5); padding:14px; border-radius:var(--radius-md); border-left:3px solid var(--accent-purple);">
        <p style="font-size:13px; color:var(--text-muted); line-height:1.5;">
          "${citation.summary}"
        </p>
        <span style="display:block; font-size:11px; color:var(--text-dim); margin-top:8px; font-style:italic;">
          Fuente: ${citation.journal}
        </span>
      </div>
    `;
    container.appendChild(card);
  });
}
