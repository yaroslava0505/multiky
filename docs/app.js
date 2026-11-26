/* Каталог мультфільмів — пошук, фільтри, обране, модальне вікно.
   Чистий Vanilla JS (ES6+), без залежностей. Дані — у data.js. */
(() => {
  "use strict";

  const META = window.CATALOG_META;
  const MOVIES = window.MOVIES;
  const THEME = Object.fromEntries(META.themes.map((t) => [t.k, t]));
  const FMT = Object.fromEntries(META.formats.map((f) => [f.k, f.label]));
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
    state.q || state.age.size || state.cat.size || state.fmt.size || state.theme.size;

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
      if (state.cat.size && ![...state.cat].every((c) => m.categories.includes(c))) return false;
      if (state.fmt.size && !state.fmt.has(m.format)) return false;
      if (state.theme.size && ![...state.theme].every((k) => m.themes.includes(k))) return false;
      return matchSearch(m);
    }).sort((a, b) => a.ageMin - b.ageMin || a.title.localeCompare(b.title, "uk"));

  /* ---------- побудова фільтрів ---------- */
  const chip = (label, set, value, box) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chip";
    b.textContent = label;
    b.setAttribute("aria-pressed", "false");
    b.addEventListener("click", () => {
      set.has(value) ? set.delete(value) : set.add(value);
      b.setAttribute("aria-pressed", set.has(value) ? "true" : "false");
      render();
    });
    box.appendChild(b);
  };

  META.ageGroups.forEach((g) => chip(g, state.age, g, $("f-age")));
  META.categories.forEach((c) => chip(c, state.cat, c, $("f-cat")));
  META.formats.forEach((f) => chip(f.label, state.fmt, f.k, $("f-fmt")));

  META.themes.forEach((t) => {
    const n = MOVIES.filter((m) => m.themes.includes(t.k)).length;
    const b = document.createElement("button");
    b.type = "button";
    b.className = "theme-btn";
    b.style.setProperty("--c", `var(--t-${t.k})`);
    b.setAttribute("aria-pressed", "false");
    b.innerHTML =
      (HAS_POSTER.has(t.k)
        ? `<img src="art/${t.k}.webp" alt="" width="360" height="152" loading="lazy"` +
          ` onerror="posterFail(this)">`
        : "") +
      `<span class="theme-name"><span>${esc(t.label)}</span><span class="n">${n}</span></span>`;
    b.addEventListener("click", () => {
      state.theme.has(t.k) ? state.theme.delete(t.k) : state.theme.add(t.k);
      b.setAttribute("aria-pressed", state.theme.has(t.k) ? "true" : "false");
      render();
    });
    $("f-theme").appendChild(b);
  });

  /* ---------- картка ---------- */
  const posterHTML = (m, cls) =>
    `<div class="poster ${cls}" style="--c:var(--t-${m.themes[0]})" ` +
    `data-letter="${esc(m.title.trim()[0])}">` +
    (HAS_POSTER.has(m.id)
      ? `<img src="${esc(m.poster)}" alt="" loading="lazy" onerror="posterFail(this)">`
      : "") +
    `</div>`;

  const cardHTML = (m) => {
    const cats = m.categories.slice(0, 2).map((c) => `<span class="pill">${esc(c)}</span>`).join("");
    const rest = m.categories.length > 2 ? `<span class="pill pill-more">+${m.categories.length - 2}</span>` : "";
    return (
      `<article class="card" style="--c:var(--t-${m.themes[0]})">` +
      posterHTML(m, "poster-card") +
      `<span class="badge">${esc(m.age)}</span>` +
      `<button type="button" class="fav" data-fav="${esc(m.id)}" ` +
      `aria-pressed="${favs.has(m.id)}" ` +
      `aria-label="${favs.has(m.id) ? "Прибрати з обраного" : "Зберегти в обране"}">` +
      `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">` +
      `<path d="M12 20.3 4.3 12.6a4.6 4.6 0 0 1 0-6.5 4.6 4.6 0 0 1 6.5 0l1.2 1.2 1.2-1.2a4.6 4.6 0 1 1 6.5 6.5z"/>` +
      `</svg></button>` +
      `<div class="card-body">` +
      `<h3 class="card-title"><button type="button" class="card-open" data-open="${esc(m.id)}">` +
      `${esc(m.title)}</button></h3>` +
      `<p class="card-meta">${m.year} · ${esc(m.duration)}</p>` +
      `<div class="pills">${cats}${rest}</div>` +
      `</div></article>`
    );
  };

  /* ---------- добірка «Кінопрограма» ---------- */
  // показуємо, поки не ввімкнено жодного фільтра; беремо те, для чого є картинка
  const withArt = MOVIES.filter((m) => HAS_POSTER.has(m.id));
  const SELECTION = [
    ["Короткі серії", withArt.filter((m) => m.format !== "full").slice(0, 3)],
    ["Повнометражні фільми", withArt.filter((m) => m.format === "full").slice(0, 3)],
  ].filter(([, list]) => list.length);

  $("selection").innerHTML = SELECTION.map(([title, list]) =>
    `<div><h3>${esc(title)}</h3><ul>` +
    list.map((m) =>
      `<li><a href="mult/${esc(m.id)}/" data-open="${esc(m.id)}">` +
      `<img src="${esc(m.poster)}" alt="" width="234" height="123" loading="lazy" ` +
      `onerror="posterFail(this)">` +
      `<strong>${esc(m.title)}</strong>` +
      `<small>${esc(m.age)} · ${esc(m.duration)}</small></a></li>`).join("") +
    `</ul></div>`).join("");

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
    [state.age, state.cat, state.fmt, state.theme].forEach((s) => s.clear());
    $("q").value = "";
    document.querySelectorAll(".chip, .theme-btn").forEach((b) =>
      b.setAttribute("aria-pressed", "false"));
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
    $("selection").hidden = Boolean(anyFilter() || state.tab !== "all");
    $("empty").hidden = n > 0 || (state.tab === "fav" && !anyFilter());
    $("grid").innerHTML = list.map(cardHTML).join("");
    $("fav-count").textContent = favs.size;
  }

  /* заглушка для картинки, якої ще немає */
  window.posterFail = (img) => { img.remove(); };

  render();
})();
