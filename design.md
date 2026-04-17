# Meet App UI Polish Design

## App Identity
- App name: CodeBeam
- Tagline: Focused video rooms for fast technical collaboration
- Target persona: Team and enterprise users running engineering reviews, support calls, and project syncs
- Emotional tone: Focus, Trust, Energy, Calm

## Design Language
- Color system: primary `--primary` for key actions, surface `--background`/`--card`/`--popover`, accent `--accent` for secondary affordances, semantic `--destructive`/`--muted`/`--ring`, meeting tokens `--tile-bg`/`--control-bar-bg`/`--speaking-ring`/`--muted-overlay`
- Typography scale: Geist Sans with Geist Mono for timers and room codes; `text-xs` metadata, `text-sm` controls, `text-base` body, `text-lg` panel titles, `text-2xl` lobby headings, `text-4xl` page headings; medium for labels, semibold for actions, bold for headings
- Spacing system: 8px base grid using Tailwind `gap-2`, `gap-3`, `gap-4`, `p-2`, `p-4`, `p-6`
- Motion principles: transform and opacity only; fast `150ms`, base `250ms`, slow `400ms`; spring for tile entry, ease-out for panels, no motion for reduced-motion users
- Border radius tokens: sharp `0`, soft `6px`, pill `999px`

## Component Inventory
- Room grid / participant tiles: needs work; LiveKit grid exists, custom overlays and states missing
- Control bar (mic/cam/screen share/end call): needs work; basic LiveKit toggles exist, tooltips, reactions, badges, frosted shell missing
- Chat panel: needs work; basic socket chat exists, scroll area, self bubbles, hover timestamp, unread state missing
- Participant list sidebar: needs work; participant list and waiting-room approval exist, search and richer states missing
- Settings modal: missing; device selects exist inline only
- Waiting room / lobby: needs work; LiveKit PreJoin exists, custom audio meter and selector polish missing
- Reaction overlay: missing
- Network quality indicator: missing
- Recording badge: missing
- Speaker spotlight / pinning: needs work; screenshare focus exists, manual pinning missing

## Library Map
| Component | Source | Notes |
|---|---|---|
| Dialog/Modal | shadcn/ui Dialog | + Framer animate |
| Tooltip | shadcn/ui Tooltip | Radix primitive |
| Avatar | shadcn/ui Avatar | fallback initials |
| Toggle | shadcn/ui Toggle | mic/cam state |
| Dropdown | shadcn/ui DropdownMenu | existing |
| Slider | shadcn/ui Slider | volume |
| Scroll area | shadcn/ui ScrollArea | chat, participants |
| Badge | shadcn/ui Badge | recording, HD, pin, unread |
| Sheet | shadcn/ui Sheet | mobile sidebar |

## Motion Spec
- Participant joins: `scale(0.8)` to `1` + fade, `250ms` spring
- Mic toggle: icon swap/morph, `150ms`
- Speaking indicator: pulse ring, CSS keyframe
- Panel open/close: slide + fade, `300ms`
- Reaction: float up + fade, `800ms`
- Control bar hover: `translateY(-2px)`, `150ms`

## Anti-Patterns
- No generic `#333`/`#666`; use semantic tokens
- No hardcoded pixel breakpoints; use Tailwind `sm`/`md`/`lg`
- No `z-index: 9999`; use z-index scale
- No animation for `prefers-reduced-motion` users
- No color-only states; always pair color with icon or label
