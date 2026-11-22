# 🎨 UI/UX Design System — SyncWrite

> **Aesthetic Direction: Industrial Workshop**
> A warm, utilitarian IDE that feels like a well-lit craftsman's workshop — not a spaceship cockpit.

---

## Design Philosophy

SyncWrite is a **tool for making things together.** The interface should feel like a physical workspace: warm wood tones, clear labels, solid surfaces, visible structure. It should feel lived-in and workable, not performatively futuristic.

**What we're NOT building:**
- ❌ Dark mode with neon/cyan/purple glowing accents
- ❌ Glassmorphism with blur cards and glow borders
- ❌ Purple-to-blue gradients anywhere
- ❌ The "AI startup" aesthetic (dark bg, cyan text, floating cards)
- ❌ Generic drop-shadow rounded rectangles

**What we ARE building:**
- ✅ A warm, confident, left-aligned interface with strong typography
- ✅ Clear spatial hierarchy — density where needed (editor), breathing room where not (dashboard)
- ✅ An opinionated light-mode-first design with a thoughtful dark variant
- ✅ An interface that looks like a human designer made deliberate choices

**The Memorable Thing:** SyncWrite looks and feels like a physical architect's desk — warm tones, structured layout, type-driven hierarchy, with pops of terracotta and ink as accents. Nobody will mistake it for AI-generated.

---

## Color Palette

Built in **OKLCH** for perceptual uniformity. No pure black, no pure white, no pure gray. Everything is tinted warm.

### Light Mode (Primary)

```css
:root {
  /* ── Surfaces ── */
  --surface-ground:    oklch(97.5% 0.008 65);   /* warm off-white, faint sand tint */
  --surface-raised:    oklch(95% 0.010 60);      /* slightly warmer, like cream paper */
  --surface-overlay:   oklch(99% 0.005 65);      /* lightest surface for popovers */
  --surface-sunken:    oklch(92% 0.012 60);      /* recessed areas — file tree bg, terminal bg */

  /* ── Editor-Specific Surfaces ── */
  --editor-bg:         oklch(98.5% 0.004 65);    /* near-white, barely warm — the writing surface */
  --editor-gutter:     oklch(95.5% 0.008 60);    /* gutter slightly darker than editor */
  --editor-line-hl:    oklch(95% 0.010 55);      /* active line highlight */
  --terminal-bg:       oklch(18% 0.010 55);       /* dark warm for terminal — this IS dark */

  /* ── Text ── */
  --text-primary:      oklch(15% 0.010 55);      /* near-black, warm tint — not #000 */
  --text-secondary:    oklch(40% 0.015 55);      /* medium contrast for labels/meta */
  --text-tertiary:     oklch(55% 0.010 55);      /* low contrast for placeholders */
  --text-inverse:      oklch(95% 0.008 60);      /* light text on dark backgrounds */

  /* ── Brand / Accent ── */
  --accent-primary:    oklch(55% 0.14 35);       /* terracotta — warm, earthy, bold */
  --accent-primary-hover: oklch(48% 0.14 35);    /* darker terracotta on hover */
  --accent-secondary:  oklch(45% 0.05 250);      /* deep slate blue — for links, secondary actions */
  --accent-secondary-hover: oklch(38% 0.05 250);

  /* ── Semantic ── */
  --success:           oklch(55% 0.12 155);      /* forest green */
  --success-bg:        oklch(94% 0.03 155);      /* light green tint bg */
  --warning:           oklch(65% 0.15 70);       /* amber/ochre */
  --warning-bg:        oklch(94% 0.04 70);
  --error:             oklch(55% 0.17 25);       /* brick red */
  --error-bg:          oklch(94% 0.04 25);
  --info:              oklch(55% 0.08 250);      /* muted blue */
  --info-bg:           oklch(94% 0.02 250);

  /* ── Borders ── */
  --border-default:    oklch(85% 0.010 55);      /* subtle warm border */
  --border-strong:     oklch(70% 0.015 55);      /* visible divider */
  --border-focus:      oklch(55% 0.14 35);       /* terracotta focus ring */

  /* ── Collaboration Colors (User Cursors) ── */
  --user-color-1:      oklch(55% 0.14 35);       /* terracotta */
  --user-color-2:      oklch(50% 0.12 250);      /* deep blue */
  --user-color-3:      oklch(55% 0.15 155);      /* forest green */
  --user-color-4:      oklch(60% 0.14 330);      /* plum */
  --user-color-5:      oklch(60% 0.12 70);       /* amber */
  --user-color-6:      oklch(50% 0.10 200);      /* teal */
  --user-color-7:      oklch(55% 0.13 10);       /* rust */
  --user-color-8:      oklch(50% 0.08 290);      /* indigo */
}
```

