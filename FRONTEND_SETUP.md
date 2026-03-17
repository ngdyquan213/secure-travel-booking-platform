# Frontend Setup Guide

## Quick Start

### 1. Navigate to Frontend Directory
```bash
cd frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
Create `.env.local` file:
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
VITE_API_URL=http://localhost:8000
```

### 4. Start Development Server
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Project Structure

```
frontend/
├── src/
│   ├── components/       # Shared components (Header, Footer, ProtectedRoute)
│   ├── pages/            # Page components (all routes)
│   ├── services/         # API client with Axios
│   ├── stores/           # Zustand state management (Auth)
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Helper functions
│   ├── App.tsx           # Root component with routing
│   ├── main.tsx          # Entry point
│   └── globals.css       # Global styles
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## Key Features Implemented

### Authentication
- **LoginPage**: Secure login form with validation
- **RegisterPage**: User registration with password strength indicator
- **AuthStore**: Zustand store for global auth state
- **ProtectedRoute**: Route protection for authenticated pages
- Token persistence and auto-refresh

### Travel Booking
- **FlightsPage**: Search and browse flights
- **HotelsPage**: Search and browse hotels
- **ToursPage**: Browse tour packages
- **DashboardPage**: View recent bookings and quick actions

### Booking Management
- **BookingDetailsPage**: View complete booking information
- **PaymentPage**: Secure payment form with idempotency support

### Document Management
- **DocumentUploadPage**: Upload and manage travel documents
- File validation (PDF, JPEG, PNG)
- Document status tracking

### Admin
- **AdminDashboard**: Platform statistics and user management

## API Integration

The frontend includes a comprehensive API client (`src/services/api.ts`) that handles:

```typescript
// Auth
- login(email, password)
- register(email, password, name)
- logout()
- getMe()
- refreshToken()

// Search
- searchFlights(params)
- searchHotels(params)
- searchTours(params)

// Bookings
- createBooking(data)
- getBooking(id)
- getUserBookings(limit, offset)
- cancelBooking(id)

// Payments
- initiatePayment(data)
- getPayment(id)
- confirmPayment(paymentId)

// Documents
- uploadDocument(type, file)
- getUserDocuments()
- deleteDocument(id)

// Admin
- getAdminStats()
- getAllUsers(limit, offset)
- getAllBookings(limit, offset)
```

## State Management

Uses Zustand for centralized auth state:

```typescript
const { 
  user,              // Current user
  token,             // Access token
  isAuthenticated,   // Auth status
  login,             // Login function
  register,          // Register function
  logout,            // Logout function
  isLoading,         // Loading state
  error,             // Error messages
  clearError,        // Clear error
} = useAuthStore()
```

## Styling & Design

- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **Responsive**: Mobile-first design (works on all screen sizes)
- **Color Scheme**:
  - Primary: Blue (#3b82f6)
  - Accent: Green (#22c55e)
  - Neutral: Gray tones

## Development Workflow

### Edit Files
All source files are in `src/`. Changes are automatically reflected via HMR.

### Add New Page
1. Create component in `src/pages/`
2. Add route in `src/App.tsx`
3. Import in routing section

### Add New Component
1. Create component in `src/components/`
2. Import and use in pages

### Modify Styling
- Edit `src/globals.css` for global styles
- Use Tailwind classes for component styles
- Customize theme in `tailwind.config.js`

### Add API Endpoint
1. Add method in `src/services/api.ts`
2. Define types in `src/types/api.ts`
3. Use in components via apiClient

## Build for Production

```bash
npm run build
```

Output is in `dist/` folder. Deploy to any static hosting service.

## Troubleshooting

### API Connection Issues
- Ensure backend is running on port 8000
- Check `VITE_API_URL` in `.env.local`
- Check browser console for CORS errors

### Authentication Issues
- Clear localStorage and try again
- Check browser DevTools → Application → LocalStorage
- Verify tokens are being stored

### Build Issues
- Delete `node_modules` and `.vite` cache
- Run `npm install` again
- Check Node.js version (16+)

## Next Steps

1. **Connect to Backend**: Ensure backend API is running
2. **Test Authentication**: Try login/register
3. **Test Search**: Search for flights, hotels, tours
4. **Test Bookings**: Create a booking and test payment flow
5. **Deploy**: Build and deploy to your hosting platform

## Environment Variables

```
VITE_API_URL          # Backend API URL (default: http://localhost:8000)
```

## Support

For issues, check:
1. Browser console for errors
2. Network tab for API calls
3. Backend logs for API errors
4. This README for common solutions
