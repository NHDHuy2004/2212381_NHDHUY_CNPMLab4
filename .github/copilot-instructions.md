# Copilot Instructions

## Project

Next.js 16 lab project for CNPMM (CTK44).

Student owner: Nguyễn Hồ Đức Huy (MSSV 2212381).

Repository app: `simple-blog`.

UI content is in Vietnamese.

> ⚠️ **Next.js 16 has breaking changes** from previous versions. APIs, conventions, and file structure may differ from training data. Read `node_modules/next/dist/docs/` before writing code. Heed deprecation notices.

## Commands

```bash
npm run dev       # Start dev server at http://localhost:3000
npm run build     # Production build
npm run lint      # ESLint
```

There is no test suite.

## Architecture

- **App Router** (`src/app/`) - pages use the Next.js App Router with React Server Components by default.
- **Proxy** is implemented in `src/proxy.ts`.
- **Auth Server Actions** are in `src/app/actions/auth.ts` and should keep `"use server"`.
- **Auth callback route** is in `src/app/auth/callback/route.ts`.
- **Supabase helpers** are in `src/lib/supabase/` (`client.ts`, `server.ts`, `middleware.ts`).
- **Types** are defined in `src/types/` (current schema: `src/types/database.ts`) and imported with `@/types/`.
- **UI components** are in `src/components/` and grouped by domain (`auth`, `dashboard`, `layout`, `posts`, `profile`).

## Key Conventions

### `proxy.ts` replaces `middleware.ts` (Next.js 16 breaking change)
`middleware.ts` is deprecated in Next.js 16. Use `src/proxy.ts` with a `proxy` named export:

```ts
// src/proxy.ts
export async function proxy(request: NextRequest) { ... }
export const config = { matcher: [...] }
```

### Path aliases
All imports use `@/` as the root alias (maps to the project root). Never use relative paths that go up more than one level.

```ts
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
```

### Class merging
Always use the `cn()` helper from `@/lib/utils` to merge Tailwind classes:

```ts
import { cn } from "@/lib/utils";
<div className={cn("base-class", conditional && "extra-class")} />
```

### Zod validation in Server Actions
Server Actions validate input with Zod and return a typed `ActionState` object:

```ts
export interface ActionState {
  success: boolean;
  errors?: { [field: string]: string[] };
}
```

Use `schema.safeParse()` and `result.error.flatten().fieldErrors` for field-level errors.

### shadcn/ui
- There is no shadcn/ui structure in the current codebase.
- If introducing shadcn later, keep existing project style and architecture consistent.

### Tailwind CSS v4
This project uses Tailwind v4 with `@tailwindcss/postcss`. Config is CSS-based (in `app/globals.css`), not `tailwind.config.js`.

### Language
UI-facing strings and comments are in **Vietnamese** (`lang="vi"` on `<html>`).
# Copilot Instructions

## Project

Next.js 16 lab project for CNPMM (CTK44).

Student owner: Nguyễn Hồ Đức Huy (MSSV 2212381).

Repository app: `simple-blog`.

UI content is in Vietnamese.

> ⚠️ **Next.js 16 has breaking changes** from previous versions. APIs, conventions, and file structure may differ from training data. Read `node_modules/next/dist/docs/` before writing code. Heed deprecation notices.

## Commands

```bash
npm run dev       # Start dev server at http://localhost:3000
npm run build     # Production build
npm run lint      # ESLint
```

There is no test suite.

## Architecture

- **App Router** (`src/app/`) - pages use the Next.js App Router with React Server Components by default.
- **Proxy** is implemented in `src/proxy.ts`.
- **Auth Server Actions** are in `src/app/actions/auth.ts` and should keep `"use server"`.
- **Auth callback route** is in `src/app/auth/callback/route.ts`.
- **Supabase helpers** are in `src/lib/supabase/` (`client.ts`, `server.ts`, `middleware.ts`).
- **Types** are defined in `src/types/` (current schema: `src/types/database.ts`) and imported with `@/types/`.
- **UI components** are in `src/components/` and grouped by domain (`auth`, `dashboard`, `layout`, `posts`, `profile`).

## Key Conventions

### `proxy.ts` replaces `middleware.ts` (Next.js 16 breaking change)
`middleware.ts` is deprecated in Next.js 16. Use `src/proxy.ts` with a `proxy` named export:

```ts
// src/proxy.ts
export async function proxy(request: NextRequest) { ... }
export const config = { matcher: [...] }
```

### Path aliases
All imports use `@/` as the root alias (maps to the project root). Never use relative paths that go up more than one level.

```ts
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
```

### Class merging
Always use the `cn()` helper from `@/lib/utils` to merge Tailwind classes:

```ts
import { cn } from "@/lib/utils";
<div className={cn("base-class", conditional && "extra-class")} />
```

### Zod validation in Server Actions
Server Actions validate input with Zod and return a typed `ActionState` object:

```ts
export interface ActionState {
  success: boolean;
  errors?: { [field: string]: string[] };
}
```

Use `schema.safeParse()` and `result.error.flatten().fieldErrors` for field-level errors.

### shadcn/ui
- There is no shadcn/ui structure in the current codebase.
- If introducing shadcn later, keep existing project style and architecture consistent.

### Tailwind CSS v4
This project uses Tailwind v4 with `@tailwindcss/postcss`. Config is CSS-based (in `app/globals.css`), not `tailwind.config.js`.

### Language
UI-facing strings and comments are in **Vietnamese** (`lang="vi"` on `<html>`).
