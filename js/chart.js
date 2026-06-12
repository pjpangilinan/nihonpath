function renderChart(container, dataset, groups, callbacks, initialSelection) {
  const selected = new Set(initialSelection || []);
  let containerEl = container;
  if (typeof container === "string") containerEl = document.getElementById(container);
  if (!containerEl) return;

  containerEl.innerHTML = "";

  const vowelOrder = ["a", "i", "u", "e", "o"];
  const allCards = [];

  const colHeadRow = document.createElement("div");
  colHeadRow.className = "hidden md:grid grid-cols-6 gap-1 mb-2 items-start";
  const colSpacer = document.createElement("div");
  colHeadRow.appendChild(colSpacer);
  vowelOrder.forEach(v => {
    const btn = document.createElement("button");
    btn.className = "font-label-caps text-label-caps text-secondary text-center py-1.5 rounded-lg bg-surface border border-outline-variant/30 hover:bg-primary-container/20 transition-colors cursor-pointer w-full";
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
    colHeadRow.appendChild(btn);
  });
  containerEl.appendChild(colHeadRow);

  groups.forEach(group => {
    const chars = dataset.filter(d => d.group === group.key);
    if (chars.length === 0) return;

    const section = document.createElement("div");
    section.className = "mb-2";

    const header = document.createElement("div");
    header.className = "group-header flex items-center gap-1 mb-1 cursor-pointer select-none px-0.5 md:hidden";
    header.innerHTML = `<span class="font-label-caps text-label-caps text-secondary">${group.label}</span><span class="h-px flex-1 bg-outline-variant/30"></span><button class="row-select-btn flex items-center justify-center w-5 h-5 rounded-full text-secondary hover:text-primary hover:bg-surface-container-high transition-colors" title="Toggle row"><span class="material-symbols-outlined text-[14px]">checklist</span></button>`;
    const headerRowToggle = () => {
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
      headerRowToggle();
    });
    header.querySelector(".row-select-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      headerRowToggle();
    });
    section.appendChild(header);

    const gridsWrapper = document.createElement("div");

    const mobileGrid = document.createElement("div");
    mobileGrid.className = "grid grid-cols-5 gap-1 md:hidden";

    const desktopGrid = document.createElement("div");
    desktopGrid.className = "hidden md:grid grid-cols-6 gap-1 items-start";

    function makeCard(d) {
      const card = document.createElement("div");
      card.className = "char-card aspect-[3/4] bg-surface border border-outline-variant/50 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:shadow-sm transition-all duration-200 relative group";
      card.dataset.char = d.char;
      card.innerHTML = `
        <div class="absolute top-[2px] right-[2px] w-[3px] h-[3px] rounded-full border border-outline-variant transition-colors dot-indicator"></div>
        <span class="font-japanese-character text-[12px] sm:text-[14px] md:text-[18px] text-on-surface">${d.char}</span>
        <span class="font-label-caps text-label-caps text-secondary absolute bottom-0.5 opacity-0 group-hover:opacity-100 transition-opacity text-[7px] leading-none">${d.romaji}</span>
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

    chars.forEach(d => {
      const card = makeCard(d);
      mobileGrid.appendChild(card);
      allCards.push(card);
    });

    const buckets = { a: [], i: [], u: [], e: [], o: [] };
    chars.forEach(d => {
      const v = getVowelEnding(d.romaji);
      if (v && buckets[v]) buckets[v].push(d);
    });

    const maxRows = Math.max(...vowelOrder.map(v => (buckets[v] || []).length), 0);

    for (let r = 0; r < maxRows; r++) {
      const labelCell = document.createElement("div");
      if (r === 0) {
        labelCell.className = "flex flex-col items-center justify-center gap-0.5 cursor-pointer select-none py-1";
        const btn = document.createElement("button");
        btn.className = "flex items-center justify-center w-5 h-5 rounded-full text-secondary hover:text-primary hover:bg-surface-container-high transition-colors";
        btn.innerHTML = '<span class="material-symbols-outlined text-[14px]">checklist</span>';
        const label = document.createElement("span");
        label.className = "font-label-caps text-label-caps text-secondary text-center";
        label.textContent = group.label;
        labelCell.appendChild(btn);
        labelCell.appendChild(label);
        const desktopRowToggle = () => {
          const allSel = chars.every(d => selected.has(d.char));
          chars.forEach(d => {
            if (allSel) selected.delete(d.char);
            else selected.add(d.char);
          });
          renderAllCards();
          if (callbacks && callbacks.onSelectionChange) callbacks.onSelectionChange(new Set(selected));
        };
        labelCell.addEventListener("click", (e) => {
          if (e.target.closest("button")) return;
          desktopRowToggle();
        });
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          desktopRowToggle();
        });
      }
      desktopGrid.appendChild(labelCell);

      vowelOrder.forEach(v => {
        const d = (buckets[v] || [])[r];
        if (d) {
          const card = makeCard(d);
          desktopGrid.appendChild(card);
          allCards.push(card);
        } else {
          const empty = document.createElement("div");
          empty.className = "aspect-[3/4]";
          desktopGrid.appendChild(empty);
        }
      });
    }

    gridsWrapper.appendChild(mobileGrid);
    gridsWrapper.appendChild(desktopGrid);
    section.appendChild(gridsWrapper);
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
