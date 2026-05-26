"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  BookOpen,
  CreditCard,
  Scissors,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Clock,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/bookings", label: "Booking", icon: BookOpen },
  { href: "/admin/payments", label: "Pembayaran", icon: CreditCard },
  { href: "/admin/calendar", label: "Kalender", icon: CalendarDays },
  { href: "/admin/services", label: "Layanan", icon: Scissors },
  { href: "/admin/time-slots", label: "Jam Tersedia", icon: Clock },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user && pathname !== "/admin/login") {
      router.replace("/admin/login");
    }
  }, [isLoading, user, pathname, router]);

  if (pathname === "/admin/login") return <>{children}</>;

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#FFF8F2] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#B76E79] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isActive = (item: (typeof navItems)[0]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <div className="min-h-screen bg-[#FAF5F0] flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-[#F7D9D9] flex flex-col transform transition-transform lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="p-6 border-b border-[#F7D9D9]">
          <Link href="/admin" className="font-serif text-xl text-[#2C2C2C]">
            MUA<span className="text-[#B76E79]">.</span>Studio
          </Link>
          <p className="text-xs text-[#B76E79] mt-0.5 tracking-widest uppercase">Admin Panel</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-[#B76E79] text-white shadow-sm"
                    : "text-[#2C2C2C]/70 hover:bg-[#F7D9D9]/50 hover:text-[#B76E79]"
                }`}
              >
                <item.icon size={18} />
                {item.label}
                {active && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div className="p-4 border-t border-[#F7D9D9]">
          <div className="flex items-center gap-3 mb-3 px-3">
            <div className="w-8 h-8 rounded-full bg-[#B76E79] flex items-center justify-center text-white text-xs font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-[#2C2C2C] truncate">{user.name}</p>
              <p className="text-xs text-[#2C2C2C]/50 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              router.push("/admin/login");
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 transition"
          >
            <LogOut size={16} />
            Keluar
          </button>
          <Link
            href="/"
            target="_blank"
            className="mt-1 w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-[#2C2C2C]/50 hover:bg-[#F7D9D9]/50 transition"
          >
            ← Lihat Website
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar (mobile) */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-[#F7D9D9]">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-[#F7D9D9]/50 transition"
          >
            <Menu size={20} className="text-[#2C2C2C]" />
          </button>
          <span className="font-serif text-lg text-[#2C2C2C]">
            MUA<span className="text-[#B76E79]">.</span>Studio
          </span>
          <div className="w-9" />
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
