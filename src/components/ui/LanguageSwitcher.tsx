import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const LANGUAGES = [
  { code: 'it', label: 'IT', flag: '🇮🇹' },
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'sq', label: 'SQ', flag: '🇦🇱' },
] as const;

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className = '' }: LanguageSwitcherProps) {
  const { i18n } = useTranslation();
  const current = i18n.language?.slice(0, 2) ?? 'it';

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {LANGUAGES.map(({ code, label, flag }) => {
        const active = current === code;
        return (
          <motion.button
            key={code}
            onClick={() => i18n.changeLanguage(code)}
            whileTap={{ scale: 0.9 }}
            className={`
              flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-colors
              ${active
                ? 'bg-white text-black'
                : 'text-white/40 hover:text-white/70 hover:bg-white/10'
              }
            `}
            aria-label={`Switch to ${label}`}
          >
            <span>{flag}</span>
            <span>{label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
