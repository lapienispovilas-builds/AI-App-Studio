import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ArrowRight, ArrowDown, Check, Phone, MessageSquare, Menu, X, Play, Pause, RotateCcw } from 'lucide-react'
import { voiceBrand, voicePages, type VoicePageConfig } from './config'
import './voice.css'
import { attribution, measure, submitLead } from './leadClient'
import { Privacy, AnalyticsChoice, privacyContact } from './Privacy'

function PilotLink({ children = 'Discuss a pilot' }: { children?: string }) {
  return <a className="v-button" href="#contact" onClick={()=>measure('cta_click',location.pathname)}>{children}<ArrowRight size={17} aria-hidden="true" /></a>
}
function Header() {
  const [open, setOpen] = useState(false)
  const menu = useRef<HTMLButtonElement>(null)
  return <header className="v-header"><div className="v-container v-nav"><a className="v-brand" href="#top" aria-label={`${voiceBrand.name} back to top`}><img className="v-brand-image" src={voiceBrand.logo} alt="Revomatix" width={1575} height={437} /></a><button ref={menu} className="v-menu" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="voice-navigation" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button><nav id="voice-navigation" className={open ? 'is-open' : ''} aria-label="Main navigation" onClick={() => setOpen(false)} onKeyDown={e => { if (e.key === 'Escape') { setOpen(false); menu.current?.focus() } }}><a href="#workflow">Workflow</a><a href="#pilot">Pilot</a><a href="#faq">FAQ</a><PilotLink /></nav></div></header>
}
function EmphasizedCopy({ config: c }: { config: VoicePageConfig }) {
  const pattern = new RegExp(`(${c.preview.emphasis.join('|')})`, 'gi')
  return <>{c.description.split(pattern).map((part,i) => c.preview.emphasis.some(p => p.toLowerCase() === part.toLowerCase()) ? <strong key={i}>{part}</strong> : part)}</>
}
function ConversationPreview({ config: c }: { config: VoicePageConfig }) {
  return c.audioDemo ? <AudioConversationPreview config={c} /> : <StaticConversationPreview config={c} />
}
function StaticConversationPreview({ config: c }: { config: VoicePageConfig }) {
  const [sequence, setSequence] = useState(0)
  return <figure className="v-conversation"><figcaption><div className="v-assistant-brand"><span className="v-avatar"><img src={voiceBrand.symbol} alt="" width={1125} height={991} /></span><span>Revomatix · AI assistant</span></div><strong>{c.workflowName}</strong><span>Illustrative conversation</span></figcaption><div className="v-preview-context"><Phone size={16} aria-hidden="true" /><span>{c.preview.context}</span></div><div key={sequence} className="v-sequence"><div className="v-preview-wave" aria-hidden="true">{[8,16,10,22,14,20,8,16,10].map((h,i) => <i key={i} style={{height:h, animationDelay:`${i*0.06}s`}} />)}</div><div className="v-preview-messages">{c.preview.messages.map((m,i)=><div className={`v-preview-message ${m.speaker === 'AI assistant' ? 'v-assistant' : 'v-person'}`} key={i} style={{animationDelay:`${i*1.15}s`}}><small>{m.speaker}</small><p>{m.text}</p></div>)}</div><div className="v-preview-result"><Check size={19} aria-hidden="true" /><div><strong>{c.preview.status}</strong><p>{c.preview.detail}</p></div></div></div><button className="v-replay" onClick={()=>setSequence(s=>s+1)}>Replay example<span aria-hidden="true">↻</span></button></figure>
}
function formatAudioTime(seconds:number) {
  const safe=Number.isFinite(seconds)?Math.max(0,seconds):0
  return `${Math.floor(safe/60)}:${Math.floor(safe%60).toString().padStart(2,'0')}`
}
function AudioConversationPreview({config:c}:{config:VoicePageConfig}) {
 const demo=c.audioDemo!
 const audio=useRef<HTMLAudioElement>(null), transcript=useRef<HTMLDivElement>(null), messageRefs=useRef<(HTMLDivElement|null)[]>([])
 const [currentTime,setCurrentTime]=useState(0), [duration,setDuration]=useState(demo.duration), [playing,setPlaying]=useState(false), [ended,setEnded]=useState(false)
 const activeIndex=demo.transcript.reduce((active,line,index)=>currentTime>=line.at?index:active,-1)
 const outcomeVisible=ended||currentTime>=demo.transcript[demo.transcript.length-1].at
 useEffect(()=>()=>audio.current?.pause(),[])
 useEffect(()=>{
  const container=transcript.current, active=messageRefs.current[activeIndex]
  if(!container||!active)return
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches
  container.scrollTo({top:Math.max(0,active.offsetTop-container.offsetTop-8),behavior:reduce?'auto':'smooth'})
 },[activeIndex])
 async function toggle(){
  const player=audio.current;if(!player)return
  if(playing){player.pause();return}
  if(outcomeVisible||player.currentTime>=player.duration-.1){player.currentTime=0;setCurrentTime(0);setEnded(false)}
  try{await player.play()}catch{setPlaying(false)}
 }
 function seek(value:number){const player=audio.current;if(!player)return;player.currentTime=value;setCurrentTime(value);setEnded(false)}
 const controlLabel=playing?'Pause conversation':outcomeVisible?'Replay conversation':currentTime>0?'Resume conversation':'Play conversation'
 return <figure className="v-conversation v-audio-demo">
  <figcaption><div className="v-assistant-brand"><span className="v-avatar"><img src={voiceBrand.symbol} alt="" width={1125} height={991}/></span><span>Revomatix AI voice agent</span></div><strong>{c.workflowName}</strong><span>Example conversation</span></figcaption>
  <audio ref={audio} src={demo.src} preload="metadata" onLoadedMetadata={e=>setDuration(Number.isFinite(e.currentTarget.duration)?e.currentTarget.duration:demo.duration)} onTimeUpdate={e=>setCurrentTime(e.currentTarget.currentTime)} onPlay={()=>{setPlaying(true);setEnded(false)}} onPause={()=>setPlaying(false)} onEnded={e=>{setPlaying(false);setEnded(true);setCurrentTime(e.currentTarget.duration)}} />
  <div className="v-audio-call"><div className={`v-call-status ${playing?'is-playing':''}`}><Phone size={15} aria-hidden="true"/><span>AI call</span><i aria-hidden="true"/><small>{ended?'Complete':playing?'Playing':currentTime>0?'Paused':'Ready'}</small></div><div className={`v-audio-wave ${playing?'is-playing':''}`} aria-hidden="true">{[12,22,16,30,18,26,13,24,17,29,15,21].map((height,index)=><i key={index} style={{height,animationDelay:`${index*.06}s`}}/>)}</div></div>
  <div className="v-audio-controls"><button type="button" className="v-audio-play" onClick={toggle} aria-label={controlLabel}>{playing?<Pause size={18} fill="currentColor"/>:ended?<RotateCcw size={18}/>:<Play size={18} fill="currentColor"/>}<span>{controlLabel}</span></button><div className="v-audio-timeline"><input type="range" min="0" max={duration||demo.duration} step="0.01" value={Math.min(currentTime,duration||demo.duration)} onChange={event=>seek(Number(event.target.value))} aria-label="Conversation playback position"/><div><time>{formatAudioTime(currentTime)}</time><time>{formatAudioTime(duration)}</time></div></div></div>
  <div ref={transcript} className="v-audio-transcript" aria-label="Conversation transcript">{demo.transcript.map((line,index)=><div ref={node=>{messageRefs.current[index]=node}} key={line.at} className={`v-audio-message ${line.speaker==='AI agent'?'v-audio-ai':'v-audio-customer'} ${index===activeIndex?'is-active':''} ${index<activeIndex?'is-complete':'is-upcoming'}`}><small>{line.speaker}</small><p>{line.text}</p></div>)}</div>
  <div className="v-audio-footer">{outcomeVisible?<div className="v-audio-outcome"><Check size={18} aria-hidden="true"/><div><strong>{demo.outcome.title}</strong><p>{demo.outcome.detail}</p></div></div>:<ol className="v-audio-stages">{demo.stages.map((stage,index)=><li key={stage} className={currentTime>=(index===0?0:index===1?11.32:26.24)?'is-reached':''}>{stage}{index<demo.stages.length-1&&<ArrowRight size={13} aria-hidden="true"/>}</li>)}</ol>}</div>
 </figure>
}
const relatedIssueOptions:Partial<Record<VoicePageConfig['path'],string[]>>={
 '/fitness':['Cancelled slots go unfilled','Failed membership payments','Lapsed members who never come back'],
 '/medspa':['Cancelled slots go unfilled','Failed payments on packages/memberships'],
 '/auto-repair':['Cancelled appointment slots go unfilled','Customers who never come back for follow-up service']
}
function OptionalSelect({id,name,label,options}:{id:string;name:string;label:string;options:string[]}){
 return <label htmlFor={id}>{label} <span>(optional)</span><select id={id} name={name} defaultValue=""><option value="">Select an option</option>{options.map(option=><option key={option}>{option}</option>)}</select></label>
}
function PilotForm({ question, intro, heading }: { question: string; intro: string; heading: string }) {
 const [state,setState]=useState<'idle'|'pending'|'success'|'error'>('idle')
 const [error,setError]=useState('')
 const [currentSpend,setCurrentSpend]=useState('')
 const status=useRef<HTMLDivElement>(null), pending=useRef(false)
 const attempt=useRef<{ fingerprint:string; id:string }|null>(null)
 const startedAt=useRef(Date.now())
 useEffect(()=>{if(state==='success'||state==='error')status.current?.focus()},[state])
 async function submit(event:FormEvent<HTMLFormElement>){
  event.preventDefault();if(pending.current||state==='success')return
  const form=event.currentTarget
  if(!form.reportValidity())return
  const data=new FormData(form)
  const fields={name:String(data.get('name')||'').trim(),email:String(data.get('email')||'').trim(),company:String(data.get('company')||'').trim(),volume:String(data.get('volume')||''),currentSpend:String(data.get('currentSpend')||''),currentUse:String(data.get('currentUse')||'').trim(),channelPreference:String(data.get('channelPreference')||''),answer:String(data.get('context')||'').trim(),relatedIssues:data.getAll('relatedIssues').map(String),anonymizedExamples:data.get('anonymizedExamples')==='on',website:String(data.get('website')||''),path:location.pathname.replace(/\/$/,''),...attribution()}
  const fingerprint=JSON.stringify(fields)
  if(attempt.current?.fingerprint!==fingerprint)attempt.current={fingerprint,id:crypto.randomUUID()}
  pending.current=true;setState('pending');setError('')
  try {await submitLead({...fields,submissionId:attempt.current.id,startedAt:startedAt.current});setState('success');measure('lead_saved',fields.path,attempt.current.id)}
  catch(e){setError(e instanceof Error?e.message:'Unable to save your request. Please try again.');setState('error')}
  finally{pending.current=false}
 }
 const related=relatedIssueOptions[location.pathname.replace(/\/$/,'') as VoicePageConfig['path']]
 return <div className="v-form-card"><span className="v-label">LET’S EXPLORE THE FIT</span><h3>{heading}</h3><p>{intro}</p><form onSubmit={submit} aria-busy={state==='pending'}><fieldset disabled={state==='pending'||state==='success'}><div className="v-fields"><label htmlFor="pilot-name">Name<input id="pilot-name" name="name" autoComplete="name" required maxLength={120} pattern=".*\S.*" /></label><label htmlFor="pilot-company">Company<input id="pilot-company" name="company" autoComplete="organization" required maxLength={160} pattern=".*\S.*" /></label></div><label htmlFor="pilot-email">Work email<input id="pilot-email" type="email" name="email" autoComplete="email" required maxLength={254}/></label><OptionalSelect id="pilot-volume" name="volume" label="Roughly how often does this happen per month?" options={['Fewer than 5','5–20','21–50','More than 50','Not sure']}/><label htmlFor="pilot-current-spend">Do you already pay for a tool, service, or extra staff time to handle this? <span>(optional)</span><select id="pilot-current-spend" name="currentSpend" value={currentSpend} onChange={event=>setCurrentSpend(event.target.value)}><option value="">Select an option</option><option>Yes</option><option>No</option><option>Not sure</option></select></label>{currentSpend==='Yes'&&<label htmlFor="pilot-current-use">What do you currently use? <span>(optional)</span><input id="pilot-current-use" name="currentUse" maxLength={240} placeholder="e.g. answering service, extra front-desk hours, a software tool"/></label>}<OptionalSelect id="pilot-channel" name="channelPreference" label="Would reaching your customers about this work better by phone call, text, or email?" options={['Phone call','Text message','Email','Not sure']}/><label htmlFor="pilot-context">{question} <span>(optional)</span><textarea id="pilot-context" name="context" rows={3} maxLength={2000}/></label>{related&&<fieldset className="v-checkbox-group"><legend>Do any of these also come up for you? <span>(optional)</span></legend>{related.map(option=><label key={option}><input type="checkbox" name="relatedIssues" value={option}/><span>{option}</span></label>)}</fieldset>}<label className="v-checkbox"><input type="checkbox" name="anonymizedExamples"/><span>I’d be open to sharing a few anonymized examples</span></label><div className="v-honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off"/></label></div><button className="v-button" type="submit">{state==='pending'?'Saving your request…':state==='success'?'Request saved':'Request a pilot conversation'}<ArrowRight size={17} aria-hidden="true"/></button></fieldset><p className="v-preview-note">We’ll use these details to respond to your enquiry. <a href="/privacy">Privacy</a></p>{(state==='error'||state==='success')&&<div ref={status} tabIndex={-1} className="v-form-status" role={state==='error'?'alert':'status'}>{state==='success'?'Your request has been saved. Thank you for your interest in a pilot.':error}</div>}</form></div>
}
function VoiceLandingPage({ config: c }: { config: VoicePageConfig }) {
  useEffect(() => { attribution(); measure('page_view',c.path,'page:'+c.path); let icon = document.querySelector<HTMLLinkElement>('link[rel="icon"]'); if (!icon) { icon = document.createElement('link'); icon.rel = 'icon'; document.head.appendChild(icon) } icon.type = 'image/png'; icon.href = voiceBrand.favicon; document.title = c.title; document.documentElement.lang = 'en'; document.querySelector('meta[name="description"]')?.setAttribute('content', c.metaDescription) }, [c])
  return <div className="voice-page" id="top"><a className="v-skip" href="#main">Skip to content</a><Header /><main id="main"><section className="v-container v-hero"><div className="v-hero-copy"><p className="v-eyebrow"><span className="v-dot" />{c.eyebrow}</p><h1>{c.headline}{' '}<span>{c.headlineAccent}</span></h1><p className="v-lead"><EmphasizedCopy config={c} /></p><div className="v-actions"><PilotLink /><a className="v-text-link" href="#workflow">See the workflow<ArrowDown size={16} aria-hidden="true" /></a></div><p className="v-hero-note">{c.invitation}</p></div><ConversationPreview config={c} /></section><section id="workflow" className="v-workflow-band"><div className="v-container v-section"><div className="v-section-heading"><div><p className="v-label">THE WORKFLOW</p><h2>{c.workflowTitle}</h2></div><p>{c.problem}</p></div><ol className="v-process">{c.workflow.map((step,i) => <li key={step.title}><div className="v-step-number">0{i+1}<ArrowRight size={19} aria-hidden="true" /></div><h3>{step.title}</h3>{step.body && <p>{step.body}</p>}</li>)}</ol></div></section><section className="v-example-band"><div className="v-container v-example v-section"><div><p className="v-label">AFTER THE CONVERSATION</p><h2>A useful handoff.<br />A clear owner.</h2><p className="v-lead-small">{c.preview.owner}</p></div><div className="v-handoff"><div className="v-handoff-heading"><MessageSquare size={20} aria-hidden="true" /><strong>{c.preview.status}</strong></div><dl><div><dt>What they needed</dt><dd>{c.preview.need}</dd></div><div><dt>What was recorded</dt><dd>{c.preview.recorded}</dd></div><div><dt>Who acts next</dt><dd>{c.preview.owner}</dd></div></dl></div></div></section><section className="v-value-band"><div className="v-container v-section v-value"><p className="v-label">WHAT WE’LL LEARN</p><h2>A practical pilot.<br />A clearer picture of the value.</h2><div className="v-value-list">{c.values.map((value,i) => <article key={value.title}><span>0{i+1}</span><h3>{value.title}</h3>{value.body && <p>{value.body}</p>}</article>)}</div></div></section><section id="pilot" className="v-container v-pilot-band"><div className="v-pilot"><div><h2>{c.pilot.title}</h2><p className="v-lead-small">{c.pilot.description}</p></div><div><ul>{c.pilot.scope.map(s => <li key={s}><Check size={18} />{s}</li>)}</ul><p className="v-compatibility">We’ll review your software and messaging setup during the pilot discussion.</p><PilotLink /></div></div></section><section id="faq" className="v-faq-band"><div className="v-container v-section v-faq"><div><p className="v-label">A FEW GOOD QUESTIONS</p><h2>Before we talk.</h2></div><div>{c.faqs.map(f => <details key={f.question}><summary>{f.question}<span aria-hidden="true">+</span></summary><p>{f.answer}</p></details>)}</div></div></section><section id="contact" className="v-closing-band"><div className="v-container v-closing v-section"><div><p className="v-label">LET’S EXPLORE A PILOT</p><h2>{c.finalTitle}</h2><p className="v-lead-small">One focused workflow. Calls, {c.channel === 'SMS' ? 'texts' : 'emails'} and a clear next step for your team.</p></div><PilotForm question={c.pilot.question} intro={c.formIntro} heading={c.formHeading} /></div></section></main><footer className="v-container v-footer"><a className="v-brand" href="#top"><img className="v-brand-image" src={voiceBrand.logo} alt="Revomatix" width={1575} height={437} /></a><span>{c.inbound ? 'Voice-first intake. Human next steps.' : 'Voice-first follow-up. Human next steps.'}</span><span>© {new Date().getFullYear()} Revomatix</span><a href="/privacy">Privacy</a>{privacyContact&&<a href={`mailto:${privacyContact}`}>Contact</a>}<AnalyticsChoice/></footer></div>
}
export function App() {
  const path = window.location.pathname.replace(/\/$/, '') as VoicePageConfig['path'] | '/privacy'
  const config = path==='/privacy'?undefined:voicePages[path]
  useEffect(() => { if (!config && path!=='/privacy') { document.title = `Page not available | ${voiceBrand.name}`; document.querySelector('meta[name="description"]')?.setAttribute('content', 'This voice AI industry page is not available yet.') } }, [config])
  if(path==='/privacy') return <Privacy/>
  return config ? <VoiceLandingPage config={config} /> : <main className="voice-page v-unavailable"><p className="v-label">NOT AVAILABLE YET</p><h1>This page is still to come.</h1><p>This workflow is not part of the current preview.</p><a href="/moving">View the moving pilot →</a></main>
}
