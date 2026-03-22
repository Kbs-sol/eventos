export interface SectionConfig {
  section_id: string
  page: string
  section_name: string
  is_visible: boolean
  sort_order: number
  updated_at: string
}

export interface HeroSlide {
  id: string
  image_key: string | null
  video_url: string | null
  headline: string | null
  subheadline: string | null
  cta1_label: string
  cta1_href: string
  cta2_label: string
  cta2_href: string
  is_visible: boolean
  sort_order: number
  created_at: string
}

export interface PortfolioEvent {
  id: string
  title: string
  event_type: string | null
  location: string | null
  event_date: string | null
  description: string | null
  cover_image: string | null
  is_visible: boolean
  is_featured: boolean
  sort_order: number
  created_at: string
}

export interface PortfolioImage {
  id: string
  event_id: string
  image_key: string
  alt_text: string | null
  is_visible: boolean
  sort_order: number
  created_at: string
}

export interface ServiceOverride {
  service_id: string
  title: string | null
  short_desc: string | null
  is_visible: boolean | null
  sort_order: number | null
  updated_at: string
}

export interface Testimonial {
  id: string
  client_name: string
  client_company: string | null
  event_type: string | null
  quote: string
  rating: number
  photo_key: string | null
  is_visible: boolean
  is_featured: boolean
  sort_order: number
  created_at: string
}

export interface TeamMember {
  id: string
  name: string
  role: string | null
  bio: string | null
  photo_key: string | null
  is_founder: boolean
  is_visible: boolean
  sort_order: number
}

export interface StatOverride {
  stat_id: string
  label: string | null
  value: number | null
  suffix: string | null
  is_visible: boolean | null
}

export interface ContactEnquiry {
  id: string
  name: string
  email: string
  phone: string | null
  event_type: string | null
  event_date: string | null
  guest_count: string | null
  budget: string | null
  message: string | null
  status: 'new' | 'read' | 'replied' | 'archived'
  is_starred: boolean
  internal_note: string | null
  created_at: string
}

export interface MediaAsset {
  id: string
  filename: string
  r2_key: string
  folder: string | null
  size_bytes: number | null
  width: number | null
  height: number | null
  mime_type: string
  created_at: string
}

export interface SiteSetting {
  key: string
  value: string | null
  updated_at: string
}

export interface Booking {
  id: string
  enquiry_id: string | null
  razorpay_order_id: string | null
  razorpay_payment_id: string | null
  amount_paise: number | null
  status: 'pending' | 'paid' | 'failed' | 'refunded'
  created_at: string
}

export interface Database {
  section_config: SectionConfig
  hero_slides: HeroSlide
  portfolio_events: PortfolioEvent
  portfolio_images: PortfolioImage
  services_override: ServiceOverride
  testimonials: Testimonial
  team_members: TeamMember
  stats_override: StatOverride
  contact_enquiries: ContactEnquiry
  media_assets: MediaAsset
  site_settings: SiteSetting
  bookings: Booking
}
