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
  goalText: string
  steps: ChapterrStudentStep[]
  finalHeadline: string
  finalText: string
  finalCta: string
  typeformUrl: string
}

export const chapterrStudentLandingPage: ChapterrStudentLandingPageConfig = {
  slug: 'chapterr-students',
  brand: 'Chapter',
  headline: 'Naujas miestas. Naujas etapas. Nauji žmonės.',
  subheadline: 'Tai ne dar viena Facebook ar Messenger grupė.',
  body: 'Mūsų matching sistema padeda atrasti žmones, kurie turi panašius interesus, gyvenimo būdą ir pradeda panašų etapą kaip tu.',
  heroCta: 'Rask savo žmones',
  recognitionTitle: 'Nesvarbu, ar jautiesi taip...',
  recognitionCards: [
    'Visi jau turi savo draugų grupes, o aš nieko nepažįstu.',
    'Persikeliu į kitą miestą ir nežinau, nuo ko pradėti.',
    'Noriu sutikti žmonių, su kuriais turėčiau daugiau bendro nei tik tą pačią paskaitą.',
    'Noriu ne tik pažinčių, bet tikrų draugysčių.',
  ],
  conceptHeadline: 'Naujas etapas lengvesnis, kai jį pradedi ne vienas.',
  conceptItems: ['Miestą', 'Studijų etapą', 'Pomėgius', 'Gyvenimo būdą', 'Tai, ko ieškai naujame mieste'],
  goalText: 'Mūsų tikslas padėti kiekvienam naujam studentui pradėti naują gyvenimo etapą su tinkamais žmonėmis ir paversti studentavimo metus geriausiais jų gyvenime.',
  steps: [
    { title: 'Pasidalink apie save', description: 'Papasakok, kas esi, kuo domiesi ir kokių žmonių norėtum sutikti.' },
    { title: 'Mes randame panašius žmones', description: 'Sujungiame žmones, kurie pradeda panašų gyvenimo etapą.' },
    { title: 'Pradėkite kartu', description: 'Susipažinkite, susirašykite arba susitikite mieste.' },
    { title: 'Gaukite pasiūlymų ką veikti', description: 'Susipažinkite ne tik su vienas kitu, bet ir su miesto vietomis jūsų veikloms.' },
  ],
  finalHeadline: 'Pirmi studentų ratai formuojami dabar.',
  finalText: 'Nelik sau vienas su knygomis - registruokis dabar',
  finalCta: 'Rask savo žmones',
  typeformUrl: 'https://form.typeform.com/to/rFSquZQv',
}
