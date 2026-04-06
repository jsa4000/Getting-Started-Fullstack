# Zod

> This tutorial targets **Zod v4** (`zod@^4.0.0`). v4 differences are called out inline where they differ from v3.

## Install

```bash
pnpm add zod
```

## Define a Schema

Primitives map directly to TypeScript types:

```ts
import { z } from "zod";

z.string();
z.number();
z.boolean();
z.date();
z.undefined();
z.null();
z.unknown();
z.any();
```

Combine them into an object schema:

```ts
const UserSchema = z.object({
  name: z.string(),
  age: z.number(),
  active: z.boolean(),
});
```

## Parse Data

`.parse()` returns the validated value or **throws** a `ZodError`:

```ts
UserSchema.parse({ name: "Ana", age: 30, active: true }); // ✅ returns the object
UserSchema.parse({ name: "Ana", age: "30" }); // ❌ throws ZodError
```

`.safeParse()` never throws — it returns a discriminated union:

```ts
const result = UserSchema.safeParse({ name: "Ana", age: "30" });

if (result.success) {
  console.log(result.data); // ✅ typed as { name: string; age: number; active: boolean }
} else {
  console.log(result.error.issues); // ❌ array of ZodIssue
}
```

The error object exposes `.issues`, each with a `code`, `path`, and `message`:

```ts
// result.error.issues =>
// [
//   {
//     code: "invalid_type",
//     expected: "number",
//     received: "string",
//     path: ["age"],
//     message: "Invalid input: expected number, received string"
//   }
// ]
```

Call `UserSchema.safeParse` with a bad payload in your REPL or a quick script and `console.log(result.error.issues)` to see the structure yourself.

## Infer TypeScript Types

Use `z.infer` to extract the static type from a schema. This keeps your runtime schema and TypeScript types in sync with a single source of truth:

```ts
type User = z.infer<typeof UserSchema>;
// => { name: string; age: number; active: boolean }

function greet(user: User) {
  return `Hello, ${user.name}`;
}
```

Hover over `User` in your editor to verify the inferred type matches the schema.

## String Validations

Chain refinements directly on `z.string()`:

```ts
z.string().min(2); // ✅ at least 2 chars
z.string().max(100); // ✅ at most 100 chars
z.string().length(6); // ✅ exactly 6 chars
z.string().regex(/^[a-z]+$/); // ✅ lowercase letters only
z.string().trim(); // ✅ strips leading/trailing whitespace before validation
```

**v4: top-level string formats** — promoted to standalone functions. The method equivalents (`z.string().email()`, etc.) still work but are **deprecated** and will be removed in a future major:

```ts
// ✅ v4 style
z.email();
z.url();
z.uuid(); // alias for z.uuidv4()
z.uuidv4();
z.uuidv7();
z.iso.date(); // "2024-01-15"
z.iso.datetime(); // "2024-01-15T10:30:00Z"
z.iso.time(); // "10:30:00"

// ❌ deprecated in v4
z.string().email();
z.string().url();
z.string().uuid();
```

Test it by running `z.email().parse("not-an-email")` in a script — you should see a `ZodError` with `code: "invalid_format"`.

## Number Validations

Range checks:

```ts
z.number().gt(0); // strictly greater than 0
z.number().lt(100); // strictly less than 100
z.number().gte(0); // >= 0  (alias: .min())
z.number().lte(100); // <= 100 (alias: .max())
z.number().int(); // must be an integer
z.number().positive();
z.number().nonnegative();
```

**v4: numeric formats** — top-level helpers with built-in min/max constraints:

```ts
z.int(); // [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]
z.float32(); // 32-bit float range
z.float64(); // 64-bit float range
z.int32(); // [-2147483648, 2147483647]
z.uint32(); // [0, 4294967295]
```

Try `z.uint32().parse(-1)` — it should throw because `-1` is outside the unsigned range.

## Object Methods

Build on a base schema without mutating it:

```ts
const BaseUser = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  role: z.string(),
  createdAt: z.iso.datetime(),
});

// Add fields
const AdminUser = BaseUser.extend({ permissions: z.array(z.string()) });

// Keep only some fields
const PublicUser = BaseUser.pick({ id: true, name: true });

// Remove a field
const UserWithoutRole = BaseUser.omit({ role: true });

// Make all fields optional (useful for PATCH endpoints)
const UserPatch = BaseUser.partial();

// Make specific fields optional
const UserPatchName = BaseUser.partial({ name: true, email: true });

// Mark optional fields as required again
const FullUser = BaseUser.required();
```

Derive `PublicUser` with `.pick()`, then call `.parse({ id: "1", name: "Ana" })` — verify that extra fields like `email` are stripped or not required.

## Arrays

```ts
const TagsSchema = z.array(z.string());

z.array(z.string()).min(1); // at least 1 item
z.array(z.string()).max(10); // at most 10 items
z.array(z.string()).length(3); // exactly 3 items

// Shorthand from any schema
z.string().array(); // equivalent to z.array(z.string())
```

