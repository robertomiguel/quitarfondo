// Configurar el sistema de pestañas para los controles
export function setupTabsController() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const panels = document.querySelectorAll('.control-panel');
    
    // Función para cambiar de pestaña
    function switchTab(tabId) {
        // Desactivar todas las pestañas
        tabButtons.forEach(button => {
            button.classList.remove('active');
        });
        
        // Ocultar todos los paneles
        panels.forEach(panel => {
            panel.classList.remove('active');
        });
        
        // Activar la pestaña seleccionada
        const selectedTab = document.querySelector(`[data-tab="${tabId}"]`);
        if (selectedTab) {
            selectedTab.classList.add('active');
        }
        
        // Mostrar el panel seleccionado
        const selectedPanel = document.getElementById(tabId);
        if (selectedPanel) {
            selectedPanel.classList.add('active');
        }
    }
    
    // Añadir listeners a los botones de pestañas
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
}