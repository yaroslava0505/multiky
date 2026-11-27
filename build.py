#!/usr/bin/env python3
"""Генератор статичного сайту «Мультфільми за темами».

Читає data.json і src/style.css, складає готові HTML-сторінки в docs/.
Нічого доінсталювати не треба — лише Python 3.

    python3 build.py

Щоб додати мультфільм: допишіть обʼєкт у масив "items" у data.json і запустіть збірку.
Адресу сайту задайте у SITE_URL — від неї залежать canonical і sitemap.xml.
"""
import io, json, os, re, shutil, html
from datetime import date

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, "docs")
SITE_URL = "https://yaroslava0505.github.io/multiky"  # без / в кінці
SITE_NAME = "Мультфільми за темами"
FONTS = ("https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;"
         "12..96,700;12..96,800&family=Spectral:ital,wght@0,400;0,600;1,400&"
         "family=IBM+Plex+Mono:wght@400;500&display=swap")

def load_data_js():
    """data.js — єдине джерело даних. Дістаємо з нього два JSON-літерали."""
    src = io.open(os.path.join(ROOT, "src", "data.js"), encoding="utf-8").read()
    def grab(name):
        start = src.index("const %s = " % name) + len("const %s = " % name)
        end = src.index("\n;", start) if "\n;" in src[start:start + 10] else None
        depth, i = 0, start
        while i < len(src):
            if src[i] in "[{":
                depth += 1
            elif src[i] in "]}":
                depth -= 1
                if depth == 0:
                    return json.loads(src[start:i + 1])
            i += 1
        raise ValueError("не вдалося розібрати " + name)
    return grab("CATALOG_META"), grab("MOVIES")


def available_posters():
    art = os.path.join(ROOT, "src", "art")
    if not os.path.isdir(art):
        return set()
    return {os.path.splitext(f)[0] for f in os.listdir(art) if f.endswith(".webp")}


POSTERS = available_posters()
META, MOVIES = load_data_js()
THEMES = META["themes"]
SERVICES = META["services"]

# генератор сторінок працює зі старими короткими ключами — перекладаємо
ITEMS = [{
    "slug": m["id"], "t": m["title"], "o": m["originalTitle"], "y": m["year"],
    "co": m["country"], "f": "series" if m["format"] in ("short", "series") else "film",
    "d": m["duration"], "age": m["ageMin"], "th": m["themes"], "desc": m["description"],
    "more": m["value"], "ask": m["question"], "sv": m["service"], "poster": m["poster"],
} for m in MOVIES]
TH = {t["k"]: t for t in THEMES}
pages = []  # (шлях, пріоритет) для sitemap


def e(s):
    return html.escape(str(s), quote=True)


def plural(n):
    a, b = n % 10, n % 100
    if a == 1 and b != 11:
        return "назва"
    if 2 <= a <= 4 and not (12 <= b <= 14):
        return "назви"
    return "назв"


def theme_count(k):
    return sum(1 for i in ITEMS if k in i["th"])


def head(title, desc, prefix, path, extra=""):
    canon = SITE_URL.rstrip("/") + "/" + path if "ЗАМІНІТЬ" not in SITE_URL else ""
    tags = [
        '<!doctype html>',
        '<html lang="uk">',
        '<head>',
        '<meta charset="utf-8">',
        '<meta name="viewport" content="width=device-width, initial-scale=1">',
        f'<title>{e(title)}</title>',
        f'<meta name="description" content="{e(desc)}">',
        f'<meta property="og:title" content="{e(title)}">',
        f'<meta property="og:description" content="{e(desc)}">',
        '<meta property="og:type" content="website">',
        f'<meta property="og:site_name" content="{e(SITE_NAME)}">',
        '<meta property="og:locale" content="uk_UA">',
    ]
    if canon:
        tags += [f'<link rel="canonical" href="{e(canon)}">',
                 f'<meta property="og:url" content="{e(canon)}">']
    tags += [
        '<link rel="preconnect" href="https://fonts.googleapis.com">',
        '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
        f'<link rel="stylesheet" href="{FONTS}">',
        f'<link rel="stylesheet" href="{prefix}style.css?v=premiere">',
        '<link rel="icon" href="data:image/svg+xml,'
        '%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 32 32%22%3E'
        '%3Ctext y=%2226%22 font-size=%2228%22%3E%F0%9F%8E%AC%3C/text%3E%3C/svg%3E">',
        extra,
        '</head>',
        '<body>',
    ]
    return "\n".join(t for t in tags if t)


