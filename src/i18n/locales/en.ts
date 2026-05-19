const en = {
  // Landing
  landing: {
    title: 'Digital menu',
    subtitle: 'via QR code',
    description: 'Scan the QR at your table and discover the full menu. Fast, elegant, no download needed.',
    features: {
      mobile: 'Mobile first',
      instant: 'Instant',
      qrOnly: 'QR only',
    },
    adminLink: 'Admin dashboard →',
  },

  // Menu page
  menu: {
    title: 'Menu',
    subtitle: 'Add your drinks to the cart',
    empty: 'Menu not yet available',
    invalidQr: {
      title: 'Invalid QR',
      description: 'This QR code is not active or does not exist. Please contact the staff.',
    },
  },

  // Cart
  cart: {
    items_one: '{{count}} item',
    items_other: '{{count}} items',
    title: 'Your order',
    each: 'ea.',
    notes: 'Notes (allergies, preferences...)',
    total: 'Total',
    submit: 'Place order 🚀',
    submitting: 'Placing order...',
    payment: 'Payment is made in person at the table',
    toast: {
      success: 'Order sent! Staff will handle it shortly 🎉',
      error: 'Error placing order. Please try again.',
    },
  },

  // Orders panel
  orders: {
    title: 'Your recent orders',
    orderedAt: 'Ordered at {{time}}',
    items_one: '{{count}} item',
    items_other: '{{count}} items',
    total: 'Total',
    cancel: 'Cancel order',
    cancelling: 'Cancelling...',
    confirmText: 'Are you sure you want to cancel this order? This action cannot be undone.',
    no: 'No, keep it',
    yes: 'Yes, cancel order',
    status: {
      pending: 'Pending',
      confirmed: 'Preparing',
      ready: 'Ready',
      delivered: 'Delivered',
    },
  },

  // Common UI elements
  common: {
    add: 'Add',
    unavailable: 'Not available',
  },

  // Categories
  categories: {
    'Soft Drinks': 'Soft Drinks',
    'Birre': 'Beers',
    'Cocktail': 'Cocktails',
    'Acqua': 'Water',
    'Energy Drink': 'Energy Drinks',
  },

  // Standard Drink translations (optional dynamic fallbacks)
  'Acqua Naturale': 'Still Water',
  'Acqua Frizzante': 'Sparkling Water',
  'Birra alla spina': 'Draft Beer',
  'Vino Rosso': 'Red Wine',
  'Vino Bianco': 'White Wine',

  // Database Drink Names
  'Coca Cola': 'Coca Cola',
  'Acqua naturale': 'Still Water',
  'Acqua frizzante': 'Sparkling Water',
  'Peroni': 'Peroni',
  'Aperol Spritz': 'Aperol Spritz',
  'Red Bull': 'Red Bull',
  'Spritz al limone': 'Lemon Spritz',
  'Heineken': 'Heineken',

  // Database Drink Descriptions
  'La classica bibita gassata': 'The classic fizzy drink',
  'Acqua minerale naturale 50cl': 'Still mineral water 50cl',
  'Acqua minerale frizzante 50cl': 'Sparkling mineral water 50cl',
  'Birra italiana in bottiglia 33cl': 'Italian bottled beer 33cl',
  'Aperol, Prosecco, soda': 'Aperol, Prosecco, soda',
  'Energy drink 25cl': 'Energy drink 25cl',
  'Limoncello, prosecco, menta': 'Limoncello, prosecco, mint',
  'Birra olandese 33cl': 'Dutch bottled beer 33cl',
} as const;

export default en;
