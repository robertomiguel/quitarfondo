// Función para configurar los controles HSL
export function setupHslControls() {
    // Función para aplicar filtros HSL a la imagen
    function applyHslFilters() {
        const hueValue = document.getElementById('hue').value;
        const saturationValue = document.getElementById('saturation').value;
        const lightnessValue = document.getElementById('lightness').value;
        
        // Actualizar los valores mostrados
        document.getElementById('hueValue').textContent = hueValue;
        document.getElementById('saturationValue').textContent = saturationValue;
        document.getElementById('lightnessValue').textContent = lightnessValue;
        
        // Aplicar filtros CSS a la imagen
        const imgElement = document.getElementById('noBackgroundImage');
        imgElement.style.filter = `hue-rotate(${hueValue}deg) saturate(${saturationValue/100}) brightness(${lightnessValue/100})`;
    }
    
    // Evento para restablecer los filtros HSL
    document.getElementById('resetHsl').addEventListener('click', function() {
        document.getElementById('hue').value = 0;
        document.getElementById('saturation').value = 100;
        document.getElementById('lightness').value = 100;
        applyHslFilters();
    });
    
    // Añadir listeners a los sliders
    document.getElementById('hue').addEventListener('input', applyHslFilters);
    document.getElementById('saturation').addEventListener('input', applyHslFilters);
    document.getElementById('lightness').addEventListener('input', applyHslFilters);
}