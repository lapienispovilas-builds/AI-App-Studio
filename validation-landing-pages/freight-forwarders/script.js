const FORM_ENDPOINT = window.REVOMATIX_FORM_ENDPOINT || '';
const CONTACT_EMAIL = 'sales@revomatix.com';

const COPY = {
  nav: { cta: 'Get early access' },
  hero: {
    eyebrow: 'The quote desk for freight forwarders',
    titleLead: 'Fewer carrier emails. Faster answers.',
    titleAccent: 'Better prices.',
    subline: 'Revomatix sends your quote requests to your carriers, reads every reply, adds up the extras, compares the offers and drafts the answer. For road, sea and air. You just approve.',
    modes: ['Road', 'Sea', 'Air'],
    primaryCta: 'Get early access',
    secondaryCta: 'See how it works',
    trust: 'Road, sea and air · Works with the email you already use · Carriers just reply as usual · You approve every message'
  },
  problems: {
    title: 'What slows you down every day',
    intro: 'The problem is not one difficult quote. It is the same manual work, repeated across every request.',
    items: [
      { title: 'Endless emails with carriers', feels: 'Six carriers or agents, the same request, and then the chasing. The day is gone before you quote anything.', action: 'We send the request to the carriers you choose and chase the silent ones.', icon: 'mail' },
      { title: 'Never sure you have the best price', feels: 'Answers trickle in over hours. You pick one before the others reply, or you wait and lose the load.', action: 'Every reply lands in one table, with the cheapest offer on top as it arrives.', icon: 'search' },
      { title: 'Stuck calculating offers', feels: 'A PDF here, an Excel sheet there, a single line in an email. Per pallet, per kg or per container, then fuel, handling, validity and currency on top.', action: 'We read each reply, pull out the price and the extras, and show the real total.', icon: 'calculator' },
      { title: 'A slow answer loses the deal', feels: 'By the time you reply, the customer has gone to someone faster, or the carrier has filled the truck or the space.', action: 'You see which replies need you, so you can answer in minutes, not hours.', icon: 'clock' },
      { title: 'No time to grow', feels: 'The team is stuck in the daily email flow. New customers and new lanes keep waiting.', action: 'Less time on routine quotes means more time on customers and new routes.', icon: 'route' }
    ],
    comparison: {
      label: 'Example', title: 'A normal quote, without and with Revomatix',
      without: ['Request arrives', 'Write to 6 carriers', 'Wait', 'Open 4 emails and 2 PDFs', 'Add up extras by hand', 'Add margin', 'Write to the customer'],
      with: ['Request arrives', 'Sent to your carriers', 'Replies read and compared', 'Margin applied', 'You review the draft and send']
    }
  },
  workflow: {
    title: 'From request to ready quote',
    intro: 'Your carriers and agents keep using email. Revomatix keeps the replies together and prepares the decision for your manager.',
    steps: [
      { title: 'Enter the request', body: 'Route, dates, cargo, mode (road, sea or air) and any special conditions.', tag: 'Soon: forward the customer’s email' },
      { title: 'We email your carriers', body: 'One separate email per carrier or agent, with a reference so replies stay together.' },
      { title: 'We read and compare the replies', body: 'Prices, extras, validity and currency, side by side.' },
      { title: 'You approve and send', body: 'Review the quote with your margin and send it to the customer.' }
    ]
  },
  product: {
    title: 'Road, sea and air quotes in the same desk',
    intro: 'Pick a request, compare the real carrier totals and prepare the next reply. The examples below use made-up data.',
    tabs: ['Requests', 'Carriers', 'History'],
    filters: ['My desk', 'Road', 'Sea', 'Air', 'All'],
    summary: '3 need you, 1 ready, 0 waiting',
    footer: 'Prices are shown as the carrier wrote them. You decide. Nothing is booked from here.',
    requests: [
      {
        id: 'RFQ-1001', mode: 'Road', route: 'Vilnius to Berlin', detail: 'FTL', replies: '1 of 3', cheapest: '850 EUR', status: 'Needs you',
        customer: { price: '1,050 EUR', status: 'Waiting for the customer', emails: 'Customer emails (3)' },
        margin: { carrier: '850 EUR', customer: '1,050 EUR', amount: '200 EUR (19%)' },
        quotes: [
          { carrier: 'Carrier A', status: 'Price in', price: '850 EUR', basis: 'Whole shipment', valid: '15 Nov' },
          { carrier: 'Carrier B', status: 'Needs you', price: '920 + 45 fuel + 30 tail-lift = 995 EUR', basis: 'Whole shipment', valid: '15 Nov', extras: 'Fuel 45 · Tail-lift 30' },
          { carrier: 'Carrier C', status: 'Needs you', price: 'Will check, come back tomorrow.', basis: 'Not stated', valid: '—' }
        ],
        draftTo: 'Carrier C', suggestions: ['Ask for a price', 'Send a reminder', 'Ask: whole shipment or per unit?'],
        draft: 'Hello, thank you for your reply. Could you send your price and currency, and how long it is valid?'
      },
      {
        id: 'RFQ-1002', mode: 'Sea', route: 'Klaipeda to Rotterdam', detail: "1 × 20' container", replies: '2 of 4', cheapest: '1,420 EUR', status: 'Needs you',
        customer: { price: '1,690 EUR', status: 'Draft ready for review', emails: 'Customer emails (2)' },
        margin: { carrier: '1,420 EUR', customer: '1,690 EUR', amount: '270 EUR (16%)' },
        quotes: [
          { carrier: 'Agent A', status: 'Price in', price: '1,420 EUR + THC 120', basis: 'Per container', valid: '18 Nov', extras: 'THC 120' },
          { carrier: 'Agent B', status: 'Price in', price: '1,590 USD', basis: 'Per container', valid: '17 Nov', extras: 'Currency: USD' },
          { carrier: 'Agent C', status: 'Needs you', price: 'Space check in progress.', basis: 'Per container', valid: '—' }
        ],
        draftTo: 'Agent C', suggestions: ['Ask for availability', 'Ask for all-in price', 'Confirm free time'],
        draft: 'Hello, could you confirm space, the all-in price and how long the rate is valid?'
      },
      {
        id: 'RFQ-1003', mode: 'Air', route: 'Vilnius to Chicago', detail: '120 kg', replies: '1 of 3', cheapest: '2,180 EUR', status: 'Needs you',
        customer: { price: '2,520 EUR', status: 'Waiting for manager review', emails: 'Customer emails (1)' },
        margin: { carrier: '2,180 EUR', customer: '2,520 EUR', amount: '340 EUR (13%)' },
        quotes: [
          { carrier: 'Agent A', status: 'Price in', price: '18.17 EUR/kg = 2,180 EUR', basis: 'Per kg', valid: '14 Nov', extras: 'Fuel and handling included' },
          { carrier: 'Agent B', status: 'Needs you', price: 'Terminal fee: actual cost + processing fee', basis: 'Estimated extra', valid: '—', extras: 'Final terminal cost pending' },
          { carrier: 'Agent C', status: 'Needs you', price: 'Reply not received.', basis: 'Per kg', valid: '—' }
        ],
        draftTo: 'Agent B', suggestions: ['Ask for estimate', 'Confirm chargeable weight', 'Ask for routing'],
        draft: 'Hello, could you estimate the terminal and processing fees and confirm the chargeable weight?'
      },
      {
        id: 'RFQ-1004', mode: 'Road', route: 'Vilnius to Hamburg', detail: 'Groupage', replies: '5 of 5', cheapest: '690 EUR', status: 'Ready to decide',
        customer: { price: '860 EUR', status: 'Customer quote ready', emails: 'Customer emails (2)' },
        margin: { carrier: '690 EUR', customer: '860 EUR', amount: '170 EUR (20%)' },
        quotes: [
          { carrier: 'Carrier A', status: 'Price in', price: '690 EUR', basis: 'Whole shipment', valid: '16 Nov' },
          { carrier: 'Carrier B', status: 'Price in', price: '715 EUR', basis: 'Whole shipment', valid: '16 Nov' },
          { carrier: 'Carrier C', status: 'Price in', price: '740 EUR', basis: 'Whole shipment', valid: '17 Nov' }
        ],
        draftTo: 'Customer', suggestions: ['Use best offer', 'Add pickup window', 'Include validity'],
        draft: 'Hello, we can offer Vilnius to Hamburg for 860 EUR. Pickup is available this week. The quote is valid until 16 November.'
      }
    ]
  },
  control: {
    title: 'Your carriers, your margins, your approval',
    items: [
      { title: 'Your carriers', body: 'Add the carriers and agents you already work with, by mode and lane. We write to them, they reply by email.', icon: 'people' },
      { title: 'Your margins', body: 'Set your rules once. Every quote shows carrier price, margin and customer price.', icon: 'margin' },
      { title: 'Your approval', body: 'Every message is checked by a manager before it goes out.', icon: 'check' }
    ]
  },
  integrations: {
    title: 'Next: the best deals from the platforms, in the same place',
    subline: 'We are working on connecting freight exchanges and rate platforms, so the offers you see there and your carriers’ replies sit in one list, with the best options on top.',
    items: ['Cargo.lt', 'TIMOCOM', 'Trans.eu', 'Teleroute', 'Freidesk', 'Cargoson'],
    note: 'Integrations are planned. This does not mean an official partnership with any platform.',
    inputCta: 'Tell us which platforms you use',
    concept: {
      title: 'Best offers · Vilnius to Berlin · 2 pallets',
      sources: ['Your carriers (email)', 'Cargo.lt', 'TIMOCOM', 'Trans.eu', 'Teleroute', 'Freidesk', 'Cargoson'],
      offers: [
        { rank: 1, source: 'Your carriers', carrier: 'Carrier A', price: '610 EUR', pickup: 'Tomorrow', tag: 'Best price' },
        { rank: 2, source: 'TIMOCOM', carrier: 'Carrier B', price: '635 EUR', pickup: 'Today 16:00', tag: 'Fastest' },
        { rank: 3, source: 'Trans.eu', carrier: 'Carrier C', price: '650 EUR', pickup: 'Tomorrow' },
        { rank: 4, source: 'Your carriers', carrier: 'Carrier D', price: '675 EUR', pickup: 'Tomorrow' },
        { rank: 5, source: 'Cargo.lt', carrier: 'Carrier E', price: '690 EUR', pickup: 'In 2 days' }
      ]
    }
  },
  form: {
    title: 'Be one of the first forwarders to try it',
    intro: 'We are working closely with a small number of Baltic forwarders. Tell us how you handle quotes today and we will show you the desk on your own examples.',
    points: ['Start with the email process you already use', 'Agree the manager approval rules together', 'Test the workflow with your own example quotes'],
    modes: ['Road', 'Sea', 'Air'],
    platforms: ['Cargo.lt', 'TIMOCOM', 'Trans.eu', 'Teleroute', 'Freidesk', 'Cargoson', 'Other'],
    button: 'I want to try it', privacy: 'We will use your details only to contact you about the pilot.',
    success: 'Thank you! We will be in touch within a few days.',
    error: 'We could not send your request. Your details are still here. Please try again.',
    mailto: 'Your email app has been opened. Send the message to complete your request.'
  },
  faq: {
    title: 'Questions from forwarders',
    items: [
      { question: 'Are emails sent without my approval?', answer: 'No. Every message is checked and approved by your manager before it goes out.' },
      { question: 'Do my carriers need to use a new system?', answer: 'No. They keep replying by email, in whatever format they use today.' },
      { question: 'What if a carrier’s reply is unclear?', answer: 'We keep it for you to look at and suggest a question to ask, for example whether the price is for the whole shipment or per pallet. Nothing is guessed silently.' },
      { question: 'Which types of freight does it cover?', answer: 'Road, sea and air quotes. For each request you choose the mode and which carriers or agents to ask.' },
      { question: 'Do I need to install anything?', answer: 'No. To start we need access to the mailbox you use for carriers. We will agree how to set it up with you.' },
      { question: 'Which languages does it work in?', answer: 'English, Lithuanian, Polish, Russian and German, depending on your carriers.' },
      { question: 'How is my data handled?', answer: 'We use only what is needed to do the work, you can disconnect at any time, and we sign a data processing agreement.' },
      { question: 'How much does it cost?', answer: 'We are still agreeing pricing with our first customers.' }
    ]
  }
};

