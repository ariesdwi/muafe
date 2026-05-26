"use client";

import { MessageCircle } from "lucide-react";
import { getWhatsAppLink } from "@/lib/whatsapp";

export default function WhatsAppButton() {
  return (
    <a
      href={getWhatsAppLink()}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 hover:scale-110 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/30"
      aria-label="Chat via WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
    </a>
  );
}
