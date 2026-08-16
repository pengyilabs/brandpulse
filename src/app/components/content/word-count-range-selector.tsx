import { useState } from 'react';

interface WordCountRangeSelectorProps {
  contentForm: string;
  value: number;
  onChange: (value: number) => void;
}

export function WordCountRangeSelector({ contentForm, value, onChange }: WordCountRangeSelectorProps) {
  const ranges = [
    { label: 'Short', min: 100, max: 500 },
    { label: 'Medium', min: 500, max: 1500 },
    { label: 'Long', min: 1500, max: 3000 },
    { label: 'Extra Long', min: 3000, max: 5000 },
  ];

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">Word Count Range</label>
      <div className="flex gap-2">
        {ranges.map((range) => {
          const isActive = value >= range.min && value < range.max;
          return (
            <button
              key={range.label}
              type="button"
              onClick={() => onChange(range.min)}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {range.label}
              <div className="text-xs opacity-70 mt-0.5">
                {range.min}-{range.max}
              </div>
            </button>
          );
        })}
      </div>
      <div className="text-xs text-muted-foreground">
        Selected: {value} words
      </div>
    </div>
  );
}
