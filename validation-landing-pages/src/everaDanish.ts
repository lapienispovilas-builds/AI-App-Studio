import type { EveraFocus } from './lib/everaAccount'
import type { EveraPlan } from './lib/everaCheckout'
import type { Phase2LandingPageConfig } from './phase2LandingPageConfig'

export type EveraLocale = 'en' | 'da'

export type LocalizedQuizOption = {
  label: string
  focus: EveraFocus
  secondaryFocus?: EveraFocus
}

export type LocalizedQuizQuestion = {
  title: string
  options: LocalizedQuizOption[]
}

export const danishLandingContent = {
  problem: {
    kicker: 'Hvorfor vedligeholdelse er vigtig',
    headline: 'At stoppe GLP-1-behandling er kun begyndelsen.',
    description: 'Mange fokuserer på vægttabet, men den sværeste del kommer ofte, når behandlingen slutter — at bevare de resultater, de har arbejdet så hårdt for.',
    cards: [
      { title: 'Bekymring for vægtøgning', description: 'Efter måneders fremskridt er mange bekymrede for at miste kontrollen igen.' },
      { title: 'Mindre struktur', description: 'Uden medicinrutiner kan det føles sværere at være konsekvent.' },
      { title: 'At stå alene', description: 'De fleste mangler et klart program, der støtter overgangen.' },
    ],
  },
  research: {
    kicker: 'Hvorfor vedligeholdelse er vigtig',
    statistic: '60%',
    description: 'Forskning viste, at deltagere tog omkring 60 % af den tabte vægt på igen efter behandlingsstop.',
    value: 'Din sidste dosis er ikke slutningen på din rejse. Vedligeholdelsesfasen er dér, hvor langsigtede vaner betyder mest.',
  },
  help: {
    cards: [
      { title: 'Personlige prioriteter', description: 'Baseret på hvor du er i din GLP-1-rejse, og hvad der føles sværest lige nu.' },
      { title: 'Daglige vedligeholdelsesvaner', description: 'Enkle handlinger, der hjælper dig med at være konsekvent.' },
      { title: 'Ugentlig vejledning', description: 'Vid, hvad du skal fokusere på i hver fase af din overgang.' },
      { title: 'Tryghed i dine fremskridt', description: 'Forstå, om du er på rette vej uden at blive optaget af hvert tal.' },
    ],
  },
  how: {
    kicker: 'Sådan skabes din plan',
    headline: 'Et klart program bygget på dine svar.',
    steps: [
      { title: 'Fortæl om din rejse', description: 'Del din nuværende GLP-1-fase, dine største udfordringer og dine mål.' },
      { title: 'Modtag din personlige vedligeholdelsesplan', description: 'Få klare prioriteter og praktiske handlinger baseret på dine svar.' },
      { title: 'Skab din langsigtede rutine', description: 'Brug programmet til at opbygge vaner og tryghed, du kan tage med videre.' },
    ],
  },
}

export function createDanishLandingConfig(base: Phase2LandingPageConfig): Phase2LandingPageConfig {
  return {
    ...base,
    slug: 'dk',
    heroKicker: 'Dit personlige vedligeholdelsesprogram',
    headline: 'Lad ikke dit vægttab med GLP-1 blive midlertidigt.',
    heroHighlight: 'blive midlertidigt',
    subheadline: 'Få en personlig GLP-1-vedligeholdelsesplan baseret på din rejse, dine største udfordringer og dine mål.',
    subheadlineHighlight: 'personlig GLP-1-vedligeholdelsesplan',
    cta: 'Skab min plan',
    stickyCta: 'Skab min plan',
    ctaSubtitle: 'Skabt til din GLP-1-rejse.',
    signupHeadline: 'Få din personlige vedligeholdelsesplan.',
    socialProof: 'Besvar nogle få spørgsmål om din GLP-1-rejse, og få en plan, der passer til din nuværende fase, dine udfordringer og dine mål.',
    trustNote: 'Evera tilbyder generel vejledning og planlægningsstøtte. Evera yder ikke lægehjælp og erstatter ikke rådgivning fra en kvalificeret sundhedsperson.',
  }
}

