-- ============================================================================
-- ECO SWADESH - PRODUCTION POSTGRESQL / SUPABASE DATABASE SCHEMA
-- Organic Agronomy, APEDA NPOP Trust Verification, Multi-Party Escrow,
-- PostGIS Geo-Climatic Spatial Mapping & DPDP 2023 Compliance
-- ============================================================================

-- 1. EXTENSIONS & PREREQUISITES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 2. ENUMS & DOMAINS
DO $$ BEGIN
  CREATE TYPE user_persona AS ENUM ('farmer', 'consumer', 'bulkBuyer', 'seller', 'expert', 'admin');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE cert_authority_type AS ENUM ('APEDA_NPOP', 'PGS_INDIA', 'JAIVIK_BHARAT', 'EU_ORGANIC', 'USDA_NOP');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE escrow_status_type AS ENUM ('LOCKED_IN_ESCROW', 'ASSAY_PENDING', 'WEIGHBRIDGE_VERIFIED', 'RELEASED_TO_SELLER', 'REFUNDED_TO_BUYER', 'DISPUTED_HOLD');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE dispute_status_type AS ENUM ('OPENED', 'UNDER_NABL_LAB_REVIEW', 'SETTLED_PRO_RATA', 'SETTLED_FULL_REFUND', 'REJECTED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 3. PROFILES TABLE (Linked with Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone TEXT UNIQUE,
  email TEXT UNIQUE,
  name TEXT NOT NULL,
  persona user_persona NOT NULL DEFAULT 'farmer',
  roles TEXT[] NOT NULL DEFAULT ARRAY['farmer'],
  verified BOOLEAN DEFAULT FALSE,
  state TEXT,
  district TEXT,
  village TEXT,
  address TEXT,
  farm_size_acres NUMERIC(8, 2),
  primary_crops TEXT[] DEFAULT ARRAY[]::TEXT[],
  certifications TEXT[] DEFAULT ARRAY[]::TEXT[],
  fpo_name TEXT,
  soil_health_card_id TEXT,
  extra_detail TEXT,
  gstin TEXT,
  avatar_url TEXT,
  trust_score INTEGER DEFAULT 80 CHECK (trust_score >= 0 AND trust_score <= 100),
  dpdp_consent BOOLEAN DEFAULT TRUE,
  onboarding_completed BOOLEAN DEFAULT TRUE,
  location GEOMETRY(Point, 4326),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. CERTIFICATIONS & TRUST REGISTER
CREATE TABLE IF NOT EXISTS public.certifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  cert_number TEXT NOT NULL UNIQUE,
  scheme cert_authority_type NOT NULL DEFAULT 'APEDA_NPOP',
  issuing_body TEXT NOT NULL,
  scope TEXT NOT NULL, -- e.g. 'Crop Production & Processing'
  valid_from DATE NOT NULL,
  valid_till DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'EXPIRED', 'SUSPENDED', 'UNDER_AUDIT')),
  digital_hash TEXT NOT NULL, -- 0x SHA-256 tamper-evident hash
  nabl_lab_accredited BOOLEAN DEFAULT TRUE,
  trust_weight INTEGER DEFAULT 95 CHECK (trust_weight >= 0 AND trust_weight <= 100),
  raw_certificate_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. PRODUCTS & MARKETPLACE LISTINGS
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL, -- 'Grains & Pulses', 'Spices', 'Bio-Fertilizers', 'Horticulture'
  sub_category TEXT,
  description TEXT,
  price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
  unit TEXT NOT NULL DEFAULT 'kg', -- 'kg', 'quintal', 'ton', 'litre'
  available_quantity NUMERIC(12, 2) NOT NULL DEFAULT 0,
  min_order_quantity NUMERIC(12, 2) NOT NULL DEFAULT 1,
  image_url TEXT,
  gallery_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
  cert_scheme TEXT NOT NULL DEFAULT 'NPOP CERTIFIED',
  cert_number TEXT,
  cert_expiry DATE,
  nabl_lab_tested BOOLEAN DEFAULT FALSE,
  lab_assay_report_url TEXT,
  moisture_percentage NUMERIC(5, 2),
  synthetic_residue_detected BOOLEAN DEFAULT FALSE,
  harvest_date DATE,
  origin_state TEXT NOT NULL,
  origin_district TEXT NOT NULL,
  origin_mandi TEXT,
  in_stock BOOLEAN DEFAULT TRUE,
  location GEOMETRY(Point, 4326),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. ORDERS & ESCROW CONTRACTS
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_code TEXT NOT NULL UNIQUE, -- e.g. 'ORD-2026-9041'
  buyer_id UUID NOT NULL REFERENCES public.profiles(id),
  seller_id UUID NOT NULL REFERENCES public.profiles(id),
  product_id UUID REFERENCES public.products(id),
  quantity NUMERIC(12, 2) NOT NULL,
  unit_price NUMERIC(12, 2) NOT NULL,
  total_amount NUMERIC(14, 2) NOT NULL,
  escrow_amount NUMERIC(14, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  payment_method TEXT NOT NULL DEFAULT 'RAZORPAY_ESCROW', -- 'RAZORPAY_ESCROW', 'STRIPE_DIASPORA', 'UPI_INSTANT'
  payment_gateway_order_id TEXT,
  payment_gateway_payment_id TEXT,
  escrow_status escrow_status_type NOT NULL DEFAULT 'LOCKED_IN_ESCROW',
  delivery_status TEXT NOT NULL DEFAULT 'PROCESSING' CHECK (delivery_status IN ('PROCESSING', 'IN_TRANSIT', 'DISPATCHED', 'WEIGHBRIDGE_PENDING', 'DELIVERED', 'CANCELLED')),
  weighbridge_slip_verified BOOLEAN DEFAULT FALSE,
  lab_sample_passed BOOLEAN DEFAULT FALSE,
  shipping_address JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. ORDER DISPUTES & NABL LAB REVIEWS
CREATE TABLE IF NOT EXISTS public.disputes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  claimant_id UUID NOT NULL REFERENCES public.profiles(id),
  reason TEXT NOT NULL, -- 'MOISTURE_EXCURSION', 'SYNTHETIC_PESTICIDE_RESIDUE', 'WEIGHT_SHORTAGE', 'TRANSIT_DAMAGE'
  description TEXT NOT NULL,
  claimant_evidence_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
  nabl_seal_id TEXT,
  nabl_test_report_url TEXT,
  status dispute_status_type NOT NULL DEFAULT 'OPENED',
  escrow_hold_amount NUMERIC(14, 2) NOT NULL,
  refund_awarded_amount NUMERIC(14, 2) DEFAULT 0,
  seller_released_amount NUMERIC(14, 2) DEFAULT 0,
  resolution_notes TEXT,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. IOT COLD-CHAIN & LOGISTICS TELEMETRY
CREATE TABLE IF NOT EXISTS public.iot_telemetry (
  id BIGSERIAL PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  sensor_id TEXT NOT NULL,
  temperature_c NUMERIC(5, 2) NOT NULL,
  humidity_rh NUMERIC(5, 2) NOT NULL,
  temperature_excursion BOOLEAN DEFAULT FALSE,
  humidity_excursion BOOLEAN DEFAULT FALSE,
  location GEOMETRY(Point, 4326),
  latitude NUMERIC(10, 6),
  longitude NUMERIC(10, 6),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. COMMUNITY AGRONOMY DISCUSSIONS
CREATE TABLE IF NOT EXISTS public.community_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  crop_type TEXT,
  category TEXT NOT NULL DEFAULT 'Agronomy Advice',
  image_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
  upvotes_count INTEGER NOT NULL DEFAULT 0,
  is_expert_verified BOOLEAN DEFAULT FALSE,
  flagged BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.community_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  upvotes_count INTEGER NOT NULL DEFAULT 0,
  is_accepted_expert_solution BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. DPDP 2023 CONSENT & AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.dpdp_consents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  consent_type TEXT NOT NULL DEFAULT 'MARKETPLACE_TERMS_AND_DATA_PROCESSING',
  consent_granted BOOLEAN NOT NULL DEFAULT TRUE,
  legal_framework TEXT NOT NULL DEFAULT 'Digital Personal Data Protection Act (DPDP), 2023',
  ip_address TEXT,
  user_agent TEXT,
  granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID REFERENCES public.profiles(id),
  actor_role TEXT NOT NULL DEFAULT 'system',
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  reason TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 11. INDEXES FOR HIGH-THROUGHPUT QUERIES & GIS SPATIAL LOOKUPS
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);
CREATE INDEX IF NOT EXISTS idx_products_seller ON public.products(seller_id);
CREATE INDEX IF NOT EXISTS idx_products_instock ON public.products(in_stock);
CREATE INDEX IF NOT EXISTS idx_orders_buyer ON public.orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_seller ON public.orders(seller_id);
CREATE INDEX IF NOT EXISTS idx_orders_escrow_status ON public.orders(escrow_status);
CREATE INDEX IF NOT EXISTS idx_iot_order ON public.iot_telemetry(order_id);
CREATE INDEX IF NOT EXISTS idx_iot_recorded_at ON public.iot_telemetry(recorded_at);

-- Spatial GIST Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_location_gist ON public.profiles USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_products_location_gist ON public.products USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_iot_location_gist ON public.iot_telemetry USING GIST(location);

-- ============================================================================
-- 12. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.iot_telemetry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dpdp_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are readable by authenticated users" ON public.profiles
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Products Policies
CREATE POLICY "Active products are visible to all users" ON public.products
  FOR SELECT USING (in_stock = TRUE OR auth.uid() = seller_id);

CREATE POLICY "Verified sellers and farmers can insert products" ON public.products
  FOR INSERT WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can update their own products" ON public.products
  FOR UPDATE USING (auth.uid() = seller_id);

CREATE POLICY "Sellers can delete their own products" ON public.products
  FOR DELETE USING (auth.uid() = seller_id);

-- Orders Policies
CREATE POLICY "Buyers and Sellers can view their respective orders" ON public.orders
  FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Buyers can create new escrow orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = buyer_id);

