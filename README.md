# DevMatch - Memory Challenge

![DevMatch Preview](./public/preview.png)

A developer-themed memory card game built with modern web technologies. Match pairs of tech stack cards, build combos, and compete on the global leaderboard!

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL with Prisma ORM
- **Animations:** 
  - Framer Motion (React animations)
  - GSAP (Advanced animations & effects)
  - Three.js / React Three Fiber (3D background)
- **Sound:** Web Audio API

## Features

### Core Gameplay
- **Memory Card Matching:** Flip cards to find matching pairs of technology icons
- **Two Difficulty Levels:**
  - Easy: 4x4 grid (8 pairs, 16 cards)
  - Hard: 8x4 grid (16 pairs, 32 cards)

### Game Modes
- **Normal Mode:** No time limit, +2 second penalty per error
- **Time Attack Mode:** 60 seconds to complete - beat the clock!

### Scoring System
- +100 points per matched pair
- -10 points per error
- **Combo Multiplier:** Consecutive matches increase your multiplier up to x5!
- Score displayed in real-time with animated feedback

### Power-Ups & Special Features
- **Reveal Power-Up:** Every 3 consecutive matches unlocks a power-up that reveals a random pair for 1 second
- **Shuffle:** One-time use per game to rearrange remaining unmatched cards
- **Sound Effects:** Satisfying audio feedback for all actions (can be toggled)

### Visual Effects
- **3D Background:** Animated particle field and wireframe grid using Three.js
- **Reactive Environment:** Background responds to game events (matches, errors, combos)
- **Card Animations:** 3D flip animations, sparkle effects on match, shake on error
- **Confetti Celebration:** Victory screen with confetti animation

### Persistence & Leaderboard
- **PostgreSQL Database:** All games are saved with full statistics
- **Leaderboard:** View top 10 players sorted by:
  - Best Time
  - Highest Score  
  - Longest Streak
- **Personal Stats:** Track your attempts, time, score, and best streak

### Tutorial
- Interactive tutorial on first visit
- Explains all game mechanics and features
- Can be skipped and won't show again

## Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- pnpm (recommended) or npm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/devmatch.git
   cd devmatch
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/devmatch"
   ```

4. **Set up the database:**
   ```bash
   npx prisma db push
   ```

5. **Run the development server:**
   ```bash
   pnpm dev
   ```

6. **Open in browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Schema

```prisma
model Game {
  id          Int      @id @default(autoincrement())
  playerName  String   @default("Anonymous")
  timeSeconds Int
  attempts    Int
  score       Int      @default(0)
  maxStreak   Int      @default(0)
  difficulty  String   @default("easy")
  mode        String   @default("normal")
  won         Boolean  @default(true)
  createdAt   DateTime @default(now())
}
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/games` | Get leaderboard (supports `limit`, `sortBy`, `difficulty`, `mode` params) |
| POST | `/api/games` | Save a completed game |
| GET | `/api/games/stats` | Get aggregate statistics |

## Project Structure

```
├── app/
│   ├── api/games/          # API routes
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main page
│   └── globals.css         # Global styles
├── components/
│   └── game/               # Game components
│       ├── memory-game.tsx # Main game component
│       ├── game-board.tsx  # Card grid
│       ├── game-card.tsx   # Individual card
│       ├── game-stats.tsx  # Score/timer display
│       ├── game-settings.tsx # Difficulty/mode selector
│       ├── background-3d.tsx # Three.js background
│       ├── victory-modal.tsx # Win screen
│       ├── game-over-modal.tsx # Time attack loss screen
│       ├── leaderboard-modal.tsx # Leaderboard
│       └── tutorial-overlay.tsx # First-time tutorial
├── hooks/
│   ├── use-game-logic.ts   # Core game state management
│   └── use-sound.ts        # Audio effects
├── interfaces/
│   └── index.ts            # TypeScript interfaces
├── lib/
│   ├── prisma.ts           # Prisma client
│   ├── game-data.ts        # Technology data & config
│   └── game-utils.ts       # Utility functions
├── prisma/
│   └── schema.prisma       # Database schema
└── public/
    └── technologies/       # SVG icons for cards
```

## Technologies Featured in Cards

Easy Mode (8 pairs): React, Next.js, TypeScript, Tailwind CSS, Node.js, Prisma, PostgreSQL, Git

Hard Mode (16 pairs): All of the above plus JavaScript, GraphQL, Docker, GitHub, Vue.js, Angular, MongoDB, Python

## License

MIT License - feel free to use this project for learning or as a starting point for your own games!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
