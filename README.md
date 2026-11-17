# MTG Life Counter

A phone-first life counter for Magic: The Gathering, meant to lie flat on the
table. Supports 2, 3 or 4 players, each panel rotated to face its player.
See [SPEC.md](SPEC.md) for the full behaviour.

- Tap the left half of your panel for -1, the right half for +1.
- Press and hold to change by 5, repeating while held.
- The button in the centre of the screen opens the menu (Reset, New Game and,
  with 3 players, which edge the side player sits at).

## Development

```sh
npm install
npm run dev      # http://localhost:5173/mtg-life-counter/
npm test         # reducer unit tests (Vitest)
npm run lint
npm run build    # type-check and build to dist/
```

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`, which lints, tests,
builds and deploys to GitHub Pages at `/mtg-life-counter/`. In the repository
settings, Pages must have its source set to "GitHub Actions".
