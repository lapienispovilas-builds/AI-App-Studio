import { ArrowLeft } from 'lucide-react'
import type { ChapterLegalPageConfig } from '../chapterLegalPages'
import { ChapterFooter } from './ChapterFooter'

function renderParagraph(paragraph: string) {
  const email = 'info@chapter.lt'
  const parts = paragraph.split(email)

  if (parts.length === 1) return paragraph

  return <>{parts.map((part, index) => <span key={`${part}-${index}`}>{part}{index < parts.length - 1 && <a href={`mailto:${email}`}>{email}</a>}</span>)}</>
}

export function ChapterLegalPage({ config }: { config: ChapterLegalPageConfig }) {
  return (
    <main className="chapterr-page chapterr-student-page chapterr-legal-page">
      <header className="chapterr-header">
        <a className="chapterr-wordmark chapterr-student-wordmark" href="/chapterr-students" aria-label="Chapter pradžia">
          <img src="/chapterr/chapterr-student-logo.png" alt="Chapter" />
        </a>
      </header>

      <article className="chapterr-legal">
        <a className="chapterr-legal__back" href="/chapterr-students"><ArrowLeft size={17} />Grįžti į pagrindinį puslapį</a>
        <p className="chapterr-kicker">Chapter informacija</p>
        <h1>{config.title}</h1>
        <p className="chapterr-legal__intro">{config.intro}</p>

        <div className="chapterr-legal__content">
          {config.sections.map((section) => (
            <section key={section.title}>
              <h2>{section.title}</h2>
              {section.paragraphs?.map((paragraph) => <p key={paragraph}>{renderParagraph(paragraph)}</p>)}
              {section.items && <ul>{section.items.map((item) => <li key={item}>{item}</li>)}</ul>}
            </section>
          ))}
        </div>

        <p className="chapterr-legal__notice">Šis bendro pobūdžio šablonas nepakeičia individualios teisinės konsultacijos. Prieš viešą paleidimą užpildykite pažymėtas vietas ir įvertinkite tekstą pagal faktinį duomenų tvarkymą.</p>
      </article>

      <ChapterFooter />
    </main>
  )
}
