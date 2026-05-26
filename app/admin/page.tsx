"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Clock, CheckCircle, TrendingUp, CalendarCheck, CreditCard } from "lucide-react";
import { adminApi, DashboardSummary, Booking } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

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
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);
}

export default function AdminDashboardPage() {
  const { token } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    adminApi.dashboard(token)
      .then(setSummary)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [token]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#B76E79] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const stats = [
    { label: "Total Booking", value: summary?.totalBookings ?? 0, icon: BookOpen, color: "bg-[#B76E79]" },
    { label: "Menunggu Persetujuan", value: summary?.waitingApproval ?? 0, icon: Clock, color: "bg-amber-500", href: "/admin/bookings" },
    { label: "Menunggu Pembayaran", value: summary?.pendingPayment ?? 0, icon: CreditCard, color: "bg-blue-500", href: "/admin/payments" },
    { label: "Disetujui Bulan Ini", value: summary?.approvedThisMonth ?? 0, icon: CheckCircle, color: "bg-green-500" },
    { label: "Selesai Bulan Ini", value: summary?.completedThisMonth ?? 0, icon: TrendingUp, color: "bg-purple-500" },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="font-serif text-2xl lg:text-3xl text-[#2C2C2C]">Dashboard</h1>
        <p className="text-[#2C2C2C]/50 mt-1">Selamat datang di panel admin MUA.Studio</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href ?? "#"}
            className={`bg-white rounded-2xl p-5 border border-[#F7D9D9] hover:shadow-md transition ${stat.href ? "cursor-pointer" : "cursor-default"}`}
          >
            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon size={20} className="text-white" />
            </div>
            <p className="text-2xl font-bold text-[#2C2C2C]">{stat.value}</p>
            <p className="text-xs text-[#2C2C2C]/50 mt-0.5">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Upcoming Bookings */}
      <div className="bg-white rounded-2xl border border-[#F7D9D9] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F7D9D9]">
          <div className="flex items-center gap-2">
            <CalendarCheck size={18} className="text-[#B76E79]" />
            <h2 className="font-semibold text-[#2C2C2C]">Booking Mendatang</h2>
          </div>
          <Link href="/admin/bookings" className="text-sm text-[#B76E79] hover:underline">
            Lihat semua →
          </Link>
        </div>

        {!summary?.upcomingBookings?.length ? (
          <div className="py-12 text-center text-[#2C2C2C]/40">
            Belum ada booking mendatang
          </div>
        ) : (
          <div className="divide-y divide-[#F7D9D9]">
            {summary.upcomingBookings.map((booking: Booking) => (
              <Link
                key={booking.id}
                href={`/admin/bookings/${booking.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-[#FFF8F2] transition"
              >
                <div>
                  <p className="font-medium text-[#2C2C2C]">
                    {booking.customer?.name ?? "—"}
                  </p>
                  <p className="text-sm text-[#2C2C2C]/50">
                    {booking.service?.name} • {formatDate(booking.eventDate)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-[#2C2C2C]">
                    {formatCurrency(booking.agreedPrice)}
                  </span>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLOR[booking.status]}`}>
                    {STATUS_LABEL[booking.status]}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
