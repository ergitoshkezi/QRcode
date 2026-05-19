const it = {
  // Landing
  landing: {
    title: 'Menu digitale',
    subtitle: 'via QR code',
    description: 'Scansiona il QR al tuo tavolo e scopri il menu completo del locale. Veloce, elegante, senza download.',
    features: {
      mobile: 'Mobile first',
      instant: 'Istantaneo',
      qrOnly: 'Solo QR',
    },
    adminLink: 'Dashboard amministratore →',
  },

  // Menu page
  menu: {
    title: 'Menu',
    subtitle: 'Aggiungi le tue bevande al carrello',
    empty: 'Menu non ancora disponibile',
    invalidQr: {
      title: 'QR non valido',
      description: 'Questo codice QR non è attivo o non esiste. Contatta il personale del locale.',
    },
  },

  // Cart
  cart: {
    items_one: '{{count}} articolo',
    items_other: '{{count}} articoli',
    title: 'Il tuo ordine',
    each: 'cad.',
    notes: 'Note (allergie, preferenze...)',
    total: 'Totale',
    submit: 'Invia ordine 🚀',
    submitting: 'Invio ordine...',
    payment: 'Il pagamento avviene fisicamente al tavolo',
    toast: {
      success: 'Ordine inviato! Il personale lo gestirà a breve 🎉',
      error: "Errore nell'invio ordine. Riprova.",
    },
  },

  // Orders panel
  orders: {
    title: 'I tuoi ordini recenti',
    orderedAt: 'Ordinato alle {{time}}',
    items_one: '{{count}} articolo',
    items_other: '{{count}} articoli',
    total: 'Totale',
    cancel: 'Annulla ordine',
    cancelling: 'Annullamento...',
    confirmText: "Sei sicuro di voler annullare questo ordine? L'operazione non può essere annullata.",
    no: 'No, tieni',
    yes: 'Sì, annulla ordine',
    status: {
      pending: 'In attesa',
      confirmed: 'In preparazione',
      ready: 'Pronto',
      delivered: 'Consegnato',
    },
  },

  // Common UI elements
  common: {
    add: 'Aggiungi',
    unavailable: 'Non disponibile',
  },

  // Categories
  categories: {
    'Soft Drinks': 'Soft Drinks',
    'Birre': 'Birre',
    'Cocktail': 'Cocktail',
    'Acqua': 'Acqua',
    'Energy Drink': 'Energy Drink',
  },

  // Standard Drink translations (optional dynamic fallbacks)
  'Acqua Naturale': 'Acqua Naturale',
  'Acqua Frizzante': 'Acqua Frizzante',
  'Birra alla spina': 'Birra alla spina',
  'Vino Rosso': 'Vino Rosso',
  'Vino Bianco': 'Vino Bianco',

  // Database Drink Names
  'Coca Cola': 'Coca Cola',
  'Acqua naturale': 'Acqua naturale',
  'Acqua frizzante': 'Acqua frizzante',
  'Peroni': 'Peroni',
  'Aperol Spritz': 'Aperol Spritz',
  'Red Bull': 'Red Bull',
  'Spritz al limone': 'Spritz al limone',
  'Heineken': 'Heineken',

  // Database Drink Descriptions
  'La classica bibita gassata': 'La classica bibita gassata',
  'Acqua minerale naturale 50cl': 'Acqua minerale naturale 50cl',
  'Acqua minerale frizzante 50cl': 'Acqua minerale frizzante 50cl',
  'Birra italiana in bottiglia 33cl': 'Birra italiana in bottiglia 33cl',
  'Aperol, Prosecco, soda': 'Aperol, Prosecco, soda',
  'Energy drink 25cl': 'Energy drink 25cl',
  'Limoncello, prosecco, menta': 'Limoncello, prosecco, menta',
  'Birra olandese 33cl': 'Birra olandese 33cl',
} as const;

export default it;
