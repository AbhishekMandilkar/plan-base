# Planview — Implementation Plan

## Overview
A cross-platform Electron desktop app that scans your filesystem for AI agent
plan files (Cursor and Claude Code) and displays them in a unified UI.

## Tech stack
- Electron 30+
- React 18 + Vite
- TypeScript
- Tailwind CSS
- shadcn/ui
- gray-matter (markdown frontmatter parsing)
- marked (markdown rendering)

---

## Phase 1 — Project scaffold

- [x] Init project with `npm create vite` (React + TypeScript template)
- [x] Install and configure Electron with electron-vite
- [x] Set up main process (main.ts) and renderer process
- [x] Configure TypeScript paths and aliases
- [x] Install Tailwind CSS and configure with PostCSS
- [x] Install and init shadcn/ui
- [x] Set up IPC bridge (preload.ts) exposing filesystem APIs to renderer
- [x] Basic app window — frameless, 1100x680, min size enforced

## Phase 2 — Onboarding flow

- [x] First-launch detection via persisted settings (`Utils.paths.userData/settings.json`)
- [x] Onboarding screen: user picks one or more project root directories
- [x] Native folder picker via Electrobun `Utils.openFileDialog`
- [x] Save selected roots to settings.json in userData
- [x] Allow adding/removing roots later from Settings
- [x] Print out the project roots on the main app screen to verify onboarding works

## Phase 3 — Filesystem scanner

- [ ] Scanner runs in main process (has Node.js fs access)
- [ ] Always scan home dir (`~`) for:
  - `~/.cursor/plans/*.md`
  - `~/.claude/plans/*.md` (if exists)
- [ ] For each project root, scan up to 3 levels deep:
  - `<root>/<project>/.cursor/plans/*.md`
  - `<root>/<project>/.claude/*.md`
- [ ] Skip directories: `node_modules`, `.git`, `dist`, `build`, `.next`, `out`
- [ ] Extract per-plan metadata:
  - Title (first H1 or filename)
  - Source tool (cursor or claude — inferred from path)
  - Project name (parent folder name)
  - File path (absolute)
  - Last modified (`fs.stat` mtime)
  - Checklist progress (count `- [ ]` vs `- [x]`)
- [ ] Expose via IPC: `ipcMain.handle('scan-plans', ...)`
- [ ] Re-scan on app focus (debounced, 2s)

## Phase 4 — Core UI

- [ ] App shell: sidebar (220px) + main list + detail panel (280px)
- [ ] Sidebar sections: All plans, Recent, Completed, by Tool, by Project
- [ ] Plan cards in main area:
  - Title, tool badge (Cursor / Claude Code), project name, relative time
  - 2-line preview of plan content
  - Progress bar (checked / total checklist items)
- [ ] Detail panel on card click:
  - Full checklist rendered with check/uncheck state (read-only)
  - "Open in editor" button → `shell.openPath(filePath)`
  - "Show in Finder/Explorer" button → `shell.showItemInFolder(filePath)`
- [ ] Search bar: filter cards by title or content (client-side)
- [ ] Filter button: by tool, by project, by status (in progress / done)

## Phase 5 — Polish

- [ ] Empty state when no plans found (with CTA to pick a root)
- [ ] Loading state during scan
- [ ] Keyboard navigation (arrow keys through plan list, Enter to open detail)
- [ ] Auto dark/light mode (follows system via `nativeTheme`)
- [ ] App icon
- [ ] Settings screen: manage project roots, rescan button

## Phase 6 — Distribution

- [ ] Configure electron-builder for macOS (dmg) and Windows (nsis)
- [ ] Code sign for macOS (optional for v1)
- [ ] Build and test on both platforms
- [ ] GitHub releases for distribution

---

## File structure

```
planview/
├── electron/
│   ├── main.ts         # app lifecycle, IPC handlers
│   ├── preload.ts      # context bridge
│   └── scanner.ts      # filesystem scanning logic
├── src/
│   ├── components/
│   │   ├── Sidebar.tsx
│   │   ├── PlanCard.tsx
│   │   ├── PlanList.tsx
│   │   ├── DetailPanel.tsx
│   │   └── Onboarding.tsx
│   ├── hooks/
│   │   └── usePlans.ts
│   ├── types/
│   │   └── plan.ts
│   └── App.tsx
├── electron-vite.config.ts
└── electron-builder.config.ts
```

---

## Notes
- All filesystem access happens in main process only; renderer gets data via IPC
- Plan detection is path-based (no file content needed to identify tool)
- v1 is read-only — no editing plans from within the app
- Start with Phase 1 and work through each phase sequentially