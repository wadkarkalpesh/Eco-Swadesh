-- ============================================================================
-- ECO SWADESH - SUPABASE SEED DATA
-- Authentic Organic Farmers, NPOP Certifications, Products & Escrow Records
-- ============================================================================

-- 1. Insert Core Personas & Profiles (Assuming Auth IDs or Generated UUIDs)
INSERT INTO public.profiles (
  id, phone, email, name, persona, roles, verified, state, district, village,
  farm_size_acres, primary_crops, certifications, fpo_name, soil_health_card_id,
  trust_score, dpdp_consent, onboarding_completed
) VALUES
(
  '00000000-0000-0000-0000-000000000001',
  '+91 98230 11200',
  'ramesh.patel@ecoswadesh.com',
  'Ramesh Patel',
  'farmer',
  ARRAY['farmer', 'seller'],
  TRUE,
  'Madhya Pradesh',
  'Ujjain',
  'Pipliya Ragho',
  18.50,
  ARRAY['Organic Sharbati Wheat', 'Desi Cotton', 'Bio-Mustard'],
  ARRAY['NPOP/NAB/0014/2025', 'Jaivik Bharat MP-991'],
  'Malwa Narmada Organic Farmers Producer Co. Ltd.',
  'SHC-MP-UJJ-2025-09142',
  98,
  TRUE,
  TRUE
),
(
  '00000000-0000-0000-0000-000000000002',
  '+91 98765 43210',
  'priya.sharma@ecoswadesh.com',
  'Priya Sharma',
  'consumer',
  ARRAY['buyer', 'consumer'],
  TRUE,
  'Maharashtra',
  'Pune',
  'Kalyani Nagar',
  NULL,
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  NULL,
  NULL,
  92,
  TRUE,
  TRUE
),
(
  '00000000-0000-0000-0000-000000000003',
  '+91 94120 55678',
  'baldev.singh@fpoagro.in',
  'Baldev Singh',
  'bulkBuyer',
  ARRAY['buyer', 'bulkBuyer'],
  TRUE,
  'Punjab',
  'Ludhiana',
  'Samrala',
  NULL,
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  'AgroFlour Milling & Food Processing Corp',
  NULL,
  95,
  TRUE,
  TRUE
),
(
  '00000000-0000-0000-0000-000000000004',
  '+91 98900 33441',
  'vivek@biofertindia.com',
  'Dr. Vivek Deshmukh',
  'seller',
  ARRAY['seller', 'manufacturer'],
  TRUE,
  'Maharashtra',
  'Nashik',
  'Panchavati',
  NULL,
  ARRAY[]::TEXT[],
  ARRAY['NABL-BIO-2026-44', 'NPOP/NAB/0019/2025'],
  'BioFert Organic Inputs & Seed Laboratories Ltd.',
  NULL,
  99,
  TRUE,
  TRUE
),
(
  '00000000-0000-0000-0000-000000000005',
  '+91 98310 99887',
  'anita.roy@icar.gov.in',
  'Dr. Anita Roy',
  'expert',
  ARRAY['expert', 'moderator'],
  TRUE,
  'Delhi',
  'New Delhi',
  'Pusa Road',
  NULL,
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  'ICAR Organic Agronomy Research Council',
  NULL,
  100,
  TRUE,
  TRUE
)
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Certifications Register
INSERT INTO public.certifications (
  id, user_id, cert_number, scheme, issuing_body, scope,
  valid_from, valid_till, status, digital_hash, nabl_lab_accredited, trust_weight
) VALUES
(
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'NPOP/NAB/0014/2025',
  'APEDA_NPOP',
  'Aditi Organic Certifications Pvt. Ltd.',
  'Cereals, Pulses & Oilseeds Organic Production',
  '2025-01-01',
  '2027-12-31',
  'ACTIVE',
  '0x4a9b2c8e1f0345d9876543210fedcba9876543210fedcba9876543210fedcba9',
  TRUE,
  98
),
(
  '10000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000004',
  'NABL-BIO-2026-44',
  'JAIVIK_BHARAT',
  'National Accreditation Board for Testing Laboratories',
  'Bio-Inoculants, Trichoderma & Mycorrhizae Bio-Formulations',
  '2026-01-15',
  '2028-01-14',
  'ACTIVE',
  '0x8899aabbccddeeff00112233445566778899aabbccddeeff0011223344556677',
  TRUE,
  99
)
ON CONFLICT (cert_number) DO NOTHING;

