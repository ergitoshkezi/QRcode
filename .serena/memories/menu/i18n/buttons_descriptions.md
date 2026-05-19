# Localization of Dynamic Content & UI Buttons

The digital QR menu now supports dynamic translation lookups and button/category localization for Italian (`it`), English (`en`), and Albanian (`sq`):

- **Buttons & UI Badges**: "Aggiungi" and "Non disponibile" have been translated via `common.add` and `common.unavailable` keys.
- **Categories**: Dynamic category header translations (e.g. `Birre` -> `Beers` / `Birra`) are handled using `categories.${category}` translation keys.
- **Dynamic Items (Drinks & Descriptions)**: Drink names (`drink.name`) and descriptions (`drink.description`) are processed dynamically with `t(drink.name)` and `t(drink.description)`. If a matching key exists in the active language translation file (such as "Acqua Naturale"), the translated string is shown; otherwise, it falls back to the database-stored default value.
- **Components updated**:
  - `DrinkCard.tsx`
  - `CategorySection.tsx`
  - `CartPanel.tsx`
  - `CustomerOrdersPanel.tsx`
