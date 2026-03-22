-- ══════════════════════════════════════════════════════════
-- EventOS: Initial Schema
-- ══════════════════════════════════════════════════════════

-- ── SECTION VISIBILITY ───────────────────────────────────
CREATE TABLE section_config (
  section_id    text PRIMARY KEY,
  page          text NOT NULL,
  section_name  text NOT NULL,
  is_visible    boolean DEFAULT false,
  sort_order    int DEFAULT 0,
  updated_at    timestamptz DEFAULT now()
);

INSERT INTO section_config (section_id, page, section_name, is_visible, sort_order) VALUES
  ('home_hero',              'home',      'Hero Banner',         true,  1),
  ('home_trustBar',          'home',      'Trust Logo Bar',      false, 2),
  ('home_servicesSnap',      'home',      'Services Snapshot',   true,  3),
  ('home_featuredPortfolio', 'home',      'Featured Portfolio',  false, 4),
  ('home_whyChooseUs',       'home',      'Why Choose Us',       true,  5),
  ('home_testimonials',      'home',      'Testimonials',        false, 6),
  ('home_videoShowreel',     'home',      'Video Showreel',      false, 7),
  ('home_contactCta',        'home',      'Contact CTA',         true,  8),
  ('home_whatsappFloat',     'home',      'WhatsApp Button',     true,  9),
  ('about_story',            'about',     'Our Story',           true,  1),
  ('about_missionVision',    'about',     'Mission & Vision',    true,  2),
  ('about_team',             'about',     'Team Grid',           false, 3),
  ('about_stats',            'about',     'Stats Counters',      true,  4),
  ('about_awards',           'about',     'Awards',              false, 5),
  ('about_press',            'about',     'Press / Media',       false, 6),
  ('services_corporate',     'services',  'Corporate Events',    true,  1),
  ('services_weddings',      'services',  'Weddings & Social',   true,  2),
  ('services_conferences',   'services',  'Conferences',         false, 3),
  ('services_productLaunches','services', 'Product Launches',    false, 4),
  ('services_virtualHybrid', 'services',  'Virtual & Hybrid',    false, 5),
  ('portfolio_enabled',      'portfolio', 'Portfolio Page',      false, 1),
  ('portfolio_categoryFilters','portfolio','Category Filters',   false, 2),
  ('portfolio_videoReels',   'portfolio', 'Video Reels',         false, 3),
  ('contact_form',           'contact',   'Contact Form',        true,  1),
  ('contact_map',            'contact',   'Map Embed',           true,  2),
  ('contact_officeHours',    'contact',   'Office Hours',        true,  3),
  ('contact_bookingDeposit', 'contact',   'Booking Deposit',     false, 4);

-- ── HERO SLIDES ──────────────────────────────────────────
CREATE TABLE hero_slides (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_key     text,
  video_url     text,
  headline      text,
  subheadline   text,
  cta1_label    text DEFAULT 'Explore Our Work',
  cta1_href     text DEFAULT '/portfolio',
  cta2_label    text DEFAULT 'Plan Your Event',
  cta2_href     text DEFAULT '/contact',
  is_visible    boolean DEFAULT true,
  sort_order    int DEFAULT 0,
  created_at    timestamptz DEFAULT now()
);

-- ── PORTFOLIO ────────────────────────────────────────────
CREATE TABLE portfolio_events (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text NOT NULL,
  event_type    text,
  location      text,
  event_date    date,
  description   text,
  cover_image   text,
  is_visible    boolean DEFAULT false,
  is_featured   boolean DEFAULT false,
  sort_order    int DEFAULT 0,
  created_at    timestamptz DEFAULT now()
);

CREATE TABLE portfolio_images (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id      uuid NOT NULL REFERENCES portfolio_events(id) ON DELETE CASCADE,
  image_key     text NOT NULL,
  alt_text      text,
  is_visible    boolean DEFAULT true,
  sort_order    int DEFAULT 0,
  created_at    timestamptz DEFAULT now()
);

CREATE INDEX idx_portfolio_images_event ON portfolio_images(event_id);

-- ── SERVICES OVERRIDE ────────────────────────────────────
CREATE TABLE services_override (
  service_id    text PRIMARY KEY,
  title         text,
  short_desc    text,
  is_visible    boolean,
  sort_order    int,
  updated_at    timestamptz DEFAULT now()
);

