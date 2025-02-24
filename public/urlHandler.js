import { processImage } from './main.js';

// Función para obtener y procesar imágenes desde URLs
export async function fetchAndProcessImageFromUrl(url) {
    document.querySelector(".loader").style.display = "block";
    try {
        // Para URLs de imágenes que pueden tener restricciones CORS
        // Usamos un proxy o manejamos directamente si es posible
        const img = new Image();
        img.crossOrigin = "Anonymous"; // Intentar solicitud CORS
        
        img.onload = function() {
            // Crear canvas para convertir la imagen a data URL
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            
            try {
                // Convertir a data URL
                const dataUrl = canvas.toDataURL('image/png');
                // Mostrar la imagen original
                document.getElementById("originalImage").src = dataUrl;
                // Procesar la imagen
                processImage(dataUrl);
            } catch (e) {
                // Si hay un error CORS, mostrar mensaje amigable
                console.error("Error CORS:", e);
                document.getElementById("error").textContent = 
                    "No se pudo cargar la imagen debido a restricciones del sitio web de origen. Prueba a guardar la imagen primero.";
                document.querySelector(".loader").style.display = "none";
            }
        };
        
        img.onerror = function() {
            console.error("Error cargando la imagen desde URL");
            document.getElementById("error").textContent = 
                "No se pudo cargar la imagen. La URL puede no ser válida o tener restricciones.";
            document.querySelector(".loader").style.display = "none";
        };
        
        // Si es una URL de data, usarla directamente
        if (url.startsWith('data:')) {
            document.getElementById("originalImage").src = url;
            processImage(url);
        } else {
            // De lo contrario, cargar la imagen
            img.src = url;
        }
    } catch (error) {
        console.error("Error en fetchAndProcessImageFromUrl:", error);
        document.getElementById("error").textContent = 
            `Error al obtener la imagen: ${error.message}`;
        document.querySelector(".loader").style.display = "none";
    }
}