import { createHash, createSign } from 'node:crypto'
import { mappedRow, type Lead } from './validation.js'
async function request(url:string,init?:RequestInit) { const r=await fetch(url,{...init,signal:AbortSignal.timeout(12000)}); if(!r.ok) throw new Error(`UPSTREAM_${r.status}`); return r.json() }
export async function saveLead(lead:Lead) {
 const scriptUrl=process.env.REVOMATIX_APPS_SCRIPT_URL, scriptSecret=process.env.REVOMATIX_APPS_SCRIPT_SECRET
 if(scriptUrl||scriptSecret) {
  if(!scriptUrl||!scriptSecret) throw new Error('NOT_CONFIGURED')
  const result=await request(scriptUrl,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({secret:scriptSecret,lead})})
  if(result?.ok!==true||result.submissionId!==lead.submissionId) throw new Error('SAVE_UNCONFIRMED')
  return {submissionId:lead.submissionId,duplicate:result.duplicate===true}
 }
 const id=process.env.REVOMATIX_SHEET_ID, tab=process.env.REVOMATIX_SHEET_TAB, db=process.env.SUPABASE_URL, dbKey=process.env.SUPABASE_SERVICE_ROLE_KEY
 let key=process.env.GOOGLE_PRIVATE_KEY?.trim() || '', email=process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || ''
 if(key.startsWith('{')) { const account=JSON.parse(key);key=account.private_key;email ||= account.client_email }
 else if(key.startsWith('"')) key=JSON.parse(key)
 key=key.replace(/\\n/g,'\n')
 if(!id||!tab||!db||!dbKey||!key||!email) throw new Error('NOT_CONFIGURED')
 const now=Math.floor(Date.now()/1000), encode=(v:unknown)=>Buffer.from(JSON.stringify(v)).toString('base64url')
 const unsigned=encode({alg:'RS256',typ:'JWT'})+'.'+encode({iss:email,scope:'https://www.googleapis.com/auth/spreadsheets',aud:'https://oauth2.googleapis.com/token',iat:now,exp:now+3600})
 const signer=createSign('RSA-SHA256');signer.update(unsigned);signer.end()
 const token=await request('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer',assertion:unsigned+'.'+signer.sign(key).toString('base64url')})})
 const root=`https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(id)}/values`, range=(cells:string)=>`'${tab.replace(/'/g,"''")}'!${cells}`, auth={Authorization:`Bearer ${token.access_token}`,'Content-Type':'application/json'}
 // Read before writing. Never replace headers or unrelated columns.
 const sheet=await request(`${root}/${encodeURIComponent(range('A:ZZ'))}`,{headers:auth})
 const rows:string[][]=sheet.values || [], headers=rows[0] || []
 mappedRow(lead,'',headers)
 const hash=createHash('sha256').update(JSON.stringify(lead)).digest('hex')
 // The existing Supabase service provides an atomic row reservation. Retries
 // rewrite the same row, including after an ambiguous Google response.
 const reservation=await request(`${db}/rest/v1/rpc/reserve_revomatix_row`,{method:'POST',headers:{apikey:dbKey,Authorization:`Bearer ${dbKey}`,'Content-Type':'application/json'},body:JSON.stringify({p_id:lead.submissionId,p_hash:hash,p_sheet:id+':'+tab,p_floor:Math.max(rows.length+1,2)})})
 const {row_number: rowNumber,created_at:timestamp}=reservation
 const values=mappedRow(lead,timestamp,headers), existing=rows[rowNumber-1]
 const idColumn=values[0].column
 if(existing?.some(Boolean) && existing[idColumn]!==lead.submissionId) throw new Error('ROW_CONFLICT')
 const col=(n:number)=> {let s='';for(n++;n>0;n=Math.floor((n-1)/26))s=String.fromCharCode(65+(n-1)%26)+s;return s}
 await request(`${root}:batchUpdate`,{method:'POST',headers:auth,body:JSON.stringify({valueInputOption:'RAW',data:values.map(v=>({range:range(`${col(v.column)}${rowNumber}`),values:[[v.value]]}))})})
 const verified=await request(`${root}/${encodeURIComponent(range(`A${rowNumber}:ZZ${rowNumber}`))}`,{headers:auth})
 if(values.some(v=>String(verified.values?.[0]?.[v.column]??'')!==v.value)) throw new Error('SAVE_UNCONFIRMED')
 return {submissionId:lead.submissionId,duplicate:existing?.[idColumn]===lead.submissionId}
}
