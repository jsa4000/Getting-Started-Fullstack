# Copy Marker to File — VS Code Extension

Detects `// COPY: path/to/file` comments in any file and shows a **CodeLens button** to create or update that file with the code block content.

## Usage

Add a `// COPY:` marker as the first line inside a code block:

````md
```tsx
// COPY: src/components/current-time.tsx
export default function CurrentTime() {
  const now = new Date().toISOString();
  return (
    <div>
      <strong>Server time:</strong> <span>{now}</span>
    </div>
  );
}
```
````

A `Create / Update: src/components/current-time.tsx` button appears above the marker line. Click it to write the file to your workspace (the `// COPY:` line itself is excluded from the output).

Supported comment styles: `// COPY:`, `# COPY:`, `/* COPY: */`

---

## Install on another computer

### Option A — Install the `.vsix` directly (no build needed)

1. Copy `vscode-markdown-marker-tools-0.0.1.vsix` to the target machine.
2. Open VS Code and run: `code --install-extension vscode-markdown-marker-tools-0.0.1.vsix`
   Or via the UI: **Extensions** sidebar → `···` menu → **Install from VSIX…** → select the file.
3. Reload the window when prompted.

### Option B — Build from source

Requirements: [Node.js](https://nodejs.org) ≥ 20, [pnpm](https://pnpm.io)

```bash
cd vscode-markdown-marker-tools

# Install dependencies
pnpm install

# Compile TypeScript
pnpm compile

# Package into .vsix
node_modules/.bin/vsce package --no-dependencies --allow-missing-repository --skip-license
```

Then install the generated `.vsix` as in Option A.

```bash
# Install the generated .vsix file
code --install-extension vscode-markdown-marker-tools-0.0.1.vsix
```

---

## Project structure

```txt
vscode-markdown-marker-tools/
├── src/
│   └── extension.ts       # Extension source (TypeScript)
├── out/
│   └── extension.js       # Compiled output (generated)
├── package.json           # Extension manifest
├── tsconfig.json          # TypeScript config
├── pnpm-lock.yaml         # Dependency lock file
└── vscode-markdown-marker-tools-0.0.1.vsix   # Packaged extension (ready to install)
```
