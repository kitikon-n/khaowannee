# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Khaowannee** is a cryptocurrency portfolio management application built with React 19, Vite, and Tailwind CSS 4. The app features JWT-based authentication, real-time WebSocket news feeds, and comprehensive portfolio tracking with shadcn/ui components. All dates use Thai format (dd/mm/yyyy) and UI text is in Thai language.

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

### Backend & API Integration
- **Backend**: FastAPI REST API at `http://localhost:8000`
- **HTTP Client**: Axios with interceptors for automatic token management
- **WebSocket**: Real-time news at `ws://localhost:8081`
- **Proxy**: Vite dev server proxies `/api/*` requests to `http://localhost:8000` with path rewrite
- **Authentication**: JWT tokens (`access_token`, `refresh_token`) stored in localStorage
- **Axios Interceptors**:
  - Request: Auto-attaches `Authorization: Bearer {token}` header
  - Response: Auto-redirects to `/login` on 401 errors (except login endpoint)

### API Endpoints

**Authentication**:
- `POST /user/register` - User registration
- `POST /user/login` - User login (returns access_token, refresh_token)
- `GET /user/me` - Get current user info

**Portfolios**:
- `GET /portfolios` - List all user portfolios
- `POST /portfolios` - Create new portfolio
- `GET /portfolios/{id}` - Get single portfolio
- `PUT /portfolios/{id}` - Update portfolio
- `DELETE /portfolios/{id}` - Delete portfolio
- `GET /portfolios/{id}/detail` - Get detailed portfolio with holdings and transactions

**Cryptocurrencies**:
- `GET /cryptocurrencies/` - Get cryptocurrencies filtered by asset_type (01=Forex, 02=Crypto, 03=Thai stock)
- `GET /cryptocurrencies/{id}/price` - Get current price for cryptocurrency

**Transactions**:
- `POST /transactions/` - Create new transaction

### Routing Structure
- `/` - Redirects to `/portfolios`
- `/login` - LoginPage (public)
- `/register` - RegisterPage (public)
- `/portfolios` - CryptoPortfolioDashboard (protected)
- `/portfolios/:id` - PortfolioDetailPage (protected)
- `/news` - NewsPage with real-time WebSocket feed (protected)

**Protected Routes**: All portfolio and news pages require authentication via ProtectedRoute component. Shows loading spinner during auth check, redirects to `/login` if not authenticated.

### State Management
**React Context - No Redux/Zustand**

**AuthContext** (`src/contexts/AuthContext.jsx`):
- Provides: `user`, `isAuthenticated`, `loading`, `login()`, `register()`, `logout()`, `checkAuth()`
- Handles: JWT token management, user data persistence in localStorage
- Auto-fetches user data from `/user/me` on app start if token exists
- Import: `import { useAuth } from '@/contexts/AuthContext'`

**ThemeContext** (`src/contexts/ThemeContext.jsx`):
- Provides: `theme`, `toggleTheme()`, `isDark`
- Handles: Dark/light mode with system preference detection
- Persists theme preference to localStorage
- Import: `import { useTheme } from '@/contexts/ThemeContext'`

### Component Architecture

**Pages** (`src/pages/`):
- `LoginPage.jsx` - Login with validation (min 6 char password)
- `RegisterPage.jsx` - User registration
- `CryptoPortfolioDashboard.jsx` - Main portfolios grid
- `PortfolioDetailPage.jsx` - Detail view with tabs (Overview, Holdings, Transactions, Analysis)
- `NewsPage.jsx` - Real-time crypto news with WebSocket
- `NewsCard.jsx` - Individual news card

**Portfolio Components** (`src/components/portfolio/`):
- `PortfolioList.jsx` - Portfolio grid with create card
- `PortfolioCard.jsx` - Individual portfolio with stats
- `AddPortfolioModal.jsx` - Create portfolio (name, asset type, description)
- `EditPortfolioModal.jsx` - Edit portfolio (asset field disabled)
- `AddTransactionModal.jsx` - Add transaction with auto-price fetch
- `HoldingsTable.jsx` - Shows holdings (Symbol, Qty, Avg price, Invested, Unrealized gain)
- `TransactionsTable.jsx` - Shows transactions with edit/delete actions
- `validation.js` - Form validation utilities

**Auth Components** (`src/components/auth/`):
- `ProtectedRoute.jsx` - Route guard for authenticated pages
- `LoginForm.jsx`, `RegisterForm.jsx` - Auth forms
- `AuthLayout.jsx` - Wrapper for auth pages

**Layout Components** (`src/components/layout/`):
- `MainLayout.jsx` - Main app shell with sidebar and logout dialog
- `Sidebar.jsx` - Navigation with mobile drawer
- `ThemeToggle.jsx` - Dark/light mode switcher

**Shared Components** (`src/components/share/`):
- `ToastNotification.jsx` + `toast.js` - Toast system using react-hot-toast
- `NewsToast.jsx` - Custom toast for news notifications
- `DayNightBackground.jsx` - Animated gradient background

**UI Components** (`src/components/ui/`):
- shadcn/ui components: button, input, label, card, dialog, textarea, select, tabs, table, alert, badge
- `date-input.jsx` - Custom component for Thai dd/mm/yyyy format

## Key Technical Patterns

### Service Layer Pattern
All API calls centralized in `src/services/`:

**authService.js** & **portfolioService.js**:
- Shared axios instance with `baseURL: 'http://localhost:8000'`
- Request interceptor: Auto-attach `Authorization: Bearer {token}` from localStorage
- Response interceptor: Handle 401 errors with auto-redirect to `/login` (except login endpoint)
- All methods return `{ success: true, data: ... }` or throw errors with Thai messages

