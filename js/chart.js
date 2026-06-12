function renderChart(container, dataset, groups, callbacks, initialSelection) {
  const selected = new Set(initialSelection || []);
  let containerEl = container;
  if (typeof container === "string") containerEl = document.getElementById(container);
  if (!containerEl) return;

  containerEl.innerHTML = "";

  const vowelOrder = ["a", "i", "u", "e", "o"];
  const allCards = [];

  function makeCard(d) {
    const card = document.createElement("div");
    card.className = "char-card aspect-[1/1] bg-surface border border-outline-variant/50 rounded-md flex flex-col items-center justify-center cursor-pointer hover:shadow-sm transition-all duration-200 relative group";
    card.dataset.char = d.char;
    card.innerHTML = `
      <div class="absolute top-[1px] right-[1px] w-[2px] h-[2px] rounded-full border border-outline-variant transition-colors dot-indicator"></div>
      <span class="font-japanese-character text-[24px] sm:text-[26px] md:text-[32px] text-on-surface">${d.char}</span>
      <span class="font-label-caps text-label-caps text-secondary absolute bottom-[1px] opacity-0 group-hover:opacity-100 transition-opacity text-[5px] leading-none">${d.romaji}</span>
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

  const desktopWrapper = document.createElement("div");
  desktopWrapper.className = "hidden md:flex gap-[2px] items-start";

  const desktopGrid = document.createElement("div");
  desktopGrid.className = "flex-1 grid grid-cols-10 sm:grid-cols-12 md:grid-cols-14 lg:grid-cols-16 gap-[2px]";
  desktopGrid.style.direction = "rtl";
  dataset.forEach(d => {
    const card = makeCard(d);
    card.style.direction = "ltr";
    desktopGrid.appendChild(card);
    allCards.push(card);
  });
  desktopWrapper.appendChild(desktopGrid);

  const vowelCol = document.createElement("div");
  vowelCol.className = "flex flex-col gap-[2px] shrink-0";
  vowelOrder.forEach(v => {
    const btn = document.createElement("button");
    btn.className = "font-label-caps text-label-caps text-secondary aspect-[1/1] w-10 flex items-center justify-center rounded-md bg-surface border border-outline-variant/30 hover:bg-primary-container/20 transition-colors cursor-pointer text-[16px]";
    btn.textContent = v.toUpperCase();
    btn.addEventListener("click", () => {
      const vowelChars = dataset.filter(d => getVowelEnding(d.romaji) === v);
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
  desktopWrapper.appendChild(vowelCol);

  containerEl.appendChild(desktopWrapper);

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
    mobileGrid.className = "grid grid-cols-5 gap-[2px] md:hidden";

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
