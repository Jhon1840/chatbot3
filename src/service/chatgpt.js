const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function getChatGPTResponse(prompt) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 50 
    });
    
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error al obtener respuesta de ChatGPT:', error);
    throw error;
  }
}

module.exports = { getChatGPTResponse };