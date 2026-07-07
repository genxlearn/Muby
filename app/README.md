# Baby Wonder Weeks — React Native (Expo) implementation

An iOS-first mobile app for Vietnamese new parents, implementing the **Muby App
Final** design (vivid-orange Muby theme, floating pill navigation, Icon3D
gradient badges, phase-based leap forecast, semi-3D Bống mascot, 1-month
Premium trial). This is a faithful React Native port of the HTML/React
prototype in `../project/Muby App Final.html` — recreated with native
primitives, `react-native-svg`, a themed token system, and a light/dark theme
toggle.

Highlights of the final revision: 4-tab floating nav (Hôm nay · Leap · Phát
triển · Market), Mama profile via the Today avatar, compact phase-based Today
hero with embedded 7-day forecast, symptoms grid + action-card carousel, a
dedicated EASY explainer screen, Growth with 5 metrics + typical-range
comparison, in-app sheets for baby info / invite / units / terms, and a Market
"coming soon" tab.

## Dynamic data & phone auth

Everything age-dependent is computed from the baby's **real date of birth**
(`src/data/leapEngine.ts`): age label, the leap in progress (or upcoming /
between-leaps / all-done states), leap day & progress, today's intensity, the
7-day forecast with real weekday names, the 77-week calendar position, the
EASY variant, and typical daily ranges per age bracket. The profile entered in
onboarding (name · DOB · gender) is persisted per account
(`src/state/BabyContext.tsx`) and editable from Mama → baby card.

Phone sign-in is real (`src/auth/`): register with OTP verification, login
with phone + password, password reset via OTP, session persistence (the app
reopens signed-in), and logout. Two backends:

- **demo** (default, zero setup): accounts stored on-device with SHA-256
  password hashing; the OTP is displayed inside the app since no SMS is sent.
- **supabase**: real SMS OTP via Supabase Auth (Twilio/Vonage phone provider).
  Fill in `src/auth/config.ts` and switch `mode` to `'supabase'`.

## Stack

- **Expo SDK 57** · React Native 0.86 · React 19 · TypeScript (strict)
- `react-native-svg` — the Bống mascot, icons, growth chart, spark lines
- `expo-linear-gradient` — Muby gradient hero cards
- `@expo-google-fonts/fraunces` + `/inter` — display + UI type
- `react-native-safe-area-context` — device-native safe areas (no fake bezel)

## Running

```bash
cd app
npm install
npm run ios      # or: npm run android / npm run web
```

Then open in a simulator or Expo Go. The app boots at the **A1 Welcome** screen
and runs the full immersive flow (Auth → Onboarding → main app) with no external
controls — everything happens inside the device frame, exactly like the final
prototype the designer landed on.

## Architecture

```
App.tsx                     providers (SafeArea, Theme, App) + font gate + overlays
src/
  theme/
    tokens.ts               CSS custom properties → typed light/dark theme object,
                            radii, spacing, shadow helpers, fontFamily() mapping
    ThemeContext.tsx        <ThemeProvider mode> + useTheme()
    Txt.tsx                 Text wrapper that resolves the right weighted font family
    useAppFonts.ts          loads Fraunces + Inter weights
  navigation/AppContext.tsx state machine (route/sheet/toast/intensity/premium/trial)
  AppFlow.tsx               router: auth · onboarding · tabs · stacks
  mascot/Bong.tsx           parametric semi-3D mascot (11 emotions × 4 onesies)
  components/               Button/Card/HeroCard/Chip/Input/Sheet/BottomNav/…
  data/sampleData.ts        one baby (Bống, ~3.5 mo, mid-Leap 4) + 10 leaps, v4 content
  screens/
    auth.tsx                A1–A6 + Onboarding OB1–OB3
    Today.tsx, shared.tsx   Today home + shared ActionCard/SunnyPlay/Symptom pieces
    sheets.tsx              Quick Log + Soothing bottom sheets
    leap.tsx                Leap tab (Hôm nay/Hành trình/Lịch) + Leap Detail
    growth.tsx              Growth chart · Add Measurement · Log History · Library
    me.tsx                  Notifications · Profile/Me · Premium Paywall
    DesignSystem.tsx        Screen 0 — tokens, palette, mascot & component reference
```

### Porting notes (web prototype → React Native)

- **CSS variables** became a typed theme object (`makeTheme('light'|'dark')`);
  every `var(--x)` maps to `colors.*`. Dark mode is a live in-app toggle
  (Mama → Chế độ tối), never gated.
- **The device is the phone** — the prototype's fake iPhone bezel + JS scaling
  were dropped in favor of real safe-area insets.
- **Fonts**: RN can't synthesize weights on a custom font, so `Txt` picks the
  correct loaded family (e.g. `Inter_600SemiBold`) from `fontWeight` + a `serif`
  flag.
- **Animations**: CSS keyframes → RN `Animated`/`LayoutAnimation` (mascot float,
  hop, toast, skeleton pulse, measurement petals, collapsible disclosure).
- Reach the **Design System** reference screen by tapping the version line at the
  bottom of the Mama tab.

## Design-spec compliance (Part 10 audit)

Intensity-5 uses white ink · default intensity = 2 · dynamic leap number ·
hue-shift calendar palette · Premium never gates intensity ≥ 4 (Paywall
self-suppresses and soothing sounds unlock when the baby is crying) · Premium
leads with the free 1-month trial · touch targets ≥ 44pt · all copy Vietnamese ·
no banned words ("Khôi phục mật khẩu" instead of *quên*).