-- ── TESTIMONIALS ─────────────────────────────────────────
CREATE TABLE testimonials (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name     text NOT NULL,
  client_company  text,
  event_type      text,
  quote           text NOT NULL,
  rating          int DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  photo_key       text,
  is_visible      boolean DEFAULT true,
  is_featured     boolean DEFAULT false,
  sort_order      int DEFAULT 0,
  created_at      timestamptz DEFAULT now()
);

-- ── TEAM ─────────────────────────────────────────────────
CREATE TABLE team_members (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  role          text,
  bio           text,
  photo_key     text,
  is_founder    boolean DEFAULT false,
  is_visible    boolean DEFAULT true,
  sort_order    int DEFAULT 0
);

-- ── STATS OVERRIDE ───────────────────────────────────────
CREATE TABLE stats_override (
  stat_id       text PRIMARY KEY,
  label         text,
  value         int,
  suffix        text,
  is_visible    boolean
);

-- ── CONTACT ENQUIRIES ────────────────────────────────────
CREATE TABLE contact_enquiries (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text NOT NULL,
  email           text NOT NULL,
  phone           text,
  event_type      text,
  event_date      date,
  guest_count     text,
  budget          text,
  message         text,
  status          text DEFAULT 'new' CHECK (status IN ('new','read','replied','archived')),
  is_starred      boolean DEFAULT false,
  internal_note   text,
  created_at      timestamptz DEFAULT now()
);

CREATE INDEX idx_enquiries_status ON contact_enquiries(status);
CREATE INDEX idx_enquiries_created ON contact_enquiries(created_at DESC);

-- ── MEDIA ASSETS ─────────────────────────────────────────
CREATE TABLE media_assets (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename      text NOT NULL,
  r2_key        text NOT NULL UNIQUE,
  folder        text,
  size_bytes    int,
  width         int,
  height        int,
  mime_type     text DEFAULT 'image/webp',
  created_at    timestamptz DEFAULT now()
);

-- ── SITE SETTINGS ────────────────────────────────────────
CREATE TABLE site_settings (
  key           text PRIMARY KEY,
  value         text,
  updated_at    timestamptz DEFAULT now()
);

-- ── BOOKINGS ─────────────────────────────────────────────
CREATE TABLE bookings (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enquiry_id            uuid REFERENCES contact_enquiries(id),
  razorpay_order_id     text UNIQUE,
  razorpay_payment_id   text,
  amount_paise          int,
  status                text DEFAULT 'pending' CHECK (status IN ('pending','paid','failed','refunded')),
  created_at            timestamptz DEFAULT now()
);

-- ══════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ══════════════════════════════════════════════════════════
ALTER TABLE section_config      ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides         ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_events    ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_images    ENABLE ROW LEVEL SECURITY;
ALTER TABLE services_override   ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials        ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members        ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats_override      ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_enquiries   ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_assets        ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings       ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings            ENABLE ROW LEVEL SECURITY;

-- Public: read non-sensitive data
CREATE POLICY "public_read" ON section_config     FOR SELECT USING (true);
CREATE POLICY "public_read" ON hero_slides        FOR SELECT USING (is_visible = true);
CREATE POLICY "public_read" ON portfolio_events   FOR SELECT USING (is_visible = true);
CREATE POLICY "public_read" ON portfolio_images   FOR SELECT USING (is_visible = true);
CREATE POLICY "public_read" ON services_override  FOR SELECT USING (true);
CREATE POLICY "public_read" ON testimonials       FOR SELECT USING (is_visible = true);
CREATE POLICY "public_read" ON team_members       FOR SELECT USING (is_visible = true);
CREATE POLICY "public_read" ON stats_override     FOR SELECT USING (true);
CREATE POLICY "public_read" ON site_settings      FOR SELECT USING (true);
CREATE POLICY "public_insert" ON contact_enquiries FOR INSERT WITH CHECK (true);

-- Authenticated admin: full access
CREATE POLICY "admin_all" ON section_config      FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all" ON hero_slides         FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all" ON portfolio_events    FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all" ON portfolio_images    FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all" ON services_override   FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all" ON testimonials        FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all" ON team_members        FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all" ON stats_override      FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all" ON contact_enquiries   FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all" ON media_assets        FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all" ON site_settings       FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all" ON bookings            FOR ALL USING (auth.role() = 'authenticated');
