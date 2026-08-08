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

export type LandingStep = {
  title: string
  description: string
  screen: ProductScreenConfig
}

export type ProductScreenConfig = {
  mode: 'form' | 'checklist' | 'chart' | 'question' | 'reply' | 'insights' | 'journey' | 'map' | 'confirmation'
  eyebrow: string
  title: string
  primary?: string
  secondary?: string
  rows?: Array<{ label: string; value: string }>
  chart?: number[]
  action?: string
  notification?: { title: string; body: string }
}

export type LandingScenario = {
  title: string
  illustration:
    | 'glp-injection'
    | 'glp-habits'
    | 'glp-progress'
    | 'couple-busy'
    | 'couple-answering'
    | 'couple-dinner'
    | 'taxi-night'
    | 'coffee-date'
    | 'walk-home'
  image?: string
  screen: ProductScreenConfig
}

export type LandingTestimonial = {
  quote: string
  name: string
  descriptor: string
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
  problem?: {
    kicker: string
    headline: string
    headlineHighlight: string
    description: string
    situations: LandingScenario[]
  }
  howHeadline?: string
  howHighlight?: string
  howItWorks?: LandingStep[]
  difference?: {
    headline: string
    headlineHighlight: string
    description: string
    comparisons: Array<{ current: string; better: string }>
  }
  trustNote?: string
  testimonials?: LandingTestimonial[]
  finalCta?: { headline: string; headlineHighlight: string; description: string }
  questions: Phase2Question[]
  mockup: OutcomeMockupConfig
  faqs: Array<{ question: string; answer: string }>
  socialProof: string
  accent: string
  accentSoft: string
  accentDeep?: string
  textColor?: string
  mutedText?: string
  pageBackground?: string
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
    problem: {
      kicker: 'One journey, too many places',
      headline: 'Your dose is only one part of your whole story.',
      headlineHighlight: 'whole story',
      description: 'When injections, symptoms, meals and measurements live in different notes and apps, it is hard to see what is changing. TrackGLP is designed to turn those scattered details into one clear weekly view.',
      situations: [
        { title: 'Log today’s injection', illustration: 'glp-injection', screen: { mode: 'form', eyebrow: 'Today', title: 'Log injection', rows: [{ label: 'Medication', value: 'Semaglutide 1.7 mg' }, { label: 'Dose', value: '1.7 mg' }, { label: 'Injection site', value: 'Abdomen — Right' }], action: 'Save injection', notification: { title: 'Injection saved', body: 'Next dose in 6 days' } } },
        { title: 'Track daily habits', illustration: 'glp-habits', screen: { mode: 'checklist', eyebrow: 'Everything in one place', title: 'How are you feeling today?', rows: [{ label: 'Protein', value: '95 / 100 g' }, { label: 'Water', value: '2.1 / 2.5 L' }, { label: 'Walk', value: '8,432 steps' }, { label: 'Sleep', value: '7.2 h' }], action: 'Good · Okay · Low' } },
        { title: 'See your progress', illustration: 'glp-progress', screen: { mode: 'chart', eyebrow: 'Progress overview', title: '8 weeks', primary: '-8.2 kg', secondary: 'You’re doing great. Keep it up.', rows: [{ label: 'Average weekly loss', value: '1.0 kg' }, { label: 'This week', value: '-0.8 kg' }], chart: [78, 70, 73, 59, 62, 49, 45] } },
      ],
    },
    howHeadline: 'Track your whole journey, one small step at a time.',
    howHighlight: 'whole journey',
    howItWorks: [
      { title: 'Log the essentials', description: 'Record your dose, injection site and a quick daily check-in without building another spreadsheet.', screen: { mode: 'form', eyebrow: 'Log injection', title: 'Today’s dose', primary: '2.5 mg', rows: [{ label: 'Medication', value: 'Weekly dose' }, { label: 'Injection site', value: 'Left abdomen' }], action: 'Log injection' } },
      { title: 'Connect the details', description: 'Keep weight, side effects, protein, water and habits alongside your medication timeline.', screen: { mode: 'checklist', eyebrow: 'Daily signals', title: 'How are you feeling?', rows: [{ label: 'Side effects', value: 'Mild' }, { label: 'Protein', value: '92 g' }, { label: 'Water', value: '2.4 L' }, { label: 'Mood', value: 'Good' }], action: 'Complete day' } },
      { title: 'See the bigger picture', description: 'Review simple trends and prepare a clearer summary for conversations with your healthcare professional.', screen: { mode: 'chart', eyebrow: 'Progress timeline', title: '8 weeks together', primary: '-8.2 kg', secondary: 'Symptoms steadier after week 5', chart: [82, 76, 71, 69, 57, 53, 46], action: 'Open appointment summary' } },
    ],
    difference: {
      headline: 'A connected view—not another isolated tracker.',
      headlineHighlight: 'connected view',
      description: 'Notes, alarms and health apps can each hold one piece of the journey. TrackGLP is being designed around the whole routine, so the information you already track becomes easier to review together.',
      comparisons: [
        { current: 'Calendar reminders', better: 'Dose history and injection sites together' },
        { current: 'Separate food and water logs', better: 'Daily habits beside how you feel' },
        { current: 'Scattered appointment notes', better: 'One progress summary you can review' },
      ],
    },
    trustNote: 'TrackGLP is a progress companion, not a medical device or source of treatment advice. Medication decisions should always be made with a qualified healthcare professional.',
    testimonials: [
      { quote: 'I want one place where I can see my injections, symptoms and habits without piecing the week together from different apps. A clear summary would make appointments feel much less stressful.', name: 'Prospective TrackGLP user', descriptor: 'Currently tracking across notes and reminders' },
      { quote: 'The number on the scale never tells the whole story. I would use something that helps me notice how my routine and how I feel change between doses.', name: 'Prospective TrackGLP user', descriptor: 'Looking for a clearer weekly view' },
    ],
    finalCta: { headline: 'Make your GLP-1 journey easier to understand.', headlineHighlight: 'easier to understand', description: 'Join early access, answer two quick questions and help shape the first version of TrackGLP.' },
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
    accent: '#2563EB',
    accentSoft: '#EFF6FF',
    accentDeep: '#1E40AF',
    textColor: '#111827',
    mutedText: '#6B7280',
    pageBackground: '#F8FAFC',
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
    problem: {
      kicker: 'Connection gets crowded out',
      headline: 'You can love each other and still drift into logistics.',
      headlineHighlight: 'drift into logistics',
      description: 'Work, errands and screens make it easy to talk about everything except how you are both actually doing. Together creates one small moment of attention before that distance becomes the new normal.',
      situations: [
        { title: 'A moment between busy days', illustration: 'couple-busy', image: '/scenario-images/together-busy-day.jpg', screen: { mode: 'question', eyebrow: 'Today’s question', title: 'What made you feel supported this week?', secondary: 'Take a moment. There is no perfect answer.', action: 'Write my answer' } },
        { title: 'Both partners make time', illustration: 'couple-answering', image: '/scenario-images/together-both-answer.jpg', screen: { mode: 'reply', eyebrow: 'Alex answered', title: 'I felt so supported when you handled the kids’ bedtime.', primary: '12 day streak', rows: [{ label: 'You answered', value: 'Thanks for always listening to me.' }], notification: { title: 'Both answered', body: 'Ready to reconnect' } } },
        { title: 'A shared moment after dinner', illustration: 'couple-dinner', image: '/scenario-images/together-after-dinner.jpg', screen: { mode: 'confirmation', eyebrow: 'Check-in complete', title: 'One meaningful conversation started', secondary: 'Great job, you both showed up.', notification: { title: 'Together today', body: 'A small moment that matters' } } },
      ],
    },
    howHeadline: 'A tiny daily habit that keeps you connected.',
    howHighlight: 'keeps you connected',
    howItWorks: [
      { title: 'Open today’s check-in', description: 'Both partners receive one short mood check and one thoughtful question.', screen: { mode: 'question', eyebrow: 'Question of the day', title: 'What do you need more of from us this week?', secondary: 'A two-minute check-in for both of you.', action: 'Answer privately' } },
      { title: 'Answer in your own words', description: 'Take a quiet moment to share what is easy to miss in everyday conversation.', screen: { mode: 'reply', eyebrow: 'Partner check-in', title: 'Jamie answered', primary: 'Waiting for you', rows: [{ label: 'Jamie’s mood', value: 'Hopeful' }, { label: 'Your mood', value: 'Add yours' }], action: 'Share my answer' } },
      { title: 'Reconnect together', description: 'See the shared check-in, start a meaningful conversation and notice your connection over time.', screen: { mode: 'insights', eyebrow: 'Weekly connection', title: 'You made space for each other', primary: '6 of 7 days', chart: [48, 62, 56, 72, 69, 84, 91], notification: { title: 'Growing together', body: 'Listening was your strongest theme' } } },
    ],
    difference: {
      headline: 'A prompt for connection—not a replacement for talking.',
      headlineHighlight: 'prompt for connection',
      description: 'Together does not try to automate your relationship. It gives both partners a consistent, low-pressure starting point when “we should talk more” is too vague to become a habit.',
      comparisons: [
        { current: 'Waiting for the perfect moment', better: 'A two-minute opening every day' },
        { current: 'Asking “How was your day?”', better: 'A thoughtful prompt with room for honesty' },
        { current: 'Only noticing problems', better: 'Seeing small patterns and positive streaks' },
      ],
    },
    trustNote: 'Together is being designed as a private shared space for two partners. It is a daily communication habit, not therapy or a substitute for professional relationship support.',
    testimonials: [
      { quote: 'We talk every day, but most of it is about schedules and chores. I would love a tiny prompt that helps us get past the practical stuff without making it feel like homework.', name: 'Prospective Together user', descriptor: 'Busy partner seeking more meaningful check-ins' },
      { quote: 'Two minutes feels realistic even on a hectic day. I would use this if it helped us bring up the small things before they quietly turn into distance.', name: 'Prospective Together user', descriptor: 'Interested in a simple daily relationship habit' },
    ],
    finalCta: { headline: 'Make two minutes for the relationship that matters.', headlineHighlight: 'two minutes', description: 'Join early access and help shape a daily check-in that works for real couples and real schedules.' },
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
    problem: {
      kicker: 'The message everyone forgets',
      headline: '“Text me when you get home” should not depend on memory.',
      headlineHighlight: 'get home',
      description: 'After a taxi, date, night out or solo journey, the person waiting often just wants one answer: did you arrive safely? Arrived is designed to send that reassurance without another message to remember.',
      situations: [
        { title: 'Taking a taxi home at night', illustration: 'taxi-night', image: '/scenario-images/arrived-taxi-night.jpg', screen: { mode: 'map', eyebrow: 'Trip detected', title: 'Home in 14 min', primary: 'Automatic check-in active', rows: [{ label: 'Trusted contact', value: 'Mom' }, { label: 'ETA', value: '14 min' }], notification: { title: 'Confirmation', body: 'Sent automatically on arrival' } } },
        { title: 'Meeting someone new', illustration: 'coffee-date', image: '/scenario-images/arrived-cafe-date.jpg', screen: { mode: 'journey', eyebrow: 'Sharing with Maya', title: 'King Street Café', rows: [{ label: 'Expected end', value: '9:30 PM' }, { label: 'Trusted contact', value: 'Maya' }], action: 'End date & check in', notification: { title: 'On completion', body: 'Maya will be notified' } } },
        { title: 'Walking home or travelling alone', illustration: 'walk-home', image: '/scenario-images/arrived-walk-home.jpg', screen: { mode: 'confirmation', eyebrow: 'Arrived safely', title: 'Home at 10:18 PM', primary: 'Confirmation sent automatically', notification: { title: 'Mum received', body: 'Emily arrived home safely' } } },
      ],
    },
    howHeadline: 'From leaving to safe home—without another message to remember.',
    howHighlight: 'safe home',
    howItWorks: [
      { title: 'Choose the journey', description: 'Set where you are going and select the trusted person who should receive the update.', screen: { mode: 'journey', eyebrow: 'Create a journey', title: 'Where are you going?', rows: [{ label: 'Destination', value: 'Home' }, { label: 'Trusted contact', value: 'Mum' }, { label: 'Expected arrival', value: '10:20 PM' }], action: 'Start Safe Trip' } },
      { title: 'Go about your plans', description: 'Arrived is designed to recognize the planned arrival without asking you to keep checking your phone.', screen: { mode: 'map', eyebrow: 'Journey active', title: '12 minutes to home', primary: 'On the way', secondary: 'Arrival confirmation is ready.', rows: [{ label: 'Contact', value: 'Mum' }, { label: 'Battery', value: '72%' }], action: 'Trip details' } },
      { title: 'Share the confirmation', description: 'When you arrive, your chosen contact gets a simple “safe home” update automatically.', screen: { mode: 'confirmation', eyebrow: 'Safe Home', title: 'Arrived at 10:18 PM', primary: 'Sent automatically', notification: { title: 'Message delivered', body: 'Sarah arrived safely' }, action: 'Done' } },
    ],
    difference: {
      headline: 'The useful answer—without constant checking.',
      headlineHighlight: 'without constant checking',
      description: 'Manual texts are easy to forget, while continuous location sharing can feel like more access than the moment requires. Arrived focuses on a planned journey and a clear arrival confirmation.',
      comparisons: [
        { current: 'Remembering to send a text', better: 'A planned automatic arrival update' },
        { current: 'Repeated “Are you home?” messages', better: 'One clear confirmation for trusted contacts' },
        { current: 'Watching a live map', better: 'Share the outcome that matters' },
      ],
    },
    trustNote: 'Arrived is a proposed reassurance tool, not an emergency monitoring service or guarantee of personal safety. The finished experience is intended to make sharing deliberate and controlled by the person travelling.',
    testimonials: [
      { quote: 'I always mean to text when I get home, but after a long night it is the first thing I forget. An automatic confirmation would save both me and my family a lot of unnecessary worry.', name: 'Prospective Arrived user', descriptor: 'Often travels home alone' },
      { quote: 'I do not need to watch someone on a map all evening. I just want to know they made it home safely without having to chase them for a reply.', name: 'Prospective Arrived user', descriptor: 'Trusted contact looking for simple reassurance' },
    ],
    finalCta: { headline: 'Give the people you trust one less reason to worry.', headlineHighlight: 'one less reason to worry', description: 'Join early access and help shape a simpler, more intentional way to confirm you arrived safely.' },
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
