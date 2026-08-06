export type Phase2Question = {
  id: string
  label: string
  options: string[]
}

export type OutcomeMockupIcon =
  | 'calendar-history'
  | 'chat-bubble'
  | 'chat-bubbles'
  | 'contact-group'
  | 'down-chart'
  | 'flame-progress'
  | 'heart-trend'
  | 'insight-chart'
  | 'leaf-check'
  | 'location-check'
  | 'medical-drop'
  | 'scenario-cards'
  | 'smiley'
  | 'up-chart'
  | 'water-nutrition'

export type OutcomeMockupConfig = {
  appName: string
  hero: { label: string; value: string; supporting: string }
  today: { title: string; status: string; secondary: string }
  features: Array<{ title: string; description: string; icon: OutcomeMockupIcon }>
  smallMetrics?: Array<{ label: string; value: string }>
  outcome: string
  navigation: string[]
  emotion: string
}

export type Phase2LandingPageConfig = {
  slug: string
  brand: string
  logo: string
  heroKicker: string
  headline: string
  subheadline: string
  cta: string
  ctaSubtitle?: string
  benefits: string[]
  questions: Phase2Question[]
  mockup: OutcomeMockupConfig
  faqs: Array<{ question: string; answer: string }>
  socialProof: string
  accent: string
  accentSoft: string
}

