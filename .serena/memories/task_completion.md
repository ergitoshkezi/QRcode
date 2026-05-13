# Task Completion Checklist

After completing a task:
1. Run `pnpm tsc --noEmit` — must pass with 0 errors
2. Run `pnpm build` — must succeed
3. Check that modified components render without runtime errors

## Important notes
- Tailwind v4: use `@theme` directive for custom design tokens, NOT CSS variables with shadcn-style `border-border` classes
- CSS variables for colors: use `oklch()` syntax with Tailwind v4 @theme
- @apply only works with actual Tailwind utility classes, not custom class aliases
- Supabase client throws at init if env vars missing — ensure .env.local exists
