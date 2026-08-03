import type { LandingPageConfig } from '../landingPageConfig'

export function PhoneMockup({ mockup, name, icon }: Pick<LandingPageConfig, 'mockup' | 'name' | 'icon'>) {
  return (
    <div className="phone" aria-label={`${name} app preview`}>
      <div className="phone__notch" />
      <div className="phone__screen">
        <div className="phone__status"><span>9:41</span><span>● ●</span></div>
        <div className="app-mark">
          <img src={icon} alt="" />
        </div>
        <p className="phone__kicker">{name}</p>
        <h2>{mockup.title}</h2>
        <p className="phone__subtitle">{mockup.subtitle}</p>
        <div className="mockup-card">
          {mockup.rows.map((row) => (
            <div className="mockup-row" key={row.label}>
              <span>{row.label}</span><strong>{row.value}</strong>
            </div>
          ))}
        </div>
        <button className="mockup-action" type="button" tabIndex={-1}>{mockup.action}</button>
      </div>
    </div>
  )
}
