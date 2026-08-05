import { useCallback } from 'react'
import { Widget } from '@typeform/embed-react'
import type { AssessmentPageConfig } from '../assessmentPageConfig'
import { trackMetaLead } from '../lib/metaPixel'

const UTM_PARAMETERS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content']

export function AssessmentPage({ config }: { config: AssessmentPageConfig }) {
  const handleSubmit = useCallback(() => {
    trackMetaLead()
  }, [])

  return (
    <main className="assessment-page">
      <header className="assessment-header">
        <p className="assessment-brand">{config.brand}</p>
        <h1>{config.headline}</h1>
        <p className="assessment-subheadline">{config.subheadline}</p>
      </header>

      <section className="assessment-embed" aria-label={`${config.brand} assessment`}>
        <Widget
          id={config.typeformId}
          className="assessment-widget"
          onSubmit={handleSubmit}
          transitiveSearchParams={UTM_PARAMETERS}
        />
      </section>
    </main>
  )
}
