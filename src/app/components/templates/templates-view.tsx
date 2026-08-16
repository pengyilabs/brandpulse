import { useTranslation } from 'react-i18next';

export function TemplatesView() {
  const { t } = useTranslation();
  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-foreground mb-2">{t('templates.title')}</h1>
          <p className="text-muted-foreground">{t('templates.description')}</p>
        </div>
        <div className="flex items-center justify-center h-96 bg-card rounded-lg border border-border">
          <p className="text-muted-foreground">{t('templates.comingSoon')}</p>
        </div>
      </div>
    </div>
  );
}
