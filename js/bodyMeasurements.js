// FitExpert Studio - Body Circumferences & Measurements Logger

export function initBodyMeasurements() {
  const form = document.getElementById('bodyMeasurementsForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      logBodyMeasurements();
    });
  }

  renderMeasurementsHistory();
}

function logBodyMeasurements() {
  const arm = parseFloat(document.getElementById('measureArm').value) || 0;
  const waist = parseFloat(document.getElementById('measureWaist').value) || 0;
  const chest = parseFloat(document.getElementById('measureChest').value) || 0;
  const thigh = parseFloat(document.getElementById('measureThigh').value) || 0;

  const entry = {
    date: new Date().toLocaleDateString('es-ES'),
    arm, waist, chest, thigh
  };

  const savedLogsStr = localStorage.getItem('fitexpert_body_measurements');
  const logs = savedLogsStr ? JSON.parse(savedLogsStr) : [];
  logs.unshift(entry);

  localStorage.setItem('fitexpert_body_measurements', JSON.stringify(logs));
  renderMeasurementsHistory();
}

export function renderMeasurementsHistory() {
  const container = document.getElementById('measurementsHistoryContainer');
  if (!container) return;

  const savedLogsStr = localStorage.getItem('fitexpert_body_measurements');
  const logs = savedLogsStr ? JSON.parse(savedLogsStr) : [];

  if (logs.length === 0) {
    container.innerHTML = `<p style="font-size:12px; color:var(--text-muted); text-align:center; padding:10px;">Aún no has registrado medidas corporales.</p>`;
    return;
  }

  container.innerHTML = `
    <div style="display:flex; flex-direction:column; gap:6px; margin-top:8px;">
      ${logs.slice(0, 5).map(log => `
        <div style="background:rgba(11,15,25,0.6); padding:8px 10px; border-radius:var(--radius-md); border:1px solid var(--border-color); font-size:11px; display:flex; justify-content:space-between; align-items:center;">
          <span style="font-weight:700; color:var(--accent-cyan);"><i class="fa-solid fa-calendar-day"></i> ${log.date}</span>
          <div style="display:flex; gap:8px; color:var(--text-main);">
            <span>💪 ${log.arm} cm</span>
            <span>📏 ${log.waist} cm</span>
            <span>👕 ${log.chest} cm</span>
            <span>🦵 ${log.thigh} cm</span>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}
