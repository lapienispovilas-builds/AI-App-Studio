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
}

export const chapterrStudentLandingPage: ChapterrStudentLandingPageConfig = {
  slug: 'chapterr-students',
  brand: 'Chapter',
  headline: 'Naujas miestas. Naujas etapas. Nauji žmonės.',
  subheadline: 'Tai ne dar viena Facebook ar Messenger grupė.',
  body: 'Chapter padeda atrasti žmones pagal tavo interesus, gyvenimo būdą ir tai, ko ieškai naujame gyvenimo etape.',
  heroCta: 'Rask savo žmones',
  recognitionTitle: 'Kaip kilo idėja?',
  recognitionCards: [
    'Facebook grupėje pilna žmonių, bet vis tiek nežinau kam parašyti.',
    'Persikėlus į naują miestą pirmus mėnesius daugiausia bendravau tik su viena drauge. Buvo smagu, bet norėjosi sutikti daugiau žmonių, su kuriais turėtume daugiau bendro.',
    'Norėjosi sutikti žmonių ne tik iš tos pačios paskaitos, bet tokių, su kuriais sutaptų pomėgiai.',
    'Atrodė, kad visi jau turi savo draugų grupes, o aš bandau suprasti, nuo ko pradėti.',
  ],
  conceptHeadline: 'Panašus etapas. Natūralesnė pažintis.',
  conceptItems: ['Miestą', 'Studijų etapą', 'Pomėgius', 'Gyvenimo būdą', 'Tai, ko ieškai naujame mieste'],
  goalText: 'Mūsų tikslas padėti kiekvienam naujam studentui pradėti naują gyvenimo etapą su tinkamais žmonėmis ir paversti studentavimo metus geriausiais jų gyvenime.',
  steps: [
    { title: 'Papasakok apie save', description: 'Atsakyk į trumpą klausimyną apie savo interesus, gyvenimo būdą ir tai, kokių žmonių ieškai.' },
    { title: 'Surandame panašius žmones', description: 'Pagal tavo atsakymus ieškome žmonių, su kuriais turi daugiausia bendro.' },
    { title: 'Susipažinkite', description: 'Sujungiame jus į mažą grupę, kad galėtumėte pradėti bendrauti.' },
    { title: 'Atraskite ką veikti', description: 'Gaukite idėjų veikloms, vietoms ir renginiams pagal bendrus jūsų grupės interesus.' },
  ],
  finalHeadline: 'Pirmi studijų metai prisimenami ne dėl paskaitų.',
  finalText: 'O dėl žmonių, kuriuos sutinki pakeliui.',
  finalCta: 'Rasti savo žmones',
}
