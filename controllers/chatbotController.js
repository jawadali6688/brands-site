import dotenv from 'dotenv';
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";


dotenv.config();


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];


export const chatbot = async (req, res) => {
  const { message } = req.body;
  const fashionStylistGuide = 
  "You are a fashion stylist assistant. Please respond with information and advice related to fashion trends, clothing styles, outfit combinations, wardrobe suggestions, and styling tips. " +
  "Only provide responses related to fashion and style.";
  
  try {
    const chatSession = model.startChat({
      generationConfig,
      safetySettings,
      history: [
        {
          role: "user",  // First message from user with a guide appended
          parts: [
            { text: `${fashionStylistGuide}\n\n${message}` },
          ],
        }
      ],
    });

    // Send the user message and get the chatbot response
    const result = await chatSession.sendMessage(message);
    const responseText = result.response.text();

    // Log and send back the filtered mental health response
    console.log(responseText);
    res.json({ reply: responseText });

  } catch (error) {
    console.error('Error communicating with Gemini API:', error);

    let errorMessage;
    if (error.response) {
      errorMessage = `Error: ${error.response.status} ${error.response.statusText}`;
    } else if (error.request) {
      errorMessage = 'No response received from Gemini';
    } else {
      errorMessage = `Request error: ${error.message}`;
    }

    res.status(500).send(errorMessage);
  }
};