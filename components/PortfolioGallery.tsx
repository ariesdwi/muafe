"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { portfolioItems, categories } from "@/data/portfolio";
import Link from "next/link";

export default function PortfolioGallery() {
  const [activeCategory, setActiveCategory] = useState("All");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const filteredItems =
    activeCategory === "All"
      ? portfolioItems.slice(0, 6)
      : portfolioItems
          .filter((item) => item.category === activeCategory)
          .slice(0, 6);

  return (
    <section id="portfolio" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-[#B76E79] text-sm uppercase tracking-widest mb-3">
            Portfolio
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-[#2C2C2C] mb-4">
            A Glimpse of Beautiful Moments
          </h2>
          <p className="text-[#2C2C2C]/60 max-w-2xl mx-auto">
            I have been honored to be part of these beautiful transformations.
          </p>
        </motion.div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.slice(0, 6).map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                activeCategory === category
                  ? "bg-[#B76E79] text-white"
                  : "bg-[#F7D9D9]/50 text-[#2C2C2C]/70 hover:bg-[#F7D9D9]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer shadow-sm"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-[#2C2C2C]/0 group-hover:bg-[#2C2C2C]/50 transition-all duration-300 flex items-end">
                <div className="p-4 w-full translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white text-sm font-medium">{item.title}</p>
                  <p className="text-white/70 text-xs">{item.category}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <Link
            href="/portfolio"
            className="inline-block border-2 border-[#B76E79] text-[#B76E79] px-8 py-3 rounded-full text-sm font-medium hover:bg-[#B76E79] hover:text-white transition-all duration-300"
          >
            View All Portfolio
          </Link>
        </div>
      </div>
    </section>
  );
}
