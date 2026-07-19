import type { Metadata } from 'next';
import { LegalPage, LegalSection } from '@/components/LegalPage';
import { CONTACT_EMAIL, SITE_NAME } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How WSDC Prep collects, uses, and protects personal information from consultation bookings, contact forms, and enrollment checkout.',
  alternates: { canonical: '/privacy' },
  openGraph: {
    title: 'Privacy Policy | WSDC Prep',
    description: 'How WSDC Prep collects, uses, and protects personal information.',
    url: '/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" lastUpdated="July 11, 2026">
      <LegalSection title="1. Introduction">
        <p>
          {SITE_NAME} (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to
          protecting your privacy. This policy explains what information we collect through
          wsdcacademy.com, how we use it, and the choices you have.
        </p>
      </LegalSection>

      <LegalSection title="2. Information we collect">
        <h3>Information you provide</h3>
        <p>We collect personal information when you:</p>
        <ul>
          <li>Book a consultation (the name, email, and any scheduling details you provide when booking a call)</li>
          <li>Send a message through the contact form (name, email, phone, your message)</li>
          <li>Enroll in a program at checkout (parent name, email, phone, and each student&apos;s name, grade level, and school)</li>
        </ul>
        <h3>Payment information</h3>
        <p>
          Payments are processed by Stripe. Your card details go directly to Stripe and never
          touch our servers; we receive only a payment reference, the amount, and the contact
          and student details you enter at checkout.
        </p>
        <h3>Automatically collected information</h3>
        <p>
          Our hosting provider records standard server logs (IP address, browser type, pages
          requested). Our forms record the submitting IP address for spam prevention. We do
          not run advertising trackers or third-party analytics scripts on this site.
        </p>
      </LegalSection>

      <LegalSection title="3. How we use your information">
        <ul>
          <li>To schedule and run consultations and enrolled programs</li>
          <li>To process payments and send enrollment confirmations and receipts</li>
          <li>To respond to your questions and requests</li>
          <li>To place students in the right class and track their coaching feedback</li>
          <li>To prevent spam and abuse of our forms</li>
        </ul>
        <p>We send marketing email only if you have asked for it, and you can opt out at any time.</p>
      </LegalSection>

      <LegalSection title="4. How we share information">
        <p>
          We do not sell, trade, or rent personal information. We share it only with the
          service providers that run this site on our behalf, and only as needed:
        </p>
        <ul>
          <li>Calendly (consultation scheduling)</li>
          <li>Stripe (payment processing)</li>
          <li>Supabase (secure storage of enrollment and inquiry records)</li>
          <li>Resend (transactional email delivery)</li>
          <li>Netlify (website hosting)</li>
        </ul>
        <p>
          We may also disclose information when required by law, or in connection with a
          merger or sale of the business, and otherwise only with your consent.
        </p>
      </LegalSection>

      <LegalSection title="5. Data security">
        <p>
          We use appropriate technical and organizational measures to protect your
          information, including encrypted connections (HTTPS) and access-restricted storage.
          No method of transmission or storage is completely secure, and we cannot guarantee
          absolute security.
        </p>
      </LegalSection>

      <LegalSection title="6. Children's privacy">
        <p>
          Our services are for students roughly ages 11 to 18, enrolled by a parent or
          guardian. Our forms and checkout are designed for parents; we do not knowingly
          collect personal information directly from children under 13 without parental
          consent. If you believe a child has submitted information to us directly, contact
          us and we will delete it.
        </p>
      </LegalSection>

      <LegalSection title="7. Your rights">
        <p>Depending on where you live, you may have the right to:</p>
        <ul>
          <li>Access the personal information we hold about you</li>
          <li>Ask us to correct or delete it</li>
          <li>Object to or restrict how we process it</li>
          <li>Withdraw consent at any time</li>
        </ul>
        <p>
          Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and we will respond
          to any request within 30 days.
        </p>
      </LegalSection>

      <LegalSection title="8. Cookies">
        <p>
          This site does not set advertising or analytics cookies. During checkout, Stripe
          may set cookies needed for payment security and fraud prevention. You can block
          cookies in your browser, though checkout may not work without Stripe&apos;s.
        </p>
      </LegalSection>

      <LegalSection title="9. Changes to this policy">
        <p>
          If we change this policy, we will post the new version here and update the
          &quot;Last updated&quot; date above.
        </p>
      </LegalSection>

      <LegalSection title="10. Contact">
        <p>
          Questions about this policy or your data:{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
