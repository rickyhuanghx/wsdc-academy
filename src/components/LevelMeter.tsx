import type { Program } from '@/data/programs';

// A 3-rung indicator for a program's level. Beginner fills one rung, Intermediate two,
// Advanced three; "All Levels" shows three neutral rungs (it spans the ladder rather than
// sitting on one rung). The text label always accompanies it, so the dots are a quick visual cue.
const FILLED: Record<Program['level'], number> = {
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
  'All Levels': 0,
};

export function LevelMeter({
  level,
  showLabel = true,
}: {
  level: Program['level'];
  showLabel?: boolean;
}) {
  const filled = FILLED[level];
  const neutral = level === 'All Levels';

  return (
    <span className="inline-flex items-center gap-2">
      <span className="inline-flex gap-1" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`h-2 w-2 rounded-full ${
              neutral ? 'bg-navy-300' : i < filled ? 'bg-signal-500' : 'bg-navy-100'
            }`}
          />
        ))}
      </span>
      {showLabel && <span className="text-navy-900">{level}</span>}
    </span>
  );
}
