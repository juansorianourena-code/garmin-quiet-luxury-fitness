// FitExpert Studio - Evidence-Based Supplementation Engine (ISSN Guidelines)

export function initSupplementation() {
  renderSupplementationGuide();

  window.addEventListener('profileUpdated', () => {
    renderSupplementationGuide();
  });
}

export function renderSupplementationGuide() {
  const container = document.getElementById('supplementationContainer');
  if (!container) return;

  const savedProfileStr = localStorage.getItem('fitexpert_profile');
  let weight = 75;
  if (savedProfileStr) {
    try {
      const p = JSON.parse(savedProfileStr);
      if (p.weight) weight = parseFloat(p.weight);
    } catch (e) {}
  }

  // Dosing based on ISSN Position Stand:
  // Creatine: 0.07g/kg daily (or ~3-5g)
  const creatineDose = (weight * 0.07).toFixed(1);
  // Caffeine: 3-6mg/kg pre-workout
  const caffeineMin = Math.round(weight * 3);
  const caffeineMax = Math.round(weight * 5);
  // Beta-Alanine: 3.2g - 6.4g daily split
  const betaAlanine = 3.2;
  // Protein Supplementation: Target 0.4g/kg post workout
  const postWorkoutWhey = Math.round(weight * 0.35);

  container.innerHTML = `
    <div class="grid grid-2-sm">
      <div class="card glass-card" style="border-left:4px solid var(--accent-cyan);">
        <h4 style="color:var(--accent-cyan); font-weight:700;"><i class="fa-solid fa-jar"></i> Creatina Monohidrato 100% Creapure</h4>
        <div style="font-size:18px; font-weight:800; color:var(--text-main); margin:4px 0;">${creatineDose} g / día</div>
        <p style="font-size:11px; color:var(--text-muted);">
          <strong>Timing:</strong> Tomar a la misma hora todos los días (pre o post entreno con carbohidratos). Aumenta las reservas de fosfocreatina muscular y la hidratación celular.
        </p>
      </div>

      <div class="card glass-card" style="border-left:4px solid var(--accent-amber);">
        <h4 style="color:var(--accent-amber); font-weight:700;"><i class="fa-solid fa-mug-hot"></i> Cafeína Anhidra (Pre-Entreno)</h4>
        <div style="font-size:18px; font-weight:800; color:var(--text-main); margin:4px 0;">${caffeineMin} mg - ${caffeineMax} mg</div>
        <p style="font-size:11px; color:var(--text-muted);">
          <strong>Timing:</strong> 45-60 min antes de entrenar. Reduce la percepción del esfuerzo (RPE) y mejora el reclutamiento muscular de unidades motoras rápidas.
        </p>
      </div>

      <div class="card glass-card" style="border-left:4px solid var(--accent-emerald);">
        <h4 style="color:var(--accent-emerald); font-weight:700;"><i class="fa-solid fa-bolt"></i> Beta-Alanina (Tampón de Lactato)</h4>
        <div style="font-size:18px; font-weight:800; color:var(--text-main); margin:4px 0;">${betaAlanine} g / día</div>
        <p style="font-size:11px; color:var(--text-muted);">
          <strong>Timing:</strong> Dividir en 2 tomas de 1.6g con las comidas. Aumenta la carnosina muscular para amortiguar la acidosis en series de 8 a 15 repeticiones.
        </p>
      </div>

      <div class="card glass-card" style="border-left:4px solid var(--accent-purple);">
        <h4 style="color:var(--accent-purple); font-weight:700;"><i class="fa-solid fa-bottle-droplet"></i> Proteína Aislada (Whey/Vegana)</h4>
        <div style="font-size:18px; font-weight:800; color:var(--text-main); margin:4px 0;">${postWorkoutWhey} g / batido</div>
        <p style="font-size:11px; color:var(--text-muted);">
          <strong>Timing:</strong> En la ventana de 1-2 horas post-entrenamiento para maximizar la síntesis proteica (vía mTOR) con alta concentración de Leucina.
        </p>
      </div>
    </div>
  `;
}
