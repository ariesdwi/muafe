"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Trash2, X, Loader2, Clock, ToggleLeft, ToggleRight } from "lucide-react";
import { timeSlotsApi, TimeSlot } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function AdminTimeSlotsPage() {
  const { token } = useAuth();
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ label: "", startTime: "07:00", endTime: "10:00", sortOrder: 0 });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const data = await timeSlotsApi.list();
      setSlots(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const handleToggle = async (id: string) => {
    if (!token) return;
    setActionId(id);
    try {
      const updated = await timeSlotsApi.toggle(id, token);
      setSlots((prev) => prev.map((s) => (s.id === id ? updated : s)));
    } catch (e) {
      console.error(e);
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token || !confirm("Hapus time slot ini?")) return;
    setActionId(id);
    try {
      await timeSlotsApi.remove(id, token);
      setSlots((prev) => prev.filter((s) => s.id !== id));
    } catch (e) {
      console.error(e);
    } finally {
      setActionId(null);
    }
  };

  const handleCreate = async () => {
    if (!token || !form.label || !form.startTime || !form.endTime) return;
    setSaving(true);
    setError("");
    try {
      await timeSlotsApi.create({ ...form, isActive: true }, token);
      setShowModal(false);
      setForm({ label: "", startTime: "07:00", endTime: "10:00", sortOrder: 0 });
      load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  const activeCount = slots.filter((s) => s.isActive).length;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl lg:text-3xl text-[#2C2C2C]">Jam Tersedia</h1>
          <p className="text-sm text-[#2C2C2C]/50 mt-1">{activeCount} dari {slots.length} slot aktif</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#B76E79] text-white text-sm font-medium hover:bg-[#a35f69] transition"
        >
          <Plus size={16} />
          Tambah Slot
        </button>
      </div>

      {/* Info banner */}
      <div className="mb-6 p-4 rounded-2xl bg-[#FFF8F2] border border-[#F7D9D9]">
        <p className="text-sm text-[#2C2C2C]/60">
          <span className="font-medium text-[#B76E79]">Slot aktif</span> akan ditampilkan sebagai pilihan waktu saat customer booking.
          Matikan slot yang tidak tersedia tanpa harus menghapusnya.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-7 h-7 border-2 border-[#B76E79] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : slots.length === 0 ? (
        <div className="text-center py-16 text-[#2C2C2C]/40 text-sm">
          Belum ada time slot. Tambahkan slot pertama.
        </div>
      ) : (
        <div className="space-y-3">
          {slots.map((slot) => (
            <div
              key={slot.id}
              className={`flex items-center gap-4 p-4 rounded-2xl border transition ${
                slot.isActive
                  ? "bg-white border-[#F7D9D9]"
                  : "bg-[#FAFAFA] border-gray-200 opacity-60"
              }`}
            >
              {/* Icon */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${slot.isActive ? "bg-[#F7D9D9]" : "bg-gray-100"}`}>
                <Clock size={16} className={slot.isActive ? "text-[#B76E79]" : "text-gray-400"} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-sm ${slot.isActive ? "text-[#2C2C2C]" : "text-gray-400"}`}>
                  {slot.startTime} – {slot.endTime}
                </p>
                <p className="text-xs text-[#2C2C2C]/50 truncate">{slot.label}</p>
              </div>

              {/* Status badge */}
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${
                slot.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
              }`}>
                {slot.isActive ? "Aktif" : "Nonaktif"}
              </span>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleToggle(slot.id)}
                  disabled={actionId === slot.id}
                  title={slot.isActive ? "Nonaktifkan" : "Aktifkan"}
                  className="p-2 rounded-lg hover:bg-[#F7D9D9]/50 transition disabled:opacity-50"
                >
                  {actionId === slot.id ? (
                    <Loader2 size={18} className="animate-spin text-[#B76E79]" />
                  ) : slot.isActive ? (
                    <ToggleRight size={20} className="text-[#B76E79]" />
                  ) : (
                    <ToggleLeft size={20} className="text-gray-400" />
                  )}
                </button>
                <button
                  onClick={() => handleDelete(slot.id)}
                  disabled={actionId === slot.id}
                  title="Hapus"
                  className="p-2 rounded-lg hover:bg-red-50 transition disabled:opacity-50"
                >
                  <Trash2 size={15} className="text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-xl text-[#2C2C2C]">Tambah Slot Waktu</h3>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-[#F7D9D9]/50">
                <X size={18} />
              </button>
            </div>

            {error && (
              <div className="mb-3 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] mb-1.5">Label</label>
                <input
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                  placeholder="cth. Pagi (07:00 – 10:00)"
                  className="w-full px-3 py-2.5 rounded-xl border border-[#F7D9D9] text-sm focus:outline-none focus:border-[#B76E79]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-[#2C2C2C] mb-1.5">Jam Mulai</label>
                  <input
                    type="time"
                    value={form.startTime}
                    onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#F7D9D9] text-sm focus:outline-none focus:border-[#B76E79]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2C2C2C] mb-1.5">Jam Selesai</label>
                  <input
                    type="time"
                    value={form.endTime}
                    onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#F7D9D9] text-sm focus:outline-none focus:border-[#B76E79]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] mb-1.5">Urutan (opsional)</label>
                <input
                  type="number"
                  min={0}
                  value={form.sortOrder}
                  onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#F7D9D9] text-sm focus:outline-none focus:border-[#B76E79]"
                />
              </div>
              <button
                onClick={handleCreate}
                disabled={!form.label || saving}
                className="w-full py-2.5 rounded-xl bg-[#B76E79] text-white text-sm font-medium hover:bg-[#a35f69] transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving && <Loader2 size={16} className="animate-spin" />}
                Simpan Slot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