def bar(prefix, current=""):
    nav = [("Каталог", prefix + "index.html" if prefix else "index.html", "home"),
           ("Про каталог", prefix + "pro/", "pro")]
    parts = []
    for t, u, k in nav:
        cur = ' aria-current="page"' if k == current else ''
        parts.append('<a href="%s"%s>%s</a>' % (e(u), cur, e(t)))
    links = "".join(parts)
    home = prefix if prefix else "./"
    icon = (
        '<svg viewBox="0 0 40 40" aria-hidden="true" fill="currentColor">'
        '<path d="M4 15 34 5l-2-5L2 10zM3 17h34v18a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3z"/>'
        '<path d="m16 22 10 6-10 6z" fill="#fff8ee"/>'
        '</svg>' if current == "home" else ""
    )
    brand = f'{icon}<span>Мультфільми<br>за темами</span>' if icon else 'Мультфільми <span>за темами</span>'
    return (f'<div class="bar"><div class="wrap">'
            f'<a class="brand" href="{e(home)}">{brand}</a>'
            f'<nav>{links}</nav></div></div>')


def site_footer(prefix):
    return (f'<footer class="site"><div class="wrap">'
            f'<p>Каталог для батьків і вихователів: 42 мультфільми й серіали, '
            f'посортовані за темами. Вік — орієнтир, а не правило.</p>'
            f'<p><a href="{e(prefix)}pro/">Як складений каталог і де це дивитися в Україні</a></p>'
            f'</div></footer>')


def theme_rail(prefix, active_slug=None, as_links=True):
    rows = []
    for t in THEMES:
        attrs = f'style="--c:var(--t-{t["k"]})"'
        if as_links:
            cur = ' aria-current="page"' if t["slug"] == active_slug else ""
            rows.append(f'<a class="theme-btn" {attrs}{cur} href="{prefix}temy/{t["slug"]}/">'
                        f'<span class="dot"></span><span>{e(t["label"])}</span>'
                        f'<span class="n">{theme_count(t["k"])}</span></a>')
        else:
            rows.append(f'<button type="button" class="theme-btn" {attrs} aria-pressed="false" '
                        f'data-k="{t["k"]}"><img src="art/{t["k"]}.webp" alt="" width="360" height="152">'
                        f'<span class="theme-name"><span>{e(t["label"])}</span>'
                        f'<span class="n">{theme_count(t["k"])}</span></span></button>')
    return "\n".join(rows)


def meta_line(it):
    return (f'<p class="meta"><span>{it["y"]}</span><span>·</span><span>{e(it["co"])}</span>'
            f'<span>·</span><span>{e(it["d"])}</span><span>·</span>'
            f'<span class="age">{it["age"]}+</span></p>')


def tags_line(it, prefix):
    out = []
    for k in it["th"]:
        t = TH[k]
        out.append(f'<a class="tag" style="--tc:var(--t-{k})" href="{prefix}temy/{t["slug"]}/">'
                   f'{e(t["label"])}</a>')
    return '<div class="tags">' + "".join(out) + "</div>"


def where_line(it):
    sv = SERVICES[it["sv"]]
    return (f'<p class="where"><span>Де шукати</span><b>{e(sv["n"])}</b>'
            f'<i>{e(sv["note"])}</i></p>')


def card(it, prefix, tag="h2"):
    main = it["th"][0]
    orig = (f'<p class="orig">{e(it["o"])}</p>') if it["o"] != it["t"] else ""
    poster = (
        f'<a class="theme-poster" href="{prefix}mult/{e(it["slug"])}/" tabindex="-1" aria-hidden="true">'
        f'<img src="{prefix}{e(it["poster"])}" alt="" loading="lazy"></a>'
        if it["slug"] in POSTERS else ""
    )
    return (f'<article class="item" style="--c:var(--t-{main})">'
            f'{poster}{meta_line(it)}'
            f'<{tag} class="t"><a href="{prefix}mult/{it["slug"]}/">{e(it["t"])}</a></{tag}>'
            f'{orig}'
            f'<p class="desc">{e(it["desc"])}</p>'
            f'{tags_line(it, prefix)}'
            f'{where_line(it)}'
            f'<p class="ask"><span>Питання після перегляду</span>{e(it["ask"])}</p>'
            f'</article>')


