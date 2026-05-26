const WHATSAPP_NUMBER = "628xxxxxxxxxx";

const BOOKING_TEMPLATE = `Halo Kak, saya ingin booking makeup.

Nama:
Tanggal acara:
Jenis acara:
Lokasi:
Jumlah orang:
Referensi makeup:`;

export function getWhatsAppLink(message?: string): string {
  const text = message || BOOKING_TEMPLATE;
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`;
}

export function getServiceWhatsAppLink(serviceName: string): string {
  const message = `Halo Kak, saya ingin tanya tentang paket ${serviceName}.

Nama:
Tanggal acara:
Lokasi:
Jumlah orang:`;
  return getWhatsAppLink(message);
}
