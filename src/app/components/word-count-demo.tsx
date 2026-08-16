import { useState } from "react";
import { WordCountRangeSelector, DualHandleWordCountSelector } from "./word-count-range-selector";

export function WordCountDemo() {
  const [longFormRange, setLongFormRange] = useState<[number, number]>([1200, 1700]);
  const [shortFormRange, setShortFormRange] = useState<[number, number]>([100, 200]);
  const [dualHandleLongForm, setDualHandleLongForm] = useState<[number, number]>([1200, 2500]);
  const [dualHandleShortForm, setDualHandleShortForm] = useState<[number, number]>([100, 300]);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Word Count Range Selector
          </h1>
          <p className="text-muted-foreground">
            Interactive dual-handle slider for setting content word count ranges
          </p>
        </div>

        {/* Single Handle Version */}
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-6">
              Single Handle (Snap to Predefined Ranges)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Long-form */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
                  Long-Form Content
                </h3>
                <WordCountRangeSelector
                  contentForm="long-form"
                  value={longFormRange}
                  onChange={setLongFormRange}
                />
                <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
                  <div className="text-xs text-muted-foreground mb-2">Selected Range:</div>
                  <div className="text-sm font-mono text-foreground">
                    {JSON.stringify(longFormRange)}
                  </div>
                </div>
              </div>

              {/* Short-form */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
                  Short-Form Content
                </h3>
                <WordCountRangeSelector
                  contentForm="short-form"
                  value={shortFormRange}
                  onChange={setShortFormRange}
                />
                <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
                  <div className="text-xs text-muted-foreground mb-2">Selected Range:</div>
                  <div className="text-sm font-mono text-foreground">
                    {JSON.stringify(shortFormRange)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dual Handle Version */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-6">
              Dual Handle (Independent Min/Max Control)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Long-form dual handle */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
                  Long-Form Content
                </h3>
                <DualHandleWordCountSelector
                  contentForm="long-form"
                  value={dualHandleLongForm}
                  onChange={setDualHandleLongForm}
                />
                <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
                  <div className="text-xs text-muted-foreground mb-2">Selected Range:</div>
                  <div className="text-sm font-mono text-foreground">
                    {JSON.stringify(dualHandleLongForm)}
                  </div>
                </div>
              </div>

              {/* Short-form dual handle */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
                  Short-Form Content
                </h3>
                <DualHandleWordCountSelector
                  contentForm="short-form"
                  value={dualHandleShortForm}
                  onChange={setDualHandleShortForm}
                />
                <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
                  <div className="text-xs text-muted-foreground mb-2">Selected Range:</div>
                  <div className="text-sm font-mono text-foreground">
                    {JSON.stringify(dualHandleShortForm)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature List */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Features</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>
                <strong className="text-foreground">Predefined Ranges:</strong> Snaps to common word count ranges for long-form (800-3,500) and short-form (50-500) content
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>
                <strong className="text-foreground">Visual Feedback:</strong> Selected range highlighted in accent color, unselected portions in gray
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>
                <strong className="text-foreground">Hover Animations:</strong> Handles scale up on hover and focus for better interactivity
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>
                <strong className="text-foreground">Info Tooltip:</strong> Hover over the info icon to see guidance about word count variance
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>
                <strong className="text-foreground">Range Display:</strong> Current selection shown in a prominent badge below the slider
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>
                <strong className="text-foreground">Quick Selection:</strong> Click any range marker number below the slider to jump to that range
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>
                <strong className="text-foreground">Two Versions:</strong> Single handle for predefined range selection, dual handle for custom min/max values
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
