# Design Partner Board

A tiny CRM for early product work. The unit of work is not a contact stage — it is a loop:

**hypothesis → evidence from a conversation → next product change**

Product explainer: **[PRODUCT.md](./PRODUCT.md)**. Built as a personal 0→1 demo. No backend, no auth. Data lives in `localStorage`.

## Run

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## What you can do

- Board of design partners by status: Prospect, Talking, Active, Closed
- Add and edit partners
- Attach hypotheses and mark them open / validated / invalidated / unclear
- Log a conversation only if it has at least one learning with a required outcome
- Capture a next product change (nudged if empty)
- Drag cards between columns, or change status from the card or the partner page
- Refresh keeps your data
- **Reset demo** restores the seeded walkthrough

## Loom

Recording script, spoken lines, and seed cheat-sheet: **[LOOM.md](./LOOM.md)**.

Reset demo, then refresh once so the opening loader plays on camera.

## Seeded demo (for a 5-minute Loom)

| Partner | Status | Beat |
| --- | --- | --- |
| **Maya Chen** · Northline | Active | Invalidated “auto-write full summary”; next change is mandatory outcome tags |
| **Arjun Mehta** · Relaykit | Talking | Unclear whether founders will update weekly without a nudge |
| **Priya Nair** · Bundlehq | Prospect | Hypothesis only — structured partner, no learning yet |
| **Sam Ortiz** · Independent | Closed · Lost | Consultants will not pay for this as a personal CRM |
| **Leah Kim** · Copperline | Closed · Won | First session that writes a product change becomes a design partner |

Start on Maya. The invalidated learning and the Δ product change are on the card and on her page.

## Build

```bash
npm run build
npm run preview
```
