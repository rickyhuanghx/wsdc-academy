// Shared client-side loader for the core motion JSON. Both the draw widget
// and the explorer mount on /motions; a module-level promise keeps the ~2.7 MB
// file to a single fetch per page load.
export interface CoreMotion {
  id: number;
  m: string;
  y: number | null;
  t: string;
  r: string;
  c: string;
  top: string[];
  ty: string;
  /** 1 = an info slide exists in the lazy-loaded slides file. */
  hi?: number;
  /** 1 = set at the World Schools Debating Championships. */
  w?: number;
}

let corePromise: Promise<CoreMotion[]> | null = null;

export function loadCoreMotions(): Promise<CoreMotion[]> {
  if (!corePromise) {
    corePromise = fetch('/motion-bank-core.json')
      .then((r) => {
        if (!r.ok) throw new Error(`motion bank fetch failed: ${r.status}`);
        return r.json() as Promise<{ motions: CoreMotion[] }>;
      })
      .then((d) => d.motions)
      .catch((err) => {
        // Allow a retry on the next call instead of caching the failure.
        corePromise = null;
        throw err;
      });
  }
  return corePromise;
}
