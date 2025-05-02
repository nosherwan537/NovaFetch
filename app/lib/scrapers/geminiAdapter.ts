import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const analyzeReviewsWithGemini = async ({
  product,
  reddit,
}: {
  product: string;
  reddit: { title: string; text: string }[];
}) => {
    const prompt = `
    You are a tech reviewer AI.
    
    A user searched for: "${product}"
    
    Here are some Reddit posts:
    ${reddit.map((r, i) => `Post ${i + 1}:\nTitle: ${r.title}\nText: ${r.text}`).join('\n\n')}
    
    Your task:
    Return a response in **valid JSON** format ONLY (no explanation, no markdown). Include the following keys:
    
    - "sentiment": overall sentiment (Positive, Negative, Neutral, or Mixed)
    - "opinion": a short summary of main features and opinions about the product (based only on the provided posts)
    - "specs": key technical features or improvements of the product (based only on the provided posts)
    
    Return only raw JSON without any extra text, markdown, or commentary.
    `;
    

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  console.log(result.response.text());


  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const json = JSON.parse(jsonMatch[0]);
      return json;
    } else {
      throw new Error("No JSON found");
    }
  } catch (e) {
    console.warn('Gemini did not return clean JSON, returning raw text.');
    return { sentiment: 'unknown', opinion: text, specs: 'N/A' };
  }
  
};
