"use client";

import { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, Plus, Trash2, X, Loader2, Clock, User, MapPin, Banknote, FileText, ExternalLink } from "lucide-react";
import Link from "next/link";
import { adminApi, availabilityApi, DayBooking, BookingStatus } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

type DayStatus = "available" | "booked" | "pending" | "unavailable";

const STATUS_COLOR: Record<DayStatus, string> = {
  available: "bg-white hover:bg-[#FFF8F2]",
  booked: "bg-green-100 border-green-300",
  pending: "bg-yellow-50 border-yellow-300",
  unavailable: "bg-red-50 border-red-200",
};

const STATUS_DOT: Record<DayStatus, string> = {
  available: "",
  booked: "bg-green-500",
  pending: "bg-yellow-500",
  unavailable: "bg-red-400",
};

const BOOKING_STATUS_LABEL: Record<BookingStatus, string> = {
  DRAFT: "Draft",
  PENDING_PAYMENT: "Menunggu Bayar",
  WAITING_APPROVAL: "Menunggu Konfirmasi",
  APPROVED: "Disetujui",
  REJECTED: "Ditolak",
  CANCELLED: "Dibatalkan",
  COMPLETED: "Selesai",
};

const BOOKING_STATUS_BADGE: Record<BookingStatus, string> = {
  DRAFT: "bg-gray-100 text-gray-600",
  PENDING_PAYMENT: "bg-orange-100 text-orange-700",
  WAITING_APPROVAL: "bg-yellow-100 text-yellow-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
  CANCELLED: "bg-gray-100 text-gray-500",
  COMPLETED: "bg-blue-100 text-blue-700",
};

const DAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const MONTHS = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

function formatCurrency(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);
}

