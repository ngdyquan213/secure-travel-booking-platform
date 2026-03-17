# Frontend-Backend Integration Guide

## Overview
This guide explains how to connect the React + Vite frontend with your FastAPI backend.

## Prerequisites

- Backend running on `http://localhost:8000`
- Backend endpoints implemented as per API spec
- CORS enabled on backend for frontend origin
- Frontend set up and dependencies installed

## Step 1: Configure Backend CORS

In your FastAPI backend (`app/main.py`), ensure CORS is properly configured:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite dev server
        "http://localhost:3000",   # Alternative port
        "https://yourdomain.com",  # Production domain
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Step 2: Configure Frontend API URL

In `frontend/.env.local`:

```
VITE_API_URL=http://localhost:8000
```

For production in `frontend/.env.production`:

```
VITE_API_URL=https://api.yourdomain.com
```

## Step 3: Start Both Services

### Terminal 1 - Backend
```bash
cd app
# Ensure DB and Redis are running
python main.py
# or
uvicorn app.main:app --reload
```

Backend will be available at `http://localhost:8000`

### Terminal 2 - Frontend
```bash
cd frontend
npm install  # if not already done
npm run dev
```

Frontend will be available at `http://localhost:5173`

## Step 4: Test the Integration

### Test Authentication
1. Open browser to `http://localhost:5173`
2. Navigate to `/register`
3. Fill in the registration form:
   - Name
   - Email
   - Password (must meet strength requirements)
4. Click "Create Account"
5. Check backend logs for the request
6. You should be redirected to dashboard on success

### Test Flight Search
1. Click "Flights" in navigation
2. Enter search parameters:
   - Departure airport: JFK
   - Arrival airport: LAX
   - Date: Tomorrow
   - Passengers: 1
3. Click "Search Flights"
4. Check:
   - Browser Network tab for API call
   - Backend logs for request processing
   - Flight results display

### Test Booking Flow
1. From flight results, click "Select"
2. Fill in booking details
3. Click "Confirm Booking"
4. View booking details page
5. Click "Complete Payment"
6. Fill payment form and submit
7. Verify payment was processed

## API Endpoint Mapping

Frontend calls → Backend routes:

```
POST /auth/login              → User login
POST /auth/register           → User registration
POST /auth/logout             → User logout
POST /auth/refresh-token      → Token refresh
GET  /auth/me                 → Get current user

GET  /flights/search          → Search flights
GET  /flights/{id}            → Get flight details

GET  /hotels/search           → Search hotels
GET  /hotels/{id}             → Get hotel details

GET  /tours/search            → Search tours
GET  /tours/{id}              → Get tour details

POST /bookings                → Create booking
GET  /bookings/{id}           → Get booking details
GET  /bookings/user/bookings  → List user bookings
POST /bookings/{id}/cancel    → Cancel booking

POST /payments/initiate       → Initiate payment (with idempotency_key)
GET  /payments/{id}           → Get payment status
POST /payments/{id}/confirm   → Confirm payment

POST /documents/upload        → Upload document (multipart/form-data)
GET  /documents               → List user documents
DELETE /documents/{id}        → Delete document

GET  /admin/stats             → Get admin statistics
GET  /admin/users             → List all users
GET  /admin/bookings          → List all bookings
```

## Request/Response Examples

### Login Request
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

### Login Response
```json
{
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "name": "John Doe",
    "date_of_birth": null,
    "nationality": null,
    "passport_number": null,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 3600
}
```

### Flight Search Request
```bash
curl -X GET "http://localhost:8000/flights/search?departure_airport=JFK&arrival_airport=LAX&departure_date=2024-02-01&passenger_count=1" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Flight Search Response
```json
{
  "flights": [
    {
      "id": "flight-1",
      "airline": "Delta Airlines",
      "flight_number": "DA123",
      "departure_airport": "JFK",
      "arrival_airport": "LAX",
      "departure_time": "2024-02-01T08:00:00Z",
      "arrival_time": "2024-02-01T12:00:00Z",
      "duration": 240,
      "available_seats": 50,
      "price": 299.99,
      "aircraft_type": "Boeing 737",
      "created_at": "2024-01-10T00:00:00Z"
    }
  ],
  "total": 1,
  "limit": 10,
  "offset": 0
}
```

## Header Format

All requests after login must include the Authorization header:

```
Authorization: Bearer {access_token}
```

Example with frontend API client:
```typescript
// This is handled automatically in src/services/api.ts
// via request interceptor
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
```

## Token Refresh Flow

The frontend automatically handles token refresh:

```
1. User logs in
2. Token stored in localStorage
3. Token sent with each request (via interceptor)
4. If 401 response received:
   a. Frontend calls POST /auth/refresh-token
   b. New token received
   c. Original request retried with new token
