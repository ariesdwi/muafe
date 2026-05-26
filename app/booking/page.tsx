"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, ChevronLeft, Loader2, CheckCircle } from "lucide-react";
import { servicesApi, availabilityApi, bookingsApi, Service, DaySlot, CreateBookingPayload } from "@/lib/api";

type Step = 1 | 2 | 3 | 4;

const STATUS_COLOR_CAL: Record<string, string> = {
  available: "hover:bg-[#F7D9D9]/50 cursor-pointer",
  booked: "bg-red-100 hover:bg-red-200 cursor-pointer",
  pending: "bg-yellow-100 hover:bg-yellow-200 cursor-pointer",
  unavailable: "bg-gray-200 cursor-not-allowed opacity-50",
};

const MONTHS_ID = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const DAYS_ID = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

function formatCurrency(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);
}

export default function BookingPage() {
  const router = useRouter();

  const [step, setStep] = useState<Step>(1);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth() + 1);
  const [calDates, setCalDates] = useState<Array<{ date: string; status: string }>>([]);
  const [selectedDate, setSelectedDate] = useState("");

  const [form, setForm] = useState<Omit<CreateBookingPayload, "serviceId" | "eventDate">>({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    eventStartTime: "07:00",
    eventEndTime: "10:00",
    eventLocation: "",
    eventAddress: "",
    notes: "",
  });

  const [timeSlots, setTimeSlots] = useState<DaySlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<DaySlot | null>(null);
  const [slotsLoading, setSlotsLoading] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Load services
  useEffect(() => {
    servicesApi.list().then(setServices).catch(console.error);
  }, []);

  // Load availability
  useEffect(() => {
    const monthStr = `${calYear}-${String(calMonth).padStart(2, "0")}`;
    setIsLoading(true);
    availabilityApi.month(monthStr)
      .then((r) => setCalDates(r.dates))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [calYear, calMonth]);

  const prevMonth = () => {
    if (calMonth === 1) { setCalMonth(12); setCalYear(y => y - 1); }
    else setCalMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 12) { setCalMonth(1); setCalYear(y => y + 1); }
    else setCalMonth(m => m + 1);
  };

  const firstDay = new Date(calYear, calMonth - 1, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth, 0).getDate();
  const cells = Array(firstDay).fill(null).concat(
    Array.from({ length: daysInMonth }, (_, i) => {
      const d = `${calYear}-${String(calMonth).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`;
      return calDates.find((x) => x.date === d) ?? { date: d, status: "available" };
    }),
  );

  const handleSubmit = async () => {
    if (!selectedService || !selectedDate) return;
    setIsSubmitting(true);
    setSubmitError("");
    try {
      const payload: CreateBookingPayload = {
        ...form,
        serviceId: selectedService.id,
        eventDate: selectedDate,
      };
      const booking = await bookingsApi.create(payload);
      router.push(`/booking/${booking.id}`);
    } catch (e: unknown) {
      setSubmitError(e instanceof Error ? e.message : "Terjadi kesalahan. Coba lagi.");
      setIsSubmitting(false);
    }
  };

  const canNext: Record<Step, boolean> = {
    1: !!selectedService,
    2: !!selectedDate,
    3: !!(form.customerName && form.customerPhone && selectedSlot),
    4: true,
  };

  return (
    <div className="min-h-screen bg-[#FFF8F2] pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl md:text-4xl text-[#2C2C2C]">Booking Makeup</h1>
          <p className="text-[#2C2C2C]/50 mt-2">Lengkapi form berikut untuk memesan layanan</p>
        </div>

        {/* Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {([1, 2, 3, 4] as Step[]).map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition ${step === s ? "bg-[#B76E79] text-white" : step > s ? "bg-[#B76E79]/20 text-[#B76E79]" : "bg-[#F7D9D9] text-[#2C2C2C]/50"}`}>
                {step > s ? <CheckCircle size={16} /> : s}
              </div>
              {s < 4 && <div className={`h-px w-8 ${step > s ? "bg-[#B76E79]/30" : "bg-[#F7D9D9]"}`} />}
            </div>
          ))}
        </div>

        {/* Step labels */}
        <div className="grid grid-cols-4 text-center text-xs text-[#2C2C2C]/40 mb-8">
          {["Pilih Layanan", "Pilih Tanggal", "Data Diri", "Konfirmasi"].map((l, i) => (
            <span key={l} className={step === i + 1 ? "text-[#B76E79] font-medium" : ""}>{l}</span>
          ))}
        </div>

        {/* Step content */}
        <div className="bg-white rounded-2xl border border-[#F7D9D9] p-6 md:p-8">

          {/* Step 1: Choose Service */}
          {step === 1 && (
            <div>
              <h2 className="font-serif text-xl text-[#2C2C2C] mb-5">Pilih Layanan</h2>
              <div className="space-y-3">
                {services.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedService(s)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition ${selectedService?.id === s.id ? "border-[#B76E79] bg-[#FFF8F2]" : "border-[#F7D9D9] hover:border-[#B76E79]/50"}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-[#2C2C2C]">{s.name}</p>
                        {s.description && <p className="text-sm text-[#2C2C2C]/50 mt-0.5 line-clamp-1">{s.description}</p>}
                        {s.durationMinutes && <p className="text-xs text-[#2C2C2C]/40 mt-1">{s.durationMinutes} menit</p>}
                      </div>
                      <p className="font-bold text-[#B76E79] shrink-0 ml-4">{formatCurrency(s.basePrice)}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Choose Date */}
          {step === 2 && (
            <div>
              <h2 className="font-serif text-xl text-[#2C2C2C] mb-5">Pilih Tanggal Event</h2>

              {/* Calendar nav */}
              <div className="flex items-center justify-between mb-4">
                <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-[#F7D9D9]/50 transition"><ChevronLeft size={18} /></button>
                <span className="font-semibold text-[#2C2C2C]">{MONTHS_ID[calMonth - 1]} {calYear}</span>
                <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-[#F7D9D9]/50 transition"><ChevronRight size={18} /></button>
              </div>

              <div className="grid grid-cols-7 mb-2">
                {DAYS_ID.map((d) => (
                  <div key={d} className="py-1 text-center text-xs font-medium text-[#2C2C2C]/40">{d}</div>
                ))}
              </div>

              {isLoading ? (
                <div className="h-48 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-[#B76E79] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-7 gap-1">
                  {cells.map((cell, i) => {
                    if (!cell) return <div key={`e-${i}`} />;
                    const day = parseInt(cell.date.split("-")[2]);
                    const isSelected = selectedDate === cell.date;
                    const canSelect = cell.status !== "unavailable";

                    return (
                      <button
                        key={cell.date}
                        disabled={!canSelect}
                        onClick={() => {
                          if (!canSelect) return;
                          setSelectedDate(cell.date);
                          // Pre-fetch slots for this date so step 3 loads instantly
                          setSlotsLoading(true);
                          setSelectedSlot(null);
                          availabilityApi.day(cell.date)
                            .then((r) => setTimeSlots(r.slots ?? []))
                            .catch(console.error)
                            .finally(() => setSlotsLoading(false));
                        }}
                        className={`h-10 rounded-lg text-sm font-medium border transition ${isSelected ? "bg-[#B76E79] text-white border-[#B76E79]" : `border-transparent ${STATUS_COLOR_CAL[cell.status] ?? ""}`} ${!canSelect ? "text-[#2C2C2C]/30" : "text-[#2C2C2C]"}`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="flex flex-wrap gap-3 mt-4">
                {[{ c: "bg-white border border-[#F7D9D9]", l: "Tersedia" }, { c: "bg-red-100", l: "Ada Booking" }, { c: "bg-yellow-100", l: "Pending" }, { c: "bg-gray-200", l: "Tutup" }].map((x) => (
                  <div key={x.l} className="flex items-center gap-1.5 text-xs text-[#2C2C2C]/50">
                    <span className={`w-3 h-3 rounded ${x.c}`} />
                    {x.l}
                  </div>
                ))}
              </div>

              {selectedDate && (
                <p className="mt-4 text-center text-sm font-medium text-[#B76E79]">
                  Terpilih: {new Date(selectedDate + "T00:00:00").toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                </p>
              )}
            </div>
          )}

          {/* Step 3: Personal Data */}
          {step === 3 && (
            <div>
              <h2 className="font-serif text-xl text-[#2C2C2C] mb-5">Data Diri & Detail</h2>
              <div className="space-y-5">

                {/* Time slot picker */}
                <div>
                  <p className="text-sm font-medium text-[#2C2C2C] mb-2">Pilih Jam Makeup *</p>
                  {slotsLoading ? (
                    <div className="flex items-center gap-2 text-sm text-[#2C2C2C]/40">
                      <Loader2 size={14} className="animate-spin" /> Memuat jadwal...
                    </div>
                  ) : timeSlots.length === 0 ? (
                    <p className="text-sm text-[#2C2C2C]/40">Belum ada jadwal tersedia. Hubungi admin.</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {timeSlots.map((slot) => {
                        const isSelected = selectedSlot?.id === slot.id;
                        const isBooked = slot.status === "booked";
                        const isPending = slot.status === "pending";
                        const canSelect = slot.status === "available";

                        return (
                          <button
                            key={slot.id}
                            type="button"
                            disabled={!canSelect}
                            onClick={() => {
                              if (!canSelect) return;
                              setSelectedSlot(slot);
                              setForm({ ...form, eventStartTime: slot.startTime, eventEndTime: slot.endTime });
                            }}
                            className={`p-3 rounded-xl border-2 text-left transition relative ${
                              isSelected
                                ? "border-[#B76E79] bg-[#FFF0F0]"
                                : isBooked
                                ? "border-red-200 bg-red-50 opacity-60 cursor-not-allowed"
                                : isPending
                                ? "border-yellow-200 bg-yellow-50 opacity-70 cursor-not-allowed"
                                : "border-[#F7D9D9] hover:border-[#B76E79]/50 hover:bg-[#FFF8F2]"
                            }`}
                          >
                            <p className={`text-sm font-semibold ${
                              isSelected ? "text-[#B76E79]" : isBooked ? "text-red-400" : isPending ? "text-yellow-600" : "text-[#2C2C2C]"
                            }`}>
                              {slot.startTime} – {slot.endTime}
                            </p>
                            <p className="text-xs text-[#2C2C2C]/50 mt-0.5">{slot.label}</p>
                            {isBooked && (
                              <span className="absolute top-2 right-2 text-[10px] font-medium text-red-500 bg-red-50 px-1.5 py-0.5 rounded-full">Penuh</span>
                            )}
                            {isPending && (
                              <span className="absolute top-2 right-2 text-[10px] font-medium text-yellow-600 bg-yellow-50 px-1.5 py-0.5 rounded-full">Pending</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <FormField label="Nama Lengkap *" required>
                  <input value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                    placeholder="cth. Siti Rahayu" className="booking-input" />
                </FormField>
                <FormField label="Nomor WhatsApp *" required>
                  <input value={form.customerPhone} onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                    placeholder="cth. 08123456789" type="tel" className="booking-input" />
                </FormField>
                <FormField label="Email (opsional)">
                  <input value={form.customerEmail ?? ""} onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
                    placeholder="email@example.com" type="email" className="booking-input" />
                </FormField>
                <FormField label="Lokasi Event">
                  <input value={form.eventLocation ?? ""} onChange={(e) => setForm({ ...form, eventLocation: e.target.value })}
                    placeholder="cth. Gedung Sasana Budaya" className="booking-input" />
                </FormField>
                <FormField label="Alamat Lengkap">
                  <textarea value={form.eventAddress ?? ""} onChange={(e) => setForm({ ...form, eventAddress: e.target.value })}
                    placeholder="Jl. ..." rows={2} className="booking-input resize-none" />
                </FormField>
                <FormField label="Catatan Tambahan">
                  <textarea value={form.notes ?? ""} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="cth. Referensi makeup, jumlah orang, dll." rows={3} className="booking-input resize-none" />
                </FormField>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <div>
              <h2 className="font-serif text-xl text-[#2C2C2C] mb-5">Konfirmasi Booking</h2>

              {submitError && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{submitError}</div>
              )}

              <div className="space-y-4">
                <SummaryRow label="Layanan" value={selectedService?.name ?? "—"} />
                <SummaryRow label="Tanggal" value={selectedDate ? new Date(selectedDate + "T00:00:00").toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : "—"} />
                <SummaryRow label="Waktu" value={selectedSlot ? `${selectedSlot.startTime} – ${selectedSlot.endTime} (${selectedSlot.label})` : "—"} />
                <SummaryRow label="Klien" value={form.customerName} />
                <SummaryRow label="WhatsApp" value={form.customerPhone} />
                {form.customerEmail && <SummaryRow label="Email" value={form.customerEmail} />}
                {form.eventLocation && <SummaryRow label="Lokasi" value={form.eventLocation} />}
                {form.notes && <SummaryRow label="Catatan" value={form.notes} />}

                <div className="border-t border-[#F7D9D9] pt-4 flex justify-between items-center">
                  <span className="font-medium text-[#2C2C2C]">Estimasi Harga</span>
                  <span className="text-xl font-bold text-[#B76E79]">{formatCurrency(selectedService?.basePrice ?? 0)}</span>
                </div>
              </div>

              <p className="text-xs text-[#2C2C2C]/40 mt-4 text-center">
                Harga final akan dikonfirmasi setelah booking disetujui. Anda akan dihubungi via WhatsApp.
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button
                onClick={() => setStep((s) => (s - 1) as Step)}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-[#F7D9D9] text-sm font-medium text-[#2C2C2C] hover:bg-[#FFF8F2] transition"
              >
                <ChevronLeft size={16} />
                Kembali
              </button>
            )}
            <button
              onClick={() => {
                if (step === 4) handleSubmit();
                else setStep((s) => (s + 1) as Step);
              }}
              disabled={!canNext[step] || isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#B76E79] text-white text-sm font-medium hover:bg-[#a35f69] transition disabled:opacity-50"
            >
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              {step === 4 ? (isSubmitting ? "Memproses..." : "Kirim Booking") : (
                <>Lanjut <ChevronRight size={16} /></>
              )}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .booking-input {
          width: 100%;
          padding: 10px 14px;
          border-radius: 12px;
          border: 1px solid #F7D9D9;
          background: #FFF8F2;
          font-size: 14px;
          outline: none;
          color: #2C2C2C;
          transition: border-color 0.15s;
        }
        .booking-input:focus { border-color: #B76E79; }
      `}</style>
    </div>
  );
}

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#2C2C2C] mb-1.5">
        {label} {required && <span className="text-[#B76E79]">*</span>}
      </label>
      {children}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-2 border-b border-[#F7D9D9]/50">
      <span className="text-sm text-[#2C2C2C]/50 shrink-0">{label}</span>
      <span className="text-sm text-[#2C2C2C] text-right">{value}</span>
    </div>
  );
}