export const danishQuestions: LocalizedQuizQuestion[] = [
  { title: 'Hvor er du i din GLP-1-rejse lige nu?', options: [
    { label: 'Jeg er lige startet på GLP-1-behandling', focus: 'Transition Preparation' },
    { label: 'Jeg taber mig i øjeblikket med GLP-1', focus: 'Sustainable Routine' },
    { label: 'Jeg nærmer mig min målvægt', focus: 'Weight Stability' },
    { label: 'Jeg er for nylig stoppet eller trapper ned', focus: 'Transition Preparation', secondaryFocus: 'Weight Stability' },
    { label: 'Jeg er allerede stoppet med GLP-1', focus: 'Weight Stability' },
  ] },
  { title: 'Hvad bekymrer dig mest efter GLP-1?', options: [
    { label: 'At tage den tabte vægt på igen', focus: 'Weight Stability' },
    { label: 'At miste de vaner, der hjalp mig', focus: 'Sustainable Routine' },
    { label: 'At miste muskler eller styrke', focus: 'Strength & Movement' },
    { label: 'Ikke at vide, hvad jeg skal gøre bagefter', focus: 'Transition Preparation' },
    { label: 'At være konsekvent på lang sigt', focus: 'Sustainable Routine' },
  ] },
  { title: 'Hvad føles sværest ved at bevare dine resultater?', options: [
    { label: 'At holde min vægt stabil', focus: 'Weight Stability' },
    { label: 'At skabe sunde rutiner uden medicin', focus: 'Sustainable Routine' },
    { label: 'At få nok protein', focus: 'Nutrition & Protein' },
    { label: 'At holde mig aktiv og stærk', focus: 'Strength & Movement' },
    { label: 'At vide hvornår og hvordan jeg skal overgå', focus: 'Transition Preparation' },
  ] },
  { title: 'Hvad vil du helst have hjælp til?', options: [
    { label: 'At holde min vægt inden for et sundt interval', focus: 'Weight Stability' },
    { label: 'At skabe daglige vaner, der holder', focus: 'Sustainable Routine' },
    { label: 'At planlægge min ernæring', focus: 'Nutrition & Protein' },
    { label: 'At beskytte muskler og styrke', focus: 'Strength & Movement' },
    { label: 'At forberede livet efter GLP-1', focus: 'Transition Preparation' },
  ] },
  { title: 'Hvor længe har du brugt GLP-1-medicin?', options: [
    { label: 'Mindre end 3 måneder', focus: 'Sustainable Routine' }, { label: '3–6 måneder', focus: 'Sustainable Routine' },
    { label: '6–12 måneder', focus: 'Weight Stability' }, { label: 'Mere end et år', focus: 'Transition Preparation' },
    { label: 'Jeg er allerede stoppet', focus: 'Transition Preparation' },
  ] },
  { title: 'Hvad er din største udfordring i hverdagen?', options: [
    { label: 'At være konsekvent', focus: 'Sustainable Routine' }, { label: 'At planlægge måltider', focus: 'Nutrition & Protein' },
    { label: 'At få nok protein', focus: 'Nutrition & Protein' }, { label: 'At finde tid til bevægelse', focus: 'Strength & Movement' },
    { label: 'At undgå gamle vaner', focus: 'Weight Stability' },
  ] },
  { title: 'Hvor sikker er du på, at du kan bevare dine resultater?', options: [
    { label: 'Ikke sikker endnu', focus: 'Transition Preparation' }, { label: 'Nogenlunde sikker', focus: 'Sustainable Routine' },
    { label: 'Meget sikker', focus: 'Weight Stability' },
  ] },
  { title: 'Hvor ofte følger du dine fremskridt?', options: [
    { label: 'Dagligt', focus: 'Weight Stability' }, { label: 'Ugentligt', focus: 'Weight Stability' },
    { label: 'En gang imellem', focus: 'Sustainable Routine' }, { label: 'Jeg følger dem ikke længere', focus: 'Transition Preparation' },
  ] },
  { title: 'Hvordan ser succes efter GLP-1 ud for dig?', options: [
    { label: 'At holde min vægt', focus: 'Weight Stability' }, { label: 'At føle mig sund og i kontrol', focus: 'Sustainable Routine' },
    { label: 'At opbygge styrke', focus: 'Strength & Movement' }, { label: 'At skabe bæredygtige vaner', focus: 'Sustainable Routine' },
    { label: 'At føle mig tryg igen', focus: 'Transition Preparation' },
  ] },
  { title: 'Hvor aktiv er du lige nu?', options: [
    { label: 'For det meste stillesiddende', focus: 'Strength & Movement' }, { label: 'Let aktiv', focus: 'Strength & Movement' },
    { label: 'Jeg træner et par gange om ugen', focus: 'Strength & Movement' }, { label: 'Regelmæssig styrketræning', focus: 'Strength & Movement' },
  ] },
  { title: 'Hvordan vil du beskrive din kost?', options: [
    { label: 'Jeg har svært ved at være konsekvent', focus: 'Sustainable Routine' }, { label: 'Jeg har brug for mere protein', focus: 'Nutrition & Protein' },
    { label: 'Jeg spiser godt, men mangler struktur', focus: 'Nutrition & Protein' }, { label: 'Jeg har allerede gode vaner', focus: 'Weight Stability' },
  ] },
  { title: 'Hvad vil gøre et GLP-1-vedligeholdelsesprogram værdifuldt for dig?', options: [
    { label: 'En klar plan efter medicinen', focus: 'Transition Preparation' }, { label: 'Daglig vejledning og ansvarlighed', focus: 'Sustainable Routine' },
    { label: 'Personlig ernæringsstøtte', focus: 'Nutrition & Protein' }, { label: 'At følge fremskridt uden at blive optaget af det', focus: 'Weight Stability' },
    { label: 'Styrke- og vaneopbygning', focus: 'Strength & Movement' },
  ] },
]

