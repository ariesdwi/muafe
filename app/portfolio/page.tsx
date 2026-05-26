"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { portfolioItems, categories } from "@/data/portfolio";

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredItems =
    activeCategory === "All"
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === activeCategory);

  return (
    <section className="pt-28 pb-20 min-h-screen bg-[#FFF8F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-[#B76E79] text-sm uppercase tracking-widest mb-3">
            Portfolio
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-[#2C2C2C] mb-4">
            My Work Gallery
          </h1>
          <p className="text-[#2C2C2C]/60 max-w-2xl mx-auto">
            A glimpse of beautiful moments I have been honored to be part of.
          </p>
        </motion.div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                activeCategory === category
                  ? "bg-[#B76E79] text-white"
                  : "bg-white text-[#2C2C2C]/70 hover:bg-[#F7D9D9]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer shadow-sm"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-[#2C2C2C]/0 group-hover:bg-[#2C2C2C]/50 transition-all duration-300 flex items-end">
                <div className="p-4 w-full translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white text-sm font-medium">{item.title}</p>
                  <p className="text-white/70 text-xs">{item.category}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
