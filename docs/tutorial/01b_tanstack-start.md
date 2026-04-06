# TanStack Start

## Create a Project

Run the starter CLI to scaffold a new app. The interactive flow asks for project name, package manager, and optional add-ons (Query, auth, DB integrations, etc.).

```bash
# TERM:
npx @tanstack/cli create my-app
```

## Non-Interactive

Use flags to skip prompts or add integrations up-front.

```bash
# Defaults only (TanStack Start + file-router)
npx @tanstack/cli create my-app -y

# With add-ons (Query, auth, DB tooling)
npx @tanstack/cli create my-app --add-ons tanstack-query,clerk,drizzle

# Router-only SPA (no SSR)
npx @tanstack/cli create my-app --router-only
```

## Run the Project

After creation install deps (if not installed automatically) and start the dev server:

```bash
# TERM:
cd my-app
pnpm install
pnpm dev
# Open http://localhost:3000
```

## Environment Variables

Some add-ons (auth, DB hosts, API keys) require env vars. After creation:

```bash
# TERM:
cp .env.example .env
# Edit .env with your values
```

## Project Structure

A typical TanStack Start project (with file-router) looks like:

```txt
my-app/
├── src/
│   ├── routes/          # File-based routing (layouts & pages)
│   │   ├── __root.tsx   # Root layout / providers
│   │   ├── index.tsx    # Home page
│   │   └── posts.tsx    # Example page using TanStack Query
│   └── integrations/    # Add-on integration code (auth, db, etc.)
├── .tanstack.json       # CLI config
└── .env.example         # Required env vars
```
