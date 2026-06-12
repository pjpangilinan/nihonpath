const STORAGE_KEY = "nihonpath_progress";

function getProgress() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try { return JSON.parse(raw); }
    catch { /* fall through */ }
  }
  return {
    hiragana: { attempted: 0, correct: 0 },
    katakana: { attempted: 0, correct: 0 },
    combined: { attempted: 0, correct: 0 },
    kanji: { attempted: 0, correct: 0 }
  };
}

function updateProgress(section, correct, attempted) {
  const data = getProgress();
  if (!data[section]) data[section] = { attempted: 0, correct: 0 };
  data[section].correct += correct;
  data[section].attempted += attempted;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getAccuracy(section) {
  const data = getProgress();
  const s = data[section];
  if (!s || s.attempted === 0) return 0;
  return Math.round((s.correct / s.attempted) * 100);
}

function getCoverage(section, total) {
  const data = getProgress();
  const s = data[section];
  if (!s || s.attempted === 0 || total === 0) return "0.0";
  return ((s.attempted / total) * 100).toFixed(1);
}

function getOverallCoverage() {
  const data = getProgress();
  const totals = { hiragana: 71, katakana: 71, combined: 142, kanji: 100 };
  let totalAttempted = 0;
  let totalChars = 0;
  for (const [k, total] of Object.entries(totals)) {
    const s = data[k];
    if (s) totalAttempted += s.attempted;
    totalChars += total;
  }
  if (totalChars === 0) return "0.0";
  return ((totalAttempted / totalChars) * 100).toFixed(1);
}
