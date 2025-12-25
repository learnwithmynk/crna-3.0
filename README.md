# The CRNA Club - React Frontend

A React-based frontend for The CRNA Club, a SaaS platform helping ICU nurses apply to CRNA school.

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS v4** - Utility-first styling
- **React Router v6** - Client-side routing
- **Lucide React** - Icons

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
├── docs/                    # Documentation
│   ├── skills/             # How-to guides (26 files)
│   ├── agents/             # AI assistant prompts (16 files)
│   └── project/            # Status, tasks, decisions
├── src/
│   ├── components/
│   │   ├── ui/             # Base components (Button, Card, etc.)
│   │   ├── layout/         # Layout components (Sidebar, Header)
│   │   └── features/       # Feature-specific components
│   ├── pages/              # Page components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities
│   └── data/               # Mock data
└── public/                 # Static assets
```

## Key Documentation

Start with **CLAUDE.md** - the master reference file containing:
- Project overview
- Tech stack
- Key decisions
- Workflow shortcuts

Then explore the `/docs/skills/` folder for detailed guides on:
- Design system
- Data shapes
- API contracts
- Page layouts
- And more...

## Development Workflow

1. Read relevant skill files before building
2. Use mock data with TODO comments
3. Build mobile-first (375px → larger)
4. Test touch targets (44px minimum)
5. Include loading, empty, and error states

## Environment Variables

Create `.env` file:

```env
VITE_API_URL=https://thecrnaclub.com/wp-json
```

## License

Private - The CRNA Club
