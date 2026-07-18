// Single source of truth for the coaching roster.
// Drives the /coaches page, the homepage coaches section, and Person JSON-LD.

export interface Coach {
  name: string;
  slug: string;
  role: string;
  image: string; // path under /public
  credentials: string[];
  isFounder?: boolean;
  /** Short one-liner used on the homepage grid */
  highlight: string;
}

export const coaches: Coach[] = [
  {
    name: 'Ricky Huang',
    slug: 'ricky-huang',
    role: 'Co-Founder & Head of Training',
    image: '/images/coaches/ricky-huang.jpg',
    isFounder: true,
    highlight: 'Former Director of Training, Oxford Union',
    credentials: [
      'Former Director of Training at the Oxford Union',
      'Indo-Pacific Debating Champion',
      '2nd Best Speaker in North America',
      '8th Best Speaker, World University Debating Championship',
    ],
  },
  {
    name: 'Peregrine Beckett',
    slug: 'perry-beckett',
    role: 'Co-Founder & Program Director',
    image: '/images/coaches/perry-beckett.png',
    isFounder: true,
    highlight: 'Former Head Coach, Columbia Debate Society',
    credentials: [
      'Former Head Coach at Columbia Debate Society',
      '3rd Best American University Debater',
      'Tournament of Champions LD Semifinalist',
      'Best Speaker at the Harvard Invitational',
    ],
  },
  {
    name: 'Biser Angelov',
    slug: 'biser-angelov',
    role: 'World Schools Coach',
    image: '/images/coaches/biser-angelov.jpg',
    highlight: 'Bulgarian National Team Coach',
    credentials: [
      'Coach of the Bulgarian National Debate Team',
      'Champion, European University Debating Championships',
      'Top 16 globally at WUDC',
      'Board Member, Bulgarian Debate Association',
    ],
  },
  {
    name: 'Shaurya Chandranvanshi',
    slug: 'shaurya-chandranvanshi',
    role: 'World Schools Coach',
    image: '/images/coaches/shaurya-chandranvanshi.jpg',
    highlight: 'Ex-UAE National Team',
    credentials: [
      'Former member of the UAE National Debate Team',
      'Top 10 Speaker, World University Debating Championship',
      'Chief Adjudicator at international tournaments',
      'Former debater at the London School of Economics',
    ],
  },
  {
    name: 'Netra Easwaran',
    slug: 'netra-easwaran',
    role: 'World Schools Coach',
    image: '/images/coaches/netra-easwaran.jpg',
    highlight: 'Yale Debate Association',
    credentials: [
      'Yale Debate Association member',
      'Director-General, Yale Model United Nations',
      'Successful APDA competitor',
      'Director, World Scholar’s Cup programs',
    ],
  },
  {
    name: 'Mac Hays',
    slug: 'mac-hays',
    role: 'Debate Coach',
    image: '/images/coaches/mac-hays.jpg',
    highlight: '4th Place, NSDA Nationals',
    credentials: [
      'Brown University Debate Team',
      '4th Place at NSDA Nationals',
      'Fulbright Taiwan Debate Coach',
      'Instructor, National Symposium for Debate',
    ],
  },
  {
    name: 'Zach Fleeser',
    slug: 'zach-fleeser',
    role: 'Debate Coach',
    image: '/images/coaches/zach-fleeser.jpg',
    highlight: 'Oxford · Multiple TOC qualifications',
    credentials: [
      'Debater at the University of Oxford',
      'Multiple Tournament of Champions qualifications',
      'NSDA Nationals award winner',
      'Convenor, International Championship of Young Debaters',
    ],
  },
  {
    name: 'Matt Mauriello',
    slug: 'matt-mauriello',
    role: 'Debate & Writing Coach',
    image: '/images/coaches/matt-mauriello.jpg',
    highlight: 'Harvard College Debating Union',
    credentials: [
      'Harvard College Debating Union',
      'Yale Invitational APDA Champion',
      'Multiple APDA tournament finalist',
    ],
  },
];

export function getCoachBySlug(slug: string): Coach | undefined {
  return coaches.find((c) => c.slug === slug);
}

export const founders = coaches.filter((c) => c.isFounder);
