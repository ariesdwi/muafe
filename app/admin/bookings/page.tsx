"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Filter } from "lucide-react";
import { adminApi, Booking } from "@/lib/api";
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
    day: "numeric", month: "short", year: "numeric",
  });
}

export default function AdminBookingsPage() {
  const { token } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filtered, setFiltered] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    if (!token) return;
    adminApi.bookings(token)
      .then((data) => { setBookings(data); setFiltered(data); })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [token]);

  useEffect(() => {
    let result = bookings;
    if (statusFilter !== "ALL") result = result.filter((b) => b.status === statusFilter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.customer?.name?.toLowerCase().includes(q) ||
          b.customer?.phone?.toLowerCase().includes(q) ||
          b.service?.name?.toLowerCase().includes(q),
      );
    }
    setFiltered(result);
  }, [search, statusFilter, bookings]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl lg:text-3xl text-[#2C2C2C]">Booking</h1>
        <span className="text-sm text-[#2C2C2C]/50">{filtered.length} data</span>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2C2C2C]/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, no HP, layanan..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#F7D9D9] bg-white text-sm focus:outline-none focus:border-[#B76E79] focus:ring-2 focus:ring-[#B76E79]/20"
          />
        </div>
        <div className="relative">
          <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2C2C2C]/40" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-9 pr-8 py-2.5 rounded-xl border border-[#F7D9D9] bg-white text-sm focus:outline-none focus:border-[#B76E79] appearance-none cursor-pointer"
          >
            <option value="ALL">Semua Status</option>
            {Object.entries(STATUS_LABEL).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#F7D9D9] overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-7 h-7 border-2 border-[#B76E79] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !filtered.length ? (
          <div className="py-16 text-center text-[#2C2C2C]/40">Tidak ada data booking</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#FFF8F2] border-b border-[#F7D9D9]">
                <tr>
                  <th className="text-left px-5 py-3 font-medium text-[#2C2C2C]/60">Klien</th>
                  <th className="text-left px-5 py-3 font-medium text-[#2C2C2C]/60">Layanan</th>
                  <th className="text-left px-5 py-3 font-medium text-[#2C2C2C]/60">Tanggal Event</th>
                  <th className="text-left px-5 py-3 font-medium text-[#2C2C2C]/60">Status</th>
                  <th className="text-left px-5 py-3 font-medium text-[#2C2C2C]/60">Dibuat</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F7D9D9]">
                {filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-[#FFF8F2]/60 transition">
                    <td className="px-5 py-4">
                      <p className="font-medium text-[#2C2C2C]">{b.customer?.name ?? "—"}</p>
                      <p className="text-xs text-[#2C2C2C]/50">{b.customer?.phone}</p>
                    </td>
                    <td className="px-5 py-4 text-[#2C2C2C]">{b.service?.name}</td>
                    <td className="px-5 py-4 text-[#2C2C2C]/70">{formatDate(b.eventDate)}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLOR[b.status]}`}>
                        {STATUS_LABEL[b.status]}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[#2C2C2C]/50">{formatDate(b.createdAt)}</td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/bookings/${b.id}`}
                        className="text-[#B76E79] hover:underline font-medium"
                      >
                        Detail →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
