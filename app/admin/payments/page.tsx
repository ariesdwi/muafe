"use client";

import { useEffect, useState } from "react";
import { Eye, CheckCircle, XCircle, Loader2, ExternalLink } from "lucide-react";
import { adminApi, PaymentProof } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

const STATUS_COLOR: Record<string, string> = {
  PENDING: "bg-gray-100 text-gray-600",
  WAITING_APPROVAL: "bg-blue-100 text-blue-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Pending",
  WAITING_APPROVAL: "Menunggu Review",
  APPROVED: "Disetujui",
  REJECTED: "Ditolak",
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function AdminPaymentsPage() {
  const { token } = useAuth();
  const [proofs, setProofs] = useState<PaymentProof[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [error, setError] = useState("");
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const load = () => {
    if (!token) return;
    setIsLoading(true);
    adminApi.paymentProofs(token)
      .then(setProofs)
      .catch((e) => setError(e.message))
      .finally(() => setIsLoading(false));
  };

  useEffect(load, [token]);

  const approve = async (id: string) => {
    if (!token) return;
    setActionLoading(id);
    try {
      await adminApi.approvePayment(id, token);
      load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setActionLoading("");
    }
  };

  const reject = async (id: string) => {
    if (!token || !rejectReason.trim()) return;
    setActionLoading(id);
    try {
      await adminApi.rejectPayment(id, rejectReason, token);
      setShowRejectModal(null);
      setRejectReason("");
      load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setActionLoading("");
    }
  };

  const pending = proofs.filter((p) => p.status === "WAITING_APPROVAL");
  const rest = proofs.filter((p) => p.status !== "WAITING_APPROVAL");

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl lg:text-3xl text-[#2C2C2C]">Bukti Pembayaran</h1>
        {pending.length > 0 && (
          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
            {pending.length} menunggu review
          </span>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-7 h-7 border-2 border-[#B76E79] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !proofs.length ? (
        <div className="bg-white rounded-2xl border border-[#F7D9D9] py-16 text-center text-[#2C2C2C]/40">
          Belum ada bukti pembayaran
        </div>
      ) : (
        <div className="space-y-6">
          {pending.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-blue-700 mb-3">Menunggu Review</h2>
              <div className="space-y-3">
                {pending.map((p) => <ProofCard key={p.id} proof={p} onApprove={approve} onReject={(id) => setShowRejectModal(id)} actionLoading={actionLoading} />)}
              </div>
            </section>
          )}
          {rest.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-[#2C2C2C]/50 mb-3">Riwayat</h2>
              <div className="space-y-3">
                {rest.map((p) => <ProofCard key={p.id} proof={p} onApprove={approve} onReject={(id) => setShowRejectModal(id)} actionLoading={actionLoading} />)}
              </div>
            </section>
          )}
        </div>
      )}

      {showRejectModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <h3 className="font-serif text-xl text-[#2C2C2C] mb-4">Tolak Pembayaran</h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Alasan penolakan..."
              rows={3}
              className="w-full px-3 py-2 text-sm rounded-lg border border-[#F7D9D9] focus:outline-none focus:border-red-400 resize-none mb-4"
            />
            <div className="flex gap-3">
              <button onClick={() => { setShowRejectModal(null); setRejectReason(""); }} className="flex-1 py-2.5 rounded-xl border border-[#F7D9D9] text-sm hover:bg-[#FFF8F2] transition">Batal</button>
              <button
                onClick={() => reject(showRejectModal)}
                disabled={!rejectReason.trim() || !!actionLoading}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition disabled:opacity-50"
              >
                {actionLoading === showRejectModal ? <Loader2 size={16} className="animate-spin mx-auto" /> : "Tolak"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProofCard({ proof, onApprove, onReject, actionLoading }: {
  proof: PaymentProof;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  actionLoading: string;
}) {
  const isLoadingThis = actionLoading === proof.id;
  const canAct = proof.status === "WAITING_APPROVAL";

  return (
    <div className="bg-white rounded-2xl border border-[#F7D9D9] p-5">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${STATUS_COLOR[proof.status] ?? "bg-gray-100 text-gray-600"}`}>
              {STATUS_LABEL[proof.status] ?? proof.status}
            </span>
          </div>
          <p className="font-medium text-[#2C2C2C] truncate">
            {proof.booking?.customer?.name ?? "—"} — {proof.booking?.service?.name ?? "—"}
          </p>
          <p className="text-sm text-[#2C2C2C]/50">
            {proof.booking?.eventDate
              ? new Date(proof.booking.eventDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
              : "—"}
          </p>
          <p className="text-xs text-[#2C2C2C]/40 mt-1">Upload: {formatDate(proof.uploadedAt)}</p>
          {proof.fileName && <p className="text-xs text-[#2C2C2C]/50">{proof.fileName}</p>}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href={proof.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#F7D9D9] text-sm text-[#B76E79] hover:bg-[#FFF8F2] transition"
          >
            <Eye size={14} />
            Lihat
          </a>

          {canAct && (
            <>
              <button
                onClick={() => onApprove(proof.id)}
                disabled={!!actionLoading}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition disabled:opacity-50"
              >
                {isLoadingThis ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                Setujui
              </button>
              <button
                onClick={() => onReject(proof.id)}
                disabled={!!actionLoading}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 text-red-600 border border-red-200 text-sm hover:bg-red-100 transition disabled:opacity-50"
              >
                <XCircle size={14} />
                Tolak
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
