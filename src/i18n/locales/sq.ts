const sq = {
  // Landing
  landing: {
    title: 'Menu dixhital',
    subtitle: 'përmes QR kodit',
    description: 'Skano QR-in në tryezën tënde dhe zbulo menunë e plotë të restorantit. I shpejtë, elegant, pa shkarkim.',
    features: {
      mobile: 'Mobile first',
      instant: 'Menjëherë',
      qrOnly: 'Vetëm QR',
    },
    adminLink: 'Paneli i administratorit →',
  },

  // Menu page
  menu: {
    title: 'Menu',
    subtitle: 'Shto pijet tuaja në shportë',
    empty: 'Menuja nuk është ende e disponueshme',
    invalidQr: {
      title: 'QR i pavlefshëm',
      description: 'Ky kod QR nuk është aktiv ose nuk ekziston. Kontakto personelin.',
    },
  },

  // Cart
  cart: {
    items_one: '{{count}} artikull',
    items_other: '{{count}} artikuj',
    title: 'Porosia jote',
    each: 'çdo.',
    notes: 'Shënime (alergji, preferencë...)',
    total: 'Total',
    submit: 'Dërgo porosinë 🚀',
    submitting: 'Duke dërguar...',
    payment: 'Pagesa bëhet fizikisht në tryezë',
    toast: {
      success: 'Porosia u dërgua! Stafi do ta trajtojë së shpejti 🎉',
      error: 'Gabim gjatë dërgimit të porosisë. Provo përsëri.',
    },
  },

  // Orders panel
  orders: {
    title: 'Porositë e fundit',
    orderedAt: 'Porositur në {{time}}',
    items_one: '{{count}} artikull',
    items_other: '{{count}} artikuj',
    total: 'Total',
    cancel: 'Anulo porosinë',
    cancelling: 'Duke anuluar...',
    confirmText: 'Jeni të sigurt që doni të anuloni këtë porosi? Operacioni nuk mund të kthehet.',
    no: 'Jo, mbaj',
    yes: 'Po, anulo porosinë',
    status: {
      pending: 'Në pritje',
      confirmed: 'Duke u përgatitur',
      ready: 'Gati',
      delivered: 'Dorëzuar',
    },
  },

  // Common UI elements
  common: {
    add: 'Shto',
    unavailable: 'Jo i disponueshëm',
  },

  // Categories
  categories: {
    'Soft Drinks': 'Pije jo-alkoolike',
    'Birre': 'Birra',
    'Cocktail': 'Koktej',
    'Acqua': 'Ujë',
    'Energy Drink': 'Pije energjike',
  },

  // Standard Drink translations (optional dynamic fallbacks)
  'Acqua Naturale': 'Ujë pa gaz',
  'Acqua Frizzante': 'Ujë me gaz',
  'Birra alla spina': 'Birrë me krikë',
  'Vino Rosso': 'Verë e kuqe',
  'Vino Bianco': 'Verë e bardhë',

  // Database Drink Names
  'Coca Cola': 'Koka Kola',
  'Acqua naturale': 'Ujë natyral',
  'Acqua frizzante': 'Ujë me gaz',
  'Peroni': 'Peroni',
  'Aperol Spritz': 'Aperol Spritz',
  'Red Bull': 'Red Bull',
  'Spritz al limone': 'Spritz me limon',
  'Heineken': 'Heineken',

  // Database Drink Descriptions
  'La classica bibita gassata': 'Pija klasike e gazuar',
  'Acqua minerale naturale 50cl': 'Ujë mineral natyral 50cl',
  'Acqua minerale frizzante 50cl': 'Ujë mineral me gaz 50cl',
  'Birra italiana in bottiglia 33cl': 'Birrë italiane në shishe 33cl',
  'Aperol, Prosecco, soda': 'Aperol, Proseko, sodë',
  'Energy drink 25cl': 'Pije energjike 25cl',
  'Limoncello, prosecco, menta': 'Limonçelo, proseko, mente',
  'Birra olandese 33cl': 'Birrë holandeze 33cl',
} as const;

export default sq;
