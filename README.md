# Mood Based Cocktail Buddy 🍸

A web app that suggests cocktails based on your mood and available ingredients, using OpenAI for mood analysis and CocktailDB for recipes.

## Features

- 🎭 Get cocktail suggestions based on your mood
- 🔍 Search through available ingredients
- ➕ Add custom ingredients
- 🍹 Find cocktail recipes matching your ingredients
- 🎮 Retro gaming-inspired design

## Setup

1. Install dependencies
```bash
npm install
```

2. Add your OpenAI API key to `.env`
```env
VITE_OPENAI_API_KEY=your_api_key_here
```

3. Run the app
```bash
npm run dev
```

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- CocktailDB API
- OpenAI API

## Project Structure

```
src/
├── components/       # UI components
├── lib/             # API integration
├── styles/          # Global styles
└── App.tsx          # Main component
```

## APIs Used

- CocktailDB: Free API for cocktail recipes
- OpenAI: For mood-based recommendations (requires API key)

## License

MIT
