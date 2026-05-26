"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { getWhatsAppLink } from "@/lib/whatsapp";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#FFF8F2] via-[#F7D9D9]/30 to-[#FFF8F2]">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-[#B76E79]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#E8C7A1]/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center md:text-left"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-[#B76E79] text-sm md:text-base uppercase tracking-widest mb-4"
            >
              Professional Makeup Artist
            </motion.p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#2C2C2C] leading-tight mb-6">
              Flawless Makeup for Your{" "}
              <span className="text-[#B76E79]">Most Beautiful</span> Moments
            </h1>
            <p className="text-[#2C2C2C]/70 text-base md:text-lg mb-8 max-w-lg mx-auto md:mx-0">
              Professional makeup service for wedding, engagement, graduation,
              photoshoot, and special events.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#B76E79] text-white px-8 py-4 rounded-full text-sm font-medium hover:bg-[#a25d68] transition-all duration-300 hover:shadow-lg hover:shadow-[#B76E79]/25 text-center"
              >
                Book Your Schedule
              </a>
              <a
                href="#portfolio"
                className="border-2 border-[#B76E79] text-[#B76E79] px-8 py-4 rounded-full text-sm font-medium hover:bg-[#B76E79] hover:text-white transition-all duration-300 text-center"
              >
                View Portfolio
              </a>
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative w-full aspect-[3/4] max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-[#B76E79]/20 to-[#E8C7A1]/20 rounded-[2rem] rotate-3" />
              <div className="relative w-full h-full rounded-[2rem] overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=85&auto=format&fit=crop"
                  alt="Professional makeup artist applying lipstick"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
