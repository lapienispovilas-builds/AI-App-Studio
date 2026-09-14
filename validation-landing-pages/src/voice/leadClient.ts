const key='revomatix_visit_v1'
export type Attribution={landingPath:string;utmSource:string;utmMedium:string;utmCampaign:string;utmContent:string;utmTerm:string;referrer:string;test:boolean}
let memory:Attribution|undefined
export function attribution():Attribution {
 const params=new URLSearchParams(location.search)
 let stored=memory
 try{stored ||= JSON.parse(sessionStorage.getItem(key)||'null')}catch{/* Storage may be disabled. */}
 if(!stored){
  let referrer='';try{const u=new URL(document.referrer);referrer=u.origin+u.pathname}catch{/* No referrer. */}
  stored={landingPath:location.pathname.replace(/\/$/,'')||'/',utmSource:params.get('utm_source')||'',utmMedium:params.get('utm_medium')||'',utmCampaign:params.get('utm_campaign')||'',utmContent:params.get('utm_content')||'',utmTerm:params.get('utm_term')||'',referrer,test:params.get('test')==='true'}
 }
 // Once marked, the whole current visit stays excluded even after navigation.
 stored.test ||= params.get('test')==='true';memory=stored
 try{sessionStorage.setItem(key,JSON.stringify(stored))}catch{/* Memory fallback. */}
 return stored
}
const sent=new Set<string>()
const anonymousId=crypto.randomUUID()
let consent=false
try{consent=sessionStorage.getItem('revomatix_analytics_consent')==='yes'}catch{/* Optional. */}
export function analyticsAllowed(){return consent}
export function setAnalyticsAllowed(value:boolean){consent=value;try{sessionStorage.setItem('revomatix_analytics_consent',value?'yes':'no')}catch{/* Optional. */}}
export function measure(event:'page_view'|'cta_click'|'lead_saved',path:string,once?:string){
 const token=import.meta.env.VITE_POSTHOG_PROJECT_TOKEN
 if(!consent||!token||!import.meta.env.PROD||attribution().test|| (once&&sent.has(once)))return
 if(once)sent.add(once)
 // Explicit allowlist. Never transmit URL query, referrer or form fields.
 const host=import.meta.env.VITE_POSTHOG_HOST||'https://eu.i.posthog.com'
 void fetch(host+'/capture/',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({api_key:token,event:'revomatix_'+event,properties:{distinct_id:anonymousId,product:'revomatix',path,niche:path.slice(1),$process_person_profile:false}})}).catch(()=>{/* Optional measurement must never block a lead. */})
}
export async function submitLead(payload:Record<string,unknown>){
 const response=await fetch('/api/revomatix-submit',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal:AbortSignal.timeout(25000)})
 const result=await response.json().catch(()=>null)
 if(!response.ok||result?.ok!==true||result.submissionId!==payload.submissionId)throw new Error(result?.error || 'We could not confirm your request was saved. Please try again.')
 return result
}
