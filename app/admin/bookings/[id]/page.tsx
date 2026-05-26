"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, CheckCircle, XCircle, Ban, Trophy,
  Download, Clock, MapPin, Phone, Mail, FileText, Loader2,
} from "lucide-react";
import { adminApi, Booking } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { bookingsApi } from "@/lib/api";

const STATUS_LABEL: Record<string, string> = {
  DRAFT: "Draft",
  PENDING_PAYMENT: "Menunggu Pembayaran",
  WAITING_APPROVAL: "Menunggu Persetujuan",
  APPROVED: "Disetujui",
  REJECTED: "Ditolak",
  CANCELLED: "Dibatalkan",
  COMPLETED: "Selesai",
};

const STATUS_COLOR: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-600",
  PENDING_PAYMENT: "bg-yellow-100 text-yellow-700",
  WAITING_APPROVAL: "bg-blue-100 text-blue-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
  CANCELLED: "bg-gray-100 text-gray-500",
  COMPLETED: "bg-purple-100 text-purple-700",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);
}

export default function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { token } = useAuth();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [error, setError] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [adminNote, setAdminNote] = useState("");

  const loadBooking = () => {
    if (!token) return;
    setIsLoading(true);
    adminApi.booking(id, token)
      .then(setBooking)
      .catch((e) => setError(e.message))
      .finally(() => setIsLoading(false));
  };

  useEffect(loadBooking, [id, token]);

  const action = async (fn: () => Promise<unknown>, label: string) => {
    setActionLoading(label);
    setError("");
    try {
      await fn();
      loadBooking();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan");
    } finally {
      setActionLoading("");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#B76E79] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="text-center py-20 text-[#2C2C2C]/50">
        {error || "Booking tidak ditemukan"}
      </div>
    );
  }

  const canApprove = booking.status === "WAITING_APPROVAL";
  const canReject = ["WAITING_APPROVAL", "PENDING_PAYMENT"].includes(booking.status);
  const canCancel = !["APPROVED", "COMPLETED", "CANCELLED"].includes(booking.status);
  const canComplete = booking.status === "APPROVED";

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/bookings" className="p-2 rounded-xl hover:bg-[#F7D9D9]/50 transition">
          <ArrowLeft size={20} className="text-[#2C2C2C]" />
        </Link>
        <div>
          <h1 className="font-serif text-2xl text-[#2C2C2C]">Detail Booking</h1>
          <p className="text-xs text-[#2C2C2C]/40 font-mono mt-0.5">{booking.id}</p>
        </div>
        <span className={`ml-auto text-sm px-3 py-1 rounded-full font-medium ${STATUS_COLOR[booking.status]}`}>
          {STATUS_LABEL[booking.status]}
        </span>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-4">
          {/* Client */}
          <div className="bg-white rounded-2xl border border-[#F7D9D9] p-5">
            <h2 className="font-semibold text-[#2C2C2C] mb-4">Data Klien</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Phone size={15} className="text-[#B76E79] shrink-0" />
                <span className="text-[#2C2C2C]">{booking.customer?.name}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone size={15} className="text-[#B76E79] shrink-0" />
                <a href={`tel:${booking.customer?.phone}`} className="text-[#B76E79] hover:underline">
                  {booking.customer?.phone}
                </a>
              </div>
              {booking.customer?.email && (
                <div className="flex items-center gap-3 text-sm">
                  <Mail size={15} className="text-[#B76E79] shrink-0" />
                  <a href={`mailto:${booking.customer.email}`} className="text-[#B76E79] hover:underline">
                    {booking.customer.email}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Event */}
          <div className="bg-white rounded-2xl border border-[#F7D9D9] p-5">
            <h2 className="font-semibold text-[#2C2C2C] mb-4">Detail Event</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <FileText size={15} className="text-[#B76E79] mt-0.5 shrink-0" />
                <div>
                  <p className="text-[#2C2C2C]/50 text-xs">Layanan</p>
                  <p className="text-[#2C2C2C]">{booking.service?.name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={15} className="text-[#B76E79] mt-0.5 shrink-0" />
                <div>
                  <p className="text-[#2C2C2C]/50 text-xs">Tanggal & Waktu</p>
                  <p className="text-[#2C2C2C]">{formatDate(booking.eventDate)}</p>
                  <p className="text-[#2C2C2C]/70">{booking.eventStartTime} – {booking.eventEndTime}</p>
                </div>
              </div>
              {booking.eventLocation && (
                <div className="flex items-start gap-3">
                  <MapPin size={15} className="text-[#B76E79] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[#2C2C2C]/50 text-xs">Lokasi</p>
                    <p className="text-[#2C2C2C]">{booking.eventLocation}</p>
                    {booking.eventAddress && <p className="text-[#2C2C2C]/60">{booking.eventAddress}</p>}
                  </div>
                </div>
              )}
              {booking.notes && (
                <div className="p-3 rounded-lg bg-[#FFF8F2] border border-[#F7D9D9]">
                  <p className="text-xs text-[#2C2C2C]/50 mb-1">Catatan</p>
                  <p className="text-[#2C2C2C]">{booking.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Payment Proofs */}
          {booking.paymentProofs && booking.paymentProofs.length > 0 && (
            <div className="bg-white rounded-2xl border border-[#F7D9D9] p-5">
              <h2 className="font-semibold text-[#2C2C2C] mb-4">Bukti Pembayaran</h2>
              <div className="space-y-3">
                {booking.paymentProofs.map((proof) => (
                  <div key={proof.id} className="flex items-center justify-between p-3 bg-[#FFF8F2] rounded-xl border border-[#F7D9D9]">
                    <div className="text-sm">
                      <p className="font-medium text-[#2C2C2C]">{proof.fileName ?? "Bukti Pembayaran"}</p>
                      <p className="text-[#2C2C2C]/50 text-xs">{proof.status}</p>
                    </div>
                    <a
                      href={proof.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg hover:bg-[#F7D9D9] transition"
                    >
                      <Download size={16} className="text-[#B76E79]" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Price */}
          <div className="bg-white rounded-2xl border border-[#F7D9D9] p-5">
            <p className="text-xs text-[#2C2C2C]/50 mb-1">Harga Disepakati</p>
            <p className="text-2xl font-bold text-[#B76E79]">{formatCurrency(booking.agreedPrice)}</p>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-2xl border border-[#F7D9D9] p-5 space-y-3">
            <h2 className="font-semibold text-[#2C2C2C]">Aksi</h2>

            {canApprove && (
              <div className="space-y-2">
                <textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="Catatan admin (opsional)..."
                  rows={2}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-[#F7D9D9] focus:outline-none focus:border-[#B76E79] resize-none"
                />
                <button
                  onClick={() => action(() => adminApi.approveBooking(id, token!, adminNote), "approve")}
                  disabled={!!actionLoading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition disabled:opacity-50"
                >
                  {actionLoading === "approve" ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                  Setujui Booking
                </button>
              </div>
            )}

            {canReject && (
              <button
                onClick={() => setShowRejectModal(true)}
                disabled={!!actionLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 text-red-600 border border-red-200 text-sm font-medium hover:bg-red-100 transition disabled:opacity-50"
              >
                <XCircle size={16} />
                Tolak Booking
              </button>
            )}

            {canComplete && (
              <button
                onClick={() => action(() => adminApi.completeBooking(id, token!), "complete")}
                disabled={!!actionLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition disabled:opacity-50"
              >
                {actionLoading === "complete" ? <Loader2 size={16} className="animate-spin" /> : <Trophy size={16} />}
                Tandai Selesai
              </button>
            )}

            {canCancel && (
              <button
                onClick={() => action(() => adminApi.cancelBooking(id, token!), "cancel")}
                disabled={!!actionLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-100 text-gray-600 text-sm font-medium hover:bg-gray-200 transition disabled:opacity-50"
              >
                {actionLoading === "cancel" ? <Loader2 size={16} className="animate-spin" /> : <Ban size={16} />}
                Batalkan Booking
              </button>
            )}

            {booking.status === "APPROVED" && (
              <a
                href={bookingsApi.downloadIcs(id)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#F7D9D9] text-[#B76E79] text-sm font-medium hover:bg-[#FFF8F2] transition"
              >
                <Download size={16} />
                Download .ics
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <h3 className="font-serif text-xl text-[#2C2C2C] mb-4">Tolak Booking</h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Alasan penolakan (wajib)..."
              rows={3}
              className="w-full px-3 py-2 text-sm rounded-lg border border-[#F7D9D9] focus:outline-none focus:border-red-400 resize-none mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-[#F7D9D9] text-sm text-[#2C2C2C] hover:bg-[#FFF8F2] transition"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  if (!rejectReason.trim()) return;
                  action(() => adminApi.rejectBooking(id, rejectReason, token!), "reject");
                  setShowRejectModal(false);
                }}
                disabled={!rejectReason.trim()}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition disabled:opacity-50"
              >
                Tolak
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
