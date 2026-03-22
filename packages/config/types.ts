export type LayoutVariant   = 'classic' | 'editorial' | 'modern' | 'minimal'
export type HeroStyle       = 'fullscreen' | 'split' | 'centered' | 'video'
export type ButtonStyle     = 'filled' | 'outline' | 'pill' | 'ghost'
export type AnimationLevel  = 'none' | 'subtle' | 'bold'
export type ShadowLevel     = 'none' | 'subtle' | 'medium' | 'strong'
export type NavStyle        = 'transparent' | 'solid' | 'minimal'

export interface ServiceItem {
  id: string
  title: string
  icon: string
  shortDesc: string
  features: string[]
  coverImage: string
  visible: boolean
  comingSoon: boolean
}

export interface StatItem {
  id: string
  label: string
  value: number
  suffix: string
  visible: boolean
}

export interface WhyUsPoint {
  icon: string
  title: string
  body: string
}

export interface BrandConfig {
  company: {
    name: string
    tagline: string
    description: string
    founded?: number
    email: string
    phone: string
    whatsapp?: string
    address: string
    city: string
    mapEmbedUrl?: string
    officeHours?: string
  }
  brand: {
    colors: {
      primary: string
      secondary: string
      accent: string
      background: string
      surface: string
      text: string
      textMuted: string
      border: string
    }
    fonts: {
      display: string
      body: string
      accent?: string
    }
    style: {
      cardRadius: string
      buttonRadius: string
      buttonStyle: ButtonStyle
      shadowLevel: ShadowLevel
      animationLevel: AnimationLevel
    }
    layout: {
      variant: LayoutVariant
      heroStyle: HeroStyle
      navStyle: NavStyle
    }
  }
  assets: {
    logoLight: string
    logoDark: string
    favicon: string
    ogImage: string
  }
  sections: {
    home: {
      hero: boolean
      trustBar: boolean
      servicesSnap: boolean
      featuredPortfolio: boolean
      whyChooseUs: boolean
      testimonials: boolean
      videoShowreel: boolean
      contactCta: boolean
      whatsappFloat: boolean
    }
    about: {
      story: boolean
      missionVision: boolean
      team: boolean
      stats: boolean
      awards: boolean
      press: boolean
    }
    services: {
      corporate: boolean
      weddings: boolean
      conferences: boolean
      productLaunches: boolean
      virtualHybrid: boolean
    }
    portfolio: {
      enabled: boolean
      categoryFilters: boolean
      videoReels: boolean
    }
    contact: {
      form: boolean
      map: boolean
      officeHours: boolean
      bookingDeposit: boolean
    }
  }
  social: {
    instagram?: string
    facebook?: string
    linkedin?: string
    youtube?: string
    twitter?: string
  }
  content: {
    heroHeadline: string
    heroSubHeadline: string
    heroCta1Label: string
    heroCta1Href: string
    heroCta2Label: string
    heroCta2Href: string
    aboutStory: string
    missionStatement: string
    visionStatement: string
    whyUsTitle: string
    whyUsPoints: WhyUsPoint[]
    ctaHeadline: string
    ctaBody: string
    ctaLabel: string
  }
  stats: StatItem[]
  services: ServiceItem[]
  seo: {
    titleTemplate: string
    defaultTitle: string
    description: string
    keywords: string[]
    locale: string
    twitterHandle?: string
  }
  features: {
    razorpay: {
      enabled: boolean
      keyId: string
      depositAmount: number
      depositLabel: string
      refundable: boolean
    }
    whatsapp: {
      enabled: boolean
      number: string
      defaultMessage: string
    }
    blog: boolean
    analytics: boolean
    cookieBanner: boolean
    darkModeToggle: boolean
  }
}
