# MUBY DESIGN SYSTEM v1.0
## Kiến trúc 3 lớp Untitled UI: Primitive → Semantic → Component

Giữ nguyên cấu trúc token của Untitled UI (scale 25–950, spacing, radius), thay Brand tím → warm orange, thêm Intensity scale đặc trưng Muby. Font: Fraunces (display) + Inter (UI).

File token W3C/Figma: `Muby-Style-tokens.json` (import trực tiếp vào Figma Variables).

---

## LỚP 1 — PRIMITIVE TOKENS (đã có trong JSON)

Đây là các giá trị gốc, KHÔNG dùng trực tiếp trong component. Luôn dùng qua lớp Semantic.

### Color scales (mỗi màu 13 bậc: 25→950)
```
Brand (warm orange):  25 #FEFAF6 → 600 #D87242 → 950 #4A2414
Gray warm (light):    25 #FDFCFA → 600 #6B5B52 → 950 #150C08
Gray warm (dark):     25 #1F1812 → 600 #B8AC9B → 950 #FFFFFF
Success (sage):       25 #F6FBF3 → 400 #7A9A65 → 950 #1A2215
Warning (amber):      25 #FFFCF5 → 300 #F5C842 → 950 #2E2009
Error (soft brick):   25 #FEF9F8 → 500 #B85450 → 950 #2A0F0E
```

### Intensity scale (Muby signature — 5 bậc hue-shift)
```
Light:  1 #C8DFBC · 2 #F0E6C8 · 3 #F5C842 · 4 #E07C3A · 5 #C24A2A
Dark:   1 #4A6B3C · 2 #5C4E22 · 3 #7A6010 · 4 #8C4018 · 5 #7A2810
```

### Spacing (8pt base, giữ nguyên Untitled UI)
```
0=0 · 0.5=2 · 1=4 · 1.5=6 · 2=8 · 3=12 · 4=16 · 5=20 · 6=24 · 8=32 · 10=40 · 12=48 · 16=64 · 20=80 · 24=96
```

### Radius
```
none=0 · xs=4 · sm=8 · md=12 · lg=20 · xl=28 · 2xl=36 · full=9999
```

---

## LỚP 2 — SEMANTIC TOKENS (alias → primitive)

Đây là lớp component THỰC SỰ tham chiếu. Khi đổi theme (light/dark), chỉ lớp này đổi.

### Background
```
bg/canvas          → Gray warm 50   (light #FAF6EE / dark #1A1410)
bg/elevated        → white          (light #FFFFFF / dark Gray warm-d 100 #241D17)
bg/sunken          → Gray warm 100  (light #F2EBDD / dark #15100C)
bg/accent-soft     → Brand 100      (light #FBE7D5 / dark Brand 950 #4A2414)
bg/brand           → Brand 600      (#D87242)
bg/brand-hover     → Brand 700      (#C25E2F)
```

### Text
```
text/primary       → Gray warm 800  (light #2A1A14 / dark #F5EFE2)
text/secondary     → Gray warm 600  (light #6B5B52 / dark #B8AC9B)
text/muted         → Gray warm 400  (light #A39989 / dark #7A6F62)
text/on-brand      → white          (#FFFFFF)
text/on-intensity5 → Gray warm 50   (#FAF6EE — chỉ dùng trên intensity-5 brick)
```

### Border
```
border/subtle      → Gray warm 200  (light #E8DECF / dark #2E251E)
border/default     → Gray warm 300  (light #D4C7B5 / dark #3A2F26)
border/brand       → Brand 600      (#D87242)
```

### Semantic status
```
fg/success         → Success 400 (#7A9A65)
fg/warning         → Warning 300 (#F5C842)
fg/error           → Error 500   (#B85450)
bg/success-soft    → Success 50  (#EDF5E7)
bg/warning-soft    → Warning 50  (#FFF8E8)
bg/error-soft      → Error 50    (#FCEEEC)
```

### Gradient (hero cards)
```
gradient/hero      → linear 135° [hero-start → hero-end]
                     light: #3D2A1F → #5C3D2A
                     dark:  #0F0C09 → #2A1D14
```

---

## LỚP 3 — TYPOGRAPHY TOKENS

### Font families
```
font/display  → "Fraunces", Georgia, serif    (headings, leap names, hero numbers)
font/body     → "Inter", -apple-system, sans   (mọi UI text khác)
```

### Type scale (Untitled UI naming: display/text)
```
NAME              FONT       SIZE  LINE   WEIGHT   USAGE
display-lg        Fraunces   36    44     600      Onboarding hero, splash
display-md        Fraunces   28    36     600      Screen titles, leap name
display-sm        Fraunces   24    32     600      Card hero titles
heading-lg        Fraunces   20    28     600      Section headers (serif moments)
heading-md        Inter      18    26     600      Card titles, list headers
heading-sm        Inter      16    24     600      Sub-headers
body-lg           Inter      16    24     400      Primary body, hero descriptions
body-md           Inter      14    20     400      Default body, card content
body-sm           Inter      13    18     400      Captions, helper text
label-lg          Inter      14    20     500      Buttons, tab labels
label-sm          Inter      12    16     500      Pills, badges, timestamps
```

