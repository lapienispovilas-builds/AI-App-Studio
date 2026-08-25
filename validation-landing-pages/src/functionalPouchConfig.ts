export type PouchPositioning = 'zyn' | 'energy' | 'coffee'

export type FunctionalPouchConfig = {
  positioning: PouchPositioning
  eyebrow: string
  headline: string
  subheadline: string
  accent: string
  accentSoft: string
  productLabel: string
  benefits: { title: string; copy: string }[]
  useCases: string[]
  alternative: string
  comparison: { alternative: string; evera: string }[]
  faq: { question: string; answer: string }[]
}

const sharedFaq = [
  { question: 'Does it contain nicotine?', answer: 'No. EVERA SHIFT is designed as a nicotine-free functional pouch.' },
  { question: 'How do I use it?', answer: 'Place one pouch under your upper lip when you want a convenient focus or energy moment. Remove and dispose of it after use.' },
  { question: 'Is it available now?', answer: 'We are preparing the first batch. Tap Buy Now to register genuine interest and get notified when it drops.' },
]

export const functionalPouchPages: Record<string, FunctionalPouchConfig> = {
  '/zyn-alternative': {
    positioning: 'zyn',
    eyebrow: 'The nicotine-free pouch ritual',
    headline: 'Keep the pouch. Lose the nicotine.',
    subheadline: 'A functional pouch designed for focus and energy — with the familiar format, without nicotine, smoke, or vapor.',
    accent: '#d9ff58',
    accentSoft: '#efffb9',
    productLabel: 'FOCUS + ENERGY',
    benefits: [
      { title: 'Zero nicotine', copy: 'A functional pouch made without nicotine or tobacco.' },
      { title: 'Familiar format', copy: 'The discreet, pocket-ready ritual you already know.' },
      { title: 'Made for the moment', copy: 'Designed for times you would normally reach for a pouch.' },
      { title: 'No smoke. No vape.', copy: 'Use it discreetly without lighting up or creating vapor.' },
    ],
    useCases: ['At your desk', 'On the commute', 'After lunch', 'On a night out'],
    alternative: 'Traditional nicotine pouch',
    comparison: [
      { alternative: 'Contains nicotine', evera: 'Nicotine-free' },
      { alternative: 'Built around a nicotine hit', evera: 'Built around functional focus' },
      { alternative: 'Familiar pouch ritual', evera: 'The same discreet format' },
    ],
    faq: sharedFaq,
  },
  '/energy': {
    positioning: 'energy',
    eyebrow: 'Pocket-sized functional energy',
    headline: 'Energy. Without the can.',
    subheadline: 'A nicotine-free functional pouch for the moments you want energy and focus — without carrying or finishing another drink.',
    accent: '#ff633d',
    accentSoft: '#ffd5ca',
    productLabel: 'CITRUS CHARGE',
    benefits: [
      { title: 'Pocket-sized', copy: 'Functional energy that fits where a can never could.' },
      { title: 'Nothing to drink', copy: 'No large beverage, full stomach, or half-finished can.' },
      { title: 'No sugar-heavy beverage', copy: 'The energy ritual without a sweet drink attached.' },
      { title: 'Ready anywhere', copy: 'A discreet option for work, training, study, or the road.' },
    ],
    useCases: ['Before the gym', 'Long workdays', 'Gaming sessions', 'On the road'],
    alternative: 'Energy drink',
    comparison: [
      { alternative: 'Bulky can to carry', evera: 'Pocket-sized format' },
      { alternative: 'A full drink', evera: 'No liquid required' },
      { alternative: 'Hard to use discreetly', evera: 'Use almost anywhere' },
    ],
    faq: sharedFaq,
  },
  '/coffee': {
    positioning: 'coffee',
    eyebrow: 'Focus that goes where you go',
    headline: 'Your 3 PM coffee just became a pouch.',
    subheadline: 'A nicotine-free functional pouch designed for productive focus — no brewing, queue, cup, or coffee run required.',
    accent: '#7be7ff',
    accentSoft: '#cdf6ff',
    productLabel: 'CLEAR FOCUS',
    benefits: [
      { title: 'No brewing', copy: 'Skip the machine, kettle, and cleanup.' },
      { title: 'No coffee queue', copy: 'Reach for focus without leaving your workflow.' },
      { title: 'Works anywhere', copy: 'Portable and easy to use at your desk or on the move.' },
      { title: 'Productivity-first', copy: 'Designed around the moments when focus starts to fade.' },
    ],
    useCases: ['The 3 PM dip', 'Deep work', 'Before a meeting', 'Study sessions'],
    alternative: 'Coffee',
    comparison: [
      { alternative: 'Brew or wait in line', evera: 'Ready in your pocket' },
      { alternative: 'Cup to carry', evera: 'No drink required' },
      { alternative: 'Interrupts your flow', evera: 'Use at your desk' },
    ],
    faq: sharedFaq,
  },
}