export const danishInsights = [
  { afterQuestion: 2, image: '/assets/evera-quiz/walking.jpg', myth: 'At stoppe med GLP-1 betyder, at du mister dine fremskridt.', fact: 'Langsigtet succes afhænger af vaner, ernæring og rutiner, der fortsætter efter behandlingen.' },
  { afterQuestion: 5, image: '/assets/evera-quiz/strength.jpg', myth: 'Vægttab handler kun om tallet på vægten.', fact: 'Bevarelse af muskler, proteinindtag og daglig bevægelse er vigtige dele af langsigtet succes.' },
  { afterQuestion: 8, image: '/assets/evera-quiz/nutrition.jpg', myth: 'Du har brug for medicin for altid for at bevare resultaterne.', fact: 'Overgangsfasen er dér, hvor bæredygtige vaner bliver særligt vigtige.' },
]

export const danishFocusLabels: Record<EveraFocus, string> = {
  'Weight Stability': 'Stabil vægt', 'Sustainable Routine': 'Bæredygtig rutine',
  'Nutrition & Protein': 'Ernæring & protein', 'Strength & Movement': 'Styrke & bevægelse',
  'Transition Preparation': 'Forberedelse til overgang',
}

export const danishPlans: EveraPlan[] = [
  { id: 'starter-7', name: '7-dages fundament', price: '€7.99', description: 'En enkel introduktion, der hjælper dig med at forstå dine prioriteter og skabe tryghed efter GLP-1.', badge: 'Start her', positioning: '€1.14 pr. dag', includes: ['Personlige anbefalinger', '7 dages vanevejledning', 'Grundlag for ernæring og rutiner', 'Enkle fremskridtstjek'], cta: 'Start min 7-dages plan' },
  { id: 'complete-30', name: '30-dages vedligeholdelsesplan', price: '$9.99', originalPrice: '$14.99', currency: 'USD', promotionLabel: 'End of Summer Offer', promotionCopy: 'Start din personlige 30-dages plan for $9.99 i stedet for $14.99.', description: 'Din komplette GLP-1-vedligeholdelsesplan til at beskytte dit vægttab og skabe vaner, der holder.', badge: 'Mest populær', positioning: 'Din komplette personlige GLP-1-vedligeholdelsesplan for mindre end $0.34 om dagen.', includes: ['Personlig 30-dages plan', 'Ugentlige mål', 'Daglig vanetjekliste', 'Ernærings- og proteinvejledning', 'Styrke- og bevægelsesanbefalinger', 'Opfølgning på fremskridt', 'Vejledning til livet efter GLP-1'], cta: 'Start min 30-dages plan — $9.99' },
  { id: 'journey-90', name: '90-dages vedligeholdelsesrejse', price: '€24.99', description: 'Langsigtet støtte til bæredygtige rutiner og til at bevare dine resultater ud over den første måned.', badge: 'Bedste værdi', positioning: '€0.28 pr. dag', includes: ['Alt i 30-dages planen', 'Udvidet vaneplan', 'Langsigtet opfølgning', 'Yderligere vedligeholdelsesvejledning'], cta: 'Start min 90-dages rejse' },
]

