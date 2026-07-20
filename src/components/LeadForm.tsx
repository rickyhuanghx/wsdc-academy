'use client';

import { useState } from 'react';
import { CONTACT_EMAIL } from '@/lib/site';
import { trackEvent } from '@/lib/analytics';

interface Field {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'select' | 'textarea';
  required?: boolean;
  options?: string[];
  placeholder?: string;
}

interface LeadFormProps {
  endpoint: string; // e.g. /api/contact
  fields: Field[];
  submitLabel: string;
  successMessage: string;
}

export function LeadForm({ endpoint, fields, submitLabel, successMessage }: LeadFormProps) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');

    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) trackEvent('lead_form_submitted', { form_endpoint: endpoint });
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-xl border border-navy-100 bg-white p-8 text-center">
        <p className="text-3xl">✓</p>
        <h2 className="mt-3 text-xl font-bold text-navy-900">Thank you!</h2>
        <p className="mt-2 text-navy-600">{successMessage}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-navy-100 bg-white p-8">
      {/* Honeypot — humans never see this field */}
      <input
        type="text"
        name="website_url"
        tabIndex={-1}
        autoComplete="off"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        aria-hidden="true"
      />

      {fields.map((field) => (
        <div key={field.name}>
          <label htmlFor={field.name} className="block text-sm font-semibold text-navy-900">
            {field.label}
            {field.required && <span className="text-signal-500"> *</span>}
          </label>
          {field.type === 'select' ? (
            <select
              id={field.name}
              name={field.name}
              required={field.required}
              defaultValue=""
              className="mt-1.5 w-full rounded-md border border-navy-200 bg-cream px-3.5 py-2.5 text-sm text-navy-900 focus:border-signal-500 focus:outline-none"
            >
              <option value="" disabled>
                Select…
              </option>
              {field.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : field.type === 'textarea' ? (
            <textarea
              id={field.name}
              name={field.name}
              required={field.required}
              rows={4}
              placeholder={field.placeholder}
              className="mt-1.5 w-full rounded-md border border-navy-200 bg-cream px-3.5 py-2.5 text-sm text-navy-900 focus:border-signal-500 focus:outline-none"
            />
          ) : (
            <input
              id={field.name}
              name={field.name}
              type={field.type}
              required={field.required}
              placeholder={field.placeholder}
              className="mt-1.5 w-full rounded-md border border-navy-200 bg-cream px-3.5 py-2.5 text-sm text-navy-900 focus:border-signal-500 focus:outline-none"
            />
          )}
        </div>
      ))}

      {status === 'error' && (
        <p className="text-sm font-medium text-signal-600">
          Something went wrong. Please try again, or email us at {CONTACT_EMAIL}.
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full rounded-md bg-signal-500 px-6 py-3.5 font-semibold text-white transition hover:bg-signal-600 active:scale-[0.98] disabled:opacity-60"
      >
        {status === 'submitting' ? 'Sending…' : submitLabel}
      </button>
    </form>
  );
}
