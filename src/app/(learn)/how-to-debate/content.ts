// Data for the beginner's guide at /how-to-debate. Kept out of page.tsx so the
// prose file stays readable. Format facts were checked October 2026 against the
// WSDC rules, the ESU Schools' Mace 2025-26 handbook, the Oxford Union
// "Debating at Oxford Schools" guide (Jan 2025) and NSDA event descriptions.

export interface FormatRow {
  name: string;
  teams: string;
  speeches: string;
  prep: string;
  pois: string;
  closing: string;
  judged: string;
  where: string;
}

export const formats: FormatRow[] = [
  {
    name: 'World Schools (WSDC)',
    teams: '2 teams of 3',
    speeches: '8 min each; juniors often 4–5 min',
    prep: 'Prepared motions weeks ahead; impromptu motions get 1 hour',
    pois: 'Yes, between minutes 1 and 7',
    closing: '4-min reply speech, no POIs, no new arguments',
    judged: 'Style 40 / Content 40 / Strategy 20',
    where: 'World Schools Debating Championships, NSDA Nationals, TOC, US state divisions, international opens',
  },
  {
    name: 'British Parliamentary (BP)',
    teams: '4 teams of 2',
    speeches: '7 min (5 min at many school events)',
    prep: '15 minutes',
    pois: 'Yes, outside the first and last minute',
    closing: 'None; the two whip speeches close',
    judged: 'Teams ranked 1st to 4th by persuasiveness',
    where: 'World and European university championships, Oxford and Cambridge Schools, most UK and European competitions',
  },
  {
    name: 'ESU Schools’ Mace (UK)',
    teams: '2 teams of 2',
    speeches: '7 min each',
    prep: 'Motion set in advance',
    pois: 'Yes, about 10 seconds each, not in the first or last minute',
    closing: '5-min summary speech, fully protected',
    judged: 'Four Key Skill Sets, 40 marks per speaker',
    where: 'UK secondary schools, ages 11 to 18',
  },
  {
    name: 'Australian schools 3v3',
    teams: '2 teams of 3',
    speeches: '6–8 min depending on age',
    prep: 'Prepared, or about 1 hour for short-prep topics',
    pois: 'No',
    closing: 'Reply speeches in some competitions',
    judged: 'Matter, Manner, Method',
    where: 'Australia, New Zealand, much of Asia',
  },
  {
    name: 'Public Forum (US)',
    teams: '2 teams of 2',
    speeches: '4-min constructives and rebuttals, 3-min summaries, 2-min final focus',
    prep: 'Topic changes monthly or bimonthly; 3 min prep time per team',
    pois: 'No; three crossfire periods instead',
    closing: '2-min final focus',
    judged: 'Lay or flow judge; ballot for the more persuasive team',
    where: 'US high schools; the largest US format',
  },
  {
    name: 'Lincoln-Douglas (US)',
    teams: '1 v 1',
    speeches: '6–7 min constructives, 3-min cross-examination, 3–6 min rebuttals',
    prep: 'Topic changes every two months; about 4 min prep time per side',
    pois: 'No; cross-examination instead',
    closing: '3-min affirmative rebuttal',
    judged: 'Value and criterion framework; judge votes affirmative or negative',
    where: 'US high schools',
  },
  {
    name: 'Policy (US)',
    teams: '2 teams of 2',
    speeches: '8-min constructives, 3-min cross-examination, 5-min rebuttals',
    prep: 'One resolution for the whole year; 5–10 min prep time per team',
    pois: 'No; cross-examination instead',
    closing: '5-min second affirmative rebuttal',
    judged: 'Flow judge; evidence-heavy, fast delivery common',
    where: 'US high schools and universities',
  },
];

export interface AgeBand {
  band: string;
  ages: string;
  expect: string;
  good: string;
}

