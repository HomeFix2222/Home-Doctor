# HomeFix — Full-stack starter (Website + Android-ready API)

This is a starter project structure for an India-wide home-services marketplace.

## Included
- Next.js web app starter
- Supabase SQL schema for customers, workers, services, bookings, reviews
- Server-side booking endpoint scaffold
- Razorpay payment-order endpoint scaffold
- WhatsApp booking-message helper
- Admin/worker/customer roles in the data model
- Android app integration notes

## Important
This is a development starter, NOT a deployed production service. Before accepting real customers/payments:
1. Create a Supabase project and run `supabase/schema.sql`.
2. Set environment variables from `.env.example`.
3. Implement and test OTP authentication, role checks, worker verification, booking state transitions, reviews, payment signature verification, refunds, privacy and security controls.
4. Configure Razorpay in test mode first.
5. Deploy the web app and separately build an Android app (for example, with React Native/Expo) using the same backend/API.

Never put secret keys in browser/client code or commit `.env.local`.
