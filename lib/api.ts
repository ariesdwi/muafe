const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN';
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  description?: string;
  basePrice: number;
  durationMinutes?: number;
  imageUrl?: string;
  sortOrder: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Booking {
  id: string;
  customerId?: string;
  customer?: { name: string; phone: string; email?: string };
  service: { name: string; slug?: string };
  serviceId: string;
  eventDate: string;
  eventStartTime: string;
  eventEndTime: string;
  eventLocation?: string;
  eventAddress?: string;
  notes?: string;
  agreedPrice: number;
  status: BookingStatus;
  paymentProofs?: PaymentProof[];
  createdAt: string;
}

export type BookingStatus =
  | 'DRAFT'
  | 'PENDING_PAYMENT'
  | 'WAITING_APPROVAL'
  | 'APPROVED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'COMPLETED';

export interface PaymentProof {
  id: string;
  bookingId: string;
  booking?: {
    id: string;
    customer?: { name: string; phone: string };
    service?: { name: string };
    eventDate: string;
  };
  fileUrl: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  notes?: string;
  status: 'PENDING' | 'WAITING_APPROVAL' | 'APPROVED' | 'REJECTED';
  uploadedAt: string;
}

export interface DashboardSummary {
  totalBookings: number;
  waitingApproval: number;
  pendingPayment: number;
  approvedThisMonth: number;
  completedThisMonth: number;
  upcomingBookings: Booking[];
}

export interface AvailabilityResponse {
  month: string;
  dates: Array<{ date: string; status: 'available' | 'booked' | 'pending' | 'unavailable' }>;
}

export interface DayBooking {
  id: string;
  startTime: string;
  endTime: string;
  eventLocation: string | null;
  eventAddress: string | null;
  notes: string | null;
  agreedPrice: number;
  status: BookingStatus;
  customerName: string | null;
  customerPhone: string | null;
  serviceName: string | null;
}

export interface DaySlot {
  id: string;
  label: string;
  startTime: string;
  endTime: string;
  sortOrder: number;
  status: 'available' | 'pending' | 'booked';
  bookingId: string | null;
}

export interface DayAvailabilityResponse {
  date: string;
  isUnavailable: boolean;
  slots: DaySlot[];
  bookings: DayBooking[];
}

export interface CreateBookingPayload {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  serviceId: string;
  eventDate: string;
  eventStartTime: string;
  eventEndTime: string;
  eventLocation?: string;
  eventAddress?: string;
  notes?: string;
}

// ─── API Client ──────────────────────────────────────────────────────────────

type FetchOptions = {
  method?: string;
  body?: unknown;
  token?: string;
};

async function apiFetch<T>(path: string, opts: FetchOptions = {}): Promise<T> {
  const { method = 'GET', body, token } = opts;

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message ?? `HTTP ${res.status}`);
  return data as T;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export const authApi = {
  login: (email: string, password: string) =>
    apiFetch<{ accessToken: string; user: User }>('/auth/login', {
      method: 'POST',
      body: { email, password },
    }),
  me: (token: string) => apiFetch<User>('/auth/me', { token }),
};

// ─── Services ────────────────────────────────────────────────────────────────

export const servicesApi = {
  list: () => apiFetch<Service[]>('/services'),
  get: (slug: string) => apiFetch<Service>(`/services/${slug}`),
  create: (data: Partial<Service>, token: string) =>
    apiFetch<Service>('/services', { method: 'POST', body: data, token }),
  update: (id: string, data: Partial<Service>, token: string) =>
    apiFetch<Service>(`/services/${id}`, { method: 'PATCH', body: data, token }),
  remove: (id: string, token: string) =>
    apiFetch<Service>(`/services/${id}`, { method: 'DELETE', token }),
};

// ─── Availability ────────────────────────────────────────────────────────────

export const availabilityApi = {
  month: (month: string) =>
    apiFetch<AvailabilityResponse>(`/availability?month=${month}`),
  day: (date: string) =>
    apiFetch<DayAvailabilityResponse>(`/availability/day?date=${date}`),
};

