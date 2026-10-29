const FORM_ENDPOINT = window.REVOMATIX_FORM_ENDPOINT || '';
const CONTACT_EMAIL = 'sales@revomatix.com';

const COPY = {
  nav: { cta: 'Get early access' },
  hero: {
    eyebrow: 'The quote desk for freight forwarders',
    title: 'Fewer carrier emails. Faster answers. Better prices.',
    subline: 'Revomatix sends your quote requests to your carriers, reads their replies in any format, compares the offers and drafts the answers. You just approve.',
    primaryCta: 'Get early access',
    secondaryCta: 'See how it works',
    proof: 'Built together with Baltic forwarders'
  },
  problems: {
    title: 'What slows you down every day',
    items: [
      { title: 'Endless emails with carriers', body: 'Days go by writing, waiting and chasing.', icon: 'mail' },
      { title: 'Hard to find the best price', body: 'Quotes arrive at different times, so you never know if it is the best one.', icon: 'search' },
      { title: 'Offers to add up by hand', body: 'A PDF, an Excel sheet, a line in an email. Surcharges, validity, currency. Someone has to put it all together.', icon: 'calculator' },
      { title: 'A slow answer loses the load', body: 'While you reply, the carrier or the customer has already agreed with someone else.', icon: 'clock' },
      { title: 'No time to grow', body: 'The team is buried in email, so new customers and new lanes wait.', icon: 'route' }
    ]
  },
  workflow: {
    title: 'From a request to a ready offer',
    intro: 'Use the carrier relationships you already have. Revomatix handles the email work and prepares the decision for your manager.',
    steps: [
      { title: 'Enter the request', body: 'Add the route, load details and timing.' },
      { title: 'We send it to your carriers', body: 'The request goes by email to the carriers you choose.' },
      { title: 'We read and compare the replies', body: 'Prices, surcharges and validity are pulled from emails, PDFs and Excel files.' },
      { title: 'You approve and send', body: 'Check the best option, your margin and the draft before anything goes out.' }
    ]
  },
  values: {
    title: 'A calmer desk. A clear decision.',
    items: [
      { title: 'Reply faster', body: 'Send a complete offer while the load is still available.' },
      { title: 'See the best offer in one place', body: 'Compare the real total, basis and validity side by side.' },
      { title: 'You always decide', body: 'Nothing is sent or booked without the manager’s approval.' }
    ]
  },
  integrations: {
    title: 'Coming soon: freight exchange integrations',
    subline: 'We plan to connect freight exchanges, so offers from every source and carrier replies sit in one place, with the best options on top.',
    items: ['Cargo.lt', 'TIMOCOM', 'Trans.eu', 'Teleroute', 'Freidesk', 'Cargoson'],
    note: 'Integrations are planned. This does not mean an official partnership.'
  },
  form: {
    title: 'We are looking for forwarders to try it first',
    intro: 'Tell us how your team works today. We will contact you to see whether the pilot fits your lanes and carrier flow.',
    points: ['Start with the email process you already use', 'Agree the manager approval rules together', 'No platform integration is required for the first pilot'],
    platforms: ['Cargo.lt', 'TIMOCOM', 'Trans.eu', 'Teleroute', 'Freidesk', 'Cargoson', 'Other'],
    button: 'I want to try it',
    privacy: 'We will use your details only to contact you about the pilot.',
    success: 'Thank you! We will be in touch within a few days.',
    error: 'We could not send your request. Your details are still here. Please try again.',
    mailto: 'Your email app has been opened. Send the message to complete your request.'
  },
  faq: {
    title: 'Questions from forwarders',
    items: [
      { question: 'Are emails sent without my approval?', answer: 'No. Every message is checked and approved by your manager before it goes out.' },
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
  route: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h3a3 3 0 0 0 3-3V9a3 3 0 0 1 3-3"/></svg>'
};

const getCopyValue = (path) => path.split('.').reduce((value, key) => value?.[key], COPY);

function renderCopy() {
  document.querySelectorAll('[data-copy]').forEach((element) => {
    const value = getCopyValue(element.dataset.copy);
    if (typeof value === 'string') element.textContent = value;
  });

  document.querySelector('[data-list="problems.items"]').innerHTML = COPY.problems.items.map((item) => `
    <article class="pain-card">
      <span class="pain-icon">${ICONS[item.icon]}</span>
      <h3>${item.title}</h3><p>${item.body}</p>
    </article>`).join('');

  document.querySelector('[data-list="workflow.steps"]').innerHTML = COPY.workflow.steps.map((item, index) => `
    <li class="step-card"><span class="step-number">0${index + 1}</span><h3>${item.title}</h3><p>${item.body}</p></li>`).join('');

  document.querySelector('[data-list="values.items"]').innerHTML = COPY.values.items.map((item) => `
    <article class="value-card"><span class="check" aria-hidden="true">✓</span><h3>${item.title}</h3><p>${item.body}</p></article>`).join('');

  document.querySelector('[data-list="integrations.items"]').innerHTML = COPY.integrations.items.map((name) => `
    <div class="integration-item"><span>${name}</span><span class="coming-badge">Coming soon</span></div>`).join('');

  document.querySelector('[data-list="form.points"]').innerHTML = COPY.form.points.map((item) => `<li>${item}</li>`).join('');
  document.querySelector('[data-platforms]').innerHTML = COPY.form.platforms.map((platform) => `
    <label class="check-option"><input type="checkbox" name="platforms" value="${platform}" /><span>${platform}</span></label>`).join('');

  document.querySelector('[data-list="faq.items"]').innerHTML = COPY.faq.items.map((item) => `
    <details class="faq-item"><summary>${item.question}</summary><p>${item.answer}</p></details>`).join('');

  const contact = document.querySelector('[data-contact-email]');
  contact.textContent = CONTACT_EMAIL;
  contact.href = `mailto:${CONTACT_EMAIL}`;
}

function setupNavigation() {
  const toggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-nav]');
  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('.sr-only').textContent = open ? 'Close navigation' : 'Open navigation';
    nav.classList.toggle('is-open', open);
  };
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (event) => { if (event.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setOpen(false); });
}

