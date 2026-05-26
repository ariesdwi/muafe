"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Shield, Clock, Palette, Sparkles, Heart, MessageCircle } from "lucide-react";

const reasons = [
  {
    icon: Clock,
    title: "Tahan Lama",
    description: "Makeup awet dari pagi hingga malam tanpa perlu touch up berlebihan.",
  },
  {
    icon: Sparkles,
    title: "Produk Berkualitas",
    description: "Menggunakan produk premium yang aman dan cocok untuk semua jenis kulit.",
  },
  {
    icon: Palette,
    title: "Sesuai Karakter Wajah",
    description: "Menyesuaikan teknik dengan bentuk wajah dan warna kulit klien.",
  },
  {
    icon: Heart,
    title: "Custom Look",
    description: "Bisa request look natural, glam, soft glam, atau traditional.",
  },
  {
    icon: Shield,
    title: "Profesional & On Time",
    description: "Selalu tepat waktu dan memberikan hasil terbaik.",
  },
  {
    icon: MessageCircle,
    title: "Konsultasi Sebelum Hari H",
    description: "Trial makeup dan diskusi konsep sebelum hari acara.",
  },
];

export default function WhyChooseMe() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-[#B76E79] text-sm uppercase tracking-widest mb-3">
            Why Choose Me
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-[#2C2C2C] mb-4">
            Every Face Has Its Own Beauty
          </h2>
          <p className="text-[#2C2C2C]/60 max-w-2xl mx-auto">
            My goal is not to change you, but to enhance your natural elegance.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center p-6 rounded-2xl bg-[#FFF8F2] hover:shadow-md transition-shadow duration-300"
            >
              <div className="w-12 h-12 mx-auto mb-4 bg-[#B76E79]/10 rounded-xl flex items-center justify-center">
                <reason.icon className="w-6 h-6 text-[#B76E79]" />
              </div>
              <h3 className="font-medium text-[#2C2C2C] mb-2">{reason.title}</h3>
              <p className="text-sm text-[#2C2C2C]/60">{reason.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
