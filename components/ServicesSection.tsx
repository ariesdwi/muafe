"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { services } from "@/data/services";
import { getServiceWhatsAppLink } from "@/lib/whatsapp";

export default function ServicesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="services" className="py-20 md:py-28 bg-[#FFF8F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-[#B76E79] text-sm uppercase tracking-widest mb-3">
            Services
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-[#2C2C2C] mb-4">
            Makeup Services Crafted for Every Special Occasion
          </h2>
          <p className="text-[#2C2C2C]/60 max-w-2xl mx-auto">
            Setiap momen spesial membutuhkan sentuhan makeup yang berbeda.
            Temukan layanan yang sesuai dengan kebutuhanmu.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative w-full h-48 overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              <div className="p-6">
                <h3 className="font-serif text-xl text-[#2C2C2C] mb-2">
                  {service.title}
                </h3>
                <p className="text-[#2C2C2C]/60 text-sm mb-4">
                  {service.description}
                </p>
                <a
                  href={getServiceWhatsAppLink(service.title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-[#B76E79] text-sm font-medium hover:text-[#a25d68] transition-colors group-hover:underline"
                >
                  Tanya Paket via WhatsApp →
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
