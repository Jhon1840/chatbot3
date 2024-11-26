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
        return "¡Hola! Soy el asistente de la universidad. ¿En qué puedo ayudarte?";
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

        // Limpieza del texto y obtención del contexto
        const textoLimpio = limpiarTexto(texto);
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
                Authorization: "Bearer EAAkbIXWO5YYBOx4TJZCkAppNCrOzBjVzBCIwYyxplrRcpAjuXhUlZCDUaJ5zTeZBKjOGWRAuDgPGj0vVKIBsF0yZBZCiaY7eAR1teqnswM9PkRJT0lCP5VS8x113HT0nFEkKZAtHfA83UqVm6LdXuuFmkwfDaU14KeAIBsZAfwTJN1SbfRChbNmbZCZBUZACCF1QeirVOEyhlzCwIslZBZCV7kX4X7AXGzy14nHN2rYZD"
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
