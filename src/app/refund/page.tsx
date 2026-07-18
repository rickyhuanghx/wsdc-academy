import type { Metadata } from 'next';
import { LegalPage, LegalSection } from '@/components/LegalPage';
import { CONTACT_EMAIL, SITE_NAME } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Refund Policy',
  description:
    'WSDC Academy refund and withdrawal policy: full refunds within 7 days of enrollment, pro-rated refunds to the program midpoint, and how to request one.',
  alternates: { canonical: '/refund' },
  openGraph: {
    title: 'Refund Policy | WSDC Academy',
    description:
      'Full refunds within 7 days of enrollment, pro-rated refunds to the program midpoint, and how to request one.',
    url: '/refund',
  },
};

const summary = [
  {
    label: 'Full refund',
    detail: 'Within 7 days of enrollment, and before the student has attended a second session',
  },
  {
    label: 'Pro-rated refund',
    detail: 'After that, up to the program midpoint: unused portion minus a 15% administrative fee',
  },
  {
    label: 'No refund',
    detail: 'After the program midpoint (half the sessions completed)',
  },
];

export default function RefundPage() {
  return (
    <LegalPage
      title="Refund Policy"
      lastUpdated="July 11, 2026"
      intro="Circumstances change. This policy is designed to be fair, and to be readable before you pay rather than after."
    >
      <div className="mb-10">
        {summary.map((s) => (
          <div key={s.label} className="flex gap-5 border-t border-navy-100 py-4">
            <span className="w-36 shrink-0 font-bold text-navy-900">{s.label}</span>
            <span className="text-navy-700">{s.detail}</span>
          </div>
        ))}
      </div>

      <LegalSection title="Group programs (Foundation, Competition Team, Summer Bootcamp)">
        <h3>Full refund</h3>
        <p>You are eligible for a full refund if all of the following are true:</p>
        <ul>
          <li>You request it within 7 days of enrollment</li>
          <li>The student has attended no more than one session</li>
          <li>You request it by email (see below)</li>
        </ul>
        <h3>Pro-rated refund</h3>
        <p>
          After the full-refund window and up to the program midpoint, we refund the unused
          portion of the fee minus a 15% administrative fee, calculated by sessions
          remaining.
        </p>
        <h3>After the midpoint</h3>
        <p>
          No refunds are available once half the program&apos;s sessions have run. The
          student is welcome to attend the remainder of the program.
        </p>
      </LegalSection>

      <LegalSection title="1-on-1 coaching packs">
        <p>
          Five-session packs are refundable in full within 7 days of purchase if no session
          has been used. After that, unused sessions are refunded at their pro-rated value
          minus a 15% administrative fee. Completed sessions are non-refundable.
        </p>
      </LegalSection>

      <LegalSection title="Consultations">
        <p>Consultations are free. There is nothing to refund and no obligation to enroll.</p>
      </LegalSection>

      <LegalSection title="If we cancel or reschedule">
        <p>
          If {SITE_NAME} cancels a program before it starts, you receive a full refund,
          including any fees. If we cancel individual sessions and cannot offer a make-up,
          we refund those sessions at their pro-rated value with no administrative fee.
        </p>
      </LegalSection>

      <LegalSection title="Special circumstances">
        <p>
          Medical emergencies, family emergencies, relocation, and verified technical
          problems that prevent attendance are handled case by case, and we aim to be
          generous. Email us and explain the situation.
        </p>
      </LegalSection>

      <LegalSection title="Transfers instead of refunds">
        <p>As an alternative to a refund, you can ask to transfer an enrollment to:</p>
        <ul>
          <li>A different program of equal or lesser value</li>
          <li>A later term or block, subject to availability</li>
          <li>A sibling or another student, with our approval</li>
        </ul>
        <p>
          Transfer requests should reach us at least 7 days before the program starts. A 10%
          transfer fee may apply.
        </p>
      </LegalSection>

      <LegalSection title="How to request a refund">
        <p>
          Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> with the parent name
          and email used at enrollment, the program, the enrollment date, and the reason. We
          respond within 5 business days; approved refunds go back to the original payment
          method, typically within 10 business days.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