const ICONS = {
  mail: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5M8 10.5h5"/></svg>',
  calculator: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 11h2m4 0h2m-8 4h2m4 0h2m-8 4h2m4 0h2"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v6l4 2"/></svg>',
  route: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h3a3 3 0 0 0 3-3V9a3 3 0 0 1 3-3"/></svg>',
  people: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c0-4 2-6 5-6s5 2 5 6m1-5c3 0 5 2 5 5"/></svg>',
  margin: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M7 6h.01M17 18h.01"/><circle cx="7" cy="6" r="3"/><circle cx="17" cy="18" r="3"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12 4 4L19 6"/><rect x="3" y="3" width="18" height="18" rx="5"/></svg>'
};

const getCopyValue = (path) => path.split('.').reduce((value, key) => value?.[key], COPY);
const safeClass = (value) => value.toLowerCase().replace(/[^a-z]+/g, '-');
const statusClass = (status) => status === 'Price in' || status === 'Ready to decide' ? 'is-ready' : 'is-needs';

function renderHeroPreview() {
  const target = document.querySelector('[data-hero-preview]');
  target.innerHTML = `
    <div class="preview-card">
      <div class="mock-titlebar"><div><span class="example-label">Example</span><strong>RFQ Desk</strong></div><span class="mail-status"><i></i>Email connected</span></div>
      <div class="reply-banner" data-hero-banner><span>↘</span> New carrier reply received</div>
      <div class="preview-body">
        <div class="preview-heading"><div><small>Open requests</small><strong>Carrier replies</strong></div><span class="mini-summary">2 need you</span></div>
        <div class="preview-table-wrap"><table class="preview-table"><colgroup><col style="width:18%"><col style="width:31%"><col style="width:15%"><col style="width:17%"><col style="width:19%"></colgroup><thead><tr><th>RFQ</th><th>Route</th><th>Replies</th><th>Cheapest</th><th>Status</th></tr></thead><tbody><tr><td>1001</td><td>Vilnius → Berlin</td><td data-hero-replies>1 of 3</td><td data-hero-price>850 EUR</td><td><span class="mock-chip is-needs">Needs you</span></td></tr><tr><td>1004</td><td>Vilnius → Hamburg</td><td>5 of 5</td><td>690 EUR</td><td><span class="mock-chip is-ready">Ready</span></td></tr></tbody></table></div>
        <div class="preview-lower"><div class="preview-quotes"><small>Carrier quotes · RFQ-1001</small><div class="quote-line is-best"><span>Carrier A</span><strong>850 EUR</strong><em>Whole shipment</em></div><div class="quote-line"><span>Carrier B</span><strong>995 EUR</strong><em>Fuel + tail-lift included</em></div></div><div class="preview-draft"><small>Draft customer reply</small><p>We can offer Vilnius to Berlin for <strong>1,050 EUR</strong>.</p><button type="button" tabindex="-1">Review and send</button></div></div>
      </div>
    </div>`;
}

