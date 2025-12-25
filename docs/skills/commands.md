# Commands

CLI commands for developing The CRNA Club React frontend.

---

## Development

### Start Dev Server
```bash
npm run dev
```
Starts Vite dev server at `http://localhost:5173`

### Build for Production
```bash
npm run build
```
Creates optimized build in `/dist`

### Preview Production Build
```bash
npm run preview
```
Serves the production build locally for testing

### Lint Code
```bash
npm run lint
```
Runs ESLint on all source files

### Format Code
```bash
npm run format
```
Runs Prettier to format all files

---

## Dependencies

### Install All Dependencies
```bash
npm install
```

### Add New Dependency
```bash
npm install <package-name>
```

### Add Dev Dependency
```bash
npm install -D <package-name>
```

### Update Dependencies
```bash
npm update
```

---

## shadcn/ui Components

### Add a Component
```bash
npx shadcn-ui@latest add <component-name>
```

### Available Components
```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add select
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add tooltip
npx shadcn-ui@latest add progress
npx shadcn-ui@latest add skeleton
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add sheet
npx shadcn-ui@latest add toast
```

### Add All Common Components at Once
```bash
npx shadcn-ui@latest add button card input label textarea select checkbox badge tabs dialog tooltip progress skeleton avatar dropdown-menu
```

---

## Git

### Check Status
```bash
git status
```

### Stage All Changes
```bash
git add .
```

### Commit with Message
```bash
git commit -m "feat(component): description"
```

### Push to Remote
```bash
git push origin main
```

### Pull Latest
```bash
git pull origin main
```

### Create Feature Branch
```bash
git checkout -b feature/feature-name
```

---

## Vercel Deployment

### Deploy to Vercel (CLI)
```bash
npx vercel
```

### Deploy to Production
```bash
npx vercel --prod
```

### Link Existing Project
```bash
npx vercel link
```

---

## Project Setup (Initial)

### Create New Vite React Project
```bash
npm create vite@latest crna-club-rebuild -- --template react
cd crna-club-rebuild
npm install
```

### Install Tailwind CSS
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Install shadcn/ui
```bash
npx shadcn-ui@latest init
```
When prompted:
- Style: Default
- Base color: Slate
- CSS variables: Yes

### Install React Router
```bash
npm install react-router-dom
```

### Install Lucide Icons
```bash
npm install lucide-react
```

### Install Additional Utilities
```bash
npm install clsx tailwind-merge
npm install date-fns
```

---

## Full Initial Setup Script

Run these commands in order for a fresh project setup:

```bash
# Create project
npm create vite@latest crna-club-rebuild -- --template react
cd crna-club-rebuild

# Install dependencies
npm install

# Install Tailwind
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Install core packages
npm install react-router-dom lucide-react clsx tailwind-merge date-fns

# Initialize shadcn/ui
npx shadcn-ui@latest init

# Add common shadcn components
npx shadcn-ui@latest add button card input label textarea select checkbox badge tabs dialog tooltip progress skeleton avatar dropdown-menu sheet

# Start dev server
npm run dev
```

---

## Useful Aliases

Add to your shell profile (`.zshrc` or `.bashrc`):

```bash
alias dev="npm run dev"
alias build="npm run build"
alias preview="npm run preview"
alias lint="npm run lint"
```

---

## Environment Variables

### Create .env File
```bash
cp .env.example .env
```

### Required Variables
```env
# API Base URL (WordPress)
VITE_API_URL=https://thecrnaclub.com/wp-json

# Supabase (future)
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# Feature Flags
VITE_ENABLE_MARKETPLACE=false
VITE_ENABLE_SRNA_FEATURES=false
```

### Accessing in Code
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

---

## Troubleshooting

### Clear Node Modules and Reinstall
```bash
rm -rf node_modules package-lock.json
npm install
```

### Clear Vite Cache
```bash
rm -rf node_modules/.vite
npm run dev
```

### Port Already in Use
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
npm run dev
```

### Tailwind Not Working
1. Check `tailwind.config.js` has correct content paths
2. Check `globals.css` has Tailwind directives
3. Restart dev server

### shadcn Component Not Found
```bash
# Reinstall the component
npx shadcn-ui@latest add <component-name> --overwrite
```
