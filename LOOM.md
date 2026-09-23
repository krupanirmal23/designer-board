# Loom track — Design Partner Board

A recording script for the Founding PM interview. The product is the evidence. This document is the shot list.

Runtime: **5–6 minutes**. Cut: **2:30**. Window: **1440×900**, browser zoom **100%**. Cursor visible.

---

## What this video has to prove

Not “I can ship a board.” The argument is:

> Early teams take notes and call it learning. This tool makes a **judgment** mandatory after every conversation, and puts the **next product change** next to that judgment.

If the reviewer remembers one sentence, it should be:

**The unit of work is a loop — hypothesis → evidence → change — not a contact stage.**

---

## Before you hit record

1. `npm run dev` → `http://localhost:5173`
2. Click **Reset demo**. Wait for “Restoring the seed.” Land on the board.
3. Refresh once so the opening loader plays on camera: *Opening the ledger*.
4. Hide bookmarks. Desktop audio on. Speak slightly slower than a standup.
5. Do not apologize for polish. If something is missing, name it as a non-goal.

Seed must show, left to right:

| Column | Partner | What the card already argues |
| --- | --- | --- |
| Prospect | **Priya Nair** · Bundlehq | Structured partner, **no learning yet** |
| Talking | **Arjun Mehta** · Relaykit | **Unclear** — they liked it, forgot to log |
| Active | **Maya Chen** · Northline | **Invalidated** auto-summary; Δ outcome tags |
| Closed | **Leah Kim** Won / **Sam Ortiz** Lost | Same loop, opposite close |

---

## Track A — full walk (5–6 min)

Let the boot screen finish. Do not talk over the three words lighting up. Then:

### 0:00–0:40 · Problem

**Stay on the board. Do not click yet.**

Say:

> Most early teams talk to design partners and still fail to learn. Notes land in Notion. “They seemed interested” gets treated as traction. Two weeks later nobody can say which hypothesis got stronger, which died, or what changed in the product.
>
> Existing CRMs optimize for follow-ups. They do not force a learning judgment after a call.

**Click Priya Nair.**

Point at the empty conversations block:

> This is the failure mode I kept seeing — a named person, a company, even a hypothesis — and still just a note. A partner without a learning is not progress.

**Click ← Board.**

---

### 0:40–1:20 · Hypothesis (H1)

Stay on the board. Hover Maya’s card so the **INVALIDATED** stamp and the Δ line are in frame.

Say:

> My bet — call it H1 — is that making *validated / invalidated / unclear* mandatory after a call reduces fake progress. People complete a learning outcome instead of only saving notes.
>
> H2: putting “next product change” next to the learning increases follow-through.
>
> H3: a simple status board is enough. Extra CRM fields are noise.

Do not mention pipeline, deal stage, or ARR.

---

### 1:20–3:10 · What you did (Maya)

**Click Maya Chen.** Wait for the case-file skeleton; let the page settle.

Walk top to bottom. The page is numbered on purpose:

1. **01 Hypotheses** — the beliefs
2. **02 Conversations** — the evidence
3. **03 Next product changes** — the delta

Say, pointing at the open hypothesis:

> I believed SREs would share raw Slack incident threads if the output was a structured learning log, not another status field.

Then the invalidated one:

> I also believed auto-writing a full summary after a call would be enough. That was the hunch.

Scroll to the 11 Sept conversation.

> Maya was blunt. Her team already ignores Confluence recaps. Auto-summary is ignored. They need a forced judgment, not generated prose.

**Point at the INVALIDATED stamp, then at the Δ line.**

> Data, not the hunch: auto-summary died. The product change is sitting here — require a manual outcome tag before a conversation can be saved. Do not auto-write summaries.
>
> That field is the whole product. If you cannot say what you will change, you did not finish the loop.

Optional live proof (~45s), only if time is clean:

1. **Log conversation**
2. Fill notes, leave the learning blank, click **Save learning** — it refuses.
3. Write a one-line learning, skip the outcome, save — it refuses.
4. Choose **Validated**, type a Δ, save. Watch **Recording the judgment…**
5. Point at the new row on the page.

If the live log feels risky, skip it. The seeded Maya conversation already proves the beat.