### Dark Mode

Not just an inverted light mode — a separate, considered palette. The dark mode uses warm charcoal, not blue-gray.

```css
[data-theme="dark"] {
  --surface-ground:    oklch(16% 0.010 55);      /* warm dark charcoal */
  --surface-raised:    oklch(20% 0.012 55);      /* slightly lifted surface */
  --surface-overlay:   oklch(24% 0.010 55);
  --surface-sunken:    oklch(13% 0.008 55);

  --editor-bg:         oklch(17% 0.008 55);
  --editor-gutter:     oklch(19% 0.010 55);
  --editor-line-hl:    oklch(22% 0.010 55);
  --terminal-bg:       oklch(12% 0.008 55);

  --text-primary:      oklch(90% 0.008 60);
  --text-secondary:    oklch(65% 0.010 60);
  --text-tertiary:     oklch(50% 0.008 60);
  --text-inverse:      oklch(15% 0.010 55);

  --accent-primary:    oklch(65% 0.14 35);       /* brighter terracotta for dark bg */
  --accent-primary-hover: oklch(70% 0.14 35);
  --accent-secondary:  oklch(65% 0.08 250);
  --accent-secondary-hover: oklch(70% 0.08 250);

  --border-default:    oklch(28% 0.010 55);
  --border-strong:     oklch(35% 0.012 55);
  --border-focus:      oklch(65% 0.14 35);
}
```

> [!IMPORTANT]
> **No gray text on colored backgrounds.** On tinted surfaces, text uses a shade of that surface's hue. On `--surface-sunken` (warm sand), secondary text is a darker warm tone — never `#999` or `gray-400`.

---

## Typography

### Font Selection

| Role | Font | Weight | Why |
|------|------|--------|-----|
| **Display / Headings** | **Instrument Sans** | 600, 700 | Geometric, clean, distinctive. Not Inter/Roboto/Open Sans. Free on Google Fonts. Has real personality in bold weights. |
| **Body / UI** | **Instrument Sans** | 400, 500 | Same family, stays cohesive. Reads well at small sizes. |
| **Code / Terminal** | **JetBrains Mono** | 400, 700 | Purpose-built for code. Ligatures. Distinct from body font. |

### Type Scale (Fluid)

```css
:root {
  --text-xs:    clamp(0.70rem, 0.65rem + 0.25vw, 0.75rem);     /* 11-12px — timestamps, badges */
  --text-sm:    clamp(0.80rem, 0.75rem + 0.25vw, 0.875rem);    /* 13-14px — file tree, metadata */
  --text-base:  clamp(0.875rem, 0.83rem + 0.22vw, 1rem);       /* 14-16px — body, UI labels */
  --text-lg:    clamp(1.05rem, 0.95rem + 0.5vw, 1.25rem);      /* 17-20px — section titles */
  --text-xl:    clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem);       /* 20-24px — page headings */
  --text-2xl:   clamp(1.6rem, 1.3rem + 1.5vw, 2.25rem);        /* 26-36px — hero/landing */
  --text-3xl:   clamp(2rem, 1.5rem + 2.5vw, 3rem);             /* 32-48px — landing hero only */
}
```

### Typography Rules

- **Left-aligned everything.** No centered text blocks except the landing hero.
- **Bold for structure, not decoration.** Headings at 700, section labels at 600, body at 400.
- **Code font is only for code.** File tree labels, chat messages, UI labels — all use Instrument Sans. Only the editor, terminal, and inline `code` spans use JetBrains Mono.
- **Line height:** Body text at 1.5, headings at 1.2, code at 1.6 (Monaco default).
- **Letter spacing:** Headings at -0.02em (tighten). Body at 0 (default). All-caps labels at 0.05em (loosen).

