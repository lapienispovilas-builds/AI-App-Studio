export type MockupRow = {
  label: string
  value: string
}

export type LandingPageConfig = {
  path: string
  name: string
  icon: string
  eyebrow: string
  headline: string
  subheadline: string
  benefits: string[]
  priceQuestion: string
  frustrationQuestion: string
  mockup: {
    title: string
    subtitle: string
    rows: MockupRow[]
    action: string
  }
  accent: string
  accentSoft: string
}

// All editable landing-page copy lives here. Keep changes aligned with the briefs in /docs.
export const landingPages: LandingPageConfig[] = [
  {
    path: '/adhd-spending',
    name: 'MindSpend',
    icon: '/icons/mindspend.png',
    eyebrow: 'STOP IMPULSE BUYING WITHOUT BUDGETING',
    headline: 'Take control of ADHD impulse spending',
    subheadline: 'Finally understand where your money disappears by tracking impulsive buying.',
    benefits: ['Log purchases instantly', 'Spot spending patterns', 'Build awareness instead of guilt'],
    priceQuestion: 'Would you pay €4.99/month?',
    frustrationQuestion: "What’s your biggest frustration with impulse spending?",
    mockup: {
      title: 'This month',
      subtitle: 'Impulse spending overview',
      rows: [
        { label: 'Quick Add Expense', value: '10 sec' },
        { label: 'Purchases logged', value: '12' },
        { label: 'Monthly Insights', value: 'View' },
      ],
      action: '+ Quick add',
    },
    accent: '#635bff',
    accentSoft: '#eeecff',
  },
  {
    path: '/safety-check-in',
    name: 'Arrived',
    icon: '/icons/arrived.png',
    eyebrow: 'Automatic peace of mind',
    headline: "Your loved ones shouldn’t have to wonder if you’re okay.",
    subheadline: 'Create automatic safety check-ins for dates, trips and late-night walks.',
    benefits: ['Automatic reminders', 'Trusted emergency contacts', 'Peace of mind'],
    priceQuestion: 'Would you pay for this app?',
    frustrationQuestion: 'What’s your biggest frustration with staying in touch about your safety?',
    mockup: {
      title: 'Tonight’s check-in',
      subtitle: 'Late-night walk · 10:30 PM',
      rows: [
        { label: 'Reminder', value: '10:25 PM' },
        { label: 'Trusted contact', value: 'Maya' },
        { label: 'Status', value: 'Scheduled' },
      ],
      action: 'I’m safe',
    },
    accent: '#e64d72',
    accentSoft: '#ffedf2',
  },
  {
    path: '/couples-check-in',
    name: 'Together',
    icon: '/icons/together.png',
    eyebrow: 'Two minutes for the two of you',
    headline: "Don't let routine replace connection.",
    subheadline: 'Spend just two minutes a day reconnecting with your partner through meaningful daily check-ins.',
    benefits: ['Daily connection', 'Better communication', 'Relationship insights'],
    priceQuestion: 'Would you pay for this app?',
    frustrationQuestion: 'What’s your biggest frustration with staying connected as a couple?',
    mockup: {
      title: 'Daily check-in',
      subtitle: '2 minutes · Together',
      rows: [
        { label: 'How are you feeling?', value: 'Good' },
        { label: 'What do you need?', value: 'Talk' },
        { label: 'Check-in streak', value: '8 days' },
      ],
      action: 'Check in together',
    },
    accent: '#e1558d',
    accentSoft: '#fff0f6',
  },
  {
    path: '/doomscrolling',
    name: 'UnScroll',
    icon: '/icons/unscroll.png',
    eyebrow: "It's never \"just 5 minutes\"",
    headline: 'Break the doomscrolling habit.',
    subheadline: 'Replace endless scrolling with a calming bedtime routine.',
    benefits: ['Gentle reminders', 'Better sleep', 'Healthier evenings'],
    priceQuestion: 'Would you pay for this app?',
    frustrationQuestion: 'What’s your biggest frustration with bedtime scrolling?',
    mockup: {
      title: 'Time to wind down',
      subtitle: 'Your bedtime routine is ready',
      rows: [
        { label: 'Put down your phone', value: 'Now' },
        { label: 'Slow breathing', value: '2 min' },
        { label: 'Bedtime', value: '11:00 PM' },
      ],
      action: 'Start wind-down',
    },
    accent: '#5267d9',
    accentSoft: '#edf0ff',
  },
  {
    path: '/subscription-tracker',
    name: 'SubSense',
    icon: '/icons/subsense.png',
    eyebrow: "Don't let free trials become paid subscriptions.",
    headline: 'Stop paying for subscriptions you forgot existed.',
    subheadline: 'See every recurring payment in one simple place.',
    benefits: ['One subscription dashboard', 'Renewal reminders', 'Monthly spending overview'],
    priceQuestion: 'Would you pay for this app?',
    frustrationQuestion: 'What’s your biggest frustration with recurring payments?',
    mockup: {
      title: 'Your subscriptions',
      subtitle: '€47.96 due this month',
      rows: [
        { label: 'Music', value: '€10.99' },
        { label: 'Streaming', value: '€15.99' },
        { label: 'Cloud storage', value: '€2.99' },
      ],
      action: '+ Add subscription',
    },
    accent: '#17866e',
    accentSoft: '#e8f8f3',
  },
]

export const landingPagesByPath = Object.fromEntries(
  landingPages.map((page) => [page.path, page]),
) as Record<string, LandingPageConfig>