---

### 3:10–4:00 · Contrast closes

**← Board.**

**Click Arjun.**

> Founders will not update this weekly without a reminder. He liked the concept and forgot. Outcome is *unclear*, not a silent fail. The next change is a weekly nudge — noted as future work, not built. That is the honesty I want in the tool.

**← Board. Click Sam.**

> Consultants wanted billing. We invalidated “they will pay for this as a personal CRM” and closed Lost. Out of scope is a learning.

**← Board.** Point at Leah’s **Won** stamp without opening if time is tight.

> Leah became a partner because the first session produced a product change, not a recap email. Won and Lost are both closures of a loop, not a funnel.

---

### 4:00–5:00 · What changed + close

Back on the board. Cursor on Maya’s Δ line.

Say:

> What changed in the product because of Maya: outcome tags are mandatory. Auto-summary is not in the build. The loader you saw at the start is the same three beats the board is organized by.
>
> This is not a CRM. It is an operating habit for 0→1. If I showed this to five people, I would count how many call the mandatory outcome useful versus annoying — and whether anyone asks for AI summaries before asking for the learning loop. If they ask for AI first, I am solving the wrong layer.

Stop. Do not demo Add partner unless they ask.

---

## Track B — short cut (2:30)

Use this if the slot is tight.

| Time | Shot | Line |
| --- | --- | --- |
| 0:00 | Boot → board | “Notes are not learning.” |
| 0:20 | Priya | “A partner with no judgment is still a note.” |
| 0:40 | Maya card on board | “H1: mandatory validated / invalidated / unclear.” |
| 1:00 | Maya page, conversation | “Auto-summary died. Here is the evidence.” |
| 1:40 | Δ on Maya | “The next product change is the output of the call.” |
| 2:00 | Board, Sam vs Leah | “Closed is a loop ending, not a deal stage.” |
| 2:15 | Board wide | “Not a CRM. An operating habit.” |

---

## What each click is for

| Product moment | Proof |
| --- | --- |
| Boot: hypothesis → evidence → change | The IA is the thesis |
| Priya empty state | Problem: structured partner, no learning |
| Maya INVALIDATED + Δ | Data vs hunch; what changed |
| Save blocked without outcome | H1 is in the product, not a slide |
| “Recording the judgment…” | Saving is a write, not a note dump |
| Arjun UNCLEAR | Unclear is a first-class outcome |
| Sam Lost / Leah Won | Status is partnership state, not pipeline |

---

## Seed cheat-sheet (if you go blank)

**Maya Chen** — Platform Eng Manager, Northline, Active  
Hypothesis still open: SREs will share Slack threads if the output is a learning log.  
Invalidated: auto-write full summary.  
Δ: require manual outcome tags.

**Arjun Mehta** — Founder, Relaykit, Talking  
Unclear: weekly updates without reminders.  
Δ: weekly nudge email (future).

**Priya Nair** — Head of CS, Bundlehq, Prospect  
Open hypothesis only. No conversation.

**Sam Ortiz** — Consultant, Closed · Lost  
Invalidated: consultants will pay for a personal CRM.

**Leah Kim** — VP Product, Copperline, Closed · Won  
Validated: first session that writes a change becomes a design partner.

---

## If something breaks on camera

- Board looks empty or wrong → **Reset demo**, wait for the seed overlay, continue from Maya.
- Modal will not save → you are missing learning text or an outcome. That is the demo. Narrate it.
- You clicked into Add partner by accident → Cancel. Do not improvise a new persona unless you mean to show Flow B.
- Loader feels long → leave it. It is the title card.

---

## What not to say

- “It’s just a prototype / ignore the UI.”
- “Deal stage,” “pipeline value,” “leads.”
- “We’ll add AI summaries next.” (That is the trap in the PRD. Mention it only as a signal you are watching.)
- Feature tour of every field.

---

## After the video

If they ask “what would you do next,” answer in this order:

1. Show it to five people. Count useful vs annoying on the mandatory outcome.
2. Watch whether they ask for AI before they ask for the loop.
3. Only then: weekly nudge (Arjun), not billing (Sam), not auto-summary (Maya).
