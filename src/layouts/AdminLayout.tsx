import { useState } from 'react';
import { motion } from 'framer-motion';
import { QrCode, Coffee, BarChart2, ClipboardList, Menu, X } from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const NAV = [
  { to: '/admin', icon: BarChart2, label: 'Dashboard', exact: true },
  { to: '/admin/orders', icon: ClipboardList, label: 'Ordini' },
  { to: '/admin/drinks', icon: Coffee, label: 'Bibite' },
  { to: '/admin/qr', icon: QrCode, label: 'QR Codes' },
];

export function AdminLayout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar desktop */}
      <aside className="hidden md:flex flex-col w-60 border-r border-white/8 p-4">
        <div className="flex items-center gap-2.5 px-2 py-3 mb-6">
          <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
            <QrCode size={16} className="text-white" />
          </div>
          <span className="font-bold text-white">DrinkQR</span>
          <span className="text-xs text-white/30 ml-auto">Admin</span>
        </div>
        <nav className="space-y-1">
          {NAV.map(({ to, icon: Icon, label, exact }) => {
            const active = exact ? pathname === to : pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                  active
                    ? 'bg-white/10 text-white'
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                )}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-3 border-b border-white/8 bg-black/90 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <QrCode size={18} className="text-white" />
          <span className="font-bold text-white text-sm">DrinkQR Admin</span>
        </div>
        <button onClick={() => setOpen(!open)} className="text-white/60">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          className="md:hidden fixed inset-0 z-10 bg-black pt-16 p-4"
        >
          <nav className="space-y-1">
            {NAV.map(({ to, icon: Icon, label, exact }) => {
              const active = exact ? pathname === to : pathname.startsWith(to);
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors',
                    active
                      ? 'bg-white/10 text-white'
                      : 'text-white/40 hover:text-white hover:bg-white/5'
                  )}
                >
                  <Icon size={20} />
                  {label}
                </Link>
              );
            })}
          </nav>
        </motion.div>
      )}

      {/* Content */}
      <main className="flex-1 min-w-0 pt-16 md:pt-0">
        <Outlet />
      </main>
    </div>
  );
}
