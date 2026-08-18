---
name: new-intuition
description: Author a new article in the Statistics Intuitions series for alestainer.com. Use when starting, drafting, or finishing a post in that series, or when asked to build an interactive statistics figure. Enforces the five-part article contract - interactive figure, linked primary source, reproduction notebook, maths spoiler, plain-language mechanism.
---

# Statistics Intuitions — new article

A post in this series is a **playable claim with receipts**. The reader commits to an answer,
finds out they were wrong, and can then check every part of it themselves.

Backlog and full rationale: `~/mvps/ml-research/posts/planning/REPLICATION_BACKLOG.md` (§42 is the
contract, §41 the infrastructure, §3 the interaction formats). Parity log lives beside it.

## Repos

| Repo | Visibility | Holds |
|---|---|---|
| `~/mvps/alestainer` (remote `source` → `Alestainer/alestainer-site`) | **private** | Astro site, article MDX, interactive components |
| `~/mvps/statistics-intuitions` → `Alestainer/statistics-intuitions` | **public** | reproduction notebooks |
| `Alestainer/alestainer.github.io` | public | built `dist/` only |

Never put a component or article draft in the public repo. Never leave a notebook out of it.

## Workflow

### 1. Parity check — before anything else

30 minutes. Search for an existing playable version. Check the incumbents by name: The Pudding,
Seeing Theory, Setosa, Nicky Case / explorabl.es, FiveThirtyEight, Distill, 3Blue1Brown, **and the
forecasting/rationalist community** (they own calibration and most estimation games).

Judge honestly: is the incumbent an *explainer* (shows you) or a *game* (scores you)? An explainer
leaves the slot open. Log the verdict in `planning/parity-log.md`. If CROWDED, stop — pick another.

Four ideas have died at this gate. Assume yours might.

### 2. Write the claim and the failure modes — before building

- **Claim:** one falsifiable sentence about what the reader will do or what the data will show.
- **Failure modes:** what would make this post not work, listed in advance.

Then hold to them. Do not change the question after seeing the answer — that is the garden of
forking paths, and this series has a section warning about it.

Distinguish clearly: a claim about the *paper* failing to replicate is a finding. A claim about
*readers* is a hook, and a pilot of ten friends is calibration, not evidence.

### 3. Build the figure

Reuse from `src/components/figures/`:
- `lib/pointstats.ts` — cell counts, histograms, Poisson expectation, variance/mean, grid overlay
- `PointPatternPicker.astro` — the reference implementation of the whole contract

Non-negotiables:
- **Own seeded PRNG** (mulberry32), never `Math.random`. Show the seed. Offer a reset.
- **Commit before reveal** for Predict/Duel formats. Nothing is shown until the reader chooses.
- **Client-side only.** No data collection, no backend, no analytics.
- **Pick the format from the phenomenon** (§3): magnitude → Predict; mechanism → Dial or Sabotage;
  dynamics → Scrub; consequences → Author or Role-play; the reader's own ability → Duel, and only then.
  Duel is the most expensive format and was heavily over-used in early drafts.

Calibrate the stimulus with a metric, not by eye — and check *which* metric. Post 001 was tuned on
variance/mean, which measures the illusion's strength and says nothing about whether the figure
looks artificially regular; that needed the CV of nearest-neighbour distances. See
`tools/measure-gridness.mjs`.

### 4. The reproduction notebook

In `~/mvps/statistics-intuitions/notebooks/NN-slug.ipynb`. It must:

- Port the browser's PRNG so it regenerates **the exact patterns from the published seed**, and
  `assert` the port matches known JS output. Statistically-similar is not reproduction.
- Print the same numbers the article states.
- Keep dependencies minimal — standard library for the statistics, `matplotlib` only for plots.
- Add a row to the repo README table.

### 5. The article

`.mdx` in `src/content/blog/`. Must contain all five contract elements (§42):

1. interactive figure
2. primary source, linked **by its title** — never "read it here" or "click for PDF"
3. reproduction notebook link
4. maths spoiler in `<details>`, collapsed
5. plain-language mechanism, before the maths and readable without it

State the **exact** theory value, not the famous one — the famous number is usually a limit, so
check whether your setup is in it. Say plainly when no closed form exists; naming the gap beats
inventing rigour.

### 6. Ship

- `npm run build` clean
- `noindex` anything under `/lab/`
- Record the actual build time — every estimate in the backlog is still a guess
- LinkedIn package: hook, long post, short variant, loop, first-comment link. LinkedIn is also the
  polling layer — ask the question there, let the comments be the distribution.

## Voice

Concrete and unhedged. Lead with the surprising number. The antagonist is the phenomenon, never the
reader — being wrong should feel like being let in on something, not caught out. Every result needs
a real-world anchor a general reader feels: cockpits, levees, project deadlines, why the other
queue moves faster. **The audience is everyone, not specialists** — the topics are statistical, the
reader is not.
