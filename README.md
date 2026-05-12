# CardScorer

CardScorer is a lightweight browser-based card game score tracker built with TypeScript. It helps players track and update scores during card games using a simple local build workflow.

## Features

- Track scores for players in a card game
- Build output in `build/` for static deployment
- Local development server support
- Linting and Jest-based testing included

## Game Rules

This tracker follows a defined round structure that reflects the game flow built into the app.

1. **Sets** — Enter the number of sets each player won. Each set is worth 2 points. The app calculates maximum points based on a 52-card deck and the number of players, and it will display wild cards if the deck does not divide evenly.
2. **Clubs** — Enter the number of clubs each player captured. Each club is worth 2 points, with a maximum of 13.
3. **Face** — Enter the number of face cards captured. Each face card is worth 5 points, with a maximum of 12.
4. **Ladies** — Enter the number of queens captured. Each queen is worth 10 points, with a maximum of 4.
5. **King of Clubs / Ace of Spades** — Enter how many of these special cards each player took. Each is worth 15 points, with a maximum of 2.
6. **Last** — Enter `1` if the player won the last trick, otherwise `0`. Winning the last trick is worth 20 points.
7. **# Pass** — Enter the number of pass cards or penalties. Each pass is worth 2 points, and a finish order bonus is applied based on the player’s final position.
8. **Solitaire** — Enter the player’s finish order. Values must be unique across players, and they are used to calculate additional finish-order scoring for round 7.

- After entering round values, click **Calculate Score** to refresh totals and see any warnings.
- The app validates point totals and will highlight missing or excessive points for rounds with fixed totals.
- Finish order values must be unique for all players to avoid invalid scoring.
- The winner is the player with the **lowest total score** at the end of the game.

> Note: The app is a score tracker for this specific round-based game flow; it does not enforce card dealing or gameplay mechanics directly.

## Getting Started

### Install dependencies

```bash
npm install
```

### Build the project

```bash
npm run build
```

### Start development server

```bash
npm run dev
```

### Run tests

```bash
npm test
```

### Run linting

```bash
npm run lint
```

## Project Structure

- `src/` — TypeScript source files and assets
- `build/` — Generated build output
- `package.json` — Project metadata and scripts
- `tsconfig.*.json` — TypeScript configurations
- `jest.config.js` — Jest test configuration

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
