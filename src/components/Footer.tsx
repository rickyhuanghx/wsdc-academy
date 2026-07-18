import Link from 'next/link';
import { CONTACT_EMAIL, SITE_NAME } from '@/lib/site';

export function Footer() {
  return (
    <footer className="bg-navy-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-6">
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-9 w-9 items-center justify-center rounded-sm bg-white font-display text-lg font-semibold text-navy-900">
                W
                <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-signal-500" />
              </span>
              <span className="font-display text-xl font-semibold tracking-tight">
                WSDC Academy
              </span>
            </div>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-navy-200">
              A real training system for World Schools Debate: structured
              curriculum, judged practice rounds, and written feedback after
              every session. Year-round online coaching for US students.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-navy-300">Programs</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link href="/programs/summer-bootcamp" className="text-navy-100 hover:text-white">Summer Bootcamp</Link></li>
              <li><Link href="/programs/foundations" className="text-navy-100 hover:text-white">Foundation</Link></li>
              <li><Link href="/programs/competition-team" className="text-navy-100 hover:text-white">Competition Team</Link></li>
              <li><Link href="/programs/national-team-sprint" className="text-navy-100 hover:text-white">National Team Sprint</Link></li>
              <li><Link href="/programs/private-coaching" className="text-navy-100 hover:text-white">1-on-1 Coaching</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-navy-300">Guides</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link href="/what-is-world-schools-debate" className="text-navy-100 hover:text-white">What is World Schools Debate?</Link></li>
              <li><Link href="/world-schools-vs-public-forum" className="text-navy-100 hover:text-white">World Schools vs Public Forum</Link></li>
              <li><Link href="/world-schools-debate-judging" className="text-navy-100 hover:text-white">How Judging Works (40/40/20)</Link></li>
              <li><Link href="/usa-debate-team" className="text-navy-100 hover:text-white">How to Make the USA Debate Team</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-navy-300">Resources</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link href="/blog" className="text-navy-100 hover:text-white">Blog</Link></li>
              <li><Link href="/resources" className="text-navy-100 hover:text-white">Resource Library</Link></li>
              <li><Link href="/resources/first-speaker-cheat-sheet" className="text-navy-100 hover:text-white">Speaker Cheat Sheets</Link></li>
              <li><Link href="/resources/practice-motions" className="text-navy-100 hover:text-white">Practice Motions</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-navy-300">Academy</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link href="/about" className="text-navy-100 hover:text-white">About Us</Link></li>
              <li><Link href="/coaches" className="text-navy-100 hover:text-white">Our Coaches</Link></li>
              <li><Link href="/faq" className="text-navy-100 hover:text-white">FAQ</Link></li>
              <li><Link href="/contact" className="text-navy-100 hover:text-white">Contact</Link></li>
              <li><Link href="/consultation" className="text-navy-100 hover:text-white">Book a Consultation</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-navy-800 pt-8 text-xs text-navy-300 sm:flex-row">
          <p>© {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/refund" className="hover:text-white">Refund Policy</Link>
            <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-white">
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
