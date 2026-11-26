/* Дані каталогу. Єдине місце, де додаються мультфільми.
 *
 * Щоб додати новий — скопіюйте будь-який обʼєкт у MOVIES і замініть значення.
 * Обовʼязкові поля: id (латиницею, стане адресою сторінки), title, originalTitle,
 * poster, age, ageMin, format, duration, categories, themes, description, value,
 * question, service, watchLinks.
 *
 * Картинку кладіть у src/art/<id>.webp. Якщо файлу немає, картка покаже
 * охайну заглушку з кольором теми — сайт не зламається.
 *
 * Після змін запустіть:  python3 build.py
 */

const CATALOG_META = {
  "themes": [
    {
      "k": "friend",
      "slug": "druzhba",
      "label": "Дружба",
      "gen": "дружбу",
      "intro": "Дружба в мультфільмах майже ніколи не починається з симпатії. Вона починається з того, що двоє змушені щось робити разом і раптом помічають, що поодинці не вийде. Ці назви добре працюють, коли дитина свариться з другом, ревнує до нового однокласника або вперше чує «я з тобою не граюся»."
    },
    {
      "k": "help",
      "slug": "pidtrymka",
      "label": "Підтримка і допомога",
      "gen": "підтримку",
      "intro": "Підтримка — це не «не плач» і не «все буде добре». У цих історіях хтось просто залишається рядом, поки іншому погано, і не вимагає швидко повеселіти. Корисно показати дитині, якій важко попросити допомоги, і тій, яка хоче допомогти, але не знає як."
    },
    {
      "k": "feel",
      "slug": "emotsii",
      "label": "Емоції та як їх назвати",
      "gen": "емоції",
      "intro": "Дитина кричить не тому, що хоче вас дістати, а тому, що в неї всередині щось велике без назви. Ці мультфільми дають емоціям імена й форму — злості, соромові, тривозі, сумові — і показують, що жодна з них не поломка."
    },
    {
      "k": "kind",
      "slug": "dobrota",
      "label": "Доброта й турбота",
      "gen": "доброту",
      "intro": "Доброта тут не повчання, а механізм сюжету: хтось зробив щось хороше, і далі історія котиться сама. Такі назви добре вмикати ввечері — вони тихі, повільні й не залишають після себе збудження."
    },
    {
      "k": "brave",
      "slug": "smilist",
      "label": "Смілість і страхи",
      "gen": "смілість",
      "intro": "Смілість у цих історіях — не відсутність страху, а готовність іти далі зі страхом у руках. Тут є напружені сцени: перед переглядом варто зважити, наскільки легко ваша дитина лякається, і краще дивитися разом."
    },
    {
      "k": "family",
      "slug": "simya",
      "label": "Сімʼя і близькість",
      "gen": "сімʼю",
      "intro": "Сімʼя тут показана без глянцю: батьки помиляються, сварки бувають, брати й сестри бісять одне одного. Саме тому дитина себе в цьому впізнає — і саме тому після перегляду з нею легше говорити про вашу власну родину."
    },
    {
      "k": "self",
      "slug": "buty-soboyu",
      "label": "Бути собою",
      "gen": "право бути собою",
      "intro": "Про тих, хто не вписується: не така форма, не той вид, не ті вміння, не ті очікування родини. Ці мультфільми варто вмикати, коли дитина чує про себе «ти якийсь не такий» — від однолітків або від дорослих."
    },
    {
      "k": "loss",
      "slug": "vtrata",
      "label": "Втрата і прощання",
      "gen": "втрату",
      "intro": "Найскладніша тема й найчесніші мультфільми. Вони не вдають, що смерті немає, і не залишають дитину наодинці з цим. Дивитися варто разом і без поспіху: після таких історій майже завжди зʼявляються питання."
    }
  ],
  "services": {
    "swd": {
      "n": "sweet.tv або Megogo",
      "note": "ліцензія Disney · український дубляж",
      "g": "ua"
    },
    "swdw": {
      "n": "sweet.tv або Megogo",
      "note": "DreamWorks · український дубляж",
      "g": "ua"
    },
    "uafilm": {
      "n": "Megogo, sweet.tv",
      "note": "українське виробництво",
      "g": "ua"
    },
    "nfx": {
      "n": "Netflix",
      "note": "працює в Україні, український інтерфейс",
      "g": "nf"
    },
    "nfg": {
      "n": "Netflix",
      "note": "бібліотека Ghibli · українського дубляжу може не бути",
      "g": "nf"
    },
    "atv": {
      "n": "Apple TV",
      "note": "входить у платний iCloud+, від $0.99 на місяць",
      "g": "atv"
    },
    "yt": {
      "n": "YouTube, канал PBS Kids",
      "note": "безкоштовно, англійською",
      "g": "free"
    },
    "rent": {
      "n": "Прокат: Megogo, Apple TV",
      "note": "часто лише з субтитрами",
      "g": "rent"
    }
  },
  "categories": [
    "Розвиваючі",
    "Емоційний інтелект",
    "Пригоди",
    "Про тварин",
    "Про техніку",
    "Казки",
    "Українські"
  ],
  "ageGroups": [
    "0–3 роки",
    "3–6 років",
    "6–9 років",
    "9+ років",
    "Для всієї родини"
  ],
  "formats": [
    {
      "k": "short",
      "label": "Короткі серії (до 10 хв)"
    },
    {
      "k": "series",
      "label": "Серіал (10–25 хв)"
    },
    {
      "k": "full",
      "label": "Повнометражний"
    }
  ]
};