// Add future Phase 2 landing pages here. App.tsx creates the route automatically.
export const phase2LandingPages: Phase2LandingPageConfig[] = [
  {
    slug: 'glp1-tracker',
    brand: 'TrackGLP',
    logo: '/phase2-logos/trackglp-v2.png',
    heroKicker: 'Built around your real progress',
    headline: 'Finally understand your GLP-1 progress.',
    subheadline: 'Track injections, weight, side effects and habits in one simple place.',
    cta: 'Get my GLP-1 progress plan',
    benefits: ['Injection reminders', 'Progress tracking', 'Daily habit logging'],
    questions: [
      {
        id: 'biggest_challenge',
        label: "What's your biggest challenge?",
        options: ['Weight loss has slowed', 'Staying consistent', 'Tracking everything', 'Side effects'],
      },
      {
        id: 'most_helpful',
        label: 'What would help you most?',
        options: ['Clear progress tracking', 'Better reminders', 'Seeing long-term trends', 'Everything in one place'],
      },
    ],
    mockup: {
      appName: 'TrackGLP',
      hero: { label: 'Week 8 Progress', value: '-8.2 kg', supporting: "You're on track" },
      today: { title: "Today's Injection", status: 'Logged', secondary: 'Next dose in 6 days' },
      features: [
        { title: 'Injection Tracker', description: 'Track doses and injection sites', icon: 'medical-drop' },
        { title: 'Progress Timeline', description: 'Follow weight and measurements', icon: 'down-chart' },
        { title: 'Daily Habits', description: 'Track protein and water', icon: 'water-nutrition' },
      ],
      smallMetrics: [
        { label: 'Protein Goal', value: 'Complete' },
        { label: 'Water', value: '2.4 L' },
      ],
      outcome: 'Everything in one place',
      navigation: ['Today', 'Progress', 'Habits', 'Profile'],
      emotion: 'Progress and clarity',
    },
    faqs: [
      { question: "Can't I use Notes?", answer: 'You could — but TrackGLP keeps everything together in one place, built specifically for GLP-1.' },
      { question: 'Why pay for this on top of my medication?', answer: 'Less than the cost of one injection, to make sure every injection actually counts.' },
      { question: 'Can I export data?', answer: 'Yes.' },
      { question: 'Will it work with all GLP-1 medications?', answer: 'Yes.' },
    ],
    socialProof: 'Join early users building the next generation GLP-1 tracker.',
    accent: '#207d67',
    accentSoft: '#e6f5f0',
  },
  {
    slug: 'dating-again',
    brand: 'NextDate',
    logo: '/phase2-logos/nextdate.png',
    heroKicker: 'Build confidence before your next date',
    headline: "Dating again shouldn't feel overwhelming.",
    subheadline: 'Practice conversations, rebuild confidence and feel ready before your next date.',
    cta: 'Get my dating confidence plan',
    benefits: ['Practice real conversations', 'Build confidence', 'Feel ready to date again'],
    questions: [
      {
        id: 'hardest_right_now',
        label: "What's hardest right now?",
        options: ['Confidence', 'Starting conversations', 'Fear of rejection', 'Not sure where to start'],
      },
      {
        id: 'single_duration',
        label: 'How long have you been single?',
        options: ['Less than 3 months', '3–12 months', 'More than a year', "I'd rather not say"],
      },
    ],
    mockup: {
      appName: 'NextDate',
      hero: { label: 'Dating Confidence', value: '84%', supporting: 'Up 12% this week' },
      today: { title: "Today's Practice", status: 'Complete', secondary: 'First-date conversation' },
      features: [
        { title: 'Conversation Practice', description: 'Practice messages and replies', icon: 'chat-bubbles' },
        { title: 'Real Date Scenarios', description: 'Prepare for difficult moments', icon: 'scenario-cards' },
        { title: 'Confidence Tracker', description: 'Watch your progress over time', icon: 'up-chart' },
      ],
      smallMetrics: [{ label: 'Conversation Score', value: '8.9 / 10' }],
      outcome: "Tomorrow's challenge is ready",
      navigation: ['Coach', 'Practice', 'Progress', 'Profile'],
      emotion: 'Confidence',
    },
    faqs: [
      { question: 'Why not ChatGPT?', answer: 'NextDate remembers your progress and gives structured coaching — not just one-off answers.' },
      { question: 'Will AI judge me?', answer: 'Never. This is a private space to practice — no judgment, ever.' },
      { question: 'Can beginners use it?', answer: 'Absolutely — NextDate meets you wherever you’re starting from.' },
    ],
    socialProof: 'Join early users helping shape the future of dating confidence.',
    accent: '#d45178',
    accentSoft: '#fff0f5',
  },
  {
    slug: 'together',
    brand: 'Together',
    logo: '/phase2-logos/together.png',
    heroKicker: 'A stronger connection starts here',
    headline: 'Feel closer in just 2 minutes a day.',
    subheadline: 'A simple daily check-in that helps couples communicate better, reconnect emotionally, and build stronger relationships.',
    cta: 'Reconnect with your partner',
    ctaSubtitle: 'Join couples helping shape Together before launch.',
    benefits: ['Daily emotional check-ins', 'Thoughtful conversation prompts', 'Track your relationship over time'],
    questions: [
      {
        id: 'relationship_challenge',
        label: "What's hardest in your relationship right now?",
        options: ["We don't communicate enough", "We spend time together but don't connect", 'Busy schedules get in the way', "We don't really check in emotionally"],
      },
      {
        id: 'meaningful_conversations',
        label: 'How often do you have meaningful conversations?',
        options: ['Almost every day', 'A few times a week', 'Rarely', 'Almost never'],
      },
    ],
    mockup: {
      appName: 'Together',
      hero: { label: 'Connection Score', value: '92%', supporting: 'Up 8% this month' },
      today: { title: "Today's Check-in", status: 'Complete', secondary: 'Both partners answered' },
      features: [
        { title: 'Daily Mood', description: 'Share how you feel', icon: 'smiley' },
        { title: 'Conversation Prompt', description: 'One meaningful question each day', icon: 'chat-bubble' },
        { title: 'Relationship Trends', description: 'See how your connection changes', icon: 'heart-trend' },
      ],
      outcome: '18-day connection streak',
      navigation: ['Today', 'Prompts', 'Trends', 'Profile'],
      emotion: 'Connection',
    },
    faqs: [
      { question: "Can't we just talk?", answer: 'Of course — but Together makes meaningful conversations easier to start and easier to keep consistent.' },
      { question: 'Will my partner need the app?', answer: 'Yes. Together works best when both partners participate.' },
      { question: 'Does this replace therapy?', answer: "No. It's a simple daily habit that helps couples stay connected between life's busy moments." },
    ],
    socialProof: 'Join couples helping shape Together before public launch.',
    accent: '#d85886',
    accentSoft: '#fff0f5',
  },
  {
    slug: 'reset',
    brand: 'RESET',
    logo: '/phase2-logos/reset.png',
    heroKicker: 'Private support without judgment',
    headline: 'Take back control of your habits - built for women.',
    subheadline: 'A private daily companion helping women build healthier habits without shame.',
    cta: 'Take control of your habits',
    benefits: ['Private by design', 'Understand your patterns', 'Small daily wins'],
    questions: [
      {
        id: 'strongest_urges',
        label: 'When are urges strongest?',
        options: ['Late at night', "When I'm stressed", "When I'm bored", 'It feels random'],
      },
      {
        id: 'already_tried',
        label: 'What have you already tried to stop?',
        options: ['Willpower', 'Website blockers', 'Another app', 'Nothing yet'],
      },
    ],
    mockup: {
      appName: 'RESET',
      hero: { label: 'Recovery Score', value: '91%', supporting: 'Stronger than last week' },
      today: { title: "Today's Check-in", status: 'Complete', secondary: 'One urge logged' },
      features: [
        { title: 'Urge Check-ins', description: 'Log an urge in one tap', icon: 'leaf-check' },
        { title: 'Trigger Insights', description: 'Understand when patterns happen', icon: 'insight-chart' },
        { title: 'Recovery Streak', description: 'Celebrate consistent progress', icon: 'flame-progress' },
      ],
      smallMetrics: [{ label: 'Biggest Trigger', value: 'Stress' }],
      outcome: '16 days stronger',
      navigation: ['Today', 'Insights', 'Progress', 'Profile'],
      emotion: 'Control without shame',
    },
    faqs: [
      { question: 'What does RESET actually help with?', answer: 'Compulsive porn use, privately and without judgment.' },
      { question: 'Is my data private?', answer: 'Yes. Your entries are private and never shared, sold, or shown to anyone — this app was built specifically to be a safe space.' },
      { question: 'Will anyone see my entries?', answer: 'Never.' },
      { question: 'Do I need an account?', answer: 'Only your email for early access.' },
      { question: 'Do I need to feel like I have a “real problem” to use this?', answer: "No. If it's on your mind at all, that's reason enough." },
    ],
    socialProof: "Help us build RESET together — join early access and shape how it's designed.",
    accent: '#6848c7',
    accentSoft: '#f0ebff',
  },
  {
    slug: 'arrived',
    brand: 'Arrived',
    logo: '/phase2-logos/arrived.png',
    heroKicker: 'Peace of mind for the people you love',
    headline: "Never leave someone wondering if you're safe.",
    subheadline: 'Automatic safety check-ins for the people who matter most.',
    cta: 'Get automatic safety check-ins',
    benefits: ['Automatic check-ins', 'Peace of mind', 'Takes zero effort'],
    questions: [
      { id: 'primary_user', label: 'Who would use this most?', options: ['Me', 'Partner', 'Family'] },
      {
        id: 'least_safe',
        label: 'When do you feel least safe?',
        options: ['Walking home at night', 'First date / meeting someone new', 'Traveling alone', "I'm usually not worried"],
      },
      {
        id: 'usual_safety_update',
        label: 'How do you usually let someone know you’re safe?',
        options: ['I send a text', 'I share my location', 'Someone checks on me', "I don't usually tell anyone"],
      },
    ],
    mockup: {
      appName: 'Arrived',
      hero: { label: "Today's Status", value: 'Safe Home', supporting: 'Arrived at 8:42 PM' },
      today: { title: "Today's Check-in", status: 'Sent automatically', secondary: 'Partner notified' },
      features: [
        { title: 'Smart Check-ins', description: 'Automatic arrival detection', icon: 'location-check' },
        { title: 'Trusted Contacts', description: 'Notify the people you choose', icon: 'contact-group' },
        { title: 'Arrival History', description: 'Every safe arrival in one timeline', icon: 'calendar-history' },
      ],
      outcome: '27 safe arrivals this month',
      navigation: ['Home', 'Contacts', 'History', 'Profile'],
      emotion: 'Peace of mind',
    },
    faqs: [
      { question: 'Does this replace Find My?', answer: 'No — it complements it.' },
      { question: 'Will it drain my battery?', answer: 'Designed to be lightweight.' },
      { question: 'Do both people need the app?', answer: 'No.' },
    ],
    socialProof: 'Join early access and help shape Arrived before launch.',
    accent: '#dd4f73',
    accentSoft: '#ffedf2',
  },
]

export const phase2LandingPagesByPath = Object.fromEntries(
  phase2LandingPages.map((page) => [`/${page.slug}`, page]),
) as Record<string, Phase2LandingPageConfig>
