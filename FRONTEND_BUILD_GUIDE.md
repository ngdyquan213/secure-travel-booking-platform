# TravelHub Frontend - Build Guide

## Overview

This is a complete React + TypeScript frontend for the secure travel booking platform, built with Vite and modern UI components.

## Features

✈️ **Flight Search & Booking** - Search, compare, and book flights  
🏨 **Hotel Reservations** - Find and book accommodations  
🗺️ **Tour Packages** - Discover and book curated tours  
👤 **User Dashboard** - Manage bookings and profile  
🛡️ **Secure Authentication** - Register, login, and JWT token management  
💳 **Payment Integration** - Secure payment processing  
🔐 **Admin Dashboard** - Comprehensive platform analytics  

## Technology Stack

- **React 19.2** - UI framework
- **TypeScript** - Type safety
- **Vite 8** - Fast build tool
- **React Router v7** - Client-side routing
- **Zustand** - State management
- **Axios** - HTTP client
- **Tailwind CSS** - Styling (via globals.css)
- **Lucide React** - Icons
- **React Hot Toast** - Notifications
- **Date-fns** - Date utilities

## Setup Instructions

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Environment Configuration

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Update the API URL if your backend is running on a different URL:

```
VITE_API_URL=http://localhost:8000/api/v1
```

### 3. Development Server

Start the development server:

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

Output will be in the `dist` directory.

### 5. Preview Production Build

```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Navbar.tsx
│   │   └── ProtectedRoute.tsx
│   ├── pages/               # Page components
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── FlightsSearch.tsx
│   │   ├── HotelsSearch.tsx
│   │   ├── ToursSearch.tsx
│   │   ├── Dashboard.tsx
│   │   ├── BookingDetail.tsx
│   │   └── AdminDashboard.tsx
│   ├── store/               # Zustand stores
│   │   ├── authStore.ts
│   │   └── bookingStore.ts
│   ├── lib/                 # Utilities
│   │   └── api.ts           # API client with axios
│   ├── App.tsx              # Main app with routing
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── package.json
├── vite.config.ts
├── tsconfig.json
└── .env.example
```

## API Integration

The frontend communicates with the backend API using Axios. The API client is configured in `src/lib/api.ts`.

### Available Endpoints

#### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - Logout
- `POST /auth/refresh` - Refresh access token
- `GET /users/me` - Get current user

#### Flights
- `GET /flights` - Search flights
- `GET /flights/{id}` - Get flight details

#### Hotels
- `GET /hotels` - Search hotels
- `GET /hotels/{id}` - Get hotel details
- `GET /hotels/{id}/rooms` - Get available rooms

#### Tours
- `GET /tours` - Search tours
- `GET /tours/{id}` - Get tour details

#### Bookings
- `POST /bookings` - Create booking
- `GET /bookings` - Get user bookings
- `GET /bookings/{id}` - Get booking details
- `POST /bookings/{id}/cancel` - Cancel booking

#### Admin
- `GET /admin/dashboard` - Dashboard statistics
- `GET /admin/bookings` - All bookings
- `GET /admin/users` - All users

## State Management

### Authentication Store (`useAuthStore`)

```typescript
const { user, isAuthenticated, login, register, logout } = useAuthStore();
```

### Booking Store (`useBookingStore`)

```typescript
const { searchParams, selectedItems, setSearchParams } = useBookingStore();
```

## Authentication Flow

1. User registers or logs in
2. Backend returns access token and refresh token
3. Tokens stored in localStorage
4. Axios interceptor adds token to API requests
5. On 401 response, user redirected to login

## Styling

The application uses a custom CSS design system defined in `src/index.css`:

- **Color Variables**: Primary colors, neutrals, status colors
- **CSS Grid & Flexbox**: For responsive layouts
- **Tailwind-inspired Utilities**: Via custom CSS classes

## Component Examples

### Button Component

```typescript
<Button variant="primary" size="lg" onClick={handleClick}>
  Click Me
</Button>
```

Available variants: `primary`, `secondary`, `outline`, `ghost`  
Available sizes: `sm`, `md`, `lg`

### Input Component

```typescript
<Input
  label="Email"
  type="email"
  placeholder="your@email.com"
  icon={<Mail size={20} />}
  error={errors.email}
/>
```

### Protected Route

```typescript
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

## Error Handling

Errors are handled at multiple levels:

1. **API Level**: Axios interceptors handle 401/403 errors
2. **Component Level**: Try-catch blocks with user feedback
3. **User Feedback**: React Hot Toast notifications

## Performance Optimizations

- Code splitting with React Router lazy loading
- Memoized components where necessary
- Optimized re-renders with Zustand stores
- CSS custom properties for efficient theming

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)

## Troubleshooting

### API Connection Issues

1. Verify backend is running on configured URL
2. Check CORS configuration on backend
3. Verify API_URL in `.env` file

### Token Expiration

The app automatically handles token refresh. If issues persist:
1. Clear localStorage
2. Log out and log back in
3. Check backend refresh token endpoint

### Build Issues

```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clean build
npm run build
```

## Development Guidelines

### Adding a New Page

1. Create component in `src/pages/PageName.tsx`
2. Add route to `App.tsx`
3. Add navigation link to `Navbar.tsx`

### Adding a New API Endpoint

1. Add method to `src/lib/api.ts`
2. Create corresponding store action in `src/store/`
3. Use in component with error handling

### Styling New Components

Use CSS custom variables from `src/index.css`:

```css
color: var(--primary);
background-color: var(--gray-50);
padding: var(--spacing-md);
box-shadow: var(--shadow-lg);
```

## Deployment

### Vercel (Recommended)

```bash
# Connect GitHub repo and select frontend directory
vercel --prod
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

### Static Hosting

The `dist` directory contains production-ready static files that can be deployed to any static host (Netlify, GitHub Pages, AWS S3, etc.).

## Contributing

1. Create a feature branch
2. Make changes following the existing code style
3. Test thoroughly
4. Submit pull request

## Support

For issues or questions:
1. Check existing GitHub issues
2. Review API documentation at backend/README.md
3. Contact: support@travelhub.com

## License

MIT License - See LICENSE file for details