5. If refresh fails:
   a. User redirected to login
   b. localStorage cleared
```

## Error Handling

### Frontend receives error response:

```json
{
  "error_code": "INVALID_CREDENTIALS",
  "message": "Email or password is incorrect",
  "details": null,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Frontend displays to user:
- "Email or password is incorrect"

Errors are shown in:
- Alert boxes on pages
- Form validation messages
- Toast notifications (if implemented)

## Idempotency for Payments

Payments use idempotency keys to prevent duplicate charges:

```typescript
// Frontend generates unique key
const idempotencyKey = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

// Sent with payment request
const response = await apiClient.initiatePayment({
  booking_id: "booking-123",
  payment_method: "credit_card",
  idempotency_key: idempotencyKey
})

// Backend uses this key to prevent duplicate processing
// Even if request is retried, only processes once
```

## Deployment Integration

### Production Setup

1. **Backend Deployment**
   ```bash
   # Deploy FastAPI app to your server
   # Update database connection strings
   # Enable HTTPS
   # Configure proper CORS
   ```

2. **Frontend Deployment**
   ```bash
   # Build production bundle
   npm run build
   
   # Deploy dist/ folder to CDN or static hosting
   # Update VITE_API_URL to production backend URL
   ```

3. **Example with Vercel**
   ```bash
   # Backend on separate server/Vercel serverless
   # Frontend on Vercel
   # Set environment variables in Vercel dashboard
   ```

## Debugging

### Check API Calls
1. Open browser DevTools (F12)
2. Go to Network tab
3. Look for XHR/Fetch requests
4. Check request/response headers and body

### Check Token
1. Go to Application tab
2. Check LocalStorage
3. Look for `access_token` key
4. Decode JWT at jwt.io if needed

### Check Backend Logs
```bash
# Terminal running backend
# Look for:
# - POST /auth/login 200
# - GET /flights/search 200
# - POST /bookings 201
```

### Common Issues

**CORS Error**
- Check backend CORS configuration
- Verify frontend origin is allowed
- Check Network tab for preflight OPTIONS request

**401 Unauthorized**
- Token might be expired
- Check localStorage for token
- Try logging in again
- Check backend token validation logic

**404 Not Found**
- Check API endpoint exists in backend
- Verify request path matches backend route
- Check backend routing configuration

**500 Server Error**
- Check backend logs for exception
- Verify database connection
- Check required environment variables set

## Testing Checklist

- [ ] Frontend loads without errors
- [ ] Can register new account
- [ ] Can login with credentials
- [ ] Dashboard loads with user name
- [ ] Can search flights
- [ ] Can search hotels
- [ ] Can search tours
- [ ] Can create booking
- [ ] Can view booking details
- [ ] Can initiate payment
- [ ] Can upload document
- [ ] Can view documents
- [ ] Admin dashboard loads
- [ ] Logout works
- [ ] Protected routes redirect to login

## Performance Optimization

### Frontend
- Code splitting enabled (React Router)
- Lazy loading components
- Image optimization (use proper formats)
- Bundle size monitoring

### Backend
- Database connection pooling
- Query optimization with indexes
- Redis caching for search results
- Pagination for list endpoints

## Security Considerations

### Frontend
- Never store sensitive data in localStorage (considered)
- Always use HTTPS in production
- Implement CSRF tokens if needed
- Validate user input
- Sanitize output

### Backend
- Validate all input on server
- Use parameterized queries (prevents SQL injection)
- Hash passwords with bcrypt
- Implement rate limiting
- Use HTTPS only in production
- Implement proper CORS
- Validate JWT tokens
- Log security events

## Next Steps

1. Configure backend CORS
2. Start backend server
3. Start frontend dev server
4. Test complete user flow
5. Fix any integration issues
6. Deploy to production
7. Monitor logs and errors
8. Gather user feedback

## Support

For integration issues:
1. Check browser console for errors
2. Check backend logs
3. Check Network tab for API calls
4. Verify environment variables
5. Check this guide
6. Contact backend team for API issues
