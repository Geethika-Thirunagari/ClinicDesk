import api from '../api/axios';
import { analyzeSymptomsLocally } from '../utils/symptomAnalysisMock';

export const aiService = {
  /**
   * Teleconsult / symptom checker — Gemini via Django when configured.
   */
  analyzeSymptoms: async (symptomsText) => {
    const trimmed = String(symptomsText || '').trim();
    if (!trimmed) {
      throw new Error('No symptoms provided.');
    }

    try {
      const response = await api.post('ai/analyze-symptoms/', { symptoms: trimmed });
      return response.data;
    } catch {
      return analyzeSymptomsLocally(trimmed);
    }
  },

  /**
   * Sidebar AI chat & doctor assistant messages.
   * @param {{ message: string, history?: {role:string,text:string}[], context?: string }} params
   */
  chat: async ({ message, history = [], context = 'general' }) => {
    const trimmed = String(message || '').trim();
    if (!trimmed) {
      throw new Error('No message provided.');
    }

    const response = await api.post('ai/chat/', {
      message: trimmed,
      history,
      context,
    });
    return response.data;
  },
};
