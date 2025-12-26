import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
export function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set in environment variables');
  }

  return new GoogleGenerativeAI(apiKey);
}

// Get the Gemini model
export function getGeminiModel(modelName: string = 'gemini-pro') {
  const client = getGeminiClient();
  return client.getGenerativeModel({ model: modelName });
}

// Generate text using Gemini
export async function generateText(prompt: string, modelName: string = 'gemini-pro'): Promise<string> {
  try {
    const model = getGeminiModel(modelName);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating text with Gemini:', error);
    throw error;
  }
}

// Chat with Gemini (for conversational interactions)
export async function chatWithGemini(
  messages: Array<{ role: 'user' | 'model'; parts: string }>,
  modelName: string = 'gemini-pro'
): Promise<string> {
  try {
    const model = getGeminiModel(modelName);
    const chat = model.startChat({
      history: messages.slice(0, -1).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.parts }],
      })),
    });

    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessage(lastMessage.parts);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error chatting with Gemini:', error);
    throw error;
  }
}

