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
    name: 'Tin Puljić',
    slug: 'tin-puljic',
    role: 'Debate Coach',
    image: '/images/coaches/tin-puljic.jpg',
    highlight: '2021 World Universities Debating Champion',
    credentials: [
      '2021 World Universities Debating Champion',
      'Best ESL Speaker at WUDC 2020 and 2021',
      'Best speaker at 20+ international tournaments',
      'Deputy Chief Adjudicator, European Universities Debating Championship',
    ],
  },
  {
    name: 'Cailyn Min',
    slug: 'cailyn-min',
    role: 'World Schools Coach',
    image: '/images/coaches/cailyn-min.jpg',
    highlight: 'Best Open Speaker, WSDC 2025',
    credentials: [
      'Best Open Speaker at WSDC Panama 2025, a first for Team USA',
      'USA National WSDC Team, 5th place at Worlds 2025',
      'Champion, Stanford World Schools tournament',
      'Harvard Invitational champion and three-time TOC qualifier',
    ],
  },
  {
    name: 'Peregrine Beckett',
    slug: 'perry-beckett',
    role: 'Program Director',
    image: '/images/coaches/perry-beckett.png',
    isFounder: true,
    highlight: 'Head-coached the Columbia Debate Society',
    credentials: [
      'Semifinalist at the Tournament of Champions in Lincoln-Douglas',
      'Named best speaker at the Harvard Invitational',
      'Ranked 3rd among American university debaters',
      'Went on to head-coach the Columbia Debate Society',
    ],
  },
  {
    name: 'Biser Angelov',
    slug: 'biser-angelov',
    role: 'World Schools Coach',
    image: '/images/coaches/biser-angelov.jpg',
    highlight: 'Coaches Bulgaria’s national team',
    credentials: [
      'Won the European University Debating Championships',
      'Finished top 16 in the world at WUDC',
      'Coaches the Bulgarian national debate team',
      'Sits on the board of the Bulgarian Debate Association',
    ],
  },
  {
    name: 'Netra Easwaran',
    slug: 'netra-easwaran',
    role: 'World Schools Coach',
    image: '/images/coaches/netra-easwaran.jpg',
    highlight: 'Yale Debate Association',
    credentials: [
      'Debates with the Yale Debate Association, with a strong record on the APDA circuit',
      'Directs World Scholar’s Cup programs',
      'Served as Director-General of Yale Model United Nations',
    ],
  },
  {
    name: 'Mac Hays',
    slug: 'mac-hays',
    role: 'Debate Coach',
    image: '/images/coaches/mac-hays.jpg',
    highlight: '4th Place, NSDA Nationals',
    credentials: [
      'Took 4th place at NSDA Nationals',
      'Debated for Brown University',
      'Coached debate in Taiwan through the Fulbright program',
      'Has taught at the National Symposium for Debate',
    ],
  },
  {
    name: 'Zach Fleeser',
    slug: 'zach-fleeser',
    role: 'Debate Coach',
    image: '/images/coaches/zach-fleeser.jpg',
    highlight: 'Oxford · Multiple TOC qualifications',
    credentials: [
      'Qualified to the Tournament of Champions multiple times',
      'Award winner at NSDA Nationals',
      'Has debated for the University of Oxford',
      'Served as convenor of the International Championship of Young Debaters',
    ],
  },
  {
    name: 'Matt Mauriello',
    slug: 'matt-mauriello',
    role: 'Debate & Writing Coach',
    image: '/images/coaches/matt-mauriello.jpg',
    highlight: 'Harvard College Debating Union',
    credentials: [
      'Won the Yale Invitational on the APDA circuit',
      'Reached the final at multiple APDA tournaments',
      'Debated with the Harvard College Debating Union',
    ],
  },
];

export function getCoachBySlug(slug: string): Coach | undefined {
  return coaches.find((c) => c.slug === slug);
}

export const founders = coaches.filter((c) => c.isFounder);
