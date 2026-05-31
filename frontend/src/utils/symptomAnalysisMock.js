/**
 * Client-side symptom analysis (mirrors backend demo logic) when API is unavailable.
 */
export function analyzeSymptomsLocally(symptomsText) {
  const symptoms = String(symptomsText || '').toLowerCase();

  if (!symptoms.trim()) {
    throw new Error('No symptoms provided.');
  }

  if (symptoms.includes('chest pain') || symptoms.includes('shortness of breath')) {
    return {
      severity: 'CRITICAL',
      confidence: '94%',
      predictions: [
        { condition: 'Myocardial Infarction', probability: 88 },
        { condition: 'Pulmonary Embolism', probability: 72 },
        { condition: 'Severe Angina', probability: 65 },
      ],
      recommendations: [
        'IMMEDIATE ER TRIAGE REQUIRED',
        'Order STAT EKG and Troponin levels',
        'Administer Oxygen',
      ],
    };
  }

  if (
    symptoms.includes('cold') ||
    symptoms.includes('cough') ||
    symptoms.includes('sore throat') ||
    symptoms.includes('runny') ||
    symptoms.includes('congestion') ||
    symptoms.includes('sneez') ||
    symptoms.includes('throat') ||
    (symptoms.includes('fever') && (symptoms.includes('cough') || symptoms.includes('throat')))
  ) {
    return {
      severity: 'MODERATE',
      confidence: '89%',
      predictions: [
        { condition: 'Viral Upper Respiratory Infection', probability: 85 },
        { condition: 'Influenza', probability: 60 },
        { condition: 'Acute Bronchitis', probability: 45 },
      ],
      recommendations: [
        'Rest, fluids, and monitor temperature',
        'Consider rapid strep or flu test if fever persists',
        'Use saline nasal spray or steam for congestion',
        'OTC acetaminophen or ibuprofen for fever and aches',
      ],
    };
  }

  if (symptoms.includes('headache') && symptoms.includes('vision')) {
    return {
      severity: 'HIGH',
      confidence: '81%',
      predictions: [
        { condition: 'Migraine with Aura', probability: 78 },
        { condition: 'Ocular Hypertension', probability: 40 },
      ],
      recommendations: [
        'Conduct neurological exam',
        'Refer to Optometry/Neurology',
        'Dim lighting in exam room',
      ],
    };
  }

  return {
    severity: 'LOW',
    confidence: '60%',
    predictions: [{ condition: 'Generalized Fatigue / Idiopathic', probability: 55 }],
    recommendations: [
      'Order standard CBC blood panel',
      'Schedule follow-up in 48 hours',
      'Continue monitoring symptoms during teleconsult',
    ],
  };
}
