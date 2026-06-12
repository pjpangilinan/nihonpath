let jpVoice = null;
let voicesLoaded = false;

function loadVoices() {
  const voices = speechSynthesis.getVoices();
  jpVoice = voices.find(v => v.lang.startsWith("ja")) || null;
  voicesLoaded = true;
}

if (typeof speechSynthesis !== "undefined") {
  speechSynthesis.onvoiceschanged = loadVoices;
  loadVoices();
}

function speak(text) {
  if (typeof speechSynthesis === "undefined") return;
  speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "ja-JP";
  if (jpVoice) utter.voice = jpVoice;
  utter.rate = 0.9;
  speechSynthesis.speak(utter);
}
