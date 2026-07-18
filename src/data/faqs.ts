// FAQ content — drives /faq, the homepage FAQ section, and FAQ JSON-LD.
// Facts below were verified against NSDA/TFA/WSDC sources in June 2026; if rules change, update here only.

export interface FAQ {
  question: string;
  answer: string;
  category: 'format' | 'pathway' | 'programs' | 'logistics';
  onHomepage?: boolean;
}

export const faqs: FAQ[] = [
  {
    question: 'What is World Schools Debate?',
    answer:
      'World Schools Debate is the international debate format used at the World Schools Debating Championships, where roughly 60 national teams compete each year. Teams of three (from rosters of 3–5) debate motions phrased as “This House…”, some prepared in advance and some impromptu with one hour of prep. Each debater gives an 8-minute speech, followed by 4-minute reply speeches. In the US, it is an official NSDA event with its own competition at the National Tournament.',
    category: 'format',
    onHomepage: true,
  },
  {
    question: 'How is World Schools different from Public Forum or Lincoln-Douglas?',
    answer:
      'Three big differences: it’s a three-speaker team format rather than partners or solo; judging explicitly weighs Style at 40%, Content at 40%, and Strategy at 20%, so persuasive delivery matters as much as evidence; and roughly half the motions are impromptu, released one hour before the round with no internet or coach help allowed, so students have to think on their feet rather than lean on research. Many of our students convert from PF or LD and find the skills transfer directly.',
    category: 'format',
    onHomepage: true,
  },
  {
    question: 'What is USA Debate and how do students make the team?',
    answer:
      'USA Debate is the NSDA-run national team that represents the United States at the World Schools Debating Championships. The team won the world title in 2023. Students apply each spring (the 2026–27 application window ran April 1 to June 25) with an online application, coach recommendations, and video recordings responding to three provided motions. Applicants must be active NSDA members, US citizens or longtime permanent residents, and within the WSDC age window. Strong applicants who aren’t selected may be offered the Development Team.',
    category: 'pathway',
    onHomepage: true,
  },
  {
    question: 'How does World Schools work at NSDA Nationals?',
    answer:
      'The event is the USA World Schools Debate Invitational, held at the NSDA National Tournament each June. Every NSDA district may enter up to two teams of 3–5 students. Prepared motions are published in advance on the NSDA topics page; impromptu motions are released one hour before the round.',
    category: 'pathway',
  },
  {
    question: 'Which states have World Schools divisions?',
    answer:
      'World Schools is growing fast at the state level. Texas (TFA) runs a full points-qualified World Schools division through to TFA State; Florida offers it at the FFL Varsity State Championship; Indiana contests it at the ISSDA State Debate Tournament. The Tournament of Champions added a World Schools division in 2025. Every NSDA district nationwide can also qualify teams to Nationals.',
    category: 'pathway',
  },
  {
    question: 'My student has never debated before. Where should they start?',
    answer:
      'World Schools Foundations, our 8-week introduction for ages 11–15. It assumes zero debate experience and ends with judged practice rounds. Students coming from PF, LD, or MUN can usually start there too, or jump straight to the Competition Team after a placement conversation with our coaches.',
    category: 'programs',
    onHomepage: true,
  },
  {
    question: 'Are classes online? What time zones do you serve?',
    answer:
      'All programs run live online, scheduled for US time zones: evenings ET/CT/PT on weekdays plus weekend slots. We are a US-based program; sessions are built around American school schedules and the American competitive calendar (district qualifiers, state series, NSDA Nationals).',
    category: 'logistics',
    onHomepage: true,
  },
  {
    question: 'Who are the coaches?',
    answer:
      'Every coach has competed or adjudicated at international level in the World Schools format or its university equivalents. The team includes a former Director of Training at the Oxford Union, a former Columbia Debate Society head coach, competitors from Harvard, Yale, Brown, Oxford, and LSE, and coaches with national-squad coaching experience.',
    category: 'programs',
    onHomepage: true,
  },
  {
    question: 'Do you offer a free consultation?',
    answer:
      'Yes. Every new student starts with a free consultation. We’ll learn about your student, answer your questions about the format, and recommend the right place to start before you pay anything.',
    category: 'logistics',
  },
  {
    question: 'Can you coach our whole school team?',
    answer:
      'Yes. We coach school squads preparing for district and state World Schools competition: weekly team practices, motion prep support, and tournament-week coaching. Contact us and we’ll scope a program for your team.',
    category: 'programs',
  },
];

export const homepageFaqs = faqs.filter((f) => f.onHomepage);
