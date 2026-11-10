# 🩸 Blood Hero – Frontend Application

[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **"Saving Lives, Spreading Smiles."**  
> A premium, responsive, privacy-first web application connecting voluntary blood donors with hospitals, patients, and community blood drives in real time.

---

## 🎨 Brand Design System

Inspired by modern humanist UI and reference mobile designs:

| Element | Color Code | Purpose |
| :--- | :--- | :--- |
| **Primary Red** | `#BB2B29` | Primary buttons, active tabs, vital badges |
| **Dark Red** | `#530404` | Deep contrast headings, dark card accents |
| **Light Pink** | `#FFE8E8` | Light surface backgrounds, soft pill containers |
| **Soft Pink** | `#ECA0A0` | Subtle gradient transitions and borders |
| **Surface White** | `#FFFFFF` | Core surfaces and elevation layers |

- **Typography**: Clean geometric typography (`Plus Jakarta Sans` / modern system stack).
- **Responsive Layouts**: Designed mobile-first with a dedicated floating bottom navigation dock (`MobileBottomNav`) and horizontal swipeable tab bars for touch ergonomics.

---

## ✨ Features

- **Hero & Awareness Landing Page**: High-impact banner, live donation counters, 4-step workflow, and interactive FAQ accordions.
- **8-Blood Group Compatibility Matrix**: Interactive matrix detailing donor/recipient rules, population rarity, and instant 1-click matching queries.
- **Verified Donor Directory**: Filter donors by blood group, state, district, city, and immediate availability status.
- **Privacy-Preserving Contact Workflow**: Donor phone numbers and emails are masked. Requesters submit verified contact requests which donors review and accept in-app.
- **Emergency Blood Requests**: Hospital emergency board with priority badges (*Critical*, *Urgent*, *Normal*) and patient requirement tracking.
- **Community Donation Camps**: Listing of hospital-backed blood donation drives with instant volunteer slot registration.
- **User Dashboard**:
  - Live eligibility calculator (90-day cooldown interval).
  - Appointment scheduling and donation history.
  - Blood request tracker with matched donor counter.
  - Direct contact inquiry inbox (Accept/Decline workflows).
- **Admin Management Console**:
  - Real-time KPIs and blood type distribution metrics.
  - User suspension & role promotion toggles.
  - Direct 1-click CSV report exports for Donors, Requests, and Donations.
- **Dark Mode Support**: Full light and dark theme switching with seamless local storage persistence.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm** or **yarn** / **pnpm**
- Running **Blood Hero Backend API** (defaults to `http://localhost:5000/api`)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Shahid-cs22/blood-donation-frontend.git
   cd blood-donation-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   ```bash
   cp .env.example .env
   ```
   For local development (or leave default to use Vite proxy):
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
   For live production deployment (Render backend):
   ```env
   VITE_API_URL=https://blood-donation-backend-60mr.onrender.com/api
   ```

4. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

5. **Build for Production:**
   ```bash
   npm run build
   ```

---

## 📂 Project Structure

```
frontend/
├── public/                 # Static assets and icons
├── src/
│   ├── components/         # Reusable UI components (Navbar, Footer, DonorCard, etc.)
│   ├── context/            # React Context providers (Auth, Theme, Notification)
│   ├── pages/              # Application pages (Home, FindDonors, Dashboard, etc.)
│   ├── services/           # Axios API services (auth, donor, camp, donation, etc.)
│   ├── App.jsx             # Top-level routing & layout wrapper
│   ├── main.jsx            # React root mount
│   └── index.css           # Tailwind CSS directives & global custom styling
├── index.html              # HTML entry point
├── tailwind.config.js      # Tailwind theme configuration
├── vite.config.js          # Vite build config & proxy setup
└── package.json            # Project manifest & scripts
```

---

## 🛡️ License

This project is licensed under the [MIT License](LICENSE).

