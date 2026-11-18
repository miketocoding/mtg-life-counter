# MTG Life Counter

A phone-first life counter for Magic: The Gathering, meant to lie flat on the
table. Supports 1 to 4 players, each panel rotated to face its player. The
1-player mode lets you track your own life when your opponents use their
own counters.
See [SPEC.md](SPEC.md) for the full behaviour.

- Tap the left half of your panel for -1, the right half for +1.
- Press and hold to change by 5, repeating while held.
- The phone's owner always gets the cream panel at the bottom.
- During a game the screen stays awake while the app is in front. After 5
  minutes untouched, or when another window or tab is in front, your
  device's normal sleep settings apply; the next touch keeps it awake again.
  Turn this off with "Keep screen awake" in the menu.
- The gold button in the centre of the screen (at the top with 1 player)
  opens the menu (Reset, New Game, the keep-awake switch and, with 3
  players, which edge the side player sits at).

## Development

```sh
npm install
npm run dev      # http://localhost:5173/mtg-life-counter/
npm test         # reducer and storage unit tests (Vitest)
npm run lint
npm run build    # type-check and build to dist/
```

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`, which lints, tests,
builds and deploys to GitHub Pages at `/mtg-life-counter/`. In the repository
settings, Pages must have its source set to "GitHub Actions".
