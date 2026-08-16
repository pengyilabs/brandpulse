import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import type { SupportedLng } from '../../i18n/i18n';

const LANG_OPTIONS: { value: SupportedLng; label: string }[] = [
  { value: 'en', label: 'EN' },
  { value: 'zh-CN', label: '中文' },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div className="flex items-center gap-1 p-1 bg-card rounded-lg border border-border">
      {LANG_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => i18n.changeLanguage(opt.value)}
          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
            i18n.language === opt.value
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}