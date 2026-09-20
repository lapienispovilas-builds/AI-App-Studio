import { voiceFormOptions, voicePages, voicePaths } from '../../src/voice/config.js'
export const fields = ['Submission ID','Timestamp','Name','Work email','Company','Monthly trigger volume','Existing solution?','Existing solution details','Preferred follow-up channel','How it is handled today','Adjacent problems','Open to share examples?','Wedge','Form submitted on','First landing page','UTM source','UTM medium','UTM campaign','UTM content','UTM term','Referrer','Test traffic'] as const
export const fieldAliases:Record<string,readonly string[]> = {
 'Monthly trigger volume':['Volume'],
 'Existing solution?':['Current spend'],
 'Existing solution details':['Current use'],
 'Preferred follow-up channel':['Channel preference'],
 'How it is handled today':['Optional answer'],
 'Adjacent problems':['Related issues'],
 'Open to share examples?':['Anonymized examples'],
 'Wedge':['Niche'],
 'Form submitted on':['Submission path'],
 'First landing page':['Original landing path']
}
export type Lead = { submissionId: string; name: string; email: string; company: string; volume: string; currentSpend: string; currentUse: string; channelPreference: string; answer: string; relatedIssues: string; anonymizedExamples: boolean; niche: string; path: string; landingPath: string; utmSource: string; utmMedium: string; utmCampaign: string; utmContent: string; utmTerm: string; referrer: string; test: boolean }
export function validate(body: unknown): Lead {
 if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('Invalid form data.')
 const b = body as Record<string,unknown>
 const text = (key:string,max:number,required=false) => { const v=b[key]; if(v !== undefined && typeof v !== 'string') throw new Error('Invalid form data.'); const s=(v as string || '').trim(); if(s.length>max || (required&&!s)) throw new Error('Check the required fields and their length.'); return s }
 const submissionId=text('submissionId',36,true), path=text('path',100,true)
 if(!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(submissionId)) throw new Error('Invalid submission ID.')
 if(!(voicePaths as readonly string[]).includes(path)) throw new Error('Unknown landing page.')
 const email=text('email',254,true).toLowerCase()
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Enter a valid email address.')
 if(text('website',200)) throw new Error('Unable to accept this request.')
 if(typeof b.startedAt !== 'number' || Date.now()-b.startedAt<1500) throw new Error('Please wait a moment and try again.')
 const landingPath=text('landingPath',100)
 if(landingPath && !/^\/[a-zA-Z0-9/_-]*$/.test(landingPath)) throw new Error('Invalid landing path.')
 if(b.test!==undefined && typeof b.test!=='boolean') throw new Error('Invalid test flag.')
 if(b.anonymizedExamples!==undefined && typeof b.anonymizedExamples!=='boolean') throw new Error('Invalid form data.')
 const option=(key:string,allowed:readonly string[])=>{const value=text(key,120);if(value&&!allowed.includes(value))throw new Error('Invalid form data.');return value}
 const volume=option('volume',voiceFormOptions.volume)
 const currentSpend=option('currentSpend',voiceFormOptions.spend)
 const currentUse=text('currentUse',240)
 if(currentUse&&currentSpend!=='Yes') throw new Error('Invalid form data.')
 const channelPreference=option('channelPreference',voiceFormOptions.channel)
 const relatedIssuesValue=b.relatedIssues
 if(relatedIssuesValue!==undefined&&(!Array.isArray(relatedIssuesValue)||relatedIssuesValue.some(v=>typeof v!=='string'))) throw new Error('Invalid form data.')
 const allowedRelated=voicePages[path as keyof typeof voicePages].form.relatedIssues
 const relatedIssues=(relatedIssuesValue as string[]||[]).map(v=>v.trim()).filter(Boolean)
 if(new Set(relatedIssues).size!==relatedIssues.length||relatedIssues.some(v=>!allowedRelated.includes(v))) throw new Error('Invalid form data.')
 return {submissionId,name:text('name',120,true),email,company:text('company',160,true),volume,currentSpend,currentUse,channelPreference,answer:text('answer',2000),relatedIssues:relatedIssues.join(' | '),anonymizedExamples:b.anonymizedExamples===true,niche:path.slice(1),path,landingPath,utmSource:text('utmSource',250),utmMedium:text('utmMedium',250),utmCampaign:text('utmCampaign',250),utmContent:text('utmContent',250),utmTerm:text('utmTerm',250),referrer:text('referrer',1000),test:b.test===true}
}
export function mappedRow(lead:Lead,timestamp:string,headers:string[]) {
 const values=[lead.submissionId,timestamp,lead.name,lead.email,lead.company,lead.volume,lead.currentSpend,lead.currentUse,lead.channelPreference,lead.answer,lead.relatedIssues,String(lead.anonymizedExamples),lead.niche,lead.path,lead.landingPath,lead.utmSource,lead.utmMedium,lead.utmCampaign,lead.utmContent,lead.utmTerm,lead.referrer,String(lead.test)]
 const normalized=headers.map(h=>h.trim().toLowerCase())
 const columns=fields.map(field=>{
  const accepted=[field,...(fieldAliases[field]||[])].map(name=>name.toLowerCase())
  const matches=normalized.map((header,index)=>accepted.includes(header)?index:-1).filter(index=>index>=0)
  if(matches.length!==1) throw new Error('SHEET_HEADERS')
  return matches[0]
 })
 return fields.map((_,i)=>({column:columns[i],value:values[i]}))
}
