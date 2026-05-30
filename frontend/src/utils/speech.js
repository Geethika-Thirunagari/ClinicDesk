/** Speak text using browser speech synthesis (patient messages in teleconsult). */
export function speakText(text, { onEnd } = {}) {
  if (!text?.trim() || typeof window === 'undefined' || !window.speechSynthesis) {
    return false;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text.trim());
  utterance.rate = 0.95;
  utterance.pitch = 1;
  if (onEnd) utterance.onend = onEnd;
  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}
