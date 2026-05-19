# Project Conversation History & Context Summary

This memory summarizes the recent key conversations, objectives, and solutions implemented in the QRcode project to preserve context for future tasks.

---

## 1. Multi-Language Support System (i18n)
- **Conversation ID**: `3b9938c5-2211-4c10-a46f-1e178b569a1c`
- **Objective**: Full internationalization of the codebase across Italian (`it`), English (`en`), and Albanian (`sq`).
- **Key Files**:
  - `src/i18n/locales/it.ts`
  - `src/i18n/locales/en.ts`
  - `src/i18n/locales/sq.ts`
  - `src/i18n/i18n.ts` (Config)
- **Database Multilingual Parsing**: Uses `translateDbText(text, lang)` in `src/lib/utils.ts` to parse name/description fields supporting:
  - JSON format: `{"it": "...", "en": "...", "sq": "..."}`
  - Tagged format: `it: ... | en: ... | sq: ...` (separated by `|` or `/`)
  - Positional format: `Italian | English | Albanian` (separated by `|` or `/`)
  - Fallback to raw database string.
- **Updated Components**: `DrinkCard.tsx`, `CartPanel.tsx`, `CustomerOrdersPanel.tsx`, `CategorySection.tsx`, `LandingPage.tsx`, `MenuPage.tsx`.

---

## 2. Refresh Orders After Placement
- **Conversation IDs**: `64a86e14-87f1-4c3d-b330-f0eff5efb7a4`, `b9dc82b2-f936-4278-a824-09502fa86447`
- **Objective**: Ensure the customer order list automatically refreshes when a new order is placed, avoiding the need for manual page reloads.
- **Solution**: Triggers a state refresh or update in `useCustomerOrders` immediately upon successful checkout inside `CartPanel`.

---

## 3. Display Total Price in Orders
- **Conversation ID**: `40c1e1fd-795c-4604-ada4-94a347f38585`
- **Objective**: Show the total monetary value of each order in the "Recent Orders" UI.
- **Solution**: Calculates the order total dynamically in `CustomerOrdersPanel` based on the sum of `quantity * price_snapshot` of `order_items`.

---

## 4. Customer Order Deletion & RLS Policies
- **Conversation ID**: `db293911-26e3-46a3-86f1-48d964fbed55`
- **Objective**: Allow customers to delete pending orders directly from "Recent Orders".
- **Solution**: Debugged Supabase RLS policies and DB-level issues where deleting operations returned success (0 rows affected) without actually deleting records from `orders` and `order_items`.

---

## 5. MCP Configuration Fix
- **Conversation ID**: `2c7cbcef-26fe-4847-a5f7-bbd0b53a6c0d`
- **Objective**: Fix validation errors in the `mcp_config.json` schema where wildcard values in tool arrays caused issues.