def write(path, content):
    full = os.path.join(OUT, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "w", encoding="utf-8") as f:
        f.write(content)


# ---------------------------------------------------------------- головна
def build_home():
    shell = io.open(os.path.join(ROOT, "src", "index.html"), encoding="utf-8").read()
    shell = shell.replace("__BAR__", bar("", "home")).replace("__FOOTER__", site_footer(""))
    body = head(
        "Мультфільми за темами — каталог для батьків",
        "42 мультфільми й серіали з пошуком і фільтрами за віком, темою та форматом: "
        "чим корисний кожен, де легально дивитися в Україні та що спитати після перегляду.",
        "", "",
        extra='<script>window.POSTERS=%s</script>' % json.dumps(sorted(POSTERS))) + "\n" + shell + "\n</body>\n</html>\n"
    write("index.html", body)
    pages.append(("", "1.0"))


# ---------------------------------------------------------------- сторінка теми
def build_theme(t):
    sel = sorted([i for i in ITEMS if t["k"] in i["th"]], key=lambda x: (x["age"], x["t"]))
    n = len(sel)
    title = f'Мультфільми про {t["gen"]} — {n} {plural(n)} з віком і де дивитися'
    desc = f'{n} мультфільмів і серіалів про {t["gen"]}: вік, тривалість, сервіс для України ' \
           f'і питання для розмови після перегляду.'
    body = f"""{head(title, desc, "../../", f'temy/{t["slug"]}/')}
{bar("../../")}
<div class="wrap">
<header class="page-head">
  <p class="eyebrow"><a href="../../">Каталог</a> · тема</p>
  <h1>Мультфільми про <em>{e(t["gen"])}</em></h1>
  <p class="lede">{e(t["intro"])}</p>
</header>
<div class="shell">
  <nav class="rail" aria-label="Теми">
    <p class="rail-title">Інші теми</p>
    <div class="theme-list">
{theme_rail("../../", active_slug=t["slug"])}
    </div>
  </nav>
  <section>
    <p class="count">{n} {plural(n)} · від {min(i["age"] for i in sel)}+ до {max(i["age"] for i in sel)}+</p>
    <div class="grid">
{chr(10).join(card(i, "../../") for i in sel)}
    </div>
  </section>
</div>
</div>
{site_footer("../../")}
</body>
</html>
"""
    write(f'temy/{t["slug"]}/index.html', body)
    pages.append((f'temy/{t["slug"]}/', "0.9"))


