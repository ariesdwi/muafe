import Link from "next/link";
import { Camera, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#2C2C2C] text-white/80 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="font-serif text-xl text-white tracking-wide">
              MUA<span className="text-[#B76E79]">.</span>Studio
            </Link>
            <p className="mt-3 text-sm text-white/50">
              Makeup That Enhances Your Natural Elegance
            </p>
          </div>

          <div>
            <h4 className="font-medium text-white mb-3">Quick Links</h4>
            <div className="space-y-2 text-sm">
              <a href="#about" className="block hover:text-[#B76E79] transition-colors">About</a>
              <a href="#services" className="block hover:text-[#B76E79] transition-colors">Services</a>
              <a href="#portfolio" className="block hover:text-[#B76E79] transition-colors">Portfolio</a>
              <a href="#testimonials" className="block hover:text-[#B76E79] transition-colors">Testimonials</a>
              <a href="#contact" className="block hover:text-[#B76E79] transition-colors">Contact</a>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-white mb-3">Follow Us</h4>
            <div className="flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#B76E79] transition-colors"
              >
                <Camera className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/628xxxxxxxxxx"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-green-500 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 text-center text-sm text-white/40">
          <p>&copy; {new Date().getFullYear()} MUA Studio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