function renderComparison() {
  const item = COPY.problems.comparison;
  const flow = (items) => items.map((text, index) => `<span>${text}</span>${index < items.length - 1 ? '<b aria-hidden="true">→</b>' : ''}`).join('');
  document.querySelector('[data-comparison]').innerHTML = `<div class="comparison-title"><span class="example-label">${item.label}</span><h3>${item.title}</h3></div><div class="comparison-row"><strong>Without</strong><div>${flow(item.without)}</div></div><div class="comparison-row is-with"><strong>With Revomatix</strong><div>${flow(item.with)}</div></div>`;
}

function requestRows(items, selectedId) {
  return items.map((item) => `<tr class="request-row ${item.id === selectedId ? 'is-selected' : ''}" data-request-id="${item.id}" tabindex="0" role="button" aria-pressed="${item.id === selectedId}"><td data-label="Request"><strong>${item.id}</strong><small>${item.detail}</small></td><td data-label="Mode"><span class="mode-pill ${safeClass(item.mode)}">${item.mode}</span></td><td data-label="Route">${item.route}</td><td data-label="Replies">${item.replies}</td><td data-label="Cheapest"><strong>${item.cheapest}</strong></td><td data-label="Status"><span class="mock-chip ${statusClass(item.status)}">${item.status}</span></td></tr>`).join('');
}

