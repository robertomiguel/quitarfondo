// Función para configurar los controles de tonos (altas luces, sombras, blancos, negros)
export function setupTonesControls() {
    // Función para aplicar ajustes de tonos a la imagen
    function applyTonesAdjustments() {
        const highlightsValue = parseInt(document.getElementById('highlights').value);
        const shadowsValue = parseInt(document.getElementById('shadows').value);
        const whitesValue = parseInt(document.getElementById('whites').value);
        const blacksValue = parseInt(document.getElementById('blacks').value);
        
        // Actualizar los valores mostrados
        document.getElementById('highlightsValue').textContent = highlightsValue;
        document.getElementById('shadowsValue').textContent = shadowsValue;
        document.getElementById('whitesValue').textContent = whitesValue;
        document.getElementById('blacksValue').textContent = blacksValue;
        
        // Aplicar efectos al elemento de imagen
        // Esto combina filtros CSS para simular ajustes de tonos
        const imgElement = document.getElementById('noBackgroundImage');
        
        // Aplicar filtros CSS basados en los valores
        // Para altas luces usamos brightness + contrast
        let filterString = '';
        
        // Ajustar altas luces (afecta principalmente a tonos claros)
        if (highlightsValue !== 0) {
            const highlightBrightness = 1 + (highlightsValue / 200);
            const highlightContrast = 1 + (Math.abs(highlightsValue) / 200);
            filterString += `brightness(${highlightBrightness}) contrast(${highlightContrast}) `;
        }
        
        // Ajustar sombras (afecta principalmente a tonos medios-oscuros)
        if (shadowsValue !== 0) {
            const shadowOpacity = 1 + (shadowsValue / 200);
            filterString += `opacity(${shadowOpacity}) `;
        }
        
        // Ajustar blancos (afecta los tonos más claros)
        if (whitesValue !== 0) {
            // Convertimos el valor a un rango útil para el filtro
            const whiteLevel = whitesValue > 0 
                ? 1 + (whitesValue / 100) 
                : 1 + (whitesValue / 200);
            filterString += `sepia(0.1) brightness(${whiteLevel}) sepia(0) `;
        }
        
        // Ajustar negros (afecta los tonos más oscuros)
        if (blacksValue !== 0) {
            const blackLevel = 1 + (blacksValue / 200);
            filterString += `brightness(${blackLevel}) `;
        }
        
        // Guardar los filtros actuales de HSL para combinarlos
        const hslFilters = imgElement.getAttribute('data-hsl-filters') || '';
        
        // Almacenar los filtros de tonos para uso posterior
        imgElement.setAttribute('data-tone-filters', filterString);
        
        // Aplicar combinación de filtros
        imgElement.style.filter = hslFilters + ' ' + filterString;
    }
    
    // Evento para restablecer los ajustes de tonos
    document.getElementById('resetTones').addEventListener('click', function() {
        document.getElementById('highlights').value = 0;
        document.getElementById('shadows').value = 0;
        document.getElementById('whites').value = 0;
        document.getElementById('blacks').value = 0;
        applyTonesAdjustments();
    });
    
    // Añadir listeners a los sliders
    document.getElementById('highlights').addEventListener('input', applyTonesAdjustments);
    document.getElementById('shadows').addEventListener('input', applyTonesAdjustments);
    document.getElementById('whites').addEventListener('input', applyTonesAdjustments);
    document.getElementById('blacks').addEventListener('input', applyTonesAdjustments);
}