# ---------------------------------------------------------------- сторінка мультфільму
def build_item(it):
    main = TH[it["th"][0]]
    sv = SERVICES[it["sv"]]
    kind = "Серіал" if it["f"] == "series" else "Мультфільм"
    title = f'{it["t"]} ({it["y"]}) — про що і з якого віку'
    desc = it["desc"][:155]
    schema = {
        "@context": "https://schema.org",
        "@type": "TVSeries" if it["f"] == "series" else "Movie",
        "name": it["t"],
        "alternateName": it["o"],
        "datePublished": str(it["y"]),
        "countryOfOrigin": it["co"],
        "inLanguage": "uk",
        "genre": ["Animation"] + [TH[k]["label"] for k in it["th"]],
        "description": it["desc"],
    }
    ld = ('<script type="application/ld+json">'
          + json.dumps(schema, ensure_ascii=False) + '</script>')
    others = [x for x in ITEMS if x["slug"] != it["slug"] and it["th"][0] in x["th"]]
    others = sorted(others, key=lambda x: abs(x["age"] - it["age"]))[:3]
    also = ""
    if others:
        also = (f'<section class="also"><h2>Ще про {e(main["gen"])}</h2><div class="also-grid">'
                + "".join(
                    f'<article style="--c:var(--t-{o["th"][0]})">{meta_line(o)}'
                    f'<h3 class="t"><a href="../{o["slug"]}/">{e(o["t"])}</a></h3>'
                    f'<p class="desc">{e(o["desc"])}</p></article>' for o in others)
                + '</div></section>')
    orig = f'<p class="orig">{e(it["o"])}</p>' if it["o"] != it["t"] else ""
    poster_img = (f'<img src="../../{e(it["poster"])}" alt="" loading="lazy" '
                  f'onerror="this.remove()">') if it["slug"] in POSTERS else ""
    body = f"""{head(title, desc, "../../", f'mult/{it["slug"]}/', extra=ld)}
{bar("../../")}
<div class="wrap">
<header class="page-head">
  <p class="eyebrow"><a href="../../">Каталог</a> · <a href="../../temy/{main["slug"]}/">{e(main["label"])}</a> · {kind.lower()}</p>
  <h1>{e(it["t"])}</h1>
  {orig}
</header>
<div class="detail">
  <div class="body">
    <p class="first">{e(it["desc"])}</p>
    <p>{e(it["more"])}</p>
    {tags_line(it, "../../")}
    <div class="askbox" style="--c:var(--t-{it["th"][0]})">
      <span>Питання після перегляду</span>
      <p>{e(it["ask"])}</p>
    </div>
  </div>
  <aside class="card">
    <div class="poster poster-detail" style="--c:var(--t-{it["th"][0]})"
      data-letter="{e(it["t"].strip()[0])}">
      {poster_img}
    </div>
    <h2>Коротко</h2>
    <dl class="facts">
      <dt>Рік</dt><dd>{it["y"]}</dd>
      <dt>Країна</dt><dd>{e(it["co"])}</dd>
      <dt>Формат</dt><dd>{kind}</dd>
      <dt>Триває</dt><dd>{e(it["d"])}</dd>
      <dt>Вік</dt><dd>{it["age"]}+ (орієнтир)</dd>
    </dl>
    <div class="watch">
      <h2>Де дивитися в Україні</h2>
      <b>{e(sv["n"])}</b>
      <i>{e(sv["note"])}</i>
    </div>
  </aside>
</div>
{also}
</div>
{site_footer("../../")}
</body>
</html>
"""
    write(f'mult/{it["slug"]}/index.html', body)
    pages.append((f'mult/{it["slug"]}/', "0.8"))


# ---------------------------------------------------------------- про каталог
def build_about():
    rows = {}
    for i in ITEMS:
        rows.setdefault(SERVICES[i["sv"]]["g"], []).append(i)
    names = {"ua": "sweet.tv або Megogo", "nf": "Netflix", "atv": "Apple TV",
             "free": "YouTube, безкоштовно", "rent": "Прокат поштучно"}
    svc_list = "".join(
        f'<li><b>{e(names[g])}</b> — {len(v)} назв: '
        + ", ".join(e(x["t"]) for x in sorted(v, key=lambda x: x["t"])[:6])
        + ("…" if len(v) > 6 else "") + "</li>"
        for g, v in sorted(rows.items(), key=lambda kv: -len(kv[1])))
    body = f"""{head("Про каталог — як він складений і де дивитися в Україні",
        "Як відібрані мультфільми, що означає вік у каталозі та на яких сервісах це легально "
        "доступно в Україні: sweet.tv, Megogo, Netflix, Apple TV.", "../", "pro/")}
{bar("../", "pro")}
<div class="wrap">
<header class="page-head">
  <p class="eyebrow"><a href="../">Каталог</a> · про проєкт</p>
  <h1>Як складений цей каталог</h1>
  <p class="lede">Коротко про принцип відбору, про те, що означає вік у карточках,
  і про те, де мультфільми легально доступні українському глядачеві.</p>
</header>
<div class="prose">
  <h2>Принцип відбору</h2>
  <p>У каталозі немає рейтингів і немає «найкращих мультфільмів усіх часів». Є один критерій:
  після цієї історії з дитиною можна поговорити про щось важливе — і буде про що. Тому тем вісім,
  а не двадцять, і кожна назва має не більше трьох тем: та, що стоїть першою, — головна,
  вона й задає колір картки.</p>
  <p>Теми позначені так, як їх бачить дитина, а не як їх описує студія. «Вперед і вгору»
  формально пригода, фактично — розмова про втрату. «Енканто» формально мюзикл про магію,
  фактично — про тиск очікувань у родині.</p>

  <h2>Що означає вік</h2>
  <p>Вік у картці — орієнтир, а не правило. Він враховує не складність мови, а силу емоційних
  сцен: дитина, яка легко лякається, і в шість років може не бути готова до «Коко», а інша
  спокійно подивиться у чотири. Для назв із напруженими епізодами це сказано прямо в описі
  на сторінці мультфільму.</p>
  <p>Тривалість серіалів указана на одну серію — це допомагає планувати вечір, коли
  домовленість «одна серія» має залишитися домовленістю.</p>

  <h2>Питання після перегляду</h2>
  <p>До кожної назви є одне питання. Воно сформульоване так, щоб не перевіряти, чи дитина
  зрозуміла сюжет, а щоб запросити її говорити про себе. Питати краще не одразу після фінальних
  титрів, а трохи згодом — за вечерею або перед сном.</p>

  <h2>Де це дивитися в Україні</h2>
  <p><b>Disney+ в Україні офіційно не працює</b>, тому мультфільми Disney і Pixar шукайте на
  <b>sweet.tv</b> — у сервісу прямий контракт із Disney на територію України, і український
  дубляж входить у підписку — або на <b>Megogo</b>, який продовжив контракт із Disney
  у 2025 році.</p>
  <p><b>Netflix</b> працює в Україні, має український інтерфейс і права на всю бібліотеку
  Studio Ghibli поза США, Канадою та Японією. Але український дубляж там є не в кожної назви —
  часто це англійська мова з субтитрами.</p>
  <p><b>Apple TV</b> з вересня 2026 входить у будь-який платний план iCloud+, від $0.99 на місяць;
  окремою підпискою його в Україні не продають.</p>
  <ul>{svc_list}</ul>
  <p>Доступність змінюється щомісяця. Перед переглядом конкретної назви варто перевірити її
  на justwatch.com/ua — він показує всі легальні сервіси для України одним списком. Піратські
  сайти з «безкоштовно онлайн» не раджу: там немає стабільного українського дубляжу й повно
  рекламних вікон, на які дитина натисне раніше за вас.</p>

  <h2>Як доповнити каталог</h2>
  <p>Усі дані лежать в одному файлі <b>data.json</b>: вісім тем і масив назв. Щоб додати
  мультфільм, допишіть обʼєкт у «items» і запустіть <b>python3 build.py</b> — сторінки,
  перелінковка між темами і sitemap перезберуться самі.</p>
</div>
</div>
{site_footer("../")}
</body>
</html>
"""
    write("pro/index.html", body)
    pages.append(("pro/", "0.6"))


