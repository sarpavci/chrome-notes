# Design System — Linear (v2)

Chrome Notes popup uses the **Linear** design system (dark-native, minimal, single-accent).

## Color tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--linear-canvas` | `#0f1011` | Popup background (Panel Dark) |
| `--linear-elevated` | `#191a1b` | Elevated surfaces (header/footer fill if separated) |
| `--linear-text-primary` | `#f7f8f8` | Note text, title |
| `--linear-text-secondary` | `#d0d6e0` | Secondary labels |
| `--linear-text-muted` | `#8a8f98` | Placeholder, footer status |
| `--linear-accent` | `#7170ff` | Focus ring, accent elements, caret |
| `--linear-accent-brand` | `#5e6ad2` | Brand accent (reserved for primary actions) |
| `--linear-destructive` | `#eb5757` | Clear confirm button |
| `--linear-border-subtle` | `rgba(255,255,255,0.05)` | Default dividers |
| `--linear-border` | `rgba(255,255,255,0.08)` | Header/footer rules |
| `--linear-hover` | `rgba(255,255,255,0.05)` | Icon-button hover surface |
| `--linear-hover-destructive` | `rgba(235,87,87,0.12)` | Destructive button hover |

## Typography

- **Font family:** Inter Variable — `font-feature-settings: "cv01", "ss03"`
- **Weight 400** — body text / note content
- **Weight 510** — UI labels (title)
- **Weight 590** — strong labels

## Spacing

- 8px grid (8 / 12 / 16)

## Radius

- **Popup container:** 12px (`rounded-xl`)
- **Buttons:** 6px (`rounded`)
- **Micro elements:** 2px

## Surface structure (360×480 popup)

```
┌──────────────────────────────────────┐  360px
│  Notes                    [⧉]  [🗑]    │  Header  h-12, px-3
│                                        │  border-bottom rgba(255,255,255,.08)
├──────────────────────────────────────┤
│                                        │
│  Start typing your note…               │  Textarea  flex-1, p-3
│                                        │  bg transparent, caret #7170ff
│                                        │
├──────────────────────────────────────┤
│  Saved                                 │  Footer  h-7, px-3
└──────────────────────────────────────┘  border-top rgba(255,255,255,.08)
```

## Rounded corners (MV3 extension chrome)

Chrome's extension popup window renders in a browser-owned frame. To prevent white corner triangles behind a rounded container:

```css
html, body {
  background: transparent;
  margin: 0;
}
```

The popup container gets `rounded-xl overflow-hidden` (12px radius + clip children to curve).

## Accessibility

- Focus ring: 2px accent `#7170ff` on all interactive elements
- `aria-label` on all icon buttons
- Contrast: `#f7f8f8` on `#0f1011` ≈ 17:1 (AAA); `#8a8f98` on `#0f1011` ≈ 6:1 (AA)
