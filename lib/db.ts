import { Dress, Booking, User } from "@/types";

export const dresses: Dress[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    name: "Elegant Evening Gown",
    description: "A stunning floor-length gown perfect for formal events and galas. Features a sweetheart neckline and flowing chiffon skirt.",
    price: 150,
    additionalDayPrice: 0,
    size: ["XS", "S", "M", "L", "XL"],
    color: "Navy Blue",
    occasion: "Formal",
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop",
    available: true,
    category: "Gowns"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    name: "Cocktail Party Dress",
    description: "A chic knee-length dress with sequin details. Perfect for cocktail parties and semi-formal events.",
    price: 85,
    additionalDayPrice: 0,
    size: ["S", "M", "L"],
    color: "Black",
    occasion: "Party",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop",
    available: true,
    category: "Cocktail"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    name: "Summer Floral Maxi",
    description: "Light and breezy maxi dress with beautiful floral prints. Ideal for beach weddings and garden parties.",
    price: 65,
    additionalDayPrice: 0,
    size: ["XS", "S", "M", "L"],
    color: "Floral",
    occasion: "Casual",
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop",
    available: true,
    category: "Maxi"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440004",
    name: "Red Carpet Glamour",
    description: "Show-stopping red gown with a dramatic train. Make an entrance at any high-profile event.",
    price: 200,
    additionalDayPrice: 0,
    size: ["S", "M", "L"],
    color: "Red",
    occasion: "Formal",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&auto=format&fit=crop",
    available: true,
    category: "Gowns"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440005",
    name: "Bridesmaid Chiffon",
    description: "Elegant chiffon dress in dusty rose. Perfect for bridesmaids or wedding guests.",
    price: 95,
    additionalDayPrice: 0,
    size: ["XS", "S", "M", "L", "XL", "XXL"],
    color: "Dusty Rose",
    occasion: "Wedding",
    image: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=800&auto=format&fit=crop",
    available: true,
    category: "Wedding"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440006",
    name: "Vintage Lace Dress",
    description: "Romantic lace dress with vintage-inspired design. Features delicate sleeves and a fitted bodice.",
    price: 110,
    additionalDayPrice: 0,
    size: ["S", "M", "L"],
    color: "Ivory",
    occasion: "Wedding",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop",
    available: true,
    category: "Lace"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440007",
    name: "Little Black Dress",
    description: "The classic LBD with a modern twist. Versatile and timeless for any occasion.",
    price: 55,
    additionalDayPrice: 0,
    size: ["XS", "S", "M", "L", "XL"],
    color: "Black",
    occasion: "Party",
    image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800&auto=format&fit=crop",
    available: true,
    category: "Casual"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440008",
    name: "Prom Princess Gown",
    description: "Sparkling ball gown perfect for prom or quinceañera. Tulle skirt with crystal embellishments.",
    price: 180,
    additionalDayPrice: 0,
    size: ["XS", "S", "M", "L"],
    color: "Blush Pink",
    occasion: "Formal",
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop",
    available: true,
    category: "Gowns"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440009",
    name: "Business Chic Sheath",
    description: "Professional sheath dress for corporate events and business dinners. Clean lines and sophisticated cut.",
    price: 75,
    additionalDayPrice: 0,
    size: ["XS", "S", "M", "L", "XL"],
    color: "Charcoal",
    occasion: "Business",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop",
    available: true,
    category: "Business"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440010",
    name: "Boho Festival Dress",
    description: "Free-spirited boho dress with embroidery details. Perfect for festivals and outdoor events.",
    price: 60,
    additionalDayPrice: 0,
    size: ["S", "M", "L"],
    color: "Terracotta",
    occasion: "Casual",
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop",
    available: true,
    category: "Casual"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440011",
    name: "Mermaid Wedding Dress",
    description: "Stunning mermaid silhouette wedding dress with lace appliqués. For the modern bride.",
    price: 250,
    additionalDayPrice: 0,
    size: ["S", "M", "L"],
    color: "White",
    occasion: "Wedding",
    image: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=800&auto=format&fit=crop",
    available: true,
    category: "Wedding"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440012",
    name: "Velvet Holiday Dress",
    description: "Luxurious velvet dress in emerald green. Perfect for holiday parties and winter events.",
    price: 120,
    additionalDayPrice: 0,
    size: ["XS", "S", "M", "L"],
    color: "Emerald",
    occasion: "Party",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop",
    available: true,
    category: "Cocktail"
  }
];

export let bookings: Booking[] = [];

export const users: User[] = [
  {
    id: "admin-1",
    email: "admin@rentaldress.com",
    name: "Admin User",
    role: "admin"
  }
];

// Helper to add booking
export function addBooking(booking: Booking) {
  bookings.push(booking);
}

// Helper to update booking
export function updateBooking(id: string, updates: Partial<Booking>) {
  const index = bookings.findIndex(b => b.id === id);
  if (index !== -1) {
    bookings[index] = { ...bookings[index], ...updates };
  }
}

// Helper to delete booking
export function deleteBooking(id: string) {
  bookings = bookings.filter(b => b.id !== id);
}