export const ageBands: AgeBand[] = [
  {
    band: 'Younger juniors',
    ages: '8 to 11',
    expect: 'Short speeches of 2 to 4 minutes, friendly motions about school, animals, screens and sport, lots of games. Formal roles are introduced slowly.',
    good: 'Stating a clear opinion, giving one reason that is actually a reason, and listening to the other side long enough to disagree with something they said.',
  },
  {
    band: 'Juniors',
    ages: '11 to 14',
    expect: 'The real format arrives: speaker roles, 4- to 5-minute speeches, points of information, a judge who explains the decision. Junior World Schools divisions and school clubs live here.',
    good: 'Two developed arguments with a mechanism and an impact, a rebuttal that names the point it is answering, and a speech that finishes on time.',
  },
  {
    band: 'Seniors',
    ages: '14 to 18',
    expect: 'Full-length speeches, impromptu motions on politics, economics and ethics, tournaments with elimination rounds. Most students who start here compete within a term.',
    good: 'A case the whole team shares, rebuttal aimed at the best version of the opposing argument, and weighing that tells the judge how to decide.',
  },
  {
    band: 'Adult beginners',
    ages: 'University and beyond',
    expect: 'University societies run British Parliamentary almost everywhere, with 15 minutes of prep and four teams in the room. Novice-only rounds and tournaments exist and are worth seeking out.',
    good: 'Comfort speaking for seven minutes from a one-page plan, and the habit of asking what the other side is really claiming before you answer it.',
  },
];

export interface RoleCard {
  role: string;
  minutes: string;
  jobs: string[];
  avoid: string;
}

export const roleCards: RoleCard[] = [
  {
    role: 'First speaker, each side',
    minutes: 'Sets up the debate',
    jobs: [
      'Frame the motion: what is the problem, what are the two worlds the judge is choosing between',
      'Define any unclear term, briefly, and say what your side is committed to (your model or stance)',
      'State the split: which arguments you will give, which your second speaker will give',
      'Deliver one or two fully built arguments',
      'Opposition first speaker also answers the proposition case before building',
    ],
    avoid: 'Spending three minutes on definitions and background, then rushing the arguments.',
  },
  {
    role: 'Second speaker, each side',
    minutes: 'Rebuts, rebuilds, extends',
    jobs: [
      'Answer the strongest version of the other side’s arguments, grouped by idea rather than in the order they were said',
      'Rebuild your first speaker’s arguments where they were attacked',
      'Add one new, fully built argument (the extension)',
      'Keep repeating the caseline so the judge hears one team, not three individuals',
    ],
    avoid: 'Answering every sentence the other side said. Pick the points that would decide the round if left standing.',
  },
  {
    role: 'Third speaker, each side',
    minutes: 'Decides the debate',
    jobs: [
      'Reorganise the whole round into two or three clashes (the questions the judge must answer)',
      'For each clash: what they said, why it fails, what we said, why it stands',
      'Weigh: show why your side wins each clash, or why the clash you win matters more than the one you lose',
      'No new arguments; new examples and new responses are fine',
    ],
    avoid: 'Giving a third constructive speech. The judge wants a verdict with reasons, not more material.',
  },
  {
    role: 'Reply speaker (first or second speaker returns)',
    minutes: 'A biased judge’s summary',
    jobs: [
      'Four minutes (two for juniors), opposition first, then proposition closes the debate',
      'Tell the story of the round from your side: the one or two things it turned on',
      'Name the single comparison that wins it for you',
      'No POIs may be offered during a reply, and nothing new may be added',
    ],
    avoid: 'Re-running the third speech at speed, or answering points for the first time.',
  },
];

export interface GlossaryEntry {
  term: string;
  def: string;
}

