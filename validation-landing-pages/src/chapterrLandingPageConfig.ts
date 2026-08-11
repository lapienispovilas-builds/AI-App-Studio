export type ChapterrLandingPageConfig = {
  slug: string
  brand: string
  headline: string
  subtitle: string
  heroCta: string
  recognitionTitle: string
  recognitionCards: string[]
  concept: string
  steps: string[]
  finalHeadline: string
  finalCta: string
  typeformUrl: string
}

export const chapterrLandingPage: ChapterrLandingPageConfig = {
  slug: 'chapterr',
  brand: 'Chapterr',
  headline: "You've outgrown your old circle. You haven't found your new one yet.",
  subtitle: "Chapterr helps you meet people who are in a similar chapter of life — whether you're building something, changing direction, or becoming someone new.",
  heroCta: 'Find your people',
  recognitionTitle: 'You might be in your lonely chapter if...',
  recognitionCards: [
    'Building a business or personal project',
    'Changing career direction',
    'Improving myself and my lifestyle',
    'Starting over after a major life change',
    'Moving to a new place',
    'Figuring out my next direction',
  ],
  concept: 'Chapterr is for people going through transitions. Find others who understand your current chapter — people with similar goals, mindset, and experiences.',
  steps: ['Share your chapter', 'Discover similar people', 'Start a conversation'],
  finalHeadline: "Your next chapter shouldn't be written alone.",
  finalCta: 'Join the waitlist',
  typeformUrl: 'https://form.typeform.com/to/rFSquZQv',
}
