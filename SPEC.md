# MTG Life Counter

A phone-first life counter for Magic the Gathering, laid flat on a table.
Stack is Vite, React, TypeScript. Hosted on GitHub Pages at /mtg-life-counter/.

## Setup screen
- Choose player count (1, 2, 3, or 4). 1 is for a player whose opponents
  track their own life elsewhere. Each count button shows one dot per seat
  in that seat's colour.
- Choose starting life. Default 20 for every player count.
  Presets 20, 25, 30, 40, plus a custom number input.
- Start button.

## Game screen layouts (portrait, full viewport, no scrolling)
- 1 player. One full-screen panel, unrotated. The menu button sits at the
  top edge instead of the centre.
- 2 players. Top and bottom halves. Top is rotated 180°.
- 3 players. Three equal horizontal strips. Top rotated 180°,
  middle rotated 90° (for a player at the side of the table),
  bottom unrotated.
- 4 players. Quadrants. The top two are rotated 180°, the bottom two unrotated.

## Players
- Colours are light tints of the mana colours in Magic's WUBRG order,
  skipping black: cream (white), blue, red, green. Each added player adds
  the next colour.
- The phone's owner always gets cream. Their seat is the bottom panel
  (bottom-left with 4 players); the other seats take the rest in order.
- Life total in large dark-brown text (Alegreya Sans ExtraBold), centered
  in each panel.

## Look
- One warm theme for every screen, based on a white card's frame:
  parchment backgrounds, dark-brown text, and gold for the Start button,
  the selected option and the menu button.
- The setup screen shows a row of the five mana pips above a Cinzel title.
- On the game screen, panels have rounded corners inside a dark-brown
  border, like Magic cards.
- Fonts are bundled with the app so they work offline. Cinzel stands in for
  Beleren, Magic's card-name font, which isn't free to use.

## Input
- Each panel is split in two tap zones relative to that player's
  orientation. Left is -1, right is +1. Show faint - and + hints.
- Press and hold changes life by 5 and repeats while held.
- Show a running delta (for example "-7") near the life total that
  accumulates across quick taps and fades about 2 seconds after the last one.
- Life can go below 0.

## Menu
- A small gold button in the center of the screen opens a parchment menu
  with Reset (same players and starting life) and New Game (back to setup).
- Both require confirmation.

## Behavior
- Keep the screen awake during a game, but only while the app is in use:
  the page is visible, its window has focus, and it has been touched (or a
  key pressed) in the last 5 minutes. Release the lock as soon as any of
  these stops being true, so the device's own sleep settings apply (for
  example when another tab or window is in front, even if the app's window
  is still partly on screen, or when a game is left untouched). Re-acquire
  it on return or on the next touch. Use the Screen Wake Lock API, falling
  back to NoSleep.js where it is unavailable or refused.
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