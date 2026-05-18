import { motion } from 'framer-motion';
import { QrCode, Smartphone, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

export function LandingPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6 max-w-sm"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/10 border border-white/10 mb-4">
            <QrCode size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white leading-tight">
            {t('landing.title')}
            <br />
            <span className="text-white/40">{t('landing.subtitle')}</span>
          </h1>
          <p className="text-white/50 text-base leading-relaxed">
            {t('landing.description')}
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-12 grid grid-cols-3 gap-4 w-full max-w-sm"
        >
          {[
            { icon: Smartphone, label: t('landing.features.mobile') },
            { icon: Zap, label: t('landing.features.instant') },
            { icon: QrCode, label: t('landing.features.qrOnly') },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/8"
            >
              <Icon size={20} className="text-white/60" />
              <span className="text-xs text-white/50 font-medium">{label}</span>
            </div>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="p-6 border-t border-white/8 flex flex-col items-center gap-3">
        <LanguageSwitcher />
        <Link
          to="/admin"
          className="text-xs text-white/20 hover:text-white/40 transition-colors"
        >
          {t('landing.adminLink')}
        </Link>
      </footer>
    </div>
  );
}
