import Link from 'next/link';
import Image from 'next/image';
import { ARTICLE_AUTHOR, formatArticleDate } from '@/data/author';

/** Visible author byline for guides and blog posts. `variant="onDark"` recolors
    it for the navy hero on /what-is-world-schools-debate; default suits white. */
export function ArticleByline({
  date,
  variant = 'light',
}: {
  date?: string;
  variant?: 'light' | 'onDark';
}) {
  const onDark = variant === 'onDark';
  const nameClass = onDark ? 'font-semibold text-white' : 'font-semibold text-navy-900';
  const linkClass = onDark
    ? 'underline decoration-signal-400 underline-offset-2 hover:text-white'
    : 'hover:text-signal-600';
  const metaClass = onDark ? 'text-navy-200' : 'text-navy-500';

  return (
    <div className="mt-6 flex items-center gap-3">
      <Image
        src={ARTICLE_AUTHOR.image}
        alt={ARTICLE_AUTHOR.name}
        width={44}
        height={44}
        className="h-11 w-11 shrink-0 rounded-full object-cover ring-1 ring-black/5"
      />
      <div className="text-sm leading-snug">
        <p className={nameClass}>
          By{' '}
          <Link href={ARTICLE_AUTHOR.url} className={linkClass}>
            {ARTICLE_AUTHOR.name}
          </Link>
        </p>
        <p className={metaClass}>{ARTICLE_AUTHOR.byline}</p>
        {date && (
          <p className={metaClass}>
            <time dateTime={date}>{formatArticleDate(date)}</time>
          </p>
        )}
      </div>
    </div>
  );
}
