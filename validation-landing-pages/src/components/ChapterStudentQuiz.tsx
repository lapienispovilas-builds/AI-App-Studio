import { ArrowLeft, ArrowRight, Check, Star, UsersRound } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { submitLead } from '../lib/submitLead'
import { trackMetaEvent, trackMetaLead } from '../lib/metaPixel'

type QuizAnswer = string | string[]
type QuizAnswers = Record<string, QuizAnswer>

type Question = {
  id: string
  title: string
  description: string
  type: 'single' | 'multiple' | 'text' | 'email' | 'contact'
  options?: string[]
  placeholder?: string
}

const optionDescriptions: Record<string, Record<string, string>> = {
  startStyle: {
    'Pradėti nuo naujų žmonių': 'Noriu susipažinti su žmonėmis, kurių dar nepažįstu.',
    'Prisijungti kartu su jau pažįstamu žmogumi': 'Turiu draugą(-ę), su kuriuo(-ia) norėčiau pradėti ir sutikti daugiau panašių žmonių.',
    'Išplėsti savo dabartinį ratą': 'Jau pažįstu žmonių, bet noriu rasti daugiau bendraminčių.',
  },
}

const questions: Question[] = [
  {
    id: 'city',
    title: 'Kuriame mieste pradėsi studijas?',
    description: 'Norime sujungti tave su žmonėmis, kurie bus tame pačiame mieste ir galės susitikti ne tik internete.',
    type: 'single',
    options: ['Vilnius', 'Kaunas', 'Klaipėda', 'Šiauliai', 'Panevėžys', 'Kitas'],
  },
  {
    id: 'studies',
    title: 'Ką studijuosi?',
    description: 'Kartais lengviausias būdas pradėti pokalbį yra rasti žmogų, kuris supranta tavo studijų kryptį arba turi panašių interesų.',
    type: 'text',
    placeholder: 'Pvz. marketingas, medicina, programavimas...',
  },
  {
    id: 'studyStage',
    title: 'Kuriame studijų etape esi?',
    description: 'Pirmi metai, magistras ar naujas etapas po pertraukos dažnai reiškia skirtingus iššūkius. Norime rasti žmones, kurie išgyvena panašų laikotarpį.',
    type: 'single',
    options: ['Pirmi bakalauro metai', 'Tęsiu bakalauro studijas', 'Magistras', 'Doktorantūra', 'Nesimokau, bet pradedu naują etapą'],
  },
  {
    id: 'currentStage',
    title: 'Koks tavo dabartinis etapas?',
    description: 'Tai padės suprasti, kokios pažintys ir kokio tipo ratas tau šiuo metu būtų naudingiausias.',
    type: 'single',
    options: ['Persikeliu į naują miestą ir nieko nepažįstu', 'Persikeliu, bet turiu kelis pažįstamus', 'Esu savo mieste, bet noriu naujo rato', 'Noriu tiesiog sutikti daugiau panašių žmonių'],
  },
  {
    id: 'startStyle',
    title: 'Kaip norėtum pradėti savo naują etapą?',
    description: 'Vieni pradeda visiškai nuo nulio, kiti jau turi kelis pažįstamus. Norime suprasti, koks variantas tau būtų naudingiausias.',
    type: 'single',
    options: ['Pradėti nuo naujų žmonių', 'Prisijungti kartu su jau pažįstamu žmogumi', 'Išplėsti savo dabartinį ratą'],
  },
  {
    id: 'peopleType',
    title: 'Kokio tipo žmones norėtum sutikti?',
    description: 'Kiekvienas ieško skirtingo savo rato. Tai padeda suprasti, su kuo tau būtų įdomiausia susipažinti. Gali pasirinkti kelis variantus.',
    type: 'multiple',
    options: ['Aktyvių ir mėgstančių veiklas', 'Ambicingų ir siekiančių tikslų', 'Ramių pokalbių ir kavos draugų', 'Kūrybingų žmonių', 'Sportuojančių žmonių', 'Naujas miestas / naujos patirtys'],
  },
  {
    id: 'freeTime',
    title: 'Kaip mėgsti leisti savo laisvalaikį?',
    description: 'Pagal pomėgius lengviau rasti žmones, su kuriais iškart turi apie ką kalbėti. Gali pasirinkti kelis variantus.',
    type: 'multiple',
    options: ['Sportas / gym / aktyvumas', 'Kavinės / brunch / chill', 'Vakarėliai / barai / naktinis gyvenimas', 'Gaming / filmai / serialai', 'Kūryba / fotografija / menas', 'Verslas / startupai / side projects', 'Kelionės', 'Kita'],
  },
  {
    id: 'universityEmail',
    title: 'Tavo universiteto el. paštas',
    description: 'Norime įsitikinti, kad Chapter ratus kuriame tik studentams. Tavo universiteto el. paštas padės mums suprasti, iš kokių universitetų jungiasi studentai ir geriau suformuoti pirmuosius ratus.',
    type: 'email',
    placeholder: 'vardas@universitetas.lt',
  },
  {
    id: 'contacts',
    title: 'Kur galime tau parašyti?',
    description: 'Kai tavo mieste susiformuos pirmasis Chapter ratas, susisieksime su kvietimu prisijungti.',
    type: 'contact',
  },
]

