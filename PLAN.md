# Aros-Mualin Research Site — Build Plan

This document captures every decision made during the planning interview. It is the source of truth for the in-place transform that follows. Nothing in `index.html`, `style.css`, etc. has been modified yet.

---

## 1. Project overview

A research website for **Daniela Aros-Mualin**, postdoc in Scott McAdam's lab at Purdue University (Botany & Plant Pathology). Ecophysiologist focused on ferns and lycophytes — physiological mechanisms (gas exchange, stomatal control, light regulation), desiccation tolerance and microhabitat refugia, and the biogeography / evolution of fern diversity.

The site is being built by adapting Connor Beck's existing site as a template, then stripping all neuroscience / 3D-printing / coding / tutorial content and replacing it with a simpler botany-research presentation.

**Career stage context:** postdoc, h-index 5, 11 publications (2020–2025), strongest single paper is the 2020 *J. Biogeography* paper at 82 citations.

---

## 2. Repo & hosting

| Decision | Value |
| --- | --- |
| Working directory | `/Users/connorbeck/Documents/GitHub/DaniWebsite/` (in-place transform) |
| New repo name | `aros-mualin-research` |
| Initial owner | Connor's GitHub account; transferred to Daniela later |
| History | Fresh `git init` after transform completes (no Connor-Beck commits in Daniela's repo) |
| Hosting | GitHub Pages for v1; custom domain deferred |
| Repo creation | At the end of the local build, not now |

---

## 3. Information architecture

Six pages, in this nav order:

1. **Home** (`index.html`)
2. **About** (`about.html`)
3. **Research** (`research.html`)
4. **Publications** (`publications.html`)
5. **CV** (`cv.html`)
6. **Contact** (`contact.html`)

**Explicitly excluded:** Software, Lab Tools, Guides/Tutorials, Gallery/Fieldwork, Teaching, Outreach, News, Lab/Group page. (She's a postdoc with no formal teaching record yet; outreach and news are high-maintenance and out of scope for v1.)

---

## 4. Visual identity

### Typography
- **Display:** Fraunces (variable serif, organic curves, Google Fonts)
- **Body:** Inter (Google Fonts)
- Replaces existing Sora + Source Sans 3 stack.

### Palette
| Role | Hex | Notes |
| --- | --- | --- |
| Primary green | `#2F4A35` | Headings, links, canvas line art |
| Accent earth | `#B8693D` | Hover states, eyebrow text, sparing accents |
| Background | `#F7F3EC` | Warm off-white / parchment |
| Body text | `#2A2622` | Warm charcoal (not pure black) |
| Soft sage | `#A8B89A` | Borders, dividers, secondary surfaces |

Hex values are starting points and may be tuned during implementation.

### Wordmark
Option **W2** — text wordmark "Daniela Aros-Mualin" set in Fraunces, with a small monoline fern-frond SVG glyph (~24px) to its left in the header. The same glyph drives the favicon and may appear as a subtle brand mark elsewhere.

---

## 5. Hero canvas spec

A custom interactive canvas on the home page. Replaces Connor's `brain-canvas` neural-network animation.

### Composition
A single integrated motif combining a **fern crozier / unfurling fiddlehead** with a **phylogenetic tree** branching outward from the frond's rachis. Terminal tree tips suggest fern/lycophyte lineages without explicit labels. Single-color line art (primary green), no fills. Reads first as "fern," then on second look as "tree of life."

### Behavior (hybrid of all three timing options)
1. **On page load:** the frond unfurls and tree branches grow in over ~3 seconds.
2. **After unfurl:** subtle ambient motion — slow tip pulses or gentle branch sway on a long cycle (~10–20s). Quiet enough not to distract from reading.
3. **On user interaction:** small response to cursor proximity (branches lean slightly, nearest node highlights). Light touch only.

Constraint: must remain noticeably simpler than Connor's brain-canvas in code, parts, and motion.

---

## 6. Content strategy — Path Z (hybrid)

- **Factual structure** scaffolded from Daniela's Scholar profile and confirmed details: nav, page skeletons, publications list, research-theme headings, CV section structure, contact info.
- **Voice-y prose** (About bio, Research statement framing, "Beyond research" section) written as **clearly-marked placeholder** drafts based on Scholar info, intended to be tuned by Daniela later.
- **Research-theme descriptions** (third person, factual paraphrases of paper abstracts) drafted as production-quality copy, since they don't carry first-person voice.

Marked placeholders use a comment convention so she can find them: `<!-- PLACEHOLDER: needs review by Daniela -->` adjacent to the relevant block.

---

## 7. Page-by-page structure

### 7.1 Home (`index.html`) — Option D
1. **Hero:** wordmark + nav header, then the canvas with a headline, a short 2–3 sentence intro paragraph below the headline, and primary CTAs (Research / Publications / CV).
2. **Research themes preview:** three cards summarizing the three themes (one sentence each, paraphrased from her papers), each linking to the relevant section of `research.html`.
3. **Latest publications:** strip showing the **3 most recent** papers (2025: blue-light stomatal control · 2024: power of independent generations · 2024: untangling poikilohydry), each linking to its DOI.

### 7.2 About (`about.html`) — Option B
1. **Hero:** eyebrow "About" → headline → 2-paragraph placeholder bio drafted from Scholar → research-interest chips → buttons (View Research / View CV / Google Scholar) → headshot slot (placeholder image until she sends one).
2. **Background:** short prose section describing her path: MSc at Bonn (Germany) → PhD with Michael Kessler at University of Zurich → postdoc with Scott McAdam at Purdue. Undergraduate institution left as TODO.
3. **Beyond research:** placeholder section she fills or removes.

**Chips:** *Ecophysiology · Functional Traits · Water Relations · Ferns & Lycophytes · Plant Evolution*

### 7.3 Research (`research.html`) — Option A, narrative-arc ordering
A short page-hero with one paragraph framing her overall program, followed by three stacked prose sections. Each section: theme heading (h2), 3–5 sentence factual description drafted from paper abstracts, and a "Selected work" list of relevant papers with DOI links.

**Theme order (narrative arc — "where ferns live → how they work → how they survive"):**
1. **Biogeography & evolution of fern/lycophyte diversity** — global richness, functional diversity, independent generations. (3 papers)
2. **Functional and physiological ecology of ferns** — stomatal control, gas exchange, light/blue-light regulation, circadian patterns. (4 papers)
3. **Desiccation tolerance and microhabitat refugia** — poikilohydry, humid microhabitats, drought response. (3 papers)

The 2021 holoparasite-cactus paper is **omitted** from Research (it's an outlier from her PhD-era collaboration), but **kept on the Publications page**.

### 7.4 Publications (`publications.html`) — Option A
- **Single reverse-chronological list**, all 11 papers in one stream, newest first.
- Per entry: bold title, authors with **Daniela's name bolded** (`Aros-Mualin, D.`), italic journal + year, DOI link.
- **First-author / last-author tags** displayed as small chips next to relevant papers.
- **Abstract dropdowns** rendered when CrossRef returns abstract text. When abstract is unavailable (older papers, society journals with poor metadata), the dropdown is omitted entirely (no "abstract unavailable" stub).
- The pending "REFUGE EFFECT" paper (Frontiers in Ecology and Evolution) shown in a small "In review / preprints" subsection above the year-grouped list.
- **No** citation counts, **no** preprint PDFs, **no** conference talks/posters section.

### 7.5 CV (`cv.html`) — Option C
- Short HTML summary visible on page: current position, education path, 3 career highlights, key affiliations.
- Prominent "Download full CV (PDF)" button linking to `assets/site/cv.pdf`.
- For v1, Connor's existing CV PDF used as a placeholder file in that slot until Daniela provides hers.
- Both Bonn (MSc) and Zurich (PhD) listed alongside Purdue (postdoc) on this page.

### 7.6 Contact (`contact.html`)
- Affiliation block: name, postdoc title, McAdam lab, Department of Botany & Plant Pathology, Purdue University.
- Email: **darosmua@purdue.edu**
- ORCID: **0000-0003-1526-188X** (https://orcid.org/0000-0003-1526-188X)
- Google Scholar: existing profile link
- **No** socials, **no** lab/group sidebar links, **no** office/mailing address, **no** open-to-collaboration line.

### 7.7 Footer (every page)
Minimal: **CV · Contact · Scholar · ORCID · Email**. Skips GitHub and LinkedIn entirely.

---

## 8. Confirmed details for Daniela

| Field | Value |
| --- | --- |
| Full name | Daniela Aros-Mualin |
| Current position | Postdoc, McAdam lab, Department of Botany & Plant Pathology, Purdue University |
| PhD | Michael Kessler lab, University of Zurich |
| MSc | University of Bonn, Germany |
| Undergraduate | TODO (not yet supplied) |
| Email | darosmua@purdue.edu |
| ORCID | 0000-0003-1526-188X |
| Google Scholar | https://scholar.google.com/citations?user=qqN5bR4AAAAJ&hl=es |
| Headshot | Deferred — she will choose photos with Connor later |
| Field photos | Deferred |

---

## 9. Deletion list (in-place transform)

Files and directories to remove during the transform:

**HTML pages**
- `tutorial-calcium-imaging.html`
- `tutorial-electrophysiology.html`
- `tutorial-video-compression.html`
- `tutorials.html`
- `guide-dynamical-systems.html`
- `tools.html`
- `software.html`
- `brain-behavior.html`
- `neural-syntax.html`
- `neural-languages.html`
- `nano-neuro-interfaces.html`

**JS files**
- `tutorial-lab.js`
- `guide-dynamical-rnn.js`
- `guide-dynamical-systems.js`

**Directories**
- `code/matlab/`
- `vendor/`
- `data/`
- `docs/`
- `assets/research/` (neuro-specific assets)
- `assets/tutorials/`

**Images**
- `images/brain.png`, `images/brain.tif`
- `images/MitoNPCa.png`
- `images/TimeCalcium.png`
- `images/Logo.eps`, `images/Logo.png` (Connor-specific logo)
- `images/card-img.png` (likely Connor-specific)
- `images/social-*.png` (no socials in footer)
- `assets/people/headshot_ConnorBeck.png`
- `assets/site/websiteLogo.png` (replaced by wordmark + SVG glyph)

**Other**
- `README.md` (rewritten for the new project)

Files **kept** and adapted: `index.html`, `about.html`, `publications.html`, `research.html`, `cv.html`, `contact.html`, `style.css`, `scripts.js` (retargeted for the new canvas).

---

## 10. Implementation sequence

The transform proceeds as a series of discrete passes so any pause point is a sensible checkpoint:

1. **Delete pass.** Remove every file in §9.
2. **Rename / wordmark pass.** Update site name, page `<title>`, `<meta description>`, footer, and header wordmark across all six retained HTML files. Add a placeholder fern-glyph SVG inline.
3. **Recolor pass.** Update CSS variables in `style.css` to the new palette and swap the font import + font-family declarations to Fraunces + Inter.
4. **Canvas pass.** Replace the brain-canvas code in `scripts.js` with the fern-frond + tree-of-life animation per §5.
5. **Content pass — page by page.** Replace the body of each of the six pages with the structure and copy described in §7. Each page is a separate edit so progress is incremental.
6. **Publications fetch pass.** Pull abstracts from CrossRef per DOI for the 11 papers; embed dropdowns where successful.
7. **Favicon + assets pass.** Generate a favicon from the fern glyph; drop a placeholder headshot image and a placeholder `cv.pdf` file (Connor's CV).
8. **README rewrite.**
9. **Final review checkpoint** — open the site locally and click every link / read every page before declaring v1 done.
10. **Repo creation.** `rm -rf .git`, `git init`, single first commit ("Initial site, structure adapted from Connor-Beck/website"), then create `aros-mualin-research` on GitHub under Connor's account and push.

---

## 11. Open TODOs requiring Daniela's input later

These are flagged in code with `<!-- PLACEHOLDER -->` or `<!-- TODO -->` comments and are **not** blockers for v1 shipping:

- Tune all placeholder bio prose to her own voice (About hero, About background section).
- Fill or remove the "Beyond research" section on About.
- Provide undergraduate institution.
- Choose and supply a headshot image.
- Choose and supply field/research photos (if she later wants a Gallery page).
- Provide her current CV PDF (replaces Connor's placeholder).
- Confirm or adjust the headline copy for the home page hero.
- Confirm or adjust the research-theme descriptions on the Research page.
- Decide whether to add a custom domain later.

---

## 12. Explicitly deferred / out of scope for v1

- Custom domain
- Gallery / Fieldwork page
- Teaching, Outreach, News, Lab/Group pages
- Social media links (Twitter/X, Bluesky, LinkedIn, ResearchGate, Instagram, Mastodon)
- Citation counts on the Publications page
- Conference talks / posters section
- Open-to-collaboration text on the Contact page
- Office / mailing address
- Analytics / tracking (none added; matches existing site)
- Preprint PDF hosting