function detailPanel(item) {
  const quoteRows = item.quotes.map((quote) => `<tr><td>${quote.carrier}</td><td><span class="mock-chip ${statusClass(quote.status)}">${quote.status}</span></td><td><strong>${quote.price}</strong>${quote.extras ? `<small>${quote.extras}</small>` : ''}</td><td>${quote.basis}</td><td>${quote.valid}</td></tr>`).join('');
  return `<div class="detail-header"><div><span>${item.id}</span><h3>${item.route}</h3><small>${item.detail} · ${item.mode}</small></div><span class="example-label">Example data</span></div>
    <div class="customer-block"><div><span class="block-label">Customer</span><strong>Quoted to customer: ${item.customer.price}</strong><small>${item.customer.status}</small></div><button type="button">${item.customer.emails}</button></div>
    <div class="margin-box"><span>Estimate</span><div><small>Carrier</small><strong>${item.margin.carrier}</strong></div><b>+</b><div><small>Margin</small><strong>${item.margin.amount}</strong></div><b>=</b><div><small>Customer</small><strong>${item.margin.customer}</strong></div></div>
    <div class="carrier-block"><span class="block-label">Carriers</span><div class="quotes-scroll"><table class="detail-quotes"><thead><tr><th>Carrier</th><th>Status</th><th>Price</th><th>Basis</th><th>Valid until</th></tr></thead><tbody>${quoteRows}</tbody></table></div></div>
    <div class="draft-box"><div class="draft-head"><span>To ${item.draftTo}</span><span>Suggested reply</span></div><div class="suggestions">${item.suggestions.map((text) => `<button type="button">${text}</button>`).join('')}</div><p>${item.draft}</p><div class="draft-actions"><button class="primary-mock" type="button">Review and send</button><button type="button">Clear</button></div></div>`;
}

