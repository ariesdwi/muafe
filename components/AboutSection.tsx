"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

export default function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative w-full aspect-square max-w-md mx-auto">
              <div className="absolute inset-4 bg-[#B76E79]/10 rounded-[2rem] -rotate-3" />
              <div className="relative w-full h-full rounded-[2rem] overflow-hidden shadow-xl">
                <Image
                  src="https://images.unsplash.com/photo-1636023730877-233b9237d4ec?w=700&q=85&auto=format&fit=crop"
                  alt="Professional makeup artist at work"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <p className="text-[#B76E79] text-sm uppercase tracking-widest mb-3">
              About Me
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-[#2C2C2C] mb-6">
              Enhancing Your Natural Beauty
            </h2>
            <p className="text-[#2C2C2C]/70 leading-relaxed mb-6">
              Saya adalah Professional Makeup Artist yang berfokus pada hasil
              makeup yang elegan, tahan lama, dan sesuai karakter wajah klien.
              Dengan pengalaman menangani berbagai acara seperti wedding,
              engagement, graduation, photoshoot, dan event formal, saya membantu
              setiap klien tampil percaya diri di momen terbaiknya.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-[#FFF8F2] rounded-xl">
                <p className="font-serif text-2xl text-[#B76E79]">500+</p>
                <p className="text-sm text-[#2C2C2C]/60">Happy Clients</p>
              </div>
              <div className="text-center p-4 bg-[#FFF8F2] rounded-xl">
                <p className="font-serif text-2xl text-[#B76E79]">5+</p>
                <p className="text-sm text-[#2C2C2C]/60">Years Experience</p>
              </div>
              <div className="text-center p-4 bg-[#FFF8F2] rounded-xl">
                <p className="font-serif text-2xl text-[#B76E79]">7</p>
                <p className="text-sm text-[#2C2C2C]/60">Service Types</p>
              </div>
              <div className="text-center p-4 bg-[#FFF8F2] rounded-xl">
                <p className="font-serif text-2xl text-[#B76E79]">⭐ 5.0</p>
                <p className="text-sm text-[#2C2C2C]/60">Rating</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
