# Repository Guidelines

## Project Structure & Module Organization
The Next.js application lives in `src/app`, with route folders such as `blog`, `products`, and `admin` exposing page-level layouts and server components. Shared presentation logic sits in `src/components`, while reusable utilities (Supabase helpers, storage adapters, upload helpers) are under `src/lib`. Static assets are served from `public`, and environment/bootstrap notes live in `SUPABASE_SETUP.md` and `CMS_SETUP.md`. Database typings generated from Supabase are tracked in `database.types.ts`; update this file whenever you refresh types from the backend.

## Development & Build Commands
Run `npm run dev` for the Turbopack-powered local server with hot reload. Use `npm run build` before deploys to confirm the production bundle compiles cleanly, and `npm start` to serve the optimized build locally. If you add testing or linting scripts, wire them into `package.json` so they appear alongside these core commands.

## Coding Style & Naming Conventions
Follow the existing TypeScript strictness: export typed interfaces, annotate function params, and wrap layout props in `Readonly<>`. Import order should be React/Next hooks first, third-party packages next, and internal modules via `@/…` aliases last. Keep files kebab-case for components and camelCase for utilities. Client components must declare `"use client";` before other statements. Use 2-space indentation, favor small, composable JSX, and add focused comments only where logic is non-obvious.

## Testing Guidelines
Automated tests are not yet configured. When introducing them, prefer a colocated `__tests__` folder or `.test.tsx` files near the component under test. Ensure commands like `npm run test` or `npm run lint` exist and document any required environment setup. Aim for coverage on Supabase interactions and edge cases in rich-text or upload workflows.

## Commit & Pull Request Guidelines
Commit history mixes plain statements and conventional prefixes; standardize on `<type>: <summary>` (for example, `feat: add oem product grid`). Keep commits scoped to a single concern and include screenshots or screen recordings in PRs for UI changes. Every PR should summarize intent, list testing performed (`npm run build`, manual admin checks, etc.), and link relevant issues or Supabase migration notes. Request review once Supabase keys are secured via `.env.local` and secrets are excluded from the diff.

## Environment & Security Notes
Configure Supabase credentials in `.env.local`; never commit `.env*` files. Regenerate service keys only when necessary and update deploy secrets immediately. For local media uploads, ensure disk paths used by `uploadImage.ts` remain under project control to avoid leaking files outside the repo.
