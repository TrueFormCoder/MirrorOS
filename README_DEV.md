# MirrorOS — Developer Guide

## Prereqs

* **Node** (LTS or current; Apple Silicon ok)
* **VS Code** (with `code` in PATH)
* **Git** (configured with name/email)
* Optional: **Codex** extension (full workspace access)

## First-Time Setup

```bash
git clone https://github.com/TrueFormCoder/MirrorOS.git
cd MirrorOS
npm i
```

## Scripts

```bash
npm run dev          # ts-node run of src/index.ts (quick dev loop)
npm run build        # compile TypeScript -> dist/
npm run start:dist   # run compiled dist/index.js
```

## VS Code Debugging

Open this folder in VS Code, then:

**Run & Debug targets**

* **Run: src/index.ts (ts-node)** – live TypeScript with breakpoints
* **Debug: compiled dist/index.js** – runs compiled JS (builds first)
* **Build & Run dist (compiled)** – identical to compiled target with its own label
* **Build → Run dist** (compound) – one-click *build then run* (if present)

> **Note**: we use an absolute preload path for ts-node:
> `.vscode/launch.json → runtimeArgs: ["-r","${workspaceFolder}/node_modules/ts-node/register"]`

## TypeScript Config

`tsconfig.json` (summary):

* `rootDir: src`, `outDir: dist`
* `target: ES2020`, `module: CommonJS`
* `types: ["node"]`, `sourceMap: true`, `strict: true`

## Commit Signing (SSH)

Commits are signed for the Verified badge.

One-time global:

```bash
git config --global user.name  "Naci Nicole Sigler"
git config --global user.email "engineering@ellari.ai"

git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/id_ed25519.pub
git config --global commit.gpgSign true

# Local verification for ssh signatures:
printf "engineering@ellari.ai " > ~/.ssh/allowed_signers \
  && cat ~/.ssh/id_ed25519.pub >> ~/.ssh/allowed_signers
git config --global gpg.ssh.allowedSignersFile ~/.ssh/allowed_signers
```

Quick test:

```bash
git commit --allow-empty -m "verify ssh-signed commit"
git log --show-signature -1
```

## Codex (Agent) Access

* Ensure the **Codex** extension is installed.
* Grant **full workspace access** (left sidebar → Codex → “Add context…” → select repo).
* Ask inline:
  `@codex explain the finality module`
  `@codex write tests for src/index.ts`

## Project Layout

```
MirrorOS/
  .vscode/
    launch.json      # debug targets (ts-node + dist)
    tasks.json       # TypeScript build + dev + clean
  src/
    index.ts         # entry point
  dist/              # compiled JS (build output)
  tsconfig.json
  package.json
  .editorconfig
  .prettierrc
```

## Common Commands

```bash
# Dev loop (ts-node)
npm run dev

# Build & run compiled
npm run build && npm run start:dist

# Debug in VS Code
⇧⌘D -> select target -> ▶︎
```

## Troubleshooting

**Debugger says “Cannot find module ts-node/register”**

* Ensure local install: `npm i -D ts-node`
* We preload with an absolute path:
  `"runtimeArgs": ["-r", "${workspaceFolder}/node_modules/ts-node/register"]`
* Reload VS Code: `⇧⌘P → Developer: Reload Window`

**Two copies of the repo / edits not tracked**

* Only use: `~/Documents/GitHub/MirrorOS`
* If you edited a cloud-synced duplicate, copy `.vscode/launch.json` here and delete the duplicate.

**Signed commit not Verified on GitHub**

* Check you added your SSH public key as a **Signing Key** in GitHub.
* Verify local: `git log --show-signature -1`

**VS Code opens Vim for commit messages**

```bash
git config --global core.editor "code -w"
```

## Contributing

* Branch from `main`, use signed commits, open a PR.
* Code style via Prettier/EditorConfig; ESLint optional.
