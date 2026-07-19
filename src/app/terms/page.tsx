import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPage, LegalSection } from '@/components/LegalPage';
import { CONTACT_EMAIL, SITE_NAME } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'The terms that govern WSDC Prep enrollment, payment, class conduct, and use of wsdcacademy.com.',
  alternates: { canonical: '/terms' },
  openGraph: {
    title: 'Terms of Service | WSDC Prep',
    description: 'The terms that govern WSDC Prep enrollment, payment, and use of the site.',
    url: '/terms',
  },
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" lastUpdated="July 11, 2026">
      <LegalSection title="1. Agreement to terms">
        <p>
          By using wsdcacademy.com or enrolling in our programs, you agree to these Terms of
          Service. If you do not agree, please do not use the site or the services.
        </p>
      </LegalSection>

      <LegalSection title="2. What we provide">
        <p>
          {SITE_NAME} provides online coaching for World Schools Debate: live small-group
          classes, private coaching sessions, judged practice rounds with written feedback,
          and related teaching materials. All instruction is delivered online.
        </p>
      </LegalSection>

      <LegalSection title="3. Eligibility and parental consent">
        <p>
          Programs are designed for students roughly ages 11 to 18. Enrollment and payment
          must be completed by a parent or legal guardian, who accepts these terms on the
          student&apos;s behalf.
        </p>
      </LegalSection>

      <LegalSection title="4. Enrollment and payment">
        <h3>Pricing</h3>
        <p>
          All prices are in US dollars. Prices may change, but the price shown at checkout is
          the price you pay for that purchase.
        </p>
        <h3>What a purchase covers</h3>
        <p>
          Each enrollment is a one-time purchase of a defined unit: a Foundation term, a
          Competition Team term, a summer bootcamp, or a five-session 1-on-1 coaching pack.
          Nothing renews automatically, and we never charge your card again without a new
          checkout.
        </p>
        <h3>Processing</h3>
        <p>
          Payments are processed securely by Stripe at the time of enrollment. Refunds and
          withdrawals are governed by our{' '}
          <Link href="/refund">Refund Policy</Link>.
        </p>
      </LegalSection>

      <LegalSection title="5. Scheduling, attendance, and conduct">
        <ul>
          <li>Students are expected to attend scheduled sessions on time; make-up sessions are offered at our discretion</li>
          <li>We may reschedule a session when a coach is unavailable, and will tell you as early as we can</li>
          <li>Respectful behavior toward coaches and other students is required; disruptive behavior may result in removal from a class</li>
          <li>Recording live classes without permission is prohibited</li>
        </ul>
      </LegalSection>

      <LegalSection title="6. Intellectual property">
        <p>
          The content on this site and in our programs (lesson materials, cheat sheets,
          feedback templates, articles, and recordings) belongs to {SITE_NAME} and is
          protected by intellectual property law. It is licensed to enrolled families for
          personal educational use. You may print our free resources for your own team; you
          may not republish, resell, or redistribute any of it without written permission.
        </p>
      </LegalSection>

      <LegalSection title="7. Independence and no guaranteed results">
        <p>
          {SITE_NAME}{' '}
          is an independent coaching service. We are not affiliated with, endorsed by, or
          officially connected to the National Speech &amp; Debate Association, the World
          Schools Debating Championships, USA Debate, the Tournament of Champions, or any
          tournament or league we write about.
        </p>
        <p>
          We train students seriously, and we cannot guarantee specific outcomes: tournament
          results, qualification, or selection to any team depend on many factors beyond
          coaching.
        </p>
      </LegalSection>

      <LegalSection title="8. Limitation of liability">
        <p>
          To the maximum extent permitted by law, {SITE_NAME} is not liable for indirect,
          incidental, special, consequential, or punitive damages arising from your use of
          the services. Our total liability for any claim is limited to the amount you paid
          for the services in question.
        </p>
      </LegalSection>

      <LegalSection title="9. Changes to these terms">
        <p>
          We may update these terms. Material changes will be posted on this page with a new
          &quot;Last updated&quot; date, and continued use of the services after a change
          constitutes acceptance.
        </p>
      </LegalSection>

      <LegalSection title="10. Termination">
        <p>
          We may suspend or end access to our services for conduct that violates these terms
          or is harmful to students, coaches, or the academy. If we terminate an enrollment
          for a reason other than a conduct violation, we will refund the unused portion.
        </p>
      </LegalSection>

      <LegalSection title="11. Governing law">
        <p>
          These terms are governed by the laws of the jurisdiction in which {SITE_NAME} is
          organized, without regard to conflict-of-law rules. Disputes will be resolved in
          the courts of that jurisdiction.
        </p>
      </LegalSection>

      <LegalSection title="12. Contact">
        <p>
          Questions about these terms: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
