const links = [
  { href: '/chapter-privatumo-politika', label: 'Privatumo politika' },
  { href: '/chapter-naudojimosi-salygos', label: 'Naudojimosi sąlygos' },
  { href: '/chapter-slapuku-politika', label: 'Slapukų politika' },
  { href: '/chapter-kontaktai', label: 'Kontaktai' },
]

export function ChapterFooter() {
  return (
    <footer className="chapterr-footer chapterr-student-footer">
      <a className="chapterr-wordmark chapterr-student-wordmark" href="/chapterr-students" aria-label="Chapter pradžia">
        <img src="/chapterr/chapterr-student-logo.png" alt="Chapter" />
      </a>
      <nav className="chapterr-footer__legal" aria-label="Teisinė informacija">
        {links.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
      </nav>
    </footer>
  )
}
