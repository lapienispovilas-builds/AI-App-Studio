const links = [
  { href: '/chapter-privatumo-politika', label: 'Privatumo politika' },
  { href: '/chapter-naudojimosi-salygos', label: 'Naudojimosi sąlygos' },
  { href: '/chapter-slapuku-politika', label: 'Slapukų politika' },
  { href: '/chapter-kontaktai', label: 'Kontaktai' },
]

const socialLinks = [
  { href: 'https://www.facebook.com/profile.php?id=61593373684113', label: 'Facebook', icon: 'facebook' },
  { href: 'https://www.instagram.com/chapter_lt?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==', label: 'Instagram', icon: 'instagram' },
  { href: 'http://www.tiktok.com/@chapter1203', label: 'TikTok', icon: 'tiktok' },
] as const

function SocialIcon({ icon }: { icon: typeof socialLinks[number]['icon'] }) {
  if (icon === 'facebook') {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.7 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5H17V3.9c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V10H7.5v3h2.8v8h3.4Z" /></svg>
  }

  if (icon === 'instagram') {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.7" r="1" className="is-filled" /></svg>
  }

  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.4 3c.4 2.3 1.8 3.7 4.1 3.9v3.2a8.3 8.3 0 0 1-4.1-1.2v6.2a6 6 0 1 1-5.2-5.9v3.3a2.8 2.8 0 1 0 1.9 2.6V3h3.3Z" /></svg>
}

export function ChapterFooter() {
  return (
    <footer className="chapterr-footer chapterr-student-footer">
      <a className="chapterr-wordmark chapterr-student-wordmark" href="/chapterr-students" aria-label="Chapter pradžia">
        <img src="/chapterr/chapterr-student-logo.png" alt="Chapter" />
      </a>
      <div className="chapterr-footer__links">
        <nav className="chapterr-footer__social" aria-label="Chapter socialiniai tinklai">
          {socialLinks.map((link) => (
            <a key={link.label} href={link.href} target="_blank" rel="noreferrer" aria-label={`Chapter ${link.label}`} title={link.label}>
              <SocialIcon icon={link.icon} />
            </a>
          ))}
        </nav>
        <nav className="chapterr-footer__legal" aria-label="Teisinė informacija">
          {links.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
        </nav>
      </div>
    </footer>
  )
}
