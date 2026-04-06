# Next.js

## Create a Project

```bash
# TERM:
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
# TERM:
cd next-app

pnpm install
pnpm dev
# Open http://localhost:3000
```

## Create Pages, Components, API Routes, and Server Actions

Create following structure under `src/`, to add server/client components, server actions and routes:

```txt
└── src
    ├── actions
    ├── app
    └── components
    └── db
```

```bash
# TERM:

# Create the recommended src/ hierarchy for a new Next.js app
mkdir -p src/{actions,app,components,db}
```

### Server component (server-side by default)

Server components are the default in the App Router, so if parent components don't have `use client` at the top, every component is a server component. They run on the server and can fetch data, access secrets, and return JSX.

Create `src/components/current-time.tsx`:

```tsx
// COPY: next-app/src/components/current-time.tsx
export default function CurrentTime() {
  const now = new Date().toISOString();
  return (
    <div>
      <strong>Server time:</strong> <span>{now}</span>
    </div>
  );
}
```

Use it from a page (for example `src/app/page.tsx`):

```tsx
// COPY: next-app/src/app/page.tsx
import CurrentTime from "@/components/current-time.tsx";

export default function Home() {
  return (
    <main>
      <h1>Home</h1>
      <CurrentTime />
    </main>
  );
}
```

