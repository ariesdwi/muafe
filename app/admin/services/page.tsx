"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, ToggleLeft, ToggleRight, X, Loader2, Scissors } from "lucide-react";
import { servicesApi, Service } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

function formatCurrency(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);
}

const EMPTY: Partial<Service> = {
  name: "", description: "", basePrice: 0, durationMinutes: undefined, imageUrl: "",
};

export default function AdminServicesPage() {
  const { token } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState<Partial<Service>>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    setIsLoading(true);
    servicesApi.list()
      .then(setServices)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setError(""); setShowModal(true); };
  const openEdit = (s: Service) => { setEditing(s); setForm(s); setError(""); setShowModal(true); };

  const save = async () => {
    if (!token || !form.name) return;
    setSaving(true);
    setError("");
    try {
      if (editing) {
        await servicesApi.update(editing.id, form, token);
      } else {
        await servicesApi.create(form, token);
      }
      setShowModal(false);
      load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  const toggle = async (s: Service) => {
    if (!token) return;
    try {
      await servicesApi.update(s.id, { status: s.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" }, token);
      load();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl lg:text-3xl text-[#2C2C2C]">Layanan</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#B76E79] text-white text-sm font-medium hover:bg-[#a35f69] transition"
        >
          <Plus size={16} />
          Tambah Layanan
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-7 h-7 border-2 border-[#B76E79] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !services.length ? (
        <div className="bg-white rounded-2xl border border-[#F7D9D9] py-16 text-center">
          <Scissors size={40} className="mx-auto text-[#F7D9D9] mb-3" />
          <p className="text-[#2C2C2C]/40">Belum ada layanan. Tambahkan yang pertama!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {services.map((s) => (
            <div key={s.id} className={`bg-white rounded-2xl border p-5 flex items-center gap-4 transition ${s.status === "INACTIVE" ? "border-gray-200 opacity-60" : "border-[#F7D9D9]"}`}>
              {s.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={s.imageUrl} alt={s.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-[#2C2C2C]">{s.name}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${s.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {s.status === "ACTIVE" ? "Aktif" : "Nonaktif"}
                  </span>
                </div>
                {s.description && <p className="text-sm text-[#2C2C2C]/50 mt-0.5 line-clamp-1">{s.description}</p>}
                <p className="text-sm font-medium text-[#B76E79] mt-1">{formatCurrency(s.basePrice)}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => toggle(s)} className="p-2 rounded-lg hover:bg-[#F7D9D9]/50 transition text-[#2C2C2C]/50">
                  {s.status === "ACTIVE" ? <ToggleRight size={20} className="text-green-600" /> : <ToggleLeft size={20} />}
                </button>
                <button onClick={() => openEdit(s)} className="p-2 rounded-lg hover:bg-[#F7D9D9]/50 transition text-[#2C2C2C]/50">
                  <Pencil size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-serif text-xl text-[#2C2C2C]">{editing ? "Edit Layanan" : "Tambah Layanan"}</h3>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-[#F7D9D9]/50">
                <X size={18} />
              </button>
            </div>

            {error && <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-200">{error}</div>}

            <div className="space-y-4">
              <Field label="Nama Layanan *">
                <input value={form.name ?? ""} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-field" placeholder="cth. Wedding Makeup" />
              </Field>
              <Field label="Deskripsi">
                <textarea value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3} className="input-field resize-none" placeholder="Deskripsi singkat layanan..." />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Harga Dasar (Rp)">
                  <input type="number" min="0" value={form.basePrice ?? 0}
                    onChange={(e) => setForm({ ...form, basePrice: parseInt(e.target.value) || 0 })}
                    className="input-field" />
                </Field>
                <Field label="Durasi (menit)">
                  <input type="number" min="0" value={form.durationMinutes ?? ""}
                    onChange={(e) => setForm({ ...form, durationMinutes: parseInt(e.target.value) || undefined })}
                    className="input-field" placeholder="cth. 120" />
                </Field>
              </div>
              <Field label="URL Foto">
                <input value={form.imageUrl ?? ""} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  className="input-field" placeholder="https://images.unsplash.com/..." />
              </Field>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl border border-[#F7D9D9] text-sm hover:bg-[#FFF8F2] transition">Batal</button>
              <button
                onClick={save}
                disabled={!form.name || saving}
                className="flex-1 py-2.5 rounded-xl bg-[#B76E79] text-white text-sm font-medium hover:bg-[#a35f69] transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving && <Loader2 size={16} className="animate-spin" />}
                {editing ? "Simpan Perubahan" : "Tambah Layanan"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .input-field {
          width: 100%;
          padding: 10px 12px;
          border-radius: 12px;
          border: 1px solid #F7D9D9;
          font-size: 14px;
          outline: none;
          transition: border-color 0.15s;
          background: #FFF8F2;
          color: #2C2C2C;
        }
        .input-field:focus { border-color: #B76E79; }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#2C2C2C] mb-1.5">{label}</label>
      {children}
    </div>
  );
}
