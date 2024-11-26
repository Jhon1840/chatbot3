const https = require("https");
const { getChatGPTResponse } = require('./chatgpt');

// Función para limpiar el texto del usuario
function limpiarTexto(texto) {
    const stopWords = ["de", "la", "y", "a", "el", "en", "por", "con", "que", "un", "una", "los", "las", "para", "del"];
    return texto
        .toLowerCase()
        .split(" ")
        .filter(word => !stopWords.includes(word))
        .join(" ");
}

// Función para determinar si el texto está relacionado con la Universidad del Valle
function esRelacionadoConUnivalle(texto) {
    const palabrasClave = ["valle", "univalle", "universidad", "carreras", "inscripción", "admisión", "horarios"];
    return palabrasClave.some(palabra => texto.includes(palabra));
}

// Función para determinar el contexto de la pregunta
function obtenerContexto(texto) {
    if (/asesor(es)?/i.test(texto)) {
        return "Consulta sobre asesores universitarios. Responde con información de contacto.";
    }
    if (/precio|costo|tarifa/i.test(texto)) {
        return "Consulta sobre precios o tarifas. Responde que se contacte con asesores.";
    }
    if (/hola|buenos días|qué tal/i.test(texto)) {
        return "Saludo inicial.";
    }
    if (/universidad/i.test(texto)) {
        return "Consulta general sobre la universidad.";
    }
    return "Consulta desconocida.";
}

// Función para manejar las respuestas predefinidas
function manejarRespuestaPredefinida(texto) {
    if (/hola|buenos días|qué tal/i.test(texto)) {
        return "¡Hola! Soy el asistente de la Universidad del Valle. ¿En qué puedo ayudarte?";
    }
    if (/asesor(es)?/i.test(texto)) {
        return "Nuestros asesores son: Juan Pérez (+591 12345678) y Ana López (+591 87654321). Contáctalos para más información.";
    }
    if (/precio|costo|tarifa/i.test(texto)) {
        return "Para conocer precios o tarifas, por favor contacta a nuestros asesores: Juan Pérez (+591 12345678).";
    }
    return null;
}

// Función principal para enviar el mensaje
async function EnviarMensajeWhastpapp(texto, number) {
    try {
        if (!texto || !number) {
            throw new Error("Texto o número de destinatario inválido");
        }

        console.log("Texto recibido:", texto);
        console.log("Número recibido:", number);

        // Limpieza del texto
        const textoLimpio = limpiarTexto(texto);

        // Verificar si la consulta está relacionada con la Universidad del Valle
        if (!esRelacionadoConUnivalle(textoLimpio)) {
            console.log("Consulta no relacionada con la Universidad del Valle. No se enviará respuesta.");
            return; // Salir si no está relacionada
        }

        // Obtención del contexto
        const contexto = obtenerContexto(texto);
        let responseBody;

        // Verificar si hay una respuesta predefinida
        const respuestaPredefinida = manejarRespuestaPredefinida(textoLimpio);
        if (respuestaPredefinida) {
            responseBody = respuestaPredefinida;
        } else {
            // Si no hay respuesta predefinida, llamar a la API de ChatGPT
            try {
                responseBody = await getChatGPTResponse(`${textoLimpio} \n Contexto: ${contexto}`);
                if (!responseBody) {
                    throw new Error("Respuesta de ChatGPT vacía");
                }
            } catch (chatGPTError) {
                console.error("Error de ChatGPT:", chatGPTError);
                responseBody = "Lo siento, hubo un error al procesar tu solicitud. Por favor, inténtalo de nuevo más tarde.";
            }
        }

        // Datos para el envío del mensaje a WhatsApp
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

        // Enviar el mensaje
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
