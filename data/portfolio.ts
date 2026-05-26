export interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  image: string;
}

export const categories = [
  "All",
  "Wedding",
  "Engagement",
  "Graduation",
  "Party",
  "Photoshoot",
  "Traditional",
  "Soft Glam",
  "Natural",
];

export const portfolioItems: PortfolioItem[] = [
  {
    id: 1,
    title: "Elegant Wedding Look",
    category: "Wedding",
    image: "https://images.unsplash.com/photo-1684868268327-7e5590bcfbd6?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Soft Glam Engagement",
    category: "Engagement",
    image: "https://images.unsplash.com/photo-1615148666456-06660ea96cc5?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Fresh Graduation Look",
    category: "Graduation",
    image: "https://images.unsplash.com/photo-1709477542170-f11ee7d471a0?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Glamorous Party Makeup",
    category: "Party",
    image: "https://images.unsplash.com/photo-1554226629-2af69efaa2fb?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "Beauty Photoshoot",
    category: "Photoshoot",
    image: "https://images.unsplash.com/photo-1709477542153-5bedab2b5657?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: 6,
    title: "Traditional Bridal Look",
    category: "Traditional",
    image: "https://images.unsplash.com/photo-1636023730877-233b9237d4ec?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: 7,
    title: "Soft Glam Look",
    category: "Soft Glam",
    image: "https://images.unsplash.com/photo-1709477542149-f4e0e21d590b?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: 8,
    title: "Natural Beauty Makeup",
    category: "Natural",
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: 9,
    title: "Royal Wedding Makeup",
    category: "Wedding",
    image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: 10,
    title: "Romantic Eye Detail",
    category: "Engagement",
    image: "https://images.unsplash.com/photo-1622336889416-8d790ad807d7?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: 11,
    title: "Bold Party Glam",
    category: "Party",
    image: "https://images.unsplash.com/photo-1583784561105-a674080f391e?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: 12,
    title: "Editorial Photoshoot",
    category: "Photoshoot",
    image: "https://images.unsplash.com/photo-1709477542170-f11ee7d471a0?w=600&q=80&auto=format&fit=crop",
  },
];