let selectedRequest = COPY.product.requests[0].id;
let selectedFilter = 'My desk';

function filteredRequests() {
  if (['Road', 'Sea', 'Air'].includes(selectedFilter)) return COPY.product.requests.filter((item) => item.mode === selectedFilter);
  return COPY.product.requests;
}

function bindRequestRows() {
  document.querySelectorAll('[data-request-id]').forEach((row) => {
    const select = () => { selectedRequest = row.dataset.requestId; renderProductContent(); };
    row.addEventListener('click', select);
    row.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); select(); } });
  });
}

function renderProductContent() {
  const list = filteredRequests();
  if (!list.some((item) => item.id === selectedRequest)) selectedRequest = list[0]?.id || COPY.product.requests[0].id;
  const selected = COPY.product.requests.find((item) => item.id === selectedRequest);
  document.querySelector('[data-request-body]').innerHTML = requestRows(list, selectedRequest);
  document.querySelector('[data-detail-panel]').innerHTML = detailPanel(selected);
  bindRequestRows();
}

function renderProductDemo() {
  const target = document.querySelector('[data-rfq-demo]');
  target.innerHTML = `<div class="rfq-shell"><div class="rfq-titlebar"><div><strong>RFQ Desk</strong><span class="example-label">Example data</span></div><div class="rfq-tabs">${COPY.product.tabs.map((tab, index) => `<button type="button" class="${index === 0 ? 'is-active' : ''}" ${index ? 'aria-disabled="true"' : ''}>${tab}</button>`).join('')}</div></div>
    <div class="rfq-toolbar"><div class="filter-chips">${COPY.product.filters.map((filter) => `<button type="button" class="${filter === selectedFilter ? 'is-active' : ''}" data-mode-filter="${filter}">${filter}</button>`).join('')}</div><span>${COPY.product.summary}</span></div>
    <div class="rfq-grid"><div class="request-panel"><div class="request-table-wrap"><table class="request-table"><thead><tr><th>Request</th><th>Mode</th><th>Route</th><th>Replies</th><th>Cheapest</th><th>Status</th></tr></thead><tbody data-request-body></tbody></table></div></div><div class="detail-panel" data-detail-panel></div></div>
    <p class="rfq-footer">${COPY.product.footer}</p></div>`;
  target.querySelectorAll('[data-mode-filter]').forEach((button) => button.addEventListener('click', () => {
    selectedFilter = button.dataset.modeFilter;
    target.querySelectorAll('[data-mode-filter]').forEach((item) => item.classList.toggle('is-active', item === button));
    renderProductContent();
  }));
  renderProductContent();
}

