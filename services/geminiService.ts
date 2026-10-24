
import { GoogleGenAI } from "@google/genai";

/**
 * Service to get assistant response using Gemini API with Google Search Grounding.
 */
export const getAssistantResponse = async (userQuery: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userQuery,
      config: {
        systemInstruction: `તમે MyshopMyhome.shop માટે પ્રોફેશનલ મોબાઈલ એક્સેસરી એક્સપર્ટ અને કસ્ટમર સપોર્ટ એજન્ટ છો.
        
        તમારા મુખ્ય કાર્યો:
        1. વપરાશકર્તાઓને ચાર્જર, કેબલ, બેટરી અને ગ્લાસ વિશે સલાહ આપો.
        2. હાલમાં ચાલતા પ્રોમો કોડ 'WELCOME10' (૧૦% ડિસ્કાઉન્ટ) અને 'MOBI20' (૨૦% ડિસ્કાઉન્ટ) વિશે જણાવો.
        3. જો વપરાશકર્તા ઓર્ડર ટ્રેકિંગ વિશે પૂછે, તો તેમને મેનુમાં 'ટ્રેકિંગ' બટન દબાવવાનું કહો.
        4. નવી ટેકનોલોજી માટે Google Search નો ઉપયોગ કરો.
        
        જવાબ હંમેશા ગુજરાતીમાં અને ખૂબ જ નમ્રતાથી આપો. 
        MyshopMyhome.shop એક વિશ્વાસુ અને પ્રખ્યાત મોબાઈલ એક્સેસરી અને હોમ શોપ છે તેવું જણાવો.`,
        tools: [{ googleSearch: {} }]
      },
    });

    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    let text = response.text || "ક્ષમા કરશો, હું અત્યારે તમારી મદદ કરી શકું તેમ નથી.";
    
    if (groundingMetadata?.groundingChunks) {
      const links = groundingMetadata.groundingChunks
        .map((chunk: any) => chunk.web?.uri)
        .filter(Boolean);
      if (links.length > 0) {
        text += "\n\nવધુ વિગત માટે સ્ત્રોત: " + links.slice(0, 2).join(", ");
      }
    }

    return text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "ક્ષમા કરશો, અત્યારે સર્વર વ્યસ્ત છે. કૃપા કરીને થોડીવાર પછી પ્રયાસ કરો.";
  }
};
