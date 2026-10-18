# Android app plan

Recommended path: React Native + Expo, sharing the same Supabase project and secure server API as the website.

Screens:
1. Welcome / choose Customer or Professional
2. Phone OTP login
3. Customer: location permission, services, nearby professionals, worker profile, booking, payment, booking history, reviews
4. Worker: registration, service selection, service area, verification status, availability, incoming jobs, earnings
5. Admin: keep the first admin dashboard web-only and protect it with server-enforced admin authorization

Do not collect precise location until the user grants permission. Explain why location is needed and allow manual city/PIN-code search. Never store payment card details. Use a payment provider's hosted/SDK flow and verify payment signatures server-side.
