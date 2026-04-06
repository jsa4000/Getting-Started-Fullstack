# Drizzle ORM with PostgreSQL, Zod, and Next.js Server Actions

This tutorial will guide you through installing and configuring Drizzle ORM for PostgreSQL in a Next.js app, using Zod for validation and server actions for database operations.

---

## 1. Install Drizzle and PostgreSQL Driver

```bash
# TERM:
pnpm add drizzle-orm pg @t3-oss/env-nextjs dotenv dotenv-expand
pnpm add -D drizzle-kit tsx @types/pg
```

- `drizzle-orm`: The ORM itself.
- `drizzle-kit`: CLI for migrations (optional but recommended).
- `pg`: PostgreSQL driver.

---

## 2. Configure Drizzle

Rename `.env.example` to `.env` and add your PostgreSQL connection string:

```bash
# TERM:
cp ../.env.example ../.env
```

```txt
DATABASE_URL=postgres://postgres:postgres@localhost:5432/postgres
```

Create a database connection utility and configure environment variables.

```ts
// COPY: next-app/src/env.ts
import { createEnv } from "@t3-oss/env-nextjs";
import { config } from "dotenv";
import { expand } from "dotenv-expand";
import * as z from "zod";

// Next.js >= 13.4.4 supports runtime environment variables, but not lookup for previous paths.
expand(config({ path: "../.env", quiet: true }));

export const env = createEnv({
  server: {
    DATABASE_URL: z
      .url()
      .default("postgresql://postgres:postgres@localhost:5432/postgres"),
    // OPEN_AI_API_KEY: z.string().min(1),
  },
  client: {
    // Good
    NEXT_PUBLIC_BACKEND_URL: z.string().min(1).optional(),
    // Bad: NEXT_PUBLIC_BACKEND_URL environment variable must be initially set
    // NEXT_PUBLIC_BACKEND_URL: z.string().min(1),
  },
  // For Next.js >= 13.4.4, you only need to destructure client variables:
  experimental__runtimeEnv: {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
  },
});
```

**a. Create a database connection utility:**

Create `src/db/index.ts`:

```ts
// COPY: next-app/src/db/index.ts
import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "@/env";

// biome-ignore lint/style/noNonNullAssertion: skip
export const db = drizzle(env.DATABASE_URL!);
```

---

## 3. Define a Table (contacts)

Create `src/db/schema.ts`:

```ts
// COPY: next-app/src/db/schema.ts
import { pgTable, serial, varchar, text } from "drizzle-orm/pg-core";

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }).notNull(),
  message: text("message").notNull(),
});

export type Contact = typeof contacts.$inferSelect;
```

---

## 4. Run Migrations

Create a `drizzle.config.ts` file in the root of your project and add the following content.

> Rename .env.example to .env and update the `DATABASE_URL` with your PostgreSQL connection string.

```ts
// COPY: next-app/drizzle.config.ts
import { defineConfig } from "drizzle-kit";
import { env } from "@/env";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  migrations: {
    schema: "postgres",
  },
  strict: true,
  verbose: true,
});
```

**a. Initialize Drizzle Kit:**

```bash
# TERM:
npx drizzle-kit generate:pg
```

**b. Add migration scripts and run them:**

```bash
# TERM:
npx drizzle-kit push:pg
```

**Optional: Add scripts to `package.json` for convenience:**

```json
{
  "name": "my-app",
  "private": true,
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:studio": "drizzle-kit studio"
  }
}
```

```bash
# TERM:
pnpm run db:generate
pnpm run db:migrate
```

## 5. Use with Zod and Server Actions

**a. Zod Schema:**

Create a Zod schema for validation in `src/types/contact.ts`:

```ts
// COPY: next-app/src/types/contact.ts
import { z } from "zod";

export const ContactSchema = z.object({
  name: z.string().min(2, { error: "Name must be at least 2 characters." }),
  email: z.string().email({ error: "Please enter a valid email address." }),
  message: z.string().min(10).max(500),
});

export type ContactInput = z.infer<typeof ContactSchema>;
```

**b. Server Action Example (`src/actions/contact.ts`):**

```ts
// COPY: next-app/src/actions/contact.ts
"use server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { contacts } from "@/db/schema";
import { ContactSchema } from "@/types/contact";

// Alias for compatibility with previous code examples
export const sendContact = createContact;

export async function createContact(formData: FormData) {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  };
  const result = ContactSchema.safeParse(raw);
  if (!result.success) {
    return { error: result.error.format() };
  }
  const { name, email, message } = result.data;
  await db.insert(contacts).values({ name, email, message });
  return { success: true };
}

export async function getContacts() {
  return db.select().from(contacts);
}

export async function updateContact(
  id: number,
  data: z.infer<typeof ContactSchema>,
) {
  await db.update(contacts).set(data).where(eq(contacts.id, id));
}

export async function getContactById(id: number) {
  return db.select().from(contacts).where(eq(contacts.id, id));
}
```

Add following code in `src/app/contact/page.tsx` to use the server actions and display contacts:

```tsx
// COPY: next-app/src/app/contact/page.tsx
"use client";

import { useEffect, useState } from "react";
import { getContacts, sendContact } from "@/actions/contact";
import type { Contact } from "@/db/schema";

export default function ContactPage() {
  // Client state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Client-side contacts state
  const [contacts, setContacts] = useState<Contact[]>([]);

  // Fetch contacts on mount
  useEffect(() => {
    (async () => {
      const data = await getContacts();
      setContacts(data);
    })();
  }, []);

  // Refetch contacts only after a successful submit
  useEffect(() => {
    if (!submitted) return;
    (async () => {
      const data = await getContacts();
      setContacts(data);
    })();
  }, [submitted]);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const result: { error?: unknown; success?: boolean } =
      await sendContact(formData);
    if (result?.error) {
      setError(
        typeof result.error === "string"
          ? result.error
          : JSON.stringify(result.error),
      );
      setSubmitted(false);
    } else {
      setSubmitted(true);
    }
  }

  return (
    <div className="flex flex-col gap-2 max-w-sm mx-auto mt-10">
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
        <label className="flex gap-2 items-center">
          Email
          <input
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border px-2 py-1 rounded"
            required
          />
        </label>
        <label className="flex flex-col gap-1">
          Message
          <textarea
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="border px-2 py-1 rounded min-h-20"
            required
            minLength={10}
            maxLength={500}
          />
        </label>
        {/* Error message */}
        {error && (
          <div className="text-red-600 text-sm border border-red-200 bg-red-50 rounded p-2">
            {error}
          </div>
        )}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </form>

      {submitted && (
        <div className="p-2">
          Thank you for contacting us, {name || "user"}!
        </div>
      )}

      <div className="mt-8">
        <h2 className="font-bold mb-2">All Contacts</h2>
        <ul className="space-y-2">
          {contacts.map((contact) => (
            <li key={contact.id} className="border rounded p-2">
              <div>
                <span className="font-semibold">Name:</span> {contact.name}
              </div>
              <div>
                <span className="font-semibold">Email:</span> {contact.email}
              </div>
              <div>
                <span className="font-semibold">Message:</span>{" "}
                {contact.message}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

---

## 6. Example Usage in a Page

You can use `createContact` in your form’s server action, and `getContacts` to list all contacts.

---

**Summary:**

- Install Drizzle and dependencies
- Configure the connection
- Define your table schema
- Run migrations
- Use Drizzle in server actions with Zod validation

For more, see the [official Drizzle docs](https://orm.drizzle.team/docs/get-started/postgresql-new).
