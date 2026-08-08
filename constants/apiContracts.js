/**
 * Eco Swadesh - Production Backend API Contract Specifications
 * Target Backend Engineer: Kalpesh
 * Architecture: RESTful / Node.js Express / Firebase Cloud Functions / Firestore
 */

export const API_CONTRACTS = {
  version: '1.0.0',
  baseUrl: 'https://api.ecoswadesh.com/v1',
  
  endpoints: {
    // 1. Authentication & Onboarding
    auth: {
      sendOTP: {
        method: 'POST',
        path: '/auth/send-otp',
        requestBody: { phoneNumber: '+919876543210', countryCode: 'IN' },
        responseSchema: { success: true, otpSessionId: 'sess_9901', expireSeconds: 300 },
      },
      verifyOTP: {
        method: 'POST',
        path: '/auth/verify-otp',
        requestBody: { otpSessionId: 'sess_9901', otpCode: '123456', persona: 'farmer' },
        responseSchema: {
          success: true,
          token: 'jwt_token_string',
          user: { id: 'usr_101', name: 'Farmer Name', persona: 'farmer', verified: true },
        },
      },
    },

    // 2. Marketplace & Products (Retail & Direct Bulk Tonnage)
    products: {
      list: {
        method: 'GET',
        path: '/products',
        queryParams: ['category', 'certifiedType', 'orderMode', 'page', 'limit'],
        responseSchema: {
          total: 124,
          page: 1,
          products: [
            {
              id: 'prod-001',
              name: 'Bio-NPK Liquid Fertilizer 20L',
              category: 'fertilizers',
              certifiedType: 'LOCAL_GOV',
              certName: 'Jaivik Bharat & State Board Seal',
              certLicense: 'NPOP/NAB/0014/2025',
              retailPrice: 4200,
              bulkPricePerTon: 38000,
              bulkMinTons: 2,
              labPurityRating: 99.8,
              inStock: true,
            },
          ],
        },
      },
      create: {
        method: 'POST',
        path: '/products',
        headers: { Authorization: 'Bearer {token}' },
        requestBody: {
          name: 'Organic Wheat 20 Tons',
          category: 'bulkHarvest',
          certifiedType: 'NATIONAL_GOV',
          retailPrice: 45,
          bulkPricePerTon: 42000,
          bulkMinTons: 10,
          origin: 'Punjab, India',
        },
        responseSchema: { success: true, productId: 'prod-9902' },
      },
    },

    // 3. Orders, Cart & Escrow Protection
    orders: {
      createEscrowOrder: {
        method: 'POST',
        path: '/orders/escrow',
        headers: { Authorization: 'Bearer {token}' },
        requestBody: {
          items: [{ productId: 'prod-001', isBulk: true, quantityTons: 10, agreedPricePerTon: 42000 }],
          logisticsType: 'HEAVY_FREIGHT',
          shippingAddress: 'Central Warehouse, Delhi, IN',
        },
        responseSchema: {
          orderId: 'ORD-2026-9041',
          escrowContractId: 'ESC-9041',
          grandTotal: 424500,
          escrowStatus: 'HELD_IN_ESCROW_POOL',
        },
      },
    },

    // 4. Logistics & Heavy Freight Truck Telemetry
    logistics: {
      getTracking: {
        method: 'GET',
        path: '/logistics/tracking/:shipmentId',
        responseSchema: {
          shipmentId: 'SHIP-901',
          type: 'BULK_FREIGHT',
          vehicleNo: 'MH-12-QX-4409',
          driverName: 'Gurpreet Singh',
          driverPhone: '+919812345678',
          telemetry: { temperatureCelsius: 5.4, humidityPct: 62 },
          milestones: [
            { label: 'Dispatched from Certified Farm', completed: true, timestamp: '2026-07-24T08:00:00Z' },
            { label: 'Weighbridge Mass Verification', completed: true, timestamp: '2026-07-24T11:30:00Z' },
            { label: 'In Transit', completed: true, timestamp: '2026-07-24T14:00:00Z' },
            { label: 'Destination Lab Inspection', completed: false },
          ],
        },
      },
    },

    // 5. Anti-Counterfeit QR Seal Verification
    verification: {
      verifyQRSeal: {
        method: 'GET',
        path: '/verify/qr/:sealCode',
        responseSchema: {
          authentic: true,
          certName: 'Jaivik Bharat / USDA Organic',
          issuingAuthority: 'APEDA Ministry of Commerce',
          licenseNo: 'NPOP/NAB/0014/2025',
          verifiedScore: 99.8,
        },
      },
    },

    // 6. AI Leaf Scanner & Disease Detection
    ai: {
      diagnoseLeaf: {
        method: 'POST',
        path: '/ai/diagnose-leaf',
        requestBody: { imageBase64: 'data:image/jpeg;base64,...', cropType: 'cotton' },
        responseSchema: {
          diseaseDetected: 'Early Bacterial Leaf Blight',
          confidenceScore: 0.94,
          organicRecipes: [
            'Spray 5ml/L Cold-Pressed Neem Oil with 2g/L Baking Soda solution.',
            'Apply Trichoderma viride bio-fungicide during early morning hours.',
          ],
        },
      },
    },
  },
};
