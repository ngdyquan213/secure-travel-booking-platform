# TravelBook Frontend

Modern React + Vite frontend for the Secure Travel Booking Platform.

## Features

- **User Authentication**: Secure login and registration with password strength validation
- **Flight Search & Booking**: Browse and book flights with real-time availability
- **Hotel Search & Booking**: Search hotels with detailed amenities and ratings
- **Tour Packages**: Explore and book tour packages
- **Booking Management**: View booking history, details, and manage bookings
- **Payment Processing**: Secure payment initiation with idempotency support
- **Document Management**: Upload and manage travel documents (passport, visa, etc.)
- **Admin Dashboard**: View platform statistics and user management
- **Responsive Design**: Mobile-first design that works on all devices
- **Modern UI**: Clean, modern design with Tailwind CSS and Lucide icons

## Tech Stack

- **React 18**: UI library
- **Vite**: Build tool and dev server
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Zustand**: State management
- **React Router**: Client-side routing
- **Axios**: HTTP client with interceptors
- **React Hook Form**: Form validation
- **Zod**: Schema validation
- **Lucide React**: Icon library

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/secure-travel-booking-platform.git
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env.local
   ```

4. **Configure API URL**
   Edit `.env.local` and set your backend API URL:
   ```
   VITE_API_URL=http://localhost:8000
   ```

### Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── ProtectedRoute.tsx
│   ├── pages/               # Page components
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── FlightsPage.tsx
│   │   ├── HotelsPage.tsx
│   │   ├── ToursPage.tsx
│   │   ├── BookingDetailsPage.tsx
│   │   ├── PaymentPage.tsx
│   │   ├── DocumentUploadPage.tsx
│   │   ├── AdminDashboard.tsx
│   │   └── NotFoundPage.tsx
│   ├── services/            # API client
│   │   └── api.ts
│   ├── stores/              # Zustand stores
│   │   └── authStore.ts
│   ├── types/               # TypeScript types
│   │   └── api.ts
│   ├── utils/               # Utility functions
│   │   └── helpers.ts
│   ├── App.tsx              # Root component
│   ├── main.tsx             # Entry point
│   └── globals.css          # Global styles
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## API Integration

The frontend connects to the backend FastAPI server. The API client handles:

- **Authentication**: Login, registration, token refresh
- **Flight Operations**: Search and view flights
- **Hotel Operations**: Search and view hotels
- **Tour Operations**: Search and view tours
- **Bookings**: Create, view, and manage bookings
- **Payments**: Initiate payments with idempotency keys
- **Documents**: Upload and manage travel documents
- **Admin**: Platform statistics and user management

### API Client Features

- **Automatic Token Management**: Tokens are stored in localStorage and sent with requests
- **Token Refresh**: Automatically refreshes expired tokens
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Interceptors**: Request and response interceptors for global logic

### Authentication Flow

1. User submits login/registration form
2. API returns access token and user data
3. Token is stored in localStorage
4. Token is sent with all subsequent requests
5. On 401 response, token is refreshed automatically
6. On refresh failure, user is redirected to login

## State Management

### AuthStore (Zustand)

Manages global authentication state:

```typescript
- user: Current user object
- token: Access token
- isAuthenticated: Authentication status
- isLoading: Loading state for async operations
- error: Error messages
- login(): Login user
- register(): Register new user
- logout(): Logout user
- initializeAuth(): Initialize auth on app load
```

## Form Validation

Uses React Hook Form + Zod for validation:

- **Email**: Valid email format
- **Password**: 
  - At least 8 characters
  - Contains uppercase letter
  - Contains lowercase letter
  - Contains number
  - Contains special character (!@#$%^&*)

## Styling

### Design System

- **Colors**: Blue primary (#3b82f6), green accent (#22c55e), gray neutrals
- **Typography**: Inter font family (via Google Fonts)
- **Spacing**: Tailwind spacing scale (4px base unit)
- **Responsive**: Mobile-first, breakpoints at sm (640px), md (768px), lg (1024px)

### Tailwind Utilities

- Flexbox for layouts
- Responsive prefixes (md:, lg:)
- Custom color tokens
- Custom spacing utilities

## Features in Detail

### Authentication
- Secure login/register with validation
- Password strength indicator
- Error handling and user feedback
- Token persistence and refresh

### Search & Browse
- Real-time search with filters
- Pagination support
- Loading and error states
- Result display with pricing

### Bookings
- Create bookings from search results
- View booking details
- Track booking status
- Cancel bookings

### Payments
- Secure payment form
- Multiple payment methods
- Idempotency key generation
- Payment status tracking

### Documents
- Upload travel documents
- File validation (type and size)
- Document status tracking
- Delete documents

## API Configuration

The frontend expects the backend API to be running at `http://localhost:8000` by default. To change this, modify the `VITE_API_URL` environment variable.

### Required Backend Endpoints

See `src/services/api.ts` for the complete list of endpoints.

## Error Handling

- API errors display user-friendly messages
- Form validation provides specific feedback
- Network errors are caught and reported
- 401 responses trigger automatic token refresh

## Security Considerations

- Tokens are stored in localStorage (consider HttpOnly cookies for production)
- CORS proxy configured in vite.config.ts
- Input validation on all forms
- XSS protection via React's default escaping

## Performance Optimizations

- Code splitting via React Router
- Lazy loading of components
- Efficient state updates with Zustand
- Minimal re-renders with proper memoization

## Development Tips

1. **Hot Module Replacement (HMR)**: Changes are reflected instantly in development
2. **TypeScript**: Full type safety for better development experience
3. **Console Debugging**: Use browser DevTools for debugging
4. **Network Tab**: Monitor API calls in Network tab
5. **React DevTools**: Install React DevTools browser extension

## Deployment

### Build for Production

```bash
npm run build
```

This creates a `dist/` folder with optimized production build.

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Deploy to Other Platforms

The frontend can be deployed to any static hosting service:
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Firebase Hosting

## Troubleshooting

### API Connection Issues

1. **Check backend is running**: Ensure backend server is running on correct port
2. **Check CORS**: Backend should allow frontend origin
3. **Check API URL**: Verify `VITE_API_URL` in `.env.local`

### Authentication Issues

1. **Tokens not persisting**: Check localStorage in DevTools
2. **401 errors**: Token might be expired, try logging out and logging in again
3. **CORS errors**: Add frontend URL to backend CORS whitelist

### Build Issues

1. **Clear cache**: `rm -rf node_modules && npm install`
2. **Clear Vite cache**: `rm -rf .vite`
3. **Check Node version**: Ensure Node.js 16+

## Contributing

1. Create a feature branch
2. Make changes and test
3. Submit a pull request

## License

MIT

## Support

For issues and questions, open a GitHub issue or contact support@travelbook.com