export const glossary: GlossaryEntry[] = [
  { term: 'Motion', def: 'The statement being debated, usually phrased "This House would..." or "This House believes that...". In US formats it is called the resolution or the topic.' },
  { term: 'This House', def: 'The imaginary parliament the motion is addressed to. "This House would ban homework" means "we, the assembly, should ban homework".' },
  { term: 'Proposition', def: 'The side arguing for the motion. Also called Government (BP), Affirmative (US and Australia) or Pro (Public Forum).' },
  { term: 'Opposition', def: 'The side arguing against the motion. Also Negative or Con.' },
  { term: 'Burden', def: 'What a side must prove to win. Proposition usually has to show the motion is a good idea; opposition has to show it is not, or that the alternative is better.' },
  { term: 'Model', def: 'The proposition’s description of how the policy would work in practice: who does what, from when, with what exceptions.' },
  { term: 'Counter-model', def: 'An alternative policy the opposition defends instead of the status quo, to solve the same problem a different way.' },
  { term: 'Status quo', def: 'The world as it is now. Opposition often defends it; proposition argues to change it.' },
  { term: 'Caseline', def: 'The one-sentence summary of your side’s position that every speaker repeats. Sometimes called the team line or thesis.' },
  { term: 'Split', def: 'How a team divides its arguments between speakers, announced by the first speaker.' },
  { term: 'Argument', def: 'A claim plus the reasoning that makes it true and the impact that makes it matter. An opinion with no reasoning is an assertion, not an argument.' },
  { term: 'Mechanism', def: 'The step-by-step explanation of how a cause produces an effect. The "because" part of an argument.' },
  { term: 'Impact', def: 'The consequence an argument ends on: who is affected, how badly, and how many of them.' },
  { term: 'Characterisation', def: 'Describing how the people or institutions in the debate behave in practice, so the judge believes your mechanism (how do students, teachers and parents really respond to homework?).' },
  { term: 'Analysis', def: 'The explanation of why something is true, as opposed to just saying that it is. Judges reward analysis far above lists of examples.' },
  { term: 'Rebuttal', def: 'Responding to the other side’s arguments to show they are untrue, unimportant or outweighed.' },
  { term: 'Rebuild', def: 'Defending your own side’s arguments after they have been attacked.' },
  { term: 'Extension', def: 'A new argument introduced by a second speaker (or by the back half in BP).' },
  { term: 'Clash', def: 'A point where the two sides directly disagree. Third speakers organise the round into clashes.' },
  { term: 'Weighing', def: 'Explaining why your arguments matter more than theirs: bigger, more likely, sooner, affecting more vulnerable people.' },
  { term: 'Even if', def: 'A rebuttal that concedes a point for the sake of argument and shows you still win: "Even if homework builds discipline, so does sport, without the cost to sleep."' },
  { term: 'Steel-manning', def: 'Answering the strongest reasonable version of the other side’s argument instead of a weak caricature of it.' },
  { term: 'Point of information (POI)', def: 'A short question or statement offered by the other side during a speech. The speaker may accept or decline it.' },
  { term: 'Protected time', def: 'The parts of a speech (usually the first and last minute) when POIs may not be offered.' },
  { term: 'Barracking', def: 'Offering so many POIs that the speaker cannot speak. Penalised.' },
  { term: 'Signposting', def: 'Telling the audience where you are in your speech: "My second argument is...", "Responding to their point about sleep...".' },
  { term: 'Flowing', def: 'Taking structured notes of every speech in columns, so you can see which arguments have been answered and which have not.' },
  { term: 'Whip', def: 'The last speaker on each side in BP and WSDC; the third speaker in World Schools.' },
  { term: 'Reply speech', def: 'The short closing speech in World Schools and Australian formats, given by the first or second speaker, with no new arguments.' },
  { term: 'Summary speech', def: 'The ESU Mace equivalent of a reply: a five-minute closing speech reviewing the whole debate.' },
  { term: 'Prepared motion', def: 'A motion released days or weeks before the round, so teams can research and rehearse.' },
  { term: 'Impromptu motion', def: 'A motion released shortly before the round (one hour in World Schools, fifteen minutes in BP), prepared without internet or coaches.' },
  { term: 'Info slide', def: 'A short paragraph released with the motion that explains a term or gives essential context.' },
  { term: 'Framework', def: 'The lens the judge is asked to use: in Lincoln-Douglas a value and criterion, in World Schools the metric a first speaker proposes.' },
  { term: 'Style', def: 'How you speak: clarity, pace, tone, eye contact, engagement with the room. 40 percent of a World Schools score.' },
  { term: 'Content', def: 'What you say: the quality of arguments, analysis and evidence. 40 percent of a World Schools score.' },
  { term: 'Strategy', def: 'Whether you spent your time on the issues that mattered, structured your speech sensibly and handled POIs well. 20 percent of a World Schools score.' },
  { term: 'Matter, Manner, Method', def: 'The Australian judging categories: roughly content, style and structure.' },
  { term: 'Ordinary intelligent voter', def: 'The persona a judge adopts: well read, open minded, no specialist knowledge, not fooled by jargon or rhetoric.' },
  { term: 'Speaker points', def: 'The individual score given to each speech. In World Schools, 60 to 80 for a substantive speech, with 70 as the average.' },
  { term: 'Oral adjudication', def: 'The judge’s spoken explanation of the result after the round, with reasons and advice for both teams.' },
  { term: 'Break', def: 'Qualifying for the elimination rounds of a tournament after the preliminary rounds.' },
];

