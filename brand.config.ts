// brand.config.ts
// ════════════════════════════════════════════════════════════════════════
// THIS IS THE ONLY FILE THAT CHANGES WHEN REBRANDING FOR A NEW COMPANY
// Edit this file, swap /apps/web/public/brand/ assets, deploy. Done.
// ════════════════════════════════════════════════════════════════════════

import type { BrandConfig } from './packages/config/types'

const config: BrandConfig = {

  // ── COMPANY IDENTITY ─────────────────────────────────────────────────
  company: {
    name:        'Celebrations Co.',
    tagline:     'We Turn Moments Into Memories',
    description: 'Premium event management company based in Bengaluru, specialising in corporate events, weddings, and luxury social gatherings.',
    founded:     2024,
    email:       'hello@celebrationsco.in',
    phone:       '+91 98765 43210',
    whatsapp:    '+91 98765 43210',
    address:     '123, MG Road, Bengaluru, Karnataka 560001',
    city:        'Bengaluru',
    mapEmbedUrl: '',
    officeHours: 'Monday – Saturday: 9AM – 7PM',
  },

  // ── BRAND TOKENS ─────────────────────────────────────────────────────
  brand: {
    colors: {
      primary:    '#C9A84C',
      secondary:  '#1A1A2E',
      accent:     '#E8D5A3',
      background: '#FAFAF8',
      surface:    '#FFFFFF',
      text:       '#1A202C',
      textMuted:  '#718096',
      border:     '#E2E8F0',
    },
    fonts: {
      display: 'Cormorant Garamond',
      body:    'DM Sans',
      accent:  'Bebas Neue',
    },
    style: {
      cardRadius:     '12px',
      buttonRadius:   '8px',
      buttonStyle:    'filled',
      shadowLevel:    'medium',
      animationLevel: 'subtle',
    },
    layout: {
      variant:   'classic',
      heroStyle: 'fullscreen',
      navStyle:  'transparent',
    },
  },

  // ── ASSET PATHS ──────────────────────────────────────────────────────
  assets: {
    logoLight: '/brand/logo-light.svg',
    logoDark:  '/brand/logo-dark.svg',
    favicon:   '/brand/favicon.ico',
    ogImage:   '/brand/og-image.jpg',
  },

  // ── SECTION VISIBILITY ───────────────────────────────────────────────
  sections: {
    home: {
      hero:              true,
      trustBar:          false,
      servicesSnap:      true,
      featuredPortfolio: false,
      whyChooseUs:       true,
      testimonials:      false,
      videoShowreel:     false,
      contactCta:        true,
      whatsappFloat:     true,
    },
    about: {
      story:        true,
      missionVision:true,
      team:         false,
      stats:        true,
      awards:       false,
      press:        false,
    },
    services: {
      corporate:      true,
      weddings:       true,
      conferences:    false,
      productLaunches:false,
      virtualHybrid:  false,
    },
    portfolio: {
      enabled:        false,
      categoryFilters:false,
      videoReels:     false,
    },
    contact: {
      form:           true,
      map:            true,
      officeHours:    true,
      bookingDeposit: false,
    },
  },

  // ── SOCIAL LINKS ─────────────────────────────────────────────────────
  social: {
    instagram: '',
    facebook:  '',
    linkedin:  '',
    youtube:   '',
    twitter:   '',
  },

  // ── CONTENT DEFAULTS ─────────────────────────────────────────────────
  content: {
    heroHeadline:    'We Turn Moments Into Memories',
    heroSubHeadline: 'Full-service event management for corporate, social & luxury occasions',
    heroCta1Label:   'Explore Our Work',
    heroCta1Href:    '/portfolio',
    heroCta2Label:   'Plan Your Event',
    heroCta2Href:    '/contact',
    aboutStory:      'Founded in 2024, Celebrations Co. was born from a simple belief: every event deserves to be extraordinary. Based in Bengaluru, we bring precision, creativity, and passion to every occasion we touch.',
    missionStatement:'To create events that move people — emotionally, aesthetically, and experientially.',
    visionStatement: 'To be the most trusted name in event management across South India.',
    whyUsTitle:      'Why Choose Us',
    whyUsPoints: [
      { icon: 'Sparkles', title: 'Creative Direction',  body: 'Every event is a unique canvas — we design experiences that reflect your vision perfectly.' },
      { icon: 'Shield',   title: 'Flawless Execution',  body: 'From first call to final curtain, we handle every detail so you never have to worry.' },
      { icon: 'Heart',    title: 'Personal Touch',      body: 'Small team. Big commitment. You will always speak to the people doing the work.' },
    ],
    ctaHeadline: 'Ready to Create Something Unforgettable?',
    ctaBody:     'Tell us about your event. We\'ll take it from there.',
    ctaLabel:    'Start Planning',
  },

  // ── STATS COUNTERS ───────────────────────────────────────────────────
  stats: [
    { id: 'events',  label: 'Events Executed', value: 5,  suffix: '+', visible: true  },
    { id: 'cities',  label: 'Cities',          value: 2,  suffix: '',  visible: true  },
    { id: 'years',   label: 'Years Active',    value: 1,  suffix: '+', visible: false },
    { id: 'clients', label: 'Happy Clients',   value: 5,  suffix: '+', visible: false },
  ],

  // ── SERVICES LIST ────────────────────────────────────────────────────
  services: [
    {
      id:         'corporate',
      title:      'Corporate Events',
      icon:       'Briefcase',
      shortDesc:  'Conferences, team offsites, product launches, and award nights — delivered with precision.',
      features:   ['Venue scouting', 'AV & production', 'Guest management', 'Catering coordination'],
      coverImage: '/content/services/corporate.jpg',
      visible:    true,
      comingSoon: false,
    },
    {
      id:         'weddings',
      title:      'Weddings & Social',
      icon:       'Heart',
      shortDesc:  'Intimate ceremonies to grand celebrations — every detail perfected.',
      features:   ['Full wedding planning', 'D\u00e9cor & florals', 'Vendor management', 'Day-of coordination'],
      coverImage: '/content/services/weddings.jpg',
      visible:    true,
      comingSoon: false,
    },
    {
      id:         'conferences',
      title:      'Conferences & Summits',
      icon:       'Users',
      shortDesc:  'Large-scale conferences, summits, and academic events handled end-to-end.',
      features:   ['Speaker management', 'Registration system', 'Stage & AV', 'Live streaming'],
      coverImage: '/content/services/conferences.jpg',
      visible:    false,
      comingSoon: false,
    },
    {
      id:         'launches',
      title:      'Product Launches',
      icon:       'Rocket',
      shortDesc:  'Brand activations and product launches that create lasting impressions.',
      features:   ['Concept design', 'Press coordination', 'Brand theming', 'Social media moments'],
      coverImage: '/content/services/launches.jpg',
      visible:    false,
      comingSoon: false,
    },
    {
      id:         'virtual',
      title:      'Virtual & Hybrid',
      icon:       'Monitor',
      shortDesc:  'Seamless virtual and hybrid events connecting audiences anywhere.',
      features:   ['Platform setup', 'Live streaming', 'Audience engagement', 'Tech support'],
      coverImage: '/content/services/virtual.jpg',
      visible:    false,
      comingSoon: false,
    },
  ],

  // ── SEO ──────────────────────────────────────────────────────────────
  seo: {
    titleTemplate:  '%s \u2014 Celebrations Co. | Event Management Bengaluru',
    defaultTitle:   'Celebrations Co. | Premium Event Management in Bengaluru',
    description:    'Full-service event management in Bengaluru. Corporate events, weddings, conferences, and luxury social occasions.',
    keywords:       ['event management bengaluru', 'wedding planner bengaluru', 'corporate events bengaluru', 'event company india'],
    locale:         'en_IN',
    twitterHandle:  '',
  },

  // ── FEATURE FLAGS ────────────────────────────────────────────────────
  features: {
    razorpay: {
      enabled:        false,
      keyId:          '',
      depositAmount:  5000,
      depositLabel:   'Booking Deposit',
      refundable:     true,
    },
    whatsapp: {
      enabled:        true,
      number:         '+91 98765 43210',
      defaultMessage: 'Hi! I\'d like to enquire about your event services.',
    },
    blog:             false,
    analytics:        true,
    cookieBanner:     false,
    darkModeToggle:   false,
  },

}

export default config