export const danishPlanPreviews: Record<EveraPlan['id'], { title: string; subtitle: string; cards: Array<{ label: string; title: string; items: string[] }> }> = {
  'starter-7': { title: 'Dit 7-dages fundament indeholder', subtitle: 'En hurtig start, der hjælper dig med at forstå dine prioriteter og skabe tryghed efter GLP-1.', cards: [
    { label: 'Trin 1', title: 'Forstå dine mål', items: ['Gennemgå din GLP-1-rejse', 'Identificér dine største udfordringer', 'Fastlæg dit udgangspunkt'] },
    { label: 'Trin 2', title: 'Skab dine første vaner', items: ['Skab enkle daglige rutiner', 'Vælg kontinuitet frem for perfektion', 'Fastlæg dine prioriteter'] },
    { label: 'Trin 3', title: 'Støt dine fremskridt', items: ['Styrk din ernæringsbevidsthed', 'Tilføj bæredygtig bevægelse', 'Følg dine første fremskridt'] },
    { label: 'Trin 4', title: 'Skab dit næste skridt', items: ['Gennemgå dine fremskridt', 'Forstå dine fokusområder', 'Vælg din langsigtede tilgang'] },
  ] },
  'complete-30': { title: 'Din 30-dages plan indeholder', subtitle: 'Et komplet vedligeholdelsessystem til at beskytte dit vægttab og skabe vaner, der holder.', cards: [
    { label: 'Uge 1', title: 'Byg dit fundament', items: ['Forstå dine mål', 'Skab din daglige rutine', 'Etablér nøgleområder'] },
    { label: 'Uge 2', title: 'Beskyt dine fremskridt', items: ['Støt dine ernæringsvaner', 'Bevar kontinuiteten', 'Skab tryghed'] },
    { label: 'Uge 3', title: 'Styrk din rutine', items: ['Forbedr bæredygtige vaner', 'Fokusér på bevægelse og styrke', 'Skab langsigtet kontinuitet'] },
    { label: 'Uge 4', title: 'Skab dit langsigtede system', items: ['Forbered dig på udfordringer', 'Byg vaner ud over programmet', 'Skab din strategi'] },
  ] },
  'journey-90': { title: 'Din 90-dages vedligeholdelsesrejse indeholder', subtitle: 'Langsigtet støtte til at gøre dine GLP-1-resultater til bæredygtige livsstilsændringer.', cards: [
    { label: 'Måned 1', title: 'Byg dit fundament', items: ['Etablér din rutine', 'Skab ernæringsvaner', 'Forstå dine mønstre'] },
    { label: 'Måned 2', title: 'Styrk din livsstil', items: ['Forbedr kontinuiteten', 'Opbyg styrke og bevægelse', 'Tilpas rutinen til hverdagen'] },
    { label: 'Måned 3', title: 'Bevar dine resultater', items: ['Håndtér udfordringer med tryghed', 'Skab dit langsigtede system', 'Fortsæt med at følge fremskridt'] },
    { label: 'Efter 90 dage', title: 'Dit vedligeholdelsesgrundlag', items: ['Bevar bæredygtige resultater', 'Forstå hvad der virker for dig', 'Fortsæt med at forbedre dine vaner'] },
  ] },
}
