import { motion } from 'framer-motion';
import { QrCode, Coffee, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAdminData } from '@/hooks/useAdminData';
import { Skeleton } from '@/components/ui/Skeleton';

function StatCard({
  icon: Icon,
  label,
  value,
  loading,
  to,
}: {
  icon: typeof QrCode;
  label: string;
  value: number;
  loading: boolean;
  to: string;
}) {
  return (
    <Link to={to}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="p-5 rounded-2xl bg-white/5 border border-white/8 hover:bg-white/8 transition-colors"
      >
        <div className="flex items-start justify-between">
          <div className="p-2 rounded-xl bg-white/10">
            <Icon size={20} className="text-white/70" />
          </div>
          <TrendingUp size={14} className="text-white/20" />
        </div>
        <div className="mt-4">
          {loading ? (
            <Skeleton className="h-8 w-16 mb-1" />
          ) : (
            <p className="text-3xl font-bold text-white">{value}</p>
          )}
          <p className="text-sm text-white/40 mt-1">{label}</p>
        </div>
      </motion.div>
    </Link>
  );
}

export function AdminDashboard() {
  const { drinks, qrCodes, loading } = useAdminData();
  const activeDrinks = drinks.filter((d) => d.available).length;
  const activeQr = qrCodes.filter((q) => q.active).length;

  return (
    <div className="p-6 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-white/40 text-sm mt-1">Benvenuto nel pannello di controllo</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 mt-8">
        <StatCard
          icon={QrCode}
          label="QR Codes totali"
          value={qrCodes.length}
          loading={loading}
          to="/admin/qr"
        />
        <StatCard
          icon={QrCode}
          label="QR attivi"
          value={activeQr}
          loading={loading}
          to="/admin/qr"
        />
        <StatCard
          icon={Coffee}
          label="Bibite totali"
          value={drinks.length}
          loading={loading}
          to="/admin/drinks"
        />
        <StatCard
          icon={Coffee}
          label="Disponibili"
          value={activeDrinks}
          loading={loading}
          to="/admin/drinks"
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8 p-4 rounded-2xl bg-white/5 border border-white/8"
      >
        <p className="text-sm text-white/50">
          💡 <span className="text-white/70 font-medium">Quick start:</span> Aggiungi le tue bibite,
          poi crea i QR code per ogni tavolo. I clienti scansionano e vedono il menu.
        </p>
      </motion.div>
    </div>
  );
}