---

## Spacing System

8px base grid. Use these values and nothing else.

```css
:root {
  --space-0:   0;
  --space-1:   clamp(0.125rem, 0.1rem + 0.1vw, 0.25rem);     /* 2-4px */
  --space-2:   clamp(0.25rem, 0.2rem + 0.2vw, 0.5rem);       /* 4-8px */
  --space-3:   clamp(0.5rem, 0.4rem + 0.4vw, 0.75rem);       /* 8-12px */
  --space-4:   clamp(0.75rem, 0.6rem + 0.6vw, 1rem);         /* 12-16px */
  --space-5:   clamp(1rem, 0.8rem + 1vw, 1.5rem);            /* 16-24px */
  --space-6:   clamp(1.5rem, 1.2rem + 1.5vw, 2rem);          /* 24-32px */
  --space-7:   clamp(2rem, 1.5rem + 2.5vw, 3rem);            /* 32-48px */
  --space-8:   clamp(3rem, 2rem + 4vw, 5rem);                /* 48-80px */
}
```

**Rhythm rules:**
- **Tight grouping** (space-2 to space-3) between related items — file tree nodes, tab items, chat messages
- **Generous separation** (space-6 to space-7) between sections — sidebar vs editor, dashboard sections
- **Asymmetric padding** — a sidebar might have `padding: space-4 space-3` (more vertical than horizontal)

---

## Component Specifications

### IDE Layout

```
┌──────────────────────────────────────────────────────────┐
│  HEADER BAR (48px height)                                │
│  Project name (bold) · Online users (dots) · Settings    │
├──────────┬───────────────────────────────┬───────────────┤
│          │  EDITOR TABS (36px)           │               │
│  FILE    │  ┌─────┬──────┬──────┐       │   SIDE PANEL  │
│  TREE    │  │main │utils │app.py│       │   (Chat or    │
│          │  └─────┴──────┴──────┘       │    AI Review) │
│  240px   │  MONACO EDITOR               │   280px       │
│  width   │  (fills remaining space)     │   width       │
│          │                              │   toggleable  │
│          │                              │               │
│          ├──────────────────────────────-┤               │
│          │  TERMINAL PANEL (resizable)   │               │
│          │  min: 120px, default: 200px   │               │
└──────────┴──────────────────────────────-┴───────────────┘
```

**Layout details:**
- Sidebar: fixed 240px, collapsible to 0 with a toggle
- Side panel (chat/review): fixed 280px, toggleable, slides in from right
- Terminal: resizable via drag handle, min 120px, max 50% of viewport height
- All dividers: 1px `--border-default`, drag handle area 4px wide (invisible, cursor changes on hover)

### Header Bar

- **Height:** 48px
- **Background:** `--surface-raised`
- **Bottom border:** 1px `--border-default`
- **Left section:** Project name in `--text-lg` weight 600 + language badge (small pill, `--surface-sunken` bg)
- **Center:** Empty (not centered text — left section is left-aligned, right section is right-aligned)
- **Right section:** Online user dots (8px circles in user colors, overlapping by 4px) + settings gear icon + theme toggle (sun/moon icon, no switch component)

### File Tree (Sidebar)

- **Background:** `--surface-sunken`
- **Top:** "FILES" label in `--text-xs`, weight 600, uppercase, `--text-secondary`, letter-spacing 0.05em. Beside it: + icon (new file) and folder+ icon (new folder), only visible on sidebar hover
- **Tree nodes:**
  - Indent: 16px per level
  - Row height: 28px
  - Icon: 16x16, language-specific file icons (not generic) + folder chevrons
  - Text: `--text-sm`, weight 400, `--text-primary`
  - Hover: `--surface-raised` background, no border-radius (full-width highlight)
  - Active (open in editor): `--accent-primary` left border (2px), font-weight 500
  - Right-click: context menu (rename, delete, copy path) — appears inline, not a modal
- **Scrollbar:** 4px wide, `--border-strong` thumb, transparent track
- **Empty state:** "No files yet" in `--text-secondary`, italic, with a subtle file icon above

### Editor Tabs

