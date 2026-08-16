import { useState } from "react";
import { clsx } from "clsx";
import {
  BarChart3,
  X,
  TrendingUp,
  CheckCircle2,
  Lightbulb,
  AlertTriangle,
  AlertCircle,
  RotateCcw,
  Smile,
  Meh,
  Frown,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AnalysisResult {
  sentiment: {
    label: "Positive" | "Neutral" | "Negative";
    score: number;
    confidence: number;
  };
  brandAlignment: {
    score: number;
    status: "on-brand" | "minor-issues" | "major-issues";
  };
  tips: string[];
  issues: { severity: "warning" | "error"; message: string }[];
}

interface AnalyzePanelProps {
  itemId: number;
  itemType: string;
  itemStatus: string;
  itemFunnelStage?: string;
  onClose: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AnalyzePanel({ itemId, itemType, itemStatus, itemFunnelStage, onClose }: AnalyzePanelProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  const runAnalysis = () => {
    setIsAnalyzing(true);
    // Simulate analysis
    setTimeout(() => {
      const mockAnalysis: AnalysisResult = {
        sentiment: {
          label: itemFunnelStage === "Decision" ? "Positive" : itemFunnelStage === "Awareness" ? "Neutral" : "Positive",
          score: itemFunnelStage === "Decision" ? 0.85 : itemFunnelStage === "Awareness" ? 0.5 : 0.72,
          confidence: 0.89,
        },
        brandAlignment: {
          score: itemStatus === "approved" ? 0.92 : itemStatus === "ready-for-review" || itemStatus === "pending-review" ? 0.78 : 0.65,
          status: itemStatus === "approved" ? "on-brand" : itemStatus === "ready-for-review" || itemStatus === "pending-review" ? "minor-issues" : "major-issues",
        },
        tips: [
          "Consider adding a stronger call to action at the end",
          "The opening could be more engaging to capture attention",
          "Try incorporating specific brand terminology from guidelines",
        ],
        issues:
          itemStatus === "draft"
            ? [
                { severity: "warning", message: "Tone may be too formal for the target audience" },
                { severity: "error", message: "Content length below recommended range (current: 320 words, minimum: 500)" },
              ]
            : itemStatus === "ready-for-review" || itemStatus === "pending-review"
            ? [{ severity: "warning", message: "Missing brand hashtags in social copy" }]
            : [],
      };
      setAnalysis(mockAnalysis);
      setIsAnalyzing(false);
    }, 1200);
  };

  useState(() => {
    runAnalysis();
  });

  const getSentimentColor = (label: string) => {
    if (label === "Positive") return "text-[#8FE6B5]";
    if (label === "Negative") return "text-red-400";
    return "text-yellow-400";
  };

  const getSentimentIcon = (label: string) => {
    if (label === "Positive") return Smile;
    if (label === "Negative") return Frown;
    return Meh;
  };

  const getBrandAlignmentColor = (status: string) => {
    if (status === "on-brand") return { bg: "bg-[#12B667]", text: "text-[#8FE6B5]", ring: "ring-[#12B667]/20" };
    if (status === "major-issues") return { bg: "bg-red-500", text: "text-red-400", ring: "ring-red-500/20" };
    return { bg: "bg-yellow-500", text: "text-yellow-400", ring: "ring-yellow-500/20" };
  };

  const getBrandAlignmentLabel = (status: string) => {
    if (status === "on-brand") return "Fully On-Brand";
    if (status === "major-issues") return "Significant Issues";
    return "Minor Deviations";
  };

  return (
    <div className="w-80 border-l border-border bg-card flex flex-col overflow-hidden flex-shrink-0">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">Content Analysis</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {isAnalyzing ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Analyzing content...</p>
            </div>
          </div>
        ) : analysis ? (
          <>
            {/* Sentiment Score */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Sentiment Score
                </span>
              </div>
              <div className="bg-secondary rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {(() => {
                      const SentimentIcon = getSentimentIcon(analysis.sentiment.label);
                      return <SentimentIcon className={clsx("w-5 h-5", getSentimentColor(analysis.sentiment.label))} />;
                    })()}
                    <span className={clsx("text-sm font-semibold", getSentimentColor(analysis.sentiment.label))}>
                      {analysis.sentiment.label}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {Math.round(analysis.sentiment.confidence * 100)}% confidence
                  </span>
                </div>
                <div className="relative h-2 bg-background rounded-full overflow-hidden">
                  <div
                    className={clsx(
                      "absolute inset-y-0 left-0 rounded-full transition-all",
                      analysis.sentiment.label === "Positive" ? "bg-[#12B667]" : analysis.sentiment.label === "Negative" ? "bg-red-500" : "bg-yellow-500"
                    )}
                    style={{ width: `${analysis.sentiment.score * 100}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-muted-foreground">Negative</span>
                  <span className="text-[10px] text-muted-foreground">Positive</span>
                </div>
              </div>
            </div>

            {/* Brand Alignment Score */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Brand Alignment
                </span>
              </div>
              <div className="bg-secondary rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={clsx(
                      "w-12 h-12 rounded-full flex items-center justify-center ring-4",
                      getBrandAlignmentColor(analysis.brandAlignment.status).ring
                    )}
                    style={{ background: `conic-gradient(${
                      analysis.brandAlignment.status === "on-brand" ? "#12B667" : analysis.brandAlignment.status === "major-issues" ? "#ef4444" : "#f59e0b"
                    } ${analysis.brandAlignment.score * 360}deg, rgba(255,255,255,0.1) 0deg)` }}
                  >
                    <span className="text-sm font-bold text-foreground">{Math.round(analysis.brandAlignment.score * 100)}</span>
                  </div>
                  <div>
                    <div className={clsx("text-sm font-semibold", getBrandAlignmentColor(analysis.brandAlignment.status).text)}>
                      {getBrandAlignmentLabel(analysis.brandAlignment.status)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Alignment Score
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips & Suggestions */}
            {analysis.tips.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Tips & Suggestions
                  </span>
                </div>
                <div className="space-y-2">
                  {analysis.tips.map((tip, i) => (
                    <div key={i} className="bg-secondary rounded-lg p-3 flex gap-2">
                      <Lightbulb className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-foreground leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Issue Flags */}
            {analysis.issues.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Issue Flags
                  </span>
                </div>
                <div className="space-y-2">
                  {analysis.issues.map((issue, i) => (
                    <div
                      key={i}
                      className={clsx(
                        "rounded-lg p-3 flex gap-2",
                        issue.severity === "error" ? "bg-red-500/10 border border-red-500/20" : "bg-yellow-500/10 border border-yellow-500/20"
                      )}
                    >
                      <AlertCircle
                        className={clsx("w-4 h-4 flex-shrink-0 mt-0.5", issue.severity === "error" ? "text-red-400" : "text-yellow-400")}
                      />
                      <p className="text-xs text-foreground leading-relaxed">{issue.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : null}
      </div>

      {/* Footer */}
      {!isAnalyzing && analysis && (
        <div className="px-4 py-3 border-t border-border flex-shrink-0">
          <button
            onClick={runAnalysis}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Re-analyze
          </button>
        </div>
      )}
    </div>
  );
}
