require('dotenv').config();
const express = require("express");
const apiruta = require("./routes/ruta");
const { Carrera, Materia } = require('./db');

const app = express();

const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use("/api", apiruta);

// Función para listar todas las carreras con sus materias
async function listarTodasLasCarreras() {
    try {
        const carreras = await Carrera.find().populate('materias').sort({ nombre: 1 });

        if (carreras.length === 0) {
            console.log("No se encontraron carreras.");
            return;
        }

        console.log("Listado de carreras con sus materias:");
        carreras.forEach((carrera) => {
            console.log(`\nCarrera: ${carrera.nombre} (${carrera.descripcion || 'Sin descripción'})`);
            
            if (carrera.materias.length === 0) {
                console.log("  No se encontraron materias para esta carrera.");
            } else {
                carrera.materias.forEach((materia) => {
                    console.log(`  - ${materia.nombre} (${materia.creditos} créditos, Semestre ${materia.semestre})`);
                });
            }
        });
    } catch (error) {
        console.error("Error al listar todas las carreras:", error);
    }
}

// Inicia el servidor
app.listen(PORT, async () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
    
    await listarTodasLasCarreras(); // Llama a la función para listar carreras y materias
});
