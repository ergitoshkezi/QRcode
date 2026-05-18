import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { useQrValidator } from '@/hooks/useQrValidator';
import { useMenu } from '@/hooks/useMenu';
import { useCart } from '@/hooks/useCart';
import { useCustomerOrders } from '@/hooks/useCustomerOrders';
import { CategorySection, MenuSkeleton } from '@/components/menu/CategorySection';
import { CartPanel } from '@/components/menu/CartPanel';
import { Skeleton } from '@/components/ui/Skeleton';
import type { Drink } from '@/types';

import { CustomerOrdersPanel } from '@/components/menu/CustomerOrdersPanel';

function InvalidQr() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-4 max-w-xs"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 mb-2">
          <AlertCircle size={28} className="text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-white">{t('menu.invalidQr.title')}</h2>
        <p className="text-white/40 text-sm leading-relaxed">
          {t('menu.invalidQr.description')}
        </p>
      </motion.div>
    </div>
  );
}

function MenuHeader({ tableName, qrCode }: { tableName: string; qrCode: string }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-10 backdrop-blur-xl bg-black/80 border-b border-white/8 px-5 py-4 flex items-center justify-between"
    >
      <div className="flex items-center gap-2">
        <MapPin size={16} className="text-white/40" />
        <div>
          <p className="text-base font-semibold text-white leading-tight">{tableName}</p>
          <p className="text-xs text-white/30">{qrCode}</p>
        </div>
      </div>
      <LanguageSwitcher />
    </motion.header>
  );
}

export function MenuPage() {
  const { t } = useTranslation();
  const { qrId } = useParams<{ qrId: string }>();
  const { qr, loading: qrLoading, invalid } = useQrValidator(qrId);
  const { byCategory, categories, loading: menuLoading } = useMenu();
  const { items, add, remove, clear, total, count } = useCart();
  const { orders, loading: ordersLoading, refetch: refetchOrders } = useCustomerOrders(qr?.qr_code);

  const cartMap = items.reduce<Record<string, number>>(
    (acc, i) => ({ ...acc, [i.drink.id]: i.quantity }),
    {}
  );

  const handleAdd = (drink: Drink) => add(drink);

  if (qrLoading) {
    return (
      <div className="min-h-screen bg-black p-5">
        <Skeleton className="h-16 mb-6" />
        <MenuSkeleton />
      </div>
    );
  }

  if (invalid) return <InvalidQr />;

  return (
    <div className="min-h-screen bg-black">
      {qr && <MenuHeader tableName={qr.table_name} qrCode={qr.qr_code} />}

      <main className="px-4 py-6 pb-32 max-w-lg mx-auto">
        {qr && (
          <CustomerOrdersPanel
            qrCode={qr.qr_code}
            orders={orders}
            loading={ordersLoading}
            refetch={refetchOrders}
          />
        )}

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
          <h1 className="text-2xl font-bold text-white">{t('menu.title')}</h1>
          <p className="text-white/40 text-sm mt-1">{t('menu.subtitle')}</p>
        </motion.div>

        {menuLoading ? (
          <MenuSkeleton />
        ) : categories.length === 0 ? (
          <div className="text-center py-16 text-white/30">
            <p className="text-3xl mb-3">🍽️</p>
            <p>{t('menu.empty')}</p>
          </div>
        ) : (
          categories.map((cat) => (
            <CategorySection
              key={cat}
              category={cat}
              drinks={byCategory[cat]}
              onAdd={handleAdd}
              cartMap={cartMap}
            />
          ))
        )}
      </main>

      {qr && (
        <CartPanel
          qrCode={qr.qr_code}
          items={items}
          total={total}
          count={count}
          onAdd={(drinkId) => {
            const item = items.find((i) => i.drink.id === drinkId);
            if (item) add(item.drink);
          }}
          onRemove={remove}
          onClear={clear}
          onOrderPlaced={refetchOrders}
        />
      )}
    </div>
  );
}
