export const voiceBrand = { name: 'Revomatix', logo: '/assets/revomatix/revomatix-header-cropped.png', symbol: '/assets/revomatix/revomatix-symbol-cropped.png', favicon: '/assets/revomatix/favicon.png' }
export const voicePaths = ['/saas-payment-recovery', '/demo-recovery', '/fitness', '/ecommerce', '/invoice-follow-up', '/moving', '/restoration', '/commercial-contractors', '/distributors', '/medspa', '/auto-repair'] as const
export interface VoiceAudioDemo {
  src: string
  duration: number
  title?: string
  trigger?: string
  transcript: { at: number; speaker: 'AI agent' | 'Customer'; text: string }[]
  stages: string[]
  stageTimes?: number[]
  outcome: { title: string; detail: string }
}
export interface VoicePageConfig {
  path: typeof voicePaths[number]
  audioDemo?: VoiceAudioDemo
  sectionCopy?: {
    problem: { eyebrow: string; headline: string; body: string; emphasis: string }
    workflowEyebrow: string
    valueEyebrow: string
    valueHeadline: string
    differentiation: { eyebrow: string; headline: string; body: string; emphasis: string }
    ctaLabel: string
  }
  preview: { emphasis: string[]; context: string; messages: { speaker: string; text: string }[]; status: string; detail: string; need: string; recorded: string; owner: string }
  buyer: string
  eyebrow: string
  headline: string
  headlineAccent: string
  problem: string
  inbound: boolean
  channel: "SMS" | "Email"
  illustrationLabels: string[]
  invitation: string
  formHeading: string
  description: string
  title: string
  metaDescription: string
  workflowTitle: string
  workflowName: string
  outcomeDetail: string
  formIntro: string
  workflow: { title: string; body: string }[]
  example: { title: string; messages: { speaker: string; text: string }[]; note: string; confirmation: string }
  values: { title: string; body: string }[]
  pilot: { title: string; description: string; scope: string[]; question: string }
  faqs: { question: string; answer: string }[]
  finalTitle: string
}
export const voicePages: Record<VoicePageConfig["path"], VoicePageConfig> = {
  "/saas-payment-recovery": {
    "path": "/saas-payment-recovery",
    "audioDemo": {
      "src": "/audio/revomatix/saas-payment-recovery-conversation.mp3",
      "duration": 24.92,
      "title": "Subscription payment recovery",
      "trigger": "Payment failed; subscription at risk of interruption.",
      "transcript": [
        {
          "at": 0.0,
          "speaker": "AI agent",
          "text": "Hi Sam, this is Lumen's AI billing assistant. Today's subscription payment didn't go through. Would you like a secure card update link by text?"
        },
        {
          "at": 9.19,
          "speaker": "Customer",
          "text": "Oh, that's probably my old card. Yes, text it to me."
        },
        {
          "at": 13.42,
          "speaker": "AI agent",
          "text": "It's sent. I can stay on the line while you update it."
        },
        {
          "at": 17.1,
          "speaker": "Customer",
          "text": "Okay, I've updated the card."
        },
        {
          "at": 19.35,
          "speaker": "AI agent",
          "text": "Thank you. The payment has gone through, and your subscription will continue without interruption."
        }
      ],
      "stages": [
        "Payment unresolved",
        "Customer reached",
        "Secure update completed",
        "Payment recovered"
      ],
      "stageTimes": [
        0,
        9.19,
        13.42,
        17.1
      ],
      "outcome": {
        "title": "Payment recovered",
        "detail": "Card updated and subscription continued without interruption."
      }
    },
    "sectionCopy": {
      "problem": {
        "eyebrow": "AFTER DUNNING",
        "headline": "When retries stop working, the payment needs a conversation.",
        "body": "Retries and dunning emails work for straightforward failures. Some accounts remain unpaid because the cardholder changed, the billing email is wrong, approval is required or the customer needs help. Another retry cannot resolve a human blocker.",
        "emphasis": "Recover unresolved subscriptions without adding another manual queue for customer success."
      },
      "workflowEyebrow": "HOW IT WORKS",
      "valueEyebrow": "BUILT FOR REVENUE TEAMS",
      "valueHeadline": "Escalate unresolved payments with less manual work.",
      "differentiation": {
        "eyebrow": "AFTER NORMAL DUNNING",
        "headline": "Add a conversation when reminders are no longer enough.",
        "body": "Revomatix is designed as the conversational escalation layer after normal dunning has failed. It works around your existing billing process rather than replacing payment retries or billing infrastructure.",
        "emphasis": "Start with recurring payments that still need action from a billing contact."
      },
      "ctaLabel": "Discuss a payment-recovery pilot"
    },
    "buyer": "For subscription SaaS billing and revenue teams",
    "eyebrow": "Voice AI for subscription payments",
    "headline": "Recover unresolved",
    "headlineAccent": "subscription payments.",
    "description": "Automate follow-up after retries and written reminders have failed. An AI voice agent reaches the billing contact, identifies the human blocker and sends the secure next step needed to preserve the subscription.",
    "problem": "Retries and dunning emails resolve straightforward failures. Some accounts stay unpaid because the cardholder changed, approval is required or the billing contact needs help.",
    "title": "Subscription payment follow-up | Revomatix",
    "metaDescription": "Automate follow-up after retries and written reminders have failed. An AI voice agent reaches the billing contact, identifies the human blocker and sends the secure next step needed to preserve the subscription.",
    "inbound": false,
    "illustrationLabels": [
      "Payment unresolved",
      "Billing contact reached",
      "Secure link emailed"
    ],
    "invitation": "Now inviting focused pilot partners.",
    "formHeading": "Let’s look at your subscription payment follow-up",
    "workflowTitle": "From unresolved payment to a clear next step.",
    "workflowName": "Subscription payment follow-up",
    "outcomeDetail": "Confirm payment from billing records.",
    "formIntro": "Explore a focused pilot with your team.",
    "workflow": [
      {
        "title": "Detect the unresolved payment",
        "body": "Identify recurring payments that remain unresolved after automatic retries and written reminders."
      },
      {
        "title": "Reach the billing contact",
        "body": "The AI voice agent calls the approved contact while the subscription can still be preserved."
      },
      {
        "title": "Identify the blocker",
        "body": "Clarify whether the issue is a changed cardholder, internal approval, contact detail or another permitted reason."
      },
      {
        "title": "Send the secure next step",
        "body": "Email the approved payment-update link and record the outcome for your billing or customer team."
      }
    ],
    "example": {
      "title": "A billing contact needs the right link.",
      "messages": [
        {
          "speaker": "Billing contact",
          "text": "Our finance team handles the company card."
        },
        {
          "speaker": "AI assistant",
          "text": "Would you like me to email the secure update link to your approved billing address for your finance team?"
        }
      ],
      "note": "A short call clarifies the question. An email carries the agreed next step.",
      "confirmation": "Email to the approved billing address with the secure payment-update link. Payment status is checked separately."
    },
    "values": [
      {
        "title": "Escalate the right accounts",
        "body": "Focus voice follow-up on payments that normal retries and reminders have not resolved."
      },
      {
        "title": "Clarify human blockers",
        "body": "Find the contact, approval or payment-update issue that another automated retry cannot uncover."
      },
      {
        "title": "Keep teams out of manual queues",
        "body": "Return a requested action, a clear owner or a documented reason the account remains unresolved."
      }
    ],
    "pilot": {
      "title": "Find which unresolved subscriptions still need a conversation.",
      "description": "Run a focused pilot after your normal dunning sequence. Measure billing contacts reached, blockers identified and secure update steps requested.",
      "scope": [
        "A defined group of unresolved recurring payments",
        "Approved call rules and secure email follow-up",
        "Recorded outcomes for billing and customer teams"
      ],
      "question": "What happens today when retries and payment emails do not resolve an account?"
    },
    "faqs": [
      {
        "question": "Does Revomatix replace our billing or dunning system?",
        "answer": "No. It is designed as a conversational escalation after your normal retries and written reminders have not resolved the payment."
      },
      {
        "question": "Will the AI voice agent collect card details?",
        "answer": "No. Customers use your approved secure payment-update page. Card details are not collected during the call."
      },
      {
        "question": "What can it say about an account?",
        "answer": "It follows the billing rules and account information approved by your team. Exceptions are recorded and passed to the appropriate person."
      },
      {
        "question": "How is the secure link sent?",
        "answer": "The pilot can be configured to email an approved link to the verified billing contact. Sending a link does not confirm payment."
      },
      {
        "question": "What system access is required?",
        "answer": "Any billing or customer-system access needed for the pilot is assessed before launch."
      }
    ],
    "finalTitle": "Let’s talk about your\nsubscription payment follow-up.",
    "channel": "Email",
    "preview": {
      "emphasis": [
        "payments that retries and reminders have not resolved"
      ],
      "context": "Payment still unresolved after reminders.",
      "messages": [
        {
          "speaker": "AI assistant",
          "text": "I’m the AI billing assistant. Would a secure payment-update link help?"
        },
        {
          "speaker": "Billing contact",
          "text": "Our finance team handles the company card."
        },
        {
          "speaker": "AI assistant",
          "text": "May I send it to your approved billing address?"
        },
        {
          "speaker": "Billing contact",
          "text": "Yes, please. I’ll ask finance to review it."
        }
      ],
      "status": "Secure link prepared",
      "detail": "For the approved billing email address.",
      "need": "Finance needs the secure update link.",
      "recorded": "Billing contact requested the link for finance.",
      "owner": "Finance updates the details; your team checks payment status."
    }
  },
  "/demo-recovery": {
    "path": "/demo-recovery",
    "audioDemo": {
      "src": "/audio/revomatix/demo-recovery-conversation.mp3",
      "duration": 22.6,
      "title": "Missed demo recovery",
      "trigger": "Qualified prospect missed the scheduled demo.",
      "transcript": [
        {
          "at": 0.0,
          "speaker": "AI agent",
          "text": "Hi James, this is Northstar's AI scheduling assistant. You missed today's two o'clock demo. Would you like to find another time?"
        },
        {
          "at": 7.6,
          "speaker": "Customer",
          "text": "Sorry, I got pulled into a client call. Can we do tomorrow?"
        },
        {
          "at": 11.52,
          "speaker": "AI agent",
          "text": "Of course. I can offer ten in the morning or three in the afternoon tomorrow."
        },
        {
          "at": 17.11,
          "speaker": "Customer",
          "text": "Ten in the morning works."
        },
        {
          "at": 18.86,
          "speaker": "AI agent",
          "text": "You're booked for ten tomorrow. I've just sent the calendar invitation."
        }
      ],
      "stages": [
        "Demo missed",
        "Prospect reached",
        "Availability checked",
        "Demo rebooked"
      ],
      "stageTimes": [
        0,
        7.6,
        11.52,
        17.11
      ],
      "outcome": {
        "title": "Demo rebooked",
        "detail": "Tomorrow at 10am confirmed and calendar invitation sent."
      }
    },
    "sectionCopy": {
      "problem": {
        "eyebrow": "AFTER THE NO-SHOW",
        "headline": "A missed demo does not need to become a lost opportunity.",
        "body": "A missed meeting is often a calendar or logistics problem. The costly part is allowing a qualified prospect to become cold while representatives repeatedly call and email. Revomatix starts the recovery conversation while the original interest is still fresh.",
        "emphasis": "Rebook qualified no-shows without a week of email tag."
      },
      "workflowEyebrow": "HOW IT WORKS",
      "valueEyebrow": "BUILT FOR SOFTWARE SALES TEAMS",
      "valueHeadline": "Take post-no-show scheduling off the sales queue.",
      "differentiation": {
        "eyebrow": "AFTER THE MISSED MEETING",
        "headline": "Recover the demo after reminders have done their job.",
        "body": "Pre-meeting reminders help prospects attend, but they do not resolve what happens after a qualified buyer misses the call. Revomatix focuses on the immediate post-no-show conversation and approved rescheduling step.",
        "emphasis": "Start with qualified meetings that still have active buying intent."
      },
      "ctaLabel": "Discuss a demo-recovery pilot"
    },
    "buyer": "For B2B SaaS sales and revenue teams",
    "eyebrow": "Voice AI for missed demos",
    "headline": "Rebook missed demos",
    "headlineAccent": "while intent is warm.",
    "description": "Automate follow-up when a qualified prospect misses a booked demo. An AI voice agent reconnects promptly, understands the scheduling issue, offers approved availability and confirms a new meeting.",
    "problem": "A missed demo is often a calendar or logistics problem. The opportunity becomes expensive when a qualified prospect grows cold while representatives repeatedly follow up.",
    "title": "Missed demo follow-up | Revomatix",
    "metaDescription": "Automate follow-up when a qualified prospect misses a booked demo. An AI voice agent reconnects promptly, understands the scheduling issue, offers approved availability and confirms a new meeting.",
    "inbound": false,
    "illustrationLabels": [
      "Demo missed",
      "Rescheduling call",
      "Meeting details emailed"
    ],
    "invitation": "Now inviting focused pilot partners.",
    "formHeading": "Let’s look at your missed demo follow-up",
    "workflowTitle": "From missed meeting to a confirmed new time.",
    "workflowName": "Missed demo follow-up",
    "outcomeDetail": "Track attended demos, not bookings alone.",
    "formIntro": "Explore a focused pilot with your team.",
    "workflow": [
      {
        "title": "Detect the missed meeting",
        "body": "Identify a qualified prospect who did not attend a booked demo or evaluation call."
      },
      {
        "title": "Contact while intent is warm",
        "body": "The AI voice agent follows up promptly and asks what prevented the prospect from attending."
      },
      {
        "title": "Offer approved availability",
        "body": "Present suitable times when the required calendar access and booking rules are available."
      },
      {
        "title": "Rebook and confirm",
        "body": "Record the new meeting and email the approved confirmation details to the prospect."
      }
    ],
    "example": {
      "title": "Another meeting, with the right people.",
      "messages": [
        {
          "speaker": "Prospect",
          "text": "I missed it because a client meeting ran over. Can our analyst join the next one?"
        },
        {
          "speaker": "AI assistant",
          "text": "I can help arrange another demo with your rep, note that your analyst will join, and email the new meeting details."
        }
      ],
      "note": "A short call clarifies the question. An email carries the agreed next step.",
      "confirmation": "Email confirmation of the rearranged demo, including the agreed time, sales rep and meeting details."
    },
    "values": [
      {
        "title": "Respond while interest is fresh",
        "body": "Follow up soon after the missed meeting instead of allowing a qualified prospect to become cold."
      },
      {
        "title": "Remove routine calendar chasing",
        "body": "Handle common scheduling issues without adding another sequence of manual calls and emails."
      },
      {
        "title": "Return a useful sales outcome",
        "body": "Give the representative a rebooked meeting, a clear next action or a documented reason to pause."
      }
    ],
    "pilot": {
      "title": "See how many qualified no-shows can return to the calendar.",
      "description": "Run a focused pilot on missed qualified demos. Measure prospects reached, scheduling blockers identified and meetings rebooked.",
      "scope": [
        "A defined group of qualified demo no-shows",
        "Approved availability and contact rules",
        "Rebooked meetings and recorded outcomes"
      ],
      "question": "How does your sales team follow up after a qualified prospect misses a demo?"
    },
    "faqs": [
      {
        "question": "Does Revomatix replace our sales representatives?",
        "answer": "No. It handles routine post-no-show follow-up and scheduling, then returns the conversation to the representative when needed."
      },
      {
        "question": "How quickly does it contact a missed prospect?",
        "answer": "The timing is agreed during pilot setup and can be configured around your meeting and outreach rules."
      },
      {
        "question": "Can it rebook directly on our calendar?",
        "answer": "It can offer approved availability and rebook when the required calendar access is available. The exact workflow is defined during the pilot."
      },
      {
        "question": "What happens when the prospect has a sales question?",
        "answer": "The AI voice agent records the question and routes it to the appropriate representative instead of inventing an answer."
      },
      {
        "question": "How is the new meeting confirmed?",
        "answer": "An email can support the call by sharing the approved meeting details. Sending confirmation does not guarantee attendance."
      }
    ],
    "finalTitle": "Let’s talk about your\nmissed demo follow-up.",
    "channel": "Email",
    "preview": {
      "emphasis": [
        "demo no-shows",
        "more time for sales conversations"
      ],
      "context": "Qualified prospect missed a demo.",
      "messages": [
        {
          "speaker": "AI assistant",
          "text": "I’m the AI assistant for the sales team. Would you like to rearrange your demo?"
        },
        {
          "speaker": "Prospect",
          "text": "Yes, our meeting ran over."
        },
        {
          "speaker": "AI assistant",
          "text": "Would you like the team to find an afternoon slot?"
        },
        {
          "speaker": "Prospect",
          "text": "Yes, and email me the details."
        }
      ],
      "status": "Rescheduling requested",
      "detail": "Afternoon preference recorded for the sales team.",
      "need": "Another opportunity to see the demo.",
      "recorded": "Afternoon meeting preferred; email confirmation requested.",
      "owner": "The sales team confirms a suitable slot and meeting details."
    }
  },
  "/fitness": {
    "path": "/fitness",
    "audioDemo": {
      "src": "/audio/revomatix/fitness-conversation.mp3",
      "duration": 23.88,
      "title": "Trial visit recovery",
      "trigger": "Prospect missed a booked trial visit.",
      "transcript": [
        {
          "at": 0.0,
          "speaker": "AI agent",
          "text": "Hi Marcus, this is Peak Fitness's AI scheduling assistant. We missed you at tonight's trial visit. Would you like to reschedule?"
        },
        {
          "at": 7.84,
          "speaker": "Customer",
          "text": "Yeah, work ran late. Sorry about that."
        },
        {
          "at": 11.52,
          "speaker": "AI agent",
          "text": "No problem. I have space tomorrow at six, or Thursday at seven."
        },
        {
          "at": 16.72,
          "speaker": "Customer",
          "text": "Tomorrow at six would be great."
        },
        {
          "at": 18.89,
          "speaker": "AI agent",
          "text": "You're rebooked for tomorrow at six. I've sent the confirmation and reminder by text."
        }
      ],
      "stages": [
        "Trial missed",
        "Prospect reached",
        "New time selected",
        "Visit rebooked"
      ],
      "stageTimes": [
        0,
        7.84,
        11.52,
        16.72
      ],
      "outcome": {
        "title": "Trial visit rebooked",
        "detail": "Tomorrow at 6pm confirmed and reminder scheduled."
      }
    },
    "sectionCopy": {
      "problem": {
        "eyebrow": "AFTER THE MISSED VISIT",
        "headline": "Bring missed tours back while the intention to join is still fresh.",
        "body": "A missed tour is a warm membership lead becoming colder every hour. The prospect may only need a different time, but repeated follow-up competes with members already in the club. Revomatix starts the rebooking conversation promptly.",
        "emphasis": "Turn today’s no-show into another chance to win the membership."
      },
      "workflowEyebrow": "HOW IT WORKS",
      "valueEyebrow": "BUILT FOR MEMBERSHIP TEAMS",
      "valueHeadline": "Recover missed visits without another call list.",
      "differentiation": {
        "eyebrow": "AFTER THE REMINDER",
        "headline": "Handle the recovery motion after the visit is missed.",
        "body": "Most fitness automation focuses on initial speed-to-lead or reminders before an appointment. Revomatix handles the voice conversation after the prospect still misses the tour or trial.",
        "emphasis": "Start with one focused workflow: missed visits that can still be rearranged."
      },
      "ctaLabel": "Discuss a fitness pilot"
    },
    "buyer": "For regional gyms, health clubs and membership teams",
    "eyebrow": "Voice AI for fitness clubs",
    "headline": "Bring missed club visits",
    "headlineAccent": "back to the calendar.",
    "description": "Automate follow-up after a prospect misses a booked tour or trial. An AI voice agent finds another suitable time, rebooks the visit and sends the details by text.",
    "problem": "A missed tour is a warm membership lead becoming colder every hour. Membership teams need a consistent way to recover the visit without filling another call list.",
    "title": "Missed tour follow-up | Revomatix",
    "metaDescription": "Automate follow-up after a prospect misses a booked tour or trial. An AI voice agent finds another suitable time, rebooks the visit and sends the details by text.",
    "inbound": false,
    "illustrationLabels": [
      "Tour or trial missed",
      "Rescheduling call",
      "Visit details sent"
    ],
    "invitation": "Now inviting focused pilot partners.",
    "formHeading": "Let’s look at your missed tour follow-up",
    "workflowTitle": "From missed visit to another chance to join.",
    "workflowName": "Missed tour follow-up",
    "outcomeDetail": "Track attendance after the rearranged visit.",
    "formIntro": "Explore a focused pilot with your team.",
    "workflow": [
      {
        "title": "Detect the missed visit",
        "body": "Identify a booked club tour or trial that the prospect did not attend."
      },
      {
        "title": "Call the prospect",
        "body": "The AI voice agent follows up and asks whether they would like to arrange another visit."
      },
      {
        "title": "Offer club availability",
        "body": "Present approved times when the required club calendar access is available."
      },
      {
        "title": "Rebook and confirm",
        "body": "Record the new visit and text the approved time and club details to the prospect."
      }
    ],
    "example": {
      "title": "A weekend visit could work.",
      "messages": [
        {
          "speaker": "Prospect",
          "text": "I could not get there after work. Is a weekend visit possible?"
        },
        {
          "speaker": "AI assistant",
          "text": "I can help arrange a weekend tour using your club’s available times, then text you the visit details."
        }
      ],
      "note": "A short call clarifies the question. A text carries the agreed next step.",
      "confirmation": "Text confirmation with the club location and rearranged visit details."
    },
    "values": [
      {
        "title": "Follow up while interest is fresh",
        "body": "Reconnect soon after the no-show while the prospect is still considering membership."
      },
      {
        "title": "Reduce repetitive rebooking calls",
        "body": "Let the AI voice agent handle straightforward scheduling while membership teams welcome people in the club."
      },
      {
        "title": "Return a clear outcome",
        "body": "Give the team a rebooked visit, a requested follow-up or a reason the prospect is not ready."
      }
    ],
    "pilot": {
      "title": "Bring more missed tours back to the club calendar.",
      "description": "Run a focused pilot on missed tours and trials. Measure prospects reached, visits rebooked and the outcomes recorded for your membership team.",
      "scope": [
        "One or more agreed club locations",
        "Approved availability and text confirmation",
        "Rebooked visits and documented outcomes"
      ],
      "question": "How does your membership team follow up after missed tours or trial visits?"
    },
    "faqs": [
      {
        "question": "Does Revomatix replace our membership team?",
        "answer": "No. It handles routine post-no-show follow-up and rebooking, then passes membership questions or exceptions to your team."
      },
      {
        "question": "Can it see available tour times?",
        "answer": "It can offer approved availability when the required calendar or club-system access is available. The pilot workflow is agreed before launch."
      },
      {
        "question": "What can it promise a prospect?",
        "answer": "Only the times, visit details and answers approved by your team. Membership terms and exceptions stay with your staff."
      },
      {
        "question": "How are visit details sent?",
        "answer": "Text can support the voice conversation by confirming the agreed time and approved club details."
      },
      {
        "question": "Does this cover all membership follow-up?",
        "answer": "No. The initial pilot stays focused on prospects who missed a booked tour or trial."
      }
    ],
    "finalTitle": "Let’s talk about your\nmissed tour follow-up.",
    "channel": "SMS",
    "preview": {
      "emphasis": [
        "missed tours and trial visits"
      ],
      "context": "Tour missed; no new visit arranged.",
      "messages": [
        {
          "speaker": "AI assistant",
          "text": "I’m the club’s AI assistant. Would you like to rearrange your tour?"
        },
        {
          "speaker": "Prospect",
          "text": "Yes, I couldn’t make it after work."
        },
        {
          "speaker": "AI assistant",
          "text": "Would a weekend visit be easier?"
        },
        {
          "speaker": "Prospect",
          "text": "Yes, please send me the details once it’s arranged."
        }
      ],
      "status": "Visit preference recorded",
      "detail": "Weekend request ready for the membership team.",
      "need": "A visit that fits around work.",
      "recorded": "Weekend tour preferred; visit details requested.",
      "owner": "The membership team confirms a suitable time."
    }
  },
  "/ecommerce": {
    "path": "/ecommerce",
    "audioDemo": {
      "src": "/audio/revomatix/ecommerce-conversation.mp3",
      "duration": 27.64,
      "title": "High-value checkout recovery",
      "trigger": "Customer left a cedar dining set at checkout.",
      "transcript": [
        {
          "at": 0.0,
          "speaker": "AI agent",
          "text": "Hi Ethan, this is Aurelia's AI shopping assistant. I'm following up on the cedar dining set you left at checkout. Was there a question I can answer?"
        },
        {
          "at": 9.19,
          "speaker": "Customer",
          "text": "Yeah, I wasn't sure whether it ships assembled."
        },
        {
          "at": 12.3,
          "speaker": "AI agent",
          "text": "It arrives assembled except for the legs, which take about five minutes to attach. I've sent your saved checkout link."
        },
        {
          "at": 20.37,
          "speaker": "Customer",
          "text": "Great, I have it. I'll complete the order now."
        },
        {
          "at": 23.74,
          "speaker": "AI agent",
          "text": "Your order is confirmed. You'll receive the delivery details by email."
        }
      ],
      "stages": [
        "Checkout abandoned",
        "Customer reached",
        "Product question resolved",
        "Order completed"
      ],
      "stageTimes": [
        0,
        9.19,
        12.3,
        20.37
      ],
      "outcome": {
        "title": "Order completed",
        "detail": "Product question answered and purchase confirmed."
      }
    },
    "sectionCopy": {
      "problem": {
        "eyebrow": "BEFORE THE PURCHASE",
        "headline": "Some abandoned carts are unanswered questions.",
        "body": "This workflow is built for considered purchases, not low-value impulse buys. Some valuable carts remain incomplete because nobody answered a question about sizing, compatibility, delivery, assembly or availability. Another reminder cannot discover which concern matters.",
        "emphasis": "Recover the considered purchases that need a conversation, not another coupon."
      },
      "workflowEyebrow": "HOW IT WORKS",
      "valueEyebrow": "BUILT FOR CONSIDERED PURCHASES",
      "valueHeadline": "Help customers resolve practical buying blockers.",
      "differentiation": {
        "eyebrow": "BEYOND CART REMINDERS",
        "headline": "Answer the question behind the abandoned checkout.",
        "body": "Email and text cart flows can remind a customer or offer a discount. Revomatix is designed for eligible purchases where a voice conversation can identify and resolve an approved product or delivery question.",
        "emphasis": "Start with a narrow group of valuable checkouts where personal help makes sense."
      },
      "ctaLabel": "Discuss a checkout-recovery pilot"
    },
    "buyer": "For high-consideration ecommerce brands",
    "eyebrow": "Voice AI for considered purchases",
    "headline": "Turn unanswered questions",
    "headlineAccent": "back into checkouts.",
    "description": "Automate follow-up on qualified high-value carts. An AI voice agent identifies approved questions about sizing, compatibility, delivery or availability and guides the customer back to checkout.",
    "problem": "Some high-value carts are abandoned because nobody answered a practical question. A reminder or discount cannot understand whether sizing, compatibility, delivery or assembly is holding up the purchase.",
    "title": "Incomplete checkout follow-up | Revomatix",
    "metaDescription": "Automate follow-up on qualified high-value carts. An AI voice agent identifies approved questions about sizing, compatibility, delivery or availability and guides the customer back to checkout.",
    "inbound": false,
    "illustrationLabels": [
      "Checkout incomplete",
      "Checkout-assistance call",
      "Checkout link texted"
    ],
    "invitation": "Now inviting focused pilot partners.",
    "formHeading": "Let’s look at your incomplete checkout follow-up",
    "workflowTitle": "From qualified abandoned checkout to a resolved next step.",
    "workflowName": "Incomplete checkout follow-up",
    "outcomeDetail": "Confirm orders separately from messages sent.",
    "formIntro": "Explore a focused pilot with your team.",
    "workflow": [
      {
        "title": "Detect the qualified checkout",
        "body": "Select eligible high-consideration carts where a practical question may be holding up the purchase."
      },
      {
        "title": "Start the conversation",
        "body": "The AI voice agent contacts the customer under the outreach rules agreed for the pilot."
      },
      {
        "title": "Resolve an approved question",
        "body": "Answer permitted product, compatibility, availability or delivery questions using approved information."
      },
      {
        "title": "Return to checkout",
        "body": "Send the approved product information or checkout link and record the customer’s next step."
      }
    ],
    "example": {
      "title": "The detail a shopper needs to decide.",
      "messages": [
        {
          "speaker": "Shopper",
          "text": "I wanted to check the dimensions before buying."
        },
        {
          "speaker": "AI assistant",
          "text": "I can share the listed dimensions and text you the approved product information with your checkout link."
        }
      ],
      "note": "A short call clarifies the question. A text carries the agreed next step.",
      "confirmation": "Text follow-up sharing the approved product dimensions and checkout link."
    },
    "values": [
      {
        "title": "Focus on considered purchases",
        "body": "Use conversational follow-up where the order value and buying process justify personal help."
      },
      {
        "title": "Understand the real blocker",
        "body": "Separate practical product or delivery questions from customers who are simply not ready to buy."
      },
      {
        "title": "Return a useful outcome",
        "body": "Give support a resolved question, a requested follow-up or a clear reason the checkout remains incomplete."
      }
    ],
    "pilot": {
      "title": "Find which valuable checkouts still need an answer.",
      "description": "Run a focused pilot on a defined group of eligible abandoned checkouts. Measure customers reached, questions identified and approved next steps taken.",
      "scope": [
        "A defined high-consideration product or cart segment",
        "Approved product answers and contact rules",
        "Checkout links, follow-ups and recorded outcomes"
      ],
      "question": "Which customer questions most often hold up your higher-value purchases?"
    },
    "faqs": [
      {
        "question": "Is this intended for every abandoned cart?",
        "answer": "No. The pilot focuses on eligible high-consideration purchases where a practical question may justify a conversation."
      },
      {
        "question": "What product questions can the AI voice agent answer?",
        "answer": "Only questions covered by product and delivery information approved by your team. Exceptions are passed to a person."
      },
      {
        "question": "Can it apply discounts or change an order?",
        "answer": "Only actions explicitly approved and configured for the pilot are available. It does not invent discounts, availability or terms."
      },
      {
        "question": "How does the customer return to checkout?",
        "answer": "Text can support the call by sharing approved product information or a checkout link. Sending the link does not confirm a purchase."
      },
      {
        "question": "What store access is required?",
        "answer": "Any product, inventory or checkout access needed for the proposed workflow is assessed before launch."
      }
    ],
    "finalTitle": "Let’s talk about your\nincomplete checkout follow-up.",
    "channel": "SMS",
    "preview": {
      "emphasis": [
        "questions holding up a purchase"
      ],
      "context": "Eligible checkout awaiting completion.",
      "messages": [
        {
          "speaker": "AI assistant",
          "text": "I’m the store’s AI assistant. Is there a product question I can help with?"
        },
        {
          "speaker": "Shopper",
          "text": "I need to check whether it will fit."
        },
        {
          "speaker": "AI assistant",
          "text": "I can share the approved dimensions and your checkout link."
        },
        {
          "speaker": "Shopper",
          "text": "Yes, please send them so I can measure."
        }
      ],
      "status": "Product details prepared",
      "detail": "Approved dimensions and checkout link ready to share.",
      "need": "Check the product fits before purchasing.",
      "recorded": "Dimensions and checkout link requested.",
      "owner": "The shopper reviews the information and decides whether to order."
    }
  },
  "/invoice-follow-up": {
    "path": "/invoice-follow-up",
    "audioDemo": {
      "src": "/audio/revomatix/invoice-follow-up-conversation.mp3",
      "duration": 28.11,
      "title": "Overdue invoice follow-up",
      "trigger": "Undisputed invoice remains overdue after written reminders.",
      "transcript": [
        {
          "at": 0.0,
          "speaker": "AI agent",
          "text": "Hi David, this is Bramwell Consulting's AI accounts assistant, following up on invoice four four seven one. It is thirty days overdue. Was there a problem with it?"
        },
        {
          "at": 10.55,
          "speaker": "Customer",
          "text": "No problem. Sorry, it just slipped through."
        },
        {
          "at": 14.31,
          "speaker": "AI agent",
          "text": "I can text you a secure payment link now, or record a payment date. Which works better?"
        },
        {
          "at": 20.55,
          "speaker": "Customer",
          "text": "Send the link. I'll pay it now."
        },
        {
          "at": 22.72,
          "speaker": "AI agent",
          "text": "Thank you. The payment has been received, and the receipt is on its way by email."
        }
      ],
      "stages": [
        "Invoice overdue",
        "Billing contact reached",
        "Secure link sent",
        "Payment received"
      ],
      "stageTimes": [
        0,
        10.55,
        14.31,
        20.55
      ],
      "outcome": {
        "title": "Payment received",
        "detail": "Invoice paid and receipt sent without manual follow-up."
      }
    },
    "sectionCopy": {
      "problem": {
        "eyebrow": "AFTER THE REMINDER",
        "headline": "When written reminders stop working, follow up with a conversation.",
        "body": "The objective is faster cash collection with less routine chasing. Some invoices remain overdue because the contact needs another copy or can only pay in a later run. Revomatix calls about eligible undisputed invoices and records the answer.",
        "emphasis": "Spend less finance-team time chasing routine overdue invoices."
      },
      "workflowEyebrow": "HOW IT WORKS",
      "valueEyebrow": "BUILT FOR FINANCE TEAMS",
      "valueHeadline": "Automate the calls behind routine invoice follow-up.",
      "differentiation": {
        "eyebrow": "BEYOND EMAIL REMINDERS",
        "headline": "Use voice when another automated email is unlikely to help.",
        "body": "Email sequences and collections portals manage written reminders. Revomatix handles the next conversation for eligible undisputed invoices while keeping disputes and account decisions with your finance team.",
        "emphasis": "Start with overdue invoices that need receipt or payment timing confirmed."
      },
      "ctaLabel": "Discuss an invoice follow-up pilot"
    },
    "buyer": "For B2B finance teams and business owners",
    "eyebrow": "Voice AI for overdue invoices",
    "headline": "Follow up overdue invoices",
    "headlineAccent": "with a real conversation.",
    "description": "Automate routine calls about undisputed overdue invoices. An AI voice agent confirms receipt, asks about payment timing, shares the invoice when needed and records the promised next step.",
    "problem": "Written reminders handle many late invoices. Some remain overdue because the invoice was missed, the contact changed or payment is waiting for the next run.",
    "title": "Overdue invoice follow-up | Revomatix",
    "metaDescription": "Automate routine calls about undisputed overdue invoices. An AI voice agent confirms receipt, asks about payment timing, shares the invoice when needed and records the promised next step.",
    "inbound": false,
    "illustrationLabels": [
      "Invoice overdue",
      "Payment contact called",
      "Invoice emailed"
    ],
    "invitation": "Now inviting focused pilot partners.",
    "formHeading": "Let’s look at your overdue invoice follow-up",
    "workflowTitle": "From overdue invoice to recorded payment timing.",
    "workflowName": "Overdue invoice follow-up",
    "outcomeDetail": "Check payment against current finance records.",
    "formIntro": "Explore a focused pilot with your team.",
    "workflow": [
      {
        "title": "Detect the eligible invoice",
        "body": "Identify an undisputed invoice that remains overdue after your normal written reminders."
      },
      {
        "title": "Call the billing contact",
        "body": "The AI voice agent confirms that the invoice reached the correct person."
      },
      {
        "title": "Clarify payment timing",
        "body": "Ask when payment is expected and route any dispute or complex account question to your team."
      },
      {
        "title": "Send and record",
        "body": "Email the invoice or agreed follow-up and record the timing reported by the contact."
      }
    ],
    "example": {
      "title": "An invoice copy for the next payment run.",
      "messages": [
        {
          "speaker": "Accounts payable contact",
          "text": "Please resend the invoice. I need it for our payment run."
        },
        {
          "speaker": "AI assistant",
          "text": "I can email the invoice to your approved address. What payment date should I note for the finance team?"
        }
      ],
      "note": "A short call clarifies the question. An email carries the agreed next step.",
      "confirmation": "Email with the requested invoice copy and a way to contact the finance team."
    },
    "values": [
      {
        "title": "Follow up consistently",
        "body": "Reach eligible overdue accounts without adding every invoice to a finance team call list."
      },
      {
        "title": "Separate routine delays from disputes",
        "body": "Confirm receipt and timing while passing disputed invoices to the person who can resolve them."
      },
      {
        "title": "Return clearer cash information",
        "body": "Record the expected payment step, requested invoice copy or reason further action is needed."
      }
    ],
    "pilot": {
      "title": "Turn routine invoice chasing into clearer payment answers.",
      "description": "Run a focused pilot on undisputed overdue invoices. Measure contacts reached, payment timing recorded and next steps requested.",
      "scope": [
        "A defined group of undisputed overdue invoices",
        "Approved call rules and invoice email follow-up",
        "Recorded timing, requests and human exceptions"
      ],
      "question": "How does your finance team follow up undisputed invoices after written reminders?"
    },
    "faqs": [
      {
        "question": "Does Revomatix handle disputed invoices?",
        "answer": "No. The initial workflow is for undisputed overdue invoices. Any dispute is recorded and passed to your finance team."
      },
      {
        "question": "Can it confirm that an invoice was paid?",
        "answer": "Payment must be confirmed in your accounting records when the required system access is available. A promise or email delivery is not recorded as payment."
      },
      {
        "question": "What can the AI voice agent ask?",
        "answer": "It can confirm receipt, ask about expected payment timing and follow the account rules approved by your team."
      },
      {
        "question": "How is the invoice shared?",
        "answer": "Email can support the call by sending the approved invoice or agreed follow-up to the correct contact."
      },
      {
        "question": "Do we need to replace our accounting software?",
        "answer": "No. The pilot is designed around your existing process, and any required connection is assessed before launch."
      }
    ],
    "finalTitle": "Let’s talk about your\noverdue invoice follow-up.",
    "channel": "Email",
    "preview": {
      "emphasis": [
        "undisputed overdue invoices",
        "less chasing"
      ],
      "context": "Undisputed invoice is overdue.",
      "messages": [
        {
          "speaker": "AI assistant",
          "text": "I’m the AI assistant for the accounts team. Have you received the invoice?"
        },
        {
          "speaker": "Finance contact",
          "text": "Yes, it’s waiting for our next payment run."
        },
        {
          "speaker": "AI assistant",
          "text": "When do you expect that to be?"
        },
        {
          "speaker": "Finance contact",
          "text": "Next week. Please email me another copy."
        }
      ],
      "status": "Payment timing recorded",
      "detail": "Invoice copy requested; expected timing noted.",
      "need": "Another invoice copy for the payment run.",
      "recorded": "Payment expected next week, as reported by the contact.",
      "owner": "Your finance team sends the copy and checks receipt of payment."
    }
  },
  "/moving": {
    "path": "/moving",
    "audioDemo": {
      "src": "/audio/moving-rescheduling-demo.mp3",
      "duration": 35.6,
      "transcript": [
        {
          "at": 0.0,
          "speaker": "AI agent",
          "text": "Hi Alex, this is Revomatix, the AI assistant calling on behalf of your moving company. I'm following up about your estimate. Is there anything you'd like to confirm before booking?"
        },
        {
          "at": 11.36,
          "speaker": "Customer",
          "text": "Yeah, we need to move on Friday instead. Is that available?"
        },
        {
          "at": 15.51,
          "speaker": "AI agent",
          "text": "Yes, Friday is available. I can update your move now. Would you prefer the morning or afternoon?"
        },
        {
          "at": 22.54,
          "speaker": "Customer",
          "text": "The afternoon would work better."
        },
        {
          "at": 24.86,
          "speaker": "AI agent",
          "text": "Perfect. I've rescheduled your move for Friday afternoon and sent the updated confirmation by text. Is there anything else you'd like me to update?"
        },
        {
          "at": 33.98,
          "speaker": "Customer",
          "text": "No, that's everything. Thank you."
        }
      ],
      "stages": [
        "Estimate awaiting response",
        "Availability checked",
        "Move rescheduled"
      ],
      "stageTimes": [
        0,
        11.36,
        24.86
      ],
      "outcome": {
        "title": "Move rescheduled",
        "detail": "Friday afternoon reserved and confirmation sent."
      }
    },
    "sectionCopy": {
      "problem": {
        "eyebrow": "AFTER THE ESTIMATE",
        "headline": "An open estimate is often a conversation waiting to happen.",
        "body": "Some customers are still comparing movers. Others only need to change the date, confirm what is included or understand the next step. Another automated reminder cannot tell the difference. Revomatix calls while the move is still active, identifies the blocker and moves the resolvable opportunities forward.",
        "emphasis": "Less time chasing estimates. More time closing moves."
      },
      "workflowEyebrow": "HOW IT WORKS",
      "valueEyebrow": "BUILT FOR MOVING SALES TEAMS",
      "valueHeadline": "Automate the follow-up your consultants repeat every day.",
      "differentiation": {
        "eyebrow": "NO PLATFORM SWITCH REQUIRED",
        "headline": "Add voice follow-up to the workflow you already use.",
        "body": "Some moving platforms include broad automation features, but replacing your operating system is a major decision. Revomatix is designed as a focused voice layer for the estimate-to-booking moment and to work alongside your existing estimate, calendar and booking workflow.",
        "emphasis": "Start with one high-value workflow: open estimates that still need a decision."
      },
      "ctaLabel": "Discuss a moving pilot"
    },
    "buyer": "For moving companies and sales coordinators",
    "eyebrow": "Voice AI for movers",
    "headline": "Turn unanswered estimates",
    "headlineAccent": "into booked moves.",
    "description": "Automate estimate follow-up with an AI voice agent that calls customers, understands what is holding up the booking and handles the next step. Check availability, book or reschedule the move, and send confirmation without another task for your sales team.",
    "problem": "Some customers are still comparing movers. Others only need to change the date, confirm what is included or understand the next step. Another automated reminder cannot tell the difference.",
    "title": "Moving estimate follow-up | Revomatix",
    "metaDescription": "Automate moving estimate follow-up with an AI voice agent that identifies blockers, checks availability, books or reschedules moves and sends confirmation.",
    "inbound": false,
    "illustrationLabels": [
      "Estimate unanswered",
      "Follow-up call",
      "Callback confirmed by text"
    ],
    "invitation": "Now inviting a small number of moving companies to test the workflow.",
    "formHeading": "Let’s look at your moving estimate follow-up",
    "workflowTitle": "From sent estimate to confirmed move.",
    "workflowName": "Moving estimate follow-up",
    "outcomeDetail": "A callback is not a booked move.",
    "formIntro": "Explore a focused pilot with your team.",
    "workflow": [
      {
        "title": "Detect the open estimate",
        "body": "Identify estimates that have been sent but have not turned into booked moves."
      },
      {
        "title": "Start the conversation",
        "body": "The AI voice agent calls the customer and asks what is holding up the booking."
      },
      {
        "title": "Resolve the next step",
        "body": "Answer approved questions, check availability and update the move date when the connected workflow allows it."
      },
      {
        "title": "Confirm the move",
        "body": "Record the outcome and send the customer their booking details by text or email."
      }
    ],
    "example": {
      "title": "A different date. A consultant callback.",
      "messages": [
        {
          "speaker": "Customer",
          "text": "We may need to move on Friday instead."
        },
        {
          "speaker": "AI assistant",
          "text": "I can ask your moving consultant to check Friday. When would a callback suit you? I can confirm the next step by text."
        }
      ],
      "note": "A short call clarifies the question. A text carries the agreed next step.",
      "confirmation": "Text confirmation of the agreed consultant callback. The team still needs to check date availability."
    },
    "values": [
      {
        "title": "Reach open estimates consistently",
        "body": "Follow up while the customer’s move is still active instead of leaving promising estimates buried in a call list."
      },
      {
        "title": "Handle the common blockers",
        "body": "Identify date, availability, estimate and deposit questions before they turn into lost bookings."
      },
      {
        "title": "Return completed outcomes",
        "body": "Give your team a booked move, a clear next step or a documented reason the customer is not ready."
      }
    ],
    "pilot": {
      "title": "See how many open estimates still have a move behind them.",
      "description": "Run a focused pilot on a defined group of unbooked estimates. Measure conversations reached, blockers identified and moves booked or rescheduled.",
      "scope": [
        "A defined group of unbooked estimates",
        "Approved questions and booking rules",
        "Booked moves, rescheduled moves and unresolved blockers"
      ],
      "question": "How does your team follow up estimates that have not turned into bookings?"
    },
    "faqs": [
      {
        "question": "Does Revomatix replace our moving consultants?",
        "answer": "No. It handles repetitive estimate follow-up and straightforward next steps, then passes exceptions or complex questions to your team."
      },
      {
        "question": "Can it check availability and book the move?",
        "answer": "It can be configured to check approved availability and update the booking when the required calendar or moving-system access is available. The exact workflow is defined during the pilot."
      },
      {
        "question": "What happens when the customer asks something it cannot answer?",
        "answer": "It follows the rules agreed with your team, records the question and routes the conversation to the appropriate person."
      },
      {
        "question": "Does it only make phone calls?",
        "answer": "Voice is the primary channel. Text or email can support the conversation by sending estimates, booking details and confirmations."
      },
      {
        "question": "Do we need to replace our current moving software?",
        "answer": "The pilot is designed around your existing process. Any required connection is assessed before launch."
      }
    ],
    "finalTitle": "Let’s talk about your\nmoving estimate follow-up.",
    "channel": "SMS",
    "preview": {
      "emphasis": [
        "Automate estimate follow-up",
        "less chasing"
      ],
      "context": "Estimate sent; customer has not booked.",
      "messages": [
        {
          "speaker": "AI assistant",
          "text": "Hi Alex, I’m the AI assistant for your moving team. Did you have any questions about the estimate?"
        },
        {
          "speaker": "Customer",
          "text": "We may need to move on Friday instead."
        },
        {
          "speaker": "AI assistant",
          "text": "I can ask your moving consultant to check Friday. Would you like a callback?"
        },
        {
          "speaker": "Customer",
          "text": "Yes, this afternoon would work."
        }
      ],
      "status": "Callback requested",
      "detail": "Preferred time shared with the moving team.",
      "need": "A different moving date.",
      "recorded": "Friday requested; afternoon callback preferred.",
      "owner": "Your moving consultant checks availability and calls back."
    }
  },
  "/restoration": {
    "path": "/restoration",
    "audioDemo": {
      "src": "/audio/revomatix/restoration-conversation.mp3",
      "duration": 27.72,
      "title": "Emergency restoration intake",
      "trigger": "Urgent water-damage call received after hours.",
      "transcript": [
        {
          "at": 0.0,
          "speaker": "AI agent",
          "text": "Hi, this is Coastal Restoration's AI emergency assistant. Are you safe, and is the water still spreading?"
        },
        {
          "at": 7.44,
          "speaker": "Customer",
          "text": "We're safe, but it's coming from upstairs pretty steadily."
        },
        {
          "at": 11.91,
          "speaker": "AI agent",
          "text": "Thank you. I've recorded this as urgent and sent the details to the on-call technician. Please hold while I confirm the response."
        },
        {
          "at": 20.22,
          "speaker": "Customer",
          "text": "Okay, please hurry."
        },
        {
          "at": 22.7,
          "speaker": "AI agent",
          "text": "The technician has accepted the job and will call you shortly with an estimated arrival time."
        }
      ],
      "stages": [
        "Emergency call answered",
        "Urgency recorded",
        "On-call team alerted",
        "Job accepted"
      ],
      "stageTimes": [
        0,
        7.44,
        11.91,
        20.22
      ],
      "outcome": {
        "title": "Technician dispatched",
        "detail": "Urgent loss recorded and accepted by the on-call technician."
      }
    },
    "sectionCopy": {
      "problem": {
        "eyebrow": "WHEN STAFF CANNOT ANSWER",
        "headline": "When damage is spreading, every unanswered minute matters.",
        "body": "Restoration intake is an availability and responsiveness problem. A customer experiencing active damage will often call the next company if nobody answers. Revomatix answers immediately, gathers approved loss details and starts an accountable handoff.",
        "emphasis": "Answer every urgent call, collect the loss details and alert the right person."
      },
      "workflowEyebrow": "HOW IT WORKS",
      "valueEyebrow": "BUILT FOR RESTORATION INTAKE",
      "valueHeadline": "Give on-call teams a clearer first report.",
      "differentiation": {
        "eyebrow": "MORE THAN A MESSAGE",
        "headline": "Apply restoration-specific rules before the handoff.",
        "body": "Traditional answering services can collect a message. Revomatix is designed to follow your restoration intake questions, assess urgency within approved boundaries and alert the correct on-call person with an acknowledgement step.",
        "emphasis": "Start with one defined overflow or after-hours coverage window."
      },
      "ctaLabel": "Discuss an after-hours intake pilot"
    },
    "buyer": "For water, fire and damage-restoration companies",
    "eyebrow": "Voice AI for restoration intake",
    "headline": "Answer urgent restoration calls",
    "headlineAccent": "when your team cannot.",
    "description": "Automate overflow and after-hours intake with an AI voice agent that answers immediately, collects reported loss details, follows approved urgency questions and alerts the correct on-call person.",
    "problem": "A customer experiencing active property damage may call the next company if nobody answers. The first priority is immediate, structured intake and an acknowledged human handoff.",
    "title": "Overflow damage-call intake | Revomatix",
    "metaDescription": "Automate overflow and after-hours intake with an AI voice agent that answers immediately, collects reported loss details, follows approved urgency questions and alerts the correct on-call person.",
    "inbound": true,
    "illustrationLabels": [
      "Overflow call",
      "Loss details collected",
      "On-call team alerted"
    ],
    "invitation": "Now inviting focused pilot partners.",
    "formHeading": "Let’s look at your overflow damage-call intake",
    "workflowTitle": "From unanswered risk to acknowledged on-call handoff.",
    "workflowName": "Overflow damage-call intake",
    "outcomeDetail": "A handoff needs acceptance. An alert is not dispatch.",
    "formIntro": "Explore a focused pilot with your team.",
    "workflow": [
      {
        "title": "Answer immediately",
        "body": "The AI voice agent answers an eligible overflow or after-hours call when staff cannot."
      },
      {
        "title": "Collect the loss details",
        "body": "Capture the caller’s property information and what they report about the water, fire or other damage."
      },
      {
        "title": "Assess urgency",
        "body": "Follow company-approved questions without offering a technical diagnosis or replacing emergency services."
      },
      {
        "title": "Confirm the handoff",
        "body": "Alert the designated on-call person and record acknowledgement under the pilot’s escalation rules."
      }
    ],
    "example": {
      "title": "Details the on-call team can act on.",
      "messages": [
        {
          "speaker": "Caller",
          "text": "A pipe leaked and there is water across the kitchen floor."
        },
        {
          "speaker": "AI assistant",
          "text": "I can take your address and callback number, then send an alert to the on-call team so they can review your report."
        }
      ],
      "note": "An inbound call gathers the essentials. An SMS alert gives the on-call team the details.",
      "confirmation": "SMS alert with the reported water leak, property address and callback number. The on-call contact is asked to acknowledge the handoff."
    },
    "values": [
      {
        "title": "Keep urgent callers from silence",
        "body": "Provide an immediate response during overflow or after-hours periods when office staff cannot answer."
      },
      {
        "title": "Collect useful intake details",
        "body": "Give the on-call person structured property and loss information before they respond."
      },
      {
        "title": "Create an acknowledged handoff",
        "body": "Track whether the alert reached the responsible person without implying that a crew accepted dispatch."
      }
    ],
    "pilot": {
      "title": "See how reliably urgent overflow calls reach the right person.",
      "description": "Run a focused pilot during agreed coverage periods. Measure calls answered, required details captured and handoffs acknowledged.",
      "scope": [
        "Defined overflow or after-hours coverage",
        "Approved restoration intake and urgency questions",
        "On-call alerts with acknowledgement rules"
      ],
      "question": "What happens today when an urgent restoration call arrives and your staff cannot answer?"
    },
    "faqs": [
      {
        "question": "Does Revomatix diagnose the damage?",
        "answer": "No. It collects what the caller reports and follows approved intake questions. Technical assessment stays with restoration professionals."
      },
      {
        "question": "Does an alert mean a crew accepted dispatch?",
        "answer": "No. The workflow records the alert and the agreed acknowledgement. Your team makes dispatch decisions."
      },
      {
        "question": "What happens in an emergency?",
        "answer": "The AI voice agent follows your approved escalation language, including directing callers to emergency services when required."
      },
      {
        "question": "How does the on-call person receive the details?",
        "answer": "The pilot can be configured to send an SMS alert with the approved intake summary and require acknowledgement."
      },
      {
        "question": "Can it work with our current call process?",
        "answer": "The pilot is designed around your existing coverage and escalation rules. Any required phone or system connection is assessed before launch."
      }
    ],
    "finalTitle": "Let’s talk about your\noverflow damage-call intake.",
    "channel": "SMS",
    "preview": {
      "emphasis": [
        "overflow call intake",
        "on-call team"
      ],
      "context": "Inbound overflow damage inquiry.",
      "messages": [
        {
          "speaker": "AI assistant",
          "text": "I’m the AI intake assistant. What damage are you calling about?"
        },
        {
          "speaker": "Caller",
          "text": "A pipe leaked and there’s water across the kitchen floor."
        },
        {
          "speaker": "AI assistant",
          "text": "I can record the property address and callback number for the on-call team."
        },
        {
          "speaker": "Caller",
          "text": "Yes, I’ll give you those details."
        }
      ],
      "status": "On-call alert prepared",
      "detail": "Reported damage and contact details ready for review.",
      "need": "Help with reported water damage.",
      "recorded": "Reported leak, property details and callback number.",
      "owner": "The on-call contact reviews and acknowledges the request."
    }
  },
  "/commercial-contractors": {
    "path": "/commercial-contractors",
    "audioDemo": {
      "src": "/audio/revomatix/commercial-contractors-conversation.mp3",
      "duration": 34.19,
      "title": "Repair proposal follow-up",
      "trigger": "Commercial repair proposal remains unanswered.",
      "transcript": [
        {
          "at": 0.0,
          "speaker": "AI agent",
          "text": "Hi Peter, this is the AI assistant for your commercial service team, following up on the rooftop heating and cooling repair proposal for building C. Do you have any questions?"
        },
        {
          "at": 11.91,
          "speaker": "Customer",
          "text": "I saw it, but I've been buried. Can you remind me of the total?"
        },
        {
          "at": 17.34,
          "speaker": "AI agent",
          "text": "The approved proposal is four thousand two hundred dollars. Thursday is available. Should I record your approval and reserve that slot?"
        },
        {
          "at": 27.34,
          "speaker": "Customer",
          "text": "Yes, let's go ahead with Thursday."
        },
        {
          "at": 30.13,
          "speaker": "AI agent",
          "text": "The work is approved and scheduled for Thursday. I've emailed the confirmation."
        }
      ],
      "stages": [
        "Proposal unanswered",
        "Decision-maker reached",
        "Approval recorded",
        "Work scheduled"
      ],
      "stageTimes": [
        0,
        11.91,
        17.34,
        27.34
      ],
      "outcome": {
        "title": "Work approved and scheduled",
        "detail": "Thursday reserved and confirmation emailed."
      }
    },
    "sectionCopy": {
      "problem": {
        "eyebrow": "AFTER THE PROPOSAL",
        "headline": "An unanswered proposal costs more than the job it delays.",
        "body": "Open repair proposals put revenue at risk and consume account-manager time that could go to active customers and new work. The customer may only need a question answered or an internal approval moved forward. Revomatix identifies that blocker.",
        "emphasis": "Automate routine proposal chasing and return a decision your account manager can act on."
      },
      "workflowEyebrow": "HOW IT WORKS",
      "valueEyebrow": "BUILT FOR COMMERCIAL SERVICE TEAMS",
      "valueHeadline": "Move issued repair proposals toward a decision.",
      "differentiation": {
        "eyebrow": "NO PLATFORM REPLACEMENT",
        "headline": "Add focused voice follow-up to your proposal workflow.",
        "body": "Revomatix is designed as a proposal-follow-up layer that can work alongside existing field-service software. It handles the conversation around the open decision without replacing the operating platform.",
        "emphasis": "Start with issued repair proposals that still need approval or a clear next action."
      },
      "ctaLabel": "Discuss a proposal-recovery pilot"
    },
    "buyer": "For commercial service contractors and account teams",
    "eyebrow": "Voice AI for repair proposals",
    "headline": "Turn open repair proposals",
    "headlineAccent": "into clear decisions.",
    "description": "Automate follow-up after a commercial repair proposal is issued. An AI voice agent reaches the decision-maker, identifies the approval blocker and records a decision or useful next step.",
    "problem": "An unanswered repair proposal puts revenue at risk and consumes account-manager time. The customer may need a technical answer, internal approval or a revised next step before deciding.",
    "title": "Open repair proposal follow-up | Revomatix",
    "metaDescription": "Automate follow-up after a commercial repair proposal is issued. An AI voice agent reaches the decision-maker, identifies the approval blocker and records a decision or useful next step.",
    "inbound": false,
    "illustrationLabels": [
      "Proposal awaiting approval",
      "Proposal follow-up call",
      "Next step emailed"
    ],
    "invitation": "Now inviting focused pilot partners.",
    "formHeading": "Let’s look at your open repair proposal follow-up",
    "workflowTitle": "From open repair proposal to an actionable decision.",
    "workflowName": "Open repair proposal follow-up",
    "outcomeDetail": "Approval follows your formal authorization process.",
    "formIntro": "Explore a focused pilot with your team.",
    "workflow": [
      {
        "title": "Detect the open proposal",
        "body": "Identify a repair or maintenance proposal that has been issued but remains undecided."
      },
      {
        "title": "Reach the decision-maker",
        "body": "The AI voice agent contacts the appropriate customer under the agreed follow-up rules."
      },
      {
        "title": "Identify the approval step",
        "body": "Clarify the question, internal approval or timing issue holding up the decision."
      },
      {
        "title": "Record the outcome",
        "body": "Capture approval, decline or the next action and send the proposal or confirmation by email when requested."
      }
    ],
    "example": {
      "title": "The proposal needs purchasing review.",
      "messages": [
        {
          "speaker": "Facility contact",
          "text": "Our purchasing manager needs to review the proposal."
        },
        {
          "speaker": "AI assistant",
          "text": "I can note that for your service manager, email the proposal to the agreed contact, and arrange the next follow-up."
        }
      ],
      "note": "A short call clarifies the question. An email carries the agreed next step.",
      "confirmation": "Email sharing the issued proposal for purchasing review. Scope and price questions go to the service manager."
    },
    "values": [
      {
        "title": "Follow up open proposals consistently",
        "body": "Keep issued repair work visible without filling account managers’ days with routine calls."
      },
      {
        "title": "Surface the approval blocker",
        "body": "Find whether the customer needs information, internal authorization or a different timing discussion."
      },
      {
        "title": "Return a decision the team can use",
        "body": "Record approval, decline or a specific next action for the responsible account manager."
      }
    ],
    "pilot": {
      "title": "Find which open proposals are still waiting on a resolvable step.",
      "description": "Run a focused pilot on issued repair proposals. Measure decision-makers reached, blockers identified and approvals, declines or next actions recorded.",
      "scope": [
        "A defined group of open repair proposals",
        "Approved commercial answers and escalation rules",
        "Decisions, questions and next actions recorded"
      ],
      "question": "How does your team follow up repair proposals that remain open?"
    },
    "faqs": [
      {
        "question": "Does Revomatix replace our account managers?",
        "answer": "No. It handles routine proposal follow-up and returns technical questions or exceptions to the appropriate person."
      },
      {
        "question": "Can it approve pricing or change a proposal?",
        "answer": "No. It only uses proposal information and rules approved by your team. Pricing and technical decisions stay with your staff."
      },
      {
        "question": "What outcomes can it record?",
        "answer": "It can record an approval, decline, question or agreed next action. The exact permitted workflow is defined during the pilot."
      },
      {
        "question": "How is the proposal shared?",
        "answer": "Email can support the voice conversation by sending the approved proposal or confirming the agreed next step."
      },
      {
        "question": "Do we need to replace our field-service software?",
        "answer": "No. Revomatix is designed to work alongside the existing process. Any required pilot connection is assessed before launch."
      }
    ],
    "finalTitle": "Let’s talk about your\nopen repair proposal follow-up.",
    "channel": "Email",
    "preview": {
      "emphasis": [
        "open repair proposals"
      ],
      "context": "Repair proposal awaiting a decision.",
      "messages": [
        {
          "speaker": "AI assistant",
          "text": "I’m the AI assistant for the service team. Is anything holding up the repair proposal?"
        },
        {
          "speaker": "Customer",
          "text": "Purchasing needs to review it first."
        },
        {
          "speaker": "AI assistant",
          "text": "Would it help if I shared the issued proposal for their review?"
        },
        {
          "speaker": "Customer",
          "text": "Yes, please send it over."
        }
      ],
      "status": "Proposal copy requested",
      "detail": "Purchasing review noted for the service team.",
      "need": "Purchasing needs the issued proposal.",
      "recorded": "Internal approval is pending; proposal copy requested.",
      "owner": "Your service team shares the proposal and handles scope questions."
    }
  },
  "/distributors": {
    "path": "/distributors",
    "audioDemo": {
      "src": "/audio/revomatix/distributors-conversation.mp3",
      "duration": 30.04,
      "title": "Distributor quote follow-up",
      "trigger": "Quote sent; buyer has not placed the order.",
      "transcript": [
        {
          "at": 0.0,
          "speaker": "AI agent",
          "text": "Hi Tom, this is your distributor's AI sales assistant, following up on the quote for two hundred three-inch fittings. Is anything holding up the order?"
        },
        {
          "at": 9.93,
          "speaker": "Customer",
          "text": "Is there a discount if we increase it to three hundred units?"
        },
        {
          "at": 13.85,
          "speaker": "AI agent",
          "text": "Yes. Your approved tier-two price is eight percent lower at three hundred units. Should I update the quantity and place the order?"
        },
        {
          "at": 22.89,
          "speaker": "Customer",
          "text": "Yes, let's do that."
        },
        {
          "at": 25.21,
          "speaker": "AI agent",
          "text": "The order for three hundred units is confirmed. I've emailed the updated order summary."
        }
      ],
      "stages": [
        "Quote unanswered",
        "Buyer reached",
        "Pricing question resolved",
        "Order confirmed"
      ],
      "stageTimes": [
        0,
        9.93,
        13.85,
        22.89
      ],
      "outcome": {
        "title": "Order confirmed",
        "detail": "Quantity updated to 300 units and order summary sent."
      }
    },
    "sectionCopy": {
      "problem": {
        "eyebrow": "AFTER THE QUOTE",
        "headline": "A silent quote can still become an order.",
        "body": "An unanswered quote does not always mean rejection. The buyer may be waiting on internal approval, availability, specification details or a purchase order. They may also order from the supplier that follows up first.",
        "emphasis": "Find the blocker before the buyer places the order somewhere else."
      },
      "workflowEyebrow": "HOW IT WORKS",
      "valueEyebrow": "BUILT FOR INSIDE SALES",
      "valueHeadline": "Give representatives less quote chasing to do.",
      "differentiation": {
        "eyebrow": "NO SYSTEM SWITCH REQUIRED",
        "headline": "Add a voice conversation to your existing quote process.",
        "body": "Revomatix is designed for fast conversational follow-up without replacing your quoting or order-management software. It focuses on the buyer response your inside-sales team needs to act.",
        "emphasis": "Start with open quotes where a timely answer still matters."
      },
      "ctaLabel": "Discuss a quote-follow-up pilot"
    },
    "buyer": "For established distributors, quote desks and inside sales",
    "eyebrow": "Voice AI for open quotes",
    "headline": "Turn silent quotes",
    "headlineAccent": "into clear next steps.",
    "description": "Automate follow-up on open quotes with an AI voice agent that reaches the buyer, identifies the commercial or operational blocker and records the order decision or next action.",
    "problem": "An unanswered quote does not always mean rejection. The buyer may be waiting on internal approval, specification details, availability or a purchase order.",
    "title": "Open quote follow-up | Revomatix",
    "metaDescription": "Automate follow-up on open quotes with an AI voice agent that reaches the buyer, identifies the commercial or operational blocker and records the order decision or next action.",
    "inbound": false,
    "illustrationLabels": [
      "Quote still open",
      "Buyer follow-up call",
      "Quote follow-up emailed"
    ],
    "invitation": "Now inviting focused pilot partners.",
    "formHeading": "Let’s look at your open quote follow-up",
    "workflowTitle": "From open quote to order decision or next action.",
    "workflowName": "Open quote follow-up",
    "outcomeDetail": "A buyer’s response is not an accepted order.",
    "formIntro": "Explore a focused pilot with your team.",
    "workflow": [
      {
        "title": "Detect the open quote",
        "body": "Identify an issued quote where the buyer has not ordered or explained the next step."
      },
      {
        "title": "Call the buyer",
        "body": "The AI voice agent contacts the approved buyer and asks what is holding up the order."
      },
      {
        "title": "Identify the blocker",
        "body": "Clarify whether price, availability, specification, approval or a purchase order is involved."
      },
      {
        "title": "Confirm the next action",
        "body": "Record the order decision or follow-up and email the quote or approved details when requested."
      }
    ],
    "example": {
      "title": "A purchase order is waiting on approval.",
      "messages": [
        {
          "speaker": "Buyer",
          "text": "We are waiting for our project manager’s approval before sending the purchase order (PO)."
        },
        {
          "speaker": "AI assistant",
          "text": "I can note that for your rep and confirm your response by email. When would it make sense to follow up?"
        }
      ],
      "note": "A short call clarifies the question. An email carries the agreed next step.",
      "confirmation": "Email confirming that the purchase order is awaiting project approval and noting the agreed follow-up."
    },
    "values": [
      {
        "title": "Keep quote follow-up consistent",
        "body": "Reach buyers while the requirement is active instead of leaving quotes buried in an inside-sales queue."
      },
      {
        "title": "Find the buying blocker",
        "body": "Understand whether the buyer needs approval, product information, availability or another commercial step."
      },
      {
        "title": "Return an actionable response",
        "body": "Give the representative an order decision, a specific follow-up or a documented reason the quote is paused."
      }
    ],
    "pilot": {
      "title": "See which open quotes still have an order behind them.",
      "description": "Run a focused pilot on a defined group of issued quotes. Measure buyers reached, blockers identified and order decisions or next actions recorded.",
      "scope": [
        "A defined group of open customer quotes",
        "Approved quote information and contact rules",
        "Orders, declines and next actions recorded"
      ],
      "question": "How does your inside-sales team follow up quotes that receive no response?"
    },
    "faqs": [
      {
        "question": "Does Revomatix replace our inside-sales team?",
        "answer": "No. It handles routine quote follow-up and returns commercial, specification or relationship questions to the appropriate representative."
      },
      {
        "question": "Can it change price or promise availability?",
        "answer": "No. It uses only approved quote and availability information. Any exception or negotiation stays with your team."
      },
      {
        "question": "Can it place the order?",
        "answer": "It can record or complete approved order steps when the required system access is available. The exact workflow is defined during the pilot."
      },
      {
        "question": "How is the quote shared?",
        "answer": "Email can support the voice call by sending the approved quote or confirming the buyer’s stated next step."
      },
      {
        "question": "Do we need to replace our quoting software?",
        "answer": "No. The pilot is designed around your current quote process, and any required connection is assessed before launch."
      }
    ],
    "finalTitle": "Let’s talk about your\nopen quote follow-up.",
    "channel": "Email",
    "preview": {
      "emphasis": [
        "less quote chasing"
      ],
      "context": "Open quote awaiting buyer response.",
      "messages": [
        {
          "speaker": "AI assistant",
          "text": "I’m the AI assistant for your supplier. Are you ready to revisit the open quote?"
        },
        {
          "speaker": "Buyer",
          "text": "We’re waiting for the project to be approved."
        },
        {
          "speaker": "AI assistant",
          "text": "Would you like your rep to follow up next week?"
        },
        {
          "speaker": "Buyer",
          "text": "Yes, that would be useful."
        }
      ],
      "status": "Follow-up requested",
      "detail": "Project approval pending; next week preferred.",
      "need": "More time for project approval.",
      "recorded": "Quote remains open; next-week follow-up requested.",
      "owner": "The inside sales rep follows up with the buyer."
    }
  },
  "/medspa": {
    "path": "/medspa",
    "audioDemo": {
      "src": "/audio/revomatix/medspa-conversation.mp3",
      "duration": 26.67,
      "title": "Consultation no-show recovery",
      "trigger": "Prospect missed a scheduled consultation.",
      "transcript": [
        {
          "at": 0.0,
          "speaker": "AI agent",
          "text": "Hi Jason, this is Radiance Aesthetics' AI scheduling assistant. We missed you at today's consultation. Would you like to find another time?"
        },
        {
          "at": 8.72,
          "speaker": "Customer",
          "text": "Sorry, I completely forgot. Work has been crazy."
        },
        {
          "at": 13.03,
          "speaker": "AI agent",
          "text": "No problem. I can offer tomorrow at noon or Thursday at four."
        },
        {
          "at": 17.42,
          "speaker": "Customer",
          "text": "Thursday at four works."
        },
        {
          "at": 19.9,
          "speaker": "AI agent",
          "text": "Your consultation is rebooked for Thursday at four. I've sent a confirmation and reminder by text."
        }
      ],
      "stages": [
        "Consultation missed",
        "Prospect reached",
        "Availability checked",
        "Consultation rebooked"
      ],
      "stageTimes": [
        0,
        8.72,
        13.03,
        17.42
      ],
      "outcome": {
        "title": "Consultation rebooked",
        "detail": "Thursday at 4pm confirmed and reminder scheduled."
      }
    },
    "sectionCopy": {
      "problem": {
        "eyebrow": "AFTER THE NO-SHOW",
        "headline": "A missed consultation should not end the treatment journey.",
        "body": "The practice discovers the missed visit only after provider capacity has gone unused. Some prospects are still considering treatment and only need another time. Revomatix starts a discreet rescheduling conversation while their interest is still active.",
        "emphasis": "Recover high-intent consultations while the prospect is still considering treatment."
      },
      "workflowEyebrow": "HOW IT WORKS",
      "valueEyebrow": "BUILT FOR CONSULTATION TEAMS",
      "valueHeadline": "Recover missed consultations with less front-desk chasing.",
      "differentiation": {
        "eyebrow": "AFTER THE REMINDER",
        "headline": "Handle the recovery workflow after the prospect misses the visit.",
        "body": "Booking platforms and reminders act before an appointment. Revomatix focuses on the post-no-show voice conversation, approved rescheduling and discreet confirmation.",
        "emphasis": "Start with one narrow workflow: missed initial consultations."
      },
      "ctaLabel": "Discuss a medspa pilot"
    },
    "buyer": "For multi-provider medspas and aesthetics clinics",
    "eyebrow": "Voice AI for missed consultations",
    "headline": "Bring missed consultations",
    "headlineAccent": "back to the calendar.",
    "description": "Automate follow-up after a prospect misses an initial consultation. An AI voice agent offers another approved time, rebooks the visit and sends discreet confirmation without providing clinical advice.",
    "problem": "The practice learns about a missed consultation only after provider capacity has gone unused. Prompt follow-up can recover prospects who still intend to discuss treatment but need another time.",
    "title": "Missed consultation follow-up | Revomatix",
    "metaDescription": "Automate follow-up after a prospect misses an initial consultation. An AI voice agent offers another approved time, rebooks the visit and sends discreet confirmation without providing clinical advice.",
    "inbound": false,
    "illustrationLabels": [
      "Consultation missed",
      "Rescheduling call",
      "Appointment details texted"
    ],
    "invitation": "Now inviting focused pilot partners.",
    "formHeading": "Let’s look at your missed consultation follow-up",
    "workflowTitle": "From missed consultation to another approved appointment.",
    "workflowName": "Missed consultation follow-up",
    "outcomeDetail": "Track attendance after the consultation.",
    "formIntro": "Explore a focused pilot with your team.",
    "workflow": [
      {
        "title": "Detect the consultation no-show",
        "body": "Identify a prospect who missed a booked initial consultation for an eligible treatment."
      },
      {
        "title": "Call the prospect",
        "body": "The AI voice agent follows up discreetly and asks whether they would like another appointment."
      },
      {
        "title": "Offer approved availability",
        "body": "Present suitable consultation times when the required scheduling access is available."
      },
      {
        "title": "Rebook and confirm",
        "body": "Record the new appointment and send discreet confirmation with the approved details."
      }
    ],
    "example": {
      "title": "Another consultation. A clear next step.",
      "messages": [
        {
          "speaker": "Patient",
          "text": "I could not make the appointment. Can I arrange another consultation?"
        },
        {
          "speaker": "AI assistant",
          "text": "I can help rearrange the consultation and text you the appointment details. Your clinic team will handle any treatment questions."
        }
      ],
      "note": "A short call clarifies the question. A text carries the agreed next step.",
      "confirmation": "Discreet text with the rearranged appointment details and clinic contact information."
    },
    "values": [
      {
        "title": "Follow up while interest remains high",
        "body": "Reconnect promptly with prospects who were already interested enough to book a consultation."
      },
      {
        "title": "Reduce repetitive front-desk calls",
        "body": "Handle straightforward rescheduling while clinic staff focus on people already in the practice."
      },
      {
        "title": "Return a clear appointment outcome",
        "body": "Give the team a rebooked consultation, a requested callback or a documented reason to pause."
      }
    ],
    "pilot": {
      "title": "See how many missed consultations can return to the calendar.",
      "description": "Run a focused pilot on eligible initial consultation no-shows. Measure prospects reached, appointments rebooked and outcomes recorded.",
      "scope": [
        "A defined group of missed initial consultations",
        "Approved availability, privacy and contact rules",
        "Rebooked appointments and human handoffs"
      ],
      "question": "How does your front desk follow up missed initial consultations?"
    },
    "faqs": [
      {
        "question": "Does Revomatix provide clinical advice?",
        "answer": "No. It handles approved scheduling information only. Treatment suitability, risks and clinical questions stay with qualified clinic staff."
      },
      {
        "question": "Can it see available consultation times?",
        "answer": "It can offer approved times when the required scheduling access is available. The exact booking workflow is agreed during the pilot."
      },
      {
        "question": "What happens when a prospect asks about treatment?",
        "answer": "The AI voice agent records the question and routes it to the appropriate clinic professional."
      },
      {
        "question": "How is the appointment confirmed?",
        "answer": "A discreet message can support the call by sharing only the approved appointment information."
      },
      {
        "question": "Does this cover all front-desk calls?",
        "answer": "No. The initial pilot stays focused on follow-up after missed initial consultations."
      }
    ],
    "finalTitle": "Let’s talk about your\nmissed consultation follow-up.",
    "channel": "SMS",
    "preview": {
      "emphasis": [
        "missed consultations"
      ],
      "context": "Missed consultation; follow-up agreed.",
      "messages": [
        {
          "speaker": "AI assistant",
          "text": "I’m the clinic’s AI assistant. Would you like help rearranging your consultation?"
        },
        {
          "speaker": "Patient",
          "text": "Yes, an afternoon would be better."
        },
        {
          "speaker": "AI assistant",
          "text": "May the front desk contact you with an afternoon option?"
        },
        {
          "speaker": "Patient",
          "text": "Yes, please send the appointment details once confirmed."
        }
      ],
      "status": "Rescheduling requested",
      "detail": "Afternoon preference shared discreetly with the front desk.",
      "need": "An afternoon consultation.",
      "recorded": "Scheduling preference and request for discreet details.",
      "owner": "The front desk confirms the appointment; clinical questions stay with clinicians."
    }
  },
  "/auto-repair": {
    "path": "/auto-repair",
    "audioDemo": {
      "src": "/audio/revomatix/auto-repair-conversation.mp3",
      "duration": 35.87,
      "title": "Declined repair follow-up",
      "trigger": "Quoted brake repair was postponed.",
      "transcript": [
        {
          "at": 0.0,
          "speaker": "AI agent",
          "text": "Hi Mike, this is Crestline Auto's AI service assistant, following up on the brake repair quoted last week. Is cost or timing holding it up?"
        },
        {
          "at": 9.59,
          "speaker": "Customer",
          "text": "Honestly, I wasn't sure I could afford it right now."
        },
        {
          "at": 12.96,
          "speaker": "AI agent",
          "text": "Crestline offers a three-month payment option, subject to approval. I can text you the secure application link."
        },
        {
          "at": 20.17,
          "speaker": "Customer",
          "text": "I just completed it and got approved. Can I come in Friday?"
        },
        {
          "at": 24.17,
          "speaker": "AI agent",
          "text": "Yes. I have ten in the morning available on Friday. Should I book it?"
        },
        {
          "at": 29.13,
          "speaker": "Customer",
          "text": "Yes, that works."
        },
        {
          "at": 30.8,
          "speaker": "AI agent",
          "text": "Your brake repair is booked for Friday at ten. I've sent the appointment confirmation by text."
        }
      ],
      "stages": [
        "Repair postponed",
        "Customer reached",
        "Cost blocker resolved",
        "Repair booked"
      ],
      "stageTimes": [
        0,
        9.59,
        12.96,
        29.13
      ],
      "outcome": {
        "title": "Repair booked",
        "detail": "Friday at 10am confirmed after the payment option was approved."
      }
    },
    "sectionCopy": {
      "problem": {
        "eyebrow": "AFTER THE DECLINE",
        "headline": "Declined work is often delayed work.",
        "body": "Many customers who decline a repair mean “not right now.” The shop has already inspected the vehicle and explained the work, but without structured follow-up the repair may never return. Revomatix checks when the customer is ready to revisit it.",
        "emphasis": "Bring postponed repairs back without filling your service advisors’ call lists."
      },
      "workflowEyebrow": "HOW IT WORKS",
      "valueEyebrow": "BUILT FOR SERVICE ADVISORS",
      "valueHeadline": "Follow up deferred repairs without another manual call list.",
      "differentiation": {
        "eyebrow": "TURN RECORDS INTO ACTION",
        "headline": "Add the conversation after declined work is recorded.",
        "body": "Shop-management systems can record declined work while leaving the service advisor responsible for repeated follow-up. Revomatix is designed as the conversational action layer around that existing record.",
        "emphasis": "Start with previously inspected and quoted repairs that customers postponed."
      },
      "ctaLabel": "Discuss a declined-work pilot"
    },
    "buyer": "For independent and regional auto-repair shops",
    "eyebrow": "Voice AI for declined repair work",
    "headline": "Bring declined repair work",
    "headlineAccent": "back when customers are ready.",
    "description": "Automate follow-up on declined or deferred repairs. An AI voice agent asks whether timing or cost delayed the work and helps schedule the approved repair when the customer is ready.",
    "problem": "Many declined repairs mean “not right now.” Without structured follow-up, previously inspected and quoted work may never return to the shop.",
    "title": "Declined repair follow-up | Revomatix",
    "metaDescription": "Automate follow-up on declined or deferred repairs. An AI voice agent asks whether timing or cost delayed the work and helps schedule the approved repair when the customer is ready.",
    "inbound": false,
    "illustrationLabels": [
      "Repair deferred",
      "Repair follow-up call",
      "Advisor callback texted"
    ],
    "invitation": "Now inviting focused pilot partners.",
    "formHeading": "Let’s look at your declined repair follow-up",
    "workflowTitle": "From declined work to a scheduled repair or clear follow-up.",
    "workflowName": "Declined repair follow-up",
    "outcomeDetail": "A callback or visit is not completed repair work.",
    "formIntro": "Explore a focused pilot with your team.",
    "workflow": [
      {
        "title": "Detect eligible declined work",
        "body": "Identify a previously inspected and quoted repair that the customer declined or postponed."
      },
      {
        "title": "Call at the right time",
        "body": "The AI voice agent follows up under the timing and contact rules approved by the shop."
      },
      {
        "title": "Identify the concern",
        "body": "Clarify whether cost, timing or another approved issue is keeping the customer from scheduling."
      },
      {
        "title": "Schedule or record",
        "body": "Arrange the repair when approved scheduling access is available, or record the next follow-up for an advisor."
      }
    ],
    "example": {
      "title": "An estimate to review before a return visit.",
      "messages": [
        {
          "speaker": "Customer",
          "text": "I might do that work now, but is the estimate still current?"
        },
        {
          "speaker": "AI assistant",
          "text": "I can ask your service advisor to review the estimate and call you back, then confirm the callback details by text."
        }
      ],
      "note": "A short call clarifies the question. A text carries the agreed next step.",
      "confirmation": "Text confirmation of the agreed service-advisor callback to review the earlier estimate."
    },
    "values": [
      {
        "title": "Keep deferred work visible",
        "body": "Follow up at an appropriate time instead of allowing previously quoted repairs to disappear from the shop’s pipeline."
      },
      {
        "title": "Understand why the work was delayed",
        "body": "Separate timing and cost concerns from questions that need a service advisor’s judgment."
      },
      {
        "title": "Return a practical outcome",
        "body": "Give the advisor a scheduled repair, a requested callback or a clear date for the next follow-up."
      }
    ],
    "pilot": {
      "title": "See which postponed repairs are ready to return.",
      "description": "Run a focused pilot on eligible declined or deferred work. Measure customers reached, concerns identified and repairs scheduled or assigned a next step.",
      "scope": [
        "A defined group of previously quoted repairs",
        "Shop-approved recommendations and contact rules",
        "Scheduled work, callbacks and future follow-ups"
      ],
      "question": "How do your service advisors follow up repairs that customers decline or postpone?"
    },
    "faqs": [
      {
        "question": "Does Revomatix diagnose vehicles or recommend new repairs?",
        "answer": "No. It uses only recommendations previously inspected and approved by your shop. Mechanical questions go to a service advisor."
      },
      {
        "question": "Can it schedule the repair?",
        "answer": "It can offer approved times and schedule when the required shop-calendar access is available. The exact workflow is defined during the pilot."
      },
      {
        "question": "Can it negotiate the repair price?",
        "answer": "No. It can record a cost concern, but pricing decisions and technical advice remain with your team."
      },
      {
        "question": "How is the next step confirmed?",
        "answer": "Text can support the call by confirming an approved appointment or advisor callback."
      },
      {
        "question": "Do we need to replace our shop-management system?",
        "answer": "No. Revomatix is designed as a follow-up layer around your existing process. Any required connection is assessed before launch."
      }
    ],
    "finalTitle": "Let’s talk about your\ndeclined repair follow-up.",
    "channel": "SMS",
    "preview": {
      "emphasis": [
        "declined and deferred repairs"
      ],
      "context": "Previously deferred repair estimate.",
      "messages": [
        {
          "speaker": "AI assistant",
          "text": "I’m the workshop’s AI assistant. Would you like to revisit the repair work discussed earlier?"
        },
        {
          "speaker": "Customer",
          "text": "Possibly. I’d like to review the estimate first."
        },
        {
          "speaker": "AI assistant",
          "text": "Would you like a callback from your service advisor?"
        },
        {
          "speaker": "Customer",
          "text": "Yes, tomorrow morning would suit me."
        }
      ],
      "status": "Advisor callback requested",
      "detail": "Preferred callback time recorded for the workshop.",
      "need": "Review the earlier repair estimate.",
      "recorded": "Tomorrow morning preferred for an advisor callback.",
      "owner": "Your service advisor reviews the work and answers technical questions."
    }
  }
}