- **Bar background:** `--surface-raised`
- **Tab height:** 36px
- **Inactive tab:** `--text-secondary`, `--surface-raised` bg, bottom border 1px `--border-default`
- **Active tab:** `--text-primary`, weight 500, `--editor-bg` background, NO bottom border (tab bleeds into editor). Top border: 2px `--accent-primary`
- **Unsaved indicator:** A small dot (6px) in `--warning` to the right of the filename, not a modified icon
- **Close button:** × appears on hover only, 16px, `--text-tertiary` → `--error` on hover
- **Tab overflow:** Horizontal scroll with arrow buttons, no wrapping

### Monaco Editor

- **Theme:** Custom theme built on the color palette — NOT `vs-dark` or `vs-light` defaults
- **Light mode editor theme:**
  - Background: `--editor-bg`
  - Foreground: `--text-primary`
  - Comments: `--text-tertiary`, italic
  - Strings: `oklch(45% 0.12 155)` — forest green
  - Keywords: `oklch(45% 0.10 35)` — dark terracotta
  - Functions: `oklch(40% 0.08 250)` — slate blue
  - Numbers: `oklch(50% 0.12 70)` — amber
  - Types: `oklch(45% 0.10 330)` — plum
- **Line numbers:** `--text-tertiary`
- **Active line:** `--editor-line-hl` background, no border
- **Selection:** `oklch(85% 0.04 35)` — faint terracotta tint
- **Minimap:** ON by default, 60px wide

### Remote Cursors

- **Cursor line:** 2px wide, user's `--user-color-N`
- **Name label:** Positioned above the cursor, user's color as background, `--text-inverse` text, `--text-xs`, weight 600, padding 2px 6px, border-radius 2px (small, not rounded pill). Fades to 30% opacity after 3 seconds of inactivity, back to 100% on movement.
- **Selection highlight:** User's color at 15% opacity as background

### Merge Visualization

- **Line attribution:** Thin left-border (3px) in user's color on lines they recently edited. Fades over 30 seconds.
- **Hot zone indicator:** When two users are within 5 lines, a subtle pulsing glow (user colors blended at 8% opacity) on the gutter area
- **Timeline panel:** Opens as a bottom drawer (replaces terminal temporarily)
  - Each event: single line — user dot + filename + action + timestamp
  - Compact, scannable, `--text-sm`
  - Selected event highlights the corresponding editor region
- **Playback:** Slider at top of timeline, play/pause/step buttons. Scrubbing shows ghosted editor state.

### Terminal Panel

- **Background:** `--terminal-bg` (always dark, even in light mode)
- **Font:** JetBrains Mono, 13px, line-height 1.5
- **Tab bar:** Inside the terminal panel, 28px height, dark surface
- **Active tab:** Bright text, bottom border in `--accent-primary`
- **New terminal button:** "+" icon at the end of tab bar
- **Drag handle:** 4px strip at the top of terminal panel, `--border-strong`, cursor: `ns-resize`

### Presence Panel (in Header)

- **Online users:** Row of 8px colored dots, overlapping by 4px, in the header bar
- **Hover on dot:** Tooltip showing username + "editing filename.py"
- **Click on dots area:** Expands a small dropdown showing full user list with names, colors, and current file
- **No heavy avatar components** — just colored dots. It's utilitarian.

### Chat Panel (Side Panel)

- **Toggle:** Chat icon in header, opens side panel from right
- **Background:** `--surface-ground`
- **Messages:** Left-aligned, no bubbles. Username in bold `--text-sm` + user color, then message text below in `--text-base`. Timestamp in `--text-xs` `--text-tertiary` on the right.
- **Code reference:** When a message links to code, it shows as a monospace snippet below the message in `--surface-sunken` bg with a "Go to line" link
- **Input:** Fixed to bottom of panel. Text input with `--surface-raised` bg, 1px `--border-default`, `--border-focus` on focus. No send button — Enter to send.
- **Typing indicator:** "jane is typing" in `--text-xs`, italic, `--text-tertiary`

### AI Settings (Inline Panel, Not Modal)

- **Trigger:** AI icon (⚡ or similar) in the header bar
- **Opens:** A compact dropdown panel (not a modal — modals are lazy)
- **Provider selector:** Three buttons in a row (OpenAI | Gemini | Claude), selected one has `--accent-primary` bottom border and weight 600
- **API key input:** Text input below, password-masked, with a "Show" toggle
- **Status indicator:** Small dot — green (key valid), red (key invalid), gray (not set)
- **Storage note:** Small text: "Key stored in your browser only" in `--text-xs` `--text-tertiary`

