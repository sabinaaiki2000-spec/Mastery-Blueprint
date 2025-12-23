
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { WorkbookData } from "../types";

const workbookSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    WorkbookTitle: { type: Type.STRING },
    Introduction: { type: Type.STRING },
    HowToUse: { type: Type.STRING },
    GoalSettingSection: {
      type: Type.OBJECT,
      properties: {
        big_goals: { type: Type.STRING },
        milestones: { type: Type.STRING },
        thirty_day_objectives: { type: Type.STRING },
      },
      required: ["big_goals", "milestones", "thirty_day_objectives"],
    },
    MonthlyPlanner: {
      type: Type.OBJECT,
      properties: {
        overview_page: { type: Type.STRING },
        habit_list_templates: { type: Type.STRING },
      },
      required: ["overview_page", "habit_list_templates"],
    },
    WeeklyPlanner: {
      type: Type.OBJECT,
      properties: {
        week_template: { type: Type.STRING },
        habit_tracker: { type: Type.STRING },
        weekly_reflection: { type: Type.STRING },
      },
      required: ["week_template", "habit_tracker", "weekly_reflection"],
    },
    DailyPages: {
      type: Type.OBJECT,
      properties: {
        morning_prompt: { type: Type.STRING },
        evening_prompt: { type: Type.STRING },
        habit_checklist: { type: Type.STRING },
        motivation_quotes: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
      },
      required: ["morning_prompt", "evening_prompt", "habit_checklist", "motivation_quotes"],
    },
    Challenges: {
      type: Type.OBJECT,
      properties: {
        seven_day_challenge: { type: Type.STRING },
        twenty_one_day_challenge: { type: Type.STRING },
      },
      required: ["seven_day_challenge", "twenty_one_day_challenge"],
    },
    ReviewSection: {
      type: Type.OBJECT,
      properties: {
        progress_summary: { type: Type.STRING },
        reward_system: { type: Type.STRING },
      },
      required: ["progress_summary", "reward_system"],
    },
  },
  required: [
    "WorkbookTitle",
    "Introduction",
    "HowToUse",
    "GoalSettingSection",
    "MonthlyPlanner",
    "WeeklyPlanner",
    "DailyPages",
    "Challenges",
    "ReviewSection",
  ],
};

export const generateWorkbook = async (topic: string): Promise<WorkbookData> => {
  // Create a new instance right before the call to ensure we use the latest API key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    You are an expert productivity coach.
    Create a complete "Mastery Blueprint Workbook" for a user who wants to focus on: "${topic}".
    The workbook should be designed for 30 days of consistent action.
    Make the language motivating, simple, and beginner-friendly.
    Ensure specific advice related to "${topic}" is included in the milestones and objectives.
    
    IMPORTANT FORMATTING RULES:
    - Format ALL lists (Objectives, Milestones, Challenges, Habit Templates, Rewards) using bullet points (starting with "- " or "* ").
    - Include specific, actionable activities in these lists that the user can physically do and check off.
    
    Return ONLY the raw JSON object.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: workbookSchema,
        thinkingConfig: { thinkingBudget: 4000 }
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from Gemini");
    }

    return JSON.parse(text) as WorkbookData;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    // Specifically handle the "Requested entity was not found" error for project selection
    if (error?.message?.includes("Requested entity was not found")) {
      throw new Error("AUTH_INVALID");
    }
    throw error;
  }
};
