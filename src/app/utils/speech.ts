type SpeakOptions = {
  onEnd?: () => void;
  pitch?: number;
  rate?: number;
};

export function stopSpeech() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
}

export function speak(text: string, options: SpeakOptions = {}) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    options.onEnd?.();
    return false;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices();
  const englishVoices = voices.filter((voice) =>
    voice.lang.toLowerCase().startsWith("en"),
  );
  const preferredVoiceNames = [
    "jenny",
    "aria",
    "google us english",
    "samantha",
    "ava",
    "zira",
    "karen",
    "moira",
  ];
  const preferredVoice = preferredVoiceNames
    .map((name) =>
      englishVoices.find((voice) => voice.name.toLowerCase().includes(name)),
    )
    .find(Boolean);

  utterance.lang = "en-US";
  utterance.voice = preferredVoice ?? englishVoices[0] ?? null;
  utterance.rate = options.rate ?? 0.75;
  utterance.pitch = options.pitch ?? 1.12;
  utterance.volume = 1;
  utterance.onend = () => options.onEnd?.();
  utterance.onerror = () => options.onEnd?.();
  window.speechSynthesis.speak(utterance);
  return true;
}
