import { validate } from '../server/revomatix/validation'
import { saveLead } from '../server/revomatix/storage'
type Request={method?:string;body?:unknown;headers:Record<string,string|string[]|undefined>}
type Response={status:(n:number)=>Response;json:(v:unknown)=>void;setHeader:(k:string,v:string)=>void;end:()=>void}
export default async function handler(req:Request,res:Response) {
 res.setHeader('Cache-Control','no-store')
 if(req.method!=='POST'){res.setHeader('Allow','POST');res.status(405).end();return}
 if(!String(req.headers['content-type']||'').startsWith('application/json')){res.status(415).json({error:'Use a JSON request.'});return}
 const origin=req.headers.origin, host=req.headers.host
 try { if(origin && (typeof origin!=='string'||new URL(origin).host!==host)) throw new Error('origin') } catch {res.status(403).json({error:'Request origin not allowed.'});return}
 if(JSON.stringify(req.body??{}).length>12000){res.status(413).json({error:'Form is too long.'});return}
 let lead
 try{lead=validate(req.body)}catch(e){res.status(400).json({error:e instanceof Error?e.message:'Check your form.'});return}
 try{const saved=await saveLead(lead);res.status(200).json({ok:true,...saved})}
 catch(e){const code=e instanceof Error && /^(NOT_CONFIGURED|SHEET_HEADERS|ROW_CONFLICT|SAVE_UNCONFIRMED|UPSTREAM_\d+)$/.test(e.message)?e.message:'SAVE_FAILED';console.error('revomatix_submit',code);res.status(503).json({error:'We could not confirm your request was saved. Your details are still here. Please try again.'})}
}