export default function AdminCalendarPage() {
  const { token } = useAuth();
  const today = new Date();

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [dates, setDates] = useState<Array<{ date: string; status: DayStatus }>>([]);
  const [unavailableDates, setUnavailableDates] = useState<Array<{ id: string; date: string; reason?: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<{ date: string; status: DayStatus } | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newReason, setNewReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [dayBookings, setDayBookings] = useState<DayBooking[]>([]);
  const [dayLoading, setDayLoading] = useState(false);

  const monthStr = `${year}-${String(month).padStart(2, "0")}`;

  const load = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const [avail, unavail] = await Promise.all([
        availabilityApi.month(monthStr),
        adminApi.unavailableDates(token),
      ]);
      setDates(avail.dates as typeof dates);
      setUnavailableDates(unavail);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [monthStr, token]);

  useEffect(() => { load(); }, [load]);

  const handleDayClick = async (d: { date: string; status: DayStatus }) => {
    setSelectedDate(d);
    setDayBookings([]);
    if (!token) return;
    setDayLoading(true);
    try {
      const res = await availabilityApi.day(d.date);
      setDayBookings(res.bookings);
    } catch {
      setDayBookings([]);
    } finally {
      setDayLoading(false);
    }
  };

  const addUnavailable = async () => {
    if (!token || !newDate) return;
    setActionLoading(true);
    try {
      await adminApi.addUnavailableDate(newDate, newReason || undefined, token);
      setShowAddModal(false);
      setNewDate("");
      setNewReason("");
      load();
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  const removeUnavailable = async (id: string) => {
    if (!token) return;
    try {
      await adminApi.removeUnavailableDate(id, token);
      load();
    } catch (e) {
      console.error(e);
    }
  };

  const prevMonth = () => {
    if (month === 1) { setMonth(12); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 12) { setMonth(1); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  // Build calendar grid
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells = Array(firstDay).fill(null).concat(
    Array.from({ length: daysInMonth }, (_, i) => {
      const d = `${year}-${String(month).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`;
      return dates.find((x) => x.date === d) ?? { date: d, status: "available" as DayStatus };
    }),
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl lg:text-3xl text-[#2C2C2C]">Kalender</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#B76E79] text-white text-sm font-medium hover:bg-[#a35f69] transition"
        >
          <Plus size={16} />
          Blokir Tanggal
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#F7D9D9] overflow-hidden">
          {/* Nav */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#F7D9D9]">
            <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-[#F7D9D9]/50 transition">
              <ChevronLeft size={18} />
            </button>
            <h2 className="font-semibold text-[#2C2C2C]">
              {MONTHS[month - 1]} {year}
            </h2>
            <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-[#F7D9D9]/50 transition">
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-[#F7D9D9]">
            {DAYS.map((d) => (
              <div key={d} className="py-2 text-center text-xs font-medium text-[#2C2C2C]/40">{d}</div>
            ))}
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-7 h-7 border-2 border-[#B76E79] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-7">
              {cells.map((cell, i) => {
                if (!cell) return <div key={`empty-${i}`} className="border-r border-b border-[#F7D9D9]/50 h-16" />;
                const day = parseInt(cell.date.split("-")[2]);
                const isToday = cell.date === today.toISOString().split("T")[0];
                const isSelected = selectedDate?.date === cell.date;

                return (
                  <button
                    key={cell.date}
                    onClick={() => handleDayClick(cell)}
                    className={`relative h-16 border-r border-b border-[#F7D9D9]/50 flex flex-col items-center justify-center gap-1 transition cursor-pointer ${STATUS_COLOR[cell.status as DayStatus]} ${isSelected ? "ring-2 ring-[#B76E79] ring-inset" : ""}`}
                  >
                    <span className={`text-sm font-medium ${isToday ? "w-6 h-6 rounded-full bg-[#B76E79] text-white flex items-center justify-center text-xs" : "text-[#2C2C2C]"}`}>
                      {day}
                    </span>
                    {cell.status !== "available" && STATUS_DOT[cell.status as DayStatus] && (
                      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[cell.status as DayStatus]}`} />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Legend */}
          <div className="flex flex-wrap gap-4 px-6 py-3 border-t border-[#F7D9D9] bg-[#FFF8F2]">
            {[
              { color: "bg-green-500", label: "Disetujui" },
              { color: "bg-yellow-500", label: "Pending" },
              { color: "bg-red-400", label: "Diblokir" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5 text-xs text-[#2C2C2C]/60">
                <span className={`w-2 h-2 rounded-full ${l.color}`} />
                {l.label}
              </div>
            ))}
          </div>
        </div>

        {/* Side panel */}
        <div className="space-y-4">
          {/* Selected day detail */}
          {selectedDate ? (
            <div className="bg-white rounded-2xl border border-[#F7D9D9] overflow-hidden">
              {/* Header */}
              <div className="px-5 py-4 border-b border-[#F7D9D9] bg-[#FFF8F2]">
                <h3 className="font-semibold text-[#2C2C2C]">
                  {new Date(selectedDate.date + "T00:00:00").toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                </h3>
                <p className="text-xs text-[#2C2C2C]/50 mt-0.5">
                  {dayLoading ? "Memuat..." : `${dayBookings.length} booking`}
                </p>
              </div>

              <div className="p-4 space-y-3 max-h-[480px] overflow-y-auto">
                {dayLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 size={20} className="animate-spin text-[#B76E79]" />
                  </div>
                ) : dayBookings.length === 0 ? (
                  <p className="text-sm text-[#2C2C2C]/40 text-center py-4">Tidak ada booking</p>
                ) : (
                  dayBookings.map((b) => (
                    <div key={b.id} className="rounded-xl border border-[#F7D9D9] overflow-hidden">
                      {/* Time & status bar */}
                      <div className="flex items-center gap-2 px-3 py-2 bg-[#FFF8F2] border-b border-[#F7D9D9]">
                        <Clock size={13} className="text-[#B76E79] shrink-0" />
                        <span className="font-semibold text-[#2C2C2C] text-sm">{b.startTime} – {b.endTime}</span>
                        <span className={`ml-auto px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${BOOKING_STATUS_BADGE[b.status]}`}>
                          {BOOKING_STATUS_LABEL[b.status]}
                        </span>
                      </div>

                      {/* Body */}
                      <div className="px-3 py-2.5 space-y-1.5">
                        {/* Service */}
                        {b.serviceName && (
                          <p className="text-sm font-medium text-[#B76E79]">{b.serviceName}</p>
                        )}

                        {/* Customer */}
                        {b.customerName && (
                          <div className="flex items-center gap-1.5 text-xs text-[#2C2C2C]/60">
                            <User size={11} className="shrink-0" />
                            <span>{b.customerName}</span>
                            {b.customerPhone && <span className="text-[#2C2C2C]/40">· {b.customerPhone}</span>}
                          </div>
                        )}

                        {/* Location */}
                        {(b.eventLocation || b.eventAddress) && (
                          <div className="flex items-start gap-1.5 text-xs text-[#2C2C2C]/60">
                            <MapPin size={11} className="shrink-0 mt-0.5" />
                            <span>{[b.eventLocation, b.eventAddress].filter(Boolean).join(", ")}</span>
                          </div>
                        )}

                        {/* Notes */}
                        {b.notes && (
                          <div className="flex items-start gap-1.5 text-xs text-[#2C2C2C]/50 italic">
                            <FileText size={11} className="shrink-0 mt-0.5" />
                            <span>{b.notes}</span>
                          </div>
                        )}

                        {/* Price + link */}
                        <div className="flex items-center justify-between pt-1.5 mt-1 border-t border-[#F7D9D9]">
                          <div className="flex items-center gap-1.5 text-xs text-[#2C2C2C]/50">
                            <Banknote size={11} />
                            <span className="font-semibold text-[#B76E79] text-sm">{formatCurrency(b.agreedPrice)}</span>
                          </div>
                          <Link
                            href={`/admin/bookings/${b.id}`}
                            className="flex items-center gap-1 text-xs text-[#B76E79] hover:underline"
                          >
                            Detail <ExternalLink size={11} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#F7D9D9] p-5">
              <p className="text-sm text-[#2C2C2C]/40">Pilih tanggal untuk melihat detail</p>
            </div>
          )}

          {/* Blocked dates */}
          <div className="bg-white rounded-2xl border border-[#F7D9D9] p-5">
            <h3 className="font-semibold text-[#2C2C2C] mb-3">Tanggal Diblokir</h3>
            {unavailableDates.length === 0 ? (
              <p className="text-sm text-[#2C2C2C]/40">Belum ada tanggal yang diblokir</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {unavailableDates.map((d) => (
                  <div key={d.id} className="flex items-center justify-between p-2 rounded-lg bg-red-50 border border-red-100">
                    <div>
                      <p className="text-sm font-medium text-[#2C2C2C]">
                        {new Date(d.date + "T00:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                      {d.reason && <p className="text-xs text-[#2C2C2C]/50">{d.reason}</p>}
                    </div>
                    <button
                      onClick={() => removeUnavailable(d.id)}
                      className="p-1 rounded hover:bg-red-100 transition"
                    >
                      <Trash2 size={14} className="text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-xl text-[#2C2C2C]">Blokir Tanggal</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded-lg hover:bg-[#F7D9D9]/50">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] mb-1.5">Tanggal</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#F7D9D9] text-sm focus:outline-none focus:border-[#B76E79]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] mb-1.5">Alasan (opsional)</label>
                <input
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  placeholder="cth. Libur nasional"
                  className="w-full px-3 py-2.5 rounded-xl border border-[#F7D9D9] text-sm focus:outline-none focus:border-[#B76E79]"
                />
              </div>
              <button
                onClick={addUnavailable}
                disabled={!newDate || actionLoading}
                className="w-full py-2.5 rounded-xl bg-[#B76E79] text-white text-sm font-medium hover:bg-[#a35f69] transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {actionLoading && <Loader2 size={16} className="animate-spin" />}
                Blokir Tanggal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