Parse an empty array against `.min(1)` to confirm it throws.

## Enums & Literals

Use `z.enum()` for a fixed set of string values:

```ts
const RoleSchema = z.enum(["admin", "editor", "viewer"]);

type Role = z.infer<typeof RoleSchema>;
// => "admin" | "editor" | "viewer"

// Access the enum values at runtime
RoleSchema.enum.admin; // => "admin"
RoleSchema.options; // => ["admin", "editor", "viewer"]

RoleSchema.parse("admin"); // ✅
RoleSchema.parse("owner"); // ❌ throws
```

> **v3 note:** `z.nativeEnum()` still works in v4 for TypeScript `enum` objects, but `z.enum()` is now the preferred approach.

**v4: multi-value literals** — pass an array to match any of several exact values:

```ts
const HttpSuccess = z.literal([200, 201, 202, 204]);
// => 200 | 201 | 202 | 204

// Previously required in Zod 3:
// z.union([z.literal(200), z.literal(201), z.literal(202), z.literal(204)])

HttpSuccess.parse(201); // ✅
HttpSuccess.parse(404); // ❌
```

## Optional, Nullable, Default

```ts
const ProfileSchema = z.object({
  name: z.string(),
  bio: z.string().optional(), // string | undefined
  avatar: z.string().nullable(), // string | null
  theme: z.string().default("light"), // string (fills in "light" if undefined)
});

type Profile = z.infer<typeof ProfileSchema>;
// => { name: string; bio?: string; avatar: string | null; theme: string }

// Omitting "theme" uses the default
ProfileSchema.parse({ name: "Ana", avatar: null });
// => { name: "Ana", avatar: null, theme: "light" }
```

Parse `{ name: "Ana", avatar: null }` and log the result to confirm `theme` defaults to `"light"`.

## Unions & Discriminated Unions

`z.union()` accepts any of the listed schemas:

```ts
const StringOrNumber = z.union([z.string(), z.number()]);

StringOrNumber.parse("hello"); // ✅
StringOrNumber.parse(42); // ✅
StringOrNumber.parse(true); // ❌
```

For a union where every branch shares a common discriminant field, `z.discriminatedUnion()` parses faster and gives cleaner error messages:

```ts
const ApiResult = z.discriminatedUnion("status", [
  z.object({ status: z.literal("success"), data: z.string() }),
  z.object({
    status: z.literal("error"),
    message: z.string(),
    code: z.number(),
  }),
]);

type ApiResult = z.infer<typeof ApiResult>;
// => { status: "success"; data: string } | { status: "error"; message: string; code: number }

ApiResult.parse({ status: "success", data: "OK" }); // ✅
ApiResult.parse({ status: "error", message: "Not found", code: 404 }); // ✅
ApiResult.parse({ status: "unknown" }); // ❌
```

Pass `{ status: "unknown" }` and inspect the error — you'll see a clear message about the unrecognized discriminant value.

## Custom Error Messages

**v4: unified `error` parameter** replaces the old `message`, `required_error`, `invalid_type_error`, and `errorMap` options:

```ts
// Simple string error
const NameSchema = z
  .string()
  .min(2, { error: "Name must be at least 2 characters." });

// ❌ Deprecated v3 style — still works but will be removed
// z.string().min(2, { message: "Name must be at least 2 characters." });

// Per-issue-type error using a function
const AgeSchema = z.number({
  error: (issue) =>
    issue.input === undefined ? "Age is required." : "Age must be a number.",
});

// Function for fine-grained control
const ScoreSchema = z.number({
  error: (issue) => {
    if (issue.code === "too_small")
      return `Score must be at least ${issue.minimum}.`;
  },
});
```

Run `NameSchema.safeParse("A")` and verify `result.error.issues[0].message` is your custom string.

## Error Formatting

**v4: `z.prettifyError()`** converts a `ZodError` into a human-readable multi-line string — no third-party library needed:

```ts
const FormSchema = z.object({
  username: z.string(),
  age: z.number(),
  scores: z.array(z.number().nonnegative()),
});

const result = FormSchema.safeParse({
  username: 42, // wrong type
  age: "thirty", // wrong type
  scores: [10, -5, 3], // -5 fails nonnegative
});

if (!result.success) {
  console.log(z.prettifyError(result.error));
}

// Output:
// ✖ Invalid input: expected string, received number
//   → at username
// ✖ Invalid input: expected number, received string
//   → at age
// ✖ Too small: expected number to be >=0
//   → at scores[1]
```

Run the snippet above in a script and compare the output to the raw `result.error.issues` array — `z.prettifyError` is what you'd display to a developer or log to a console.

## Transforms & Refinements

`.transform()` maps the validated output to a new value or type:

