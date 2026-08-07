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

export type LandingBenefitIcon = 'bell' | 'chart' | 'check' | 'clock' | 'heart' | 'lock' | 'message' | 'sparkles' | 'target'

export type LandingBenefit = {
  title: string
  description: string
  icon: LandingBenefitIcon
}

export type Phase2LandingPageConfig = {
  slug: string
  brand: string
  logo: string
  heroKicker: string
  headline: string
  heroHighlight: string
  subheadline: string
  subheadlineHighlight?: string
  cta: string
  ctaSubtitle?: string
  ctaReassurance: string
  benefits: LandingBenefit[]
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
    heroHighlight: 'GLP-1 progress',
    subheadline: 'Track injections, weight, side effects and habits in one simple place.',
    subheadlineHighlight: 'in one simple place',
    cta: 'Get my GLP-1 progress plan',
    ctaReassurance: 'No spam. Just early access.',
    benefits: [
      { title: 'Injection reminders', description: 'Stay consistent without relying on memory.', icon: 'bell' },
      { title: 'Progress tracking', description: 'See meaningful changes over time.', icon: 'chart' },
      { title: 'Daily habit logging', description: 'Keep protein, water and habits together.', icon: 'check' },
    ],
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
      { question: "Can't I use Notes?", answer: 'You can, and many people start there. TrackGLP is designed to keep injections, progress and daily habits together in a consistent format, so you spend less time searching through separate notes. The goal is a clearer view of your journey at a glance.' },
      { question: 'Why pay for this on top of my medication?', answer: 'The value is in making your day-to-day tracking simpler and your progress easier to understand. TrackGLP brings the information you already care about into one focused place, helping you get more clarity from the routine you are already following.' },
      { question: 'Can I export data?', answer: 'Exporting your information is part of the planned experience. The aim is to make it easy to keep a copy or bring a clear summary into conversations with your healthcare professional.' },
      { question: 'Will it work with all GLP-1 medications?', answer: 'TrackGLP is being designed around common GLP-1 tracking needs rather than one specific brand. It is a progress companion, not a source of medical advice, and treatment decisions should always stay with your healthcare professional.' },
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
    heroHighlight: 'Dating again',
    subheadline: 'Practice conversations, rebuild confidence and feel ready before your next date.',
    subheadlineHighlight: 'rebuild confidence',
    cta: 'Get my dating confidence plan',
    ctaReassurance: 'Private practice at your own pace.',
    benefits: [
      { title: 'Practice real conversations', description: 'Try replies before the moment feels high-pressure.', icon: 'message' },
      { title: 'Build confidence', description: 'Improve through small, structured practice.', icon: 'sparkles' },
      { title: 'Feel ready to date again', description: 'Prepare at a pace that feels right for you.', icon: 'target' },
    ],
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
      { question: 'Why not ChatGPT?', answer: 'A general chat tool can help with one conversation at a time. NextDate is planned as a focused, structured practice experience that follows your progress and keeps each exercise connected to your confidence goals. You spend less time deciding what to ask and more time actually practising.' },
      { question: 'Will AI judge me?', answer: 'No. NextDate is intended to be a private place to practise awkward or difficult moments without social pressure. The guidance is supportive and focused on helping you feel more prepared, not grading who you are.' },
      { question: 'Can beginners use it?', answer: 'Absolutely. The experience is designed to meet you wherever you are starting, including if you have not dated for a long time or simply feel unsure. Practice can begin with small, manageable situations before moving forward.' },
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
    heroHighlight: '2 minutes a day',
    subheadline: 'A simple daily check-in that helps couples communicate better, reconnect emotionally, and build stronger relationships.',
    subheadlineHighlight: 'reconnect emotionally',
    cta: 'Reconnect with your partner',
    ctaSubtitle: 'Join couples helping shape Together before launch.',
    ctaReassurance: 'A small daily habit for both of you.',
    benefits: [
      { title: 'Daily emotional check-ins', description: 'Share how you feel in a couple of minutes.', icon: 'heart' },
      { title: 'Thoughtful conversation prompts', description: 'Make important conversations easier to begin.', icon: 'message' },
      { title: 'Track your relationship over time', description: 'Notice patterns in how you connect together.', icon: 'chart' },
    ],
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
      { question: "Can't we just talk?", answer: "Of course — Together isn't meant to replace normal conversations. It's designed to make meaningful conversations easier to start when life gets busy or you don't know what to ask. The goal is a tiny daily habit that keeps important conversations from disappearing." },
      { question: 'Will my partner need the app?', answer: 'Together works best when both partners participate, because each person contributes to the shared check-in. The experience is intentionally short so it can fit into both routines without becoming another demanding task.' },
      { question: 'Does this replace therapy?', answer: "No. Together is a simple relationship habit, not therapy or a substitute for professional support. It is designed to help couples stay connected between life's busy moments and make everyday communication easier to begin." },
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
    heroHighlight: 'Take back control',
    subheadline: 'A private daily companion helping women build healthier habits without shame.',
    subheadlineHighlight: 'private daily companion',
    cta: 'Take control of your habits',
    ctaReassurance: 'Private by design.',
    benefits: [
      { title: 'Private by design', description: 'A discreet space built around your privacy.', icon: 'lock' },
      { title: 'Understand your patterns', description: 'Notice when triggers and urges tend to appear.', icon: 'chart' },
      { title: 'Small daily wins', description: 'Build control through realistic daily actions.', icon: 'check' },
    ],
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
      { question: 'What does RESET actually help with?', answer: 'RESET is being designed to help women understand and change patterns around compulsive porn use, privately and without judgment. Daily check-ins make triggers easier to notice, while small progress markers help you focus on what you can do next.' },
      { question: 'Is my data private?', answer: 'Privacy is central to the planned product. Personal entries are intended to remain private and not be sold or shown to other people. The goal is to create a space where you can be honest without feeling exposed.' },
      { question: 'Will anyone see my entries?', answer: 'Your personal check-ins are intended for you, not for a public profile or social feed. RESET is being designed as a discreet personal companion so you can reflect on patterns without an audience.' },
      { question: 'Do I need an account?', answer: 'For early access, only your email is needed so you can be contacted about the product. The finished experience may use an account to keep your progress available to you, but the setup is intended to remain simple and private.' },
      { question: 'Do I need to feel like I have a “real problem” to use this?', answer: "No. You do not need a label or a particular level of severity to want more control over a habit. If the pattern is on your mind or does not feel aligned with how you want to live, that is enough reason to explore support." },
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
    heroHighlight: 'safe',
    subheadline: 'Automatic safety check-ins for the people who matter most.',
    subheadlineHighlight: 'Automatic safety check-ins',
    cta: 'Get automatic safety check-ins',
    ctaReassurance: 'Be first to try it.',
    benefits: [
      { title: 'Automatic check-ins', description: 'Share an arrival update without another reminder.', icon: 'check' },
      { title: 'Peace of mind', description: 'Help the people you trust know you arrived safely.', icon: 'heart' },
      { title: 'Takes zero effort', description: 'Let the routine happen quietly in the background.', icon: 'clock' },
    ],
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
      { question: 'Does this replace Find My?', answer: 'No — Arrived is intended to complement location-sharing tools rather than replace them. Its focus is the simple outcome people usually care about: knowing that you reached your destination safely without waiting for a manual text.' },
      { question: 'Will it drain my battery?', answer: 'Arrived is being designed to keep automatic check-ins lightweight rather than constantly demanding attention. Battery efficiency will be an important part of testing the experience before launch.' },
      { question: 'Do both people need the app?', answer: 'No. The person using Arrived would set up the check-in and choose who should receive the update. Trusted contacts should be able to receive that reassurance without needing to manage the same routine themselves.' },
    ],
    socialProof: 'Join early access and help shape Arrived before launch.',
    accent: '#dd4f73',
    accentSoft: '#ffedf2',
  },
]

export const phase2LandingPagesByPath = Object.fromEntries(
  phase2LandingPages.map((page) => [`/${page.slug}`, page]),
) as Record<string, Phase2LandingPageConfig>
