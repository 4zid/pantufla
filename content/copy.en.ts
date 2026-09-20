import type { SiteCopy } from "./copy";

/**
 * Todo el texto del sitio en inglés.
 *
 * Escrito como inglés, no traducido palabra por palabra. El español del sitio
 * es directo y sin adornos, y eso es lo que hay que conservar: si la versión
 * en inglés suena a folleto de agencia, no dice lo mismo aunque diga lo mismo.
 *
 * Los precios no cambian: son dólares en las dos versiones.
 */
export const en: SiteCopy = {
  meta: {
    tagline: "Web design and development studio",
    description:
      "We design and build websites with a fixed scope, a fixed price and a delivery date. From the first conversation to a published site, in weeks.",
    keywords: [
      "web design",
      "web development",
      "landing page",
      "website with CMS",
      "web design studio",
      "Argentina",
    ],
    ogLocale: "en_US",
  },

  nav: [
    { label: "Process", href: "/#proceso" },
    { label: "Pricing", href: "/#planes" },
    { label: "Work", href: "/#proyectos" },
  ],

  header: {
    plans: "See pricing",
    cta: "Start a project",
    openMenu: "Open menu",
    skip: "Skip to content",
    closeMenu: "Close menu",
    language: "Language",
  },

  hero: {
    titleSegments: [
      { text: "We build" },
      { text: "websites", mark: "paper" },
      { text: "that turn visitors into" },
      { text: "clients.", mark: "ink" },
    ],
    lead: "Design, copy and development, so that whoever lands on your site knows what you do in ten seconds and ends up writing to you.",
    primary: { label: "Start a project", href: "/#brief" },
    secondary: { label: "See plans and pricing", href: "/#planes" },
    proof: [
      "Fixed price",
      "First version in 5 days",
      "The site stays in your name",
    ],
    dashboard: {
      title: "Your site, one month in",
      status: "Everything running",
      range: "Last 30 days",
      visits: { title: "Site visits", badge: "+18%", value: "12,480" },
      visitsStats: [
        { key: "Peak", value: "16:30" },
        { key: "Bounce", value: "32%" },
        { key: "Enquiries", value: "24" },
      ],
      visitsAxis: ["Dec 1", "Dec 7", "Dec 14", "Dec 21", "Dec 28"],
      conversion: {
        title: "Conversion",
        badge: "+12%",
        note: "Visitors who write",
      },
      speed: {
        title: "Speed",
        badge: "+6",
        mobile: "Mobile",
        desktop: "Desktop",
      },
      traffic: {
        title: "Where they come from",
        note: "Last 30 days",
        channels: ["Google search", "Direct", "Social", "Other"],
      },
    },
  },

  socialProof: {
    label: "Clients",
    claim: "We take on few projects at a time and build each one ourselves.",
  },

  approach: {
    eyebrow: "How we work",
    title: "One scope, one price, one date.",
    lead: "Pantufla is a small studio with a fixed method. That is what lets us deliver fast without dropping the quality of the design.",
    pillars: [
      {
        id: "alcance",
        title: "Scope closed before we start",
        body: "You pick a plan and you know exactly what is in, what is out and what it costs. If something outside the scope comes up, we quote it separately and you decide.",
      },
      {
        id: "ritmo",
        title: "Short cycles, dates you can see",
        body: "We work in blocks of days, not months. Every stage has a date and a single round of changes, so the project never goes cold.",
      },
      {
        id: "entrega",
        title: "We hand it over running",
        body: "The site is published on your account, with your domain and a panel where you edit the copy, the photos and the posts without depending on us.",
      },
    ],
  },

  process: {
    eyebrow: "The process",
    title: "Four stages. Fifteen working days.",
    lead: "The same path for every project. The size changes, the method does not.",
    labels: { deliverable: "You get", yours: "You bring" },
    steps: [
      {
        id: "brief",
        name: "Brief",
        when: "Day 1",
        body: "You fill in a five-minute form: what you do, who you sell to and what you need the site to achieve. If the project is a fit, within 24 hours you have the scope, the price and the delivery date in writing.",
        deliverable: "A closed proposal",
        yours: "Answering the brief",
      },
      {
        id: "diseno",
        name: "Structure and design",
        when: "Days 2 to 6",
        body: "We decide which sections go in, in what order and what each one says. On that base we design the whole site for desktop and mobile. You review it and leave your notes in one place.",
        deliverable: "Final design, approved",
        yours: "One round of feedback",
      },
      {
        id: "desarrollo",
        name: "Development",
        when: "Days 7 to 13",
        body: "We build the site, load your real content and test it at every screen size. We set up the editing panel, the analytics and the contact form.",
        deliverable: "The site on a preview link",
        yours: "Copy, photos and logo",
      },
      {
        id: "publicacion",
        name: "Launch",
        when: "Days 14 and 15",
        body: "We publish on your domain, hand over the accounts and record a short video showing you how to edit each part. After that you have fifteen days of fine-tuning included.",
        deliverable: "The site live and the keys",
        yours: "The domain",
      },
    ],
    payment: {
      segments: [
        { text: "Half to book the date, half the day it goes live." },
        { text: "Or all of it upfront, for" },
        { text: "15% off.", mark: "aqua" },
      ],
      cta: { label: "Start a project", href: "/#brief" },
    },
  },

  stack: {
    eyebrow: "Tools",
    title: "What this is built with.",
    lead: "Nothing exotic and nothing homemade: tools you already know, that you will be able to keep using with any other studio.",
  },

  pricing: {
    eyebrow: "Pricing",
    title: "Pick where to start.",
    lead: "A single page, the full site, or tell us if you need something else. Prices in US dollars, and fixed.",
    groupLabel: "Payment",
    totalLabel: "Total",
    toggle: {
      once: { label: "One payment", note: "−15%", noteLong: "15% off" },
      split: { label: "In 2 payments", note: "50/50", noteLong: "50% and 50%" },
    },
    guarantee:
      "If the first design delivery does not convince you, we stop there and refund the deposit in full. No argument.",
    plans: [
      {
        id: "landing",
        name: "Landing",
        summary: "One page that explains what you do and brings you enquiries.",
        bestFor: "Launches, single services and campaigns.",
        price: { once: 850, split: 500, splitCount: 2 },
        delivery: "5 to 7 days",
        cta: { label: "Start with Landing", href: "/?plan=landing#brief" },
        features: [
          "One page, up to 6 sections",
          "We write the copy with you",
          "A form that emails you",
          "Published on your domain",
        ],
      },
      {
        id: "sitio",
        name: "Site",
        summary: "Your full site, with a panel so you can edit it yourself.",
        bestFor: "Studios, agencies, clinics, brands and products.",
        price: { once: 1500, split: 880, splitCount: 2 },
        delivery: "2 to 3 weeks",
        badge: "Most chosen",
        cta: { label: "Start with Site", href: "/?plan=sitio#brief" },
        features: [
          "Everything in Landing",
          "Up to 6 pages",
          "A panel so you can edit it",
          "Blog or project listing",
        ],
      },
    ],
    contact: {
      name: "Talk to us",
      summary: "Your project does not fit either of those.",
      price: "Let's talk",
      features: [
        "Booking and scheduling systems",
        "Integrations with what you already use",
        "Migrations from another platform",
        "We tell you in 24 hours if we can",
      ],
      cta: { label: "Tell us about it", href: "/?plan=otra-cosa#brief" },
    },
    existing: {
      title: "I already have a site on Webflow or Framer.",
      summary:
        "No need to redo everything. We step into what you already have, tidy it up and hand it back running.",
      platforms: [
        {
          id: "webflow",
          name: "Webflow",
          detail:
            "We work inside the Designer and the CMS. We clean up the classes, fix the responsive behaviour and leave the collections ready for you to fill.",
        },
        {
          id: "framer",
          name: "Framer",
          detail:
            "We work on your project: components, variants, breakpoints and CMS. If it needs code, we add it.",
        },
      ],
      services: [
        {
          title: "Run it",
          detail:
            "We load content and publish the changes for you. Monthly, and you stop whenever you want.",
        },
        {
          title: "Improve it",
          detail:
            "Speed, technical SEO, responsive and accessibility. We tell you what we found before touching anything.",
        },
        {
          title: "Redesign it",
          detail:
            "Same content, new face. The design is rebuilt on the platform you already use, with nothing to migrate.",
        },
        {
          title: "One specific change",
          detail:
            "A new section, a form that stopped working, a landing page for a campaign. Quoted per change.",
        },
      ],
      note: "Before quoting we look at your site and tell you what is worth touching and what is not.",
      cta: { label: "Show us your site", href: "/?plan=existente#brief" },
    },
    alwaysIncluded: [
      "Original design, no templates",
      "Real responsive on mobile, tablet and desktop",
      "Fast loading and solid Core Web Vitals",
      "Technical SEO: metadata, sitemap and structured data",
      "The code, the domain and the accounts stay in your name",
      "A closing call to leave you up and running",
    ],
    offerCatalog: "Web design and development plans",
  },

  bento: {
    eyebrow: "What the site gets you",
    title: "Looking good is half of it.",
    lead: "The other half is not something you look at: it is measured. These four ship on every project, whichever plan you pick.",
    cards: [
      {
        id: "velocidad",
        title: "Loads before they decide to leave",
        body: "Half of all visitors abandon a site that takes more than three seconds. Yours does not even take one: images come optimised and the content is served from whichever server sits closest to the person opening it.",
      },
      {
        id: "seo",
        title: "People find you, and not only on Google",
        body: "Metadata, sitemap and structured data from day one. Plus a file that explains to ChatGPT and Perplexity what you do, because more and more people ask there before they search.",
      },
      {
        id: "pantallas",
        title: "Just as tidy on a phone",
        body: "Not the same layout squeezed down: every section is rebuilt for the screen it is on. We test on phone, tablet and desktop before publishing, because that is where most people arrive.",
      },
      {
        id: "resultados",
        title: "Built so they write to you",
        body: "A beautiful site that does not convert is an expensive brochure. Every decision — what comes first, what the button says, how many fields the form has — comes from the same question: what makes someone on the other side commit.",
      },
    ],
  },

  work: {
    eyebrow: "Work",
    title: "Some of the sites that came out of here.",
    lead: "Different industries, different sizes, the same method.",
    view: "Visit site",
    loadMore: "See more work",
    counter: "{shown} of {total}",
  },

  testimonials: {
    eyebrow: "Testimonials",
    title: "What the people who went through it say.",
    rating: "{value} out of 5",
  },

  clientsMap: {
    eyebrow: "Where we work",
    title: "We work from Buenos Aires, for wherever you are.",
    note: "The whole process runs on writing and video. So far we have published sites for clients in {count} countries.",
  },

  faq: {
    eyebrow: "Questions",
    title: "Here are the answers.",
    cta: {
      claim: "Still not sure about something?",
      label: "Book 20 minutes",
      href: "/reunion",
    },
    items: [
      {
        q: "What if I need more pages than the plan includes?",
        a: "They are added separately, at a fixed price agreed before we start, so the budget never moves on its own. If the brief already shows you need quite a few more, we tell you right there with a separate number.",
      },
      {
        q: "Who owns the site once the project ends?",
        a: "You do. The domain, the hosting, the content panel and the repository are all in your name. We leave the accounts whenever you say. We do not use platforms that tie you to us.",
      },
      {
        q: "Can I edit the content without knowing how to code?",
        a: "Yes, on the Site plan. You log into a panel, change copy, upload photos, publish a new post and the site updates itself. We leave you a short video explaining each part.",
      },
      {
        q: "What does it cost to keep it running each month?",
        a: "Between 0 and 20 dollars a month depending on traffic, plus the domain (around 15 dollars a year). You pay that straight to the provider. If you want us to handle changes and improvements every month, we have a separate retainer.",
      },
      {
        q: "Do you use AI to work?",
        a: "Yes, on the technical and repetitive parts: code scaffolding, configuration, first drafts of copy. The design, the structure and the decisions are ours. It is the reason we can deliver in weeks and charge what we charge.",
      },
      {
        q: "What do you need from me to start?",
        a: "The brief filled in, your logo if you have one, the photos you want to use and a rough idea of the copy. If you do not have copy, we write it and you approve it. Nothing else.",
      },
      {
        q: "How and when do I pay?",
        a: "50% to hold the date in the calendar and 50% the day we publish. If you prefer to pay it all up front, you get 15% off. We take bank transfer, Wise, Payoneer and stablecoins. We invoice.",
      },
      {
        q: "What happens if I fall behind with the content?",
        a: "We freeze the project and pick it up when you are ready, at no extra cost, for 30 days. After that the delivery date is rescheduled based on what is available.",
      },
    ],
  },

  meeting: {
    metaTitle: "Book a call",
    metaDescription:
      "Twenty minutes to clear up your questions and see whether the project fits. Pick a day and the invite lands in your inbox.",
    eyebrow: "Book",
    title: "Twenty minutes and you leave knowing.",
    lead: "Pick whichever day suits you. The invite arrives by email with the link, and if something comes up you can reschedule from there.",
    expectTitle: "What happens in those twenty minutes",
    expect: [
      {
        title: "You tell us what you need",
        detail:
          "What you do, who you sell to and what you want the site to achieve. Three or four minutes is enough.",
      },
      {
        title: "We tell you which plan fits",
        detail:
          "What it costs and how long it takes. If none of them fit we say so on the call, instead of costing you a week.",
      },
      {
        title: "You leave with the numbers",
        detail:
          "Scope, price and delivery date in writing the next day. There is no second call for that.",
      },
    ],
    loading: "Opening the calendar…",
    fallback:
      "The calendar is not connected yet. Write to us and we will book it by hand:",
    preferWrite: "Would you rather write it out and get an answer by email?",
    write: { label: "Fill in the brief", href: "/#brief" },
  },

  finalCta: {
    title: "Tell us what you need.",
    lead: "Five minutes of form. Within 24 hours we come back with scope, price and date, or we tell you straight that we are not the right people.",
    primary: { label: "Fill in the brief", href: "/#brief" },
    expectationsTitle: "What happens next",
    expectations: [
      "We read the brief the same day it arrives.",
      "We come back with scope, price and date within 24 working hours.",
      "If we are not the right fit, we say so and point you to someone else.",
      "No mandatory sales call: if you would rather keep it in writing, we keep it in writing.",
    ],
    secondaryLabel: "Email {email}",
  },

  form: {
    name: { label: "Full name", placeholder: "Ana Ríos" },
    email: { label: "Email", placeholder: "ana@company.com" },
    company: {
      label: "Company or project",
      optional: "(optional)",
      placeholder: "Martel Studio",
    },
    plan: { label: "Plan" },
    budget: { label: "Budget", currency: "(USD)" },
    timeline: { label: "Timeline" },
    message: {
      label: "What do you need?",
      hint: "What you do, who you sell to and what you want the site to achieve. Three or four lines is enough.",
      placeholder:
        "We run an architecture studio in Córdoba. We want to show the built work and get enquiries for new projects…",
    },
    honeypot: "Do not fill in",
    submit: "Send the brief",
    sending: "Sending…",
    privacy:
      "We reply within 24 working hours. We do not share your details with anyone.",
    genericError: "We could not send it",
    extraPlans: [
      { value: "existente", label: "I already have a site on Webflow or Framer" },
      { value: "no-se", label: "I am not sure which one fits" },
      { value: "otra-cosa", label: "Something else (tell us in the message)" },
    ],
    budgetRanges: [
      "Under $1,000",
      "$1,000 – $2,500",
      "$2,500 – $5,000",
      "Over $5,000",
      "Not sure yet",
    ],
    timelineOptions: [
      "As soon as possible",
      "In 2 to 4 weeks",
      "In 1 to 3 months",
      "Just exploring",
    ],
    success: {
      title: "Got it. Thank you.",
      body: "We read it today. Within the next 24 working hours we come back with the scope, the price and the delivery date, or we tell you straight if we are not the right people for this project.",
      urgent: "Urgent? Write to us at",
    },
  },

  pages: {
    proyectos: {
      metaTitle: "Work",
      metaDescription:
        "Sites and landing pages we designed and built: industry, scope and the real delivery time for each one.",
      eyebrow: "Work",
      title: "Sites that came out of here.",
      lead: "From single-page landings to full sites with a content panel.",
    },
  },

  notFound: {
    eyebrow: "Error 404",
    title: "This page does not exist.",
    lead: "We may have moved it, or the link may be misspelled.",
    home: { label: "Back home", href: "/" },
    work: { label: "See the work", href: "/#proyectos" },
  },

  footer: {
    blurb:
      "{tagline}. Fixed scope, fixed price and a delivery date. We work from {location} for clients anywhere.",
    navTitle: "Navigation",
    contactTitle: "Contact",
    contactLink: { label: "Contact", href: "/#brief" },
    signature: "Designed and built at home, in slippers.",
  },
};
