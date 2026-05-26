"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, Clock, XCircle, Loader2, Upload, Download, MessageCircle } from "lucide-react";
import { bookingsApi, Booking } from "@/lib/api";

const STATUS_INFO: Record<string, { icon: React.ReactNode; color: string; title: string; desc: string }> = {
  DRAFT: { icon: <Clock size={28} />, color: "text-gray-500", title: "Booking Diterima", desc: "Booking kamu telah kami terima. Silakan transfer booking fee dan upload bukti pembayaran." },
  PENDING_PAYMENT: { icon: <Clock size={28} />, color: "text-yellow-600", title: "Menunggu Pembayaran", desc: "Silakan transfer booking fee dan upload bukti pembayaran di bawah." },
  WAITING_APPROVAL: { icon: <Clock size={28} />, color: "text-blue-600", title: "Menunggu Konfirmasi", desc: "Bukti pembayaran kamu sedang kami review. Kami akan menghubungi via WhatsApp dalam 1×24 jam." },
  APPROVED: { icon: <CheckCircle size={28} />, color: "text-green-600", title: "Booking Disetujui! 🎉", desc: "Booking kamu telah disetujui. Kami akan menghubungi via WhatsApp untuk detail selanjutnya." },
  REJECTED: { icon: <XCircle size={28} />, color: "text-red-500", title: "Booking Ditolak", desc: "Maaf, booking kamu tidak dapat kami proses. Silakan hubungi kami untuk informasi lebih lanjut." },
  CANCELLED: { icon: <XCircle size={28} />, color: "text-gray-400", title: "Booking Dibatalkan", desc: "Booking ini telah dibatalkan." },
  COMPLETED: { icon: <CheckCircle size={28} />, color: "text-purple-600", title: "Selesai", desc: "Terima kasih telah mempercayai MUA.Studio. Semoga hasilnya memuaskan! 💄" },
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);
}

export default function BookingStatusPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const load = () => {
    bookingsApi.get(id)
      .then(setBooking)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  useEffect(load, [id]);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setUploadError("");
    try {
      await bookingsApi.uploadPaymentProof(id, file);
      setUploadSuccess(true);
      setFile(null);
      load();
    } catch (e: unknown) {
      setUploadError(e instanceof Error ? e.message : "Upload gagal. Coba lagi.");
    } finally {
      setUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF8F2] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#B76E79] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-[#FFF8F2] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#2C2C2C]/50 mb-4">Booking tidak ditemukan</p>
          <Link href="/booking" className="text-[#B76E79] hover:underline">Buat booking baru</Link>
        </div>
      </div>
    );
  }

  const info = STATUS_INFO[booking.status] ?? STATUS_INFO.DRAFT;
  const canUpload = ["DRAFT", "PENDING_PAYMENT"].includes(booking.status);

  return (
    <div className="min-h-screen bg-[#FFF8F2] pt-24 pb-16 px-4">
      <div className="max-w-lg mx-auto">
        {/* Status Card */}
        <div className="bg-white rounded-2xl border border-[#F7D9D9] p-8 text-center mb-4">
          <div className={`inline-flex ${info.color} mb-3`}>{info.icon}</div>
          <h1 className="font-serif text-2xl text-[#2C2C2C] mb-2">{info.title}</h1>
          <p className="text-sm text-[#2C2C2C]/60 leading-relaxed">{info.desc}</p>

          <div className="mt-4 px-3 py-1.5 rounded-full bg-[#FFF8F2] border border-[#F7D9D9] inline-block">
            <p className="text-xs text-[#2C2C2C]/50 font-mono">{booking.id}</p>
          </div>
        </div>

        {/* Detail */}
        <div className="bg-white rounded-2xl border border-[#F7D9D9] p-6 mb-4">
          <h2 className="font-semibold text-[#2C2C2C] mb-4">Detail Booking</h2>
          <div className="space-y-3 text-sm">
            <Row label="Layanan" value={booking.service?.name ?? "—"} />
            <Row label="Tanggal" value={formatDate(booking.eventDate)} />
            <Row label="Waktu" value={`${booking.eventStartTime} – ${booking.eventEndTime}`} />
            {booking.customer && <Row label="Nama" value={booking.customer.name ?? "—"} />}
            {booking.eventLocation && <Row label="Lokasi" value={booking.eventLocation} />}
            <Row label="Estimasi Harga" value={formatCurrency(booking.agreedPrice)} highlight />
          </div>
        </div>

        {/* Upload Payment */}
        {canUpload && (
          <div className="bg-white rounded-2xl border border-[#F7D9D9] p-6 mb-4">
            <h2 className="font-semibold text-[#2C2C2C] mb-2">Upload Bukti Pembayaran</h2>
            <p className="text-xs text-[#2C2C2C]/50 mb-4">Format: JPG, PNG, WebP, atau PDF. Maks 5MB.</p>

            {uploadSuccess && (
              <div className="mb-3 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm flex items-center gap-2">
                <CheckCircle size={16} />
                Bukti pembayaran berhasil dikirim!
              </div>
            )}

            {uploadError && (
              <div className="mb-3 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">{uploadError}</div>
            )}

            <label className={`flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed cursor-pointer transition ${file ? "border-[#B76E79] bg-[#FFF8F2]" : "border-[#F7D9D9] hover:border-[#B76E79]/50"}`}>
              <Upload size={20} className="text-[#B76E79]" />
              <span className="text-sm text-[#2C2C2C]/60">
                {file ? file.name : "Klik atau drag file ke sini"}
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </label>

            {file && (
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#B76E79] text-white text-sm font-medium hover:bg-[#a35f69] transition disabled:opacity-50"
              >
                {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                {uploading ? "Mengupload..." : "Upload Bukti Pembayaran"}
              </button>
            )}
          </div>
        )}

        {/* ICS Download */}
        {booking.status === "APPROVED" && (
          <div className="bg-white rounded-2xl border border-[#F7D9D9] p-6 mb-4">
            <a
              href={bookingsApi.downloadIcs(id)}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#F7D9D9] text-[#B76E79] text-sm font-medium hover:bg-[#FFF8F2] transition"
            >
              <Download size={16} />
              Tambah ke Kalender (.ics)
            </a>
          </div>
        )}

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={`https://wa.me/628xxxxxxxxxx?text=Halo, saya ingin menanyakan booking ID: ${id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition"
          >
            <MessageCircle size={16} />
            Hubungi via WhatsApp
          </a>
          <Link href="/" className="flex-1 flex items-center justify-center py-3 rounded-xl border border-[#F7D9D9] text-sm text-[#2C2C2C] hover:bg-white transition">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[#2C2C2C]/50 shrink-0">{label}</span>
      <span className={`text-right ${highlight ? "font-bold text-[#B76E79]" : "text-[#2C2C2C]"}`}>{value}</span>
    </div>
  );
}
