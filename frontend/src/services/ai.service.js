import api from '../api/axios';

export const aiService = {
    analyzeSymptoms: async (symptomsText) => {
        // Calls the Django Backend endpoint
        const response = await api.post('ai/analyze-symptoms/', { symptoms: symptomsText });
        return response.data;
    }
};