function renderConcept() {
  const data = COPY.integrations.concept;
  document.querySelector('[data-concept-preview]').innerHTML = `<div class="concept-shell"><div class="concept-topbar"><div><span class="coming-badge">Concept preview · Coming soon</span><h3>${data.title}</h3></div><span class="example-label">Example</span></div><div class="concept-grid"><aside class="source-panel"><strong>Sources</strong>${data.sources.map((source, index) => `<div class="source-chip ${index === 0 ? 'is-active' : ''}"><span>${source}</span>${index ? '<small>Coming soon</small>' : '<small>Active</small>'}</div>`).join('')}<div class="source-chip"><span>More sources for sea and air later</span></div></aside><div class="offers-panel"><div class="offers-head"><strong>Ranked offers</strong><span>Best options first</span></div>${data.offers.map((offer) => `<div class="offer-row"><span class="offer-rank">${offer.rank}</span><div><strong>${offer.carrier}</strong><small>${offer.source}</small></div><div><strong>${offer.price}</strong><small>Pickup ${offer.pickup}</small></div>${offer.tag ? `<span class="offer-tag">${offer.tag}</span>` : '<span></span>'}<button type="button">Open thread</button></div>`).join('')}</div><aside class="match-card"><span class="example-label">Example</span><small>New load matches your lanes</small><h4>Vilnius → Berlin</h4><p>2 pallets · 640 kg<br>Pickup tomorrow</p><button type="button">Offer to carriers</button></aside></div></div>`;
}

function renderCopy() {
  document.querySelectorAll('[data-copy]').forEach((element) => { const value = getCopyValue(element.dataset.copy); if (typeof value === 'string') element.textContent = value; });
  document.querySelector('[data-list="hero.modes"]').innerHTML = COPY.hero.modes.map((mode) => `<span class="mode-pill ${safeClass(mode)}">${mode}</span>`).join('');
  document.querySelector('[data-list="problems.items"]').innerHTML = COPY.problems.items.map((item) => `<article class="pain-card"><span class="pain-icon">${ICONS[item.icon]}</span><h3>${item.title}</h3><p>${item.feels}</p><div class="pain-action"><strong>Revomatix</strong><span>${item.action}</span></div></article>`).join('');
  document.querySelector('[data-list="workflow.steps"]').innerHTML = COPY.workflow.steps.map((item, index) => `<li class="step-card"><span class="step-number">0${index + 1}</span><h3>${item.title}</h3><p>${item.body}</p>${item.tag ? `<span class="soon-tag">${item.tag}</span>` : ''}</li>`).join('');
  document.querySelector('[data-list="control.items"]').innerHTML = COPY.control.items.map((item) => `<article class="control-card"><span class="control-icon">${ICONS[item.icon]}</span><h3>${item.title}</h3><p>${item.body}</p></article>`).join('');
  document.querySelector('[data-list="integrations.items"]').innerHTML = COPY.integrations.items.map((name) => `<div><span>${name}</span><span class="coming-badge">Coming soon</span></div>`).join('');
  document.querySelector('[data-list="form.points"]').innerHTML = COPY.form.points.map((item) => `<li>${item}</li>`).join('');
  document.querySelector('[data-modes]').innerHTML = COPY.form.modes.map((mode) => `<label class="check-option"><input type="checkbox" name="modes" value="${mode}" /><span>${mode}</span></label>`).join('');
  document.querySelector('[data-platforms]').innerHTML = COPY.form.platforms.map((platform) => `<label class="check-option"><input type="checkbox" name="platforms" value="${platform}" /><span>${platform}</span></label>`).join('');
  document.querySelector('[data-list="faq.items"]').innerHTML = COPY.faq.items.map((item) => `<details class="faq-item"><summary>${item.question}</summary><p>${item.answer}</p></details>`).join('');
  const contact = document.querySelector('[data-contact-email]'); contact.textContent = CONTACT_EMAIL; contact.href = `mailto:${CONTACT_EMAIL}`;
  renderHeroPreview(); renderComparison(); renderProductDemo(); renderConcept();
}

