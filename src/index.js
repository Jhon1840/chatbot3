require('dotenv').config();
const express = require("express");
const apiruta = require("./routes/ruta");
const { Carrera, Materia } = require('./db');

const app = express();

const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use("/api", apiruta);

async function consultarMateriasDerecho() {
    try {
        const derecho = await Carrera.findOne({
            where: { nombre: 'Derecho' }
        });

        if (!derecho) {
            console.log("No se encontró la carrera de Derecho");
            return;
        }

        const materiasDerecho = await Materia.findAll({
            where: { 
                CarreraId: derecho.id 
            },
            order: [['semestre', 'ASC'], ['nombre', 'ASC']]
        });

        const materiasPorSemestre = {};
        materiasDerecho.forEach(materia => {
            if (!materiasPorSemestre[materia.semestre]) {
                materiasPorSemestre[materia.semestre] = [];
            }
            materiasPorSemestre[materia.semestre].push({
                nombre: materia.nombre,
                creditos: materia.creditos
            });
        });

        console.log("Materias de la Carrera de Derecho:");
        Object.keys(materiasPorSemestre).forEach(semestre => {
            console.log(`\nSemestre ${semestre}:`);
            materiasPorSemestre[semestre].forEach(materia => {
                console.log(`- ${materia.nombre} (${materia.creditos} créditos)`);
            });
        });

    } catch (error) {
        console.error("Error al consultar las materias de Derecho:", error);
    }
}

// Si quieres agregarlo al index.js, puedes modificar la llamada:
app.listen(PORT, async () => {
    console.log("Hola AnderCode v1 el puerto es: " + PORT);
    
   
    await consultarMateriasDerecho(); // Añadida la consulta para Derecho
});