/**
 * Detect symptom-style input (voice or chat) vs normal conversation.
 */
const SYMPTOM_PATTERN =
  /cold|fever|pain|cough|headache|nausea|sore|ache|hurt|breath|dizzy|rash|throat|flu|congestion|sneez|vomit|symptom|chill|fatigue|weak/i;

const SMALL_TALK =
  /^(hi|hello|hey|thanks|thank you|ok|okay|yes|no|got it|sure|bye|goodbye)\.?!?$/i;

export function isSymptomLike(text) {
  const t = String(text || '').trim();
  if (t.length < 2) return false;
  if (SMALL_TALK.test(t)) return false;
  if (SYMPTOM_PATTERN.test(t)) return true;
  const words = t.split(/\s+/).filter(Boolean);
  return words.length <= 2;
}

export function buildDoctorTriageMessage(result) {
  if (!result) return 'AI triage could not complete. Please describe symptoms again.';
  const recs = result.recommendations?.join(' ') || 'Continue evaluation on the call.';
  return `AI solution (${result.severity}): ${recs}`;
}

export function buildPatientDoctorReply(result) {
  if (!result?.recommendations?.length) {
    return `Thank you for explaining that. Based on initial assessment (${result?.severity || 'pending'}), we'll continue on this call.`;
  }
  return `I've reviewed what you described (${result.severity} priority). ${result.recommendations.join(' ')} Let's discuss this further now.`;
}

export function chatTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
