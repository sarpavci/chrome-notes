# Design System — Linear (Chrome Notes v2)

Source: Linear design system (Open Design project: `chrome-notes-popup-v2`)
Applied to: Chrome Notes popup v2 reskin

## Color Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--color-canvas` | `#0f1011` | Popup background (Linear "Panel Dark") |
| `--color-elevated` | `#191a1b` | Header/footer fill if separated |
| `--color-text-primary` | `#f7f8f8` | Note text, title — never pure `#fff` |
| `--color-text-secondary` | `#d0d6e0` | Secondary labels |
| `--color-text-muted` | `#8a8f98` | Placeholder, "Saved" footer |
| `--color-accent` | `#7170ff` | Focus ring, caret, active accents |
| `--color-accent-brand` | `#5e6ad2` | Reserved — primary action |
| `--color-destructive` | `#eb5757` | Clear confirm action |
| `--color-border-subtle` | `rgba(255,255,255,0.05)` | Default dividers |
| `--color-border-standard` | `rgba(255,255,255,0.08)` | Header/footer rules |
| `--color-hover-surface` | `rgba(255,255,255,0.05)` | Icon-button hover |

## Typography

| Token | Value |
|-------|-------|
| Font family | Inter Variable |
| Font features | `"cv01", "ss03"` |
| Weight — UI | 510 |
| Weight — body | 400 |
| Weight — strong | 590 |

## Spacing

- Base grid: 8px
- Common steps: 8 / 12 / 16

## Radius

| Context | Value |
|---------|-------|
| Popup window | 12px |
| Buttons | 6px |
| Micro elements | 2px |

## Extension Chrome Note

Chrome renders the popup window's background behind any rounded corners. To prevent
white corner triangles behind the 12px popup radius:

```css
html, body {
  background: transparent;
  margin: 0;
}
```

Apply `border-radius: 12px; overflow: hidden;` on the root container.
