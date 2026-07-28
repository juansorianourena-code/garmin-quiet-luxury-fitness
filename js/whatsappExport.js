// FitExpert Studio - Direct WhatsApp Exporter

export function initWhatsAppExport() {
  const btnShareGrocery = document.getElementById('btnShareGroceryWhatsApp');
  if (btnShareGrocery) {
    btnShareGrocery.addEventListener('click', shareGroceryListWhatsApp);
  }
}

export function shareGroceryListWhatsApp() {
  const listContainer = document.getElementById('groceryItemsList');
  if (!listContainer) return;

  const items = Array.from(listContainer.querySelectorAll('span')).map(s => `• ${s.textContent.trim()}`);
  
  if (items.length === 0) {
    alert('Aún no has generado ninguna lista de la compra.');
    return;
  }

  const message = `🛒 *FitExpert Studio - Lista de la Compra Semanal*\n\n${items.join('\n')}\n\n_Generado automáticamente con evidencia científica y macronutrientes._`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
}
