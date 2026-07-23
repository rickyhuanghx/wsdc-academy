'use client';

// The motion workbench: client-side search and filter over the full motion
// bank. The data ships as two static JSON files in /public: a core file (all
// motions, no info slides) and the info-slide file fetched only when a user
// first expands one. Server-rendered pages under /motions carry the crawlable
// listings; this component is the working tool on top.
//
// Coach-facing features: the filter bar stays pinned while scrolling, filter
// state lives in the URL (shareable views, and shelf links can deep-link a
// pre-filtered explorer), and checked motions build a practice set that can
// be copied or printed as a handout.
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motionTopics, MOTION_TYPE_LABELS } from '@/lib/motion-bank';
import { loadCoreMotions, type CoreMotion } from '@/lib/motion-bank-client';

const PAGE_SIZE = 60;

const TYPE_OPTIONS = ['policy', 'value', 'actor', 'regret'] as const;

interface Filters {
  q: string;
  topic: string;
  type: string;
  year: string;
  wsdc: boolean;
  infoslide: boolean;
}

const EMPTY_FILTERS: Filters = {
  q: '',
  topic: '',
  type: '',
  year: '',
  wsdc: false,
  infoslide: false,
};

function filtersToParams(f: Filters): string {
  const p = new URLSearchParams();
  if (f.q.trim()) p.set('q', f.q.trim());
  if (f.topic) p.set('topic', f.topic);
  if (f.type) p.set('type', f.type);
  if (f.year) p.set('year', f.year);
  if (f.wsdc) p.set('wsdc', '1');
  if (f.infoslide) p.set('infoslide', '1');
  return p.toString();
}

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        });
      }}
      className="shrink-0 rounded-sm border border-navy-200 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-navy-500 transition-colors hover:border-navy-400 hover:text-navy-800"
      aria-label="Copy motion text"
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

function InfoSlide({ id, slides, onNeedSlides }: {
  id: number;
  slides: Record<string, string> | null;
  onNeedSlides: () => void;
}) {
  const [open, setOpen] = useState(false);
  const text = slides?.[String(id)];
  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => {
          if (!open) onNeedSlides();
          setOpen(!open);
        }}
        className="text-xs font-semibold uppercase tracking-wider text-signal-500 underline decoration-signal-200 underline-offset-4 hover:decoration-signal-500"
      >
        {open ? 'Hide info slide' : 'Show info slide'}
      </button>
      {open && (
        <p className="mt-2 border-l-2 border-navy-200 pl-3 text-sm leading-relaxed text-navy-600">
          {text ?? 'Loading info slide…'}
        </p>
      )}
    </div>
  );
}

