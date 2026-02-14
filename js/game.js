const track = document.getElementById("track");
const btnOpen = document.getElementById("btnOpen");
const result = document.getElementById("result");

const ITEMS = [
  { name: "MP9 | Sand Dashed", rarity: "blue", img: "images/items/mp9.png" },
  { name: "UMP-45 | Urban DDPAT", rarity: "blue", img: "images/items/ump.png" },
  { name: "P90 | Elite Build", rarity: "purple", img: "images/items/p90.png" },
  { name: "Glock-18 | Reactor", rarity: "purple", img: "images/items/glock.png" },
  { name: "AK-47 | Gold", rarity: "red", img: "images/items/ak.png" },
  { name: "M4A1-S | Hyper Beast", rarity: "pink", img: "images/items/m4.png" },
  { name: "AWP | Asiimov", rarity: "pink", img: "images/items/awp.png" },
];

const WEIGHTS = {
  blue: 60,
  purple: 25,
  pink: 12,
  red: 3,
};

const RARITY_COLOR = {
  blue: "#3b82f6",
  purple: "#a855f7",
  pink: "#ec4899",
  red: "#ef4444",
};

let isSpinning = false;

function buildTrack() {
  track.innerHTML = "";
  result.textContent = "No result";

  const list = [];
  for (let i = 0; i < 35; i++) {
    list.push(pickWeightedItem());
  }

  for (const item of list) {
    const card = document.createElement("div");
    card.className = "item-card";

    const img = document.createElement("img");
    img.src = item.img;
    img.alt = item.name;

    const meta = document.createElement("div");
    meta.className = "item-meta";
    meta.innerHTML = `<strong>${item.name}</strong><span>${item.rarity.toUpperCase()}</span>`;

    const bar = document.createElement("div");
    bar.className = "rarity-bar";
    bar.style.background = RARITY_COLOR[item.rarity];

    card.appendChild(img);
    card.appendChild(meta);
    card.appendChild(bar);
    track.appendChild(card);
  }

  track.style.transition = "none";
  track.style.transform = "translate3d(0,0,0)";
  track.offsetHeight; 
}

function pickWeightedItem() {
  const pool = [];
  for (const it of ITEMS) {
    const w = WEIGHTS[it.rarity] ?? 1;
    pool.push({ item: it, w });
  }

  const total = pool.reduce((s, p) => s + p.w, 0);
  let r = Math.random() * total;

  for (const p of pool) {
    r -= p.w;
    if (r <= 0) return p.item;
  }
  return ITEMS[0];
}

function spin() {
    reset()
  if (isSpinning) return;
  isSpinning = true;
  btnOpen.disabled = true;
  result.textContent = "Opening...";

  const cards = Array.from(track.children);
  if (cards.length === 0) buildTrack();

  const winIndex = Math.floor(cards.length * 0.75) + Math.floor(Math.random() * 5);
  const winCard = cards[winIndex];
  const winName = winCard.querySelector(".item-meta strong")?.textContent ?? "Item";
  const winRarity = winCard.querySelector(".item-meta span")?.textContent ?? "";
  const viewport = document.querySelector(".viewport");
  const viewportRect = viewport.getBoundingClientRect();
  const cardRect = winCard.getBoundingClientRect();
  const currentX = getCurrentTranslateX(track);
  const viewportCenterX = viewportRect.left + viewportRect.width / 2;
  const winCardCenterX = cardRect.left + cardRect.width / 2;
  const delta = viewportCenterX - winCardCenterX;
  const micro = (Math.random() * 30) - 15;
  const targetX = currentX + delta + micro;

  track.style.transition = "transform 5.2s cubic-bezier(0.08, 0.85, 0.12, 1)";
  track.style.transform = `translate3d(${targetX}px, 0, 0)`;

  setTimeout(() => {
    result.textContent = `You got: ${winName} (${winRarity})`;
    isSpinning = false;
    btnOpen.disabled = false;
  }, 5400);
}

function getCurrentTranslateX(el) {
  const st = window.getComputedStyle(el);
  const tr = st.transform;

  if (tr === "none") return 0;

  const values = tr.match(/matrix\((.+)\)/);
  if (!values) return 0;

  const parts = values[1].split(",").map((v) => parseFloat(v.trim()));
  return parts[4] || 0;
}

function reset() {
  if (isSpinning) return;
  buildTrack();
}

btnOpen.addEventListener("click", spin);
buildTrack();
