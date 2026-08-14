export type ChapterrStudentStep = {
  title: string
  description: string
}

export type ChapterrStudentLandingPageConfig = {
  slug: string
  brand: string
  headline: string
  subheadline: string
  body: string
  heroCta: string
  recognitionTitle: string
  recognitionCards: string[]
  conceptHeadline: string
  conceptItems: string[]
  steps: ChapterrStudentStep[]
  finalHeadline: string
  finalText: string
  finalCta: string
  typeformUrl: string
}

export const chapterrStudentLandingPage: ChapterrStudentLandingPageConfig = {
  slug: 'chapterr-students',
  brand: 'Chapterr',
  headline: 'Naujas miestas. Naujas etapas. Nauji žmonės.',
  subheadline: 'Atvyksti studijuoti ir nenori pradėti nuo nulio?',
  body: 'Chapterr padeda susipažinti su žmonėmis, kurie yra panašiame gyvenimo etape, turi panašių interesų ir taip pat ieško savo rato naujame mieste.',
  heroCta: 'Prisijungti prie laukiančiųjų sąrašo',
  recognitionTitle: 'Nesvarbu, ar jautiesi taip...',
  recognitionCards: [
    'Visi jau turi savo draugų grupes, o aš nieko nepažįstu.',
    'Persikeliu į kitą miestą ir nežinau, nuo ko pradėti.',
    'Noriu sutikti žmonių, su kuriais turėčiau daugiau bendro nei tik tą pačią paskaitą.',
    'Noriu ne tik pažinčių, bet tikrų draugysčių.',
  ],
  conceptHeadline: 'Naujas etapas lengvesnis, kai jį pradedi ne vienas.',
  conceptItems: ['Miestą', 'Studijų etapą', 'Pomėgius', 'Gyvenimo būdą', 'Tai, ko ieškai naujame mieste'],
  steps: [
    { title: 'Pasidalink apie save', description: 'Papasakok, kas esi, kuo domiesi ir kokių žmonių norėtum sutikti.' },
    { title: 'Mes randame panašius žmones', description: 'Sujungiame žmones, kurie pradeda panašų gyvenimo etapą.' },
    { title: 'Pradėkite kartu', description: 'Susipažinkite, susirašykite arba susitikite mieste.' },
    { title: 'Gaukite pasiūlymų ką veikti', description: 'Susipažinkite ne tik su vienas kitu, bet ir su miesto vietomis jūsų veikloms.' },
  ],
  finalHeadline: 'Pirmi studentų ratai formuojami dabar.',
  finalText: 'Prisijunk prie pirmųjų žmonių, kurie pradės naują etapą kartu.',
  finalCta: 'Noriu prisijungti',
  typeformUrl: 'https://form.typeform.com/to/rFSquZQv',
}
