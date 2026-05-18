"use client";

/**
 * ChatChipsRow — a horizontally scrollable row of suggestion chips with:
 *   • Hidden native scrollbar but visible Prev/Next arrow buttons
 *   • Auto-hide arrows when the row fits or when an edge is reached
 *   • Touch-friendly: large tap targets, momentum scroll, scroll-snap
 *   • Two display modes: "compact" (composer) and "comfy" (Home/empty state)
 *   • Mobile-first: arrows tappable on phones, never hijack horizontal swipe
 *
 * Used in:
 *   - OracleChatPanel composer (compact)
 *   - Home "Ask the Oracle" block (comfy)
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  chips: string[];
  onChipClick: (chip: string) => void;
  variant?: "compact" | "comfy";
  /** UI palette overrides (defaults match the dashboard cream theme) */
  palette?: {
    bg?:     string;  // chip background
    border?: string;  // chip border
    ink?:    string;  // chip text
    accent?: string;  // hover / active accent
    arrowBg?:     string; // arrow button background
    arrowInk?:    string; // arrow button icon color
    arrowBorder?: string;
    paperBg?: string;     // page-side mask color so arrows look anchored
  };
  /** Optional tag the calling page can flash to indicate "smart" suggestions */
  smartBadge?: boolean;
  /** When true, render a small spinner where the row would be */
  loading?: boolean;
  className?: string;
}

const DEFAULT_PALETTE = {
  bg:     "#F1ECE0",
  border: "#E8E0CE",
  ink:    "#0E1A33",
  accent: "#7B0A1F",
  arrowBg:     "#FAF7F2",
  arrowInk:    "#0E1A33",
  arrowBorder: "#D4C9B7",
  paperBg:     "#FAF7F2",
};

export default function ChatChipsRow({
  chips,
  onChipClick,
  variant = "compact",
  palette,
  smartBadge,
  loading,
  className = "",
}: Props) {
  const PAL = { ...DEFAULT_PALETTE, ...(palette ?? {}) };
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  // ── Recompute scroll affordances ────────────────────────────────────────
  const updateAffordances = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) { setCanPrev(false); setCanNext(false); return; }
    // 2px tolerance avoids edge flicker on sub-pixel scrolling
    setCanPrev(el.scrollLeft > 2);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    updateAffordances();
  }, [chips, loading, updateAffordances]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => updateAffordances();
    el.addEventListener("scroll", onScroll, { passive: true });

    let resizeObs: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObs = new ResizeObserver(updateAffordances);
      resizeObs.observe(el);
    } else {
      window.addEventListener("resize", updateAffordances);
    }
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (resizeObs) resizeObs.disconnect();
      else window.removeEventListener("resize", updateAffordances);
    };
  }, [updateAffordances]);

  const scrollByDir = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    // Scroll by ~80% of the visible width — comfortable paging without losing context
    const delta = Math.max(160, Math.round(el.clientWidth * 0.8)) * dir;
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="h-7 md:h-8 w-28 rounded-sm animate-pulse" style={{ background: PAL.bg, border: `1px solid ${PAL.border}` }} />
        <div className="h-7 md:h-8 w-32 rounded-sm animate-pulse" style={{ background: PAL.bg, border: `1px solid ${PAL.border}` }} />
        <div className="h-7 md:h-8 w-24 rounded-sm animate-pulse hidden sm:block" style={{ background: PAL.bg, border: `1px solid ${PAL.border}` }} />
        <div className="h-7 md:h-8 w-36 rounded-sm animate-pulse hidden md:block" style={{ background: PAL.bg, border: `1px solid ${PAL.border}` }} />
      </div>
    );
  }

  if (!chips || chips.length === 0) return null;

  const chipPad     = variant === "compact" ? "px-3.5 py-1.5" : "px-4 py-2";
  const chipText    = variant === "compact" ? "text-[12.5px] md:text-[13px]" : "text-[13px] md:text-[13.5px]";
  const arrowSize   = variant === "compact" ? "h-7 w-7"     : "h-8 w-8";
  const arrowIcon   = variant === "compact" ? 13 : 15;
  const fadePixels  = variant === "compact" ? 28 : 36;

  return (
    <div className={`relative ${className}`}>
      {smartBadge && (
        <div className="mb-1.5 flex items-center gap-1.5">
          <span
            className="inline-block w-1 h-1 rounded-full"
            style={{ background: PAL.accent }}
          />
          <span
            className="text-[9.5px] font-semibold uppercase tracking-[0.2em]"
            style={{ color: PAL.accent }}
          >
            Suggested for you
          </span>
        </div>
      )}

      <div className="relative">
        {/* Left fade mask + Prev button (visible only when scrollable left) */}
        {canPrev && (
          <>
            <div
              className="pointer-events-none absolute left-0 top-0 bottom-0 z-[1]"
              style={{
                width: fadePixels,
                background: `linear-gradient(to right, ${PAL.paperBg} 30%, ${PAL.paperBg}00)`,
              }}
            />
            <button
              type="button"
              aria-label="Scroll prompts left"
              onClick={() => scrollByDir(-1)}
              className={`absolute left-0 top-1/2 -translate-y-1/2 z-[2] grid place-items-center rounded-sm shadow-sm transition-opacity hover:opacity-100 opacity-90 ${arrowSize}`}
              style={{
                background: PAL.arrowBg,
                color: PAL.arrowInk,
                border: `1px solid ${PAL.arrowBorder}`,
                boxShadow: "0 1px 4px rgba(14,26,51,0.08)",
              }}
            >
              <ChevronLeft size={arrowIcon} />
            </button>
          </>
        )}

        {/* Right fade mask + Next button */}
        {canNext && (
          <>
            <div
              className="pointer-events-none absolute right-0 top-0 bottom-0 z-[1]"
              style={{
                width: fadePixels,
                background: `linear-gradient(to left, ${PAL.paperBg} 30%, ${PAL.paperBg}00)`,
              }}
            />
            <button
              type="button"
              aria-label="Scroll prompts right"
              onClick={() => scrollByDir(1)}
              className={`absolute right-0 top-1/2 -translate-y-1/2 z-[2] grid place-items-center rounded-sm shadow-sm transition-opacity hover:opacity-100 opacity-90 ${arrowSize}`}
              style={{
                background: PAL.arrowBg,
                color: PAL.arrowInk,
                border: `1px solid ${PAL.arrowBorder}`,
                boxShadow: "0 1px 4px rgba(14,26,51,0.08)",
              }}
            >
              <ChevronRight size={arrowIcon} />
            </button>
          </>
        )}

        {/* The row itself — hidden scrollbar, snap-x for clean stops */}
        <div
          ref={scrollerRef}
          className="flex gap-2 overflow-x-auto no-scrollbar pb-1 snap-x snap-mandatory scroll-smooth"
          style={{
            // Edge padding lets the first/last chip clear the arrows
            paddingLeft:  canPrev ? fadePixels + 4 : 0,
            paddingRight: canNext ? fadePixels + 4 : 0,
            // Smoother momentum on iOS
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
          }}
        >
          {chips.map((chip, idx) => (
            <button
              key={`${idx}-${chip.slice(0, 12)}`}
              type="button"
              onClick={() => onChipClick(chip)}
              className={`flex-shrink-0 snap-start serif-text ${chipText} ${chipPad} rounded-sm transition-colors hover:bg-black/[0.04] whitespace-nowrap`}
              style={{
                background: PAL.bg,
                color:      PAL.ink,
                border:    `1px solid ${PAL.border}`,
              }}
            >
              {variant === "compact" ? `"${chip}"` : chip}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
