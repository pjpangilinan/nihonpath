const MAX_BLOSSOMS = 30;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function initSakura(mode) {
  const container = document.getElementById("sakura-container");
  if (!container) return;
  if (prefersReducedMotion) return;
  container.innerHTML = "";
  if (mode === "decorative") {
    for (let i = 0; i < 15; i++) createPetal(container);
  }
}

function createPetal(container) {
  const petal = document.createElement("div");
  petal.className = "petal";
  const size = Math.random() * 8 + 6;
  const left = Math.random() * 100;
  const duration = Math.random() * 10 + 10;
  const delay = Math.random() * 10;
  petal.style.width = size + "px";
  petal.style.height = (size * 1.5) + "px";
  petal.style.left = left + "vw";
  petal.style.animationDuration = duration + "s";
  petal.style.animationDelay = "-" + delay + "s";
  container.appendChild(petal);
}

function updateSakura(correct, total) {
  const container = document.getElementById("sakura-container");
  if (!container || prefersReducedMotion) return;
  const target = total === 0 ? 0 : Math.floor((correct / total) * MAX_BLOSSOMS);
  const current = container.children.length;
  if (target > current) {
    for (let i = current; i < target; i++) {
      const petal = document.createElement("span");
      petal.className = "petal-static";
      petal.textContent = "🌸";
      petal.style.top = Math.random() * 100 + "vh";
      petal.style.left = Math.random() * 100 + "vw";
      petal.style.animationDelay = (Math.random() * 2) + "s";
      container.appendChild(petal);
    }
  } else if (target < current) {
    while (container.children.length > target) {
      container.removeChild(container.lastChild);
    }
  }
}

function resetSakura() {
  const container = document.getElementById("sakura-container");
  if (container) container.innerHTML = "";
}