const MOVIES = [
  {
    "id": "bluey",
    "title": "Блуї",
    "originalTitle": "Bluey",
    "poster": "art/bluey.webp",
    "year": 2018,
    "country": "Австралія",
    "age": "0–3 роки",
    "ageMin": 2,
    "family": true,
    "format": "short",
    "duration": "7 хв / серія",
    "categories": [
      "Розвиваючі",
      "Емоційний інтелект",
      "Про тварин"
    ],
    "themes": [
      "family",
      "feel",
      "kind"
    ],
    "description": "Семихвилинні історії про гру двох сестер і тата, який грається всерйоз. Найточніший мультик про те, як виглядає підтримка в побуті.",
    "value": "Ідеальний варіант для найменших: короткі серії, жодного злодія, конфлікти вирішуються всередині сімʼї за сім хвилин. Дорослим корисно не менше, ніж дітям — тут видно, як розмовляти з дитиною, не підвищуючи голосу.",
    "question": "У яку гру з Блуї ти хочеш, щоб ми зіграли сьогодні?",
    "service": "swd",
    "watchLinks": [
      {
        "name": "sweet.tv",
        "url": "https://sweet.tv/search?query=%D0%91%D0%BB%D1%83%D1%97"
      },
      {
        "name": "Megogo",
        "url": "https://megogo.net/ua/search-extended?q=%D0%91%D0%BB%D1%83%D1%97"
      }
    ]
  },
  {
    "id": "ostriv-paffin",
    "title": "Острів Паффін",
    "originalTitle": "Puffin Rock",
    "poster": "art/ostriv-paffin.webp",
    "year": 2015,
    "country": "Ірландія",
    "age": "0–3 роки",
    "ageMin": 2,
    "family": false,
    "format": "short",
    "duration": "7 хв / серія",
    "categories": [
      "Розвиваючі",
      "Про тварин"
    ],
    "themes": [
      "kind",
      "family"
    ],
    "description": "Тиха історія про пташку Уну, яка піклується про молодшого брата. Повільний темп, жодного конфлікту на підвищених тонах.",
    "value": "Один із небагатьох серіалів, після якого дитина не збуджена, а спокійна — підходить на вечір. Заодно це м'яка підготовка старшої дитини до появи молодшого.",
    "question": "Як Уна зрозуміла, що братикові потрібна допомога?",
    "service": "nfx",
    "watchLinks": [
      {
        "name": "Netflix",
        "url": "https://www.netflix.com/search?q=Puffin%20Rock"
      }
    ]
  },
  {
    "id": "deniel-tayher",
    "title": "Деніел Тайгер",
    "originalTitle": "Daniel Tiger’s Neighborhood",
    "poster": "art/deniel-tayher.webp",
    "year": 2012,
    "country": "США",
    "age": "0–3 роки",
    "ageMin": 3,
    "family": false,
    "format": "series",
    "duration": "25 хв / серія",
    "categories": [
      "Розвиваючі",
      "Емоційний інтелект",
      "Про тварин"
    ],
    "themes": [
      "feel",
      "help"
    ],
    "description": "Кожна серія вчить одній навичці: почекати, попросити допомоги, пережити розчарування. Пісенька-підказка повторюється, щоб дитина її запамʼятала.",
    "value": "Фактично практикум з емоційної регуляції у формі мультика: фраза з пісеньки потім працює в реальній ситуації як кнопка. Українського дубляжу немає — дивитися англійською на офіційному каналі PBS Kids.",
    "question": "Яку пісеньку Деніела ми можемо заспівати, коли ти сердишся?",
    "service": "yt",
    "watchLinks": [
      {
        "name": "YouTube",
        "url": "https://www.youtube.com/results?search_query=Daniel%20Tiger%E2%80%99s%20Neighborhood"
      }
    ]
  },
  {
    "id": "istoriya-ihrashok",
    "title": "Історія іграшок",
    "originalTitle": "Toy Story",
    "poster": "art/istoriya-ihrashok.webp",
    "year": 1995,
    "country": "США",
    "age": "0–3 роки",
    "ageMin": 3,
    "family": false,
    "format": "full",
    "duration": "81 хв",
    "categories": [
      "Пригоди",
      "Емоційний інтелект"
    ],
    "themes": [
      "friend",
      "feel"
    ],
    "description": "Улюблена іграшка ревнує до нової. Про те, що дружба починається там, де двоє перестають змагатися за одне місце.",
    "value": "Найкращий мультфільм про дитячу ревність — особливо якщо в родині зʼявилася друга дитина або в групі новенький. Темп спокійний, страшних сцен майже немає, крім сусіда Сіда.",
    "question": "Чому Вуді спочатку не любив Базза?",
    "service": "swd",
    "watchLinks": [
      {
        "name": "sweet.tv",
        "url": "https://sweet.tv/search?query=%D0%86%D1%81%D1%82%D0%BE%D1%80%D1%96%D1%8F%20%D1%96%D0%B3%D1%80%D0%B0%D1%88%D0%BE%D0%BA"
      },
      {
        "name": "Megogo",
        "url": "https://megogo.net/ua/search-extended?q=%D0%86%D1%81%D1%82%D0%BE%D1%80%D1%96%D1%8F%20%D1%96%D0%B3%D1%80%D0%B0%D1%88%D0%BE%D0%BA"
      }
    ]
  },
  {
    "id": "smitnykova-vantazhivka",
    "title": "Смітникова вантажівка",
    "originalTitle": "Trash Truck",
    "poster": "art/smitnykova-vantazhivka.webp",
    "year": 2020,
    "country": "США",
    "age": "0–3 роки",
    "ageMin": 3,
    "family": false,
    "format": "series",
    "duration": "25 хв / серія",
    "categories": [
      "Про техніку",
      "Розвиваючі"
    ],
    "themes": [
      "friend",
      "kind"
    ],
    "description": "Шестирічний Генк і його найкращий друг — величезна вантажівка. Дуже проста, дуже добра історія про щоденну дружбу.",
    "value": "Мінімум сюжетних поворотів, максимум спокою: кожна серія — маленька пригода у дворі. Добре працює для дітей, які люблять машини більше за принцес.",
    "question": "Що ви з другом любите робити разом найбільше?",
    "service": "nfx",
    "watchLinks": [
      {
        "name": "Netflix",
        "url": "https://www.netflix.com/search?q=Trash%20Truck"
      }
    ]
  },
  {
    "id": "moy-malenkyi-poni",
    "title": "Мій маленький поні: Дружба — це чудо",
    "originalTitle": "My Little Pony: Friendship Is Magic",
    "poster": "art/moy-malenkyi-poni.webp",
    "year": 2010,
    "country": "США",
    "age": "3–6 років",
    "ageMin": 4,
    "family": false,
    "format": "series",
    "duration": "22 хв / серія",
    "categories": [
      "Емоційний інтелект",
      "Про тварин",
      "Казки"
    ],
    "themes": [
      "friend",
      "help"
    ],
    "description": "Серіал, у якому дружба — буквально тема кожної серії: сварки, ревнощі, вибачення, уміння не кидати своїх.",
    "value": "Довгий, тож можна дивитися місяцями, і кожна серія закінчена. Сильна сторона — шість дуже різних характерів, у яких дитина легко знаходить себе.",
    "question": "Яка з поні найбільше схожа на тебе?",
    "service": "nfx",
    "watchLinks": [
      {
        "name": "Netflix",
        "url": "https://www.netflix.com/search?q=My%20Little%20Pony%3A%20Friendship%20Is%20Magic"
      }
    ]
  },
  {
    "id": "miy-susid-totoro",
    "title": "Мій сусід Тоторо",
    "originalTitle": "となりのトトロ",
    "poster": "art/miy-susid-totoro.webp",
    "year": 1988,
    "country": "Японія",
    "age": "3–6 років",
    "ageMin": 4,
    "family": false,
    "format": "full",
    "duration": "86 хв",
    "categories": [
      "Казки",
      "Емоційний інтелект"
    ],
    "themes": [
      "family",
      "kind",
      "brave"
    ],
    "description": "Дві сестри переїжджають у село, бо мама в лікарні. Страх і ніжність поруч, і лісовий дух, який просто є рядом, коли важко.",
    "value": "Майже без сюжету в звичному сенсі — це про відчуття, тому дітям, звиклим до швидких мультиків, перші хвилини можуть здатися нудними. Тема хвороби мами присутня тихо, але дитина її зчитує.",
    "question": "Що допомагало дівчаткам, коли вони сумували за мамою?",
    "service": "nfg",
    "watchLinks": [
      {
        "name": "Netflix",
        "url": "https://www.netflix.com/search?q=%E3%81%A8%E3%81%AA%E3%82%8A%E3%81%AE%E3%83%88%E3%83%88%E3%83%AD"
      }
    ]
  },
  {
    "id": "rybka-ponyo",
    "title": "Рибка Понйо",
    "originalTitle": "崖の上のポニョ",
    "poster": "art/rybka-ponyo.webp",
    "year": 2008,
    "country": "Японія",
    "age": "3–6 років",
    "ageMin": 4,
    "family": false,
    "format": "full",
    "duration": "101 хв",
    "categories": [
      "Казки",
      "Про тварин"
    ],
    "themes": [
      "friend",
      "kind"
    ],
    "description": "Хлопчик Сосуке знаходить рибку й обіцяє її захищати. Про обіцянку, яку дитина дає і дотримує.",
    "value": "Найдитячіший фільм Ghibli: яскравий, галасливий, з морем, що оживає. Є сцена великої хвилі й шторму — для вразливих дітей це найнапруженіший момент.",
    "question": "Сосуке пообіцяв піклуватися про Понйо. Чи складно дотримувати обіцянку?",
    "service": "nfg",
    "watchLinks": [
      {
        "name": "Netflix",
        "url": "https://www.netflix.com/search?q=%E5%B4%96%E3%81%AE%E4%B8%8A%E3%81%AE%E3%83%9D%E3%83%8B%E3%83%A7"
      }
    ]
  },
  {
    "id": "stilvoter",
    "title": "Стілвотер",
    "originalTitle": "Stillwater",
    "poster": "art/stilvoter.webp",
    "year": 2020,
    "country": "США",
    "age": "3–6 років",
    "ageMin": 4,
    "family": false,
    "format": "series",
    "duration": "25 хв / серія",
    "categories": [
      "Розвиваючі",
      "Емоційний інтелект",
      "Про тварин"
    ],
    "themes": [
      "feel",
      "kind"
    ],
    "description": "Панда-сусід допомагає трьом дітям заспокоїтися, коли ті сердяться, бояться або чекають. Практично медитація у вигляді мультика.",
    "value": "У кожній серії є вставна притча, намальована іншою технікою — вона й робить головну роботу. Корисно дітям, які погано переносять очікування і швидко закипають.",
    "question": "Що ти робиш, коли всередині надто шумно?",
    "service": "atv",
    "watchLinks": [
      {
        "name": "Apple TV",
        "url": "https://tv.apple.com/search?term=Stillwater"
      }
    ]
  },
  {
    "id": "korporatsiya-monstriv",
    "title": "Корпорація монстрів",
    "originalTitle": "Monsters, Inc.",
    "poster": "art/korporatsiya-monstriv.webp",
    "year": 2001,
    "country": "США",
    "age": "3–6 років",
    "ageMin": 4,
    "family": false,
    "format": "full",
    "duration": "92 хв",
    "categories": [
      "Пригоди",
      "Емоційний інтелект"
    ],
    "themes": [
      "friend",
      "kind",
      "brave"
    ],
    "description": "Монстр, який мав пугати дітей, стає опікуном маленької дівчинки. Заодно розвертає дитячий страх темряви з ніг на голову.",
    "value": "Рідкісний випадок, коли мультфільм лікує страх: монстри в шафі виявляються такими, що самі бояться дітей. Якщо дитина боїться темряви — це перший кандидат на перегляд.",
    "question": "Чому Салліван вирішив захищати Бу, хоча це було небезпечно?",
    "service": "swd",
    "watchLinks": [
      {
        "name": "sweet.tv",
        "url": "https://sweet.tv/search?query=%D0%9A%D0%BE%D1%80%D0%BF%D0%BE%D1%80%D0%B0%D1%86%D1%96%D1%8F%20%D0%BC%D0%BE%D0%BD%D1%81%D1%82%D1%80%D1%96%D0%B2"
      },
      {
        "name": "Megogo",
        "url": "https://megogo.net/ua/search-extended?q=%D0%9A%D0%BE%D1%80%D0%BF%D0%BE%D1%80%D0%B0%D1%86%D1%96%D1%8F%20%D0%BC%D0%BE%D0%BD%D1%81%D1%82%D1%80%D1%96%D0%B2"
      }
    ]
  },
  {
    "id": "kryzhane-sertse",
    "title": "Крижане серце",
    "originalTitle": "Frozen",
    "poster": "art/kryzhane-sertse.webp",
    "year": 2013,
    "country": "США",
    "age": "3–6 років",
    "ageMin": 4,
    "family": false,
    "format": "full",
    "duration": "102 хв",
    "categories": [
      "Казки",
      "Емоційний інтелект"
    ],
    "themes": [
      "family",
      "help",
      "feel"
    ],
    "description": "Сестра йде в кригу за сестрою. Під піснями — історія про людину, яка закрилася, бо боїться нашкодити, і про ту, що не відступилася.",
    "value": "Варто подивитися не заради пісень, а заради Анни: вона показує, як виглядає підтримка, коли близький відштовхує. Гине батьківський корабель — про це дитина зазвичай питає.",
    "question": "Чому Ельза втекла? Що їй допомогло б замість утечі?",
    "service": "swd",
    "watchLinks": [
      {
        "name": "sweet.tv",
        "url": "https://sweet.tv/search?query=%D0%9A%D1%80%D0%B8%D0%B6%D0%B0%D0%BD%D0%B5%20%D1%81%D0%B5%D1%80%D1%86%D0%B5"
      },
      {
        "name": "Megogo",
        "url": "https://megogo.net/ua/search-extended?q=%D0%9A%D1%80%D0%B8%D0%B6%D0%B0%D0%BD%D0%B5%20%D1%81%D0%B5%D1%80%D1%86%D0%B5"
      }
    ]
  },
  {
    "id": "u-poshukah-nemo",
    "title": "У пошуках Немо",
    "originalTitle": "Finding Nemo",
    "poster": "art/u-poshukah-nemo.webp",
    "year": 2003,
    "country": "США",
    "age": "3–6 років",
    "ageMin": 5,
    "family": false,
    "format": "full",
    "duration": "100 хв",
    "categories": [
      "Про тварин",
      "Пригоди"
    ],
    "themes": [
      "family",
      "help",
      "self"
    ],
    "description": "Тато переплив океан за сином, а по дорозі навчився довіряти. Немо з хворим плавцем — про те, що «не такий» не означає «не зможе».",
    "value": "Фільм однаково про дитину й про батька, який душить турботою. Перша сцена — смерть мами й сотні ікринок: коротка, але сильна, і краще бути рядом.",
    "question": "Чого тато Немо навчився від Дорі?",
    "service": "swd",
    "watchLinks": [
      {
        "name": "sweet.tv",
        "url": "https://sweet.tv/search?query=%D0%A3%20%D0%BF%D0%BE%D1%88%D1%83%D0%BA%D0%B0%D1%85%20%D0%9D%D0%B5%D0%BC%D0%BE"
      },
      {
        "name": "Megogo",
        "url": "https://megogo.net/ua/search-extended?q=%D0%A3%20%D0%BF%D0%BE%D1%88%D1%83%D0%BA%D0%B0%D1%85%20%D0%9D%D0%B5%D0%BC%D0%BE"
      }
    ]
  },
  {
    "id": "wall-e",
    "title": "ВОЛЛ·І",
    "originalTitle": "WALL·E",
    "poster": "art/wall-e.webp",
    "year": 2008,
    "country": "США",
    "age": "3–6 років",
    "ageMin": 5,
    "family": true,
    "format": "full",
    "duration": "98 хв",
    "categories": [
      "Про техніку",
      "Пригоди"
    ],
    "themes": [
      "kind",
      "friend"
    ],
    "description": "Перші сорок хвилин майже без слів. Робот, який прибирає Землю і доглядає росток, — найтихіше кіно про турботу.",
    "value": "Відсутність діалогів на початку — плюс для дітей, які ще погано читають субтитри, і випробування для тих, хто звик до балачок. Заодно це перша розмова про смітя і споживання, без жодної лекції.",
    "question": "Як ВОЛЛ·І показував, що дбає про ЕВУ, якщо він майже не говорив?",
    "service": "swd",
    "watchLinks": [
      {
        "name": "sweet.tv",
        "url": "https://sweet.tv/search?query=%D0%92%D0%9E%D0%9B%D0%9B%C2%B7%D0%86"
      },
      {
        "name": "Megogo",
        "url": "https://megogo.net/ua/search-extended?q=%D0%92%D0%9E%D0%9B%D0%9B%C2%B7%D0%86"
      }
    ]
  },
  {
    "id": "lodovykovyi-period",
    "title": "Льодовиковий період",
    "originalTitle": "Ice Age",
    "poster": "art/lodovykovyi-period.webp",
    "year": 2002,
    "country": "США",
    "age": "3–6 років",
    "ageMin": 5,
    "family": true,
    "format": "full",
    "duration": "81 хв",
    "categories": [
      "Про тварин",
      "Пригоди"
    ],
    "themes": [
      "friend",
      "family",
      "help"
    ],
    "description": "Троє, які терпіти не можуть одне одного, несуть людське дитинча додому — і стають родиною по дорозі.",
    "value": "Смішний і короткий, добре заходить дітям, які ще не витримують довгі фільми. Є сцена загибелі мами дитинчати й погоня хижаків — найнапруженіші моменти.",
    "question": "Як вороги стали друзями?",
    "service": "swd",
    "watchLinks": [
      {
        "name": "sweet.tv",
        "url": "https://sweet.tv/search?query=%D0%9B%D1%8C%D0%BE%D0%B4%D0%BE%D0%B2%D0%B8%D0%BA%D0%BE%D0%B2%D0%B8%D0%B9%20%D0%BF%D0%B5%D1%80%D1%96%D0%BE%D0%B4"
      },
      {
        "name": "Megogo",
        "url": "https://megogo.net/ua/search-extended?q=%D0%9B%D1%8C%D0%BE%D0%B4%D0%BE%D0%B2%D0%B8%D0%BA%D0%BE%D0%B2%D0%B8%D0%B9%20%D0%BF%D0%B5%D1%80%D1%96%D0%BE%D0%B4"
      }
    ]
  },
  {
    "id": "ernest-i-selestyna",
    "title": "Ернест і Селестина",
    "originalTitle": "Ernest et Célestine",
    "poster": "art/ernest-i-selestyna.webp",
    "year": 2012,
    "country": "Франція",
    "age": "3–6 років",
    "ageMin": 5,
    "family": false,
    "format": "full",
    "duration": "79 хв",
    "categories": [
      "Про тварин",
      "Казки",
      "Емоційний інтелект"
    ],
    "themes": [
      "friend",
      "self",
      "kind"
    ],
    "description": "Ведмідь і мишка дружать, хоча «так не можна». Намальовано акварельно, сказано твердо: дружба важливіша за правила про те, хто з ким може.",
    "value": "Рідкісна мальована анімація без 3D — дітям, які бачили лише Pixar, це помітно інша картинка. Український дубляж знайти складно, частіше доступні субтитри.",
    "question": "Чому всі були проти їхньої дружби?",
    "service": "rent",
    "watchLinks": [
      {
        "name": "Megogo",
        "url": "https://megogo.net/ua/search-extended?q=%D0%95%D1%80%D0%BD%D0%B5%D1%81%D1%82%20%D1%96%20%D0%A1%D0%B5%D0%BB%D0%B5%D1%81%D1%82%D0%B8%D0%BD%D0%B0"
      },
      {
        "name": "Apple TV",
        "url": "https://tv.apple.com/search?term=Ernest%20et%20C%C3%A9lestine"
      }
    ]
  },
  {
    "id": "moana",
    "title": "Моана",
    "originalTitle": "Moana",
    "poster": "art/moana.webp",
    "year": 2016,
    "country": "США",
    "age": "3–6 років",
    "ageMin": 5,
    "family": false,
    "format": "full",
    "duration": "107 хв",
    "categories": [
      "Казки",
      "Пригоди"
    ],
    "themes": [
      "brave",
      "self"
    ],
    "description": "Дівчинка вирушає в океан, бо відчуває, що мусить. Про внутрішній голос, який не збігається з планами дорослих.",
    "value": "Героїня без романтичної лінії — рухає все її власна мета, і це помітно відрізняє фільм від старших казок Disney. Лавова істота Те Ка може налякати молодших.",
    "question": "Як Моана зрозуміла, хто вона?",
    "service": "swd",
    "watchLinks": [
      {
        "name": "sweet.tv",
        "url": "https://sweet.tv/search?query=%D0%9C%D0%BE%D0%B0%D0%BD%D0%B0"
      },
      {
        "name": "Megogo",
        "url": "https://megogo.net/ua/search-extended?q=%D0%9C%D0%BE%D0%B0%D0%BD%D0%B0"
      }
    ]
  },
  {
    "id": "vpered-i-vhoru",
    "title": "Вперед і вгору",
    "originalTitle": "Up",
    "poster": "art/vpered-i-vhoru.webp",
    "year": 2009,
    "country": "США",
    "age": "3–6 років",
    "ageMin": 6,
    "family": true,
    "format": "full",
    "duration": "96 хв",
    "categories": [
      "Пригоди",
      "Емоційний інтелект"
    ],
    "themes": [
      "loss",
      "friend",
      "family"
    ],
    "description": "Старий піднімає дім на повітряних кульках, щоб виконати обіцянку дружині, — і отримує несподіваного онука. Перші десять хвилин — найчесніша розмова про втрату в мультиплікації.",
    "value": "Вступ без слів про спільне життя й смерть Еллі діє сильно навіть на дорослих — дитині краще дивитися разом із вами. Далі фільм стає пригодою, і напруга спадає.",
    "question": "Чому Карл спочатку не хотів ні з ким говорити?",
    "service": "swd",
    "watchLinks": [
      {
        "name": "sweet.tv",
        "url": "https://sweet.tv/search?query=%D0%92%D0%BF%D0%B5%D1%80%D0%B5%D0%B4%20%D1%96%20%D0%B2%D0%B3%D0%BE%D1%80%D1%83"
      },
      {
        "name": "Megogo",
        "url": "https://megogo.net/ua/search-extended?q=%D0%92%D0%BF%D0%B5%D1%80%D0%B5%D0%B4%20%D1%96%20%D0%B2%D0%B3%D0%BE%D1%80%D1%83"
      }
    ]
  },
  {
    "id": "dumkamy-navyvorit",
    "title": "Думками навиворіт",
    "originalTitle": "Inside Out",
    "poster": "art/dumkamy-navyvorit.webp",
    "year": 2015,
    "country": "США",
    "age": "3–6 років",
    "ageMin": 6,
    "family": true,
    "format": "full",
    "duration": "95 хв",
    "categories": [
      "Емоційний інтелект",
      "Розвиваючі"
    ],
    "themes": [
      "feel",
      "help",
      "family"
    ],
    "description": "Емоції дівчинки як пʼять персонажів у голові. Головна думка: Сум — не поломка, саме він кличе інших на допомогу.",
    "value": "Після цього фільму в дитини зʼявляється словник для власних станів — це найкорисніший мультик у каталозі для розмов про почуття. Втрата персонажа Бінго-Бонго засмучує майже всіх.",
    "question": "Яка емоція сьогодні була у тебе за головну?",
    "service": "swd",
    "watchLinks": [
      {
        "name": "sweet.tv",
        "url": "https://sweet.tv/search?query=%D0%94%D1%83%D0%BC%D0%BA%D0%B0%D0%BC%D0%B8%20%D0%BD%D0%B0%D0%B2%D0%B8%D0%B2%D0%BE%D1%80%D1%96%D1%82"
      },
      {
        "name": "Megogo",
        "url": "https://megogo.net/ua/search-extended?q=%D0%94%D1%83%D0%BC%D0%BA%D0%B0%D0%BC%D0%B8%20%D0%BD%D0%B0%D0%B2%D0%B8%D0%B2%D0%BE%D1%80%D1%96%D1%82"
      }
    ]
  },
  {
    "id": "yak-pryruchyty-drakona",
    "title": "Як приручити дракона",
    "originalTitle": "How to Train Your Dragon",
    "poster": "art/yak-pryruchyty-drakona.webp",
    "year": 2010,
    "country": "США",
    "age": "3–6 років",
    "ageMin": 6,
    "family": false,
    "format": "full",
    "duration": "98 хв",
    "categories": [
      "Пригоди",
      "Казки",
      "Про тварин"
    ],
    "themes": [
      "friend",
      "self",
      "brave"
    ],
    "description": "Хлопець, якому не вдається бути «як усі», знаходить спільну мову з тим, кого всі бояться. Про сміливість не бити.",
    "value": "Дружба будується без слів — на терпінні й спостереженні, і це видно покроково. У фіналі герой втрачає ногу: подається спокійно, але варто бути готовим до питань.",
    "question": "Чому Гикавка не захотів убити дракона?",
    "service": "swdw",
    "watchLinks": [
      {
        "name": "sweet.tv",
        "url": "https://sweet.tv/search?query=%D0%AF%D0%BA%20%D0%BF%D1%80%D0%B8%D1%80%D1%83%D1%87%D0%B8%D1%82%D0%B8%20%D0%B4%D1%80%D0%B0%D0%BA%D0%BE%D0%BD%D0%B0"
      },
      {
        "name": "Megogo",
        "url": "https://megogo.net/ua/search-extended?q=%D0%AF%D0%BA%20%D0%BF%D1%80%D0%B8%D1%80%D1%83%D1%87%D0%B8%D1%82%D0%B8%20%D0%B4%D1%80%D0%B0%D0%BA%D0%BE%D0%BD%D0%B0"
      }
    ]
  },
  {
    "id": "zootropolis",
    "title": "Зоотрополіс",
    "originalTitle": "Zootopia",
    "poster": "art/zootropolis.webp",
    "year": 2016,
    "country": "США",
    "age": "3–6 років",
    "ageMin": 6,
    "family": false,
    "format": "full",
    "duration": "108 хв",
    "categories": [
      "Про тварин",
      "Пригоди",
      "Емоційний інтелект"
    ],
    "themes": [
      "friend",
      "self",
      "help"
    ],
    "description": "Крільчиха-полісменка і лис-шахрай розплутують справу, а заодно свої упередження. Доступна розмова про стереотипи.",
    "value": "Детективний сюжет тримає увагу, а тема упереджень лежить на поверхні й не вимагає пояснень від дорослого. Є кілька сцен із «здичавілими» хижаками, які лякають молодших.",
    "question": "Чи бувало, що про тебе подумали неправду, бо «такі, як ти, завжди так»?",
    "service": "swd",
    "watchLinks": [
      {
        "name": "sweet.tv",
        "url": "https://sweet.tv/search?query=%D0%97%D0%BE%D0%BE%D1%82%D1%80%D0%BE%D0%BF%D0%BE%D0%BB%D1%96%D1%81"
      },
      {
        "name": "Megogo",
        "url": "https://megogo.net/ua/search-extended?q=%D0%97%D0%BE%D0%BE%D1%82%D1%80%D0%BE%D0%BF%D0%BE%D0%BB%D1%96%D1%81"
      }
    ]
  },
  {
    "id": "ratatuy",
    "title": "Рататуй",
    "originalTitle": "Ratatouille",
    "poster": "art/ratatuy.webp",
    "year": 2007,
    "country": "США",
    "age": "3–6 років",
    "ageMin": 6,
    "family": true,
    "format": "full",
    "duration": "111 хв",
    "categories": [
      "Про тварин",
      "Пригоди"
    ],
    "themes": [
      "friend",
      "self",
      "help"
    ],
    "description": "Щур, який готує, і кухар, який не вміє. Удвох вони — одна людина, і це найточніша картинка партнерства.",
    "value": "Повільніший за інші фільми Pixar і більше про роботу, ніж про пригоди — зайде дітям, які люблять щось робити руками. Чудова ілюстрація того, що партнерство сильніше за талант одного.",
    "question": "У чому ви з другом добре доповнюєте одне одного?",
    "service": "swd",
    "watchLinks": [
      {
        "name": "sweet.tv",
        "url": "https://sweet.tv/search?query=%D0%A0%D0%B0%D1%82%D0%B0%D1%82%D1%83%D0%B9"
      },
      {
        "name": "Megogo",
        "url": "https://megogo.net/ua/search-extended?q=%D0%A0%D0%B0%D1%82%D0%B0%D1%82%D1%83%D0%B9"
      }
    ]
  },
  {
    "id": "kung-fu-panda",
    "title": "Кунг-фу Панда",
    "originalTitle": "Kung Fu Panda",
    "poster": "art/kung-fu-panda.webp",
    "year": 2008,
    "country": "США",
    "age": "3–6 років",
    "ageMin": 6,
    "family": false,
    "format": "full",
    "duration": "92 хв",
    "categories": [
      "Пригоди",
      "Про тварин"
    ],
    "themes": [
      "self",
      "help",
      "brave"
    ],
    "description": "Товстого панду беруть у воїни, і виявляється, секретного складника немає. Про наставника, який повірив першим.",
    "value": "Багато бійок, але вони мультяшні й без крові. Головна думка — що віра дорослого в дитину і є тим «секретним складником» — сказана прямо й запамʼятовується.",
    "question": "Що означає «секретного складника немає»?",
    "service": "swdw",
    "watchLinks": [
      {
        "name": "sweet.tv",
        "url": "https://sweet.tv/search?query=%D0%9A%D1%83%D0%BD%D0%B3-%D1%84%D1%83%20%D0%9F%D0%B0%D0%BD%D0%B4%D0%B0"
      },
      {
        "name": "Megogo",
        "url": "https://megogo.net/ua/search-extended?q=%D0%9A%D1%83%D0%BD%D0%B3-%D1%84%D1%83%20%D0%9F%D0%B0%D0%BD%D0%B4%D0%B0"
      }
    ]
  },
  {
    "id": "lilo-i-stitch",
    "title": "Ліло і Стіч",
    "originalTitle": "Lilo & Stitch",
    "poster": "art/lilo-i-stitch.webp",
    "year": 2002,
    "country": "США",
    "age": "3–6 років",
    "ageMin": 6,
    "family": false,
    "format": "full",
    "duration": "85 хв",
    "categories": [
      "Емоційний інтелект",
      "Пригоди"
    ],
    "themes": [
      "family",
      "self",
      "loss"
    ],
    "description": "Дві сестри після смерті батьків і прибулець, який ламає все. «Охана означає сімʼя» — тут це не слоган, а вибір щодня.",
    "value": "Рідкісний мультфільм про родину на межі: старша сестра не справляється, і соцслужба може забрати молодшу. Для дітей із досвідом втрати або прийомної родини — дуже близька історія.",
    "question": "Що робить людей сімʼєю?",
    "service": "swd",
    "watchLinks": [
      {
        "name": "sweet.tv",
        "url": "https://sweet.tv/search?query=%D0%9B%D1%96%D0%BB%D0%BE%20%D1%96%20%D0%A1%D1%82%D1%96%D1%87"
      },
      {
        "name": "Megogo",
        "url": "https://megogo.net/ua/search-extended?q=%D0%9B%D1%96%D0%BB%D0%BE%20%D1%96%20%D0%A1%D1%82%D1%96%D1%87"
      }
    ]
  },
  {
    "id": "koko",
    "title": "Коко",
    "originalTitle": "Coco",
    "poster": "art/koko.webp",
    "year": 2017,
    "country": "США",
    "age": "3–6 років",
    "ageMin": 6,
    "family": true,
    "format": "full",
    "duration": "105 хв",
    "categories": [
      "Казки",
      "Емоційний інтелект"
    ],
    "themes": [
      "family",
      "loss"
    ],
    "description": "Хлопчик потрапляє у світ померлих і дізнається правду про прапрадіда. Мʼяка, музична розмова про память і тих, кого вже немає.",
    "value": "Світ померлих тут яскравий і не страшний, тому фільм часто стає першою безпечною розмовою про смерть. Фінальна сцена з прабабусею Коко плаче майже вся родина — це нормально.",
    "question": "Кого з нашої родини ти хочеш, щоб я тобі розповів?",
    "service": "swd",
    "watchLinks": [
      {
        "name": "sweet.tv",
        "url": "https://sweet.tv/search?query=%D0%9A%D0%BE%D0%BA%D0%BE"
      },
      {
        "name": "Megogo",
        "url": "https://megogo.net/ua/search-extended?q=%D0%9A%D0%BE%D0%BA%D0%BE"
      }
    ]
  },
  {
    "id": "ralf-ruynivnyk",
    "title": "Ральф-руйнівник",
    "originalTitle": "Wreck-It Ralph",
    "poster": "art/ralf-ruynivnyk.webp",
    "year": 2012,
    "country": "США",
    "age": "3–6 років",
    "ageMin": 6,
    "family": false,
    "format": "full",
    "duration": "101 хв",
    "categories": [
      "Про техніку",
      "Пригоди"
    ],
    "themes": [
      "friend",
      "self"
    ],
    "description": "Поганець із гри хоче бути хорошим, а дівчинка-«глюк» — гонщицею. Дружба двох, яких нікуди не брали.",
    "value": "Світ відеоігор робить тему прийняття нестрашною для розмови — дитина бачить не мораль, а гонки. Є сцена, де Ральф ламає машинку Ванелопи: добрий привід поговорити про зраду й вибачення.",
    "question": "Чому Ральфа вважали поганим, хоча він таким не був?",
    "service": "swd",
    "watchLinks": [
      {
        "name": "sweet.tv",
        "url": "https://sweet.tv/search?query=%D0%A0%D0%B0%D0%BB%D1%8C%D1%84-%D1%80%D1%83%D0%B9%D0%BD%D1%96%D0%B2%D0%BD%D0%B8%D0%BA"
      },
      {
        "name": "Megogo",
        "url": "https://megogo.net/ua/search-extended?q=%D0%A0%D0%B0%D0%BB%D1%8C%D1%84-%D1%80%D1%83%D0%B9%D0%BD%D1%96%D0%B2%D0%BD%D0%B8%D0%BA"
      }
    ]
  },
  {
    "id": "enkanto",
    "title": "Енканто",
    "originalTitle": "Encanto",
    "poster": "art/enkanto.webp",
    "year": 2021,
    "country": "США",
    "age": "3–6 років",
    "ageMin": 6,
    "family": true,
    "format": "full",
    "duration": "102 хв",
    "categories": [
      "Казки",
      "Емоційний інтелект"
    ],
    "themes": [
      "family",
      "self",
      "feel"
    ],
    "description": "У родині з магічними дарами одна дівчинка без дару. Про тиск очікувань і про те, як важко бути «сильною» всім на радість.",
    "value": "Найкорисніший фільм для сімей, де від дитини багато чекають — особливо від старшої. Пісня про Луїзу, яка не має права втомитися, точно описує стан, у якому дитина не вміє признатися.",
    "question": "Чи буває, що від тебе чекають надто багато?",
    "service": "swd",
    "watchLinks": [
      {
        "name": "sweet.tv",
        "url": "https://sweet.tv/search?query=%D0%95%D0%BD%D0%BA%D0%B0%D0%BD%D1%82%D0%BE"
      },
      {
        "name": "Megogo",
        "url": "https://megogo.net/ua/search-extended?q=%D0%95%D0%BD%D0%BA%D0%B0%D0%BD%D1%82%D0%BE"
      }
    ]
  },
  {
    "id": "luka",
    "title": "Лука",
    "originalTitle": "Luca",
    "poster": "art/luka.webp",
    "year": 2021,
    "country": "США",
    "age": "3–6 років",
    "ageMin": 6,
    "family": false,
    "format": "full",
    "duration": "95 хв",
    "categories": [
      "Пригоди",
      "Казки"
    ],
    "themes": [
      "friend",
      "self",
      "brave"
    ],
    "description": "Двоє морських хлопців літують у містечку, приховуючи, хто вони. Літо, велосипед і дружба, яка дає смілість.",
    "value": "Легкий і сонячний, без злодіїв і без справжньої загрози — добрий варіант, коли потрібно щось без напруги. Про потребу приховувати себе сказано тонко, без прямих пояснень.",
    "question": "Що Лука зміг зробити тільки завдяки Альберто?",
    "service": "swd",
    "watchLinks": [
      {
        "name": "sweet.tv",
        "url": "https://sweet.tv/search?query=%D0%9B%D1%83%D0%BA%D0%B0"
      },
      {
        "name": "Megogo",
        "url": "https://megogo.net/ua/search-extended?q=%D0%9B%D1%83%D0%BA%D0%B0"
      }
    ]
  },
  {
    "id": "klaus",
    "title": "Клаус",
    "originalTitle": "Klaus",
    "poster": "art/klaus.webp",
    "year": 2019,
    "country": "Іспанія",
    "age": "6–9 років",
    "ageMin": 7,
    "family": true,
    "format": "full",
    "duration": "96 хв",
    "categories": [
      "Казки",
      "Емоційний інтелект"
    ],
    "themes": [
      "kind",
      "friend",
      "loss"
    ],
    "description": "Егоїстичний листоноша й самотній тесля з іграшками міняють місто, де всі ворогують. «Добрий вчинок завжди породжує інший» — тут це сюжетний механізм.",
    "value": "Найкрасивіше намальований фільм у каталозі й найсильніша новорічна альтернатива звичайним святковим мультикам. За веселою формою — історія про горе Клауса, яке зʼясовується в середині.",
    "question": "Який добрий вчинок хтось зробив для тебе цього тижня?",
    "service": "nfx",
    "watchLinks": [
      {
        "name": "Netflix",
        "url": "https://www.netflix.com/search?q=Klaus"
      }
    ]
  },
  {
    "id": "shrek",
    "title": "Шрек",
    "originalTitle": "Shrek",
    "poster": "art/shrek.webp",
    "year": 2001,
    "country": "США",
    "age": "6–9 років",
    "ageMin": 7,
    "family": true,
    "format": "full",
    "duration": "90 хв",
    "categories": [
      "Казки",
      "Пригоди"
    ],
    "themes": [
      "self",
      "friend"
    ],
    "description": "Огр, віслюк і принцеса з секретом. Голосно, смішно і про те, що приймати себе доводиться вголос.",
    "value": "Частина жартів розрахована на дорослих, і дитина їх просто не помітить. Український дубляж тут — окрема причина дивитися: він один із найкращих за всю історію нашого прокату.",
    "question": "Чому Шрек спершу нікого не підпускав?",
    "service": "swdw",
    "watchLinks": [
      {
        "name": "sweet.tv",
        "url": "https://sweet.tv/search?query=%D0%A8%D1%80%D0%B5%D0%BA"
      },
      {
        "name": "Megogo",
        "url": "https://megogo.net/ua/search-extended?q=%D0%A8%D1%80%D0%B5%D0%BA"
      }
    ]
  },
  {
    "id": "hilda",
    "title": "Хільда",
    "originalTitle": "Hilda",
    "poster": "art/hilda.webp",
    "year": 2018,
    "country": "Велика Британія",
    "age": "6–9 років",
    "ageMin": 7,
    "family": false,
    "format": "series",
    "duration": "25 хв / серія",
    "categories": [
      "Пригоди",
      "Казки"
    ],
    "themes": [
      "friend",
      "brave",
      "family"
    ],
    "description": "Безстрашна дівчинка переїжджає з лісу в місто і знаходить друзів. Її мама — рідкісний приклад дорослої, яка вміє злитися й лагодити стосунки.",
    "value": "Світ із тролями й велетнями, але головне тут — стосунки: дружба трьох дітей і довіра між донькою та мамою. Кілька серій мають справді тривожні епізоди, тому молодшим зарано.",
    "question": "Як Хільда поводиться, коли їй страшно?",
    "service": "nfx",
    "watchLinks": [
      {
        "name": "Netflix",
        "url": "https://www.netflix.com/search?q=Hilda"
      }
    ]
  },
  {
    "id": "vidomska-sluzhba-dostavky",
    "title": "Відьомська служба доставки",
    "originalTitle": "魔女の宅急便",
    "poster": "art/vidomska-sluzhba-dostavky.webp",
    "year": 1989,
    "country": "Японія",
    "age": "6–9 років",
    "ageMin": 7,
    "family": false,
    "format": "full",
    "duration": "103 хв",
    "categories": [
      "Казки",
      "Емоційний інтелект"
    ],
    "themes": [
      "brave",
      "help",
      "self"
    ],
    "description": "Тринадцятирічна відьма живе сама й раптом втрачає силу. Найкращий мультик про вигорання і про те, що відновлюватися допомагають люди.",
    "value": "Найкорисніший фільм каталогу для підлітків, які вивчились «мусити» і перестали радіти. Небезпек майже немає — напруга тут внутрішня, тому молодшим може бути нецікаво.",
    "question": "Що повернуло Кікі здатність літати?",
    "service": "nfg",
    "watchLinks": [
      {
        "name": "Netflix",
        "url": "https://www.netflix.com/search?q=%E9%AD%94%E5%A5%B3%E3%81%AE%E5%AE%85%E6%80%A5%E4%BE%BF"
      }
    ]
  },
  {
    "id": "misto-heroiv",
    "title": "Місто героїв",
    "originalTitle": "Big Hero 6",
    "poster": "art/misto-heroiv.webp",
    "year": 2014,
    "country": "США",
    "age": "6–9 років",
    "ageMin": 7,
    "family": false,
    "format": "full",
    "duration": "102 хв",
    "categories": [
      "Про техніку",
      "Пригоди",
      "Емоційний інтелект"
    ],
    "themes": [
      "loss",
      "help",
      "friend"
    ],
    "description": "Хлопчик після смерті брата отримує робота-медика, який наполегливо питає: «Як ти оцінюєш свій біль?». Про помсту, яка не лікує.",
    "value": "Супергеройська обгортка робить важку тему витримуваною, але смерть брата показана прямо, і горе героя — головна лінія фільму. Беймакс — найточніший приклад того, як виглядає турбота без оцінок.",
    "question": "Чим Беймакс допомагав Хіро насправді?",
    "service": "swd",
    "watchLinks": [
      {
        "name": "sweet.tv",
        "url": "https://sweet.tv/search?query=%D0%9C%D1%96%D1%81%D1%82%D0%BE%20%D0%B3%D0%B5%D1%80%D0%BE%D1%97%D0%B2"
      },
      {
        "name": "Megogo",
        "url": "https://megogo.net/ua/search-extended?q=%D0%9C%D1%96%D1%81%D1%82%D0%BE%20%D0%B3%D0%B5%D1%80%D0%BE%D1%97%D0%B2"
      }
    ]
  },
  {
    "id": "zaliznyi-hihant",
    "title": "Залізний гігант",
    "originalTitle": "The Iron Giant",
    "poster": "art/zaliznyi-hihant.webp",
    "year": 1999,
    "country": "США",
    "age": "6–9 років",
    "ageMin": 7,
    "family": false,
    "format": "full",
    "duration": "86 хв",
    "categories": [
      "Про техніку",
      "Емоційний інтелект"
    ],
    "themes": [
      "friend",
      "loss",
      "kind"
    ],
    "description": "Хлопчик дружить із бойовим роботом і вчить його, що той не зброя. «Ти є тим, кого ти вибираєш» — і дуже сильний фінал.",
    "value": "Класика, яку мало хто бачив, і один із найсильніших фіналів у анімації — жертва героя засмучує, хоча й завершується надією. Тло — холодна війна і дорослий страх перед невідомим.",
    "question": "Чи може хтось змінитися, якщо його таким зробили?",
    "service": "rent",
    "watchLinks": [
      {
        "name": "Megogo",
        "url": "https://megogo.net/ua/search-extended?q=%D0%97%D0%B0%D0%BB%D1%96%D0%B7%D0%BD%D0%B8%D0%B9%20%D0%B3%D1%96%D0%B3%D0%B0%D0%BD%D1%82"
      },
      {
        "name": "Apple TV",
        "url": "https://tv.apple.com/search?term=The%20Iron%20Giant"
      }
    ]
  },
  {
    "id": "pisnya-morya",
    "title": "Пісня моря",
    "originalTitle": "Song of the Sea",
    "poster": "art/pisnya-morya.webp",
    "year": 2014,
    "country": "Ірландія",
    "age": "6–9 років",
    "ageMin": 7,
    "family": false,
    "format": "full",
    "duration": "93 хв",
    "categories": [
      "Казки",
      "Емоційний інтелект"
    ],
    "themes": [
      "loss",
      "family",
      "feel"
    ],
    "description": "Брат і сестра після зникнення мами. Мальовано як ірландський орнамент, сказано про горе, яке не можна запечатати в камінь.",
    "value": "Головна метафора фільму — почуття, які закупорюють, щоб не боліли, і які від цього не зникають. Повільний, дуже красивий і вимагає спокійного вечора без телефонів.",
    "question": "Чому бабуся і тато поводилися так, ніби нічого не сталося?",
    "service": "rent",
    "watchLinks": [
      {
        "name": "Megogo",
        "url": "https://megogo.net/ua/search-extended?q=%D0%9F%D1%96%D1%81%D0%BD%D1%8F%20%D0%BC%D0%BE%D1%80%D1%8F"
      },
      {
        "name": "Apple TV",
        "url": "https://tv.apple.com/search?term=Song%20of%20the%20Sea"
      }
    ]
  },
  {
    "id": "simya-mitchelliv",
    "title": "Сімʼя Мітчеллів проти машин",
    "originalTitle": "The Mitchells vs. the Machines",
    "poster": "art/simya-mitchelliv.webp",
    "year": 2021,
    "country": "США",
    "age": "6–9 років",
    "ageMin": 8,
    "family": true,
    "format": "full",
    "duration": "113 хв",
    "categories": [
      "Про техніку",
      "Пригоди"
    ],
    "themes": [
      "family",
      "self",
      "help"
    ],
    "description": "Тато й донька, які не розуміють одне одного, рятують світ у відпустці. Смішно й точно про батьків, що бояться втратити дитину дорослою.",
    "value": "Дуже швидкий монтаж і купа жартів — дітям, які втомлюються від довгих фільмів, тут легко. Під комедією лежить справжній конфлікт: донька їде вчитися, а тато не вміє відпустити.",
    "question": "Чого тато не помічав у Кейті?",
    "service": "nfx",
    "watchLinks": [
      {
        "name": "Netflix",
        "url": "https://www.netflix.com/search?q=The%20Mitchells%20vs.%20the%20Machines"
      }
    ]
  },
  {
    "id": "ya-chervoniyu",
    "title": "Я червонію",
    "originalTitle": "Turning Red",
    "poster": "art/ya-chervoniyu.webp",
    "year": 2022,
    "country": "США",
    "age": "6–9 років",
    "ageMin": 8,
    "family": false,
    "format": "full",
    "duration": "100 хв",
    "categories": [
      "Емоційний інтелект"
    ],
    "themes": [
      "feel",
      "family",
      "friend"
    ],
    "description": "Тринадцятирічна Мей перетворюється на панду, коли сильно хвилюється. Про злість, яку забороняли, і про чотирьох подруг, що просто стоять рядом.",
    "value": "Найкраща в каталозі історія про підліткові зміни й про мамину опіку, що душить. Є теми першої закоханості й дорослішання тіла — батькам варто подивитися разом.",
    "question": "Що Мей робила зі своєю злістю? А що робиш ти?",
    "service": "swd",
    "watchLinks": [
      {
        "name": "sweet.tv",
        "url": "https://sweet.tv/search?query=%D0%AF%20%D1%87%D0%B5%D1%80%D0%B2%D0%BE%D0%BD%D1%96%D1%8E"
      },
      {
        "name": "Megogo",
        "url": "https://megogo.net/ua/search-extended?q=%D0%AF%20%D1%87%D0%B5%D1%80%D0%B2%D0%BE%D0%BD%D1%96%D1%8E"
      }
    ]
  },
  {
    "id": "dusha",
    "title": "Душа",
    "originalTitle": "Soul",
    "poster": "art/dusha.webp",
    "year": 2020,
    "country": "США",
    "age": "6–9 років",
    "ageMin": 8,
    "family": false,
    "format": "full",
    "duration": "100 хв",
    "categories": [
      "Емоційний інтелект"
    ],
    "themes": [
      "feel",
      "help",
      "self"
    ],
    "description": "Музикант помирає за крок до мрії і вчить загублену душу жити. Про те, що «призначення» — не те саме, що життя.",
    "value": "Фільм радше для старших дітей і дорослих: сюжет будується на ідеї, а не на пригоді. Зате після нього легко говорити про тиск «знайти своє покликання», який діти чують уже в школі.",
    "question": "Який звичайний день цього тижня був для тебе хорошим?",
    "service": "swd",
    "watchLinks": [
      {
        "name": "sweet.tv",
        "url": "https://sweet.tv/search?query=%D0%94%D1%83%D1%88%D0%B0"
      },
      {
        "name": "Megogo",
        "url": "https://megogo.net/ua/search-extended?q=%D0%94%D1%83%D1%88%D0%B0"
      }
    ]
  },
  {
    "id": "vidneseni-pryvydamy",
    "title": "Віднесені привидами",
    "originalTitle": "千と千尋の神隠し",
    "poster": "art/vidneseni-pryvydamy.webp",
    "year": 2001,
    "country": "Японія",
    "age": "6–9 років",
    "ageMin": 8,
    "family": false,
    "format": "full",
    "duration": "125 хв",
    "categories": [
      "Казки",
      "Пригоди"
    ],
    "themes": [
      "brave",
      "friend",
      "family"
    ],
    "description": "Дівчинка працює в лазні для духів, щоб урятувати батьків. Страшно, красиво і про те, як страх перетворюється на витримку.",
    "value": "Найсильніший фільм каталогу — і найстрашніший: батьки, що стають свиньми, і Безликий лякають багатьох дітей. Довгий, 125 хвилин, тому краще дивитися не на ніч.",
    "question": "Що зробило Тіхіро сміливою — вона не боялася чи боялася і все одно йшла?",
    "service": "nfg",
    "watchLinks": [
      {
        "name": "Netflix",
        "url": "https://www.netflix.com/search?q=%E5%8D%83%E3%81%A8%E5%8D%83%E5%B0%8B%E3%81%AE%E7%A5%9E%E9%9A%A0%E3%81%97"
      }
    ]
  },
  {
    "id": "avatar-ostannii-zahysnyk",
    "title": "Аватар: Останній захисник",
    "originalTitle": "Avatar: The Last Airbender",
    "poster": "art/avatar-ostannii-zahysnyk.webp",
    "year": 2005,
    "country": "США",
    "age": "9+ років",
    "ageMin": 9,
    "family": false,
    "format": "series",
    "duration": "23 хв / серія",
    "categories": [
      "Пригоди",
      "Емоційний інтелект"
    ],
    "themes": [
      "friend",
      "help",
      "brave"
    ],
    "description": "Три сезони про команду дітей, яка зупиняє війну. Рідкісний серіал, де в кожного — своя травма, і де ворог отримує шлях до змін.",
    "value": "Найсерйозніша річ у каталозі: війна, окупація, геноцид цілого народу — все це подано дитині зрозуміло й без цинізму. Для українських дітей деякі лінії звучать дуже близько, тому краще дивитися разом і говорити.",
    "question": "Хто з команди підтримує інших найбільше?",
    "service": "nfx",
    "watchLinks": [
      {
        "name": "Netflix",
        "url": "https://www.netflix.com/search?q=Avatar%3A%20The%20Last%20Airbender"
      }
    ]
  },
  {
    "id": "vovkohidtsi",
    "title": "Вовкохідці",
    "originalTitle": "Wolfwalkers",
    "poster": "art/vovkohidtsi.webp",
    "year": 2020,
    "country": "Ірландія",
    "age": "9+ років",
    "ageMin": 9,
    "family": false,
    "format": "full",
    "duration": "103 хв",
    "categories": [
      "Казки",
      "Про тварин",
      "Пригоди"
    ],
    "themes": [
      "friend",
      "brave",
      "self"
    ],
    "description": "Донька англійського ловця вовків дружить із дівчинкою, що обертається вовчицею. Про страх, який насаджують дорослі, і про вірність другові проти всіх.",
    "value": "Найкрасивіша мальована анімація останніх років, але й найжорсткіша: тут є окупація, насильство дорослих і реальна загроза для дітей. Молодшим точно зарано.",
    "question": "Що Робін довелося зробити, щоб не зрадити друга?",
    "service": "atv",
    "watchLinks": [
      {
        "name": "Apple TV",
        "url": "https://tv.apple.com/search?term=Wolfwalkers"
      }
    ]
  },
  {
    "id": "mavka",
    "title": "Мавка. Лісова пісня",
    "originalTitle": "Мавка. Лісова пісня",
    "poster": "art/mavka.webp",
    "year": 2023,
    "country": "Україна",
    "age": "3–6 років",
    "ageMin": 6,
    "family": true,
    "format": "full",
    "duration": "99 хв",
    "categories": [
      "Українські",
      "Казки"
    ],
    "themes": [
      "kind",
      "brave",
      "self"
    ],
    "description": "Українська версія історії про лісову душу і людину. Про вибір між обовʼязком і любовʼю та про турботу про живий ліс.",
    "value": "Українське виробництво з українським дубляжем від початку — дитина чує свою мову як норму, а не як переклад. Хороший привід потім прочитати «Лісову пісню» Лесі Українки у шкільному віці.",
    "question": "Що Мавка захищала і чим вона ризикувала?",
    "service": "uafilm",
    "watchLinks": [
      {
        "name": "sweet.tv",
        "url": "https://sweet.tv/search?query=%D0%9C%D0%B0%D0%B2%D0%BA%D0%B0.%20%D0%9B%D1%96%D1%81%D0%BE%D0%B2%D0%B0%20%D0%BF%D1%96%D1%81%D0%BD%D1%8F"
      },
      {
        "name": "Megogo",
        "url": "https://megogo.net/ua/search-extended?q=%D0%9C%D0%B0%D0%B2%D0%BA%D0%B0.%20%D0%9B%D1%96%D1%81%D0%BE%D0%B2%D0%B0%20%D0%BF%D1%96%D1%81%D0%BD%D1%8F"
      }
    ]
  },
  {
    "id": "vykradena-pryntsesa",
    "title": "Викрадена принцеса",
    "originalTitle": "Викрадена принцеса",
    "poster": "art/vykradena-pryntsesa.webp",
    "year": 2018,
    "country": "Україна",
    "age": "3–6 років",
    "ageMin": 6,
    "family": false,
    "format": "full",
    "duration": "89 хв",
    "categories": [
      "Українські",
      "Казки",
      "Пригоди"
    ],
    "themes": [
      "brave",
      "friend"
    ],
    "description": "Мандрівний актор рятує принцесу від чарівника. Легка пригода українською з живими жартами — добра перша «велика» казка.",
    "value": "Без другого дна й без важких тем — просто весела казка, яку можна поставити, коли потрібен легкий вечір. Перший український повнометражний мультфільм, що вийшов у широкий прокат за кордоном.",
    "question": "Руслан не був лицарем. Що робило його сміливим?",
    "service": "uafilm",
    "watchLinks": [
      {
        "name": "sweet.tv",
        "url": "https://sweet.tv/search?query=%D0%92%D0%B8%D0%BA%D1%80%D0%B0%D0%B4%D0%B5%D0%BD%D0%B0%20%D0%BF%D1%80%D0%B8%D0%BD%D1%86%D0%B5%D1%81%D0%B0"
      },
      {
        "name": "Megogo",
        "url": "https://megogo.net/ua/search-extended?q=%D0%92%D0%B8%D0%BA%D1%80%D0%B0%D0%B4%D0%B5%D0%BD%D0%B0%20%D0%BF%D1%80%D0%B8%D0%BD%D1%86%D0%B5%D1%81%D0%B0"
      }
    ]
  }
];

if (typeof window !== "undefined") {
  window.CATALOG_META = CATALOG_META;
  window.MOVIES = MOVIES;
}
