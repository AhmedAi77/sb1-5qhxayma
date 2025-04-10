# Solo Leveling Training App

A gamified fitness tracking application inspired by the "Solo Leveling" manhwa/anime.

## Project Structure

The project is organized in a modular, maintainable structure:

```
src/
├── components/       # UI components
│   ├── index.ts      # Component exports
│   └── ...
├── contexts/         # React contexts for state management
│   ├── AuthContext.tsx  
│   └── LanguageContext.tsx
├── data/             # Static data
│   ├── exercises.ts  # Exercise definitions
│   ├── quotes.ts     # Motivational quotes
│   └── achievements.ts
├── lib/              # Utilities and services
│   ├── index.ts      # API exports
│   ├── audio.ts      # Sound effect utilities
│   ├── storage.ts    # Local storage management
│   ├── missionUtils.ts # Mission-related utilities
│   └── userUtils.ts  # User-related utilities
├── types/            # TypeScript type definitions
├── App.tsx           # Main application component
└── main.tsx          # Application entry point
```

## Key Features

- **Progress Tracking**: Track exercise progress and level up as you complete training missions
- **Gamified Experience**: Gain XP, level up, and increase your stats
- **Favorite Exercises**: Save and manage your favorite exercises
- **Multilingual Support**: Available in English and Arabic
- **Custom Sound Effects**: Immersive audio feedback

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run development server: `npm run dev`