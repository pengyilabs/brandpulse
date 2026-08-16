import { useState } from 'react'
import { Search, ChevronDown, TrendingUp, BarChart3, Calendar, Trash2, MoreHorizontal } from 'lucide-react'
import { MOCK_SAVED_AUDITS } from '../data/audit-data'

interface AuditsViewProps {
  onStartNewAudit: () => void
  onOpenAudit: (id: string) => void
}

export function AuditsView({ onStartNewAudit, onOpenAudit }: AuditsViewProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredAudits = MOCK_SAVED_AUDITS.filter((audit) =>
    audit.url.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">Saved Audits</h1>
            <p className="text-sm text-muted-foreground">
              Manage and review your historical profile analysis
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search audits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-56 pl-9 pr-4 py-2 bg-[#111] border border-white/10 rounded-lg text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 bg-[#111] border border-white/10 rounded-lg text-sm text-foreground hover:bg-[#1a1a1a] transition-colors">
              All Dates
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>
            <button
              onClick={onStartNewAudit}
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium transition-all"
            >
              <BarChart3 className="w-4 h-4" />
              Start New Audit
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {filteredAudits.map((audit) => (
            <div
              key={audit.id}
              onClick={() => onOpenAudit(audit.id)}
              className="bg-[#111] border border-white/10 rounded-xl p-5 cursor-pointer hover:border-primary/30 hover:bg-[#161616] transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                    {audit.url}
                  </p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-medium rounded">
                    {audit.dateRange}
                  </span>
                </div>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs text-muted-foreground">Profile Score</span>
                <span className="text-sm font-bold text-foreground">{audit.profileScore}/100</span>
              </div>

              <div className="flex items-center gap-6 text-xs">
                <div>
                  <p className="text-muted-foreground mb-0.5">Followers</p>
                  <p className="font-semibold text-foreground">{audit.followers}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-0.5">Growth</p>
                  <p className="font-semibold text-primary">{audit.growth}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-0.5">Engagements</p>
                  <p className="font-semibold text-foreground">{audit.engagements}</p>
                </div>
              </div>
            </div>
          ))}

          <div className="bg-[#111] border border-white/10 border-dashed rounded-xl p-5 flex flex-col items-center justify-center min-h-[160px]">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <p className="text-sm font-medium text-foreground text-center mb-1">No saved audits yet</p>
            <p className="text-xs text-muted-foreground text-center mb-4 max-w-[200px]">
              Run an audit on any social profile to uncover content gaps and growth opportunities.
            </p>
            <button
              onClick={onStartNewAudit}
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium transition-all"
            >
              Start Your First Audit
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
