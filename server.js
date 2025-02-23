const express = require("express");
const cors = require("cors");

const app = express();
const port = 8000;

app.use(cors());
app.use(express.static("public"));

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
