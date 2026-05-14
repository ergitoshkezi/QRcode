---
title: Customer Order Status UX
date: 2026-05-14
context: Exploration about how to show customers the status of their orders
---

Decided to use a persistent small list of recent active orders directly on the customer's menu page rather than using popups. This ensures users always know where to check for the status.

The list will show orders for the current QR session and update ideally via Supabase Realtime (or fallback to polling) so customers see state changes (pending -> confirmed -> delivered) immediately when management updates them.
