function startQuiz(container, pool, mode, section, callbacks) {
  let containerEl = container;
  if (typeof container === "string") containerEl = document.getElementById(container);
  if (!containerEl || pool.length === 0) return;

  const multiChar = callbacks && callbacks.multiChar;
  let questions;
  if (multiChar && pool.length > 1) {
    questions = [];
    const shuffled = shuffleArray([...pool]);
    for (let i = 0; i < shuffled.length - 1; i += 2) {
      questions.push([shuffled[i], shuffled[i + 1]]);
    }
  } else {
    questions = shuffleArray([...pool]).map(q => [q]);
  }
  let current = 0;
  let correctCount = 0;
  let attemptedCount = 0;

  containerEl.innerHTML = "";
  renderQuestion();

  function getAcceptableAnswers(group) {
    if (mode === "meaning") {
      const m = group.map(e =>
        e.meaning.toLowerCase().split("/").map(s => s.trim()).filter(Boolean)
      );
      return combineAnswers(m);
    }
    const r = group.map(e => {
      let readings = e.romaji.toLowerCase().split("/").map(s => s.trim()).filter(Boolean);
      readings = readings.flatMap(s => s.split(",").map(t => t.trim()));
      return readings;
    });
    return combineAnswers(r);
  }

  function combineAnswers(lists) {
    return lists.reduce((acc, list) => {
      if (acc.length === 0) return list;
      const result = [];
      for (const a of acc) {
        for (const b of list) {
          result.push(a + b);
        }
      }
      return result;
    }, []);
  }

  function renderQuestion() {
    if (current >= questions.length) {
      renderSummary();
      return;
    }

    const group = questions[current];
    const charsHtml = group.map(e =>
      `<span class="inline-block font-japanese-character text-[48px] md:text-[64px] text-on-surface select-none">${e.char}</span>`
    ).join("");
    const acceptable = getAcceptableAnswers(group);
    containerEl.innerHTML = `
      <div class="text-center py-6">
        <div class="text-sm text-secondary mb-2">${current + 1} / ${questions.length}</div>
        <div class="flex items-center justify-center gap-4 mb-6">${charsHtml}</div>
        ${mode === "meaning" ? '<div class="font-body-lg text-body-lg text-secondary mb-4">Type the English meaning:</div>' : '<div class="font-body-lg text-body-lg text-secondary mb-4">Type the romaji reading:</div>'}
        <div class="flex items-center justify-center gap-3 max-w-md mx-auto">
          <input type="text" id="quiz-input" class="flex-1 px-4 py-3 rounded-xl bg-surface-bright border border-outline-variant text-on-surface text-center text-lg font-body-md outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all" placeholder="Your answer..." autofocus>
          <button id="quiz-submit" class="px-6 py-3 rounded-xl bg-primary text-on-primary font-body-md font-semibold hover:bg-surface-tint transition-colors shadow-sm">Submit</button>
        </div>
        <div id="quiz-feedback" class="mt-4 min-h-[32px]"></div>
      </div>
    `;

    const input = document.getElementById("quiz-input");
    const submitBtn = document.getElementById("quiz-submit");

    function checkAnswer() {
      if (!input) return;
      const answer = input.value.trim().toLowerCase();
      if (!answer) return;

      input.disabled = true;
      submitBtn.disabled = true;
      attemptedCount++;

      const correct = acceptable.some(a => a === answer);
      if (correct) correctCount++;

      const fb = document.getElementById("quiz-feedback");
      if (fb) {
        fb.innerHTML = correct
          ? `<span class="text-tertiary font-bold text-lg">✅ Correct!</span>`
          : `<span class="text-error font-bold text-lg">❌ <span class="text-on-surface-variant font-body-md">Correct answer: ${acceptable[0]}</span></span>`;
      }

      if (callbacks && callbacks.onAnswer) callbacks.onAnswer(correctCount, attemptedCount);

      setTimeout(() => {
        current++;
        renderQuestion();
      }, correct ? 800 : 2000);
    }

    submitBtn.addEventListener("click", checkAnswer);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") checkAnswer();
    });
  }

  function renderSummary() {
    const pct = attemptedCount === 0 ? 0 : Math.round((correctCount / attemptedCount) * 100);
    containerEl.innerHTML = `
      <div class="text-center py-10">
        <div class="text-5xl mb-4">${pct >= 80 ? "🎉" : pct >= 50 ? "👍" : "💪"}</div>
        <h2 class="font-headline-md text-headline-md text-on-surface mb-2">Quiz Complete!</h2>
        <div class="font-display-lg text-display-lg text-primary font-bold mb-2">${correctCount} / ${attemptedCount}</div>
        <div class="font-body-lg text-body-lg text-secondary mb-8">${pct}% accuracy</div>
        <div class="flex items-center justify-center gap-4">
          <button id="quiz-restart" class="px-6 py-3 rounded-xl bg-primary text-on-primary font-body-md font-semibold hover:bg-surface-tint transition-colors shadow-sm">Restart</button>
          <button id="quiz-back" class="px-6 py-3 rounded-xl bg-surface-bright border border-outline-variant text-on-surface font-body-md hover:bg-surface-container transition-colors">Back to Chart</button>
        </div>
      </div>
    `;

    document.getElementById("quiz-restart").addEventListener("click", () => {
      current = 0;
      correctCount = 0;
      attemptedCount = 0;
      renderQuestion();
    });

    document.getElementById("quiz-back").addEventListener("click", () => {
      if (callbacks && callbacks.onBack) callbacks.onBack();
    });

    if (callbacks && callbacks.onComplete) {
      callbacks.onComplete(correctCount, attemptedCount);
    }
  }
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
