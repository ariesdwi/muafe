"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/#about", label: "About" },
  { href: "/#services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/#testimonials", label: "Testimonials" },
  { href: "/#booking", label: "How to Book" },
  { href: "/#contact", label: "Contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FFF8F2]/90 backdrop-blur-md border-b border-[#F7D9D9]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="font-serif text-xl md:text-2xl text-[#2C2C2C] tracking-wide">
            MUA<span className="text-[#B76E79]">.</span>Studio
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-[#2C2C2C] hover:text-[#B76E79] transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/booking"
              className="bg-[#B76E79] text-white px-5 py-2 rounded-full text-sm hover:bg-[#a25d68] transition-colors duration-300"
            >
              Book Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-[#2C2C2C]"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#FFF8F2] border-b border-[#F7D9D9]/50"
          >
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block text-[#2C2C2C] hover:text-[#B76E79] transition-colors py-2"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/booking"
                onClick={() => setIsOpen(false)}
                className="block bg-[#B76E79] text-white px-5 py-3 rounded-full text-center text-sm hover:bg-[#a25d68] transition-colors"
              >
                Book Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
