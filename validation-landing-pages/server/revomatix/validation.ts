import { voicePaths } from '../../src/voice/config.js'
export const fields = ['Submission ID','Timestamp','Name','Work email','Company','Optional answer','Niche','Submission path','Original landing path','UTM source','UTM medium','UTM campaign','UTM content','UTM term','Referrer','Test traffic'] as const
export type Lead = { submissionId: string; name: string; email: string; company: string; answer: string; niche: string; path: string; landingPath: string; utmSource: string; utmMedium: string; utmCampaign: string; utmContent: string; utmTerm: string; referrer: string; test: boolean }
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
 return {submissionId,name:text('name',120,true),email,company:text('company',160,true),answer:text('answer',2000),niche:path.slice(1),path,landingPath,utmSource:text('utmSource',250),utmMedium:text('utmMedium',250),utmCampaign:text('utmCampaign',250),utmContent:text('utmContent',250),utmTerm:text('utmTerm',250),referrer:text('referrer',1000),test:b.test===true}
}
export function mappedRow(lead:Lead,timestamp:string,headers:string[]) {
 const values=[lead.submissionId,timestamp,lead.name,lead.email,lead.company,lead.answer,lead.niche,lead.path,lead.landingPath,lead.utmSource,lead.utmMedium,lead.utmCampaign,lead.utmContent,lead.utmTerm,lead.referrer,String(lead.test)]
 const normalized=headers.map(h=>h.trim().toLowerCase())
 if(fields.some(f=>normalized.filter(h=>h===f.toLowerCase()).length!==1)) throw new Error('SHEET_HEADERS')
 return fields.map((f,i)=>({column:normalized.indexOf(f.toLowerCase()),value:values[i]}))
}
