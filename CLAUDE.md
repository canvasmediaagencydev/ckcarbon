# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` (uses Next.js with Turbopack)
- **Build**: `npm run build` (uses Next.js with Turbopack)
- **Production server**: `npm start`

## Project Architecture

This is a Next.js 15 application using the App Router architecture with TypeScript and Tailwind CSS. The project appears to be a corporate website for CKCarbon with sections for products, services, and company information.

### Key Architecture Points

- **Framework**: Next.js 15 with App Router (`src/app/` directory)
- **Styling**: Tailwind CSS v4 with custom Thai font (Noto Sans Thai)
- **Database**: Supabase integration with TypeScript types in `database.types.ts`
- **Components**: Modular React components in `src/components/`
- **Path Mapping**: Uses `@/*` alias for `./src/*` imports

### Project Structure

```
src/
├── app/
│   ├── layout.tsx    # Root layout with Thai font configuration
│   ├── page.tsx      # Main homepage importing all sections
│   └── globals.css   # Global styles
└── components/       # Reusable UI components
    ├── Navbar.tsx
    ├── HeroSection.tsx
    ├── AboutUsSection.tsx
    ├── VisionCommitmentSection.tsx
    ├── OEMServiceSection.tsx
    ├── ProductsSection.tsx
    ├── TestimonialsSection.tsx
    ├── BlogSection.tsx
    ├── Footer.tsx
    └── ContactWidget.tsx
```

### Technology Stack

- **Frontend**: React 19, Next.js 15, TypeScript 5
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: React Icons
- **Database**: Supabase
- **Build Tool**: Turbopack (Next.js built-in)

### Component Pattern

The main page (`src/app/page.tsx`) follows a single-page application pattern, importing and rendering section components in sequence. Each component is self-contained and exported as default from its respective file.

### Database Integration

The project includes Supabase integration with generated TypeScript types in `database.types.ts`. The database schema appears to be empty (no tables defined yet) but the type structure is ready for future database additions.