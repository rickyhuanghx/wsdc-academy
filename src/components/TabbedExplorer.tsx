'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

type Tab = { label: string; panel: ReactNode };

/** Editorial tabbed explorer: quiet tab row, panels crossfade in place.
    Panels are stacked in one grid cell so the height stays put on switch.
    Panels are server-rendered and passed in, so charts stay server components.

    With `autoAdvanceMs`, it auto-cycles: pauses on hover/focus, restarts on a
    manual click, and stays put when the viewer prefers reduced motion. */
export function TabbedExplorer({ tabs, autoAdvanceMs }: { tabs: Tab[]; autoAdvanceMs?: number }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduce, setReduce] = useState(false);
  const [cycle, setCycle] = useState(0); // bump to restart the timer + progress bar
  const btns = useRef<(HTMLButtonElement | null)[]>([]);
  const n = tabs.length;

  const select = (k: number) => {
    setIndex(k);
    setCycle((c) => c + 1);
  };
  const focusTab = (k: number) => {
    select(k);
    btns.current[k]?.focus();
  };
  const resume = () => {
    setPaused(false);
    setCycle((c) => c + 1);
  };

  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduce(m.matches);
    sync();
    m.addEventListener('change', sync);
    return () => m.removeEventListener('change', sync);
  }, []);

  const autoOn = !!autoAdvanceMs && !paused && !reduce;
  useEffect(() => {
    if (!autoOn || !autoAdvanceMs) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % n), autoAdvanceMs);
    return () => clearInterval(id);
  }, [autoOn, autoAdvanceMs, n, cycle]);

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={resume}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) resume();
      }}
    >
      <div
        role="tablist"
        aria-label="Admissions results"
        className="flex flex-wrap gap-1.5 border-b border-navy-200 pb-4"
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') {
            e.preventDefault();
            focusTab((index + 1) % n);
          } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            focusTab((index - 1 + n) % n);
          }
        }}
      >
        {tabs.map((t, k) => (
          <button
            key={t.label}
            ref={(el) => {
              btns.current[k] = el;
            }}
            id={`fx-tab-${k}`}
            role="tab"
            type="button"
            aria-selected={k === index}
            aria-controls={`fx-panel-${k}`}
            tabIndex={k === index ? 0 : -1}
            onClick={() => select(k)}
            className={`shrink-0 rounded-sm px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] transition-colors ${
              k === index ? 'bg-navy-900 text-white' : 'text-navy-500 hover:text-navy-900'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {autoAdvanceMs && !reduce && (
        <div className="mt-3 h-0.5 w-full overflow-hidden rounded-full bg-navy-100" aria-hidden="true">
          <div
            key={`${index}-${cycle}`}
            className="h-full w-full origin-left bg-signal-500"
            style={{
              animation: `fx-progress ${autoAdvanceMs}ms linear forwards`,
              animationPlayState: paused ? 'paused' : 'running',
            }}
          />
        </div>
      )}

      <div className="mt-8 grid">
        {tabs.map((t, k) => (
          <div
            key={t.label}
            id={`fx-panel-${k}`}
            role="tabpanel"
            aria-labelledby={`fx-tab-${k}`}
            inert={k === index ? undefined : true}
            className={`[grid-area:1/1] transition-opacity duration-300 motion-reduce:transition-none ${
              k === index ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
          >
            {t.panel}
          </div>
        ))}
      </div>
    </div>
  );
}
