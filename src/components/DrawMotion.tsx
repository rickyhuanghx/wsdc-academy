'use client';

// "I need a motion now": the first door on /motions. Two filters, one button,
// one motion. Shares the cached core-bank fetch with MotionExplorer.
import { useEffect, useState } from 'react';
import { loadCoreMotions, type CoreMotion } from '@/lib/motion-bank-client';
import { motionTopics, MOTION_TYPE_LABELS } from '@/lib/motion-bank';

const TYPE_OPTIONS = ['policy', 'value', 'actor', 'regret'] as const;

export function DrawMotion() {
  const [all, setAll] = useState<CoreMotion[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [topic, setTopic] = useState('');
  const [type, setType] = useState('');
  const [wsdcOnly, setWsdcOnly] = useState(false);
  const [drawn, setDrawn] = useState<CoreMotion | null>(null);
  const [noMatch, setNoMatch] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const draw = () => {
    if (!all) return;
    const pool = all.filter(
      (m) =>
        (!topic || m.top.includes(topic)) &&
        (!type || m.ty === type) &&
        (!wsdcOnly || m.w),
    );
    if (pool.length === 0) {
      setDrawn(null);
      setNoMatch(true);
      return;
    }
    let next = pool[Math.floor(Math.random() * pool.length)];
    let guard = 0;
    while (pool.length > 1 && drawn && next.id === drawn.id && guard++ < 10) {
      next = pool[Math.floor(Math.random() * pool.length)];
    }
    setDrawn(next);
    setNoMatch(false);
    setCopied(false);
  };

  const selectClass =
    'rounded-sm border border-navy-200 bg-white px-3 py-2 text-sm text-navy-800 focus:border-navy-500 focus:outline-none';

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <select
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className={selectClass}
          aria-label="Topic"
        >
          <option value="">Any topic</option>
          {motionTopics.map((t) => (
            <option key={t.slug} value={t.slug}>
              {t.label}
            </option>
          ))}
        </select>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className={selectClass}
          aria-label="Motion type"
        >
          <option value="">Any type</option>
          {TYPE_OPTIONS.map((t) => (
            <option key={t} value={t}>
              {MOTION_TYPE_LABELS[t]}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={draw}
          disabled={!all && !loadError}
          className="rounded-sm bg-signal-500 px-6 py-2.5 font-semibold text-white transition hover:bg-signal-600 active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
        >
          {all || loadError ? 'Draw a motion' : 'Loading the bank…'}
        </button>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-navy-700">
          <input
            type="checkbox"
            checked={wsdcOnly}
            onChange={(e) => setWsdcOnly(e.target.checked)}
            className="h-4 w-4 accent-signal-500"
          />
          Worlds only
        </label>
      </div>

      {loadError && (
        <p className="mt-4 border-t border-navy-200 pt-3 text-sm text-navy-600">
          The motion data failed to load. Refresh the page to try again.
        </p>
      )}
      {noMatch && (
        <p className="mt-4 border-t border-navy-200 pt-3 text-sm text-navy-600">
          No motion matches both filters. Widen one and draw again.
        </p>
      )}
      {drawn && (
        <div className="mt-4 border-t border-navy-200 pt-3">
          <p className="font-display italic leading-relaxed text-navy-900">{drawn.m}</p>
          <p className="mt-1.5 text-xs text-navy-500">
            {[drawn.y, drawn.t, drawn.r].filter(Boolean).join(' · ')}
            {drawn.w ? ' · World Schools Debating Championships' : ''}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(drawn.m).then(() => {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1600);
                });
              }}
              className="rounded-sm border border-navy-200 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-navy-600 transition-colors hover:border-navy-400 hover:text-navy-900"
            >
              {copied ? 'Copied' : 'Copy motion'}
            </button>
            <button
              type="button"
              onClick={draw}
              className="rounded-sm border border-navy-200 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-navy-600 transition-colors hover:border-navy-400 hover:text-navy-900"
            >
              Another one
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
