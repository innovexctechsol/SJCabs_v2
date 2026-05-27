SJ Cabs v2 🚖
Pune's Premium Cab Service — Full-Stack Web Platform
Built and managed by InnovExc Tech Solutions Pvt Ltd
---
🌐 Live Platform
Portal	File	Access
Main Website	`sjcabs.html`	Public
Customer Portal	`login.html`	OTP Login
Driver App	`driver.html`	Registered Drivers
Admin Panel	`admin.html`	`admin` / `sj2025`
Captain Onboarding	`captain.html`	Public
Captain Status	`captain-status.html`	OTP Login
---
📁 File Structure
```
SJCabs_v2/
├── sjcabs.html          → Main public website
├── login.html           → Customer login & dashboard
├── driver.html          → Driver partner portal
├── admin.html           → Admin panel & backend
├── captain.html         → Captain onboarding form
├── captain-status.html  → Captain registration status
├── README.md            → This file
└── .gitignore           → Git ignore rules
```
---
✨ Features
🏠 Main Website (`sjcabs.html`)
Live booking widget — One Way / Round Trip / Hourly / Monthly
Google Maps Places Autocomplete on all location fields
Google Distance Matrix live fare calculator
GPS "Detect My Location" button on all pickup/drop fields
7 popular routes with instant fare preview
Customer login drawer — WhatsApp OTP + Google SSO
Round Robin driver assignment engine
3-step payment modal — GPay QR / Bank Transfer / Cash
Full payment options — Upfront or ₹100 advance + balance to driver
Canvas hero animation (night cityscape)
FAQ accordion, fleet showcase, fare table, testimonials
👤 Customer Portal (`login.html`)
WhatsApp OTP + Google SSO login
Live ride tracking dashboard
Booking history — upcoming / completed / cancelled
⭐ Feedback tab — rate driver, vehicle, overall experience
General feedback submission
Edit profile — name, mobile, email, gender, DOB
Saved addresses (up to 10)
Data export & account deletion
🧑‍✈️ Driver App (`driver.html`)
Mobile number OTP login (registered drivers only)
Dashboard with today's stats & active ride banner
Accept → On My Way → Picked Up → Complete ride flow
4-step visual progress tracker per booking
WhatsApp & call buttons to customer
Earnings summary — today / week / month
On Duty / Off Duty toggle
Auto-refresh every 8 seconds
⚙️ Admin Panel (`admin.html`)
Overview KPIs — live bookings, revenue, driver stats
All Bookings — searchable, filterable, reassignable
Booking detail modal with approve / cancel / reassign
Driver management with call / WhatsApp actions
Fleet status per cab
Revenue report with per-driver earnings chart
Captain Registrations — 10 granular status controls
Captain Verification Workspace — 9-tab deep review panel
Vehicle, RC, Insurance, Photos, Driver, Aadhaar, DL, PVC, Decision
DL cross-check tool with Sarathi Parivahan links
Physical inspection checklist (9 items)
Approval blocks until all sections pass
WhatsApp notification on approve/reject
Driver Performance — scorecards, appraisal records
Customer Feedback Inbox — filter, review, flag
🚗 Captain Onboarding (`captain.html`)
5-step registration wizard
14 manufacturers, 80+ models, 100s of variants (India)
Date of purchase validation — 2-year eligibility rule
Camera-first file upload for all documents
Vehicle photos — Front / Right / Left / Rear / Interior
Aadhaar, DL, Police Verification Certificate upload
PVC date validation — must be within 6 months
Declaration checkbox + success popup with WhatsApp notification
📋 Captain Status (`captain-status.html`)
OTP login by registered mobile number
10 status stages with visual timeline
Rejection reason shown clearly
Pending documents list with re-upload link
WhatsApp contact button
---
💳 Payment Configuration
Update these values in `sjcabs.html` before going live:
```
UPI ID:         sjcabs@ybl
GPay Number:    70576 91597
Bank:           HDFC Bank
Account Name:   SJ Cabs Transport Services
Account No:     5020 0174 2839 21
IFSC:           HDFC0001234
```
---
🗺️ Google Maps Setup
In `sjcabs.html`, replace `YOUR_API_KEY` (appears twice) with your key:
```html
<script async defer
  src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places&callback=onGMapsReady">
</script>
```
Enable these APIs in Google Cloud Console:
Maps JavaScript API
Places API
Distance Matrix API
Geocoding API
---
🚀 Deployment
Hostinger
Upload all 6 HTML files to `public_html/`
Rename `sjcabs.html` → `index.html` (or set as default document)
All files must be in the same directory
Netlify (Drag & Drop)
Go to netlify.com
Drag the folder containing all 6 files
Done — live in 30 seconds
GitHub Pages
Go to Settings → Pages
Source: Deploy from branch → `main` → `/ (root)`
Visit `https://innovexctechsol.github.io/SJCabs_v2/sjcabs.html`
---
🔐 Security Notes
Change admin password before going live: search `sj2025` in `admin.html`
All data uses `localStorage` — per-device only
For multi-device live data: connect a backend (Firebase / Supabase)
Google Maps API key: restrict to your domain in Cloud Console
---
👥 Demo Credentials
Portal	Login	Password/OTP
Admin Panel	`admin`	`sj2025`
Customer Login	Any valid mobile	`1234`
Driver Login — Suresh	`9823456789`	`1234`
Driver Login — Rajesh	`9765432109`	`1234`
Driver Login — Vijay	`9543210987`	`1234`
Captain Status	Registered mobile	`1234`
---
🏢 About
SJ Cabs — Pune's trusted premium cab service  
Intra-city · Outstation · Hourly · Monthly  
Available 24/7 · No surge pricing · Verified drivers
Developed by:  
InnovExc Tech Solutions Pvt Ltd  
📍 A1 A906, Kumar Paradise, Magarpatta, Hadapsar, Pune 411028  
🌐 www.innovexc.io  
📧 support@innovexc.io
---
© 2025 SJ Cabs · Managed by InnovExc Tech Solutions Pvt Ltd
