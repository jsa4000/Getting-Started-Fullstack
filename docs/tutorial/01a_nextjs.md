# Next.js

## Create a Project

```bash
pnpm create next-app@ next-app
```

Use the interactive prompts to customize your project setup. For example:

```txt
✔ Would you like to use the recommended Next.js defaults? › No, customize settings
✔ Would you like to use TypeScript? … No / Yes
✔ Which linter would you like to use? › Biome
✔ Would you like to use React Compiler? … No / Yes
✔ Would you like to use Tailwind CSS? … No / Yes
✔ Would you like your code inside a `src/` directory? … No / Yes
✔ Would you like to use App Router? (recommended) … No / Yes
✔ Would you like to customize the import alias (`@/*` by default)? … No / Yes
✔ Would you like to include AGENTS.md to guide coding agents to write up-to-date Next.js code? … No / Yes
Creating a new Next.js app in /workspace/next-app.
```

## Run the Project

```bash
cd next-app

pnpm install
pnpm dev
# Open http://localhost:3000
```

## Demo

This short demo contains minimal, copy-pasteable examples you can drop into an App Router project (the `app/` directory). They demonstrate server components (default in App Router), server actions (form handlers), API routes, and the metadata/SEO API.

### Server component (server-side by default)

Server components are the default in the App Router, so if parent components don't have `use client` at the top, every component is a server component. They run on the server and can fetch data, access secrets, and return JSX.

Create `app/components/CurrentTime.tsx`:

```tsx
export default function CurrentTime() {
  const now = new Date().toISOString();
  return (
    <div>
      <strong>Server time:</strong> {now}
    </div>
  );
}
```

Use it from a page (for example `app/page.tsx`):

```tsx
import CurrentTime from "./components/CurrentTime";

export default function Home() {
  return (
    <main>
      <h1>Home</h1>
      <CurrentTime />
    </main>
  );
}
```

Server components can run `server-only` code (DB calls, secrets, etc.) and return JSX directly.

### Server action (form handler)

Create a simple server action at `app/contact/actions.ts` and consume it from a page:

```tsx
// app/contact/actions.ts
export async function sendContact(formData: FormData) {
  "use server";
  const name = formData.get("name")?.toString() ?? "";
  // Do server-side work (save to DB, send email, etc.)
  await fetch("https://httpbin.org/post", {
    method: "POST",
    body: JSON.stringify({ name }),
    headers: { "Content-Type": "application/json" },
  });
}
```

```tsx
// app/contact/page.tsx
import { sendContact } from "./actions";

export default function ContactPage() {
  return (
    <form action={sendContact}>
      <label>
        Name
        <input name="name" />
      </label>
      <button type="submit">Send</button>
    </form>
  );
}
```

When the form is submitted, the `sendContact` function runs on the server — it never ships as client JS.

### API route (app/api)

Create `app/api/hello/route.ts`:

```ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Hello from API route" });
}
```

Consume the API from a server component:

```tsx
export default async function Page() {
  const res = await fetch("http://localhost:3000/api/hello");
  const data = await res.json();
  return <div>{data.message}</div>;
}
```

(When calling internal API routes from server components you can use an absolute URL during development; for production prefer building the URL from environment variables or using internal helpers.)

### Async inline example (get all posts)

You can define `async` helper functions inline in the same server component file. This is handy for small data-fetching helpers that are only used by one page.

```tsx
// app/posts/page.tsx
async function getPosts() {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
    // cache/revalidate options (optional)
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

export default async function PostsPage() {
  const posts = await getPosts();
  return (
    <main>
      <h1>Posts (example)</h1>
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

This pattern keeps the data-fetching helper close to the component that uses it and leverages server-side rendering and caching provided by Next.js.

### SEO / metadata

Add per-page metadata by exporting `metadata` (or `generateMetadata`) from a page or layout.

```ts
// app/blog/page.tsx
export const metadata = {
  title: 'Demo — Blog',
  description: 'A short demo of the Next.js metadata API',
};

export default function Page() {
  return <div>Blog index</div>;
}
```

For dynamic data, use `generateMetadata`:

```ts
export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);
  return { title: post.title, description: post.excerpt };
}
```

### Client component quick note

If a component needs browser APIs or interactivity, mark it as a client component at the top with `use client`:

```tsx
"use client";
import { useState } from "react";

export default function Counter() {
  const [n, setN] = useState(0);
  return <button onClick={() => setN((x) => x + 1)}>Count: {n}</button>;
}
```

### Try it

- Create the files above under `app/` in a Next.js App Router project.
- Run the dev server: `pnpm dev` and open `http://localhost:3000`.
- Experiment: submit the contact form, inspect the API at `/api/hello`, and verify metadata in page source / browser devtools.

These examples are intentionally minimal. Want me to also scaffold an example `app/` folder in this repo with all files created and working? I can add that next.
