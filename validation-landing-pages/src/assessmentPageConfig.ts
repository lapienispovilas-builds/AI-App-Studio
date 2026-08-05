export type AssessmentPageConfig = {
  slug: string
  brand: string
  headline: string
  subheadline: string
  typeformId: string
}

// Add future assessment funnels here. App.tsx creates the route automatically.
export const assessmentPages: AssessmentPageConfig[] = [
  {
    slug: 'glp1-tracker',
    brand: 'TrackGLP',
    headline: "What's holding back your GLP-1 results?",
    subheadline: 'Take this 30-second assessment and get your personalized result.',
    typeformId: 'ZuHEKXyS',
  },
  {
    slug: 'hair-progress',
    brand: 'HairLog',
    headline: 'Is your hair treatment actually working?',
    subheadline: 'Take this private 30-second assessment to better understand your hair journey.',
    typeformId: 'Z44DIBo3',
  },
  {
    slug: 'dating-again',
    brand: 'NextDate',
    headline: 'Are you actually ready to date again?',
    subheadline: 'Answer 5 quick questions and discover what to focus on before your next date.',
    typeformId: 'bd3TLyh5',
  },
  {
    slug: 'reset',
    brand: 'Reset',
    headline: 'How much control do you really have over your habits?',
    subheadline: 'Take this private 30-second assessment and discover your biggest blind spot.',
    typeformId: 't6KVJ3T3',
  },
]

export const assessmentPagesByPath = Object.fromEntries(
  assessmentPages.map((page) => [`/${page.slug}`, page]),
) as Record<string, AssessmentPageConfig>