function setupNavigation() {
  const toggle = document.querySelector('[data-nav-toggle]'); const nav = document.querySelector('[data-nav]');
  const setOpen = (open) => { toggle.setAttribute('aria-expanded', String(open)); toggle.querySelector('.sr-only').textContent = open ? 'Close navigation' : 'Open navigation'; nav.classList.toggle('is-open', open); };
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (event) => { if (event.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setOpen(false); });
}

function setupFaq() {
  const items = [...document.querySelectorAll('.faq-item')];
  items.forEach((item) => item.addEventListener('toggle', () => { if (item.open) items.forEach((other) => { if (other !== item) other.open = false; }); }));
}

function setupAnimations() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const preview = document.querySelector('.preview-card');
  window.setTimeout(() => {
    preview.classList.add('has-new-reply');
    preview.querySelector('[data-hero-replies]').textContent = '2 of 3';
    window.setTimeout(() => preview.classList.remove('has-new-reply'), 3800);
  }, 1700);
  window.setTimeout(() => {
    const road = COPY.product.requests[0];
    road.quotes[2] = { carrier: 'Carrier C', status: 'Price in', price: '820 EUR', basis: 'Whole shipment', valid: '15 Nov', extras: 'New reply' };
    road.replies = '2 of 3'; road.cheapest = '820 EUR';
    if (selectedRequest === road.id) renderProductContent();
    document.querySelector('.rfq-shell')?.classList.add('has-new-reply');
  }, 5200);
}

const selectedValues = (form, name) => [...form.querySelectorAll(`input[name="${name}"]:checked`)].map((input) => input.value);

function buildMailto(formData) {
  const subject = encodeURIComponent(`Revomatix early access — ${formData.get('company')}`);
  const body = encodeURIComponent([`Name: ${formData.get('name')}`, `Company: ${formData.get('company')}`, `Work email: ${formData.get('email')}`, `Employees: ${formData.get('employees')}`, `Modes: ${formData.getAll('modes').join(', ') || 'Not specified'}`, `Platforms: ${formData.getAll('platforms').join(', ') || 'Not specified'}`, `Message: ${formData.get('message') || 'None'}`].join('\n'));
  return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
}

function setupForm() {
  const form = document.querySelector('[data-access-form]'); const status = document.querySelector('[data-form-status]'); const button = form.querySelector('button[type="submit"]');
  form.addEventListener('submit', async (event) => {
    event.preventDefault(); status.className = 'form-status'; status.textContent = '';
    if (!form.reportValidity() || form.elements.website.value) return;
    const originalData = new FormData(form); const formData = new FormData(form);
    formData.set('modes', selectedValues(form, 'modes').join(', ')); formData.set('platforms', selectedValues(form, 'platforms').join(', '));
    if (!FORM_ENDPOINT) { window.location.href = buildMailto(originalData); status.classList.add('is-info'); status.textContent = COPY.form.mailto; return; }
    button.disabled = true; button.setAttribute('aria-busy', 'true'); const originalText = button.firstElementChild.textContent; button.firstElementChild.textContent = 'Sending…';
    try {
      const response = await fetch(FORM_ENDPOINT, { method: 'POST', body: formData, headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error('Submission failed');
      form.reset(); status.classList.add('is-success'); status.textContent = COPY.form.success;
    } catch { status.classList.add('is-error'); status.textContent = COPY.form.error; }
    finally { button.disabled = false; button.removeAttribute('aria-busy'); button.firstElementChild.textContent = originalText; }
  });
}

renderCopy(); setupNavigation(); setupFaq(); setupAnimations(); setupForm();
