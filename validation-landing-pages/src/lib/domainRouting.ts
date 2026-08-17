const everaDomains = new Set(['everahealth.pro', 'www.everahealth.pro'])

export function isEveraDomain(hostname = window.location.hostname) {
  return everaDomains.has(hostname.toLowerCase())
}

export function getEveraFlowUrl(search = '') {
  const path = isEveraDomain() ? '/' : '/glp1-tracker-maintenance'
  return `${window.location.origin}${path}${search}`
}