/** The worked model debate. One real motion from the bank (Korean Nationals 2022,
    Round 2). Speeches are written to a junior length so the whole round fits on a
    page; the moves are the ones a senior round would make at greater length. */
export interface ModelSpeech {
  id: string;
  speaker: string;
  side: 'Proposition' | 'Opposition';
  title: string;
  paragraphs: string[];
  notes: { tag: string; text: string }[];
}

export const MODEL_MOTION = 'This House would ban schools from giving homework to students.';

export const modelSpeeches: ModelSpeech[] = [
  {
    id: 'prop-1',
    speaker: 'First Proposition',
    side: 'Proposition',
    title: 'Framing, model, two arguments',
    paragraphs: [
      'Every evening, millions of children sit at a kitchen table doing work that the research says teaches them very little, while the thing that would actually help them, sleep, play and time with their families, gets squeezed out. We are proud to propose.',
      'Our model is simple. Schools up to age sixteen may not set compulsory work to be completed at home. Reading for pleasure and optional practice material remain available. Teachers keep every minute of class time; they lose only the right to extend the school day into the home.',
      'The debate comes down to one question: does homework produce enough learning to justify what it costs children and families? Our first speaker will show that the learning is small; I will also show that the cost is real. Our second speaker will show that homework widens the gap between rich and poor children.',
      'First, homework teaches less than people assume. A child who has not understood fractions in class does not understand them better alone at nine at night with no teacher in the room. They either guess, copy, or have a parent do it. Meta-analyses of homework studies find little or no benefit for primary-age children, and only a modest effect for teenagers, most of which comes from short, well-designed tasks that are the exception rather than the rule. Because the benefit is small, even a modest cost outweighs it.',
      'Second, the cost is not modest. Children who are tired learn worse the next day, so homework eats the lesson it was meant to support. Families fight about it. Sport, music and friendships lose hours every week. These are the years in which children learn how to be people, and we are spending them on worksheets.',
      'So the question for the judge is simple: a small learning gain, against a large cost to sleep, family life and childhood itself. We say ban it. Proud to propose.',
    ],
    notes: [
      { tag: 'Opening', text: 'One concrete image, then the stance. No "good morning judges, today we will be discussing".' },
      { tag: 'Model', text: 'Three sentences. Who, what, exceptions. This stops the opposition winning on "but reading at home is good".' },
      { tag: 'Winning question', text: 'The speaker tells the judge what the debate is about and how to decide it. The whole team will return to this.' },
      { tag: 'Mechanism', text: 'Not "homework is useless" but a reason why: no teacher present, so misunderstanding is repeated, not corrected.' },
      { tag: 'Impact', text: 'Each argument ends with who is hurt and how. The second argument also pre-empts the obvious reply that homework reinforces learning.' },
    ],
  },
  {
    id: 'opp-1',
    speaker: 'First Opposition',
    side: 'Opposition',
    title: 'Counter-stance, rebuttal, two arguments',
    paragraphs: [
      'The proposition has described bad homework and asked you to ban all homework. We will defend something different: schools should set less, better homework, and we will show you why a ban is the wrong tool.',
      'Two responses to their case. They told you the research shows little benefit for young children. True, and almost irrelevant, because the same research shows a clear benefit for secondary students, especially in maths and languages where practice is the whole point. Their ban covers everyone up to sixteen. They are using a finding about seven-year-olds to take practice away from fifteen-year-olds sitting exams. Then they said homework costs sleep and family time. The problem there is quantity, not existence. Thirty minutes of reading does not destroy a childhood. If the harm is too much homework, the answer is a limit, which schools and governments already set, not a ban.',
      'Our first argument is that practice is how learning becomes permanent. A lesson introduces an idea; it only sticks when the student retrieves it later, on their own, without the teacher there. That is exactly what homework is. Take it away and the same material has to be re-taught, which means less new content, which means every child learns less in the same number of school years.',
      'Our second argument is about who a ban actually protects. Wealthy families will replace homework with tutors, apps and structured activities within a week. Families who cannot afford that lose the one free, teacher-designed way their children could keep up outside school. The gap the proposition worries about gets wider under their own policy.',
      'So we have a counter-stance that keeps the learning and fixes the quantity. Proud to oppose.',
    ],
    notes: [
      { tag: 'Counter-stance', text: 'Opposition does not have to defend the status quo. "Less, better homework" is a much easier world to defend than "homework as it is now".' },
      { tag: 'Rebuttal first', text: 'Answers come before new material, grouped by the two arguments heard, each ending with why the point fails.' },
      { tag: 'Mechanism', text: 'Retrieval without the teacher is the mechanism. Notice it is the mirror image of the proposition’s mechanism (no teacher = no learning); the judge now has a real clash.' },
      { tag: 'Pre-empt', text: 'The opposition knows the second proposition speaker will argue inequality, so it takes the ground first.' },
    ],
  },
  {
    id: 'prop-2',
    speaker: 'Second Proposition',
    side: 'Proposition',
    title: 'Rebut, rebuild, extend',
    paragraphs: [
      'The opposition has quietly changed the debate. They are no longer defending homework; they are defending a world where homework is limited and well designed. We would love to live in that world too. The problem is that it does not exist, and twenty years of limits and guidelines have not produced it, because the incentive on every individual teacher is to set more. A ban is the only rule that changes behaviour.',
      'On their first argument, that practice makes learning permanent: we agree practice matters. We disagree that it has to happen at home. Retrieval practice works best when it is short, spaced and corrected quickly, which describes a ten-minute quiz at the start of a lesson far better than an hour of unsupervised worksheets. Under our model, practice moves into the classroom, where a teacher can see the mistake. So their mechanism survives; their conclusion does not.',
      'On their second argument, that rich families will replace homework with tutors: they already do, with homework in place. What homework adds for the poorer child is not a tutor but a task they must do alone, often without a quiet room, a laptop, or a parent who has time to help. That child then arrives at school marked down for work they had no fair chance to complete.',
      'That takes me to our new argument: homework is the mechanism through which schools punish children for their home circumstances. The same assignment is easy in a house with a desk, a printer and a graduate parent and impossible in a crowded flat where the student is looking after siblings. Teachers then grade the result as if it measured effort. Under our model, every child does the work in the same room, with the same resources, in front of the same teacher. That is the fairest possible world, and it is only available on our side.',
      'Small learning gain, large cost, and now a fairness cost the opposition has made worse rather than better. Proud to propose.',
    ],
    notes: [
      { tag: 'Name the shift', text: 'The second speaker tells the judge the opposition has moved to a comfortable counter-stance, then explains why that world is not on offer.' },
      { tag: 'Even if', text: '"Their mechanism survives; their conclusion does not" is the shape of a good rebuttal: concede what is true, break the link to the result.' },
      { tag: 'Extension', text: 'The new argument is about fairness, and it is fully built: mechanism (same task, different homes), then impact (grades that measure circumstances).' },
      { tag: 'Caseline', text: 'Both proposition speakers have now ended on the same comparison.' },
    ],
  },
  {
    id: 'opp-2',
    speaker: 'Second Opposition',
    side: 'Opposition',
    title: 'Rebut, rebuild, extend',
    paragraphs: [
      'The proposition keeps telling you that limits have never worked, so a ban is the only option. Notice that they offered no reason why a ban would be enforced any better than a limit. If a teacher can quietly set extra work under a limit, they can quietly "suggest" it under a ban. The difference is that under a ban the honest teacher is forbidden from setting the twenty useful minutes while the dishonest one carries on.',
      'On their fairness argument: moving all practice into the classroom sounds equal, but it means less of it. A teacher has fifty minutes and thirty students. Their ten-minute quiz covers one topic. The child who is behind still needs more repetitions than the child who is ahead, and under the proposition’s world, the only place to get them is a paid tutor. Equal time in class is not equal outcome, and it is the struggling student who pays for the tidiness of the model.',
      'Our extension is about independence. Homework is the first place in a young person’s life where they are responsible for a task with a deadline and nobody watching. Planning the evening, starting without being told, asking for help when stuck: these habits are learned by doing them, and they are needed long before university or a first job. A child who reaches sixteen having never managed a single task outside supervision has been failed by the adults who thought they were protecting them.',
      'So this debate is now a comparison between two worlds. In theirs, children have their evenings back, and the ones who most needed practice and independence get neither. In ours, homework is shorter and better designed, and every child keeps a free way to practise and a safe place to learn responsibility. Proud to oppose.',
    ],
    notes: [
      { tag: 'Attack the link', text: 'The speaker does not dispute that limits have failed. They attack the step from "limits fail" to "a ban works".' },
      { tag: 'Turn', text: 'The fairness argument is turned: the opposition argues the proposition’s world hurts the student it claims to protect. Turns are the most powerful rebuttal shape because they convert the other side’s material into yours.' },
      { tag: 'Extension', text: 'Independence is a new, fully built argument with a mechanism (habits are learned by doing) and an impact (adult life).' },
      { tag: 'Comparison', text: 'The speech ends by describing both worlds side by side. This is weighing, and it is why the judge later says the opposition "told the story of the round" better.' },
    ],
  },
  {
    id: 'prop-3',
    speaker: 'Third Proposition',
    side: 'Proposition',
    title: 'Clashes and weighing',
    paragraphs: [
      'Three questions decide this debate. Does homework teach? Who does a ban help? And whose world is actually on offer?',
      'First, does homework teach? Both sides now agree that practice matters and that it works best when it is short and corrected quickly. The only disagreement is where it happens. We say the classroom, where mistakes get caught. They say the kitchen table, where they get repeated. They have never answered why unsupervised practice is better than supervised practice; they have only said there is more of it. More of the wrong practice is not a gain.',
      'Second, who does a ban help? The opposition says the struggling child loses repetitions. But that child was never getting useful repetitions from homework, because the whole problem is that they do it alone, wrong, or not at all. What they lose under our model is the daily experience of failing in private. What they gain is practice in front of a teacher who can intervene. On independence: children learn responsibility from chores, sport, clubs and jobs. Homework is not the only teacher of independence; it is simply the one that happens to be measured.',
      'Third, whose world is on offer? The opposition has spent the whole debate defending "less, better homework". We agree that would be nice. But they have given you no mechanism for producing it, only the hope that this time the guidelines work. We have given you a clear rule and explained why rules change behaviour where guidelines do not. When one side defends a world that exists and the other defends a world they wish existed, you vote for the real one.',
      'Even if homework teaches a little, even if it builds a little independence, those gains are small and available elsewhere, and the costs to sleep, family life and fairness are large and available nowhere else. Our worst case beats their best case. Proud to propose.',
    ],
    notes: [
      { tag: 'Clashes', text: 'Three questions, named up front, each a point of real disagreement. The judge can now follow the speech without notes.' },
      { tag: 'Concede and redirect', text: 'The third speaker gives ground on "practice matters" and moves the clash to "where". Conceding what you cannot win buys credibility for what you can.' },
      { tag: 'No new arguments', text: 'Chores and sport as alternative teachers of independence is a new response, which is allowed. A new argument would not be.' },
      { tag: 'Weighing line', text: '"Even if ... our worst case beats their best case" is the standard whip closing. It tells the judge how to decide if they believe some of both sides.' },
    ],
  },
  {
    id: 'opp-3',
    speaker: 'Third Opposition',
    side: 'Opposition',
    title: 'Clashes and weighing',
    paragraphs: [
      'The proposition’s third speaker says vote for the world that exists. Let us do that. The world that exists is one where homework is already limited in most school systems, where the question is quantity, and where the proposition wants to remove the whole tool because some teachers misuse it. Two clashes decide this debate.',
      'First, where does practice happen and how much of it is there? The proposition says supervised classroom practice beats unsupervised home practice. We have never disagreed. We have said that classroom time is fixed and already full, so moving practice into it means less of it and less new teaching. They never answered that. Their ten-minute quiz is good; it is also all the practice a struggling child will ever get under their model. Our world has the quiz and the twenty minutes at home. More good practice beats less good practice, and that is the comparison the judge is making.',
      'Second, who is protected? Both sides care about the child in the crowded flat. The proposition says homework punishes that child. We say the ban abandons them. Under their model, the wealthy child gets tutors and the poor child gets nothing after three o’clock. Under ours, the poor child gets a free, teacher-designed task and the school gets a signal when it does not come back, which is often the first sign a family needs help. The proposition has turned a problem of too much homework into a policy of no support, and called it fairness.',
      'On independence they said chores and sport do the same job. Some children have those; many do not. Homework is the only form of independent responsibility every child is guaranteed, which is exactly why it matters for the children with the least.',
      'Judge, both teams agree homework can be done badly. Only one team keeps the benefits while fixing the harm. Proud to oppose.',
    ],
    notes: [
      { tag: 'Take their frame', text: 'The whip accepts the proposition’s test ("vote for the world that exists") and argues the opposition wins it. Fighting over the frame is weaker than winning inside it.' },
      { tag: 'Point out the drop', text: '"They never answered that" is only powerful when it is true. Here it is: proposition never dealt with class time being fixed.' },
      { tag: 'Mirror the impact', text: 'Both sides now claim the same child. The judge will decide who explained that child’s evening more believably.' },
      { tag: 'Short close', text: 'One sentence that could be the whole case. The reply speaker will build from it.' },
    ],
  },
  {
    id: 'opp-reply',
    speaker: 'Opposition Reply',
    side: 'Opposition',
    title: 'A biased summary',
    paragraphs: [
      'This debate was never about whether homework can be bad. It was about what to do when it is. The proposition offered a ban and asked you to trust that it would be enforced where limits were not, without ever saying why. We offered less, better homework, and showed you that classroom practice alone leaves the struggling child with ten minutes a day and nothing after the bell.',
      'The child both teams talked about, the one in the flat without a desk, is the reason to vote opposition. In the proposition’s world they lose practice, lose independence and lose the one signal that tells the school they need help. In ours they keep all three. Proud to oppose.',
    ],
    notes: [
      { tag: 'Story of the round', text: 'The reply does not list arguments. It names what the debate turned on and claims it.' },
      { tag: 'One comparison', text: 'A single child, two worlds. Nothing new, nothing re-argued.' },
    ],
  },
  {
    id: 'prop-reply',
    speaker: 'Proposition Reply',
    side: 'Proposition',
    title: 'A biased summary',
    paragraphs: [
      'Strip away the labels and the two teams agree on more than they admit. Practice matters. Supervised practice is better. Too much homework harms children. Where we part is what follows. The opposition says: keep homework and hope it improves. We say: the hope has been tried, and the only policy that has ever changed what happens at the kitchen table is a rule.',
      'They ended on the child in the flat. So will we. That child does not need a worksheet they cannot finish and a grade that records their postcode. They need a teacher in the room when they get it wrong, and an evening that belongs to them. Only one side offers that. Proud to propose.',
    ],
    notes: [
      { tag: 'Find the agreement', text: 'Listing what both sides accept narrows the debate to the one choice the judge has to make.' },
      { tag: 'Answer the image', text: 'The reply takes the opposition’s best image and reclaims it, rather than introducing a new one.' },
    ],
  },
];

