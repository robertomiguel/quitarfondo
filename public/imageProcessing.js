// Función para redimensionar la imagen
export async function resizeImage(src) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            
            // Calcular las nuevas dimensiones manteniendo el aspect ratio
            if (width > height) {
                if (width > 512) {
                    height = Math.round((height * 512) / width);
                    width = 512;
                }
            } else {
                if (height > 768) {
                    width = Math.round((width * 768) / height);
                    height = 768;
                }
            }

            canvas.width = width;
            canvas.height = height;
            
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            
            resolve(canvas.toDataURL('image/jpeg', 0.9));
        };
        img.src = src;
    });
}

// Función para recortar los bordes transparentes
export async function trimTransparentEdges(imageData) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            
            // Obtener los datos de la imagen
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            
            let minX = canvas.width;
            let minY = canvas.height;
            let maxX = 0;
            let maxY = 0;
            
            // Encontrar los límites del contenido no transparente
            for (let y = 0; y < canvas.height; y++) {
                for (let x = 0; x < canvas.width; x++) {
                    const alpha = data[((y * canvas.width) + x) * 4 + 3];
                    if (alpha > 10) { // Umbral para considerar un píxel como no transparente
                        minX = Math.min(minX, x);
                        minY = Math.min(minY, y);
                        maxX = Math.max(maxX, x);
                        maxY = Math.max(maxY, y);
                    }
                }
            }
            
            // Agregar un pequeño margen
            const margin = 2;
            minX = Math.max(0, minX - margin);
            minY = Math.max(0, minY - margin);
            maxX = Math.min(canvas.width, maxX + margin);
            maxY = Math.min(canvas.height, maxY + margin);
            
            // Si no hay contenido visible, devolver la imagen original
            if (minX >= maxX || minY >= maxY) {
                resolve(img.src);
                return;
            }
            
            // Crear un nuevo canvas con las dimensiones recortadas
            const trimmedWidth = maxX - minX;
            const trimmedHeight = maxY - minY;
            
            const trimmedCanvas = document.createElement('canvas');
            trimmedCanvas.width = trimmedWidth;
            trimmedCanvas.height = trimmedHeight;
            
            const trimmedCtx = trimmedCanvas.getContext('2d');
            trimmedCtx.drawImage(
                img,
                minX, minY, trimmedWidth, trimmedHeight,
                0, 0, trimmedWidth, trimmedHeight
            );
            
            resolve(trimmedCanvas.toDataURL('image/png'));
        };
        img.src = imageData;
    });
}