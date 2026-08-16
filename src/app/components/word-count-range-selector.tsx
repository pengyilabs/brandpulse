import { useState } from "react";
import { clsx } from "clsx";
import * as Slider from "@radix-ui/react-slider";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Info } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type ContentForm = "long-form" | "short-form";

interface WordCountRange {
  min: number;
  max: number;
  label: string;
}

interface WordCountRangeSelectorProps {
  contentForm: ContentForm;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  className?: string;
}

// ─── Range Definitions ────────────────────────────────────────────────────────

const LONG_FORM_RANGES: WordCountRange[] = [
  { min: 800, max: 1200, label: "800 – 1,200" },
  { min: 1200, max: 1700, label: "1,200 – 1,700" },
  { min: 1700, max: 2500, label: "1,700 – 2,500" },
  { min: 2500, max: 3500, label: "2,500 – 3,500" },
];

const SHORT_FORM_RANGES: WordCountRange[] = [
  { min: 50, max: 100, label: "50 – 100" },
  { min: 100, max: 200, label: "100 – 200" },
  { min: 200, max: 300, label: "200 – 300" },
  { min: 300, max: 500, label: "300 – 500" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function WordCountRangeSelector({
  contentForm,
  value,
  onChange,
  className,
}: WordCountRangeSelectorProps) {
  const ranges = contentForm === "long-form" ? LONG_FORM_RANGES : SHORT_FORM_RANGES;

  // Find the index of the current range
  const currentRangeIndex = ranges.findIndex(
    (range) => range.min === value[0] && range.max === value[1]
  );

  const handleValueChange = (newValue: number[]) => {
    // Map slider value (0-3) to actual range
    const index = Math.round(newValue[0]);
    const clampedIndex = Math.max(0, Math.min(ranges.length - 1, index));
    const selectedRange = ranges[clampedIndex];
    onChange([selectedRange.min, selectedRange.max]);
  };

  const currentRange = ranges.find(
    (range) => range.min === value[0] && range.max === value[1]
  ) || ranges[0];

  return (
    <Tooltip.Provider delayDuration={200}>
      <div className={clsx("space-y-4", className)}>
        {/* Label */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">
            Word Count Range
          </label>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                <Info className="w-4 h-4" />
              </button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                className="z-50 px-3 py-2 text-xs text-foreground bg-popover border border-border rounded-lg shadow-lg max-w-xs"
                sideOffset={5}
              >
                AI will aim for this word count range. Exact counts may vary.
                <Tooltip.Arrow className="fill-border" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </div>

        {/* Slider */}
        <div className="px-2">
          <Slider.Root
            className="relative flex items-center select-none touch-none w-full h-5 group"
            value={[currentRangeIndex === -1 ? 0 : currentRangeIndex]}
            onValueChange={handleValueChange}
            max={ranges.length - 1}
            step={1}
            minStepsBetweenThumbs={0}
          >
            {/* Track */}
            <Slider.Track className="bg-secondary relative grow rounded-full h-2">
              {/* Range markers */}
              {ranges.map((_, index) => {
                if (index === 0) return null;
                const position = (index / (ranges.length - 1)) * 100;
                return (
                  <div
                    key={index}
                    className="absolute top-1/2 -translate-y-1/2 w-0.5 h-3 bg-border"
                    style={{ left: `${position}%` }}
                  />
                );
              })}

              {/* Selected range highlight */}
              <Slider.Range className="absolute bg-primary rounded-full h-full" />
            </Slider.Track>

            {/* Thumb */}
            <Slider.Thumb
              className="block w-5 h-5 bg-card border-2 border-primary rounded-full shadow-md hover:scale-110 focus:scale-110 focus:outline-none focus:ring-4 focus:ring-primary/20 transition-transform cursor-grab active:cursor-grabbing"
              aria-label="Word count range"
            />
          </Slider.Root>

          {/* Range labels below slider */}
          <div className="flex justify-between mt-2 px-0.5">
            {ranges.map((range, index) => (
              <button
                key={index}
                onClick={() => onChange([range.min, range.max])}
                className={clsx(
                  "text-xs transition-colors",
                  currentRangeIndex === index
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {range.min}
              </button>
            ))}
          </div>
        </div>

        {/* Selected range display */}
        <div className="flex items-center justify-center">
          <div className="px-4 py-2 bg-secondary rounded-lg border border-border">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground tabular-nums">
                {currentRange.label}
              </span>
              <span className="text-sm text-muted-foreground">words</span>
            </div>
          </div>
        </div>
      </div>
    </Tooltip.Provider>
  );
}

// ─── Dual Handle Version ──────────────────────────────────────────────────────
// This version allows independent control of min and max values

interface DualHandleWordCountSelectorProps {
  contentForm: ContentForm;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  className?: string;
}

export function DualHandleWordCountSelector({
  contentForm,
  value,
  onChange,
  className,
}: DualHandleWordCountSelectorProps) {
  const ranges = contentForm === "long-form" ? LONG_FORM_RANGES : SHORT_FORM_RANGES;

  // Get all unique values for the slider
  const allValues = Array.from(
    new Set(ranges.flatMap((r) => [r.min, r.max]))
  ).sort((a, b) => a - b);

  const minIndex = allValues.indexOf(value[0]);
  const maxIndex = allValues.indexOf(value[1]);

  const handleValueChange = (newValue: number[]) => {
    const newMinIndex = Math.round(newValue[0]);
    const newMaxIndex = Math.round(newValue[1]);

    const newMin = allValues[newMinIndex];
    const newMax = allValues[newMaxIndex];

    onChange([newMin, newMax]);
  };

  const formatNumber = (num: number) => num.toLocaleString();

  return (
    <Tooltip.Provider delayDuration={200}>
      <div className={clsx("space-y-4", className)}>
        {/* Label */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">
            Word Count Range
          </label>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                <Info className="w-4 h-4" />
              </button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                className="z-50 px-3 py-2 text-xs text-foreground bg-popover border border-border rounded-lg shadow-lg max-w-xs"
                sideOffset={5}
              >
                AI will aim for this word count range. Exact counts may vary.
                <Tooltip.Arrow className="fill-border" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </div>

        {/* Slider */}
        <div className="px-2">
          <Slider.Root
            className="relative flex items-center select-none touch-none w-full h-5 group"
            value={[minIndex === -1 ? 0 : minIndex, maxIndex === -1 ? allValues.length - 1 : maxIndex]}
            onValueChange={handleValueChange}
            max={allValues.length - 1}
            step={1}
            minStepsBetweenThumbs={1}
          >
            {/* Track */}
            <Slider.Track className="bg-secondary relative grow rounded-full h-2">
              {/* Range markers */}
              {allValues.map((val, index) => {
                if (index === 0 || index === allValues.length - 1) return null;
                const position = (index / (allValues.length - 1)) * 100;
                return (
                  <div
                    key={index}
                    className="absolute top-1/2 -translate-y-1/2 w-0.5 h-3 bg-border"
                    style={{ left: `${position}%` }}
                  />
                );
              })}

              {/* Selected range highlight */}
              <Slider.Range className="absolute bg-primary rounded-full h-full" />
            </Slider.Track>

            {/* Min Thumb */}
            <Slider.Thumb
              className="block w-5 h-5 bg-card border-2 border-primary rounded-full shadow-md hover:scale-110 focus:scale-110 focus:outline-none focus:ring-4 focus:ring-primary/20 transition-transform cursor-grab active:cursor-grabbing"
              aria-label="Minimum word count"
            />

            {/* Max Thumb */}
            <Slider.Thumb
              className="block w-5 h-5 bg-card border-2 border-primary rounded-full shadow-md hover:scale-110 focus:scale-110 focus:outline-none focus:ring-4 focus:ring-primary/20 transition-transform cursor-grab active:cursor-grabbing"
              aria-label="Maximum word count"
            />
          </Slider.Root>

          {/* Range labels below slider */}
          <div className="flex justify-between mt-2 px-0.5">
            {ranges.map((range, index) => {
              const isMinSelected = range.min === value[0];
              const isMaxSelected = range.max === value[1];
              const isInRange = range.min >= value[0] && range.max <= value[1];

              return (
                <div key={index} className="flex flex-col items-center gap-1">
                  <button
                    onClick={() => onChange([range.min, range.max])}
                    className={clsx(
                      "text-xs transition-colors",
                      isMinSelected || isMaxSelected || isInRange
                        ? "text-primary font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {range.min}
                  </button>
                  {index === ranges.length - 1 && (
                    <button
                      onClick={() => onChange([range.min, range.max])}
                      className={clsx(
                        "text-xs transition-colors",
                        isMaxSelected
                          ? "text-primary font-semibold"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {range.max}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected range display */}
        <div className="flex items-center justify-center">
          <div className="px-4 py-2 bg-secondary rounded-lg border border-border">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground tabular-nums">
                {formatNumber(value[0])} – {formatNumber(value[1])}
              </span>
              <span className="text-sm text-muted-foreground">words</span>
            </div>
          </div>
        </div>
      </div>
    </Tooltip.Provider>
  );
}
