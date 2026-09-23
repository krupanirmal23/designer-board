# Design Partner Board

A tiny CRM for early product work.

The unit of work is not a contact. It is a loop:

**hypothesis → evidence from a conversation → next product change**

## Who it is for

A founder or founding PM running 5–20 design-partner conversations while the product is still being shaped.

Job: after an important conversation, have a clear record of what you believed, what you learned, and what you will change next.

## The problem

Notes land in Notion, Docs, or Slack. “They seemed interested” gets treated as traction. Two weeks later nobody can say which hypothesis got stronger, which died, or what changed in the product.

CRMs optimize for follow-ups. They do not force a learning judgment after a call.

## How it works

1. Add a design partner.
2. Write the hypothesis the conversation is meant to test.
3. Log the conversation. You cannot save it without at least one learning and an outcome: **validated**, **invalidated**, or **unclear**.
4. Capture the next product change. If you skip it, the tool nudges you.

The board is just status: Prospect → Talking → Active → Closed (Won / Lost / Paused). The stamp on the card is the learning, not the stage.

## What “done” looks like on a partner

Open **Maya Chen**. You should be able to answer, in one glance:

| | |
| --- | --- |
| What we believed | SREs will share raw Slack threads if the output is a learning log — not another status field. Auto-writing a full summary will be enough. |
| What we learned | Auto-summary is ignored. They need a forced judgment, not generated prose. |
| What we change | Require a manual outcome tag before a conversation can be saved. Do not auto-write summaries. |

That is the product. Everything else is filing.

## What it is not

Not a pipeline. Not a contact database. Not an AI note-taker.

No auth, teams, email sync, or billing. Those are non-goals on purpose. If people ask for AI summaries before they ask for the learning loop, this is solving the wrong layer.

## Try it

```bash
npm install
npm run dev
```

**Reset demo** restores five seeded partners. Start with Priya (a partner with no learning yet), then Maya (a judgment that killed a feature).
