# Astrology Frontend Project Overview

## Project Summary
This is a React + Vite frontend project for an astrology-themed website. It uses Tailwind CSS for styling, React Router for navigation, and includes a variety of astrology tools, course pages, consultation pages, a webinar section, and admin interfaces.

## Key Technologies
- React 19
- Vite
- Tailwind CSS 4
- React Router DOM
- Axios
- Framer Motion
- Luxon
- React Helmet Async
- React Hot Toast
- XLSX

## Available Scripts
- `npm run dev` - start the development server
- `npm run build` - build the production site
- `npm run preview` - preview the production build
- `npm run lint` - run ESLint across the project

## Project Structure

### Root Files
- `index.html` - app shell and entry HTML
- `package.json` - dependencies and scripts
- `vite.config.js` - Vite configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `public/` - static assets, redirects, sitemap, robots, CSS, JS, images, fonts

### Source Code (`src/`)
- `main.jsx` - app bootstrap
- `App.jsx` - main application wrapper
- `index.css`, `tools.css` - global styles

### Components
- `Header.jsx`
- `Footer.jsx`
- `ScrollToTop.jsx`
- `SEO.jsx`
- `CookieConsent.jsx`
- `ConsultationModal.jsx`
- `SuccessModal.jsx`

### Tools
- `HoroscopeTool.jsx`
- `KundaliChart.jsx`
- `KundaliTool.jsx`
- `LoveCalculator.jsx`
- `MoonTool.jsx`
- `NumerologyTool.jsx`
- `PlaceAutocomplete.jsx`
- `ZodiacFinder.jsx`

### Webinar
- `HeroSection.jsx`
- `LearnSection.jsx`
- `MentorSection.jsx`
- `ItinerarySection.jsx`
- `FaqSection.jsx`
- `PatternsSection.jsx`
- `NewsCarousel.jsx`
- `TextReviewCarousel.jsx`
- `VideoReviewCarousel.jsx`
- `LogoCarousel.jsx`
- `PictureGallery.jsx`
- `FixedBottomCTA.jsx`
- `CountdownTimer.jsx`
- `RegistrationModal.jsx` / `RegistrationModal.css`

### Layouts and Context
- `layouts/MainLayout.jsx`
- `context/SettingsContext.jsx`
- `utils/api.js`
- `data/coursesData.js`

### Pages
The app includes many ready-made pages for the astrology website:
- `Home.jsx`
- `LandingPage.jsx`
- `FreeTools.jsx`
- `Consultations.jsx`
- `ConsultationDetail.jsx`
- `Courses.jsx`, `CourseDetail.jsx`, `CourseInquiry.jsx`
- `Astrologer.jsx`
- `AstroShop.jsx`, `ShopCategory.jsx`, `ShopCheckout.jsx`
- `Love.jsx`, `Numerology.jsx`, `PredictiveAstrology.jsx`, `VedicCourse.jsx`, `Tarot.jsx`, `AdvancedAstrology.jsx`
- `Blog.jsx`, `BlogDetail.jsx`
- `Contact.jsx`, `About.jsx`, `PrivacyPolicy.jsx`, `Terms.jsx`, `Cancellation.jsx`
- `Payment.jsx`, `PaymentSuccess.jsx`, `PaymentFailed.jsx`
- `Careers.jsx`
- Admin pages: `AdminLogin.jsx`, `AdminDashboard.jsx`, `AdminBlogs.jsx`, `AdminJobs.jsx`, `AdminLeads.jsx`, `AdminNewsletter.jsx`, `AdminSettings.jsx`

## Completed Work
Based on the repository contents, the frontend implementation includes:
- A full React/Vite application scaffold with routing and layout support
- Multiple astrology tools and interactive components
- Dedicated webinar page sections and modular content components
- Admin dashboard and admin management pages
- SEO, consent, modals, and scroll behavior components
- Static assets and styles organized under `public/`
- Utility layer for API access and course data

## Notes
- No `README.md` file was present in the project root at the time of this summary.
- The project appears ready for local development via `npm run dev` and production build through `npm run build`.