export function MotionExplorer() {
  const [all, setAll] = useState<CoreMotion[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [slides, setSlides] = useState<Record<string, string> | null>(null);
  const slidesRequested = useRef(false);

  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [order, setOrder] = useState<number[] | null>(null);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [dense, setDense] = useState(false);

  // Practice set: id -> motion, kept even when a motion falls out of the
  // current filter so a coach can mix filters while building one set.
  const [selected, setSelected] = useState<Map<number, CoreMotion>>(new Map());
  const [setCopied, setSetCopied] = useState(false);

  // --- URL <-> filter sync. Writes use history.replaceState (shallow, no
  // server round trip); Next syncs it back into useSearchParams, so
  // lastWritten guards against re-applying our own writes. Reads handle the
  // initial load and same-page navigations from shelf "see all" links.
  const searchParams = useSearchParams();
  const lastWritten = useRef<string | null>(null);

  useEffect(() => {
    const s = searchParams.toString();
    if (s === (lastWritten.current ?? '')) return;
    lastWritten.current = s;
    setFilters({
      q: searchParams.get('q') ?? '',
      topic: searchParams.get('topic') ?? '',
      type: searchParams.get('type') ?? '',
      year: searchParams.get('year') ?? '',
      wsdc: searchParams.get('wsdc') === '1',
      infoslide: searchParams.get('infoslide') === '1',
    });
    setVisible(PAGE_SIZE);
  }, [searchParams]);

  const apply = (patch: Partial<Filters>) => {
    setFilters((prev) => {
      const next = { ...prev, ...patch };
      const s = filtersToParams(next);
      lastWritten.current = s;
      window.history.replaceState(
        null,
        '',
        s ? `${window.location.pathname}?${s}` : window.location.pathname,
      );
      return next;
    });
    setVisible(PAGE_SIZE);
  };

  useEffect(() => {
    let cancelled = false;
    loadCoreMotions()
      .then((m) => {
        if (!cancelled) setAll(m);
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const loadSlides = () => {
    if (slidesRequested.current) return;
    slidesRequested.current = true;
    fetch('/motion-bank-infoslides.json')
      .then((r) => r.json())
      .then(setSlides)
      .catch(() => {
        slidesRequested.current = false;
      });
  };

  const years = useMemo(() => {
    if (!all) return [];
    return Array.from(new Set(all.map((m) => m.y).filter((y): y is number => y !== null))).sort(
      (a, b) => b - a,
    );
  }, [all]);

  const results = useMemo(() => {
    if (!all) return [];
    const needle = filters.q.trim().toLowerCase();
    let out = all.filter((m) => {
      if (filters.topic && !m.top.includes(filters.topic)) return false;
      if (filters.type && m.ty !== filters.type) return false;
      if (filters.year && String(m.y) !== filters.year) return false;
      if (filters.wsdc && !m.w) return false;
      if (filters.infoslide && !m.hi) return false;
      if (
        needle &&
        !m.m.toLowerCase().includes(needle) &&
        !m.t.toLowerCase().includes(needle) &&
        !m.r.toLowerCase().includes(needle)
      )
        return false;
      return true;
    });
    if (order) {
      const pos = new Map(order.map((id, i) => [id, i]));
      out = out.slice().sort((a, b) => (pos.get(a.id) ?? 0) - (pos.get(b.id) ?? 0));
    } else {
      out = out.slice().sort((a, b) => (b.y ?? 0) - (a.y ?? 0));
    }
    return out;
  }, [all, filters, order]);

  const chips = useMemo(() => {
    const out: { key: string; label: string; patch: Partial<Filters> }[] = [];
    if (filters.q.trim()) out.push({ key: 'q', label: `“${filters.q.trim()}”`, patch: { q: '' } });
    if (filters.topic)
      out.push({
        key: 'topic',
        label: motionTopics.find((t) => t.slug === filters.topic)?.label ?? filters.topic,
        patch: { topic: '' },
      });
    if (filters.type)
      out.push({
        key: 'type',
        label: MOTION_TYPE_LABELS[filters.type] ?? filters.type,
        patch: { type: '' },
      });
    if (filters.year) out.push({ key: 'year', label: filters.year, patch: { year: '' } });
    if (filters.wsdc) out.push({ key: 'wsdc', label: 'Worlds only', patch: { wsdc: false } });
    if (filters.infoslide)
      out.push({ key: 'infoslide', label: 'Has info slide', patch: { infoslide: false } });
    return out;
  }, [filters]);

  const toggleSelected = (m: CoreMotion) => {
    setSelected((prev) => {
      const next = new Map(prev);
      if (next.has(m.id)) next.delete(m.id);
      else next.set(m.id, m);
      return next;
    });
  };

  const setAsText = () =>
    [...selected.values()]
      .map(
        (m, i) =>
          `${i + 1}. ${m.m}  (${[m.y, m.t, m.r].filter(Boolean).join(', ')})`,
      )
      .join('\n');

  const printSet = () => {
    document.body.classList.add('print-motion-set');
    const cleanup = () => {
      document.body.classList.remove('print-motion-set');
      window.removeEventListener('afterprint', cleanup);
    };
    window.addEventListener('afterprint', cleanup);
    window.print();
    // Safety net for browsers that never fire afterprint.
    setTimeout(cleanup, 2000);
  };

  const selectClass =
    'rounded-sm border border-navy-200 bg-white px-3 py-2 text-sm text-navy-800 focus:border-navy-500 focus:outline-none';

  return (
    <div>
      {/* Pinned toolbar: sits below the h-16 sticky navbar. */}
      <div className="sticky top-16 z-30 rounded-sm border border-navy-200 bg-white p-4 shadow-[0_10px_24px_-18px_rgba(13,34,64,0.45)] sm:p-5">
        <div className="flex flex-col gap-3">
          <input
            type="search"
            value={filters.q}
            onChange={(e) => apply({ q: e.target.value })}
            placeholder="Search motions by keyword, phrase, or tournament (try “nuclear”, “social media”, “WSDC”)"
            className="w-full rounded-sm border border-navy-200 bg-white px-4 py-3 text-navy-900 placeholder:text-navy-400 focus:border-navy-500 focus:outline-none"
            aria-label="Search motions"
          />
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={filters.topic}
              onChange={(e) => apply({ topic: e.target.value })}
              className={selectClass}
              aria-label="Filter by topic"
            >
              <option value="">All topics</option>
              {motionTopics.map((t) => (
                <option key={t.slug} value={t.slug}>
                  {t.label}
                </option>
              ))}
            </select>
            <select
              value={filters.type}
              onChange={(e) => apply({ type: e.target.value })}
              className={selectClass}
              aria-label="Filter by motion type"
            >
              <option value="">All motion types</option>
              {TYPE_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {MOTION_TYPE_LABELS[t]}
                </option>
              ))}
            </select>
            <select
              value={filters.year}
              onChange={(e) => apply({ year: e.target.value })}
              className={selectClass}
              aria-label="Filter by year"
            >
              <option value="">All years</option>
              {years.map((y) => (
                <option key={y} value={String(y)}>
                  {y}
                </option>
              ))}
            </select>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-navy-700">
              <input
                type="checkbox"
                checked={filters.wsdc}
                onChange={(e) => apply({ wsdc: e.target.checked })}
                className="h-4 w-4 accent-signal-500"
              />
              Worlds (WSDC) only
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-navy-700">
              <input
                type="checkbox"
                checked={filters.infoslide}
                onChange={(e) => apply({ infoslide: e.target.checked })}
                className="h-4 w-4 accent-signal-500"
              />
              Has info slide
            </label>
            <button
              type="button"
              onClick={() => {
                if (!all) return;
                setOrder(shuffle(all.map((m) => m.id)));
                setVisible(PAGE_SIZE);
              }}
              className="rounded-sm border border-navy-900 px-4 py-2 text-sm font-semibold text-navy-900 transition hover:bg-navy-900 hover:text-white"
            >
              Shuffle
            </button>
            <button
              type="button"
              onClick={() => setDense((d) => !d)}
              aria-pressed={dense}
              className="ml-auto rounded-sm border border-navy-200 px-3 py-2 text-sm font-medium text-navy-600 transition-colors hover:border-navy-400 hover:text-navy-900"
            >
              {dense ? 'Comfortable view' : 'Compact view'}
            </button>
          </div>
          {(chips.length > 0 || all) && (
            <div className="flex flex-wrap items-center gap-2 border-t border-navy-100 pt-3">
              {chips.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => apply(c.patch)}
                  className="inline-flex items-center gap-1.5 rounded-sm border border-navy-200 bg-cream px-2.5 py-1 text-xs font-semibold text-navy-800 transition-colors hover:border-navy-400"
                  aria-label={`Remove filter: ${c.label}`}
                >
                  {c.label}
                  <span aria-hidden="true" className="font-bold text-signal-500">
                    ×
                  </span>
                </button>
              ))}
              {chips.length > 0 && (
                <button
                  type="button"
                  onClick={() => apply({ ...EMPTY_FILTERS })}
                  className="text-xs font-semibold text-signal-500 underline decoration-signal-200 underline-offset-4 hover:decoration-signal-500"
                >
                  Clear all
                </button>
              )}
              {all && (
                <span className="stat ml-auto text-xs font-semibold uppercase tracking-wider text-navy-500">
                  {results.length.toLocaleString('en-US')}{' '}
                  {results.length === 1 ? 'motion' : 'motions'}
                  {order ? ', shuffled' : ', newest first'}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-5">
        {loadError && (
          <p className="text-navy-600">
            The motion data failed to load. Refresh the page to try again, or browse the{' '}
            <Link href="/motions/wsdc" className="font-semibold text-signal-500 hover:text-signal-600">
              Worlds motions archive
            </Link>{' '}
            instead.
          </p>
        )}
        {!all && !loadError && <p className="text-navy-500">Loading 12,000+ motions…</p>}
        {all && (
          <>
            <ol className={dense ? 'space-y-0' : 'space-y-4'}>
              {results.slice(0, visible).map((m) => (
                <li
                  key={m.id}
                  className={dense ? 'border-t border-navy-100 py-1.5' : 'border-t border-navy-200 pt-4'}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selected.has(m.id)}
                      onChange={() => toggleSelected(m)}
                      className="mt-1 h-4 w-4 shrink-0 accent-signal-500"
                      aria-label="Add to practice set"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <p
                          className={
                            dense
                              ? 'font-display text-[15px] italic leading-snug text-navy-800'
                              : 'font-display italic leading-relaxed text-navy-800'
                          }
                        >
                          {m.m}
                        </p>
                        {!dense && <CopyButton text={m.m} />}
                      </div>
                      {!dense && (
                        <>
                          <p className="mt-1.5 text-xs text-navy-500">
                            {[m.y, m.t, m.r].filter(Boolean).join(' · ')}
                            {m.w ? ' · World Schools Debating Championships' : ''}
                          </p>
                          {m.hi ? (
                            <InfoSlide id={m.id} slides={slides} onNeedSlides={loadSlides} />
                          ) : null}
                        </>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
            {results.length > visible && (
              <button
                type="button"
                onClick={() => setVisible((v) => v + 120)}
                className="mt-6 w-full rounded-sm border border-navy-900 py-3 font-semibold text-navy-900 transition hover:bg-navy-900 hover:text-white"
              >
                Show more ({(results.length - visible).toLocaleString('en-US')} remaining)
              </button>
            )}
          </>
        )}
      </div>

      {selected.size > 0 && (
        <div className="sticky bottom-0 z-20 mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-sm bg-navy-900 px-5 py-3 text-white shadow-[0_-8px_24px_-16px_rgba(13,34,64,0.6)]">
          <p className="text-sm font-semibold">
            Practice set ·{' '}
            <span className="stat font-display text-base font-bold">{selected.size}</span>{' '}
            {selected.size === 1 ? 'motion' : 'motions'}
          </p>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(setAsText()).then(() => {
                setSetCopied(true);
                setTimeout(() => setSetCopied(false), 1600);
              });
            }}
            className="rounded-sm bg-signal-500 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-signal-600 active:scale-[0.98]"
          >
            {setCopied ? 'Copied' : 'Copy set'}
          </button>
          <button
            type="button"
            onClick={printSet}
            className="rounded-sm border border-white/30 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:border-white/70"
          >
            Print set
          </button>
          <button
            type="button"
            onClick={() => setSelected(new Map())}
            className="ml-auto text-xs font-semibold text-white/70 underline decoration-white/30 underline-offset-4 transition-colors hover:text-white"
          >
            Clear set
          </button>
        </div>
      )}

      {/* Print-only handout, portaled to <body> so print CSS can swap the
          whole page for it (see globals.css: .motion-set-sheet). Portals are
          client-only; the document guard keeps SSR happy. */}
      {typeof document !== 'undefined' &&
        selected.size > 0 &&
        createPortal(
          <div className="motion-set-sheet" aria-hidden="true">
            <p className="mss-brand">WSDC Prep · wsdcacademy.com/motions</p>
            <h1 className="mss-title">Practice motion set</h1>
            <p className="mss-meta">
              {selected.size} {selected.size === 1 ? 'motion' : 'motions'} · printed{' '}
              {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <ol className="mss-list">
              {[...selected.values()].map((m) => (
                <li key={m.id}>
                  <p className="mss-motion">{m.m}</p>
                  <p className="mss-src">
                    {[m.y, m.t, m.r].filter(Boolean).join(' · ')}
                    {m.w ? ' · World Schools Debating Championships' : ''}
                  </p>
                </li>
              ))}
            </ol>
          </div>,
          document.body,
        )}
    </div>
  );
}
