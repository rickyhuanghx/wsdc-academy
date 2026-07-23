'use client';

// Client-side search and filter over the full motion bank. The data ships as
// two static JSON files in /public: a core file (all motions, no info slides)
// fetched on first interaction with the tool, and the info-slide file fetched
// only when a user first expands one. Server-rendered pages under /motions
// carry the crawlable listings; this component is the working tool on top.
import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { motionTopics, MOTION_TYPE_LABELS } from '@/lib/motion-bank';

interface CoreMotion {
  id: number;
  m: string;
  y: number | null;
  t: string;
  r: string;
  c: string;
  top: string[];
  ty: string;
  hi?: number;
  w?: number;
}

const PAGE_SIZE = 60;

const TYPE_OPTIONS = ['policy', 'value', 'actor', 'regret'] as const;

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

  const [q, setQ] = useState('');
  const [topic, setTopic] = useState('');
  const [type, setType] = useState('');
  const [year, setYear] = useState('');
  const [wsdcOnly, setWsdcOnly] = useState(false);
  const [infoslideOnly, setInfoslideOnly] = useState(false);
  const [order, setOrder] = useState<number[] | null>(null);
  const [visible, setVisible] = useState(PAGE_SIZE);

  useEffect(() => {
    let cancelled = false;
    fetch('/motion-bank-core.json')
      .then((r) => r.json())
      .then((d: { motions: CoreMotion[] }) => {
        if (!cancelled) setAll(d.motions);
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
    const needle = q.trim().toLowerCase();
    let out = all.filter((m) => {
      if (topic && !m.top.includes(topic)) return false;
      if (type && m.ty !== type) return false;
      if (year && String(m.y) !== year) return false;
      if (wsdcOnly && !m.w) return false;
      if (infoslideOnly && !m.hi) return false;
      if (needle && !m.m.toLowerCase().includes(needle) && !m.t.toLowerCase().includes(needle))
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
  }, [all, q, topic, type, year, wsdcOnly, infoslideOnly, order]);

  const resetPaging = () => setVisible(PAGE_SIZE);

  const selectClass =
    'rounded-sm border border-navy-200 bg-white px-3 py-2 text-sm text-navy-800 focus:border-navy-500 focus:outline-none';

  return (
    <div className="rounded-sm border border-navy-200 bg-white p-5 sm:p-7">
      <div className="flex flex-col gap-3">
        <input
          type="search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            resetPaging();
          }}
          placeholder="Search motions by keyword, phrase, or tournament (try “nuclear”, “social media”, “WSDC”)"
          className="w-full rounded-sm border border-navy-200 bg-white px-4 py-3 text-navy-900 placeholder:text-navy-400 focus:border-navy-500 focus:outline-none"
          aria-label="Search motions"
        />
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={topic}
            onChange={(e) => {
              setTopic(e.target.value);
              resetPaging();
            }}
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
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              resetPaging();
            }}
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
            value={year}
            onChange={(e) => {
              setYear(e.target.value);
              resetPaging();
            }}
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
              checked={wsdcOnly}
              onChange={(e) => {
                setWsdcOnly(e.target.checked);
                resetPaging();
              }}
              className="h-4 w-4 accent-signal-500"
            />
            Worlds (WSDC) only
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-navy-700">
            <input
              type="checkbox"
              checked={infoslideOnly}
              onChange={(e) => {
                setInfoslideOnly(e.target.checked);
                resetPaging();
              }}
              className="h-4 w-4 accent-signal-500"
            />
            Has info slide
          </label>
          <button
            type="button"
            onClick={() => {
              if (!all) return;
              setOrder(shuffle(all.map((m) => m.id)));
              resetPaging();
            }}
            className="rounded-sm border border-navy-900 px-4 py-2 text-sm font-semibold text-navy-900 transition hover:bg-navy-900 hover:text-white"
          >
            Shuffle
          </button>
        </div>
      </div>

      <div className="mt-5 border-t-2 border-navy-900 pt-4">
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
            <p className="text-sm font-semibold uppercase tracking-wider text-navy-500">
              {results.length.toLocaleString('en-US')}{' '}
              {results.length === 1 ? 'motion' : 'motions'}
              {order ? ', shuffled' : ', newest first'}
            </p>
            <ol className="mt-4 space-y-4">
              {results.slice(0, visible).map((m) => (
                <li key={m.id} className="border-t border-navy-200 pt-4">
                  <div className="flex items-start justify-between gap-4">
                    <p className="font-display italic leading-relaxed text-navy-800">{m.m}</p>
                    <CopyButton text={m.m} />
                  </div>
                  <p className="mt-1.5 text-xs text-navy-500">
                    {[m.y, m.t, m.r].filter(Boolean).join(' · ')}
                    {m.w ? ' · World Schools Debating Championships' : ''}
                  </p>
                  {m.hi ? <InfoSlide id={m.id} slides={slides} onNeedSlides={loadSlides} /> : null}
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
    </div>
  );
}
