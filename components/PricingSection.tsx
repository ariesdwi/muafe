"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { getWhatsAppLink } from "@/lib/whatsapp";

export default function PricingSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="pricing" className="py-20 md:py-28 bg-[#FFF8F2]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-[#B76E79] text-sm uppercase tracking-widest mb-3">
            Pricing
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-[#2C2C2C] mb-6">
            Customized Packages for Your Needs
          </h2>
          <p className="text-[#2C2C2C]/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            Paket makeup disesuaikan dengan kebutuhan acara, lokasi, jumlah
            orang, dan konsep makeup yang diinginkan.
          </p>

          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm">
            <div className="space-y-4 text-left mb-8">
              <div className="flex items-center justify-between py-3 border-b border-[#F7D9D9]/50">
                <span className="text-[#2C2C2C]">Graduation Makeup</span>
                <span className="text-[#B76E79] font-medium">
                  Mulai dari Rp xxx.xxx
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-[#F7D9D9]/50">
                <span className="text-[#2C2C2C]">Engagement Makeup</span>
                <span className="text-[#B76E79] font-medium">
                  Mulai dari Rp xxx.xxx
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-[#F7D9D9]/50">
                <span className="text-[#2C2C2C]">Party / Event Makeup</span>
                <span className="text-[#B76E79] font-medium">
                  Mulai dari Rp xxx.xxx
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-[#F7D9D9]/50">
                <span className="text-[#2C2C2C]">Photoshoot Makeup</span>
                <span className="text-[#B76E79] font-medium">
                  Mulai dari Rp xxx.xxx
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-[#2C2C2C]">Wedding Makeup</span>
                <span className="text-[#B76E79] font-medium">
                  Custom Package
                </span>
              </div>
            </div>

            <a
              href={getWhatsAppLink("Halo Kak, saya ingin request pricelist lengkap.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#B76E79] text-white px-8 py-4 rounded-full text-sm font-medium hover:bg-[#a25d68] transition-all duration-300 hover:shadow-lg hover:shadow-[#B76E79]/25"
            >
              Request Pricelist via WhatsApp
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
