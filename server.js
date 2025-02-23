const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3003;

const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.static("public"));

app.post("/upload", upload.single("image"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No se subió ninguna imagen" });
    }

    console.log("✅ Imagen recibida:", req.file.originalname);

    const filePath = path.join(__dirname, req.file.path);
    res.json({ url: `http://localhost:${port}/${req.file.path}` });

    // Opción: eliminar el archivo después de un tiempo
    setTimeout(() => fs.unlinkSync(filePath), 60000);
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