---

## LỚP 4 — COMPONENT LIBRARY

Mỗi component map trực tiếp tới semantic tokens. States đầy đủ: default / hover / pressed / disabled / focus.

### 4.1 — Button

**Button/Primary**
```
bg:            bg/brand (#D87242)
text:          text/on-brand (Inter label-lg)
height:        56pt
padding-x:     spacing-6 (24px)
radius:        radius-full (9999)
touch-target:  ≥ 56pt ✓

States:
  hover:     bg/brand-hover (#C25E2F)
  pressed:   bg/brand-hover + scale 0.98
  disabled:  bg Gray warm 200, text Gray warm 400
  focus:     2pt border/brand offset 2px
```

**Button/Secondary**
```
bg:            transparent
border:        1.5pt border/default
text:          text/primary (Inter label-lg)
height:        56pt · radius-full
States: hover bg/sunken · disabled opacity 40%
```

**Button/Text**
```
bg:            none
text:          fg brand (Brand 600) (Inter label-lg)
padding-x:     spacing-3
States: hover text Brand 700 + underline
```

### 4.2 — Card

**Card/Base**
```
bg:            bg/elevated
radius:        radius-lg (20)
padding:       spacing-4 (16)
shadow:        0 4px 12px rgba(42,26,20,0.06)   [dark: rgba(0,0,0,0.4)]
border:        none (dùng shadow để tách lớp)
```

**Card/Hero (gradient)**
```
bg:            gradient/hero (135°)
radius:        radius-xl (28)
padding:       spacing-5 (20)
text:          text/on-brand (white)
shadow:        0 12px 32px rgba(42,26,20,0.12)
intensity-band: top edge 5pt, màu = Intensity[level]
```

**Card/Stat (2×2 dashboard)**
```
bg:            bg/elevated · radius-lg · padding spacing-4
icon-circle:   40pt, bg = màu category-soft, illustrated icon 24pt
metric:        heading-md (Inter 18/600)
trend-pill:    label-sm, bg/success-soft, fg/success
```

**Card/Action ("Giúp bé hợp tác")**
```
bg:            bg/elevated · radius-lg · padding spacing-4
left-strip:    3pt, màu = Intensity[current level]
icon:          32pt illustrated (top-left)
title:         heading-sm (Inter 16/600) — mô tả vấn đề cụ thể
body:          body-md (Inter 14/400), text/secondary — WHY + WHAT
action-btn:    Button/Text hoặc pill "🎵 Bật tiếng ồn →"
```

### 4.3 — IntensityBadge

```
Sizes: sm (20pt) / md (28pt) / lg (36pt)

Structure: pill, bg = Intensity[level], radius-full
  L1: bg #C8DFBC · text/primary · "🌼 Tuần nắng đẹp"
  L2: bg #F0E6C8 · text/primary · "💛 Bé thoải mái"
  L3: bg #F5C842 · text/primary · "🤍 Bé cần thêm hơi ấm"
  L4: bg #E07C3A · text/primary · "☁️ Hôm nay khá khó"
  L5: bg #C24A2A · text/on-intensity5 (WHITE) · "🌧️ Bé cần mama nhất"

RULE: chỉ L5 dùng text trắng. L1-L4 dùng text/primary (đủ contrast WCAG AA).
RULE: white text chỉ ở size lg (contrast fail ở size nhỏ).
```

### 4.4 — Input

```
bg:            bg/sunken
border:        1.5pt border/default
radius:        radius-md (12)
height:        56pt
padding-x:     spacing-4
label:         label-lg TRÊN input (không dùng placeholder thay label)
text:          body-lg

States:
  focus:     border/brand 2pt + bg/elevated
  error:     border Error 500 + helper text fg/error
  disabled:  bg/sunken opacity 50%
```

### 4.5 — BottomNav

```
bg:            bg/elevated + shadow top 0 -2px 12px rgba(42,26,20,0.06)
height:        64pt + safe area
items:         5 (Hôm nay · Leap · [FAB] · Phát triển · Mama)
icon:          24pt · label label-sm
active:        fg brand (Brand 600)
inactive:      text/muted
FAB (center):  64pt circle, bg/brand, raised -8pt, shadow lg
```

### 4.6 — Sheet (bottom)

```
bg:            bg/elevated
radius:        top radius-xl (28), bottom 0
handle:        36×4pt, Gray warm 300, top center
padding:       spacing-5
backdrop:      rgba(26,20,16,0.4)
heights:       Quick Log 65% · Soothing 80% · detail 90%
```

### 4.7 — Pill / Chip