const storageKey = 'chapter_student_quiz_answers'

function initialAnswers(): QuizAnswers {
  try {
    const stored = window.sessionStorage.getItem(storageKey)
    return stored ? JSON.parse(stored) as QuizAnswers : {}
  } catch {
    return {}
  }
}

function answerAsText(answer: QuizAnswer | undefined) {
  return Array.isArray(answer) ? answer.join(', ') : answer ?? ''
}

function chapterHomeHref() {
  return ['trychapter.lt', 'www.trychapter.lt'].includes(window.location.hostname.toLowerCase()) ? '/' : '/chapterr-students'
}

export function ChapterStudentQuiz() {
  const [screen, setScreen] = useState<'intro' | 'questions' | 'complete'>('intro')
  const [interstitial, setInterstitial] = useState<'party' | 'special' | null>(null)
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswers>(initialAnswers)
  const [contactMethod, setContactMethod] = useState(() => {
    const storedMethod = answerAsText(initialAnswers().contactMethod)
    return storedMethod === 'Email' ? 'El. paštas' : storedMethod
  })
  const [phone, setPhone] = useState(() => answerAsText(initialAnswers().phone))
  const [instagram, setInstagram] = useState(() => answerAsText(initialAnswers().instagram))
  const [messengerName, setMessengerName] = useState(() => answerAsText(initialAnswers().messengerName))
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const hasTrackedLead = useRef(false)
  const question = questions[index]

  useEffect(() => {
    try { window.sessionStorage.setItem(storageKey, JSON.stringify({ ...answers, contactMethod, phone, instagram, messengerName })) } catch { /* Keep quiz usable when storage is unavailable. */ }
  }, [answers, contactMethod, phone, instagram, messengerName])

  const canContinue = useMemo(() => {
    if (question.type === 'contact') {
      if (!contactMethod) return false
      if (contactMethod === 'Instagram') return instagram.trim().length > 1
      if (contactMethod === 'WhatsApp') return phone.trim().length >= 6
      return true
    }
    const value = answers[question.id]
    if (question.type === 'email') return /\S+@\S+\.\S+/.test(answerAsText(value).trim())
    return Array.isArray(value) ? value.length > 0 : Boolean(value?.trim())
  }, [answers, contactMethod, instagram, phone, question])

  function startQuiz() {
    setScreen('questions')
    trackMetaEvent('quiz_started', { quiz_name: 'chapter_student_matching' }, { custom: true, onceKey: 'chapter_quiz_started' })
  }

  function setSingle(value: string) {
    setAnswers((current) => ({ ...current, [question.id]: value }))
  }

  function toggleMultiple(value: string) {
    setAnswers((current) => {
      const selected = Array.isArray(current[question.id]) ? current[question.id] as string[] : []
      return { ...current, [question.id]: selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value] }
    })
  }

  async function continueQuiz() {
    if (!canContinue || submitting) return
    trackMetaEvent('question_completed', { quiz_name: 'chapter_student_matching', question_number: index + 1, question_id: question.id }, { custom: true, onceKey: `chapter_question_${index + 1}` })

    if (index < questions.length - 1) {
      setIndex((current) => current + 1)
      if (index === 2) setInterstitial('party')
      if (index === 5) setInterstitial('special')
      return
    }

    setSubmitting(true)
    setSubmitError('')
    const universityEmail = answerAsText(answers.universityEmail).trim()
    const finalAnswers: QuizAnswers = { ...answers, contactMethod, phone: phone.trim(), instagram: instagram.trim(), messengerName: messengerName.trim() }
    try {
      await submitLead({
        idea: 'Chapter student matching',
        page: '/chapterr-students',
        email: universityEmail,
        answers: Object.fromEntries(Object.entries(finalAnswers).map(([key, value]) => [key, answerAsText(value)])),
      })
      trackMetaEvent('quiz_finished', { quiz_name: 'chapter_student_matching' }, { custom: true, onceKey: 'chapter_quiz_finished' })
      trackMetaEvent('contact_submitted', { quiz_name: 'chapter_student_matching', city: answerAsText(finalAnswers['city']) }, { custom: true, onceKey: 'chapter_contact_submitted' })
      if (!hasTrackedLead.current) hasTrackedLead.current = trackMetaLead()
      try { window.sessionStorage.removeItem(storageKey) } catch { /* Submission still succeeds. */ }
      setScreen('complete')
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Nepavyko išsaugoti atsakymų. Bandyk dar kartą.')
    } finally {
      setSubmitting(false)
    }
  }

  function goBack() {
    if (index === 0) setScreen('intro')
    else setIndex((current) => current - 1)
  }

  if (screen === 'intro') return <main className="chapter-quiz chapter-quiz--intro">
    <div className="chapter-quiz__brand"><span><UsersRound size={21} /></span>Chapter</div>
    <section className="chapter-quiz__intro-card">
      <img className="chapter-quiz__intro-meme" src="/chapterr/chapter-quiz-drake.jpg" alt="Naujos pažintys universitete pagal tavo hobius ir asmenybę" />
      <p className="chapter-quiz__eyebrow">Tavo naujas ratas prasideda čia</p>
      <h1>Atrask žmones, su kuriais pradėsi naują etapą lengviau</h1>
      <p>Atsakyk į kelis klausimus apie save ir padėsime rasti studentus su panašiais interesais, gyvenimo būdu ir noru susipažinti naujame mieste.</p>
      <button type="button" onClick={startQuiz}>Rasti savo žmones <ArrowRight size={20} /></button>
      <small>9 trumpi klausimai · apie 2 minutes</small>
    </section>
  </main>

  if (screen === 'complete') return <main className="chapter-quiz chapter-quiz--complete">
    <section className="chapter-quiz__complete-card">
      <div className="chapter-quiz__complete-image"><img src="/chapterr/chapter-students-vilnius.jpg" alt="Studentai kartu žvelgia į Vilniaus senamiestį" /></div>
      <span className="chapter-quiz__star"><Star size={25} fill="currentColor" /></span>
      <h1>Ačiū! ⭐</h1>
      <p>Pagal tavo atsakymus ieškosime žmonių, kurie:</p>
      <ul><li><Check size={18} />Pradeda panašų etapą</li><li><Check size={18} />Turi panašių interesų</li><li><Check size={18} />Taip pat ieško savo rato naujame mieste</li></ul>
      <strong>Pirmuosius ratus kuriame rankomis. Kai tavo mieste prisijungs pakankamai studentų, atsiųsime tau asmeninį kvietimą.</strong>
      <a href={chapterHomeHref()}>Grįžti į Chapter <ArrowRight size={19} /></a>
    </section>
  </main>

  if (interstitial) return <main className="chapter-quiz chapter-quiz--interstitial">
    <section className="chapter-quiz__interstitial-card">
      <img
        src={interstitial === 'party' ? '/chapterr/chapter-quiz-party.gif' : '/chapterr/chapter-quiz-special.jpg'}
        alt={interstitial === 'party' ? 'Kai baigiasi pirma sesija ir galima atsipūsti' : 'I am special meme'}
      />
      {interstitial === 'special' && <h1>šitas čia netyčia pateko</h1>}
      <button type="button" onClick={() => setInterstitial(null)}>Tęsti <ArrowRight size={20} /></button>
    </section>
  </main>

  return <main className="chapter-quiz">
    <header className="chapter-quiz__header">
      <button type="button" onClick={goBack} aria-label="Grįžti atgal"><ArrowLeft size={21} /></button>
      <div><span>{index + 1} / {questions.length}</span><div><i style={{ width: `${((index + 1) / questions.length) * 100}%` }} /></div></div>
      <a href={chapterHomeHref()} aria-label="Uždaryti klausimyną">Chapter</a>
    </header>
    <section className="chapter-quiz__question" key={question.id}>
      <p className="chapter-quiz__eyebrow">Kuriame tavo rato dalis</p>
      <h1>{question.title}</h1>
      <p className="chapter-quiz__why">{question.description}</p>

      {(question.type === 'single' || question.type === 'multiple') && <div className="chapter-quiz__options">
        {question.options?.map((option) => {
          const value = answers[question.id]
          const selected = Array.isArray(value) ? value.includes(option) : value === option
          const detail = optionDescriptions[question.id]?.[option]
          return <button className={`${selected ? 'is-selected' : ''}${detail ? ' chapter-quiz__option--detailed' : ''}`} type="button" onClick={() => question.type === 'multiple' ? toggleMultiple(option) : setSingle(option)} key={option}>
            <span>{selected && <Check size={17} />}</span><div><strong>{option}</strong>{detail && <small>“{detail}”</small>}</div>
          </button>
        })}
      </div>}

      {(question.type === 'text' || question.type === 'email') && <label className="chapter-quiz__field">
        <span>{question.type === 'email' ? 'Universiteto el. paštas' : 'Studijų kryptis'}</span>
        <input type={question.type === 'email' ? 'email' : 'text'} inputMode={question.type === 'email' ? 'email' : 'text'} autoComplete={question.type === 'email' ? 'email' : 'off'} autoFocus value={answerAsText(answers[question.id])} onChange={(event) => setAnswers((current) => ({ ...current, [question.id]: event.target.value }))} placeholder={question.placeholder} />
        {question.type === 'email' && <small className="chapter-quiz__privacy-note">Šio el. pašto nenaudosime rinkodarai ir nesidalinsime juo su kitais žmonėmis.</small>}
      </label>}

      {question.type === 'contact' && <div className="chapter-quiz__contact">
        <p className="chapter-quiz__trust">Naudosime tik tam, kad informuotume apie tavo rato sukūrimą. Tavo kontaktų nesidalinsime su kitais žmonėmis be tavo sutikimo.</p>
        <div className="chapter-quiz__contact-methods">
          {['Instagram', 'Messenger', 'WhatsApp', 'El. paštas'].map((method) => <button key={method} type="button" className={contactMethod === method ? 'is-selected' : ''} onClick={() => setContactMethod(method)}>
            <span>{contactMethod === method && <Check size={17} />}</span>{method}
          </button>)}
        </div>
        {contactMethod === 'Instagram' && <label><span>Instagram username</span><input autoComplete="username" value={instagram} onChange={(event) => setInstagram(event.target.value)} placeholder="@tavo_vardas" /></label>}
        {contactMethod === 'WhatsApp' && <label><span>Telefono numeris</span><input type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+370 6..." /></label>}
        {contactMethod === 'Messenger' && <label><span>Facebook vardas (nebūtina)</span><input autoComplete="name" value={messengerName} onChange={(event) => setMessengerName(event.target.value)} placeholder="Tavo vardas Facebook" /></label>}
        {contactMethod === 'El. paštas' && <small>Naudosime tavo ankstesniame žingsnyje įvestą universiteto el. paštą.</small>}
      </div>}

      {submitError && <p className="chapter-quiz__error" role="alert">{submitError}</p>}
      <div className="chapter-quiz__actions">
        <button type="button" className="chapter-quiz__continue" disabled={!canContinue || submitting} onClick={continueQuiz}>
          {submitting ? 'Jungiame…' : index === questions.length - 1 ? 'Prisijungti prie pirmųjų ratų' : 'Tęsti'} {!submitting && <ArrowRight size={20} />}
        </button>
      </div>
    </section>
  </main>
}
