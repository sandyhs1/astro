"use client";

import { useEffect, useRef, useState } from "react";

/**
 * PlaceAutocomplete — small reusable wrapper around /api/geocode.
 *
 * - Calls our existing /api/geocode endpoint (AstrologyAPI geo_details proxy).
 * - On selection, returns the city name + lat + lon + numeric timezone offset.
 * - Caches the {lat, lon, timezone} so backend getOrBuildChart() can hit
 *   chart_cache by exact birth-hash (no extra geocode round-trip).
 *
 * Theme: editorial palette to match the B2C dashboard.
 */

export interface PlaceSelection {
  name: string;
  lat: number;
  lon: number;
  timezone: string; // numeric offset string like "+05:30"
}

interface Props {
  value: string;
  onChange: (text: string) => void;
  onSelect: (place: PlaceSelection) => void;
  placeholder?: string;
  required?: boolean;
  // Theme overrides (defaults to dashboard cream/oxblood palette)
  bg?: string;
  border?: string;
  ink?: string;
  accent?: string;
  // Optional id for label-for binding
  id?: string;
}

const DEFAULT_THEME = {
  bg:     "#F1ECE0",
  border: "#D4C9B7",
  ink:    "#0E1A33",
  accent: "#7B0A1F",
};

export default function PlaceAutocomplete({
  value, onChange, onSelect,
  placeholder = "e.g. Mumbai, India",
  required = false,
  bg     = DEFAULT_THEME.bg,
  border = DEFAULT_THEME.border,
  ink    = DEFAULT_THEME.ink,
  accent = DEFAULT_THEME.accent,
  id,
}: Props) {
  const [suggestions, setSuggestions] = useState<PlaceSelection[]>([]);
  const [open, setOpen]               = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef  = useRef<HTMLDivElement>(null);

  // Close suggestions on outside click
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const handleInput = (text: string) => {
    onChange(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!text || text.length < 3) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    setIsSearching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res  = await fetch(`/api/geocode?q=${encodeURIComponent(text)}`);
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const mapped: PlaceSelection[] = data.map((r: any) => ({
            name:     String(r.Name ?? r.name ?? ""),
            lat:      Number(r.lat),
            lon:      Number(r.lon),
            timezone: String(r.timezone ?? "+05:30"),
          })).filter(s => s.name && !Number.isNaN(s.lat) && !Number.isNaN(s.lon));
          setSuggestions(mapped);
          setOpen(mapped.length > 0);
        } else {
          setSuggestions([]);
          setOpen(false);
        }
      } catch (err) {
        console.error("[PlaceAutocomplete] geocode error:", err);
        setSuggestions([]);
        setOpen(false);
      } finally {
        setIsSearching(false);
      }
    }, 250);
  };

  const handlePick = (s: PlaceSelection) => {
    onChange(s.name);
    onSelect(s);
    setOpen(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <input
        id={id}
        required={required}
        type="text"
        value={value}
        onChange={(e) => handleInput(e.target.value)}
        onFocus={() => { if (suggestions.length > 0) setOpen(true); }}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full rounded-sm px-3.5 py-2.5 focus:outline-none text-[15px]"
        style={{ background: bg, border: `1px solid ${border}`, color: ink }}
      />
      {isSearching && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div
            className="w-4 h-4 rounded-full animate-spin"
            style={{ border: `2px solid ${border}`, borderTopColor: accent }}
          />
        </div>
      )}
      {open && suggestions.length > 0 && (
        <ul
          className="absolute z-20 w-full mt-1 rounded-sm shadow-xl max-h-56 overflow-y-auto"
          style={{ background: "#FAF7F2", border: `1px solid ${border}` }}
          role="listbox"
        >
          {suggestions.map((s, idx) => (
            <li
              key={`${s.name}-${idx}`}
              role="option"
              aria-selected={false}
              className="px-3.5 py-2.5 cursor-pointer text-[14px] transition-colors hover:bg-black/[0.04]"
              style={{
                color: ink,
                borderBottom: idx < suggestions.length - 1 ? `1px solid ${border}` : "none",
              }}
              onClick={() => handlePick(s)}
            >
              {s.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
