export type ChapterLegalSection = {
  title: string
  paragraphs?: string[]
  items?: string[]
}

export type ChapterLegalPageConfig = {
  slug: string
  title: string
  intro: string
  sections: ChapterLegalSection[]
}

export const chapterLegalPages: ChapterLegalPageConfig[] = [
  {
    slug: 'chapter-privatumo-politika',
    title: 'Privatumo politika',
    intro: 'Šioje privatumo politikoje paaiškiname, kokius asmens duomenis gali rinkti Chapter, kodėl juos renkame ir kokias teises turite.',
    sections: [
      {
        title: 'Kas yra Chapter',
        paragraphs: ['Chapter yra ankstyvos stadijos studentų pažinčių ir grupių formavimo platforma, padedanti panašiame gyvenimo etape esantiems žmonėms atrasti vieniems kitus. Duomenų valdytojas: [Įmonės pavadinimas].'],
      },
      {
        title: 'Kokius duomenis renkame',
        items: ['Vardą', 'Kontaktinę informaciją', 'Instagram paskyrą, jeigu ją pateikiate', 'Miestą', 'Universitetą ir informaciją apie studijas', 'Pomėgius', 'Atsakymus į klausimyną'],
      },
      {
        title: 'Kodėl renkame šiuos duomenis',
        items: ['Tinkamų žmonių ir grupių sudarymui', 'Susisiekimui dėl Chapter platformos ir jūsų registracijos', 'Paslaugos veikimo, saugumo ir kokybės gerinimui'],
      },
      {
        title: 'Kaip naudojame informaciją',
        paragraphs: ['Informaciją naudojame tik nurodytais tikslais: įvertinti galimus sutapimus, formuoti grupes, susisiekti su jumis ir tobulinti ankstyvąją paslaugos versiją. Duomenų neparduodame. Informacija gali būti perduodama tik patikimiems paslaugų teikėjams, kai tai būtina platformos veikimui, arba kai to reikalauja teisės aktai.'],
      },
      {
        title: 'Duomenų saugojimas',
        paragraphs: ['Duomenis saugome tik tiek laiko, kiek reikia šiame dokumente aprašytiems tikslams įgyvendinti arba teisės aktų reikalavimams vykdyti. Kai duomenys tampa nebereikalingi, juos ištriname arba nuasmeniname.'],
      },
      {
        title: 'Duomenų apsauga',
        paragraphs: ['Taikome pagrįstas organizacines ir technines priemones, skirtas apsaugoti informaciją nuo neteisėtos prieigos, praradimo, pakeitimo ar atskleidimo. Vis dėlto nė vienas perdavimo ar saugojimo būdas internete negali užtikrinti absoliutaus saugumo.'],
      },
      {
        title: 'Jūsų teisės',
        paragraphs: ['Pagal taikomus duomenų apsaugos teisės aktus galite prašyti susipažinti su savo duomenimis, juos ištaisyti, ištrinti, apriboti jų tvarkymą, nesutikti su tam tikru tvarkymu ar gauti duomenų kopiją perkeliamu formatu. Taip pat galite atšaukti sutikimą, kai duomenys tvarkomi jo pagrindu, ir pateikti skundą Valstybinei duomenų apsaugos inspekcijai.'],
      },
      {
        title: 'Kontaktai dėl duomenų pašalinimo',
        paragraphs: ['Norėdami pasinaudoti savo teisėmis arba paprašyti pašalinti duomenis, rašykite: info@chapter.lt. Prieš įvykdydami prašymą galime paprašyti patvirtinti jūsų tapatybę.'],
      },
    ],
  },
  {
    slug: 'chapter-naudojimosi-salygos',
    title: 'Naudojimosi sąlygos',
    intro: 'Šios paprastos sąlygos paaiškina, kaip galima naudotis ankstyvąja Chapter platformos versija.',
    sections: [
      { title: 'Chapter paskirtis', paragraphs: ['Chapter padeda studentams atrasti panašiame gyvenimo etape esančius žmones. Platforma gali siūlyti galimas pažintis ar grupes, tačiau negarantuoja, kad kiekvienam vartotojui bus rastas tinkamas sutapimas ar užsimegs draugystė.'] },
      { title: 'Platformos naudojimas', paragraphs: ['Naudodamiesi Chapter sutinkate platformą naudoti teisėtai, sąžiningai ir gerbti kitus žmones. Ankstyvoji versija gali keistis, veikti su pertrūkiais arba turėti ribotą funkcionalumą.'] },
      { title: 'Registracijos taisyklės', paragraphs: ['Registruodamiesi pateikite teisingą ir aktualią informaciją. Nenaudokite kito asmens tapatybės ir neteikite informacijos be teisės ją pateikti. Chapter gali atsisakyti registracijos ar pašalinti įrašą, jei pažeidžiamos šios sąlygos.'] },
      { title: 'Atsakomybė už pateiktą informaciją', paragraphs: ['Jūs atsakote už savo pateiktą informaciją, jos tikslumą ir turinį. Neskelbkite jautrios informacijos, kurios nenorite atskleisti galimiems kontaktams ar grupės nariams.'] },
      { title: 'Bendravimas su kitais vartotojais', paragraphs: ['Bendraukite pagarbiai ir atsargiai. Patys sprendžiate, ar tęsti pokalbį ir susitikti gyvai. Pirmus susitikimus rekomenduojame planuoti viešoje vietoje ir apie juos informuoti patikimą žmogų.'] },
      { title: 'Draudžiamas elgesys', items: ['Priekabiavimas, grasinimai ar diskriminacija', 'Melagingos tapatybės ir apgaulinga informacija', 'Šlamštas, neteisėta reklama ar kitų vartotojų duomenų rinkimas', 'Neteisėtas, žalingas ar kitų teises pažeidžiantis turinys'] },
      { title: 'Paslaugos keitimas ar nutraukimas', paragraphs: ['Kadangi Chapter yra ankstyvos stadijos produktas, galime keisti, laikinai sustabdyti arba nutraukti jo dalis. Apie esminius pokyčius, kai praktiškai įmanoma, informuosime naudodami jūsų pateiktus kontaktinius duomenis.'] },
      { title: 'Kontaktai', paragraphs: ['Klausimus apie šias sąlygas siųskite adresu: info@chapter.lt'] },
    ],
  },
  {
    slug: 'chapter-slapuku-politika',
    title: 'Slapukų politika',
    intro: 'Čia paaiškiname, kas yra slapukai ir kaip jie gali būti naudojami Chapter svetainėje.',
    sections: [
      { title: 'Kas yra slapukai', paragraphs: ['Slapukai yra nedideli tekstiniai failai, kuriuos svetainė gali išsaugoti jūsų įrenginyje. Jie padeda svetainei veikti, prisiminti pasirinkimus arba suprasti, kaip lankytojai naudojasi puslapiu.'] },
      { title: 'Kokius slapukus gali naudoti svetainė', paragraphs: ['Dabartinė ankstyvoji Chapter versija gali naudoti tik būtiną funkcionalumą. Ateityje, jei bus įdiegtos analizės ar kitos nebūtinos priemonės, ši politika bus atnaujinta ir, kai reikia, prieš jas aktyvuojant bus prašoma jūsų sutikimo.'] },
      { title: 'Būtinieji slapukai', paragraphs: ['Būtinieji slapukai ir panašios technologijos gali būti reikalingi techniniam svetainės veikimui, saugumui, formų pateikimui ar jūsų privatumo pasirinkimų išsaugojimui. Be jų kai kurios svetainės dalys gali neveikti tinkamai.'] },
      { title: 'Analitiniai slapukai', paragraphs: ['Analitiniai slapukai gali padėti suprasti bendrą svetainės naudojimą ir ją gerinti. Jei tokie slapukai bus naudojami, jie nebus aktyvuojami be reikiamo sutikimo, išskyrus atvejus, kai teisės aktai leidžia kitaip.'] },
      { title: 'Kaip valdyti slapukus', paragraphs: ['Slapukus galite valdyti svetainėje pateikiamu pasirinkimu, jei jis rodomas, arba savo naršyklės nustatymuose. Galite ištrinti jau išsaugotus slapukus ar užblokuoti naujus, tačiau dėl to kai kurios funkcijos gali veikti netinkamai.'] },
    ],
  },
  {
    slug: 'chapter-kontaktai',
    title: 'Susisiek su mumis',
    intro: 'Jeigu turi klausimų, pasiūlymų ar nori bendradarbiauti — parašyk mums.',
    sections: [
      { title: 'El. paštas', paragraphs: ['info@chapter.lt'] },
    ],
  },
]

export const chapterLegalPagesByPath = Object.fromEntries(
  chapterLegalPages.map((page) => [`/${page.slug}`, page]),
)
