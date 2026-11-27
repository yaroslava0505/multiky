/* Каталог мультфільмів — пошук, фільтри, обране, модальне вікно.
   Чистий Vanilla JS (ES6+), без залежностей. Дані — у data.js. */
(() => {
  "use strict";

  const META = window.CATALOG_META;
  const MOVIES = window.MOVIES;
  const THEME = Object.fromEntries(META.themes.map((t) => [t.k, t]));
  const FMT = Object.fromEntries(META.formats.map((f) => [f.k, f.label]));
  const FEATURED = ["bluey", "pisnya-morya", "dumkamy-navyvorit"];
  const order = (m) => FEATURED.includes(m.id) ? FEATURED.indexOf(m.id) : FEATURED.length;
  const THEME_NAMES = {
    friend: "Дружба", help: "Підтримка", feel: "Емоції", kind: "Доброта",
    brave: "Смілість", family: "Сім’я", self: "Бути собою", loss: "Втрата",
  };
  const FAV_KEY = "multiky:favorites";
  // які картинки реально лежать у art/ — список підставляє build.py
  const HAS_POSTER = new Set(window.POSTERS || []);

  /* ---------- стан ---------- */
  const state = {
    q: "",
    tab: "all",
    age: new Set(),
    cat: new Set(),
    fmt: new Set(),
    theme: new Set(),
    service: new Set(),
  };

  /* ---------- обране ---------- */
  const readFavs = () => {
    try {
      const raw = JSON.parse(localStorage.getItem(FAV_KEY));
      return new Set(Array.isArray(raw) ? raw.filter((x) => typeof x === "string") : []);
    } catch {
      return new Set();
    }
  };
  const favs = readFavs();
  const saveFavs = () => {
    try {
      localStorage.setItem(FAV_KEY, JSON.stringify([...favs]));
    } catch {
      /* приватний режим — обране живе лише до перезавантаження */
    }
  };

  /* ---------- дрібні помічники ---------- */
  const $ = (id) => document.getElementById(id);
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const norm = (s) => String(s).toLowerCase().replace(/ʼ|'|’/g, "'");
  const plural = (n, one, few, many) => {
    const a = n % 10, b = n % 100;
    if (a === 1 && b !== 11) return one;
    if (a >= 2 && a <= 4 && (b < 12 || b > 14)) return few;
    return many;
  };
  const anyFilter = () =>
    state.q || state.age.size || state.cat.size || state.fmt.size || state.theme.size || state.service.size;

  /* ---------- фільтрація ---------- */
  const matchAge = (m) =>
    !state.age.size ||
    [...state.age].some((g) => (g === "Для всієї родини" ? m.family : m.age === g));

  const matchSearch = (m) => {
    if (!state.q) return true;
    const q = norm(state.q);
    return [m.title, m.originalTitle, m.description, m.value, m.country,
            ...m.categories, ...m.themes.map((k) => THEME[k].label)]
      .some((v) => norm(v).includes(q));
  };

  const filtered = () =>
    MOVIES.filter((m) => {
      if (state.tab === "fav" && !favs.has(m.id)) return false;
      if (!matchAge(m)) return false;
      if (state.service.size && !state.service.has(META.services[m.service].g)) return false;
      if (state.cat.size && ![...state.cat].every((c) => m.categories.includes(c))) return false;
      if (state.fmt.size && !state.fmt.has(m.format)) return false;
      if (state.theme.size && ![...state.theme].every((k) => m.themes.includes(k))) return false;
      return matchSearch(m);
    }).sort((a, b) => order(a) - order(b) || a.ageMin - b.ageMin || a.title.localeCompare(b.title, "uk"));

  /* ---------- побудова фільтрів ---------- */
  const chip = (label, set, value, box) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chip";
    b.textContent = label;
    b.setAttribute("aria-pressed", "false");
    b.addEventListener("click", () => {
      set.has(value) ? set.delete(value) : set.add(value);
      render();
    });
    box.appendChild(b);
    filterButtons.push({ button: b, set, value });
    return b;
  };

  const filterButtons = [];
  const quickFilters = [
    { id: "f-age", set: state.age, empty: "Усі вікові групи" },
    { id: "f-fmt", set: state.fmt, empty: "Усі формати" },
    { id: "f-service", set: state.service, empty: "Усі сервіси" },
  ];
  META.ageGroups.forEach((g) => chip(g, state.age, g, $("f-age")));
  META.categories.forEach((c) => chip(c, state.cat, c, $("f-cat")));
  META.formats.forEach((f) => chip(f.label, state.fmt, f.k, $("f-fmt")));
  const serviceGroups = {
    ua: "sweet.tv / Megogo", nf: "Netflix", atv: "Apple TV",
    free: "YouTube", rent: "Прокат",
  };
  Object.entries(serviceGroups).forEach(([key, label]) =>
    chip(label, state.service, key, $("f-service")));
  chip("Короткі серії", state.fmt, "short", $("program-formats"));
  chip("Повнометражні фільми", state.fmt, "full", $("program-formats"));

  const allThemes = $("all-themes");
  allThemes.addEventListener("click", () => { state.theme.clear(); render(); });
  META.themes.forEach((theme) => {
    const label = THEME_NAMES[theme.k] || theme.label;
    const button = chip(label, state.theme, theme.k, $("f-theme"));
    button.classList.add("theme-btn", "theme-tile");
    button.style.setProperty("--c", `var(--t-${theme.k})`);
    const name = document.createElement("span");
    name.className = "theme-tile-name";
    name.textContent = label;
    const tick = document.createElement("span");
    tick.className = "theme-tile-tick";
    tick.textContent = "✓";
    tick.setAttribute("aria-hidden", "true");
    button.replaceChildren(name, tick);
    if (HAS_POSTER.has(theme.k)) {
      const art = document.createElement("img");
      art.src = `art/${theme.k}.webp`;
      art.alt = "";
      art.width = 360;
      art.height = 152;
      const frame = document.createElement("span");
      frame.className = "theme-tile-art";
      frame.setAttribute("aria-hidden", "true");
      frame.append(art);
      button.prepend(frame);
    }
  });

  /* ---------- картка ---------- */
  const posterHTML = (m, cls, priority = false) =>
    `<div class="poster ${cls}" style="--c:var(--t-${m.themes[0]})" ` +
    `data-letter="${esc(m.title.trim()[0])}">` +
    (HAS_POSTER.has(m.id)
      ? `<img src="${esc(m.poster)}" alt="" ${priority ? 'fetchpriority="high"' : 'loading="lazy"'} onerror="posterFail(this)">`
      : "") +
    `</div>`;

  const cardHTML = (m, index) => {
    return (
      `<article class="card" style="--c:var(--t-${m.themes[0]})">` +
      posterHTML(m, "poster-card", index < 3) +
      `<div class="poster-badges"><span>${m.ageMin}+</span><span><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>${esc(m.duration)}</span></div>` +
      `<button type="button" class="fav" data-fav="${esc(m.id)}" ` +
      `aria-pressed="${favs.has(m.id)}" ` +
      `aria-label="${favs.has(m.id) ? "Прибрати з обраного" : "Зберегти в обране"}">` +
      `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">` +
      `<path d="M12 20.3 4.3 12.6a4.6 4.6 0 0 1 0-6.5 4.6 4.6 0 0 1 6.5 0l1.2 1.2 1.2-1.2a4.6 4.6 0 1 1 6.5 6.5z"/>` +
      `</svg></button>` +
      `<div class="card-body">` +
      `<h3 class="card-title">${esc(m.title)}</h3>` +
      `<button type="button" class="card-open" data-open="${esc(m.id)}" ` +
      `aria-label="Детальніше про «${esc(m.title)}»">Детальніше <span aria-hidden="true">→</span></button>` +
      `</div></article>`
    );
  };

  /* ---------- модальне вікно ---------- */
  const modal = $("modal");
  const modalBody = $("modal-body");
  let lastFocus = null;

  const openModal = (id) => {
    const m = MOVIES.find((x) => x.id === id);
    if (!m) return;
    lastFocus = document.activeElement;
    modalBody.innerHTML =
      posterHTML(m, "poster-modal") +
      `<div class="modal-main">` +
      `<p class="modal-eyebrow">${esc(m.age)} · ${esc(FMT[m.format])}</p>` +
      `<h2 id="modal-title">${esc(m.title)}</h2>` +
      (m.originalTitle !== m.title ? `<p class="orig">${esc(m.originalTitle)}</p>` : "") +
      `<p class="modal-meta">${m.year} · ${esc(m.country)} · ${esc(m.duration)}</p>` +
      `<p class="modal-desc">${esc(m.description)}</p>` +
      `<section class="modal-value"><h3>Чим корисний мультфільм</h3><p>${esc(m.value)}</p></section>` +
      `<section class="modal-ask"><h3>Питання після перегляду</h3><p>${esc(m.question)}</p></section>` +
      `<div class="pills">` +
      m.categories.map((c) => `<span class="pill">${esc(c)}</span>`).join("") +
      m.themes.map((k) => `<a class="pill pill-theme" style="--tc:var(--t-${k})" ` +
        `href="temy/${THEME[k].slug}/">${esc(THEME[k].label)}</a>`).join("") +
      `</div>` +
      `<div class="modal-actions">` +
      m.watchLinks.map((l) =>
        `<a class="btn-primary" href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">` +
        `Дивитися на ${esc(l.name)}</a>`).join("") +
      `<button type="button" class="btn-ghost" data-fav="${esc(m.id)}" aria-pressed="${favs.has(m.id)}">` +
      `${favs.has(m.id) ? "✓ В обраному" : "♡ Зберегти"}</button>` +
      `<a class="btn-ghost" href="mult/${esc(m.id)}/">Повна сторінка</a>` +
      `</div>` +
      `<p class="modal-note">Посилання ведуть на пошук за назвою — каталоги сервісів ` +
      `змінюються щомісяця.</p>` +
      `</div>`;
    if (typeof modal.showModal === "function") modal.showModal();
    else modal.setAttribute("open", "");
    $("modal-close").focus();
  };

  const closeModal = () => {
    if (typeof modal.close === "function") modal.close();
    else modal.removeAttribute("open");
    if (lastFocus) lastFocus.focus();
  };

  $("modal-close").addEventListener("click", closeModal);
  modal.addEventListener("click", (ev) => {
    if (ev.target === modal) closeModal();   // клік по тлу
  });
  modal.addEventListener("cancel", () => {   // Esc
    if (lastFocus) setTimeout(() => lastFocus.focus(), 0);
  });

  /* ---------- обране: перемикання ---------- */
  const toggleFav = (id) => {
    favs.has(id) ? favs.delete(id) : favs.add(id);
    saveFavs();
    $("fav-count").textContent = favs.size;
    render();
    if (modal.open) openModal(id);
  };

  document.addEventListener("click", (ev) => {
    const fav = ev.target.closest("[data-fav]");
    if (fav) { toggleFav(fav.dataset.fav); return; }
    const open = ev.target.closest("[data-open]");
    if (open) {
      ev.preventDefault();          // у добірці це справжнє посилання — лишаємо його для пошуковиків
      openModal(open.dataset.open);
    }
  });

  /* ---------- панель ---------- */
  $("search-form").addEventListener("submit", (event) => {
    event.preventDefault();
    $("program-title").scrollIntoView({ block: "start" });
  });
  $("q").addEventListener("input", (ev) => { state.q = ev.target.value.trim(); render(); });

  document.querySelectorAll(".tabs button").forEach((b) => {
    b.addEventListener("click", () => {
      state.tab = b.dataset.tab;
      document.querySelectorAll(".tabs button").forEach((x) =>
        x.setAttribute("aria-pressed", String(x === b)));
      render();
    });
  });

  const resetAll = () => {
    state.q = "";
    [state.age, state.cat, state.fmt, state.theme, state.service].forEach((s) => s.clear());
    $("q").value = "";
    render();
  };
  $("reset").addEventListener("click", resetAll);
  $("reset-empty").addEventListener("click", resetAll);

  $("random").addEventListener("click", () => {
    const list = filtered();
    if (!list.length) return;
    openModal(list[Math.floor(Math.random() * list.length)].id);
  });

  /* ---------- рендер ---------- */
  function render() {
    const list = filtered();
    const n = list.length;

    $("count").textContent =
      state.tab === "fav" && !n && !anyFilter()
        ? "В обраному поки порожньо — натисніть сердечко на картці"
        : `Знайдено: ${n} ${plural(n, "мультфільм", "мультфільми", "мультфільмів")}`;

    $("reset").hidden = !anyFilter();
    allThemes.setAttribute("aria-pressed", !state.theme.size);
    filterButtons.forEach(({ button, set, value }) =>
      button.setAttribute("aria-pressed", set.has(value)));
    quickFilters.forEach(({ id, set, empty }) => {
      const label = $(id).parentElement.querySelector(".filter-value");
      const selected = filterButtons.find((entry) => entry.set === set && set.has(entry.value));
      label.textContent = set.size > 1 ? `Обрано: ${set.size}` : selected?.button.textContent || empty;
    });
    $("empty").hidden = n > 0 || (state.tab === "fav" && !anyFilter());
    $("grid").innerHTML = list.map(cardHTML).join("");
    $("fav-count").textContent = favs.size;
  }

  /* заглушка для картинки, якої ще немає */
  window.posterFail = (img) => { img.remove(); };

  render();
})();
