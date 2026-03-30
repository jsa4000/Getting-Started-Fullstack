# TanStack Start

## Create a Project

Run the starter CLI to scaffold a new app. The interactive flow asks for project name, package manager, and optional add-ons (Query, auth, DB integrations, etc.).

```bash
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
cd my-app
pnpm install
pnpm dev
# Open http://localhost:3000
```

## Environment Variables

Some add-ons (auth, DB hosts, API keys) require env vars. After creation:

```bash
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

## Demo: Small copy-paste examples

These examples are intentionally minimal — drop them into `src/routes/` in a TanStack Start project.

### Root layout + TanStack Query provider

If you plan to use TanStack Query, create a root layout that provides the `QueryClient` to the app. Put this in `src/routes/__root.tsx`.

```tsx
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function Root({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <header>
          <h1>My TanStack Start App</h1>
        </header>
        <main>{children}</main>
      </div>
    </QueryClientProvider>
  );
}
```

Install the Query package if you didn't include the add-on:

```bash
pnpm add @tanstack/react-query
```

### Home page (file-based route)

Create `src/routes/index.tsx`:

```tsx
export default function Home() {
  return (
    <main>
      <h1>Home</h1>
      <p>Welcome to a TanStack Start app scaffolded with the CLI.</p>
    </main>
  );
}
```

### Fetching data with TanStack Query (client-side)

Create `src/routes/posts.tsx` to demonstrate a simple `useQuery` data fetch:

```tsx
import React from "react";
import { useQuery } from "@tanstack/react-query";

async function fetchPosts() {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts");
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

export default function Posts() {
  const { data: posts, isLoading, error } = useQuery(["posts"], fetchPosts);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading posts</div>;

  return (
    <main>
      <h1>Posts</h1>
      <ul>
        {posts.slice(0, 10).map((p: any) => (
          <li key={p.id}>
            <h3>{p.title}</h3>
            <p>{p.body}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
```

This pattern keeps the UI declarative and leverages TanStack Query's caching, revalidation, and devtools.

### Calling external APIs

For simple demos you can fetch external APIs from the client (as above). If your app needs server-side endpoints, add them following your chosen deployment/runtime strategy — the CLI can be configured to include server integrations via add-ons or manual setup.

## Add-ons and integrations

TanStack Start supports optional add-ons for common needs. Example add-ons include `tanstack-query` (React Query), `clerk` (auth), and `drizzle` (DB). You can enable them at project creation (`--add-ons`) or install/configure them later and wire them into `src/integrations/` and the root layout.

## Try it

Quick steps to try the examples locally:

```bash
# From this repo or a new project created above
cd my-app
pnpm install
pnpm dev
# Open http://localhost:3000 and visit /posts
```

## Next steps

- Read the [CLI Reference](./cli-reference.md) for all options
- See [Add-ons](./add-ons.md) for available integrations and setup notes

Want me to scaffold the example `src/routes/` files above in this repository? I can add them next.