def build_404():
    body = f"""{head("Сторінку не знайдено", "Такої сторінки немає.", "", "404.html")}
{bar("")}
<div class="wrap">
<header class="page-head">
  <p class="eyebrow">404</p>
  <h1>Такої сторінки <em>немає</em></h1>
  <p class="lede">Можливо, адреса змінилася. Повний каталог —
  <a href="./">на головній</a>.</p>
</header>
</div>
{site_footer("")}
</body>
</html>
"""
    write("404.html", body)


def build_sitemap():
    if "ЗАМІНІТЬ" in SITE_URL:
        print("  ! SITE_URL не задано — sitemap.xml і canonical пропущено")
        return
    base = SITE_URL.rstrip("/")
    today = date.today().isoformat()
    urls = "".join(
        f'<url><loc>{base}/{p}</loc><lastmod>{today}</lastmod>'
        f'<priority>{pr}</priority></url>' for p, pr in pages)
    write("sitemap.xml",
          '<?xml version="1.0" encoding="UTF-8"?>\n'
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
          + urls + '</urlset>')
    write("robots.txt", f"User-agent: *\nAllow: /\nSitemap: {base}/sitemap.xml\n")


def main():
    if os.path.isdir(OUT):
        shutil.rmtree(OUT)
    os.makedirs(OUT)
    for f in ("style.css", "data.js", "app.js"):
        shutil.copy(os.path.join(ROOT, "src", f), os.path.join(OUT, f))
    art = os.path.join(ROOT, "src", "art")
    if os.path.isdir(art):
        shutil.copytree(art, os.path.join(OUT, "art"))
    open(os.path.join(OUT, ".nojekyll"), "w").close()
    build_home()
    for t in THEMES:
        build_theme(t)
    for i in ITEMS:
        build_item(i)
    build_about()
    build_404()
    build_sitemap()
    print(f"  готово: {len(THEMES)} сторінок тем, {len(ITEMS)} сторінок мультфільмів, "
          f"головна, «про каталог», 404 → docs/")


if __name__ == "__main__":
    main()
