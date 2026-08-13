# My Daily Quest

> **You never fail. You only gain XP.**

An XP log for things you actually did. There are no goals, no deadlines, no streaks,
and nothing that tells you what you should have done. You tap `+1 XP` or `+2 XP`
after the fact, and the numbers only ever go up.

Personal app. No account, no backend — everything lives on the phone.

## Run it on your iPhone

```bash
npm install
npx expo start
```

1. Install **Expo Go** from the App Store.
2. Make sure the iPhone and the Mac are on the same Wi‑Fi network.
3. Run the two commands above. A QR code appears in the terminal.
4. Open the iPhone **Camera** app, point it at the QR code, and tap the notification
   that appears. (Expo Go can also scan it from its own "Scan QR code" screen.)
5. The app loads over the local network. Editing a file reloads it instantly.

If the QR code renders squished and won't scan (a terminal cell-ratio quirk, not a
Metro problem), skip it: the terminal prints the URL right above the QR, e.g.
`exp://10.0.0.177:8081`. Type that into **Expo Go → Enter URL manually**, or into
Safari on the iPhone. Your Mac's address: `ipconfig getifaddr en0`.

If the phone can't reach the Mac (VPN, guest Wi‑Fi, or a locked-down network), use a
tunnel instead:

```bash
npx expo start --tunnel
```

Press `r` in the terminal to reload, `j` to open the debugger, `Ctrl+C` to stop.

### Pinned to Expo SDK 54 — don't upgrade casually

The App Store build of Expo Go is **54.0.2**, and Expo Go only runs the SDK it was
built for. A newer SDK fails with *"Project is incompatible with this version of
Expo Go"* on the phone, which cannot be fixed by updating the app. So this project
stays on SDK 54 for as long as Expo Go on the App Store does.

Only move to a newer SDK once the App Store version of Expo Go matches it — or once
you switch from Expo Go to a development build, which is a different workflow.

Your XP lives in the phone's local storage under Expo Go, so it survives reloads and
restarts. Deleting Expo Go — or clearing its data — clears the log.

## Screens

- **Home** — four category cards (Applications, Coding, Behavioral, System Design),
  each showing accumulated XP and two buttons. Tapping one bumps the number with a
  light haptic tap, a short sound and a small animation. At the bottom, a small
  settings card holds **Appearance** (System / Light / Dark) and **Sound** (on/off);
  both choices are remembered.
- **History** — everything you logged, newest first, grouped by **Day / Week / Month /
  Year**. Each period shows its total and a stacked bar of what it was made of: days
  list their entries, longer periods break down into the unit below (a week into its
  days, a month into its weeks, a year into its months). Chips narrow it to one
  category. Periods and sub-periods with no XP are simply not drawn — the app never
  renders an absence.
- **Achievements** — only what has already unlocked. Locked ones are never shown,
  because they are not targets.

## Achievements

| Achievement    | Unlocks when                                        |
| -------------- | --------------------------------------------------- |
| First Step     | you earn XP for the first time                      |
| Back to Coding | you earn your first Coding XP                       |
| Coding 10      | Coding reaches 10 XP                                |
| Storyteller    | Behavioral reaches 5 XP                             |
| Architect      | System Design reaches 5 XP                          |
| Explorer       | all four categories have at least 1 XP              |
| Welcome Back   | you log XP again after a pause of 7 days or more    |

**Welcome Back** is the point of the whole app: a gap is not a broken streak, it's a
return worth celebrating.

## Layout

```
App.tsx                      bottom tabs, providers, unlock modal host
src/
  types.ts                   Category, XPEntry, XPStats, Achievement
  categories.ts              the four categories and their accents
  xp.ts                      XP totals + day grouping, derived from the log
  achievements.ts            achievement definitions and unlock checks
  storage.ts                 AsyncStorage read/write with validation
  store.tsx                  React context: load, add XP, track unlocks
  theme.ts                   light/dark palettes
  themeStore.tsx             resolves System/Light/Dark into one theme
  soundStore.tsx             preloaded players for the tap and unlock sounds
  components/                Screen, CategoryCard, HomeSettings, unlock modal
  screens/                   Home, History, Achievements
assets/sounds/               generated WAVs (see below)
scripts/generate-sounds.mjs  synthesises those WAVs
```

The sound effects are synthesised, not sampled, so the repo carries no
third-party audio. To retune them, edit the note table in
`scripts/generate-sounds.mjs` and re-run it:

```bash
node scripts/generate-sounds.mjs
```

Two things are stored: the XP entry log and the list of unlocked achievements.
Cumulative XP is never stored — it is always recomputed from the log, so there is
only one source of truth.

```ts
type XPEntry = {
  id: string;
  category: 'applications' | 'coding' | 'behavioral' | 'system-design';
  xp: number;
  createdAt: string; // ISO-8601
};
```

## Checks

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # eslint via expo lint
```

## Deliberately absent

Daily or weekly goals, quotas, deadlines, todos, streaks, "you missed a day"
messages, reminders, notifications, rankings, comparison with anyone else, login,
sharing, cloud sync.

This app does not record what you didn't do.
