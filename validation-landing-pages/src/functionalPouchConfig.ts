export type PouchPositioning = 'zyn' | 'coffee' | 'preworkout'

export type FunctionalPouchConfig = {
  positioning: PouchPositioning; heroImage: string; mobileHeroImage: string; lifestyleImage: string; secondaryImage: string; lineupImage: string
  eyebrow: string; headline: string; subheadline: string; accent: string; accentSoft: string
  experienceTitle: string; experienceIntro: string
  benefits: { title: string; copy: string }[]
  storyTitle: string; storyCopy: string; storyPoints: string[]
  flavors: { name: string; note: string }[]
  ingredients: { name: string; dose: string; why: string }[]
  testimonials: { quote: string; name: string; context: string }[]
  finalTitle: string
}

export const functionalPouchPages: Record<string, FunctionalPouchConfig> = {
  '/zyn-alternative': {
    positioning: 'zyn', heroImage: '/functional-pouch/campaign/hero-zyn.jpg', mobileHeroImage: '/functional-pouch/campaign/hero-zyn-mobile-v2.png', lifestyleImage: '/functional-pouch/campaign/lifestyle-zyn.jpg', secondaryImage: '/functional-pouch/campaign/secondary-zyn.jpg', lineupImage: '/functional-pouch/campaign/lineup-zyn-transparent.png',
    eyebrow: 'Ett nikotinfritt ritualbyte', headline: 'Behåll pausen. Skippa nikotinet.',
    subheadline: 'En funktionell prilla för dig som gillar ritualen men vill välja bort nikotin – hemma, på jobbet eller på språng.',
    accent: '#e3f59f', accentSoft: '#f1f6d7',
    experienceTitle: 'Samma enkla ritual. En annan känsla.', experienceIntro: 'EVERA RITUAL är framtagen för stunderna då handen annars går mot en nikotinprilla eller cigarett.',
    benefits: [
      { title: 'Lugn skärpa', copy: 'L-teanin står i centrum för en balanserad stund utan nikotin.' },
      { title: 'Mild energi', copy: 'En låg dos naturligt koffein – märkbar, men inte byggd för maxpuls.' },
      { title: 'Diskret ritual', copy: 'Ett välbekant format som fungerar på mötet, tåget och utekvällen.' },
    ],
    storyTitle: 'För stunden mellan två saker.', storyCopy: 'När du vill ta en paus utan rök, vape eller ännu en nikotindos. En liten dosa som passar i vardagen – inte tvärtom.',
    storyPoints: ['0 mg nikotin', 'Ingen rök eller ånga', '20 prillor per dosa'],
    flavors: [{ name: 'Citrus Mint', note: 'Frisk · balanserad' }, { name: 'Nordic Berry', note: 'Mjuk · syrlig' }, { name: 'Cool Spearmint', note: 'Ren · sval' }],
    ingredients: [
      { name: 'Naturligt koffein', dose: '25 mg', why: 'En mild nivå för ritual och vardagsfokus.' }, { name: 'L-teanin', dose: '175 mg', why: 'Huvudingrediensen i den balanserade formuleringen.' },
      { name: 'Vitamin B12', dose: '150 µg', why: 'Bidrar till normal energiomsättning.' }, { name: 'Rosenrotsextrakt', dose: '75 mg', why: 'Ett växtextrakt i vår nikotinfria blandning.' },
    ],
    testimonials: [
      { quote: 'Det jag söker är något som kan ersätta själva ZYN-stunden – utan att kännas som ett stort projekt.', name: 'Johan, 31', context: 'Tidigare daglig prillanvändare' },
      { quote: 'Formatet känns bekant. Det viktiga för mig är att kunna ta en diskret paus utan nikotin.', name: 'Emelie, 29', context: 'Social rökare' },
      { quote: 'Jag vill inte ha en quit-produkt. Jag vill ha ett bättre vardagsval som fortfarande känns bra.', name: 'Marcus, 36', context: 'Konceptdeltagare' },
    ], finalTitle: 'Redo för en ny ritual?',
  },
  '/coffee': {
    positioning: 'coffee', heroImage: '/functional-pouch/campaign/hero-coffee.jpg', mobileHeroImage: '/functional-pouch/campaign/hero-coffee-mobile-v2.png', lifestyleImage: '/functional-pouch/campaign/lifestyle-coffee.jpg', secondaryImage: '/functional-pouch/campaign/secondary-coffee.jpg', lineupImage: '/functional-pouch/campaign/lineup-coffee-transparent.png',
    eyebrow: 'Fokus för krävande dagar', headline: 'Fokus utan ännu en kaffe.',
    subheadline: 'En funktionell prilla för långa arbetsdagar, djupjobb och eftermiddagen när nästa kopp känns som fel lösning.',
    accent: '#d9b88f', accentSoft: '#f1e2d1',
    experienceTitle: 'När kalendern fortsätter men kaffet inte borde göra det.', experienceIntro: 'EVERA FOKUS ger dig ett portabelt alternativ för produktiva stunder – utan bryggning, kö eller kopp.',
    benefits: [
      { title: 'Jämnare arbetsrytm', copy: 'En genomtänkt kombination av naturligt koffein och L-teanin.' },
      { title: 'Fokus i fickan', copy: 'Redo när du går in i ett möte, en deadline eller ett djupt arbetspass.' },
      { title: 'Ingen kaffepaus krävs', copy: 'Inget bryggande, ingen kö och ingen kopp som kallnar bredvid datorn.' },
    ],
    storyTitle: 'Byggd för ambition. Inte för ännu en kopp.', storyCopy: 'För dig som älskar att prestera men är trött på att planera dagen runt kaffe – och på känslan när den tredje koppen slår fel.',
    storyPoints: ['Naturligt koffein', 'Portabelt format', '20 prillor per dosa'],
    flavors: [{ name: 'Smooth Mocha', note: 'Rund · mjuk' }, { name: 'Vanilla Oat', note: 'Len · lätt' }, { name: 'Fresh Mint', note: 'Klar · frisk' }],
    ingredients: [
      { name: 'Naturligt koffein', dose: '45 mg', why: 'En måttlig dos för fokuserade arbetsstunder.' }, { name: 'L-teanin', dose: '100 mg', why: 'Kombineras med koffein i den balanserade formuleringen.' },
      { name: 'Citikolin', dose: '62,5 mg', why: 'Ett kolininnehållande ämne i fokusblandningen.' }, { name: 'Vitamin B5, B9 & B12', dose: 'NRV-anpassat', why: 'Utvalda B-vitaminer för vardagens energiomsättning.' },
    ],
    testimonials: [
      { quote: 'Jag vill kunna hålla fokus efter lunch utan att automatiskt gå och köpa dagens tredje kaffe.', name: 'Sofia, 34', context: 'Produktchef' },
      { quote: 'En diskret prilla känns mycket enklare mellan möten än ännu en kopp jag ändå glömmer bort.', name: 'Alexander, 32', context: 'Konsult' },
      { quote: 'Jag söker skärpan från min kaffepaus, men med mindre av berg-och-dalbanan runt omkring.', name: 'Linnea, 38', context: 'Kreativ chef' },
    ], finalTitle: 'Gör plats för fokus.',
  },
  '/energy': {
    positioning: 'preworkout', heroImage: '/functional-pouch/campaign/hero-preworkout.jpg', mobileHeroImage: '/functional-pouch/campaign/hero-preworkout-mobile-v2.png', lifestyleImage: '/functional-pouch/campaign/lifestyle-preworkout.jpg', secondaryImage: '/functional-pouch/campaign/secondary-preworkout.jpg', lineupImage: '/functional-pouch/campaign/lineup-preworkout-transparent.png',
    eyebrow: 'Energi före rörelse', headline: 'Lite mer driv. Utan hela pre-workouten.',
    subheadline: 'En funktionell prilla för löprundan, padelmatchen eller passet efter jobbet – när du vill ha energi, inte maxad känsla.',
    accent: '#e3f59f', accentSoft: '#f1f6d7',
    experienceTitle: 'Gå från seg till redo.', experienceIntro: 'EVERA MOVE är för vanliga aktiva människor som vill få fart på passet utan shaker, stor burk eller tung pre-workoutkänsla.',
    benefits: [
      { title: 'Kontrollerad energi', copy: 'Naturligt koffein i ett litet, enkelt format.' },
      { title: 'Redo när du är det', copy: 'Passar före löpning, cykling, padel eller ett snabbt pass efter jobbet.' },
      { title: 'Ingen shaker', copy: 'Ingen blandning, inget pulver och ingen stor dryck före rörelse.' },
    ],
    storyTitle: 'Träning behöver inte börja med en stor grej.', storyCopy: 'Du behöver inte jaga personbästa varje gång. Ibland vill du bara byta om, komma ut och känna att kroppen är med.',
    storyPoints: ['Naturligt koffein', 'Inget pulver eller vätska', '20 prillor per dosa'],
    flavors: [{ name: 'Icy Lime', note: 'Syrlig · kall' }, { name: 'Berry Rush', note: 'Fruktig · frisk' }, { name: 'Arctic Mint', note: 'Ren · intensiv' }],
    ingredients: [
      { name: 'Naturligt koffein', dose: '90 mg', why: 'Den mest energiinriktade formuleringen i serien.' }, { name: 'L-tyrosin', dose: '200 mg', why: 'En aminosyra i blandningen för aktiva stunder.' },
      { name: 'Taurin', dose: '200 mg', why: 'En välkänd ingrediens i funktionella energiprodukter.' }, { name: 'Vitamin B3, B6 & B12', dose: 'NRV-anpassat', why: 'Utvalda vitaminer som bidrar till normal energiomsättning.' },
    ],
    testimonials: [
      { quote: 'Jag vill ha den lilla knuffen som får mig ut genom dörren – inte känna mig uppskruvad hela kvällen.', name: 'Erik, 35', context: 'Motionslöpare' },
      { quote: 'Efter jobbet orkar jag inte alltid blanda pre-workout. Ett enkelt format hade passat min vardag bättre.', name: 'Maja, 30', context: 'Padel & gruppträning' },
      { quote: 'Jag tränar för att må bra, inte för att maxa. Det här är precis den nivå av energi jag letar efter.', name: 'Daniel, 41', context: 'Aktiv småbarnsförälder' },
    ], finalTitle: 'Gör passet lite enklare att börja.',
  },
}