### AI Code Review Panel (Side Panel)

- **Toggle:** "Review" button in editor toolbar
- **Background:** `--surface-ground`
- **Review comments:** Listed vertically
  - Each comment: severity icon (colored dot: red/amber/blue) + line number badge + message text
  - Expandable: click to show suggestion (code diff)
  - Actions: "Apply" (green text link) | "Dismiss" (gray text link)
- **Gutter decorations:** Small colored dots in the editor gutter at reviewed lines
- **Hover on gutter dot:** Shows review comment in a tooltip (not a hover card)

### Auth Pages (Login / Register)

- **Layout:** Full page. NOT centered card on gradient background (AI slop).
- **Structure:** Two-column on desktop.
  - **Left column (60%):** Brand area. Large `--text-3xl` heading "Build together." in weight 700, left-aligned. Subtitle below in `--text-lg` `--text-secondary`. Background: `--surface-sunken` with a subtle geometric pattern (repeating diagonal lines or dots in `--border-default` color, CSS-only).
  - **Right column (40%):** Form area. `--surface-ground` background. Form vertically centered.
- **Form fields:** Full-width inputs, 48px height, `--surface-raised` bg, 1px `--border-default` border. Label above each field in `--text-sm` weight 500. Focus: `--border-focus` border (2px).
- **Submit button:** Full-width, 48px height, `--accent-primary` bg, `--text-inverse` text, weight 600. Hover: `--accent-primary-hover`. No rounded corners — 4px border-radius max.
- **Switch link:** "Already have an account? Log in" below the button, `--accent-secondary` for the link.
- **Mobile:** Single column, brand heading on top (smaller), form below.

### Dashboard (Project List)

- **Layout:** NOT a card grid. Use a **table-like list layout**.
- **Top section:** "Your Projects" in `--text-xl` weight 700, left-aligned. "New Project" button on the right — text button with + icon, `--accent-primary` color, NOT a filled button.
- **Project list:**
  - Each project is a row: `--surface-ground` bg, border-bottom 1px `--border-default`
  - Row content: Project name (weight 600) + language badge (pill) + member count (text) + last updated (relative time, right-aligned, `--text-secondary`)
  - Hover: `--surface-raised` bg
  - Click: navigates to editor
- **Empty state:** "No projects yet. Create one to get started." with a text link "Create your first project →" in `--accent-primary`. No illustration, no oversized icon.

### Create Project (Inline Panel)

- **Not a modal.** Opens as a full-page or slide-in panel.
- **Step 1:** Project name input + language dropdown
- **Step 2:** Template picker — a compact list (not a card grid), each template is a row: icon + name + description. Selected row has `--accent-primary` left border. "Blank project" is the first option.
- **Action:** "Create" button at the bottom, `--accent-primary`

### Invite Flow

- **In editor header:** "Invite" text button opens a small dropdown
- **Dropdown content:** Invite link in a monospace text field (read-only), "Copy" button beside it. That's it. No complex share settings.
- **Copied feedback:** Button text changes to "Copied ✓" for 2 seconds

---

## Interaction States

Every interactive element follows this state matrix:

| State | Visual Change |
|-------|--------------|
| **Default** | Base styling |
| **Hover** | Background lightens/darkens by 1 OKLCH lightness step. No scale. No shadow. |
| **Focus** | 2px `--border-focus` outline (offset 2px). Never remove. |
| **Active** | Background darkens by 2 steps. Transform: translateY(1px). |
| **Disabled** | 50% opacity. cursor: not-allowed. |
| **Loading** | Content replaced with a subtle pulse animation (opacity 0.5 → 1, 1.5s). No spinner unless >2s. |

---

## Motion Guidelines

```css
:root {
  --duration-fast:   120ms;    /* hover states, button feedback */
  --duration-normal: 200ms;    /* panel transitions, tab switches */
  --duration-slow:   350ms;    /* page transitions, panel slide-in */

  --ease-out:        cubic-bezier(0.16, 1, 0.3, 1);     /* expo ease-out — snappy, natural */
  --ease-in-out:     cubic-bezier(0.65, 0, 0.35, 1);    /* smooth in-out for looping */
}
```