```
Symptom pill:  bg/sunken, radius-full, label-sm, text/secondary, padding 6×12
Filter chip:   bg/elevated + border/subtle, active → bg/accent-soft + fg brand
Trend pill:    bg/success-soft, fg/success, label-sm
```

### 4.8 — Toast

```
bg:            text/primary (inverted)
text:          bg/canvas (Inter body-md)
radius:        radius-full
position:      top, safe area + 8pt
duration:      3s auto-dismiss
max:           1 tại 1 thời điểm
```

### 4.9 — EmptyState

```
Bống:          160pt (emotion snug/happy)
title:         heading-md, text/primary, centered
helper:        body-md, text/secondary, centered
CTA:           Button/Primary (nếu có action)
```

### 4.10 — Character Bống

```
Format:        SVG-native, viewBox 0 0 200 240
Sizes:         260 (onboarding) · 180 (leap detail) · 130 (today hero)
               · 100 (forms) · 80 (timeline) · 56 (tiles) · 40 (log avatar) · 28 (calendar)
Emotions:      11 (happy, blissful, curious, excited, fussy, snug,
               eating, surprise, uncertain, crying, sleeping)
Environment:   Bống ngồi trong scene nursery (crib, rèm, đồ chơi) — warm palette
Onesie colors: orange #D87242 · sage #9CB888 · cream #E8D4B5 · lavender #B5A8C4

Intensity → Bống:
  L1→blissful+sage · L2→happy+orange · L3→uncertain+cream
  L4→crying(1 tear)+lavender · L5→crying(2 tears)+lavender

RULE: crying Bống (L4/L5) LUÔN kèm reassurance copy.
```

---

## LỚP 5 — COMPONENT STATE MATRIX

Mọi interactive component PHẢI có đủ 5 state (Untitled UI standard):

| Component | default | hover | pressed | disabled | focus |
|-----------|---------|-------|---------|----------|-------|
| Button/Primary | ✓ | ✓ | ✓ | ✓ | ✓ |
| Button/Secondary | ✓ | ✓ | ✓ | ✓ | ✓ |
| Input | ✓ | — | — | ✓ | ✓ |
| Card/Action | ✓ | ✓ | ✓ | — | — |
| BottomNav item | ✓ | — | ✓ (active) | — | ✓ |
| Chip | ✓ | ✓ | ✓ (active) | ✓ | ✓ |

---

## LỚP 6 — UI STACK (5 trạng thái mỗi screen)

Theo Cẩm Nang — mỗi màn hình phải thiết kế đủ:

```
1. Ideal State     — có data đầy đủ (happy path)
2. Empty State     — lần đầu / chưa có data → EmptyState component + CTA
3. Loading State   — SkeletonCard (pulse opacity 1.5s)
4. Error State     — ErrorBanner "Không tải được. Thử lại nhé 💛" + retry
5. Partial State   — một phần data (VD: có log nhưng chưa đo growth)
```

---

## MAPPING: Untitled UI → Muby (đối chiếu)

| Untitled UI | Muby | Ghi chú |
|-------------|------|---------|
| Brand (tím #7F56D9) | Brand (orange #D87242) | Thay hue, giữ scale 13 bậc |
| Gray (lạnh) | Gray warm | Neutral ấm hơn cho 3am |
| — | Intensity (5 bậc) | MỚI — signature Muby |
| Error (đỏ #F04438) | Error (brick #B85450) | Softer, ít harsh |
| Success (#17B26A) | Success (sage #7A9A65) | Warm sage |
| Inter (default) | Fraunces + Inter | Thêm serif cho display |
| radius 8 default | radius-lg 20 default | Bo tròn mềm hơn |
| Spacing (8pt) | Spacing (8pt) | Giữ nguyên |

---

## CHECKLIST TRIỂN KHAI

**Import vào Figma:**
- [ ] Import `Muby-Style-tokens.json` vào Figma Variables (Plugins → Design Tokens)
- [ ] Tạo 2 modes: Light / Dark cho collection
- [ ] Bind semantic tokens → primitive scales
- [ ] Tạo Text Styles từ Typography tokens (Fraunces + Inter)

**Build components (thứ tự):**
- [ ] Button (3 variants × 5 states)
- [ ] Input (4 states)
- [ ] Card (Base / Hero / Stat / Action)
- [ ] IntensityBadge (3 sizes × 5 levels)
- [ ] BottomNav + FAB
- [ ] Sheet + Pill + Toast + EmptyState
- [ ] Bống (11 emotions × environment scenes)

**Verify WCAG:**
- [ ] text/primary trên bg/canvas: contrast ≥ 4.5:1 ✓
- [ ] IntensityBadge L1-L4 text/primary: ≥ 4.5:1 ✓
- [ ] IntensityBadge L5 white text: ≥ 4.5:1 ✓
- [ ] Dark mode tất cả text: ≥ 4.5:1 ✓
