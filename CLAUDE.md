# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Khaowannee** is a cryptocurrency portfolio management application built with React 19, Vite, and Tailwind CSS 4. The app allows users to register, login, and manage their crypto portfolios with a modern UI using shadcn/ui components.

## Development Commands
```bash
# Start development server (default: http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Architecture Overview

### Routing & Authentication Flow
- **Router**: React Router v7 with browser routing
- **Auth Flow**: Login → Register → Portfolio Dashboard
- **Protected Routes**: All portfolio/news pages require authentication
- **Auth State**: Managed via React Context (`src/contexts/AuthContext.jsx`)
- **Persistence**: User data stored in localStorage (excludes passwords)

### API Integration
- **Backend**: n8n workflow at `https://n8n.rerankmeister.com`
- **Proxy**: Vite dev server proxies `/api/*` requests to backend
- **Auth Service**: `src/services/authService.js` handles login/register API calls
- **Login Endpoint**: `/api/webhook/c7b56cff-ff4f-45ee-b9a9-5c41a92fbc98`
- **Register Endpoint**: `https://localhost:5001/api/register` (Note: hardcoded localhost)

### Component Architecture

#### Layout Structure
1. **MainLayout** (`src/components/layout/MainLayout.jsx`)
    - Main application shell with sidebar
    - Responsive mobile/desktop views
    - Handles navigation between portfolios/news

2. **Sidebar** (`src/components/layout/Sidebar.jsx`)
    - Navigation menu (Portfolios, News, Logout)
    - Mobile overlay + slide-out drawer
    - Desktop persistent sidebar

#### UI Component System
- **Framework**: shadcn/ui (New York style variant)
- **Base Color**: Stone
- **Path Alias**: `@/` → `./src/`
- **Location**: `src/components/ui/`
- **Styling Utility**: `cn()` function in `src/lib/utils.js` (combines clsx + tailwind-merge)
- **Available Components**: button, input, label, card, dialog, textarea, select, tabs, table, alert

#### Feature Components

**Portfolio Components** (`src/components/portfolio/`)
- `PortfolioList.jsx` - Displays grid of portfolio cards
- `PortfolioCard.jsx` - Individual crypto portfolio card
- `CreatePortfolioCard.jsx` - Add new portfolio card
- `AddPortfolioModal.jsx` - Modal for adding portfolios
- `CreatePortfolioModal.jsx` - Alternative creation modal

**Auth Components** (`src/components/auth/`)
- `LoginForm.jsx` - User login form
- `RegisterForm.jsx` - User registration form
- `AuthLayout.jsx` - Wrapper for auth pages
- `validation.js` - Form validation logic

**Shared Components** (`src/components/share/`)
- `ToastNotification.jsx` + `toast.js` - Toast notification system using react-hot-toast
- `InputField.jsx` - Reusable form input
- `DayNightBackground.jsx` - Animated gradient background
- `constants.js` - Shared constants (e.g., GRADIENT_BG)

### State Management
- **No Redux/Zustand**: Uses React Context + useState
- **Auth Context**: Global user state, login/logout functions
- **Local State**: Component-level state for portfolios, forms, modals
- **Data Fetching**: Native fetch API (no React Query/SWR)

### Styling System
- **Tailwind CSS 4**: Using new Vite plugin (`@tailwindcss/vite`)
- **Config Location**: `src/tailwind.config.js`
- **CSS Variables**: Enabled for shadcn/ui theming
- **Custom Animations**: tw-animate-css package installed
- **Design Tokens**: Stone color palette, amber accents for portfolios

## Important Implementation Notes

### Path Aliases
- `@/` is aliased to `./src/` in `vite.config.js`
- Always use `@/` imports for cleaner code: `import { Button } from '@/components/ui/button'`

### API Proxy Configuration
The Vite dev server is configured to:
- Proxy `/api` requests to `https://n8n.rerankmeister.com`
- Strip `/api` prefix before forwarding
- Allow ngrok and localhost hosts

### Authentication Context
The `AuthContext` provides:
- `user` - Current user object (without password)
- `isAuthenticated` - Boolean auth status
- `login(userData)` - Sets user and persists to localStorage
- `logout()` - Clears user state and localStorage

Import: `import { useAuth } from '@/contexts/AuthContext'`

### Toast Notifications
Use the centralized toast system:
```javascript
import { showToast } from '@/components/share/toast';
showToast.success('Success message');
showToast.error('Error message');
```

### Component File Naming
- Page components: PascalCase (e.g., `LoginPage.jsx`, `CryptoPortfolioDashboard.jsx`)
- UI components: lowercase filenames (e.g., `button.jsx`, `card.jsx`)
- Feature components: PascalCase (e.g., `PortfolioCard.jsx`, `AddPortfolioModal.jsx`)

## Known Issues & TODOs

1. **Register API Endpoint**: Currently points to `https://localhost:5001/api/register` which is hardcoded and likely incorrect (see `src/services/authService.js:12`)
2. **Logout in MainLayout**: TODO comment at `src/components/layout/MainLayout.jsx:17-19` to properly integrate AuthContext logout
3. **Commented Code**: `App.jsx` contains large section of commented-out legacy code (lines 1-67)
4. **Portfolio State**: Currently using mock data; needs backend integration for persistence
5. **News Page**: Basic page exists but implementation incomplete