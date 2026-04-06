# Tutorial

This folder collects the main setup steps and copy-paste examples used across the workshop. Read the files in order if you want a guided path, or jump directly to a specific topic.

## Learning Path

1. [00_requirements.md](./00_requirements.md)
   Prerequisites for the workshop: Node.js, a package manager, VS Code, Git, and a quick environment check.
2. [01a_nextjs.md](./01a_nextjs.md)
   Create a Next.js app, choose the main scaffold options, and add server components, client components, server actions, API routes, and simple data-fetching examples.
3. [01b_tanstack-start.md](./01b_tanstack-start.md)
   Scaffold a TanStack Start app, use add-ons, set environment variables, and understand the default project structure.
4. [02_zod.md](./02_zod.md)
   Learn schema definition, parsing, safe parsing, type inference, object helpers, arrays, enums, unions, and common Zod v4 patterns.
5. [03_drizzle.md](./03_drizzle.md)
   Add Drizzle ORM with PostgreSQL to Next.js, configure environment variables, define tables, run migrations, and connect validation plus server actions.
6. [04_shadcn.md](./04_shadcn.md)
   Install shadcn/ui, add components, build a small card example, and customize the theme.
7. [05_skills.md](./05_skills.md)
   Introduces agent skills, the Skills CLI, how to install skills for GitHub Copilot, and includes Remotion-oriented examples.
8. [06_tanstack-query.md](./06_tanstack-query.md)
   Set up TanStack Query, provide a QueryClient, fetch data with `useQuery`, and understand where it fits in a TanStack Start app.

## Topics

### Linting

Linting choices appear mainly during project scaffolding.

### ESLint + Prettier

There is no dedicated ESLint + Prettier walkthrough in this folder yet, but the recommended editor extensions below include both tools for projects that use that stack.

### Biome

[01a_nextjs.md](./01a_nextjs.md) shows selecting Biome during `create-next-app`, which is the current documented linting path in this tutorial set.

## Next.js

Start with [01a_nextjs.md](./01a_nextjs.md) if you want the App Router version of the workshop, including server actions, API routes, and example pages.

## TanStack Start

Use [01b_tanstack-start.md](./01b_tanstack-start.md) if you prefer TanStack Start and want the CLI, add-ons, and route structure overview.

## Zod

[02_zod.md](./02_zod.md) is the validation reference for this tutorial set and is reused by the Drizzle examples.

## Drizzle

[03_drizzle.md](./03_drizzle.md) builds on the app setup and Zod validation to add a PostgreSQL-backed persistence layer with Drizzle ORM.

## Shadcn

[04_shadcn.md](./04_shadcn.md) covers component installation, a small UI example, and theme customization.

## Skills

[05_skills.md](./05_skills.md) explains how to extend agent behavior with installable skills and includes example commands for GitHub Copilot.

## TanStack Query

[06_tanstack-query.md](./06_tanstack-query.md) provides the smallest useful examples for wiring query state into a TanStack Start application.

## VS Code Extensions

Recommended workspace extensions for this tutorial set:

```json
{
  "recommendations": [
    "GitHub.copilot",
    "GitHub.copilot-chat",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "biomejs.biome",
    "editorconfig.editorconfig",
    "yzhang.markdown-all-in-one",
    "DavidAnson.vscode-markdownlint",
    "marp-team.marp-vscode",
    "bierner.markdown-mermaid",
    "lokalise.i18n-ally",
    "streetsidesoftware.code-spell-checker",
    "ms-azuretools.vscode-containers",
    "ms-vscode-remote.remote-containers",
    "ms-vscode-remote.remote-ssh",
    "ms-vscode.remote-server",
    "ms-vscode.remote-explorer",
    "ms-vscode.vscode-speech",
    "pomdtr.excalidraw-editor"
  ],
  "unwantedRecommendations": []
}
```
