// Midterm check-in: answer key and marking notes. COACHES ONLY.
//
// Imported by src/app/api/self-report/route.ts and nothing else. Never import
// this from a client component or from src/lib/self-report.ts: anything that
// reaches the browser bundle is visible to a student who opens devtools. The
// build is checked for this (see the "key must not reach the client" note in
// CLAUDE.md).
//
// Source: "WSDC Academy Midterm Check-in: Question Bank" (owner, 2026-10-10).

import { QUIZ_QUESTIONS, type OptionKey } from '@/lib/self-report';

interface KeyEntry {
  answer: OptionKey;
  /** Which Part A skill the question checks, for the coach's comparison. */
  skill: string;
  why: string;
}

export const QUIZ_KEY: Readonly<Record<string, KeyEntry>> = {
  q1: { answer: 'A', skill: 'A1', why: 'First Proposition opens; the sides then alternate.' },
  q2: { answer: 'D', skill: 'A1', why: 'Substantive speeches are 8 minutes; check each tournament, as junior events often run shorter.' },
  q3: { answer: 'D', skill: 'A10', why: 'No POIs in the first or last minute, and none in reply speeches.' },
  q4: { answer: 'A', skill: 'A4', why: 'Only the first or second speaker may reply; never the third.' },
  q5: { answer: 'C', skill: 'A4', why: 'Opposition replies first, so Proposition has the last word.' },
  q6: { answer: 'D', skill: 'A4', why: 'Replies look back on the debate; no new arguments.' },
  q7: { answer: 'A', skill: 'A5', why: 'THW is a policy motion: Prop shows the change is better on balance.' },
  q8: { answer: 'A', skill: 'A5', why: "THR compares today's world with one where the thing never happened." },
  q9: { answer: 'C', skill: 'A6', why: 'Prop 1 frames: definitions, context, burdens, team split.' },
  q10: { answer: 'B', skill: 'A2', why: 'Agree meaning, burdens and arguments together before splitting.' },
  q11: { answer: 'B', skill: 'A7', why: 'The mechanism explains how the claim happens.' },
  q12: { answer: 'D', skill: 'A8', why: 'Names who is affected, how badly and that it compounds.' },
  q13: { answer: 'A', skill: 'A9', why: 'Compares the two sides’ impacts directly.' },
  q14: { answer: 'C', skill: 'A17', why: 'WSDC judges reward explained reasoning over unexplained data.' },
  q15: { answer: 'B', skill: 'A4, A15', why: 'Strong replies are organised by clashes, not by speeches.' },
  q16: { answer: 'C', skill: 'A9', why: 'Reversibility: a permanent harm outweighs a fixable one.' },
};

export const QUIZ_TOTAL = QUIZ_QUESTIONS.length;

export interface QuizResult {
  score: number;
  total: number;
  /** question id -> whether the student's answer matched the key */
  correct: Record<string, boolean>;
}

export function gradeQuiz(answers: Record<string, OptionKey>): QuizResult {
  const correct: Record<string, boolean> = {};
  let score = 0;
  for (const q of QUIZ_QUESTIONS) {
    const ok = answers[q.id] === QUIZ_KEY[q.id]?.answer;
    correct[q.id] = ok;
    if (ok) score += 1;
  }
  return { score, total: QUIZ_TOTAL, correct };
}

/**
 * What a 2-mark Explain line includes (0 to 2 each, 18 in total). Goes into
 * the staff email under each student answer so the coach can mark in place.
 */
export const EXPLAIN_GUIDE: Readonly<Record<string, string>> = {
  a1: 'Prop 1, Opp 1, Prop 2, Opp 2, Prop 3, Opp 3 (8 min each), then Opp reply and Prop reply (4 min each).',
  a2: 'Joint start (meaning, burdens, both sides’ arguments), then team line and split, then individual writing, then a regroup to check consistency and predict the other side.',
  a3: 'An honest time plus a specific gap, e.g. "I run out of mechanism after 5 minutes" or "I never reach rebuttal".',
  a4: 'Summarises the key clashes from the team’s view and explains why they won; no new arguments; given by speaker 1 or 2; structured by clash.',
  a5: 'THW: the policy is better on balance. THBT: the statement is true, no policy needed. THR: the world would be better if it had not happened.',
  a6: 'Framing defines terms, sets context and burdens, and tells the judge what the debate is about; the two sentences actually do that for the homework motion.',
  a7: 'Mechanism is the step-by-step "why" or "how" that makes the claim true, with a "because… so…" style example.',
  a8: 'Impact is the consequence: who is affected, how much, how badly; judges need it to compare arguments.',
  a9: 'Weighing compares arguments to show which matters more; names two metrics such as scope, severity, probability, reversibility, timeframe or vulnerability of those affected.',
};

/** Part C rubric, 0 to 2 per prompt (12 in total). Bands: 0 to 4 building foundations, 5 to 8 developing, 9 to 12 secure. */
export const MOTION_RUBRIC: Readonly<Record<string, { one: string; two: string }>> = {
  c1: { one: 'Names the motion type', two: 'Also states correctly what Prop must prove' },
  c2: { one: 'Defines terms', two: 'Also identifies what the debate is really about' },
  c3: { one: 'Claim and impact, mechanism thin or restates the claim', two: 'Mechanism explains why it happens; impact says who and how much' },
  c4: { one: 'As C3', two: 'As C3' },
  c5: { one: 'A topic area ("the economy")', two: 'A precise question both sides must answer' },
  c6: { one: 'Asserts one argument matters more', two: 'Compares both using a named metric' },
};