### JWT Authentication Flow
1. User logs in → API returns `access_token` and `refresh_token`
2. Tokens stored in localStorage along with user object
3. Axios interceptor automatically adds `Bearer {access_token}` to all requests
4. On 401 error: Clear tokens and redirect to login
5. ProtectedRoute checks auth before rendering pages

### Date Handling (Thai Format)
**Date Utils** (`src/lib/dateUtils.js`):
- `formatDate(date)` - Convert to dd/mm/yyyy display
- `toInputDateFormat(date)` - Convert to yyyy-mm-dd for inputs
- `getTodayInputFormat()` - Today in yyyy-mm-dd
- `formatRelativeDate(date)` - "Today", "Yesterday", or dd/mm/yyyy

**Custom DateInput Component** (`src/components/ui/date-input.jsx`):
- Accepts and displays dd/mm/yyyy format
- Auto-formats with slashes as user types
- Validates date on blur
- Converts internally to ISO format (yyyy-mm-dd) for API

### Form Validation Pattern
**Validation System** (`src/components/portfolio/validation.js`):
- `validatePortfolioForm(formData)` - Returns errors object
- `validateTransactionForm(formData)` - Returns errors object
- Field-level validators: `portfolioValidation.portfolioName()`, `transactionValidation.price()`, etc.
- All messages in Thai
- Real-time error clearing on input change
- Validation on blur and before submit

### Modal Pattern
Consistent pattern across all modals:
1. Dialog state controlled by parent via `isOpen` prop
2. Form state managed internally with `useState`
3. Validation on submit and field-level (onBlur)
4. API call with loading state
5. Success: callback to parent → close modal → reset form
6. Error: show toast → keep modal open
7. Form reset on close with setTimeout for animation

### Table Pattern
**HoldingsTable** and **TransactionsTable**:
- Responsive: Desktop table + mobile cards
- Desktop: Full table with sortable columns
- Mobile: Card layout with key metrics
- Actions column with dropdown menu (edit/delete)
- Color-coded gains/losses (green/red)
- Empty states and loading states

### WebSocket Integration
**useWebSocket Hook** (`src/services/hooks/useWebSocket.js`):
- Auto-connect on mount to `ws://localhost:8081`
- Auto-reconnect with exponential backoff (max 3 attempts)
- Message queue management
- API: `isConnected`, `messages`, `lastMessage`, `error`, `subscribeToSymbols()`, `sendMessage()`

**NewsPage Usage**:
- Connects on mount
- Subscribes to default symbols ['BNB', 'PTT']
- Tracks seen news IDs to only show NEW items
- Displays custom toast for new news
- Scrollable feed with auto-scroll

### Toast Notification System
**Toast Utils** (`src/components/share/toast.js`):
- `showToast.success(message)` - Success notification
- `showToast.error(message)` - Error notification
- `showToast.loading(message)` - Loading (returns ID for dismiss)
- `showToast.promise(promise, { loading, success, error })` - Promise-based
- `showToast.news(newsObject, options)` - Special news toast with NewsToast component
- `showToast.multipleNews(newsArray, options)` - Staggered news toasts (300ms delay)
- All Thai language by default

## Important Implementation Notes

### Path Aliases
- `@/` is aliased to `./src/` in `vite.config.js`
- Always use `@/` imports: `import { Button } from '@/components/ui/button'`

### Tailwind CSS 4 Setup
- **Version**: Tailwind CSS 4 using `@tailwindcss/vite` plugin
- **Import**: `@import "tailwindcss"` in `index.css` (not classic config file)
- **Config**: `src/tailwind.config.js` (not root)
- **Dark Mode**: Class-based with `@custom-variant dark` syntax
- **Colors**: Stone palette (neutrals) + Amber accents (portfolios/actions)
- **Font**: Kodchasan from Google Fonts (Thai-friendly)
- **Utils**: `cn()` function in `src/lib/utils.js` (clsx + tailwind-merge)

### shadcn/ui Configuration
- **Style**: New York variant
- **Base Color**: Stone
- **Theme**: CSS variables with oklch color space
- **Available Components**: button, input, label, card, dialog, textarea, select, tabs, table, alert, badge, date-input (custom)
- **Import Pattern**: `import { Button } from '@/components/ui/button'`

### Component Naming Conventions
- **Pages**: PascalCase (LoginPage.jsx, PortfolioDetailPage.jsx)
- **UI Components**: lowercase (button.jsx, card.jsx, date-input.jsx)
- **Feature Components**: PascalCase (PortfolioCard.jsx, HoldingsTable.jsx)

### Portfolio Asset Types
- `01` - Forex
- `02` - Crypto
- `03` - Thai stock

Asset type cannot be changed after portfolio creation (field disabled in EditPortfolioModal).

### Transaction Data Flow
1. User opens AddTransactionModal
2. Select symbol → auto-fetch price from `/cryptocurrencies/{id}/price`
3. Fill quantity, commission, notes
4. Calculate total: `(price * quantity) ± commission` (+ for buy, - for sell)
5. Submit → POST `/transactions/` with portfolio_id, cryptocurrency_id, transaction_type, etc.
6. Reload parent portfolio detail to show updated holdings

### Holdings Calculations
- **Avg Price**: `total_invested / quantity`
- **Current Value**: `current_price * quantity`
- **Unrealized Gain**: `current_value - total_invested`
- **Unrealized Gain %**: `(unrealized_gain / total_invested) * 100`

Note: `total_invested` is NOT a field in portfolio creation—it's calculated from transactions on the backend.
