const { Carrera, Materia } = require('../db.js'); // Asumiendo que los modelos están en '../models'
const https = require("https");
const { getChatGPTResponse } = require('./chatgpt');

// Funciones auxiliares: limpiarTexto, obtenerContexto, manejarRespuestaPredefinida se mantienen igual...

async function buscarInformacionCarrera(nombreCarrera) {
    try {
        const carrera = await Carrera.findOne({ 
            nombre: new RegExp(`^${nombreCarrera}$`, 'i') // Uso de RegExp para ignorar mayúsculas/minúsculas
        }).populate('mallaCurricular'); // Popula las materias relacionadas (malla curricular)

        if (!carrera) return null;

        const materiasPorSemestre = {};
        carrera.mallaCurricular.forEach(materia => {
            if (!materiasPorSemestre[materia.semestre]) {
                materiasPorSemestre[materia.semestre] = [];
            }
            materiasPorSemestre[materia.semestre].push({
                nombre: materia.nombre,
                creditos: materia.creditos
            });
        });

        let descripcionCarrera = `
Carrera: ${carrera.nombre}

Descripción: ${carrera.descripcion}

Malla Curricular:
${Object.entries(materiasPorSemestre).map(([semestre, materias]) => 
    `Semestre ${semestre}:
${materias.map(m => `- ${m.nombre} (${m.creditos} créditos)`).join('\n')}`
).join('\n\n')}
        `;

        return descripcionCarrera;
    } catch (error) {
        console.error("Error buscando información de carrera:", error);
        return null;
    }
}

async function consultarMateriasPorCarrera(nombreCarrera) {
    try {
        const carrera = await Carrera.findOne({ 
            nombre: new RegExp(`^${nombreCarrera}$`, 'i') 
        });

        if (!carrera) {
            console.log(`No se encontró la carrera de ${nombreCarrera}`);
            return null;
        }

        // Buscar todas las materias de esta carrera
        const materias = await Materia.find({
            carrera: carrera._id // Suponiendo que el campo de referencia es 'carrera'
        }).sort({ semestre: 1, nombre: 1 });

        // Organizar materias por semestre
        const materiasPorSemestre = {};
        materias.forEach(materia => {
            if (!materiasPorSemestre[materia.semestre]) {
                materiasPorSemestre[materia.semestre] = [];
            }
            materiasPorSemestre[materia.semestre].push({
                nombre: materia.nombre,
                creditos: materia.creditos
            });
        });

        let descripcionMaterias = `Materias de la Carrera de ${nombreCarrera}:\n`;
        
        Object.keys(materiasPorSemestre).forEach(semestre => {
            descripcionMaterias += `\nSemestre ${semestre}:\n`;
            materiasPorSemestre[semestre].forEach(materia => {
                descripcionMaterias += `- ${materia.nombre} (${materia.creditos} créditos)\n`;
            });
        });

        return descripcionMaterias;
    } catch (error) {
        console.error(`Error al consultar las materias de ${nombreCarrera}:`, error);
        return null;
    }
}

async function EnviarMensajeWhastpapp(texto, number) {
    try {
        if (!texto || !number) {
            throw new Error("Texto o número de destinatario inválido");
        }

        console.log("Texto recibido:", texto);
        console.log("Número recibido:", number);

        const textoLimpio = limpiarTexto(texto);
        const contexto = obtenerContexto(texto);
        let responseBody;

        const carreras = ['Psicología', 'Derecho', 'Medicina', 'Ingeniería de Sistemas'];
        
        const carreraDetectada = carreras.find(carrera => 
            new RegExp(carrera, 'i').test(texto)
        );

        const consultasMaterias = {
            'materias de psicología': 'Psicología',
            'malla curricular de psicología': 'Psicología',
            'materias de derecho': 'Derecho',
            'malla curricular de derecho': 'Derecho',
            'materias de medicina': 'Medicina', 
            'malla curricular de medicina': 'Medicina',
            'materias de ingeniería de sistemas': 'Ingeniería de Sistemas',
            'malla curricular de ingeniería de sistemas': 'Ingeniería de Sistemas'
        };

        const consultaMateria = Object.keys(consultasMaterias).find(consulta => 
            new RegExp(consulta, 'i').test(texto.toLowerCase())
        );

        const respuestaPredefinida = manejarRespuestaPredefinida(textoLimpio);
        if (respuestaPredefinida) {
            responseBody = respuestaPredefinida;
        } else {
            try {
                if (consultaMateria) {
                    const carrera = consultasMaterias[consultaMateria];
                    const infoMaterias = await consultarMateriasPorCarrera(carrera);
                    
                    responseBody = infoMaterias || "Lo siento, no pude encontrar la información de materias para esta carrera.";
                } else if (carreraDetectada) {
                    const infoCarrera = await buscarInformacionCarrera(carreraDetectada);
                    
                    responseBody = await getChatGPTResponse(
                        `Texto del usuario: ${texto}\n\nInformación de la carrera:\n${infoCarrera}\n\nContexto: ${contexto}. Genera una respuesta útil y amigable basada en la consulta del usuario.`
                    );
                } else {
                    // Consulta normal sin carrera detectada
                    responseBody = await getChatGPTResponse(`${textoLimpio} \n Contexto: ${contexto}`);
                }

                if (!responseBody) {
                    throw new Error("Respuesta de ChatGPT vacía");
                }
            } catch (chatGPTError) {
                console.error("Error de ChatGPT:", chatGPTError);
                responseBody = "Lo siento, hubo un error al procesar tu solicitud. Por favor, inténtalo de nuevo más tarde.";
            }
        }

        const data = JSON.stringify({
            "messaging_product": "whatsapp",
            "recipient_type": "individual",
            "to": number,
            "type": "text",
            "text": {
                "preview_url": false,
                "body": responseBody
            }
        });

        const options = {
            host: "graph.facebook.com",
            path: "/v21.0/462549556950259/messages",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer EAAkbIXWO5YYBO5ZA21Fp4sdJyCiIY7M9os64wDFJy41RmkZBbv1ghYg5dmCDsd7MIjb8bF6m5BU7SFWJD2yXBXjRoGIxVPUgfcpJfmMZA4bMPBKODtG7gEOnjYwS55NdACyzeYwGI1XIqvwBUe7kJmDapHUaPg3rvoqTPQxINXgQ74zUJuVdEmv5VAuPzq17AZDZD"
            }
        };

        await new Promise((resolve, reject) => {
            const req = https.request(options, res => {
                let responseData = '';
                res.on("data", chunk => {
                    responseData += chunk;
                });
                res.on("end", () => {
                    console.log("Respuesta de WhatsApp:", responseData);
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        resolve();
                    } else {
                        reject(new Error(`Error de WhatsApp: ${res.statusCode} - ${responseData}`));
                    }
                });
            });
            req.on("error", error => {
                console.error("Error de red al enviar a WhatsApp:", error);
                reject(error);
            });
            req.write(data);
            req.end();
        });

        console.log("Mensaje enviado exitosamente");
    } catch (globalError) {
        console.error("Error global en EnviarMensajeWhastpapp:", globalError);
    }
}

module.exports = {
    EnviarMensajeWhastpapp
};
