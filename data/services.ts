export interface Service {
  id: string;
  title: string;
  description: string;
  image: string;
}

export const services: Service[] = [
  {
    id: "wedding",
    title: "Wedding Makeup",
    description:
      "Untuk akad, resepsi, intimate wedding, traditional wedding, dan modern wedding.",
    image: "https://images.unsplash.com/photo-1684868268327-7e5590bcfbd6?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: "engagement",
    title: "Engagement Makeup",
    description:
      "Untuk lamaran, sangjit, tunangan, dan pre-wedding event.",
    image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: "graduation",
    title: "Graduation Makeup",
    description:
      "Makeup fresh, natural, dan tahan lama untuk wisuda.",
    image: "https://images.unsplash.com/photo-1709477542170-f11ee7d471a0?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: "party",
    title: "Party / Event Makeup",
    description:
      "Untuk acara formal, dinner, corporate event, atau special occasion.",
    image: "https://images.unsplash.com/photo-1554226629-2af69efaa2fb?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: "photoshoot",
    title: "Photoshoot Makeup",
    description:
      "Untuk beauty shoot, maternity shoot, personal branding, dan portfolio.",
    image: "https://images.unsplash.com/photo-1622336889416-8d790ad807d7?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: "bridesmaid",
    title: "Bridesmaid Makeup",
    description:
      "Makeup cantik dan seragam untuk bridesmaid di hari pernikahan.",
    image: "https://images.unsplash.com/photo-1615148666456-06660ea96cc5?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: "mother-of-bride",
    title: "Mother of Bride Makeup",
    description:
      "Makeup elegan dan age-appropriate untuk ibu pengantin.",
    image: "https://images.unsplash.com/photo-1636023730877-233b9237d4ec?w=600&q=80&auto=format&fit=crop",
  },
];
