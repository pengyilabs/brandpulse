import { useTranslation } from 'react-i18next'
import { BarChart3, Clock, CheckCircle2 } from 'lucide-react'

export function AuditsView() {
  const { t } = useTranslation()
  const features = t('audits.comingSoonFeatures', { returnObjects: true }) as string[]

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="max-w-[680px] mx-auto mt-24 flex flex-col items-center text-center">
        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <BarChart3 className="w-8 h-8 text-primary" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-foreground mb-3">
          {t('audits.comingSoonTitle')}
        </h1>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed max-w-[480px] mb-10">
          {t('audits.comingSoonDesc')}
        </p>

        {/* Feature preview cards */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-[520px]">
          {features.map((feature, i) => (
            <div
              key={i}
              className="bg-[#111] border border-white/10 rounded-xl p-4 flex items-start gap-3 text-left"
            >
              <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm text-foreground/80 leading-snug">
                {feature}
              </span>
            </div>
          ))}
        </div>

        {/* Coming Soon badge */}
        <div className="mt-10 flex items-center gap-2 px-4 py-2 bg-muted rounded-full">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">
            {t('nav.comingSoon')}
          </span>
        </div>
      </div>
    </div>
  )
}
