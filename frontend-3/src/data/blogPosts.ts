export interface BlogPost {
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

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Top 10 Destinations to Visit in 2024',
    excerpt: 'Discover the most amazing travel destinations that should be on your bucket list this year.',
    content: `# Top 10 Destinations to Visit in 2024

Travel is one of the most rewarding experiences you can have. Whether you're looking for adventure, culture, or relaxation, the world has something for everyone.

## 1. Tokyo, Japan
Experience the perfect blend of ancient tradition and cutting-edge technology. From temples to neon-lit streets, Tokyo offers unforgettable memories.

## 2. Bali, Indonesia
Tropical paradise with pristine beaches, lush rice terraces, and vibrant culture. Perfect for both relaxation and adventure.

## 3. Paris, France
The City of Light remains one of the most romantic destinations. Enjoy world-class museums, fine dining, and iconic architecture.

## 4. Iceland
Dramatic landscapes with waterfalls, glaciers, and geysers. Experience the midnight sun or the magical Northern Lights.

## 5. New Zealand
Adventure awaits in this stunning country with activities ranging from bungee jumping to hiking.

Planning ahead, booking during off-peak seasons, and using travel apps can help you make the most of your journey.`,
    category: 'Destinations',
    author: 'Sarah Johnson',
    date: '2024-01-15',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80',
    readTime: 8,
  },
  {
    id: '2',
    title: 'Budget Travel Tips: How to See the World on a Shoestring',
    excerpt: 'Learn practical strategies to travel cheaply without compromising on experiences.',
    content: `# Budget Travel Tips

Traveling on a budget doesn't mean you have to miss out on amazing experiences. Here are proven strategies to make your travels affordable.

## Accommodation Tips
- Stay in hostels and guesthouses
- Use Couchsurfing for free accommodation
- Book vacation rentals with kitchen facilities
- Consider workaway programs

## Transportation Hacks
- Fly during off-peak seasons
- Use budget airlines and compare prices
- Take overnight buses and trains
- Rent bikes for local exploration

## Food Budget
- Eat where locals eat
- Shop at markets for groceries
- Cook your own meals
- Limit restaurant visits

## Activities
- Look for free walking tours
- Visit museums on free days
- Explore nature and parks
- Meet other travelers

With smart planning, you can have incredible adventures without breaking the bank.`,
    category: 'Travel Tips',
    author: 'Michael Chen',
    date: '2024-01-10',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80',
    readTime: 6,
  },
  {
    id: '3',
    title: 'Complete Guide to Travel Insurance',
    excerpt: 'Everything you need to know about choosing the right travel insurance for your trips.',
    content: `# Complete Guide to Travel Insurance

Travel insurance is crucial for protecting yourself against unforeseen circumstances. Here's what you need to know.

## Types of Coverage
- Medical coverage
- Trip cancellation
- Baggage protection
- Emergency evacuation

## What to Look For
- Pre-existing condition coverage
- Coverage limits
- Deductibles
- Exclusions

## When to Buy
- Buy within 14 days of booking for better rates
- Consider your health and destination
- Don't wait until the last minute

## How to Claim
- Keep all receipts and documents
- Report incidents promptly
- Follow the claims process
- Be honest in your claims

Investing in good travel insurance gives you peace of mind and financial protection.`,
    category: 'Travel Tips',
    author: 'Emma Wilson',
    date: '2024-01-05',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    readTime: 7,
  },
  {
    id: '4',
    title: 'Cultural Etiquette: How to Be a Respectful Traveler',
    excerpt: 'Learn essential cultural tips to ensure your travels are respectful and meaningful.',
    content: `# Cultural Etiquette for Travelers

Being a respectful traveler means understanding and respecting local customs and traditions.

## General Rules
- Learn basic phrases in the local language
- Dress appropriately for the culture
- Ask before photographing people
- Remove shoes when required

## Dining Etiquette
- Try local cuisine with an open mind
- Learn dining customs
- Tip appropriately
- Don't refuse hospitality harshly

## Religious Respect
- Respect sacred sites
- Dress modestly in religious places
- Avoid photographing religious ceremonies
- Be silent in quiet spaces

## Social Interactions
- Be humble and curious
- Don't compare to your home country
- Support local businesses
- Participate in cultural activities

Respectful tourism enriches your experience and benefits local communities.`,
    category: 'Culture',
    author: 'David Martinez',
    date: '2023-12-28',
    image: 'https://images.unsplash.com/photo-1488932494519-3deeb6f4ee0e?w=800&q=80',
    readTime: 5,
  },
  {
    id: '5',
    title: 'Best Hotels for Digital Nomads in Southeast Asia',
    excerpt: 'Discover the best accommodations for remote workers in popular Southeast Asian destinations.',
    content: `# Best Hotels for Digital Nomads in Southeast Asia

Southeast Asia is a paradise for digital nomads. Here are top recommendations by city.

## Chiang Mai, Thailand
- Great WiFi and co-working spaces
- Affordable accommodation
- Vibrant expat community
- Excellent food scene

## Ho Chi Minh City, Vietnam
- Modern infrastructure
- Rich culture and history
- Budget-friendly options
- Growing digital nomad scene

## Bali, Indonesia
- Beautiful natural surroundings
- Good work-life balance
- Coworking hubs
- Affordable living costs

## Kuala Lumpur, Malaysia
- Excellent internet
- Modern facilities
- Good public transport
- Cultural diversity

## Hanoi, Vietnam
- Charm and authenticity
- Cheap living costs
- Good food
- Welcoming community

Each destination offers unique advantages for remote workers.`,
    category: 'Hotels & Stays',
    author: 'Lisa Anderson',
    date: '2023-12-20',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
    readTime: 6,
  },
  {
    id: '6',
    title: 'Travel Packing Checklist: Never Forget Anything Again',
    excerpt: 'The ultimate packing guide to ensure you have everything you need for any trip.',
    content: `# Travel Packing Checklist

Packing smartly means less stress and more enjoyment. Use this comprehensive checklist.

## Documents
- Passport and visas
- Travel insurance documents
- Booking confirmations
- Driver's license
- Vaccination certificates

## Clothing
- Weather-appropriate outfits
- Comfortable walking shoes
- Formal outfit if needed
- Undergarments and socks
- Sleepwear

## Toiletries & Health
- Prescription medications
- Travel-size toiletries
- First aid kit
- Sunscreen
- Insect repellent

## Electronics
- Phone and charger
- Universal adapter
- Portable battery bank
- Headphones
- Camera if desired

## Miscellaneous
- Luggage locks
- Travel pillow
- Reusable water bottle
- Plastic bags
- Medications

Create a personal checklist based on your destination and preferences.`,
    category: 'Travel Tips',
    author: 'Robert Taylor',
    date: '2023-12-15',
    image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&q=80',
    readTime: 4,
  },
];

export function getBlogPost(id: string): BlogPost | undefined {
  return blogPosts.find((post) => post.id === id);
}

export function getBlogPostsByCategory(category: string): BlogPost[] {
  return blogPosts.filter((post) => post.category === category);
}

export const categories = [
  'Destinations',
  'Travel Tips',
  'Culture',
  'Hotels & Stays',
  'Food & Dining',
];
