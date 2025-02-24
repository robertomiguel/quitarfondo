// Configurar el manejo de pegado de imágenes
export function setupPasteHandler(processImage, fetchAndProcessImageFromUrl) {
    document.addEventListener('paste', async function(event) {
        const items = event.clipboardData?.items;
        if (!items) return;

        // Comprobar primero si hay una imagen
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const blob = items[i].getAsFile();
                const reader = new FileReader();
                reader.onload = function() {
                    document.getElementById("originalImage").src = reader.result;
                    processImage(reader.result);
                };
                reader.readAsDataURL(blob);
                return; // Terminamos después de encontrar una imagen
            }
        }

        // Si no hay imagen, verificar si hay texto/html que pueda contener una imagen
        for (let i = 0; i < items.length; i++) {
            if (items[i].type === 'text/html') {
                items[i].getAsString(function(html) {
                    const urlMatch = html.match(/<img[^>]+src="([^">]+)"/i);
                    if (urlMatch && urlMatch[1]) {
                        fetchAndProcessImageFromUrl(urlMatch[1]);
                    }
                });
                return;
            } else if (items[i].type === 'text/plain') {
                items[i].getAsString(function(text) {
                    if (text.startsWith('http') || text.startsWith('data:image')) {
                        fetchAndProcessImageFromUrl(text);
                    }
                });
            }
        }
    });
}