// ─── Bookings ────────────────────────────────────────────────────────────────

export const bookingsApi = {
  create: (data: CreateBookingPayload) =>
    apiFetch<Booking>('/bookings', { method: 'POST', body: data }),
  get: (id: string) => apiFetch<Booking>(`/bookings/${id}`),
  uploadPaymentProof: async (bookingId: string, file: File, notes?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    if (notes) formData.append('notes', notes);

    const res = await fetch(`${API_BASE}/bookings/${bookingId}/payment-proof`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.message ?? `HTTP ${res.status}`);
    return data as PaymentProof;
  },
  downloadIcs: (id: string) => `${API_BASE}/bookings/${id}/calendar.ics`,
};

// ─── Admin ───────────────────────────────────────────────────────────────────

export const adminApi = {
  dashboard: (token: string) =>
    apiFetch<DashboardSummary>('/admin/dashboard/summary', { token }),

  bookings: (token: string) =>
    apiFetch<Booking[]>('/admin/bookings', { token }),
  booking: (id: string, token: string) =>
    apiFetch<Booking>(`/admin/bookings/${id}`, { token }),
  approveBooking: (id: string, token: string, adminNote?: string) =>
    apiFetch<Booking>(`/admin/bookings/${id}/approve`, {
      method: 'PATCH',
      body: { adminNote },
      token,
    }),
  rejectBooking: (id: string, reason: string, token: string) =>
    apiFetch<Booking>(`/admin/bookings/${id}/reject`, {
      method: 'PATCH',
      body: { reason },
      token,
    }),
  cancelBooking: (id: string, token: string) =>
    apiFetch<Booking>(`/admin/bookings/${id}/cancel`, { method: 'PATCH', token }),
  completeBooking: (id: string, token: string) =>
    apiFetch<Booking>(`/admin/bookings/${id}/complete`, { method: 'PATCH', token }),

  paymentProofs: (token: string) =>
    apiFetch<PaymentProof[]>('/admin/payment-proofs', { token }),
  approvePayment: (id: string, token: string) =>
    apiFetch<PaymentProof>(`/admin/payment-proofs/${id}/approve`, { method: 'PATCH', token }),
  rejectPayment: (id: string, reason: string, token: string) =>
    apiFetch<PaymentProof>(`/admin/payment-proofs/${id}/reject`, {
      method: 'PATCH',
      body: { reason },
      token,
    }),

  unavailableDates: (token: string) =>
    apiFetch<Array<{ id: string; date: string; reason?: string }>>(
      '/admin/unavailable-dates',
      { token },
    ),
  addUnavailableDate: (date: string, reason: string | undefined, token: string) =>
    apiFetch('/admin/unavailable-dates', {
      method: 'POST',
      body: { date, reason },
      token,
    }),
  removeUnavailableDate: (id: string, token: string) =>
    apiFetch(`/admin/unavailable-dates/${id}`, { method: 'DELETE', token }),
};

// ─── Time Slots ──────────────────────────────────────────────────────────────

export interface TimeSlot {
  id: string;
  label: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
  sortOrder: number;
}

export const timeSlotsApi = {
  list: (onlyActive = false) =>
    apiFetch<TimeSlot[]>(`/time-slots${onlyActive ? '?active=true' : ''}`),
  create: (data: Omit<TimeSlot, 'id' | 'sortOrder'> & { sortOrder?: number }, token: string) =>
    apiFetch<TimeSlot>('/time-slots', { method: 'POST', body: data, token }),
  toggle: (id: string, token: string) =>
    apiFetch<TimeSlot>(`/time-slots/${id}/toggle`, { method: 'PATCH', token }),
  update: (id: string, data: Partial<Omit<TimeSlot, 'id'>>, token: string) =>
    apiFetch<TimeSlot>(`/time-slots/${id}`, { method: 'PATCH', body: data, token }),
  remove: (id: string, token: string) =>
    apiFetch<TimeSlot>(`/time-slots/${id}`, { method: 'DELETE', token }),
};
