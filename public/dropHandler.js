// Configurar el manejo de arrastrar y soltar
export function setupDropZone(processImage, fetchAndProcessImageFromUrl) {
    const dropZone = document.querySelector('.container');
    
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-active');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-active');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-active');
        
        // Verificar si hay archivos
        if (e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function() {
                    document.getElementById("originalImage").src = reader.result;
                    processImage(reader.result);
                };
                reader.readAsDataURL(file);
                return;
            }
        }
        
        // Si no hay archivos, verificar si hay una URL de imagen
        const html = e.dataTransfer.getData('text/html');
        const urlMatch = html && html.match(/<img[^>]+src="([^">]+)"/i);
        
        if (urlMatch && urlMatch[1]) {
            // Tenemos una URL de imagen
            fetchAndProcessImageFromUrl(urlMatch[1]);
            return;
        }
        
        // Intentar con otros formatos de texto (URLs directas)
        const textData = e.dataTransfer.getData('text/plain');
        if (textData && (textData.startsWith('http') || textData.startsWith('data:image'))) {
            fetchAndProcessImageFromUrl(textData);
        }
    });
}