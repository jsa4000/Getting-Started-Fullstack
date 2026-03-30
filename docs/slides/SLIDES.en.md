---
# https://marpit.marp.app/markdown
marp: true
title: Fullstack
description: A comprehensive guide to full-stack development, covering both front-end and back-end technologies, as well as essential tools and skills for modern web development.
author: jsa4000
theme: dark
paginate: true
headingDivider: 0
class:
  - lead
  - invert
header: FullStack Development
footer: © 2026 Javier Santos - All rights reserved
---

<!--
_paginate: skip
_header: ""
_footer: ""
_class: title
-->

# FullStack Development

## A comprehensive guide to full-stack development

![bg opacity:.1 ](https://picsum.photos/720?image=27)

---

<!-- backgroundImage: "linear-gradient(to bottom, #000000, #222021)" -->

## Full-Stack Development

![bg opacity:.1 grayscale:1](https://picsum.photos/720?image=27)

**Full-Stack Development** is the process of developing a web application on both the **client-side** (**front-end**) and **server-side** (**back-end**). A Full-Stack Developer is proficient in all layers of web development, enabling them to handle a project from concept to production.

Full-stack isn’t tied to a **specific** tech stack; it refers to any development that covers both front-end and back-end. In fact, `MEAN` and `MERN` are subsets of full-stack development; they are full-stack technology combos.

---

![drop-shadow opacity:.9 bg left](../images/2-Web-Application-Layers.webp)
![bg opacity:.1 grayscale:1](https://picsum.photos/720?image=27)

## Front-end (Client-Side)

This is the user-facing layer, built using technologies that run in the user’s browser. It handles the user interface (UI) and user experience (UX).

---

## Client-Side Frameworks (UI & State)

These run primarily in the user's browser to create interactive user interfaces.

- **React**: Developed by Meta, it is technically a library focused on building reusable UI components using a "Virtual DOM" for efficient updates. It is widely adopted and has a massive ecosystem of third-party tools.
- **Angular**: A comprehensive, "batteries-included" framework by Google. It uses TypeScript by default and provides built-in solutions for routing, forms, and state management, making it a standard for large-scale enterprise applications.
- **Svelte**: Unlike React or Angular, Svelte is a compiler. It shifts work from the browser to a build step, resulting in highly optimized, "vanilla" JavaScript with minimal runtime overhead and excellent performance.

---

<style>
section {
  font-size: 24px;
}
</style>

![bg right:33%](https://picsum.photos/720?image=3)
![bg](https://picsum.photos/720?image=20)

## Backend (Server-Side)

The Back-end is the engine of the application, handling business logic, user authentication, and serving data to the frontend. It consists of three sub-layers:

1. **API Layer**: Receives requests from the frontend (via HTTP) and sends responses.
2. **Business Logic Layer**: The core processing logic that determines the application’s functionality.
3. **Other Technologies**: Server-side languages (Node.js, Python, Java, PHP) and frameworks (Express.js, Django, Ruby on Rails).

---

## Server-Side Frameworks (Backend & APIs)

These run on a server or at the "edge" to handle data, authentication, and API requests.

- **Express**: The industry veteran for Node.js. It is a minimalist, unopinionated framework that gives developers total freedom to structure their applications as they see fit.
- **NestJS**: An enterprise-grade framework built on top of Express (or Fastify). It enforces a modular architecture inspired by Angular, utilizing decorators and dependency injection to keep large codebases maintainable.
- **Hono**: A modern, ultrafast framework designed specifically for "Edge" runtimes like Cloudflare Workers, Bun, and Deno. It is extremely lightweight (under 14kB) and uses standard Web APIs for maximum speed.

---

## Full-Stack & Specialized Frameworks

These often bridge the gap between frontend and backend, offering specialized rendering strategies.

- **Next.js**: The most popular React-based full-stack framework. It simplifies complex features like Server-Side Rendering (SSR), Static Site Generation (SSG), and API routes, making it the standard for production-ready React apps.
- **Astro**: A "framework-agnostic" tool designed for content-heavy sites (like blogs or documentation). It uses an "Islands Architecture" to ship zero JavaScript by default, only hydrating interactive parts of the page.
- **TanStack**: While best known for TanStack Query (data fetching), this ecosystem has expanded into TanStack Start, a full-stack framework designed to provide a highly type-safe, developer-friendly alternative to Next.js.

---

![bg opacity:.1 grayscale:1](https://picsum.photos/720?image=27)

### Database (Storage Layer)

A database is responsible for persistent data storage, retrieval, and management.

Technologies: Relational databases (MySQL, PostgreSQL) or NoSQL databases (MongoDB, Redis).

## Stacks

### MEAN vs MERN

## SSR (Server-Side Rendering) vs SSG (Static Site Generation) vs CSR (Client-Side Rendering)

---

## Server Components

<div class="columns">
<div class="columns-left">

### Column 1

Content 1

```yaml
marp: true
style: |
  .columns {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
  }
  .columns-left {
    background: yellow;
  }
  .columns-right {
    background: beige;
  }
```

</div>
<div class="columns-right">

### Tantask Start

In tanstack start, you can create server components by adding the `.server.tsx` extension to your component files. These components will only run on the server and can access server-side resources like databases or APIs without exposing them to the client.

```ts
import CardDemo from "@/components/card-demo";

export default function Home() {
  return (
    <CardDemo />
  );
}
```

</div>
</div>

---

## Server Actions