**Motion rules:**
- Animate only `transform` and `opacity`. Never animate `width`, `height`, `padding`, `margin`.
- For height reveals (panels, dropdowns): use `grid-template-rows: 0fr → 1fr` transition.
- Side panel slides in: `translateX(100%) → translateX(0)`, `--duration-slow`, `--ease-out`.
- Tab switch: immediate, no transition (speed matters in an editor).
- Cursor label fade: `opacity` transition, `--duration-normal`.
- Respect `prefers-reduced-motion`: disable all transforms, keep opacity transitions.
- **No bounce. No elastic. No spring.** Smooth deceleration only.

**Page load orchestration:**
- Sidebar fades in first (0ms delay)
- Editor area fades in second (80ms delay)
- Terminal slides up third (160ms delay)
- Header elements stagger left-to-right (40ms between items)
- All at `--duration-slow` with `--ease-out`

---

## Tailwind CSS Configuration

```js
// tailwind.config.ts
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Instrument Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        // Map CSS custom properties to Tailwind utilities
        surface: {
          ground:  'var(--surface-ground)',
          raised:  'var(--surface-raised)',
          overlay: 'var(--surface-overlay)',
          sunken:  'var(--surface-sunken)',
        },
        editor: {
          bg:      'var(--editor-bg)',
          gutter:  'var(--editor-gutter)',
          linehl:  'var(--editor-line-hl)',
        },
        terminal: {
          bg:      'var(--terminal-bg)',
        },
        text: {
          primary:   'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary:  'var(--text-tertiary)',
          inverse:   'var(--text-inverse)',
        },
        accent: {
          DEFAULT:  'var(--accent-primary)',
          hover:    'var(--accent-primary-hover)',
          secondary:'var(--accent-secondary)',
        },
        semantic: {
          success:    'var(--success)',
          successBg:  'var(--success-bg)',
          warning:    'var(--warning)',
          warningBg:  'var(--warning-bg)',
          error:      'var(--error)',
          errorBg:    'var(--error-bg)',
          info:       'var(--info)',
          infoBg:     'var(--info-bg)',
        },
        border: {
          DEFAULT:  'var(--border-default)',
          strong:   'var(--border-strong)',
          focus:    'var(--border-focus)',
        },
      },
      borderRadius: {
        'sm': '2px',
        'DEFAULT': '4px',
        'md': '6px',
        // No large rounded corners. 4px max for most elements.
      },
    },
  },
}
```

---

## Anti-Pattern Checklist

Before every UI commit, verify:

- [ ] **No pure `#000` or `#fff`** — all tinted
- [ ] **No gray text on colored backgrounds** — use a shade of the bg color
- [ ] **No glassmorphism** — no blur cards, no backdrop-filter, no glow borders
- [ ] **No purple-to-blue gradients** — not anywhere
- [ ] **No neon accents on dark backgrounds** — not in dark mode either
- [ ] **No gradient text** — especially not on headings or metrics
- [ ] **No identical card grids** — use lists, tables, asymmetric layouts
- [ ] **No big icons with rounded corners above headings** — no feature grids with emoji icons
- [ ] **No centered everything** — left-aligned, asymmetric
- [ ] **No modals for things that can be inline** — use dropdowns, slide-ins, inline panels
- [ ] **No bounce/elastic animations** — smooth deceleration only
- [ ] **No cards inside cards** — flatten the hierarchy
- [ ] **No Inter, Roboto, Arial, Open Sans** — we use Instrument Sans
- [ ] **No monospace for non-code UI** — file tree labels, buttons, headings are sans-serif
- [ ] **Could someone tell AI made this?** If yes, redesign it.

---

## Font Loading

```html
<!-- In index.html <head> -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
```

JetBrains Mono loaded from local `public/fonts/` to avoid external dependency for the editor font (self-hosted `.woff2` files).

```css
@font-face {
  font-family: 'JetBrains Mono';
  src: url('/fonts/JetBrainsMono-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'JetBrains Mono';
  src: url('/fonts/JetBrainsMono-Bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
```
