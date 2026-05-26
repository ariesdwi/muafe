"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { CalendarCheck, ClipboardList, CreditCard, UploadCloud, ShieldCheck, Sparkles } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    step: "01",
    title: "Pilih Layanan",
    description: "Pilih paket makeup yang sesuai dengan jenis acaramu — wedding, wisuda, photoshoot, dan lainnya.",
    color: "bg-[#F7D9D9]",
    iconColor: "text-[#B76E79]",
  },
  {
    icon: CalendarCheck,
    step: "02",
    title: "Pilih Tanggal",
    description: "Cek ketersediaan jadwal secara real-time dan pilih tanggal eventmu.",
    color: "bg-rose-50",
    iconColor: "text-rose-500",
  },
  {
    icon: ClipboardList,
    step: "03",
    title: "Isi Data Diri",
    description: "Lengkapi nama, nomor WhatsApp, jam mulai, lokasi event, dan catatan tambahan.",
    color: "bg-orange-50",
    iconColor: "text-orange-500",
  },
  {
    icon: CreditCard,
    step: "04",
    title: "Transfer Booking Fee",
    description: "Setelah booking berhasil dikirim, lakukan transfer DP untuk mengamankan jadwalmu.",
    color: "bg-yellow-50",
    iconColor: "text-yellow-600",
  },
  {
    icon: UploadCloud,
    step: "05",
    title: "Upload Bukti Bayar",
    description: "Upload foto/screenshot bukti transfer langsung di halaman status bookingmu.",
    color: "bg-lime-50",
    iconColor: "text-lime-600",
  },
  {
    icon: ShieldCheck,
    step: "06",
    title: "Konfirmasi Admin",
    description: "Tim kami verifikasi pembayaran dan konfirmasi booking. Notifikasi dikirim via WhatsApp.",
    color: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    icon: Sparkles,
    step: "07",
    title: "Makeup Day! ✨",
    description: "MUA datang sesuai jadwal dan kamu tampil cantik di hari spesialmu.",
    color: "bg-purple-50",
    iconColor: "text-purple-500",
  },
];

export default function BookingFlow() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="booking" className="py-20 md:py-28 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-[#B76E79] text-sm uppercase tracking-widest mb-3">
            Alur Booking
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-[#2C2C2C] mb-4">
            Cara Booking Online
          </h2>
          <p className="text-[#2C2C2C]/60 max-w-xl mx-auto">
            Proses booking mudah dan transparan — dari pilih layanan sampai hari H, semua terpantau secara real-time.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-[#F7D9D9] hidden sm:block" />

          <div className="space-y-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative flex gap-5 sm:gap-6 items-start"
              >
                {/* Icon circle */}
                <div className={`relative z-10 w-12 h-12 shrink-0 rounded-full ${step.color} flex items-center justify-center shadow-sm border border-white`}>
                  <step.icon className={`w-5 h-5 ${step.iconColor}`} />
                </div>

                {/* Content */}
                <div className="flex-1 bg-[#FFFAF8] border border-[#F7D9D9] rounded-2xl px-5 py-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-[#2C2C2C]">{step.title}</h3>
                    <span className="text-xs font-bold text-[#B76E79]/30 shrink-0">{step.step}</span>
                  </div>
                  <p className="text-sm text-[#2C2C2C]/60 mt-1 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center mt-14"
        >
          <a
            href="/booking"
            className="inline-block bg-[#B76E79] text-white px-10 py-4 rounded-full text-sm font-medium hover:bg-[#a25d68] transition-all duration-300 hover:shadow-lg hover:shadow-[#B76E79]/25"
          >
            Mulai Booking Sekarang
          </a>
        </motion.div>
      </div>
    </section>
  );
}

