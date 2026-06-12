function renderChart(container, dataset, groups, callbacks, initialSelection) {
  const selected = new Set(initialSelection || []);
  let containerEl = container;
  if (typeof container === "string") containerEl = document.getElementById(container);
  if (!containerEl) return;

  containerEl.innerHTML = "";

  const vowelOrder = ["a", "i", "u", "e", "o"];
  const allCards = [];

  function makeCard(d) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "char-card aspect-[1/1] bg-surface border border-outline-variant/50 rounded-md flex flex-col items-center justify-center hover:shadow-sm transition-[color,background-color,border-color,box-shadow] duration-200 relative group";
    card.dataset.char = d.char;
    card.setAttribute("aria-label", `${d.char} - ${d.romaji}`);
    card.innerHTML = `
      <div class="absolute top-[1px] right-[1px] w-[2px] h-[2px] rounded-full border border-outline-variant transition-colors dot-indicator"></div>
      <span class="font-japanese-character text-[24px] sm:text-[26px] md:text-[32px] text-on-surface">${d.char}</span>
      <span class="font-label-caps text-label-caps text-secondary absolute bottom-[1px] opacity-0 group-hover:opacity-100 transition-opacity text-[9px] leading-none romaji-label">${d.romaji}</span>
    `;
    card.addEventListener("click", (e) => {
      e.stopPropagation();
      if (selected.has(d.char)) selected.delete(d.char);
      else selected.add(d.char);
      updateCardVisual(card, selected.has(d.char));
      if (callbacks && callbacks.onSelectionChange) callbacks.onSelectionChange(new Set(selected));
      if (callbacks && callbacks.onCharClick) callbacks.onCharClick(d.char);
    });
    return card;
  }

  function makeEmptyCell() {
    const div = document.createElement("div");
    div.className = "aspect-[1/1] rounded-md border border-dashed border-outline-variant/30 bg-surface-container-lowest opacity-40";
    return div;
  }

  function makeColHeader(label, chars) {
    const btn = document.createElement("button");
    btn.className = "font-label-caps text-[11px] text-secondary h-8 flex items-center justify-center rounded-md bg-surface border border-outline-variant/30 hover:bg-primary-container/20 transition-colors cursor-pointer w-full";
    btn.textContent = label;
    btn.title = "Toggle " + label;
    btn.addEventListener("click", () => {
      const allSel = chars.every(d => selected.has(d.char));
      chars.forEach(d => {
        if (allSel) selected.delete(d.char);
        else selected.add(d.char);
      });
      renderAllCards();
      if (callbacks && callbacks.onSelectionChange) callbacks.onSelectionChange(new Set(selected));
    });
    return btn;
  }

  // ---- Desktop: Traditional Gojuon Chart (columns = consonant groups, RTL) ----
  const desktopWrapper = document.createElement("div");
  desktopWrapper.className = "hidden md:block";

  const chartRow = document.createElement("div");
  chartRow.className = "flex flex-row-reverse gap-[4px] pb-2";

  groups.forEach((group, idx) => {
    const chars = dataset.filter(d => d.group === group.key);
    if (chars.length === 0) return;

    // Spacer before dakuten rows
    if (group.key === "ga-row" && idx > 0) {
      const spacer = document.createElement("div");
      spacer.className = "w-4 shrink-0";
      chartRow.appendChild(spacer);
    }

    const col = document.createElement("div");
    col.className = "flex flex-col gap-[4px] flex-1 min-w-0";

    const key = group.key.replace("-row", "");
    const colLabel = key === "n" ? "N" : key.charAt(0).toUpperCase();
    col.appendChild(makeColHeader(colLabel, chars));

    const charMap = {};
    let hasVowelChar = false;
    chars.forEach(d => {
      const v = getVowelEnding(d.romaji);
      if (v && vowelOrder.includes(v)) {
        charMap[v] = d;
        hasVowelChar = true;
      }
    });

    if (!hasVowelChar) {
      for (let i = 0; i < 5; i++) {
        if (i < chars.length) {
          const card = makeCard(chars[i]);
          col.appendChild(card);
          allCards.push(card);
        } else {
          col.appendChild(makeEmptyCell());
        }
      }
    } else {
      vowelOrder.forEach(v => {
        if (charMap[v]) {
          const card = makeCard(charMap[v]);
          col.appendChild(card);
          allCards.push(card);
        } else {
          col.appendChild(makeEmptyCell());
        }
      });
    }

    chartRow.appendChild(col);
  });

  // Vowel column inside chartRow (rightmost side in row-reverse)
  const vowelCol = document.createElement("div");
  vowelCol.className = "flex flex-col gap-[4px] flex-1 min-w-0";
  const headerPlaceholder = document.createElement("div");
  headerPlaceholder.className = "h-8";
  vowelCol.appendChild(headerPlaceholder);
  vowelOrder.forEach(v => {
    const btn = document.createElement("button");
    btn.className = "w-full aspect-[1/1] font-label-caps text-label-caps text-secondary flex items-center justify-center rounded-md bg-surface border border-outline-variant/30 hover:bg-primary-container/20 transition-colors cursor-pointer text-[14px]";
    btn.textContent = v.toUpperCase();
    btn.addEventListener("click", () => {
      const vowelChars = dataset.filter(d => getVowelEnding(d.romaji) === v);
      if (vowelChars.length === 0) return;
      const allSel = vowelChars.every(d => selected.has(d.char));
      vowelChars.forEach(d => {
        if (allSel) selected.delete(d.char);
        else selected.add(d.char);
      });
      renderAllCards();
      if (callbacks && callbacks.onSelectionChange) callbacks.onSelectionChange(new Set(selected));
    });
    vowelCol.appendChild(btn);
  });
  chartRow.prepend(vowelCol);
  desktopWrapper.appendChild(chartRow);

  containerEl.appendChild(desktopWrapper);

  // ---- Mobile: Per-group grid (unchanged) ----
  groups.forEach(group => {
    const chars = dataset.filter(d => d.group === group.key);
    if (chars.length === 0) return;

    const section = document.createElement("div");
    section.className = "mb-1";

    const header = document.createElement("div");
    header.className = "group-header flex items-center gap-1 mb-[2px] cursor-pointer select-none px-0.5 md:hidden";
    header.innerHTML = `<span class="font-label-caps text-label-caps text-secondary">${group.label}</span><span class="h-px flex-1 bg-outline-variant/30"></span><button class="row-select-btn flex items-center justify-center w-4 h-4 rounded-full text-secondary hover:text-primary hover:bg-surface-container-high transition-colors" title="Toggle row"><span class="material-symbols-outlined text-[11px]">checklist</span></button>`;

    const toggleRow = () => {
      const allSel = chars.every(d => selected.has(d.char));
      chars.forEach(d => {
        if (allSel) selected.delete(d.char);
        else selected.add(d.char);
      });
      renderAllCards();
      if (callbacks && callbacks.onSelectionChange) callbacks.onSelectionChange(new Set(selected));
    };

    header.addEventListener("click", (e) => {
      if (e.target.closest(".row-select-btn")) return;
      toggleRow();
    });
    header.querySelector(".row-select-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      toggleRow();
    });
    section.appendChild(header);

    const mobileGrid = document.createElement("div");
    mobileGrid.className = "grid grid-cols-5 gap-[4px] md:hidden";

    chars.forEach(d => {
      const card = makeCard(d);
      mobileGrid.appendChild(card);
      allCards.push(card);
    });

    section.appendChild(mobileGrid);
    containerEl.appendChild(section);
  });

  function renderAllCards() {
    allCards.forEach(card => {
      updateCardVisual(card, selected.has(card.dataset.char));
    });
  }
  renderAllCards();

  if (callbacks && callbacks.getSelection) {
    callbacks.getSelection = () => new Set(selected);
  }
}

function updateCardVisual(card, isSelected) {
  const dot = card.querySelector(".dot-indicator");
  if (isSelected) {
    card.classList.add("ring-2", "ring-primary", "bg-primary-container/20");
    if (dot) { dot.classList.add("bg-primary", "border-primary"); dot.classList.remove("border-outline-variant"); }
  } else {
    card.classList.remove("ring-2", "ring-primary", "bg-primary-container/20");
    if (dot) { dot.classList.remove("bg-primary", "border-primary"); dot.classList.add("border-outline-variant"); }
  }
}

function getVowelEnding(romaji) {
  if (!romaji || romaji.length === 0) return null;
  const last = romaji.slice(-1);
  if ("aiueo".includes(last)) return last;
  return null;
}