```ts
const TrimmedEmail = z.email().transform((val) => val.toLowerCase());

TrimmedEmail.parse("  Ana@Example.COM  "); // ✅ => "ana@example.com"

type Input = z.input<typeof TrimmedEmail>; // string (before transform)
type Output = z.output<typeof TrimmedEmail>; // string (after transform)
```

`.refine()` adds a custom boolean check. In **v4**, refinements are stored _inside_ the schema, so you can chain other methods after them:

```ts
const StrongPassword = z
  .string()
  .min(8)
  .refine((val) => /[A-Z]/.test(val), {
    error: "Must contain an uppercase letter.",
  })
  .refine((val) => /[0-9]/.test(val), { error: "Must contain a number." });

// ✅ In v4, .min() can come before or after .refine() — no more ZodEffects wrapping issue
```

For cross-field validation, refine on the whole object:

```ts
const SignupSchema = z
  .object({
    password: z.string().min(8),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    error: "Passwords do not match.",
    path: ["confirm"], // attach the error to the confirm field
  });

SignupSchema.parse({ password: "Secret1!", confirm: "Secret1!" }); // ✅
SignupSchema.parse({ password: "Secret1!", confirm: "wrong" }); // ❌
```

`.pipe()` chains two schemas — useful when you need to coerce then validate:

```ts
const CoercedAge = z
  .string()
  .transform((val) => parseInt(val, 10))
  .pipe(z.number().int().min(0).max(120));

CoercedAge.parse("25"); // ✅ => 25
CoercedAge.parse("abc"); // ❌ NaN fails the int() check
```

Test `SignupSchema.safeParse({ password: "Secret1!", confirm: "wrong" })` and check `result.error.issues[0].path` — it should be `["confirm"]`.

## Capstone: Validating a Next.js Server Action

Handle errors in server components by validating inputs with Zod and returning error details to the client. This keeps your server robust and your client informed without crashing.

```tsx
// `src/app/contact/page.tsx`
"use client";

import { useState } from "react";
import { sendContact } from "@/actions/contact";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const result = await sendContact(formData);
    if (result && result.error) {
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
      )}
    </div>
  );
}
```

Tie everything together with a real form action. Create `src/actions/contact.ts`:

```ts
// src/actions/contact.ts
"use server";

import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().min(2, { error: "Name must be at least 2 characters." }),
  email: z.email({ error: "Please enter a valid email address." }),
  message: z.string().min(10).max(500),
});

type ContactInput = z.infer<typeof ContactSchema>;

export async function sendContact(formData: FormData) {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  };

  const result = ContactSchema.safeParse(raw);

  if (!result.success) {
    return { error: z.prettifyError(result.error) };
  }

  const { name, email, message }: ContactInput = result.data;

  // Send the validated data (e.g. save to DB or send email)
  console.log("Contact from", name, email, message);

  return { success: true };
}
```

Consume it from a page (`src/app/contact/page.tsx`) — see [01a_nextjs.md](01a_nextjs.md) for the full page setup. The key pattern: pass raw `FormData` to the action, validate with `.safeParse()`, and return errors to the client without ever trusting the input.

Submit the form with an invalid email in the browser and verify the server logs the `z.prettifyError` output rather than crashing.

In order to properly pass the `name` value to the success message, we need to lift the `name` state up to the `ContactPage` component and update it on input change. The full `ContactPage` component would look like this:

```tsx
// `src/app/contact/page.tsx`
"use client";

import { useState } from "react";
import { sendContact } from "@/actions/contact";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const result = await sendContact(formData);
    if (result && result.error) {
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
              className="border px-2 py-1 rounded min-h-[80px]"
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
      )}
    </div>
  );
}
```

---

## v4 Highlights at a Glance

| Feature             | v4 API                       | v3 equivalent                           |
| ------------------- | ---------------------------- | --------------------------------------- |
| Email validation    | `z.email()`                  | `z.string().email()` _(deprecated)_     |
| URL validation      | `z.url()`                    | `z.string().url()` _(deprecated)_       |
| ISO date            | `z.iso.date()`               | `z.string().datetime()` _(deprecated)_  |
| Integer range       | `z.int32()`, `z.uint32()`    | `z.number().int()` + manual `.min/.max` |
| Float range         | `z.float32()`, `z.float64()` | manual `.min/.max`                      |
| Multi-value literal | `z.literal([200, 201])`      | `z.union([z.literal(200), …])`          |
| Error param         | `{ error: "…" }`             | `{ message: "…" }` _(deprecated)_       |
| Error formatting    | `z.prettifyError(err)`       | third-party `zod-validation-error`      |
| Env-style booleans  | `z.stringbool()`             | `z.coerce.boolean()` (limited)          |
| JSON Schema export  | `z.toJSONSchema(schema)`     | third-party `zod-to-json-schema`        |
| Performance         | ~14× faster string parsing   | baseline                                |
