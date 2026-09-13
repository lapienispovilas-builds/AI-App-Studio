export const voiceBrand = { name: 'Voice AI' }
export const voicePaths = ['/saas-payment-recovery', '/demo-recovery', '/fitness', '/ecommerce', '/invoice-follow-up', '/moving', '/restoration', '/commercial-contractors', '/distributors', '/medspa', '/auto-repair'] as const
export interface VoicePageConfig {
  path: typeof voicePaths[number]
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
    "buyer": "For billing and customer operations teams",
    "eyebrow": "Voice AI for subscription billing",
    "headline": "Follow up unresolved",
    "headlineAccent": "subscription payments.",
    "description": "Automate follow-up on payments that retries and reminders have not resolved. A voice agent reaches the billing contact and shares the secure update link, reducing manual work for your team.",
    "problem": "Some payment failures need more than another retry. A billing contact may need to update a payment method or pass the request to finance. Focus the follow-up on accounts still waiting for that action.",
    "title": "Subscription payment follow-up | Voice AI",
    "metaDescription": "Automate follow-up on payments that retries and reminders have not resolved. A voice agent reaches the billing contact and shares the secure update link, reducing manual work for your team.",
    "inbound": false,
    "illustrationLabels": [
      "Payment unresolved",
      "Billing contact reached",
      "Secure link emailed"
    ],
    "invitation": "Now inviting focused pilot partners.",
    "formHeading": "Let’s look at your subscription payment follow-up",
    "workflowTitle": "Reach accounts that still need customer action.",
    "workflowName": "Subscription payment follow-up",
    "outcomeDetail": "Confirm payment from billing records.",
    "formIntro": "Explore a focused pilot with your team.",
    "workflow": [
      {
        "title": "Find unresolved payments",
        "body": "Select accounts needing customer action after retries and reminders, before any actual suspension deadline."
      },
      {
        "title": "Call the billing contact",
        "body": "Clarify the action needed under your recovery policy. Route account questions to your team."
      },
      {
        "title": "Email the secure link",
        "body": "Send the approved payment-update link to the billing address. Confirm settlement in billing records, not from link delivery."
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
        "title": "Less manual billing follow-up.",
        "body": ""
      },
      {
        "title": "A clearer next step for unresolved accounts.",
        "body": ""
      },
      {
        "title": "Recovery measured against your current retries and reminders.",
        "body": ""
      }
    ],
    "pilot": {
      "title": "Start with your subscription payment follow-up.",
      "description": "We’re inviting billing and customer operations teams to test one focused workflow. We’ll agree the call process, email follow-up and human handoff before the pilot starts.",
      "scope": [
        "Subscription payment follow-up",
        "Approved email follow-ups",
        "Human handoff with the conversation context"
      ],
      "question": "What happens today when retries and payment emails do not resolve an account?"
    },
    "faqs": [
      {
        "question": "Does this replace payment retries?",
        "answer": "No. The pilot focuses on unresolved accounts that still need customer action."
      },
      {
        "question": "Will the agent take card details?",
        "answer": "Customers use your approved secure payment-update page. The proposed call does not collect card numbers."
      },
      {
        "question": "How will recovered payments be measured?",
        "answer": "We agree how to confirm payment in your billing records and compare outcomes with your existing process."
      },
      {
        "question": "How is the payment link sent?",
        "answer": "The proposed pilot uses email to the approved billing address. We agree the sender, link and contact rules during setup. Email delivery does not confirm payment."
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
    "buyer": "For software sales teams",
    "eyebrow": "Voice AI for software sales",
    "headline": "Get missed demos",
    "headlineAccent": "back on the calendar.",
    "description": "Take demo no-shows off your reps’ follow-up lists. A voice agent reconnects with interested prospects, helps reschedule and sends confirmation, giving your team more time for sales conversations.",
    "problem": "The prospect booked a demo but did not attend. Your rep now has another round of calls and emails to manage. Follow up on that existing interest without restarting the entire sales process.",
    "title": "Missed demo follow-up | Voice AI",
    "metaDescription": "Take demo no-shows off your reps’ follow-up lists. A voice agent reconnects with interested prospects, helps reschedule and sends confirmation, giving your team more time for sales conversations.",
    "inbound": false,
    "illustrationLabels": [
      "Demo missed",
      "Rescheduling call",
      "Meeting details emailed"
    ],
    "invitation": "Now inviting focused pilot partners.",
    "formHeading": "Let’s look at your missed demo follow-up",
    "workflowTitle": "Reconnect after a missed demo.",
    "workflowName": "Missed demo follow-up",
    "outcomeDetail": "Track attended demos, not bookings alone.",
    "formIntro": "Explore a focused pilot with your team.",
    "workflow": [
      {
        "title": "Check the missed demo",
        "body": "Select confirmed no-shows. Exclude canceled, rearranged or actively handled meetings."
      },
      {
        "title": "Call to rearrange",
        "body": "Confirm interest and find another time with the right rep, respecting account ownership."
      },
      {
        "title": "Email the meeting details",
        "body": "Confirm the new meeting through the agreed booking process. Track whether the prospect attends."
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
        "title": "Less manual rescheduling for sales reps.",
        "body": ""
      },
      {
        "title": "Account ownership stays clear.",
        "body": ""
      },
      {
        "title": "Measure attended demos rather than calendar bookings alone.",
        "body": ""
      }
    ],
    "pilot": {
      "title": "Start with your missed demo follow-up.",
      "description": "We’re inviting software sales teams to test one focused workflow. We’ll agree the call process, email follow-up and human handoff before the pilot starts.",
      "scope": [
        "Missed demo follow-up",
        "Approved email follow-ups",
        "Human handoff with the conversation context"
      ],
      "question": "Who follows up when a qualified prospect misses a demo?"
    },
    "faqs": [
      {
        "question": "Is this cold outreach?",
        "answer": "The proposed workflow starts with prospects who already booked a demo."
      },
      {
        "question": "Will it interfere with our account executives?",
        "answer": "We agree account ownership and stop rules before contacting prospects."
      },
      {
        "question": "Can it answer technical product questions?",
        "answer": "Approved basic information can be included; detailed evaluation questions go to your sales or technical team."
      },
      {
        "question": "How will prospects receive the new details?",
        "answer": "The proposed pilot sends an email after the new time is agreed through your booking process. We review calendar access, sender details and account-owner rules first."
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
    "buyer": "For fitness operators and membership teams",
    "eyebrow": "Voice AI for fitness clubs",
    "headline": "Rebook missed gym tours",
    "headlineAccent": "and trial visits.",
    "description": "Automate follow-up after missed tours and trial visits. A voice agent helps prospects rebook and sends the details, leaving your membership team more time to welcome potential members.",
    "problem": "A prospect booked a visit but never walked through the door. They may still want to join. Give them a simple way to rearrange, while your team focuses on the people already in the club.",
    "title": "Missed tour follow-up | Voice AI",
    "metaDescription": "Automate follow-up after missed tours and trial visits. A voice agent helps prospects rebook and sends the details, leaving your membership team more time to welcome potential members.",
    "inbound": false,
    "illustrationLabels": [
      "Tour or trial missed",
      "Rescheduling call",
      "Visit details sent"
    ],
    "invitation": "Now inviting focused pilot partners.",
    "formHeading": "Let’s look at your missed tour follow-up",
    "workflowTitle": "Make it easy to rearrange a missed visit.",
    "workflowName": "Missed tour follow-up",
    "outcomeDetail": "Track attendance after the rearranged visit.",
    "formIntro": "Explore a focused pilot with your team.",
    "workflow": [
      {
        "title": "Find the missed visit",
        "body": "Identify a tour or trial at the correct club that has not been rearranged."
      },
      {
        "title": "Call to rebook",
        "body": "Help the prospect find another suitable time under the club’s booking rules."
      },
      {
        "title": "Send the details",
        "body": "Confirm the rearranged visit by SMS. Track attendance and membership separately."
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
        "title": "Consistent follow-up after missed visits.",
        "body": ""
      },
      {
        "title": "Fewer rescheduling calls for the membership team.",
        "body": ""
      },
      {
        "title": "A clear path from rebooked visit to attendance and membership.",
        "body": ""
      }
    ],
    "pilot": {
      "title": "Start with your missed tour follow-up.",
      "description": "We’re inviting fitness operators and membership teams to test one focused workflow. We’ll agree the call process, SMS follow-up and human handoff before the pilot starts.",
      "scope": [
        "Missed tour follow-up",
        "Approved SMS follow-ups",
        "Human handoff with the conversation context"
      ],
      "question": "What happens when someone misses a booked tour or trial visit?"
    },
    "faqs": [
      {
        "question": "Does this contact existing members?",
        "answer": "This pilot focuses on prospects who missed a booked visit, not member retention."
      },
      {
        "question": "Can it handle several clubs?",
        "answer": "We assess location routing and booking access during the pilot discussion."
      },
      {
        "question": "Will it offer discounts?",
        "answer": "Membership prices and promotions stay within the rules your team explicitly approves."
      },
      {
        "question": "How are visit details confirmed?",
        "answer": "The proposed pilot uses SMS after a visit is rearranged through your agreed booking process. We review booking access and message setup with you first."
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
    "buyer": "For ecommerce and customer experience teams",
    "eyebrow": "Voice AI for ecommerce",
    "headline": "Answer the questions",
    "headlineAccent": "holding up a purchase.",
    "description": "Help shoppers resolve the questions holding up a purchase. Automate checkout follow-up with a voice agent that answers approved questions and shares the checkout link, reducing routine work for support.",
    "problem": "A reminder brings a shopper back to the same unanswered question. When the obstacle is a product detail or delivery policy, a conversation can help them decide whether to place the order.",
    "title": "Incomplete checkout follow-up | Voice AI",
    "metaDescription": "Help shoppers resolve the questions holding up a purchase. Automate checkout follow-up with a voice agent that answers approved questions and shares the checkout link, reducing routine work for support.",
    "inbound": false,
    "illustrationLabels": [
      "Checkout incomplete",
      "Checkout-assistance call",
      "Checkout link texted"
    ],
    "invitation": "Now inviting focused pilot partners.",
    "formHeading": "Let’s look at your incomplete checkout follow-up",
    "workflowTitle": "Help shoppers resolve the unanswered question.",
    "workflowName": "Incomplete checkout follow-up",
    "outcomeDetail": "Confirm orders separately from messages sent.",
    "formIntro": "Explore a focused pilot with your team.",
    "workflow": [
      {
        "title": "Check the open checkout",
        "body": "Select known shoppers eligible for assistance and confirm they have not already ordered."
      },
      {
        "title": "Call to clarify",
        "body": "Ask about the obstacle and use approved product or delivery information. Refer other questions to support."
      },
      {
        "title": "Text the information",
        "body": "Send approved product details or the checkout link by SMS. Check completed orders separately."
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
        "title": "Follow-up that can address a question.",
        "body": ""
      },
      {
        "title": "Less routine pre-purchase work for support.",
        "body": ""
      },
      {
        "title": "Measure completed orders and contribution after costs.",
        "body": ""
      }
    ],
    "pilot": {
      "title": "Start with your incomplete checkout follow-up.",
      "description": "We’re inviting ecommerce and customer experience teams to test one focused workflow. We’ll agree the call process, SMS follow-up and human handoff before the pilot starts.",
      "scope": [
        "Incomplete checkout follow-up",
        "Approved SMS follow-ups",
        "Human handoff with the conversation context"
      ],
      "question": "Which product or delivery questions most often hold up an order?"
    },
    "faqs": [
      {
        "question": "Will it call every abandoned checkout?",
        "answer": "No. We agree which shoppers and situations are appropriate for phone follow-up."
      },
      {
        "question": "Can it change prices or offer discounts?",
        "answer": "The pilot uses only your approved information and offers."
      },
      {
        "question": "What if the shopper has already ordered?",
        "answer": "The workflow needs a current order-status check so completed purchases are excluded."
      },
      {
        "question": "What will the text follow-up include?",
        "answer": "The proposed SMS can share approved product information or a checkout link. We agree eligible shoppers and message content first. Sending a link is not a completed order."
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
    "buyer": "For B2B finance and accounts receivable teams",
    "eyebrow": "Voice AI for accounts receivable",
    "headline": "Spend less time chasing",
    "headlineAccent": "overdue invoices.",
    "description": "Automate routine calls about undisputed overdue invoices. A voice agent checks receipt, asks about payment timing and shares the invoice, giving finance clearer answers with less chasing.",
    "problem": "The reminder has gone out, but finance still needs an answer. Did accounts payable receive the invoice? Is something missing? When should payment arrive? Make those routine follow-ups easier to manage.",
    "title": "Overdue invoice follow-up | Voice AI",
    "metaDescription": "Automate routine calls about undisputed overdue invoices. A voice agent checks receipt, asks about payment timing and shares the invoice, giving finance clearer answers with less chasing.",
    "inbound": false,
    "illustrationLabels": [
      "Invoice overdue",
      "Payment contact called",
      "Invoice emailed"
    ],
    "invitation": "Now inviting focused pilot partners.",
    "formHeading": "Let’s look at your overdue invoice follow-up",
    "workflowTitle": "Get a clear response on overdue invoices.",
    "workflowName": "Overdue invoice follow-up",
    "outcomeDetail": "Check payment against current finance records.",
    "formIntro": "Explore a focused pilot with your team.",
    "workflow": [
      {
        "title": "Check the overdue balance",
        "body": "Select undisputed invoices after ordinary reminders. Exclude payments already received."
      },
      {
        "title": "Call the payment contact",
        "body": "Check receipt and ask for an expected payment date. Flag new disputes for finance."
      },
      {
        "title": "Email the follow-up",
        "body": "Send the approved invoice copy or confirm the agreed next step. Record the response for finance."
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
        "title": "Less routine calling for finance.",
        "body": ""
      },
      {
        "title": "Expected payment dates recorded consistently.",
        "body": ""
      },
      {
        "title": "Payment questions reach the person who can resolve them.",
        "body": ""
      }
    ],
    "pilot": {
      "title": "Start with your overdue invoice follow-up.",
      "description": "We’re inviting B2B finance and accounts receivable teams to test one focused workflow. We’ll agree the call process, email follow-up and human handoff before the pilot starts.",
      "scope": [
        "Overdue invoice follow-up",
        "Approved email follow-ups",
        "Human handoff with the conversation context"
      ],
      "question": "How much manual calling does your team do about overdue invoices?"
    },
    "faqs": [
      {
        "question": "What happens if an invoice is disputed?",
        "answer": "The proposed workflow flags it for your finance team rather than trying to settle the dispute."
      },
      {
        "question": "Will it negotiate payment terms?",
        "answer": "No. Changes to terms stay with your team."
      },
      {
        "question": "How is this different from invoice reminders?",
        "answer": "The pilot tests a phone conversation when written reminders have not produced a clear response."
      },
      {
        "question": "What does the follow-up email contain?",
        "answer": "The proposed pilot can email an approved invoice copy or confirm the agreed follow-up. Sender and recipient details are reviewed first. A payment promise is not cash received."
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
    "buyer": "For moving companies and sales coordinators",
    "eyebrow": "Voice AI for movers",
    "headline": "Turn unanswered estimates",
    "headlineAccent": "into booked moves.",
    "description": "Automate estimate follow-up with a voice agent that checks what customers need to book and confirms the next step. Give your moving consultants less chasing and more time to close.",
    "problem": "An estimate is out, but the customer has not booked. They may still be comparing movers or need to clarify a detail. Give your sales team a clear next step instead of another unanswered follow-up task.",
    "title": "Moving estimate follow-up | Voice AI",
    "metaDescription": "Automate estimate follow-up with a voice agent that checks what customers need to book and confirms the next step. Give your moving consultants less chasing and more time to close.",
    "inbound": false,
    "illustrationLabels": [
      "Estimate unanswered",
      "Follow-up call",
      "Callback confirmed by text"
    ],
    "invitation": "Now inviting focused pilot partners.",
    "formHeading": "Let’s look at your moving estimate follow-up",
    "workflowTitle": "Make estimate follow-up easier.",
    "workflowName": "Moving estimate follow-up",
    "outcomeDetail": "A callback is not a booked move.",
    "formIntro": "Explore a focused pilot with your team.",
    "workflow": [
      {
        "title": "Find the open estimate",
        "body": "Select sent estimates due for follow-up. Exclude moves already booked or closed."
      },
      {
        "title": "Call about the move",
        "body": "Ask what is holding up the booking and pass date, packing or price questions to the moving consultant."
      },
      {
        "title": "Confirm the next step",
        "body": "Send an SMS confirming the callback or sharing the approved estimate link. Track booked moves separately."
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
        "title": "Consistent follow-up on estimates already sent.",
        "body": ""
      },
      {
        "title": "Less time spent checking whether customers are ready to book.",
        "body": ""
      },
      {
        "title": "Clear reasons a move remains unbooked.",
        "body": ""
      }
    ],
    "pilot": {
      "title": "Start with your moving estimate follow-up.",
      "description": "We’re inviting moving companies and sales coordinators to test one focused workflow. We’ll agree the call process, SMS follow-up and human handoff before the pilot starts.",
      "scope": [
        "Moving estimate follow-up",
        "Approved SMS follow-ups",
        "Human handoff with the conversation context"
      ],
      "question": "How does your team follow up estimates that have not turned into bookings?"
    },
    "faqs": [
      {
        "question": "Will it create or change moving estimates?",
        "answer": "The proposed pilot follows up estimates your team has already issued. Pricing changes stay with your moving consultant."
      },
      {
        "question": "What if the customer wants a different date?",
        "answer": "The assistant captures the request for your team to check; it does not promise crew availability."
      },
      {
        "question": "Does it replace our moving software?",
        "answer": "We will review how estimate status and follow-up outcomes can fit your current process before agreeing a pilot."
      },
      {
        "question": "Can the agent send our estimate?",
        "answer": "The proposed pilot can use SMS to share your approved estimate link or confirm a callback. We agree the message content and setup before the pilot."
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
    "buyer": "For restoration operators and intake teams",
    "eyebrow": "Voice AI for restoration",
    "headline": "Capture damage calls",
    "headlineAccent": "when your office cannot answer.",
    "description": "Automate overflow call intake when your office cannot answer. A voice agent captures the reported damage and property details, then alerts your on-call team with the information needed to respond.",
    "problem": "When the team is on a job or the office is closed, a new damage call still needs a clear next step. Capture the essential information so the person taking over does not start from scratch.",
    "title": "Overflow damage-call intake | Voice AI",
    "metaDescription": "Automate overflow call intake when your office cannot answer. A voice agent captures the reported damage and property details, then alerts your on-call team with the information needed to respond.",
    "inbound": true,
    "illustrationLabels": [
      "Overflow call",
      "Loss details collected",
      "On-call team alerted"
    ],
    "invitation": "Now inviting focused pilot partners.",
    "formHeading": "Let’s look at your overflow damage-call intake",
    "workflowTitle": "Give every overflow call a clear handoff.",
    "workflowName": "Overflow damage-call intake",
    "outcomeDetail": "A handoff needs acceptance. An alert is not dispatch.",
    "formIntro": "Explore a focused pilot with your team.",
    "workflow": [
      {
        "title": "Answer the overflow call",
        "body": "Use the agreed coverage and forwarding setup when your office cannot answer."
      },
      {
        "title": "Collect the loss details",
        "body": "Record the address, callback number and reported damage. Assessment stays with your professionals."
      },
      {
        "title": "Alert the on-call contact",
        "body": "Send an SMS alert under your escalation rules. Track acceptance and use agreed backups if needed."
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
        "title": "More complete information from overflow calls.",
        "body": ""
      },
      {
        "title": "Clearer handoffs to the on-call team.",
        "body": ""
      },
      {
        "title": "Less time reconstructing details from voicemail.",
        "body": ""
      }
    ],
    "pilot": {
      "title": "Start with your overflow damage-call intake.",
      "description": "We’re inviting restoration teams to test one overflow intake workflow. We’ll agree call coverage, SMS alerts and handoff acceptance before the pilot starts.",
      "scope": [
        "Overflow damage-call intake",
        "SMS alerts and agreed escalation rules",
        "Human handoff with the conversation context"
      ],
      "question": "Who handles new damage calls when your office cannot answer?"
    },
    "faqs": [
      {
        "question": "Will it dispatch a crew automatically?",
        "answer": "The pilot follows your agreed escalation process. Your team controls dispatch decisions."
      },
      {
        "question": "Can it assess the damage?",
        "answer": "It collects what the caller reports; assessment stays with your restoration professionals."
      },
      {
        "question": "What if the on-call contact does not answer?",
        "answer": "We define backup contacts and acknowledgement rules with you before a pilot starts."
      },
      {
        "question": "How does the on-call team get notified?",
        "answer": "The proposed pilot sends an SMS alert to the designated contact. We agree backup contacts and acknowledgement rules first. An alert does not mean a crew has been dispatched."
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
    "buyer": "For commercial HVAC and mechanical service teams",
    "eyebrow": "Voice AI for commercial HVAC",
    "headline": "Follow up repair proposals",
    "headlineAccent": "still waiting for approval.",
    "description": "Automate follow-up on open repair proposals. A voice agent checks what is delaying approval and passes questions to your service team, reducing routine calls while keeping proposed work moving.",
    "problem": "Your technician identified the work and your team sent the proposal. It is still waiting on a response. Find out whether the customer needs clarification, another decision-maker or more time.",
    "title": "Open repair proposal follow-up | Voice AI",
    "metaDescription": "Automate follow-up on open repair proposals. A voice agent checks what is delaying approval and passes questions to your service team, reducing routine calls while keeping proposed work moving.",
    "inbound": false,
    "illustrationLabels": [
      "Proposal awaiting approval",
      "Proposal follow-up call",
      "Next step emailed"
    ],
    "invitation": "Now inviting focused pilot partners.",
    "formHeading": "Let’s look at your open repair proposal follow-up",
    "workflowTitle": "Find out what is delaying the decision.",
    "workflowName": "Open repair proposal follow-up",
    "outcomeDetail": "Approval follows your formal authorization process.",
    "formIntro": "Explore a focused pilot with your team.",
    "workflow": [
      {
        "title": "Find the open proposal",
        "body": "Select issued service-repair proposals due for follow-up with the site or purchasing contact."
      },
      {
        "title": "Call about the decision",
        "body": "Ask what is delaying approval. Send scope and price questions to the service manager."
      },
      {
        "title": "Email the next step",
        "body": "Share the approved proposal or confirm the follow-up. Record decision status without assuming authorization."
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
        "title": "Less manual proposal chasing.",
        "body": ""
      },
      {
        "title": "Clearer reasons approvals are delayed.",
        "body": ""
      },
      {
        "title": "Keep service recommendations connected to the next customer decision.",
        "body": ""
      }
    ],
    "pilot": {
      "title": "Start with your open repair proposal follow-up.",
      "description": "We’re inviting commercial HVAC and mechanical service teams to test one focused workflow. We’ll agree the call process, email follow-up and human handoff before the pilot starts.",
      "scope": [
        "Open repair proposal follow-up",
        "Approved email follow-ups",
        "Human handoff with the conversation context"
      ],
      "question": "How do you follow up repair proposals that are waiting for customer approval?"
    },
    "faqs": [
      {
        "question": "Will it negotiate the proposal?",
        "answer": "Scope and price changes stay with your service team."
      },
      {
        "question": "Can it contact the right person at each site?",
        "answer": "We review your contact records and approval process before selecting a pilot queue."
      },
      {
        "question": "Does this cover new construction bids?",
        "answer": "The initial pilot focuses on issued service-repair proposals, not complex tendering."
      },
      {
        "question": "Can it share the repair proposal?",
        "answer": "The proposed pilot can email your approved proposal or confirm the next step with the agreed contact. We review the setup first. Interest does not replace formal approval."
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
    "buyer": "For specialty distributors and inside sales teams",
    "eyebrow": "Voice AI for distributors",
    "headline": "Follow up open quotes",
    "headlineAccent": "with fewer sales calls.",
    "description": "Give inside sales less quote chasing to do. A voice agent follows up open quotes, checks buying plans and shares the next step, helping reps focus on orders and customer questions.",
    "problem": "Inside sales has new requests to handle while earlier quotes still need an answer. Give each follow-up a useful outcome: ready to order, waiting on approval, needs a change or no longer needed.",
    "title": "Open quote follow-up | Voice AI",
    "metaDescription": "Give inside sales less quote chasing to do. A voice agent follows up open quotes, checks buying plans and shares the next step, helping reps focus on orders and customer questions.",
    "inbound": false,
    "illustrationLabels": [
      "Quote still open",
      "Buyer follow-up call",
      "Quote follow-up emailed"
    ],
    "invitation": "Now inviting focused pilot partners.",
    "formHeading": "Let’s look at your open quote follow-up",
    "workflowTitle": "Give inside sales a useful quote update.",
    "workflowName": "Open quote follow-up",
    "outcomeDetail": "A buyer’s response is not an accepted order.",
    "formIntro": "Explore a focused pilot with your team.",
    "workflow": [
      {
        "title": "Check the open quote",
        "body": "Select sent quotes with no response or order. Confirm the current status before contact."
      },
      {
        "title": "Call the buyer",
        "body": "Ask about approval, purchase-order readiness or requested changes. Route rep-level questions to inside sales."
      },
      {
        "title": "Email the follow-up",
        "body": "Share the approved quote or confirm the buyer’s response. Pass the context back to the rep."
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
        "title": "Less routine quote chasing.",
        "body": ""
      },
      {
        "title": "Useful status updates for each open quote.",
        "body": ""
      },
      {
        "title": "Clear handoffs for questions that require a rep.",
        "body": ""
      }
    ],
    "pilot": {
      "title": "Start with your open quote follow-up.",
      "description": "We’re inviting specialty distributors and inside sales teams to test one focused workflow. We’ll agree the call process, email follow-up and human handoff before the pilot starts.",
      "scope": [
        "Open quote follow-up",
        "Approved email follow-ups",
        "Human handoff with the conversation context"
      ],
      "question": "Who follows up quotes that have not turned into orders?"
    },
    "faqs": [
      {
        "question": "Will it generate quotes or enter orders?",
        "answer": "This first pilot follows up quotes your reps have already sent."
      },
      {
        "question": "Can it answer stock or lead-time questions?",
        "answer": "Those questions go to your rep unless the pilot explicitly includes reliable approved information."
      },
      {
        "question": "What if an order has already arrived?",
        "answer": "Current quote and order status must be checked before follow-up."
      },
      {
        "question": "What will the follow-up email include?",
        "answer": "The proposed pilot can share the approved quote or confirm the buyer’s response. We review sender details and quote access before setup. It does not enter or accept orders."
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
    "buyer": "For medspas and aesthetics clinic teams",
    "eyebrow": "Voice AI for medspas",
    "headline": "Help patients rebook",
    "headlineAccent": "missed consultations.",
    "description": "Automate the follow-up after missed consultations. A voice agent helps patients rearrange and sends appointment details, giving your front desk more time for the people already in your clinic.",
    "problem": "A missed consultation leaves the patient without a next step and your coordinator with another callback. Make it easier to rearrange while keeping clinical questions with your team.",
    "title": "Missed consultation follow-up | Voice AI",
    "metaDescription": "Automate the follow-up after missed consultations. A voice agent helps patients rearrange and sends appointment details, giving your front desk more time for the people already in your clinic.",
    "inbound": false,
    "illustrationLabels": [
      "Consultation missed",
      "Rescheduling call",
      "Appointment details texted"
    ],
    "invitation": "Now inviting focused pilot partners.",
    "formHeading": "Let’s look at your missed consultation follow-up",
    "workflowTitle": "Make missed consultations easier to rearrange.",
    "workflowName": "Missed consultation follow-up",
    "outcomeDetail": "Track attendance after the consultation.",
    "formIntro": "Explore a focused pilot with your team.",
    "workflow": [
      {
        "title": "Find the missed consultation",
        "body": "Select initial consultations that have not already been rearranged."
      },
      {
        "title": "Call discreetly to rebook",
        "body": "Ask whether the patient wants another appointment. Keep clinical questions with your team."
      },
      {
        "title": "Text appointment details",
        "body": "Send discreet SMS confirmation through the agreed booking process. Track attendance separately."
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
        "title": "Less routine rescheduling for the front desk.",
        "body": ""
      },
      {
        "title": "A consistent next step after a consultation no-show.",
        "body": ""
      },
      {
        "title": "Measure patients who attend, not bookings alone.",
        "body": ""
      }
    ],
    "pilot": {
      "title": "Start with your missed consultation follow-up.",
      "description": "We’re inviting medspas and aesthetics clinic teams to test one focused workflow. We’ll agree the call process, SMS follow-up and human handoff before the pilot starts.",
      "scope": [
        "Missed consultation follow-up",
        "Approved SMS follow-ups",
        "Human handoff with the conversation context"
      ],
      "question": "How does your front desk follow up missed initial consultations?"
    },
    "faqs": [
      {
        "question": "Can it recommend a treatment?",
        "answer": "No. Treatment questions stay with your clinical team."
      },
      {
        "question": "Will it change no-show fees or deposits?",
        "answer": "Your clinic sets those policies; the pilot does not waive or change them."
      },
      {
        "question": "Is this appointment reminder software?",
        "answer": "The initial workflow follows up after a consultation is missed, rather than only reminding people beforehand."
      },
      {
        "question": "What information goes in the text?",
        "answer": "The proposed SMS contains discreet appointment information, not treatment details. We agree the content and setup with your clinic before the pilot."
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
    "buyer": "For auto repair shops and service advisors",
    "eyebrow": "Voice AI for repair shops",
    "headline": "Follow up declined repairs",
    "headlineAccent": "without tying up advisors.",
    "description": "Automate follow-up on declined and deferred repairs. A voice agent checks whether customers are ready to revisit the work and arranges the next step, freeing up your service advisors.",
    "problem": "The repair was recommended, but the customer put it off. Your advisors still need to find out whether they want to return, need an updated estimate or have already had the work done.",
    "title": "Declined repair follow-up | Voice AI",
    "metaDescription": "Automate follow-up on declined and deferred repairs. A voice agent checks whether customers are ready to revisit the work and arranges the next step, freeing up your service advisors.",
    "inbound": false,
    "illustrationLabels": [
      "Repair deferred",
      "Repair follow-up call",
      "Advisor callback texted"
    ],
    "invitation": "Now inviting focused pilot partners.",
    "formHeading": "Let’s look at your declined repair follow-up",
    "workflowTitle": "Reconnect about repairs already recommended.",
    "workflowName": "Declined repair follow-up",
    "outcomeDetail": "A callback or visit is not completed repair work.",
    "formIntro": "Explore a focused pilot with your team.",
    "workflow": [
      {
        "title": "Find the deferred repair",
        "body": "Select eligible quoted work from the customer and vehicle record. Exclude work already completed."
      },
      {
        "title": "Call about the recommendation",
        "body": "Ask whether the customer wants to revisit the work. Route estimate questions to the service advisor."
      },
      {
        "title": "Confirm the next step",
        "body": "Text the agreed advisor callback or appointment details. Update the follow-up status separately from completed work."
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
        "title": "Less routine calling for service advisors.",
        "body": ""
      },
      {
        "title": "Keep deferred recommendations visible.",
        "body": ""
      },
      {
        "title": "A clearer route from declined work to a return appointment.",
        "body": ""
      }
    ],
    "pilot": {
      "title": "Start with your declined repair follow-up.",
      "description": "We’re inviting auto repair shops and service advisors to test one focused workflow. We’ll agree the call process, SMS follow-up and human handoff before the pilot starts.",
      "scope": [
        "Declined repair follow-up",
        "Approved SMS follow-ups",
        "Human handoff with the conversation context"
      ],
      "question": "How does your shop follow up declined or deferred repair work?"
    },
    "faqs": [
      {
        "question": "Will it recommend additional repairs?",
        "answer": "No. The pilot follows up work already documented by your shop."
      },
      {
        "question": "What if the old estimate is no longer valid?",
        "answer": "The assistant routes that question to your service advisor."
      },
      {
        "question": "Can it book the vehicle in?",
        "answer": "We agree whether the pilot can use verified appointment availability or should arrange an advisor callback."
      },
      {
        "question": "How is the next step confirmed?",
        "answer": "The proposed pilot uses SMS to confirm an advisor callback or an appointment agreed through your booking process. We review the messaging setup before the pilot."
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
