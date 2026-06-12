function renderChart(container, dataset, groups, callbacks, initialSelection) {
  const selected = new Set(initialSelection || []);
  let containerEl = container;
  if (typeof container === "string") containerEl = document.getElementById(container);
  if (!containerEl) return;

  containerEl.innerHTML = "";

  groups.forEach(group => {
    const chars = dataset.filter(d => d.group === group.key);
    if (chars.length === 0) return;

    const section = document.createElement("div");
    section.className = "mb-2";

    const header = document.createElement("div");
    header.className = "group-header flex items-center gap-1 mb-1 cursor-pointer select-none px-0.5";
    header.innerHTML = `<span class="font-label-caps text-label-caps text-secondary">${group.label}</span><span class="h-px flex-1 bg-outline-variant/30"></span><button class="row-select-btn flex items-center justify-center w-5 h-5 rounded-full text-secondary hover:text-primary hover:bg-surface-container-high transition-colors" title="Toggle row"><span class="material-symbols-outlined text-[14px]">checklist</span></button>`;
    let groupSelected = false;
    const toggleRow = () => {
      groupSelected = !groupSelected;
      chars.forEach(d => {
        if (groupSelected) selected.add(d.char);
        else selected.delete(d.char);
      });
      renderCards();
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

    const grid = document.createElement("div");
    grid.className = "grid grid-cols-5 gap-1";

    const cards = [];
    chars.forEach(d => {
      const card = document.createElement("div");
      card.className = "char-card aspect-[2/3] bg-surface border border-outline-variant/50 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:shadow-sm transition-all duration-200 relative group";
      card.innerHTML = `
        <div class="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full border border-outline-variant transition-colors"></div>
        <span class="font-japanese-character text-[14px] sm:text-[18px] md:text-[24px] text-on-surface">${d.char}</span>
        <span class="font-label-caps text-label-caps text-secondary absolute bottom-0.5 opacity-0 group-hover:opacity-100 transition-opacity text-[8px] leading-none">${d.romaji}</span>
      `;
      card.addEventListener("click", (e) => {
        e.stopPropagation();
        if (selected.has(d.char)) selected.delete(d.char);
        else selected.add(d.char);
        updateCardVisual(card, selected.has(d.char));
        if (callbacks && callbacks.onSelectionChange) callbacks.onSelectionChange(new Set(selected));
        if (callbacks && callbacks.onCharClick) callbacks.onCharClick(d.char);
      });
      grid.appendChild(card);
      cards.push(card);
    });

    section.appendChild(grid);
    containerEl.appendChild(section);

    function renderCards() {
      chars.forEach((d, i) => {
        updateCardVisual(cards[i], selected.has(d.char));
      });
    }
    renderCards();
  });

  if (callbacks && callbacks.getSelection) {
    callbacks.getSelection = () => new Set(selected);
  }
}

function updateCardVisual(card, isSelected) {
  const dot = card.querySelector(".absolute.top-1");
  if (isSelected) {
    card.classList.add("ring-2", "ring-primary", "bg-primary-container/20");
    if (dot) { dot.classList.add("bg-primary", "border-primary"); dot.classList.remove("border-outline-variant"); }
  } else {
    card.classList.remove("ring-2", "ring-primary", "bg-primary-container/20");
    if (dot) { dot.classList.remove("bg-primary", "border-primary"); dot.classList.add("border-outline-variant"); }
  }
}