export const adjudication = {
  result: 'Opposition wins, narrowly. Speaker scores (World Schools scale, 60 to 80 for substantive speeches): Proposition 71, 72, 72; Opposition 72, 73, 73. Replies: Proposition 36, Opposition 36.',
  reasons: [
    'Both teams built real arguments with mechanisms, and both rebutted the best version of what they heard rather than a caricature. That alone puts this above most beginner rounds.',
    'The round turned on the first clash: where practice happens and how much of it there is. Proposition won the point that supervised practice is better. Opposition won the point that class time is fixed, so a ban means less practice overall, and proposition never answered it. Because opposition explained the mechanism (fifty minutes, thirty students, one quiz) and proposition only asserted that classroom practice would be enough, the judge was left believing the opposition’s picture of the classroom.',
    'The second clash, the disadvantaged child, was close to even. Proposition’s "grades that record your postcode" was the most memorable line in the round. Opposition’s "a signal when the work does not come back" was a new reason the judge had not considered, delivered in the third speech where it was most needed.',
    'Proposition lost ground on enforcement. Second and third proposition asserted that bans change behaviour where limits do not, but the opposition’s question (why would a ban be enforced any better?) went unanswered for three speeches.',
    'Advice for proposition: the case was clear and the caseline was repeated well. Spend the second speech answering the strongest opposition point (fixed class time) rather than the weakest (tutors). Advice for opposition: the counter-stance was the right call, but say in the first speech what "less, better homework" means in practice (a time limit, a type of task) so the proposition cannot call it a wish.',
  ],
};
