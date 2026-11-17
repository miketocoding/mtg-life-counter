# MTG Life Counter

A phone-first life counter for Magic the Gathering, laid flat on a table.
Stack is Vite, React, TypeScript. Hosted on GitHub Pages at /mtg-life-counter/.

## Setup screen
- Choose player count (2, 3, or 4).
- Choose starting life. Default 20 for every player count.
  Presets 20, 25, 30, 40, plus a custom number input.
- Start button.

## Game screen layouts (portrait, full viewport, no scrolling)
- 2 players. Top and bottom halves. Top is rotated 180°.
- 3 players. Three equal horizontal strips. Top rotated 180°,
  middle rotated 90° (for a player at the side of the table),
  bottom unrotated.
- 4 players. Quadrants. The top two are rotated 180°, the bottom two unrotated.

## Players
- Colors in order are red, blue, yellow, green.
- Use light shades so black text is clearly readable on all four.
- Life total in large black text, centered in each panel.

## Input
- Each panel is split in two tap zones relative to that player's
  orientation. Left is -1, right is +1. Show faint - and + hints.
- Press and hold changes life by 5 and repeats while held.
- Show a running delta (for example "-7") near the life total that
  accumulates across quick taps and fades about 2 seconds after the last one.
- Life can go below 0.

## Menu
- A small button in the center of the screen opens a menu with
  Reset (same players and starting life) and New Game (back to setup).
- Both require confirmation.

## Behavior
- Keep the screen awake with the Screen Wake Lock API. Re-acquire the lock
  on visibilitychange. Fall back to NoSleep.js where the API is
  unavailable or refused.
- Persist game state and settings in localStorage. Restore on load.
- Disable double-tap zoom, pinch zoom, pull-to-refresh, text selection,
  and the long-press context menu.
- Installable PWA that works offline (vite-plugin-pwa), display "fullscreen",
  with an app icon.

## Code
- Game state in a useReducer with typed actions.
- Size text and spacing with viewport-relative units so tablets work
  without a separate layout.
- Vitest unit tests for the reducer.
- Set Vite `base` to '/mtg-life-counter/'.
- Add a GitHub Actions workflow that builds and deploys to GitHub Pages
  on push to main.

## Not in v1
Poison counters, first player picker, undo/history, eliminated state,
5 to 6 players, commander damage.