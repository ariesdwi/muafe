"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { testimonials } from "@/data/testimonials";
import { Quote } from "lucide-react";

export default function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="testimonials" className="py-20 md:py-28 bg-[#FFF8F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-[#B76E79] text-sm uppercase tracking-widest mb-3">
            Testimonials
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-[#2C2C2C] mb-4">
            What My Clients Say
          </h2>
          <p className="text-[#2C2C2C]/60 max-w-2xl mx-auto">
            Kepuasan klien adalah prioritas utama saya.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <Quote className="w-8 h-8 text-[#B76E79]/30 mb-4" />
              <p className="text-[#2C2C2C]/70 text-sm leading-relaxed mb-4">
                &ldquo;{testimonial.review}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#F7D9D9] flex items-center justify-center">
                  <span className="text-[#B76E79] text-sm font-medium">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#2C2C2C]">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-[#2C2C2C]/50">
                    {testimonial.event}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