Use [tailwind](https://tailwindcss.com) for styling (optional):

```tsx
// COPY: next-app/src/app/page.tsx
import CurrentTime from "@/components/current-time";

export default function Home() {
  return (
    <main>
      <h1 className="text-3xl font-bold">Home</h1>
      <CurrentTime />
    </main>
  );
}
```

Server components can run `server-only` code (DB calls, secrets, etc.) and return JSX directly.

Check html returned from the server in the browser devtools to verify that the time is rendered on the server and not sent as client JS.

### Server action (form handler)

Create a simple server action at `src/actions/contact.ts` and consume it from a page:

```ts
// COPY: next-app/src/actions/contact.ts
"use server";

export async function sendContact(formData: FormData) {
  const name = formData.get("name")?.toString() ?? "";
  // Do server-side work (save to DB, send email, etc.)
  await fetch("https://httpbin.org/post", {
    method: "POST",
    body: JSON.stringify({ name }),
    headers: { "Content-Type": "application/json" },
  });
}
```

Create a route `/contact` that uses the action (for example `src/app/contact/page.tsx`):

```tsx
// COPY: next-app/src/app/contact/page.tsx
import { sendContact } from "@/actions/contact";

export default function ContactPage() {
  return (
    <form action={sendContact} className="flex flex-row gap-2">
      <label>
        Name
        <input name="name" />
      </label>
      <button
        className="bg-sky-600 border min-w-[200px] hover:bg-sky-900"
        type="submit"
      >
        Send
      </button>
    </form>
  );
}
```

Go to `http://localhost:3000/contact`, fill out the form, and submit. Check the network tab in devtools to see the request to the server action and verify that it runs without shipping client JS.

When the form is submitted, the `sendContact` function runs on the server — it never ships as client JS.

### Client Component (for interactivity)

In client components you can use browser APIs and React hooks like `useState`. Mark a component as a client component by adding `"use client";` at the top:

```tsx
// COPY: next-app/src/app/contact/page.tsx
"use client";

import { useState } from "react";
import { sendContact } from "@/actions/contact";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await sendContact(formData);
    setSubmitted(true);
  }

  return (
    <div className="flex flex-col gap-2 max-w-sm mx-auto mt-10">
      {submitted ? (
        <div className="p-2">
          Thank you for contacting us, {name || "user"}!
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <label className="flex gap-2 items-center">
            Name
            <input
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border px-2 py-1 rounded"
              required
            />
          </label>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Send
          </button>
        </form>
      )}
    </div>
  );
}
```

### API route (app/api)

Create `src/app/api/health/route.ts`:

```ts
// COPY: next-app/src/app/api/health/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const randomValue = Math.floor(Math.random() * 1000);
  const isHealty = randomValue % 2 === 0;
  return NextResponse.json({ status: isHealty ? "OK" : "KO" });
}
```

Go to [http://localhost:3000/api/health](http://localhost:3000/api/health) access the API route you just created. You should see the JSON response.

Consume the API from a server component at `src/app/status/page.tsx`:

> The name of the component file doesn't matter, but it must be in a subdirectory of `app/` that isn't `api/` (for example `app/status/page.tsx`) to avoid being treated as an API route. Also components must export a React component as default, while API routes export request handlers (like `GET`, `POST`, etc.) — this is how Next.js distinguishes between the two.

```tsx
// COPY: next-app/src/app/status/page.tsx
export default async function Page() {
  const res = await fetch("http://localhost:3000/api/health");
  const data = await res.json();
  return (
    <div>
      <h1>Status Page</h1>
      {data.status === "OK" ? (
        <p className="text-green-500">System is healthy</p>
      ) : (
        <p className="text-red-500">System is unhealthy</p>
      )}
    </div>
  );
}
```

(When calling internal API routes from server components you can use an absolute URL during development; for production prefer building the URL from environment variables or using internal helpers.)

### Async inline example (get all posts)

You can define `async` helper functions inline in the same server component file. This is handy for small data-fetching helpers that are only used by one page.

Create following actions at `src/actions/posts.ts`:

```ts
// COPY: next-app/src/actions/posts.ts
"use server";

export async function getPosts() {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
    // cache/revalidate options (optional)
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

export async function getPost(id: string) {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Failed to fetch post");
  return res.json();
}
```

```tsx
// COPY: next-app/src/app/posts/page.tsx
import { getPosts } from "@/actions/posts";

export default async function PostsPage() {
  const posts = await getPosts();
  return (
    <main>
      <h1 className="text-2xl mb-2">Posts (example)</h1>
      <ul>
        {posts.slice(0, 10).map((p: any) => (
          <li className="flex flex-row mt-2 gap-2" key={p.id}>
            <h3 className="font-bold">{p.title}</h3>
            <p>{p.body}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
```

This pattern keeps the data-fetching helper close to the component that uses it and leverages server-side rendering and caching provided by Next.js.

Go to [http://localhost:3000/posts](http://localhost:3000/posts)

### Layouts

```tsx
// COPY: next-app/src/app/posts/layout.tsx
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <header className="p-4 mb-4">
        <h1 className="text-xl font-bold">My Blog</h1>
      </header>
      <main>{children}</main>
      <footer className="p-4 mt-4">&copy; 2024 My Blog</footer>
    </div>
  );
}
```

Layouts are reusable components that wrap pages and provide shared UI (headers, footers, etc.) and state. Create a `layout.tsx` file in any directory under `app/` to define a layout for that segment of the app.

## Slugs

```tsx
// COPY: next-app/src/app/posts/[id]/page.tsx
import { getPost } from "@/actions/posts";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) return notFound();
  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
      <p>{post.body}</p>
    </main>
  );
}
```

Test it by going to `http://localhost:3000/posts/1` (or any number from 1 to 100, since the example API has 100 posts). You should see the post details. If you go to a non-existent post like `http://localhost:3000/posts/999`, you should see the 404 page.

```tsx
// COPY: next-app/src/app/posts/page.tsx
import { getPosts } from "@/actions/posts";
import Link from "next/link";

export default async function PostsPage() {
  const posts = await getPosts();
  return (
    <main>
      <h1 className="text-2xl mb-2">Posts (example)</h1>
      <ul>
        {posts.slice(0, 10).map((p: any) => (
          <li className="flex flex-row mt-2 gap-2" key={p.id}>
            <Link
              href={`/posts/${p.id}`}
              className="font-bold underline text-blue-600 hover:text-blue-800"
            >
              {p.title}
            </Link>
            <p>{p.body}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
```

### SEO / metadata

Add per-page metadata by exporting `metadata` (or `generateMetadata`) from a page or layout.

```ts
// app/blog/page.tsx
export const metadata = {
  title: "Demo — Blog",
  description: "A short demo of the Next.js metadata API",
};
```

Check inspector / page source to verify that the title and description are rendered in the HTML head.

For dynamic data, use `generateMetadata`:

```ts
export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);
  return { title: post.title, description: post.excerpt };
}
```
