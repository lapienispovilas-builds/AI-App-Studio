import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import submit from './api/revomatix-submit'

export default defineConfig(({mode})=>({
 plugins:[react(),{
  name:'revomatix-local-api',
  configureServer(server){
   const env=loadEnv(mode,process.cwd(),'')
   for(const key of ['REVOMATIX_SHEET_ID','REVOMATIX_SHEET_TAB','GOOGLE_SERVICE_ACCOUNT_EMAIL','GOOGLE_PRIVATE_KEY','SUPABASE_URL','SUPABASE_SERVICE_ROLE_KEY'])if(env[key])process.env[key]=env[key]
   server.middlewares.use('/api/revomatix-submit',async(req,res)=>{
    let raw=''
    for await(const chunk of req){raw+=chunk;if(raw.length>12000){res.statusCode=413;res.end();return}}
    let body;try{body=raw?JSON.parse(raw):undefined}catch{res.statusCode=400;res.end();return}
    const response={status(n:number){res.statusCode=n;return response},json(value:unknown){res.setHeader('Content-Type','application/json');res.end(JSON.stringify(value))},setHeader(k:string,v:string){res.setHeader(k,v)},end(){res.end()}}
    await submit({method:req.method,headers:req.headers,body},response)
   })
  }
 }],
}))
