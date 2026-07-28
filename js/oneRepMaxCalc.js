// FitExpert Studio - 1RM Calculator & RPE Engine

export function initOneRepMaxCalc() {
  const form = document.getElementById('oneRepMaxForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    calculate1RM();
  });
}

export function calculate1RM() {
  const weight = parseFloat(document.getElementById('oneRepWeight').value) || 0;
  const reps = parseInt(document.getElementById('oneRepReps').value) || 0;

  if (weight <= 0 || reps <= 0) return;

  // Epley Formula: 1RM = Weight * (1 + Reps / 30)
  const epley = weight * (1 + reps / 30);
  
  // Brzycki Formula: 1RM = Weight * (36 / (37 - Reps))
  const brzycki = weight * (36 / (37 - reps));

  const avg1RM = Math.round((epley + brzycki) / 2);

  // Update DOM Results
  const resElem = document.getElementById('res1RMValue');
  if (resElem) resElem.textContent = `${avg1RM} kg`;

  // Render Percentages Table
  const tableContainer = document.getElementById('res1RMPercentagesTable');
  if (tableContainer) {
    const percentages = [
      { pct: 95, reps: '2 reps', goal: 'Fuerza Máxima' },
      { pct: 90, reps: '3-4 reps', goal: 'Fuerza / Potencia' },
      { pct: 85, reps: '5-6 reps', goal: 'Hipertrofia Pesada' },
      { pct: 80, reps: '7-8 reps', goal: 'Hipertrofia Óptima' },
      { pct: 75, reps: '9-10 reps', goal: 'Hipertrofia Moderada' },
      { pct: 70, reps: '11-12 reps', goal: 'Resistencia Muscular' }
    ];

    tableContainer.innerHTML = `
      <table style="width:100%; border-collapse:collapse; font-size:11px; margin-top:8px;">
        <thead>
          <tr style="background:rgba(11,15,25,0.7); text-align:left; color:var(--text-muted);">
            <th style="padding:6px;">% 1RM</th>
            <th style="padding:6px;">Peso Estimado</th>
            <th style="padding:6px;">Reps Aprox</th>
            <th style="padding:6px;">Estímulo</th>
          </tr>
        </thead>
        <tbody>
          ${percentages.map(p => `
            <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
              <td style="padding:6px; font-weight:700; color:var(--accent-cyan);">${p.pct}%</td>
              <td style="padding:6px; font-weight:700; color:var(--text-main);">${Math.round((avg1RM * p.pct) / 100)} kg</td>
              <td style="padding:6px; color:var(--text-muted);">${p.reps}</td>
              <td style="padding:6px; color:var(--accent-emerald); font-size:10px;">${p.goal}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }
}
