export interface Testimonial {
  id: number;
  name: string;
  event: string;
  review: string;
  image?: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah A.",
    event: "Wedding",
    review:
      "Makeup-nya awet banget dari pagi sampai malam. Hasilnya flawless tapi tetap natural. Thank you!",
  },
  {
    id: 2,
    name: "Dina R.",
    event: "Engagement",
    review:
      "Suka banget sama hasilnya! Soft glam yang elegan, sesuai banget sama tema lamaran aku.",
  },
  {
    id: 3,
    name: "Putri M.",
    event: "Graduation",
    review:
      "Makeup wisudanya natural tapi tetap keliatan fresh di foto. Tahan seharian!",
  },
  {
    id: 4,
    name: "Anisa K.",
    event: "Photoshoot",
    review:
      "Profesional banget! Makeup-nya detail dan hasil fotonya amazing. Pasti bakal booking lagi.",
  },
  {
    id: 5,
    name: "Rina S.",
    event: "Wedding",
    review:
      "Best MUA! Dari trial sampai hari H semuanya perfect. Sangat recommended!",
  },
  {
    id: 6,
    name: "Maya L.",
    event: "Party",
    review:
      "Makeup untuk acara dinner-ku bagus banget. Glam tapi ga berlebihan. Love it!",
  },
];
