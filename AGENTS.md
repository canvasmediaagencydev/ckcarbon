# Development Commands
- **Development**: `npm run dev` (Next.js with Turbopack)
- **Build**: `npm run build` (Next.js with Turbopack)
- **Production**: `npm start`
- **No lint/test commands configured** - add to package.json if needed

# Code Style Guidelines

## Imports & Formatting
- Use `@/*` path mapping for src imports (e.g., `@/lib/supabase`)
- Import React hooks first, then external libraries, then internal modules
- Use `"use client";` directive for client components with hooks/state

## TypeScript & Types
- Strict TypeScript enabled - always type interfaces and function parameters
- Use `Readonly<>` for props objects in layout components
- Define interfaces for complex data structures (e.g., API responses)

## Naming Conventions
- Components: PascalCase with descriptive names (e.g., `NavbarLogoSettings`)
- Functions: camelCase with descriptive verbs (e.g., `fetchLogoSettings`)
- Constants: UPPER_SNAKE_CASE for environment variables
- Files: kebab-case for components, camelCase for utilities

## Error Handling
- Use try/catch blocks for async operations
- Log errors with `console.error()` including context
- Handle Supabase errors gracefully with user feedback

## React Patterns
- Use `useEffect` with dependency arrays for side effects
- Implement proper cleanup in useEffect return functions
- Use Framer Motion for animations with consistent transition patterns
- State management with useState for local component state