function setupFaq() {
  const items = [...document.querySelectorAll('.faq-item')];
  items.forEach((item) => item.addEventListener('toggle', () => {
    if (item.open) items.forEach((other) => { if (other !== item) other.open = false; });
  }));
}

function setupDashboardAnimation() {
  const windowElement = document.querySelector('.product-window');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const replies = document.querySelector('[data-replies]');
  const price = document.querySelector('[data-price]');
  const bestPrice = document.querySelector('[data-best-price]');
  let resetTimer;
  const animateReply = () => {
    windowElement.classList.remove('is-arriving');
    void windowElement.offsetWidth;
    replies.textContent = '3 of 4';
    price.textContent = '€1,240';
    bestPrice.textContent = '€1,240';
    windowElement.classList.add('is-arriving');
    clearTimeout(resetTimer);
    resetTimer = window.setTimeout(() => {
      replies.textContent = '2 of 4';
      price.textContent = '€1,280';
      bestPrice.textContent = '€1,280';
      windowElement.classList.remove('is-arriving');
    }, 4200);
  };
  window.setTimeout(animateReply, 1800);
  const interval = window.setInterval(animateReply, 9000);
  window.addEventListener('pagehide', () => { window.clearInterval(interval); window.clearTimeout(resetTimer); }, { once: true });
}

function selectedPlatforms(form) {
  return [...form.querySelectorAll('input[name="platforms"]:checked')].map((input) => input.value);
}

function buildMailto(formData) {
  const platforms = formData.getAll('platforms').join(', ') || 'Not specified';
  const subject = encodeURIComponent(`Revomatix early access — ${formData.get('company')}`);
  const body = encodeURIComponent([
    `Name: ${formData.get('name')}`,
    `Company: ${formData.get('company')}`,
    `Work email: ${formData.get('email')}`,
    `Employees: ${formData.get('employees')}`,
    `Platforms: ${platforms}`,
    `Message: ${formData.get('message') || 'None'}`
  ].join('\n'));
  return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
}

function setupForm() {
  const form = document.querySelector('[data-access-form]');
  const status = document.querySelector('[data-form-status]');
  const button = form.querySelector('button[type="submit"]');
  const platformInputs = [...form.querySelectorAll('input[name="platforms"]')];
  const setPlatformValidity = () => {
    const hasSelection = platformInputs.some((input) => input.checked);
    platformInputs[0].setCustomValidity(hasSelection ? '' : 'Choose at least one platform, or choose Other.');
  };
  platformInputs.forEach((input) => input.addEventListener('change', setPlatformValidity));

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    setPlatformValidity();
    status.className = 'form-status';
    status.textContent = '';
    if (!form.reportValidity()) return;
    if (form.elements.website.value) return;

    const formData = new FormData(form);
    formData.set('platforms', selectedPlatforms(form).join(', '));

    if (!FORM_ENDPOINT) {
      window.location.href = buildMailto(new FormData(form));
      status.classList.add('is-info');
      status.textContent = COPY.form.mailto;
      return;
    }

    button.disabled = true;
    button.setAttribute('aria-busy', 'true');
    const originalText = button.firstElementChild.textContent;
    button.firstElementChild.textContent = 'Sending…';
    try {
      const response = await fetch(FORM_ENDPOINT, { method: 'POST', body: formData, headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error('Submission failed');
      form.reset();
      status.classList.add('is-success');
      status.textContent = COPY.form.success;
    } catch {
      status.classList.add('is-error');
      status.textContent = COPY.form.error;
    } finally {
      button.disabled = false;
      button.removeAttribute('aria-busy');
      button.firstElementChild.textContent = originalText;
    }
  });
}

renderCopy();
setupNavigation();
setupFaq();
setupDashboardAnimation();
setupForm();
