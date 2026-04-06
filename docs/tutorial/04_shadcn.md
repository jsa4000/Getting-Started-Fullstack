# Shadcn UI

**Shadncn** is a set of beautifully designed components that you can customize, extend, and build on.s

For further information go to [shadcn website](https://ui.shadcn.com).

## Installation

The installation instructions for Next.js are available on the [shadcn website](https://ui.shadcn.com/docs/installation/next).

Follow the prompts to set up your Next.js project with shadcn.

```bash
# TERM:
pnpm dlx shadcn@latest init

# For noe use radix component library and nova preset
# ✔ Select a component library › Radix
# ✔ Which preset would you like to use? › Nova
```

You can also use the following command to initialize your Next.js project with shadcn:

```bash

# You can create projeto usnig a preset and using the website https://ui.shadcn.com/create
pnpm dlx shadcn@latest init --preset [CODE] --template next

# examples

# You can use directly the shadcn to initialize your Next.js project with the following command
pnpm dlx shadcn@latest init --preset b43wxiCwt --template next

# If you want to initialize a monorepo with turborepo and tanstack start, use the following command
pnpm dlx shadcn@latest init --preset b43wxiCwt --template start --monorepo

```

## Components

After the installation, you can start adding components to your project. For example, to add a button component, run the following command:

```bash
# TERM:

# To add components to your project, run the following command:
pnpm dlx shadcn@latest add button label badge
```

Or you can install all shadnc componentes at once by using `-a` flag.

```bash
# TERM:

# To add all components to your project, run the following command:
pnpm dlx shadcn@latest add -a
```

Create a `CardDemo` component in the `components` folder and add the following code to it:

```ts
// COPY: next-app/src/components/card-demo.tsx
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function CardDemo() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
        <CardAction>
          <Button variant="link">Sign Up</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input id="password" type="password" required />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full">
          Login
        </Button>
        <Button variant="outline" className="w-full">
          Login with Google
        </Button>
      </CardFooter>
    </Card>
  )
}
```

Add CardDemo component to main `page.tsx`.

```ts
// COPY: next-app/src/app/page.tsx
import CardDemo from "@/components/card-demo";

export default function Home() {
  return (
    <CardDemo />
  );
}
```

You can add darkmode in main `layout.tsx` file by adding the `dark` class to the `html` element.

```ts
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
```

## Tweaking the styles

Go to [tweakcn website](https://tweakcn.com/editor/theme) to customize the styles of the components.

Select the theme you want to customize and click on the "Code" button to get the URL or CSS code of the customized theme.

```css
/* COPY: next-app/src/app/globals.css */
@import "tailwindcss";

@custom-variant dark (&:is(.dark *));

:root {
  --background: oklch(0.9818 0.0054 95.0986);
  --foreground: oklch(0.3438 0.0269 95.7226);
  --card: oklch(0.9818 0.0054 95.0986);
  --card-foreground: oklch(0.1908 0.002 106.5859);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.2671 0.0196 98.939);
  --primary: oklch(0.6171 0.1375 39.0427);
  --primary-foreground: oklch(1 0 0);
  --secondary: oklch(0.9245 0.0138 92.9892);
  --secondary-foreground: oklch(0.4334 0.0177 98.6048);
  --muted: oklch(0.9341 0.0153 90.239);
  --muted-foreground: oklch(0.6059 0.0075 97.4233);
  --accent: oklch(0.9245 0.0138 92.9892);
  --accent-foreground: oklch(0.2671 0.0196 98.939);
  --destructive: oklch(0.1908 0.002 106.5859);
  --destructive-foreground: oklch(1 0 0);
  --border: oklch(0.8847 0.0069 97.3627);
  --input: oklch(0.7621 0.0156 98.3528);
  --ring: oklch(0.6171 0.1375 39.0427);
  --chart-1: oklch(0.5583 0.1276 42.9956);
  --chart-2: oklch(0.6898 0.1581 290.4107);
  --chart-3: oklch(0.8816 0.0276 93.128);
  --chart-4: oklch(0.8822 0.0403 298.1792);
  --chart-5: oklch(0.5608 0.1348 42.0584);
  --sidebar: oklch(0.9663 0.008 98.8792);
  --sidebar-foreground: oklch(0.359 0.0051 106.6524);
  --sidebar-primary: oklch(0.6171 0.1375 39.0427);
  --sidebar-primary-foreground: oklch(0.9881 0 0);
  --sidebar-accent: oklch(0.9245 0.0138 92.9892);
  --sidebar-accent-foreground: oklch(0.325 0 0);
  --sidebar-border: oklch(0.9401 0 0);
  --sidebar-ring: oklch(0.7731 0 0);
  --font-sans:
    ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif,
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  --font-serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-mono:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
    "Courier New", monospace;
  --radius: 0.5rem;
  --shadow-x: 0;
  --shadow-y: 1px;
  --shadow-blur: 3px;
  --shadow-spread: 0px;
  --shadow-opacity: 0.1;
  --shadow-color: oklch(0 0 0);
  --shadow-2xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);
  --shadow-xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);
  --shadow-sm:
    0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 1px 2px -1px hsl(0 0% 0% / 0.1);
  --shadow: 0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 1px 2px -1px hsl(0 0% 0% / 0.1);
  --shadow-md:
    0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 2px 4px -1px hsl(0 0% 0% / 0.1);
  --shadow-lg:
    0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 4px 6px -1px hsl(0 0% 0% / 0.1);
  --shadow-xl:
    0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 8px 10px -1px hsl(0 0% 0% / 0.1);
  --shadow-2xl: 0 1px 3px 0px hsl(0 0% 0% / 0.25);
  --tracking-normal: 0em;
  --spacing: 0.25rem;
}

.dark {
  --background: oklch(0.2679 0.0036 106.6427);
  --foreground: oklch(0.8074 0.0142 93.0137);
  --card: oklch(0.2679 0.0036 106.6427);
  --card-foreground: oklch(0.9818 0.0054 95.0986);
  --popover: oklch(0.3085 0.0035 106.6039);
  --popover-foreground: oklch(0.9211 0.004 106.4781);
  --primary: oklch(0.6724 0.1308 38.7559);
  --primary-foreground: oklch(1 0 0);
  --secondary: oklch(0.9818 0.0054 95.0986);
  --secondary-foreground: oklch(0.3085 0.0035 106.6039);
  --muted: oklch(0.2213 0.0038 106.707);
  --muted-foreground: oklch(0.7713 0.0169 99.0657);
  --accent: oklch(0.213 0.0078 95.4245);
  --accent-foreground: oklch(0.9663 0.008 98.8792);
  --destructive: oklch(0.6368 0.2078 25.3313);
  --destructive-foreground: oklch(1 0 0);
  --border: oklch(0.3618 0.0101 106.8928);
  --input: oklch(0.4336 0.0113 100.2195);
  --ring: oklch(0.6724 0.1308 38.7559);
  --chart-1: oklch(0.5583 0.1276 42.9956);
  --chart-2: oklch(0.6898 0.1581 290.4107);
  --chart-3: oklch(0.213 0.0078 95.4245);
  --chart-4: oklch(0.3074 0.0516 289.323);
  --chart-5: oklch(0.5608 0.1348 42.0584);
  --sidebar: oklch(0.2357 0.0024 67.7077);
  --sidebar-foreground: oklch(0.8074 0.0142 93.0137);
  --sidebar-primary: oklch(0.325 0 0);
  --sidebar-primary-foreground: oklch(0.9881 0 0);
  --sidebar-accent: oklch(0.168 0.002 106.6177);
  --sidebar-accent-foreground: oklch(0.8074 0.0142 93.0137);
  --sidebar-border: oklch(0.9401 0 0);
  --sidebar-ring: oklch(0.7731 0 0);
  --font-sans:
    ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif,
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  --font-serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-mono:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
    "Courier New", monospace;
  --radius: 0.5rem;
  --shadow-x: 0;
  --shadow-y: 1px;
  --shadow-blur: 3px;
  --shadow-spread: 0px;
  --shadow-opacity: 0.1;
  --shadow-color: oklch(0 0 0);
  --shadow-2xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);
  --shadow-xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);
  --shadow-sm:
    0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 1px 2px -1px hsl(0 0% 0% / 0.1);
  --shadow: 0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 1px 2px -1px hsl(0 0% 0% / 0.1);
  --shadow-md:
    0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 2px 4px -1px hsl(0 0% 0% / 0.1);
  --shadow-lg:
    0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 4px 6px -1px hsl(0 0% 0% / 0.1);
  --shadow-xl:
    0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 8px 10px -1px hsl(0 0% 0% / 0.1);
  --shadow-2xl: 0 1px 3px 0px hsl(0 0% 0% / 0.25);
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);

  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
  --font-serif: var(--font-serif);

  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);

  --shadow-2xs: var(--shadow-2xs);
  --shadow-xs: var(--shadow-xs);
  --shadow-sm: var(--shadow-sm);
  --shadow: var(--shadow);
  --shadow-md: var(--shadow-md);
  --shadow-lg: var(--shadow-lg);
  --shadow-xl: var(--shadow-xl);
  --shadow-2xl: var(--shadow-2xl);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

Or run the following command to add the customized theme to your project:

```bash
pnpm dlx shadcn@latest add https://tweakcn.com/r/themes/claude.json
```

## Style Contacts

```tsx
// COPY: next-app/src/components/contact/contact-form.tsx
"use client";

import React, { useState } from "react";
import { sendContact } from "@/actions/contact";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { AlertCircleIcon, CheckCircle2Icon, SendIcon } from "lucide-react";

interface ContactFormProps {
  onSuccess: (name: string) => void;
}

export function ContactForm({ onSuccess }: ContactFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState("");

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsPending(true);
    const formData = new FormData(e.currentTarget);
    const result: { error?: unknown; success?: boolean } =
      await sendContact(formData);
    setIsPending(false);
    if (result?.error) {
      setError(
        typeof result.error === "string"
          ? result.error
          : JSON.stringify(result.error),
      );
    } else {
      setSubmittedName(name);
      setSubmitted(true);
      onSuccess(name);
      setName("");
      setEmail("");
      setMessage("");
    }
  }

  function handleSendAnother() {
    setSubmitted(false);
    setSubmittedName("");
  }

  return (
    <Card className="shadow-lg border-border/60 h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="h-5 w-1 rounded-full bg-primary" />
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Contact Form
          </span>
        </div>
        <CardTitle className="text-2xl font-semibold tracking-tight">
          Send a Message
        </CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          Have a question or just want to say hello? Drop us a line and
          we&apos;ll get back to you.
        </CardDescription>
      </CardHeader>

      <Separator className="mx-4 w-auto" />

      <CardContent className="pt-5">
        {submitted ? (
          <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-primary/15 ring-1 ring-primary/30">
              <CheckCircle2Icon className="size-7 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-base font-semibold">
                Thanks, {submittedName || "there"}!
              </p>
              <p className="text-sm text-muted-foreground">
                Your message has been received. We&apos;ll be in touch soon.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={handleSendAnother}>
              Send another message
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid gap-1.5">
              <Label htmlFor="name" className="text-sm font-medium">
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Smith"
                autoComplete="name"
                required
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="grid gap-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="message" className="text-sm font-medium">
                  Message
                </Label>
                <span
                  className={`text-xs tabular-nums transition-colors ${
                    message.length > 450
                      ? "text-destructive"
                      : "text-muted-foreground"
                  }`}
                >
                  {message.length} / 500
                </span>
              </div>
              <Textarea
                id="message"
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what's on your mind…"
                className="min-h-32 resize-none"
                required
                minLength={10}
                maxLength={500}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircleIcon />
                <AlertTitle>Something went wrong</AlertTitle>
                <AlertDescription className="wrap-break-word">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={isPending}
              className="w-full gap-2 font-medium"
            >
              <SendIcon className="size-4" />
              {isPending ? "Sending…" : "Send Message"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
```

```tsx
// COPY: next-app/src/components/contact/contact-card.tsx
import type { Contact } from "@/db/schema";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MailIcon } from "lucide-react";

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

const AVATAR_PALETTE = [
  "bg-amber-500/20 text-amber-400",
  "bg-orange-500/20 text-orange-400",
  "bg-rose-500/20 text-rose-400",
  "bg-emerald-500/20 text-emerald-400",
  "bg-sky-500/20 text-sky-400",
  "bg-violet-500/20 text-violet-400",
  "bg-teal-500/20 text-teal-400",
  "bg-pink-500/20 text-pink-400",
];

function getAvatarColor(name: string) {
  const hash = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
}

interface ContactCardProps {
  contact: Contact;
  isNew?: boolean;
}

export function ContactCard({ contact, isNew }: ContactCardProps) {
  return (
    <Card
      size="sm"
      className={cn(
        "transition-all duration-500 group/contact-card",
        isNew && "ring-2 ring-primary/40 bg-primary/5",
      )}
    >
      <CardContent className="flex gap-3 items-start">
        <Avatar size="lg" className="shrink-0 mt-0.5">
          <AvatarFallback
            className={cn(
              "font-semibold text-xs",
              getAvatarColor(contact.name),
            )}
          >
            {getInitials(contact.name)}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm leading-none">
              {contact.name}
            </span>
            {isNew && <Badge className="h-4 text-[10px] px-1.5">New</Badge>}
          </div>

          <a
            href={`mailto:${contact.email}`}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors truncate group/link"
          >
            <MailIcon className="size-3 shrink-0 opacity-60 group-hover/link:opacity-100 transition-opacity" />
            <span className="truncate">{contact.email}</span>
          </a>

          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mt-0.5">
            {contact.message}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
```

```tsx
// COPY: next-app/src/components/contact/contact-list.tsx
import type { Contact } from "@/db/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ContactCard } from "./contact-card";
import { InboxIcon } from "lucide-react";

interface ContactListProps {
  contacts: Contact[];
  latestId: number | null;
  isLoading?: boolean;
}

function ContactListSkeleton() {
  return (
    <div className="flex flex-col gap-3 p-1">
      {[1, 2, 3].map((i) => (
        <Card key={i} size="sm">
          <CardContent className="flex gap-3 items-start">
            <Skeleton className="size-10 rounded-full shrink-0 mt-0.5" />
            <div className="flex flex-col gap-2 flex-1">
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted ring-1 ring-border">
        <InboxIcon className="size-5 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium">No messages yet</p>
        <p className="text-xs text-muted-foreground">
          Be the first to send a message!
        </p>
      </div>
    </div>
  );
}

export function ContactList({
  contacts,
  latestId,
  isLoading,
}: ContactListProps) {
  return (
    <Card className="shadow-lg border-border/60 h-full flex flex-col">
      <CardHeader className="pb-4 shrink-0">
        <div className="flex items-center gap-2 mb-1">
          <div className="h-5 w-1 rounded-full bg-primary" />
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Inbox
          </span>
        </div>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            All Messages
          </CardTitle>
          {!isLoading && contacts.length > 0 && (
            <span className="text-sm tabular-nums text-muted-foreground">
              {contacts.length} {contacts.length === 1 ? "message" : "messages"}
            </span>
          )}
        </div>
      </CardHeader>

      <Separator className="mx-4 w-auto" />

      <ScrollArea className="flex-1 min-h-0 max-h-150">
        <div className="p-4">
          {isLoading ? (
            <ContactListSkeleton />
          ) : contacts.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="flex flex-col gap-3">
              {contacts.map((contact) => (
                <ContactCard
                  key={contact.id}
                  contact={contact}
                  isNew={contact.id === latestId}
                />
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
```

```tsx
// COPY: next-app/src/app/contact/page.tsx
"use client";

import { useEffect, useState } from "react";
import { getContacts } from "@/actions/contact";
import type { Contact } from "@/db/schema";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactList } from "@/components/contact/contact-list";
import { MessageSquareIcon } from "lucide-react";

export default function ContactPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [latestId, setLatestId] = useState<number | null>(null);

  useEffect(() => {
    getContacts().then((data) => {
      setContacts(data);
      setIsLoading(false);
    });
  }, []);

  async function handleSuccess(_name: string) {
    const data = await getContacts();
    setContacts(data);
    if (data.length > 0) {
      setLatestId(data[data.length - 1].id);
    }
  }

  return (
    <main className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Page header */}
        <div className="mb-10 space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/20 ring-1 ring-primary/30">
              <MessageSquareIcon className="size-4 text-primary" />
            </div>
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Get in touch
            </span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Contact Us
          </h1>

          <p className="max-w-xl text-base text-muted-foreground leading-relaxed">
            Have a question, feedback, or just want to say hi? We read every
            message and get back as fast as we can.
          </p>

          <div className="h-px w-16 bg-primary rounded-full" />
        </div>

        {/* Two-column layout */}
        <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
          <ContactForm onSuccess={handleSuccess} />
          <ContactList
            contacts={contacts}
            latestId={latestId}
            isLoading={isLoading}
          />
        </div>
      </div>
    </main>
  );
}
```
