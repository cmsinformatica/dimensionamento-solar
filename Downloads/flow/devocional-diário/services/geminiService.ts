
import { GoogleGenAI, Type } from "@google/genai";
import { Devotional } from '../types';

// Vite usa import.meta.env e exige prefixo VITE_ para expor no client
const API_KEY = import.meta.env.VITE_API_KEY as string | undefined;
if (!API_KEY) {
  throw new Error("VITE_API_KEY não configurada. Defina a variável de ambiente VITE_API_KEY.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const devotionalSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: 'Um título inspirador para o devocional. Deve ser curto e impactante.' },
    verse: { type: Type.STRING, description: 'Um versículo bíblico relevante com sua referência (ex: "João 3:16").' },
    reflection: { type: Type.STRING, description: 'Uma reflexão de 2-3 parágrafos sobre o versículo e o tema, em um tom encorajador e prático.' },
    prayer: { type: Type.STRING, description: 'Uma oração curta de 2-3 frases relacionada ao devocional.' },
    theme: { type: Type.STRING, description: 'Uma única palavra em português que resume o tema do devocional (ex: "Fé", "Esperança", "Amor").' },
    tailwindColor: { type: Type.STRING, description: 'Uma cor de fundo suave do Tailwind CSS que combine com o tema. Forneça a classe para modo claro e escuro (ex: "bg-sky-100 dark:bg-sky-900").' }
  },
  required: ['title', 'verse', 'reflection', 'prayer', 'theme', 'tailwindColor']
};


export const getDevotionalForDate = async (date: Date): Promise<Devotional> => {
  const dateString = date.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const prompt = `
    Aja como um teólogo e escritor de devocionais cristãos. 
    Crie um devocional inspirador e único para a data: ${dateString}. 
    O devocional deve ser original e não uma cópia de algo existente.
    O tema deve ser profundo, mas acessível. Baseie-se em um dos seguintes temas, se possível, mas sinta-se livre para escolher outro que seja apropriado: fé, esperança, amor, perdão, gratidão, propósito, coragem, paz.
    Retorne a resposta estritamente no formato JSON definido pelo schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: devotionalSchema,
        temperature: 0.8,
      },
    });

    const jsonText = response.text.trim();
    const parsedDevotional = JSON.parse(jsonText) as Devotional;
    
    // Basic validation
    if (!parsedDevotional.title || !parsedDevotional.verse || !parsedDevotional.reflection || !parsedDevotional.prayer || !parsedDevotional.tailwindColor) {
        throw new Error("Resposta da API está incompleta ou malformada.");
    }
    
    return parsedDevotional;

  } catch (error) {
    console.error("Erro ao gerar devocional com Gemini API:", error);
    throw new Error("Falha ao comunicar com a API de geração de conteúdo.");
  }
};