-- 3. Insert Products Catalog
INSERT INTO public.products (
  id, seller_id, title, category, sub_category, description,
  price, unit, available_quantity, min_order_quantity, image_url,
  cert_scheme, cert_number, cert_expiry, nabl_lab_tested,
  moisture_percentage, synthetic_residue_detected, harvest_date,
  origin_state, origin_district, origin_mandi, in_stock
) VALUES
(
  '20000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'Certified Organic Sharbati Wheat (Grade A+ Premium)',
  'Grains & Pulses',
  'Wheat',
  'Sun-dried, golden amber high-protein organic Sharbati wheat grown using Jeevamrut in fertile black Malwa soil.',
  65.00,
  'kg',
  12500,
  50,
  'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&q=80',
  'APEDA NPOP & Jaivik Bharat',
  'NPOP/NAB/0014/2025',
  '2027-12-31',
  TRUE,
  10.8,
  FALSE,
  '2026-02-10',
  'Madhya Pradesh',
  'Ujjain',
  'Ujjain Krishi Upaj Mandi',
  TRUE
),
(
  '20000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000001',
  'Cold-Pressed Desi Yellow Mustard Seed (Pili Sarson)',
  'Grains & Pulses',
  'Oilseeds',
  'Heirloom non-GMO yellow mustard seeds with 41% oil content, zero synthetic pesticide residues.',
  110.00,
  'kg',
  4000,
  25,
  'https://images.unsplash.com/photo-1508851478344-1786548194e3?w=800&q=80',
  'APEDA NPOP',
  'NPOP/NAB/0014/2025',
  '2027-12-31',
  TRUE,
  8.2,
  FALSE,
  '2026-01-25',
  'Madhya Pradesh',
  'Ujjain',
  'Nagda Mandi',
  TRUE
),
(
  '20000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000004',
  'Trichoderma Viride 1.5% WP (Bio-Fungicide)',
  'Bio-Fertilizers',
  'Bio-Pesticides',
  'High-potency biological seed and soil treatment for root rot, damping off, and fungal wilt prevention.',
  320.00,
  'litre',
  800,
  5,
  'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=800&q=80',
  'NABL Certified & CIBRC Approved',
  'NABL-BIO-2026-44',
  '2028-01-14',
  TRUE,
  NULL,
  FALSE,
  '2026-02-01',
  'Maharashtra',
  'Nashik',
  'Nashik Agro Hub',
  TRUE
),
(
  '20000000-0000-0000-0000-000000000004',
  '00000000-0000-0000-0000-000000000001',
  'Traditional Basmati Paddy (PB-1121 Organic)',
  'Grains & Pulses',
  'Rice',
  'Aromatic extra-long grain organic paddy grown with zero chemical urea, certified NPOP organic.',
  78.00,
  'kg',
  25000,
  100,
  'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80',
  'APEDA NPOP & USDA-NOP Equivalent',
  'NPOP/NAB/0014/2025',
  '2027-12-31',
  TRUE,
  12.0,
  FALSE,
  '2025-11-20',
  'Punjab',
  'Ludhiana',
  'Khanna Mandi',
  TRUE
)
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Community Discussions
INSERT INTO public.community_posts (
  id, author_id, title, content, crop_type, category, upvotes_count, is_expert_verified
) VALUES
(
  '30000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'Preventing late-season fungal blight in organic wheat without synthetics',
  'We noticed early morning humidity spikes causing mild leaf rust indications. Using fermented buttermilk (Khatti Chhachh) spray with 2% neem oil. What dilution ratio works best?',
  'Wheat',
  'Disease Management',
  34,
  TRUE
),
(
  '30000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000005',
  'ICAR Standard Protocol: Natural preparation of Jeevamrut & Beejamrit',
  'Comprehensive step-by-step guide on culture fermentation, microbial population doubling, and optimal storage temperatures for maximum rhizobacterial colonization.',
  'Multi-Crop',
  'Soil Health',
  89,
  TRUE
)
ON CONFLICT (id) DO NOTHING;
