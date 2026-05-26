"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { MessageCircle, Camera, Mail, MapPin } from "lucide-react";
import { getWhatsAppLink } from "@/lib/whatsapp";

export default function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="contact" className="py-20 md:py-28 bg-[#FFF8F2]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-[#B76E79] text-sm uppercase tracking-widest mb-3">
            Contact
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-[#2C2C2C] mb-4">
            Let&apos;s Get in Touch
          </h2>
          <p className="text-[#2C2C2C]/60 max-w-2xl mx-auto">
            Hubungi saya untuk konsultasi dan booking jadwal makeup kamu.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6 mb-10">
          <motion.a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-4 bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-[#2C2C2C]">WhatsApp</p>
              <p className="text-sm text-[#2C2C2C]/60">+62 8xx-xxxx-xxxx</p>
            </div>
          </motion.a>

          <motion.a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-4 bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
              <Camera className="w-6 h-6 text-pink-600" />
            </div>
            <div>
              <p className="font-medium text-[#2C2C2C]">Instagram</p>
              <p className="text-sm text-[#2C2C2C]/60">@makeupbynama</p>
            </div>
          </motion.a>

          <motion.a
            href="mailto:hello@example.com"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center gap-4 bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-[#2C2C2C]">Email</p>
              <p className="text-sm text-[#2C2C2C]/60">hello@example.com</p>
            </div>
          </motion.a>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex items-center gap-4 bg-white p-5 rounded-xl shadow-sm"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <MapPin className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-[#2C2C2C]">Area Layanan</p>
              <p className="text-sm text-[#2C2C2C]/60">Jakarta & sekitarnya</p>
            </div>
          </motion.div>
        </div>

        <div className="text-center">
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 text-white px-8 py-4 rounded-full text-sm font-medium hover:bg-green-600 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/25"
          >
            <MessageCircle className="w-5 h-5" />
            Chat WhatsApp Sekarang
          </a>
        </div>
      </div>
    </section>
  );
}