-- Community Policies
CREATE POLICY "Community posts viewable by everyone" ON public.community_posts
  FOR SELECT USING (TRUE);

CREATE POLICY "Authenticated users can create community posts" ON public.community_posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Community answers viewable by everyone" ON public.community_answers
  FOR SELECT USING (TRUE);

CREATE POLICY "Authenticated users can submit answers" ON public.community_answers
  FOR INSERT WITH CHECK (auth.uid() = author_id);

-- ============================================================================
-- 13. STORED FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function: Automatic UpdatedAt timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_products_updated_at ON public.products;
CREATE TRIGGER trg_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_orders_updated_at ON public.orders;
CREATE TRIGGER trg_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Function: Nearby Products via PostGIS Spatial Radius
CREATE OR REPLACE FUNCTION public.get_nearby_products(
  user_lat NUMERIC,
  user_lng NUMERIC,
  radius_meters NUMERIC DEFAULT 50000
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  category TEXT,
  price NUMERIC,
  unit TEXT,
  origin_state TEXT,
  origin_district TEXT,
  distance_meters NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.title,
    p.category,
    p.price,
    p.unit,
    p.origin_state,
    p.origin_district,
    ST_Distance(
      p.location,
      ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography
    )::NUMERIC AS distance_meters
  FROM public.products p
  WHERE p.in_stock = TRUE
    AND p.location IS NOT NULL
    AND ST_DWithin(
      p.location,
      ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography,
      radius_meters
    )
  ORDER BY distance_meters ASC;
END;
$$ LANGUAGE plpgsql;
