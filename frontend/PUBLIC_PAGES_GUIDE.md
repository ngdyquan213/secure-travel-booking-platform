# Public Pages Guide

This document describes the public-facing pages of the TravelBook platform that are accessible before user authentication.

## Overview

The TravelBook frontend now includes comprehensive public pages that allow visitors to explore the platform, learn about services, and read travel guides before signing up or logging in.

## Public Pages

### 1. Home Page (`/`)
The main landing page showcasing TravelBook's value proposition.

**Features:**
- Hero section with call-to-action
- Feature highlights (flights, hotels, tours, trends)
- "How it works" process explanation
- Customer testimonials section
- Final CTA to sign up or explore

**Key Components:**
- `SectionHero` - Hero banner with gradient background
- `FeatureCard` - Service feature cards with icons
- `TestimonialCard` - Customer testimonial cards

**Navigation from Home:**
- Flights, Hotels, Tours (require login)
- Blog, Services, About, Contact (public)

---

### 2. Blog Page (`/blog`)
A comprehensive travel blog with search and category filtering.

**Features:**
- Search functionality (by title/excerpt)
- Category filter buttons
- Blog post cards with images and metadata
- Read time estimates
- Author information
- Post count display

**Data:**
- Mock blog posts stored in `/src/data/blogPosts.ts`
- 6 predefined posts covering travel tips, destinations, culture, etc.
- Easy to migrate to API later

**Categories Supported:**
- Destinations
- Travel Tips
- Culture
- Hotels & Stays
- Food & Dining

---

### 3. Blog Detail Page (`/blog/:id`)
Individual blog post view with related articles.

**Features:**
- Full blog post content
- Hero image
- Meta information (category, read time, author, date)
- Rich text rendering with markdown-like parsing
- Related articles section
- Social sharing button (UI placeholder)
- Call-to-action to book travel

**Components Used:**
- Metadata display with icons
- Related posts grid
- CTA section with booking link

---

### 4. About Page (`/about`)
Company information and mission statement.

**Features:**
- Company story section
- Core values (4 cards with icons)
- Team member profiles
- Company statistics
- Join community CTA

**Sections:**
1. **Story** - Narrative about TravelBook's founding and growth
2. **Values** - Passion, Mission, Excellence, Community
3. **Team** - 4 key team members with roles and bios
4. **Stats** - Key metrics (10M travelers, 500+ destinations, etc.)

---

### 5. Services Page (`/services`)
Detailed overview of all TravelBook services.

**Features:**
- 6 service cards with descriptions and features:
  - Flight Booking
  - Hotel & Accommodation
  - Tours & Activities
  - Travel Insurance
  - 24/7 Customer Support
  - Travel Planning Tools
- "Why Choose Us" comparison section
- Transparent pricing information
- Call-to-action buttons

**Key Selling Points:**
- 1M+ hotel partners
- 500+ destinations
- 100% secure booking

---

### 6. Contact Page (`/contact`)
Communication hub with contact information and FAQ.

**Features:**
- Contact method cards (email, phone, live chat, visit)
- Contact form component
- Business hours information
- Response time expectations
- Language support information
- Frequently Asked Questions (6 questions)
- FAQ accordion with collapsible answers

**Form Functionality:**
- Name, email, subject, message fields
- Submit button with loading state
- Success message on submission
- Client-side validation

**FAQ Topics Covered:**
- Refund policy
- Booking modifications
- Travel insurance
- Payment security
- Payment methods
- Customer support

---

## Reusable Components

### SectionHero
Props:
```typescript
{
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  cta?: { text: string; href: string };
  children?: ReactNode;
}
```

### FeatureCard
Props:
```typescript
{
  icon: LucideIcon;
  title: string;
  description: string;
  href?: string; // Optional link
}
```

### TestimonialCard
Props:
```typescript
{
  content: string;
  author: string;
  role: string;
  rating?: number; // Default 5
  avatar?: string;
}
```

### ContactForm
Self-contained form component with:
- Form state management
- Validation
- Loading state
- Success feedback

---

## Navigation Structure

### Non-Authenticated Users See:
- Blog
- Services
- About
- Contact

### Authenticated Users See:
- Dashboard
- Flights
- Hotels
- Tours
- Blog
- Documents
- Admin (if admin role)

---

## Blog Data Structure

Located in `/src/data/blogPosts.ts`:

```typescript
interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  image: string;
  readTime: number;
}
```

**Adding New Posts:**
1. Add to the `blogPosts` array
2. Use markdown-like formatting in content (# headings, - lists, etc.)
3. Ensure unique ID
4. Provide category from predefined list

---

## Responsive Design

All public pages are fully responsive:

- **Mobile** - Single column, hamburger menu, touch-friendly buttons
- **Tablet** - 2-column layouts where appropriate
- **Desktop** - Full 3-4 column grids, expanded navigation

**Key Responsive Classes Used:**
- `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`
- `hidden md:flex`
- `hidden sm:inline`
- `flex-wrap` for flexible button groups

---

## Styling & Colors

All pages use the consistent design system:

**Primary Colors:**
- Blue: `#3b82f6` (blue-600)
- Gray accents for neutral elements
- White backgrounds with subtle shadows

**Typography:**
- Headings: Bold, large font sizes
- Body text: Medium weight, gray-700 or gray-600
- Text wrapping: `text-balance` and `text-pretty`

---

## Future Enhancements

1. **Blog API Integration**
   - Replace mock data with API calls
   - Add pagination
   - Implement search via API

2. **Contact Form Integration**
   - Connect to backend email service
   - Add reCAPTCHA validation
   - Implement real-time notifications

3. **CMS Integration**
   - Connect blog to Strapi/Sanity CMS
   - Enable dynamic content updates

4. **Analytics**
   - Track blog post views
   - Monitor contact form submissions
   - Analyze user engagement

5. **SEO Optimization**
   - Add meta tags to each page
   - Implement structured data
   - Create sitemaps

---

## Testing Checklist

- [ ] Homepage loads correctly
- [ ] Blog search filters work
- [ ] Blog category filtering works
- [ ] Blog detail pages load from any category
- [ ] Related posts display correctly
- [ ] About page displays team info
- [ ] Services page displays all services
- [ ] Contact form submits successfully
- [ ] Mobile navigation works on all pages
- [ ] All internal links navigate correctly
- [ ] Images load properly on all pages
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] Footer links work correctly

---

## Performance Notes

- Images use Unsplash URLs for demo purposes
- Mock blog data is static and loads instantly
- No API calls required for public pages (until future integration)
- Lightweight components focused on performance

---

## Accessibility

All public pages follow accessibility best practices:
- Semantic HTML elements
- Proper heading hierarchy (h1 → h2 → h3)
- Alt text for decorative images where relevant
- Focus-visible states on interactive elements
- Color contrast ratios meet WCAG standards
- Form labels properly associated with inputs
