import { removeBackground, preload } from "https://cdn.jsdelivr.net/npm/@imgly/background-removal@latest/+esm";
import { resizeImage } from './imageProcessing.js';
import { trimTransparentEdges } from './imageProcessing.js';
import { setupHslControls } from './hslControls.js';
import { setupDropZone } from './dropHandler.js';
import { setupPasteHandler } from './pasteHandler.js';
import { fetchAndProcessImageFromUrl } from './urlHandler.js';

// Variables globales que compartimos a través de módulos
let hasGPUSupport = false;

window.addEventListener("DOMContentLoaded", async function () {
    try {
        await preload({ 
            debug: true,
            device: "gpu",
            preferWebGPU: true
        });

        hasGPUSupport = await checkGPUSupport();
        
        // Inicializar los controles HSL
        setupHslControls();
        
        // Configurar el manejo de arrastrar y soltar
        setupDropZone(processImage, fetchAndProcessImageFromUrl);
        
        // Configurar el manejo de pegado
        setupPasteHandler(processImage, fetchAndProcessImageFromUrl);
        
        // Manejar input de archivo
        document.getElementById("imageInput").addEventListener("change", async function (event) {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function() {
                document.getElementById("originalImage").src = reader.result;
                processImage(reader.result);
            };
            reader.readAsDataURL(file);
        });

    } catch (error) {
        console.error("Error en la inicialización:", error);
        document.getElementById("error").textContent = 
            "Error al inicializar la aplicación: " + error.message;
    }
});

// Verificar soporte de GPU
async function checkGPUSupport() {
    if ('gpu' in navigator) {
        try {
            const adapter = await navigator.gpu.requestAdapter();
            if (adapter) {
                console.log("WebGPU está disponible!");
                return true;
            }
        } catch (e) {
            console.log("Error al verificar WebGPU:", e);
        }
    }
    console.log("WebGPU no está disponible");
    return false;
}

// Función para procesar la imagen
export async function processImage(imageData) {
    document.querySelector(".loader").style.display = "block";
    try {
        // Redimensionar la imagen antes de procesar
        const resizedImage = await resizeImage(imageData);
        const config = {
            device: hasGPUSupport ? "gpu" : "cpu",
            model: "isnet",
            debug: true,
            preferWebGPU: true,
            output: {
                format: "image/png",
                type: "foreground"
            }
        };
        
        const blob = await removeBackground(resizedImage, config);
        
        // Convertir blob a data URL para poder recortar los bordes transparentes
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        
        reader.onloadend = async () => {
            // Recortar los bordes transparentes
            const trimmedImage = await trimTransparentEdges(reader.result);
            
            // Mostrar la imagen recortada
            document.getElementById("noBackgroundImage").src = trimmedImage;
            console.log("Imagen procesada y recortada correctamente.");
            document.querySelector(".loader").style.display = "none";
        };
    } catch (error) {
        document.getElementById("error").textContent = 
            `Error al procesar la imagen: ${error.message}`;
        console.error("Error en procesamiento:", error);
        document.querySelector(".loader").style.display = "none";
    }
}