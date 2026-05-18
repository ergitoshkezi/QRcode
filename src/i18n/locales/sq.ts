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
} as const;

export default sq;
