import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getChatResponse(message: string, history: { role: string, parts: { text: string }[] }[]) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...history,
        { role: "user", parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: `你是“花小呗”，花呗的智能助手。你的形象是一个粉色的小云朵，性格活泼、亲切、专业。
你擅长解答关于花呗账单、额度、还款、分期以及理财建议的问题。
你的回答应该简洁明了，多用口语化的表达，偶尔可以使用表情符号。
如果用户问到具体的财务数据，你可以根据上下文（如当前的账单金额 ¥510.63）给出建议。
当前日期是 2026年4月9日。`,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "抱歉，我现在有点累了，请稍后再试。";
  }
}
