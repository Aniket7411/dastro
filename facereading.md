**DS ASTRO INSTITUTE**

**2-Day Face Reading Masterclass**

Landing Page - UI, UX & Conversion Fix Report

Prepared for the DS Astrology development team

Scope: dsastrology.com - Face Reading Masterclass landing page, registration modal, countdown bar and post-payment flow

| **Field**       | **Detail**                                                                             |
| --------------- | -------------------------------------------------------------------------------------- |
| Campaign        | Paid Facebook + Instagram ads → CTA → this landing page                                |
| Primary device  | Mobile - roughly 85-90% of paid social traffic. Every fix is mobile-first.             |
| Page objective  | Take a cold visitor from ad-click to a completed ₹499 registration in under 90 seconds |
| Page model      | Evergreen - no batch dates or timings on the page; the link never needs updating       |
| Document status | Version 1.0 - consolidated. Supersedes all earlier drafts.                             |
| Issues logged   | 14 items - 4 critical (P0), 6 high (P1), 4 medium (P2)                                 |

# **Contents**

| **§** | **Section**                                          | **Page** |
| ----- | ---------------------------------------------------- | -------- |
| 1     | How to use this document                             | 2        |
| 2     | Priority summary                                     | 2        |
| 3     | Critical issues (P0) - fix before any ad spend       | 4        |
| 4     | High priority issues (P1) - hierarchy and conversion | 8        |
| 5     | Medium priority issues (P2) - polish                 | 14       |
| 6     | Evergreen batch-date policy                          | 16       |
| 7     | FAQ block - approved copy                            | 19       |
| 8     | Post-payment flow                                    | 20       |
| 9     | Further conversion recommendations                   | 21       |
| 10    | Design reference - type scale, layering, tokens      | 23       |
| 11    | QA sign-off checklist                                | 25       |
| -     | Appendix A: Standard phrasing list                   | 26       |

# **1\. How to use this document**

Every issue is written in the same four-part format so a developer can implement it without asking follow-up questions:

- **What is wrong** - the observed behaviour on the live page.
- **Why it matters** - the business or conversion consequence, so priorities are not guessed.
- **What to change** - exact values: pixel sizes, font weights, spacing, colours, z-index, behaviour.
- **Done when** - the acceptance test. If this passes, the item is closed.

Where an issue needs to be explained to a non-technical reviewer, a line marked "In plain words" is included.

**Priority key -** P0 = blocks revenue, fix before the campaign is switched on. P1 = measurable conversion damage. P2 = polish, can follow in the next release.

# **2\. Priority summary**

| **ID** | **Issue**                                                     | **Priority** | **Area**               |
| ------ | ------------------------------------------------------------- | ------------ | ---------------------- |
| FR-01  | Countdown bar overlaps the registration form and blocks input | P0 - Bug     | Modal / layering       |
| FR-02  | Countdown only appears after tapping "Enroll Now"             | P0           | Urgency / sticky bar   |
| FR-03  | Registration modal has no hero image and no reassurance       | P0           | Form modal             |
| FR-04  | Hero headline - no emphasis on "30 Seconds"; no gap below it  | P1           | Hero                   |
| FR-05  | Info chips look flat and do not read as information           | P1           | Hero                   |
| FR-06  | Mentor photograph is thumbnail-sized                          | P1           | Mentor section         |
| FR-07  | CTA button - price has no emphasis, helper text too small     | P1           | All CTAs               |
| FR-08  | Body font too small in the content cards                      | P1           | Content sections       |
| FR-09  | Testimonial cards cut text mid-sentence                       | P1 - Bug     | Wall of Love           |
| FR-10  | Floating chat widgets collide with the CTA and timer          | P2 - Bug     | Global                 |
| FR-11  | FAQ accordion padding is uneven                               | P2           | FAQ                    |
| FR-12  | Countdown digits render unclearly                             | P2           | Timer                  |
| FR-13  | Footer contact details are not tappable                       | P2           | Footer                 |
| FR-14  | Remove all fixed dates - convert the page to evergreen        | P0           | Content / SEO / config |

# **3\. Critical issues (P0)**

_These four items must be closed before a single rupee of ad spend reaches the page._

## **FR-01 Countdown bar overlaps the registration form**

**P0 - BUG** | Modal / layering

**What is wrong.** If a user taps "Enroll - ₹499" on the black countdown strip, the registration form opens behind it. The strip stays parked over the lower part of the form, covering the Phone Number field and the "Complete Registration" button. The user must manually tap the small × on the strip before they can finish the form.

**Why it matters.** This is the most expensive bug on the page. The user has already decided to pay, and the interface physically blocks them. Most people will not work out that they need to close the timer first - they will assume the page is broken and leave. Every rupee of ad spend that reaches this point is wasted.

**In plain words.** Two things are trying to sit on top of each other at the bottom of the screen, and the wrong one is winning.

### **What to change**

This is a stacking-order problem and a state-management problem. Both need fixing.

- Establish one global z-index ladder. Different components are currently choosing their own values. Define these once in a shared token file and use nothing else:

\--z-page-content : 1

\--z-sticky-header : 100

\--z-floating-widget : 400 /\* Astro Chat pill, chat bubble \*/

\--z-timer-bar : 600 /\* sticky countdown strip \*/

\--z-modal-overlay : 900 /\* dark backdrop \*/

\--z-modal : 1000 /\* registration form \*/

\--z-toast : 1100

- Make the countdown modal-aware. Recommended behaviour: the sticky bottom bar hides when the modal opens, and the countdown is mirrored as a slim strip inside the modal header - same numbers, same deadline, one shared timer instance. The user never loses the urgency and nothing overlaps.
- Acceptable fallback: the bar stays fixed, but the modal receives padding-bottom equal to the bar height + 16px, and the modal's scroll container respects that inset so no field or button is ever behind it.
- Never rely on the user closing the bar manually.
- Single source of truth: the sticky bar and the in-modal strip must read from the same countdown state. Two independent setInterval timers will drift and display different numbers.
- Add the standard modal behaviour that is currently missing: lock body scroll while open and restore on close; close on backdrop tap and on Esc; trap keyboard focus inside the modal and move focus to the Full Name field on open; hide the floating chat widgets while the modal is open.

**Done when -** On iOS Safari and Android Chrome, opening the form from any entry point - hero CTA, mid-page CTA, sticky bar, countdown bar - shows all three fields and the submit button fully unobstructed, with no manual closing of any other element, at 360px, 390px and 430px widths.

## **FR-02 The countdown must be visible from page load**

**P0** | Urgency / sticky bar

**What is wrong.** The countdown only appears after the user taps "Enroll Now". A timer that has to be discovered does nothing.

**Why it matters.** The purpose of a countdown is passive, continuous pressure - the visitor should see the deadline shrinking while they read, from the first second on the page to the last. If they never tap, they never learn that the offer expires, and the ₹499 launch price loses its reason to exist.

**In plain words.** A timer nobody can see is not a timer.

### **What to change**

- Convert it into a permanent sticky footer bar, visible from page load, at every scroll position, until the user submits the form.

Bar layout - mobile, single line, 64-68px tall:

┌──────────────────────────────────────────────────────────┐

│ ₹499 ₹1,999 ENDS IN 21:44:09 \[ Enroll - ₹499 \] │

└──────────────────────────────────────────────────────────┘

price block countdown primary CTA

- **Price block:** ₹499 at 20px / weight 800 in accent orange; ₹1,999 at 13px, struck through, 55% opacity.
- **Countdown:** label "ENDS IN" at 10px uppercase, letter-spacing 0.10em, 60% opacity; digits at 17px / weight 700 with tabular numerals so they do not jitter each second.
- **CTA:** minimum height 48px, full label "Enroll - ₹499", never an icon alone.
- **Bar surface:** near-black #141118, 1px top hairline rgba(255,255,255,0.10), soft upward shadow so it reads as floating above the page.

- Layout safety: add padding-bottom: calc(68px + env(safe-area-inset-bottom)) to the page container so footer content and the final CTA are never hidden behind the bar. The env() value handles iPhone home-indicator clearance.
- Remove the × close control, or make it collapse the bar to a 28px strip that still shows the countdown. The bar should never disappear completely.
- Define the expired state before launch: either "Enrolment closed - join the waitlist" or an automatic rollover to the next cycle. It must never show frozen or negative numbers.

**Countdown logic -** Because the page carries no fixed event date (see FR-14), the countdown is anchored to a weekly price cycle rather than a class date. Full logic is specified in section 6.4.

**Done when -** The bar is visible within the first paint, stays fixed through the entire scroll on iOS Safari including the URL-bar collapse animation, never covers content, and shows the correct remaining time after a hard refresh.

## **FR-03 Registration modal has no hero image and no reassurance**

**P0** | Form modal

**What is wrong.** The modal opens with a purple header, three bullets, then a large empty white area before the fields. There is no image, no face, no visual anchor. It reads as a generic form rather than the final step of buying a class from a known astrologer.

**Why it matters.** This is the highest-anxiety moment on the page - the visitor is about to hand over name, email, phone and money. Everything that earned their trust (Damini's face, the television credibility, the student numbers) disappears at exactly the moment they need it most.

### **A. Add a hero image band at the top of the modal**

- Horizontal band, full modal width, 140-170px tall on mobile, object-fit: cover.
- Content: Damini's portrait on the right third, masterclass title lockup on the left, brand purple gradient behind. This should resemble the ad creative the visitor just clicked - visual continuity from ad to page to form is a measurable conversion factor.
- Supply srcset at 1x and 2x, WebP with a JPG fallback, and explicit width and height attributes to prevent layout shift.

### **B. Modal structure, top to bottom**

┌────────────────────────────────────────┐

│ \[ HERO BAND - Damini + title lockup \] │

├────────────────────────────────────────┤

│ Countdown strip: ENDS IN 21:44:09 │ <- mirrored, see FR-01

├────────────────────────────────────────┤

│ Reserve Your Seat │

│ 2 Days · 2 hrs/day · Live on Zoom │ <- currently missing

│ ₹499 ₹1,999 Launch offer │

├────────────────────────────────────────┤

│ Full Name \[\_**\_**\_**\_**\___\] │

│ Email Address \[\_**\_**\_**\_**\___\] │

│ Phone (WhatsApp) \[+91\]\[\_**\_**\___\_\] │

├────────────────────────────────────────┤

│ \[ Complete Registration - ₹499 \] │

│ Secured by Razorpay · UPI, cards │

│ Batch dates & Zoom link on WhatsApp │

│ right after registration │

│ Need help? WhatsApp +91 90055 75577 │

└────────────────────────────────────────┘

### **C. What is missing from the form today**

| **Missing item**                              | **Why it is needed**                                                        |
| --------------------------------------------- | --------------------------------------------------------------------------- |
| Class format line repeated in the modal       | The visitor must not close the form to check what they are buying           |
| Price and struck-through MRP inside the modal | The price currently disappears at the moment of the payment decision        |
| +91 country prefix, locked                    | Removes the most common phone-entry error                                   |
| Label "Phone (WhatsApp)"                      | Sets the expectation that the Zoom link arrives on WhatsApp                 |
| Inline validation                             | Today the user only learns of an error after submitting                     |
| Price in the button label                     | "Complete Registration" → "Complete Registration - ₹499"                    |
| A "what happens next" line                    | Removes the "will I actually get the link?" fear                            |
| WhatsApp support link                         | Catches a user with a doubt instead of losing them                          |
| Loading state on the button                   | Prevents double submission and double charges                               |
| A proper success screen                       | After payment, confirm clearly - do not return the user to the landing page |

### **D. Mobile input hygiene - small changes, high impact**

- type="email" with inputmode="email", and type="tel" with inputmode="numeric", so the correct keyboard opens.
- autocomplete="name", "email" and "tel" so the browser can autofill.
- Input font-size must be at least 16px. Anything smaller makes iOS Safari zoom in on focus, which visibly breaks the layout.
- Input height 48px minimum, 12px radius, and a visible 2px focus ring for accessibility.

**Done when -** The modal opens with the hero band visible without scrolling, all three fields plus the submit button are reachable in one thumb-scroll, the correct keyboards appear on iOS and Android, and no field triggers a Safari auto-zoom.

# **4\. High priority issues (P1)**

## **FR-04 Hero headline - emphasise "30 Seconds", fix the spacing below**

**P1** | Hero

**What is wrong.** "Read Any Person's Real Personality in 30 Seconds - Just by Looking at Their Face" emphasises "Real Personality" and "Face", but "30 Seconds" - the actual hook - is set in plain text. The sub-headline sits tight against the headline with no gap, so the whole block reads as one grey wall, and the two lines appear to sit on slightly different left insets.

**Why it matters.** "30 seconds" is the promise the entire campaign is built on. It is the phrase that stops the scroll. It should be the loudest three words on the page.

### **What to change**

| **Element**       | **Mobile** | **Desktop** | **Weight**                      | **Line-height** |
| ----------------- | ---------- | ----------- | ------------------------------- | --------------- |
| Eyebrow           | 12px       | 14px        | 600, uppercase, 0.10em tracking | 1.3             |
| H1                | 30px       | 46px        | 800                             | 1.15            |
| "30 Seconds" span | inherit    | inherit     | 900, accent orange              | -               |
| Sub-headline      | 16px       | 18px        | 400                             | 1.55            |

- Wrap the phrase in a span and give it accent orange #F0703C at weight 900, plus one restrained device - either a hand-drawn SVG underline that sits below the baseline and does not affect line-height, or a subtle warm glow. Choose one, not both.
- Consider reducing "Face" to normal weight. Three competing emphases in one sentence cancel each other out; let "Real Personality" and "30 Seconds" carry the line.
- Set margin-top 16px on mobile and 20px on desktop for the sub-headline, and constrain it to max-width 34ch on mobile and 52ch on desktop, centred. It currently runs edge to edge, which is what makes it look misaligned.
- Both lines must inherit the same page gutter token (20px mobile, 24px desktop). Do not set per-element padding.

**Done when -** "30 Seconds" is visibly the strongest phrase in the hero, and the headline and sub-headline share identical left and right insets with a clear gap between them.

## **FR-05 Info chips do not read as information**

**P1** | Hero

**What is wrong.** The four data points sit flat on the background at a small size, with label and value at nearly the same visual weight. They do not pop, and the eye skips them.

**Why it matters.** These four facts answer the questions every visitor has before they will consider paying. They must be scannable in a single glance.

### **What to change**

- Give each one a real card: background rgba(255,255,255,0.06), 1px border rgba(255,255,255,0.14), 14px radius, padding 14px 12px.
- A 20px icon at the top in the accent colour.
- Label beneath the icon: 10px, uppercase, weight 600, letter-spacing 0.10em, opacity 0.65.
- Value: 16px on mobile and 18px on desktop, weight 700, full opacity. The contrast between a tiny label and a bold value is what makes a chip pop.
- Grid: 2 × 2 on mobile with a 10px gap, 4 × 1 on desktop with a 16px gap, equal heights.

Chip contents - note these are the evergreen set, with dates removed per FR-14:

┌──────────────────┬──────────────────┐

│ DURATION │ SESSIONS │

│ 2 Days │ 2 hrs / day │

├──────────────────┼──────────────────┤

│ FORMAT │ ACCESS │

│ Live on Zoom │ Recording incl.│

└──────────────────┴──────────────────┘

● Next batch starting soon - limited seats

The urgency line beneath the grid sits at 13px in the accent colour with a small pulsing dot. It replaces the date as the time-pressure signal.

**Done when -** From an arm's-length glance at a phone, a viewer can correctly state the format and the length of the class.

## **FR-06 Mentor photograph is thumbnail-sized**

**P1** | Mentor section

**What is wrong.** In "Meet Your Mentor" the portrait renders at thumbnail scale beside a long block of bullet copy. It looks like a placeholder.

**Why it matters.** For an astrology masterclass the mentor is the product. Trust transfers through her face, not through a bullet list. A small image reads as "we do not have a good photograph of her", which is the opposite of the television-featured positioning.

### **What to change**

- **Sizing:** minimum 280 × 350px on mobile in a 4:5 portrait crop; 380-440px wide on desktop. Not a circular avatar - a proper portrait.
- **Layout:** on mobile, image on top at full container width with the credentials below. On desktop, two columns - image left at 40%, copy right at 60%, vertically centred.
- **Treatment:** 16px radius, 1px warm border, and a soft accent glow or thin offset frame behind it. Add a small caption chip on the image reading "Featured on national TV" so the credibility marker travels with the face.
- **Technical:** source image at least 900px wide, srcset 1x/2x, WebP, explicit dimensions, object-fit: cover with object-position: center top so the crop never cuts her face.
- **Proof placement:** move the three numbers - 10,000+ students, 500+ consultations, featured on national TV - directly beneath the portrait as compact stat blocks, so the proof and the person sit together.

**Note on the television credit -** Use your own branded edit or a text credit. Do not place the broadcaster's logo or footage on the page.

**Done when -** Damini's face is the largest single visual element in that section on both mobile and desktop, and the image is sharp on a 3x-density phone screen.

## **FR-07 CTA button - price has no emphasis, helper text too small**

**P1** | All CTAs

**What is wrong.** Inside the button, "₹499" is the same size and colour as "Join Masterclass", so the offer price disappears into the label. Beside it, the supporting line about limited seats and the recording is set too small to read.

### **What to change**

- Split the type inside the button: "Join Masterclass" at 17px weight 600 in white; "- ₹499" at 20px weight 800 in the bright accent. Place ₹1,999 struck through inside or immediately under the button - anchor pricing only works when both numbers are visible together.
- Button minimum height 52px, full width on mobile with 20px side gutters, 12px radius.
- Move the supporting line onto its own row below the button, centred, at 13px minimum, opacity 0.75, line-height 1.5. Beside the button it competes for the same horizontal space and gets crushed.
- Split that line into two short trust chips rather than one long sentence - long sentences under a button are not read: "Limited seats" and "Recording included".
- Unify every CTA on the page. Mixed labels make the page feel assembled rather than designed. Use "Join Masterclass - ₹499" for in-page CTAs and "Enroll - ₹499" only in the compact sticky bar.

**Done when -** The price is the second thing the eye lands on in every CTA block, and the helper text is comfortably readable without zooming.

## **FR-08 Body font too small in the content cards**

**P1** | Content sections

**What is wrong.** In the "Face Reading is not magic - it is observation" section (face shape and zones, forehead and eyes, nose and lips, ears and moles, voice and walk) and in the "What You Will Learn" list, the descriptive line under each heading is noticeably smaller than the heading and uncomfortable to read on a phone.

**Why it matters.** These sections carry the actual teaching promise. If the descriptions are skipped, the visitor sees only headings, cannot judge the value, and does not buy.

### **What to change - apply one global type scale across the page**

| **Role**        | **Mobile** | **Desktop** | **Weight** | **Line-height** |
| --------------- | ---------- | ----------- | ---------- | --------------- |
| Section H2      | 26px       | 36px        | 800        | 1.2             |
| Section intro   | 16px       | 18px        | 400        | 1.6             |
| Card title      | 17px       | 19px        | 700        | 1.3             |
| Card body       | 15-16px    | 16-17px     | 400        | 1.6             |
| Micro / caption | 13px       | 13px        | 500        | 1.4             |
| Legal / footer  | 12px       | 12px        | 400        | 1.5             |

**Hard rule -** Nothing below 13px anywhere on the page, except the single legal line in the footer.

- Card padding: 18px on mobile, 24px on desktop. The current cards sit tight against their borders.
- Body text opacity at least 0.82 against the purple background. The descriptions currently sit at a low-contrast grey; target WCAG AA (4.5:1) for all body copy.
- A consistent 6-8px gap between card title and card body.
- Hinglish and English lines within one paragraph must share the same size. No mixing sizes inside a single block.

**Done when -** Every descriptive line passes a 4.5:1 contrast check and no body text renders below 15px on a 390px-wide viewport.

## **FR-09 Testimonial cards cut text mid-sentence**

**P1 - BUG** | Wall of Love

**What is wrong.** In the Wall of Love section, at least one card ends mid-word. The card has a fixed height and the overflow is clipped rather than handled.

### **What to change**

- Remove the fixed height. Let the cards size to their content, with align-items: stretch on the grid so they remain visually equal.
- If a maximum length is required, use a proper line clamp (-webkit-line-clamp: 4) with a visible "Read more" control. Never a hard clip.
- Better still, shorten the testimonial copy at source to two or three lines. On a paid-traffic page, short punchy proof outperforms long paragraphs.
- Add reviewer name, role and a small photo or initial avatar to every card consistently. One card currently has a name and role and another does not.

# **5\. Medium priority issues (P2)**

## **FR-10 Floating widgets collide at the bottom-right**

**P2 - BUG** | Global

**What is wrong.** The "Astro Chat" pill, the round chat bubble and the sticky countdown bar all occupy the same bottom-right corner and overlap.

### **What to change**

- Apply the z-index ladder from FR-01.
- Keep one chat entry point, not two. Remove either the pill or the bubble.
- Offset the remaining widget above the sticky bar: bottom: calc(68px + 16px + env(safe-area-inset-bottom)).
- Hide the widget entirely while the registration modal is open.

## **FR-11 FAQ accordion spacing is uneven**

**P2** | FAQ

**What is wrong.** Question text sits high in its row and two-line questions crowd the chevron.

### **What to change**

- Set padding 18px 20px, min-height 60px, align-items: center on the header row.
- Give the question text padding-right 44px so it never runs under the chevron.
- Animate the chevron rotation at 200ms ease and animate the panel height rather than snapping it open.

## **FR-12 Countdown digits render unclearly**

**P2** | Timer

**What is wrong.** The timer uses a seven-segment display face in which the unlit segments are also drawn, so every digit carries a ghost "8" behind it and reads ambiguously.

### **What to change**

- Replace with the brand body font at weight 700 using font-variant-numeric: tabular-nums, or keep the LCD look but drop the ghost segments and raise digit contrast.
- Keep the HRS / MIN / SEC labels at 9px uppercase beneath the digits - the current design does this correctly.

## **FR-13 Footer contact details are not tappable**

**P2** | Footer

### **What to change**

- Make the phone number both a tel: link and a WhatsApp deep link - <https://wa.me/919005575577> with a pre-filled message such as "I have a question about the Face Reading Masterclass".
- Make the email address a mailto: link.
- Give each a 44px minimum tap target.
- Confirm the social icons under @Dsastrounfiltered point at the live DS Astro handles and not at placeholders.

# **6\. Evergreen batch-date policy**

## **FR-14 Remove all fixed dates from the page**

**P0** | Content / SEO / config

**Decision.** The page must run permanently without needing an update between batches. No specific date or time appears anywhere on the page. The batch schedule is shared with the student after registration and confirmed by a live agent on the follow-up call.

## **6.1 Every place a date currently appears**

| **Location**                             | **Currently**                     | **Replace with**                                           |
| ---------------------------------------- | --------------------------------- | ---------------------------------------------------------- |
| Hero info chips                          | DATE - 1st & 2nd August 2026      | Remove the DATE chip; use the evergreen set in FR-05       |
| Hero info chips                          | TIME - 6:00 PM - 8:00 PM          | SESSIONS - 2 hrs a day (evening)                           |
| Sticky countdown bar                     | any date reference                | "Launch price ends in …" only                              |
| Form modal header                        | any date line                     | 2 Days · Live on Zoom · Recording included                 |
| 2-Day Itinerary section                  | Day 1 / Day 2 - already date-free | Keep as is. This is the correct pattern.                   |
| Page title & meta description            | any month or year                 | 2-Day Live Face Reading Masterclass - ₹499 \| DS Astrology |
| OG / share image                         | date baked into the artwork       | Re-export a date-free version                              |
| Structured data                          | Event schema                      | See 6.3                                                    |
| Footer copyright                         | © 2026 hard-coded                 | Auto-render the current year                               |
| Any PDF or brochure linked from the page | dates                             | 2 Days                                                     |
| Meta ad creatives and ad copy            | dates                             | Same rule - otherwise creatives expire every batch         |

## **6.2 Standard phrasing**

Give the team one vocabulary list so the page does not say four different things. The full list is in Appendix A. The key decision:

**Keep "2 hrs a day, evening batch" -** Removing every trace of timing costs conversions. A working professional will not pay ₹499 if there is a real chance the class runs at 11 a.m. on a Tuesday. "Evening, 2 hrs a day" is true for every batch, never needs updating, and removes the single biggest silent objection.

## **6.3 Structured data must change**

If the page currently uses Event schema it will now fail validation, because Event requires a startDate. This can raise a Search Console error. Switch to:

- Course schema - name, description, provider (DS Astro Institute), instructor (Damini Shukla).
- Product with an Offer for the ₹499 price - priceCurrency INR, availability InStock.
- FAQPage schema for the FAQ block. This one is worth keeping - it can win rich results.
- Use courseWorkload "PT4H" and hasCourseInstance with courseMode "online", but no date fields.

## **6.4 Countdown logic without a class date**

Three options, in order of preference.

### **Option A - real weekly price cycle (recommended)**

- The ₹499 launch price is honoured until Sunday 11:59 p.m. IST each week, then the cycle restarts for the next batch.
- Evergreen: no manual updates, ever. One config value - priceCycleEnd: "SUN 23:59 IST".
- Honest, because the cycle is a real policy you actually operate.
- Label the timer "Launch price ends in", not "Offer ends in" - the latter implies the class itself expires.
- At rollover the bar continues seamlessly into the next cycle.

### **Option B - per-visitor deadline**

- A persisted cookie or localStorage deadline set on first visit, e.g. 24 hours. Only use this if the price genuinely is honoured for that visitor for that window.
- It must not reset on refresh. A countdown that restarts at 23:59:59 on every page load is the version users recognise as fake, and repeatedly-resetting urgency is a real risk against Meta's advertising policies on misleading claims.

### **Option C - real seat scarcity, best used alongside Option A**

- The class is genuinely capacity-limited on Zoom, so a live seat counter is more credible than any clock: "34 of 100 seats left for the next batch".
- Drive it from the actual registration count for the current batch. It must be real - a fake counter showing the same number for three weeks does more damage than no counter at all.
- Show it in the sticky bar on desktop and directly above the CTA on mobile; the bar is too narrow for both on a phone.

## **6.5 One config value, no code change**

Even though no date is displayed, keep a single admin-editable config object so a specific date can be switched on for a special push without touching code.

// site config - editable by marketing, no deploy needed

batch: {

showDates: false, // flip to true only for a dated push

dateLabel: "", // e.g. "1 & 2 Aug"

urgencyLabel: "Next batch starting soon",

priceCycleEnd: "SUN 23:59 IST",

seatsRemaining: null // real count, see 6.4 Option C

}

## **6.6 What removing dates costs, and how it is covered**

| **Risk**                                                                                  | **Mitigation**                                                                                                                         |
| ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| "When is it?" is the first pre-payment question. No answer means hesitation and drop-off. | The FAQ block in section 7 answers it directly, and the answer is repeated under the submit button - not only in the FAQ               |
| Some users pay, then find the timing unsuitable, and request refunds                      | A clear reschedule promise: "If the batch does not suit you, we move you to the next one, free." Cheaper than a refund, and it is true |
| The countdown loses its anchor                                                            | Rebuilt on the weekly price cycle - section 6.4                                                                                        |
| A perception of "is this class even real?"                                                | Compensate with proof density: recording guarantee, agent contact, Razorpay badge and the real student count near the button           |

**The governing rule -** Every piece of certainty removed from the page must be replaced by a promise about what happens next. That is why sections 7 and 8 matter more under the evergreen model than they did before.

# **7\. FAQ block - approved copy**

_Copy is written in the page's Hinglish register. Use as-is or edit lightly, but keep the plain, direct tone._

**Q. When is the next batch? / Batch kab hai?**

The masterclass runs for 2 days, 2 hours each evening, live on Zoom. We run batches regularly, and your exact batch dates and timing are shared on WhatsApp immediately after you register. Our team also calls you to confirm your slot personally, so you can pick the batch that suits you best.

**Q. What if the batch timing doesn't suit me?**

No problem. Tell our team on the confirmation call and we will move you to the next batch at no extra cost. And even if you miss a live session, the full recording is included - so nothing is lost.

**Q. What happens after I pay? (revise the existing answer)**

Three things, within minutes: (1) you get a confirmation on WhatsApp and email; (2) your batch dates, timing and Zoom link are shared with you; (3) our team calls you to confirm your slot and answer any question before the class. Support: +91 90055 75577 on WhatsApp.

**Q. Is the session recorded? (keep, but move higher in the list)**

Yes. Every session is recorded and the recording is included with your registration - even if you attend live.

**Q. What should I keep ready? (keep, add one line)**

A notebook, a mirror, and two or three photos of family or friends for the live practice reading. Nothing else - no prior astrology knowledge needed.

**Also do this -** Lift the answer to "When is the next batch?" out of the FAQ and repeat it as a single line directly under the form's submit button: "Batch dates & Zoom link shared on WhatsApp right after registration." Most visitors never open the FAQ. This one line is what saves the sale.

# **8\. Post-payment flow**

Under the evergreen model the batch details have moved off the page and into the follow-up. That follow-up must now be airtight, or refund requests will rise.

- Success screen - do not redirect back to the landing page. It must show: payment confirmed, the amount, "Batch details and Zoom link are on their way to your WhatsApp", the support number, and a prompt to save that number.
- Automated WhatsApp and email within five minutes, containing batch dates, timing, the Zoom link and what to keep ready. Automate this - do not leave it to a person.
- Agent confirmation call within 24 hours. Script it: confirm the slot, confirm the WhatsApp number, answer doubts. Since this masterclass is the top of the funnel for the full Face Reading course, seed the next step without pitching hard on the first call.
- Log every registration and call outcome in the CRM so the post-masterclass upsell sequence works from clean data.
- Reminder sequence at 24 hours, 1 hour and 10 minutes before the session. No-show rate is the biggest hidden leak in a low-ticket webinar model, and reminders are the cheapest available fix.

# **9\. Further conversion recommendations**

_Ordered by expected impact._

### **9.1 Add a 30-60 second video above the fold**

Damini performing one real face reading - pick a feature, read it, land the insight. For this category a short proof-of-skill video is the single highest-lift element available, because the entire promise is that she can genuinely do this in 30 seconds. Muted autoplay, captions burned in, tap to unmute, and a poster image so it never delays Largest Contentful Paint.

### **9.2 Put social proof immediately above every CTA**

One short testimonial - two lines, name, role, photo - directly above each "Join Masterclass - ₹499" button. Proof at the point of decision converts; proof parked in a separate section further down mostly gets scrolled past.

### **9.3 Add a trust strip under the hero CTA**

Four compact items in a single row: Razorpay secure · 10,000+ students · Featured on national TV · Recording included.

### **9.4 Give the scepticism objection its own block**

The page already has the right answer - "Face Reading is not magic. It is observation, with a 5,000-year-old system behind it." Give it a dedicated section with a heading. It converts the sceptical half of a cold Meta audience who would otherwise bounce.

### **9.5 State one clear promise near the button**

Either the reschedule promise ("Does not suit you? Move to the next batch, free") or a refund window consistent with the existing Refund Policy page. An unstated policy reads as no policy.

### **9.6 Keep the form at three fields**

Name, email and phone is correct. Do not add city, age or "how did you hear about us". Every extra field costs conversions, and the agent call can collect anything else.

### **9.7 Hold one language register**

The page mixes English and Hinglish well in places and drifts into formal English elsewhere. Choose the Hinglish voice - the "Kabhi socha hai…" register - and hold it through headings, buttons and the FAQ. Cold Meta traffic in this category responds to the conversational voice.

### **9.8 Respect the thumb zone**

On mobile the primary CTA and the sticky bar sit in the lower third, where the thumb rests. Confirm nothing important sits in the top-right corner, the hardest area to reach one-handed.

### **9.9 Above the fold on mobile**

On a 390 × 844 screen the visitor should see, without scrolling: eyebrow, headline with "30 Seconds" emphasised, the four info chips, one CTA, and the sticky bar. Tighten the hero vertical padding to achieve this - the CTA currently falls below the fold on smaller phones.

### **9.10 Ad-to-page message match**

Whatever headline and image the Meta ad uses must appear in the first screen of this page. Mismatch between creative and landing page is the most common cause of high click-through with low conversion. With dates removed, one evergreen creative set can now run indefinitely.

### **9.11 Page speed**

Compress every image to WebP, lazy-load everything below the fold, and target Largest Contentful Paint under 2.5 seconds on 4G. A slow landing page raises cost-per-result directly.

### **9.12 Tracking - required before spend**

- Meta Pixel on all pages plus the Conversions API (server-side). iOS signal loss makes pixel-only tracking unreliable for this audience.
- Standard events: ViewContent on page load, InitiateCheckout when the form modal opens, Lead on form submission, Purchase on Razorpay success with value 499 and currency INR.
- Preserve UTM parameters through the Razorpay redirect so conversions are attributed to the correct ad set.
- Verify in Events Manager Test Events before the campaign is switched on.
- Standing retargeting audience: everyone who fired InitiateCheckout but not Purchase in the last 7 days. Because the page never goes stale, this audience can run permanently - these are the cheapest registrations you will buy.

# **10\. Design reference**

_Consolidated values referenced throughout this document. Define them once as tokens rather than per component._

## **10.1 Type scale**

| **Role**          | **Mobile** | **Desktop** | **Weight**    | **Line-height** |
| ----------------- | ---------- | ----------- | ------------- | --------------- |
| Hero eyebrow      | 12px       | 14px        | 600 uppercase | 1.3             |
| Hero H1           | 30px       | 46px        | 800           | 1.15            |
| Hero sub-headline | 16px       | 18px        | 400           | 1.55            |
| Section H2        | 26px       | 36px        | 800           | 1.2             |
| Section intro     | 16px       | 18px        | 400           | 1.6             |
| Card title        | 17px       | 19px        | 700           | 1.3             |
| Card body         | 15-16px    | 16-17px     | 400           | 1.6             |
| Chip label        | 10px       | 11px        | 600 uppercase | 1.2             |
| Chip value        | 16px       | 18px        | 700           | 1.3             |
| Button label      | 17px       | 18px        | 600           | 1.2             |
| Button price      | 20px       | 21px        | 800           | 1.2             |
| Micro / caption   | 13px       | 13px        | 500           | 1.4             |
| Legal / footer    | 12px       | 12px        | 400           | 1.5             |

## **10.2 Layering**

| **Token**            | **Value** | **Applies to**                 |
| -------------------- | --------- | ------------------------------ |
| \--z-page-content    | 1         | All normal page content        |
| \--z-sticky-header   | 100       | Top navigation, if present     |
| \--z-floating-widget | 400       | Astro Chat pill, chat bubble   |
| \--z-timer-bar       | 600       | Sticky countdown strip         |
| \--z-modal-overlay   | 900       | Dark backdrop behind the modal |
| \--z-modal           | 1000      | Registration form              |
| \--z-toast           | 1100      | Confirmations and error toasts |

## **10.3 Spacing and targets**

- Page gutter: 20px on mobile, 24px on desktop. Inherited by every block - never set per element.
- Sticky bar height: 64-68px. Page container padding-bottom: calc(68px + env(safe-area-inset-bottom)).
- Minimum tap target: 44 × 44px. Primary button minimum height: 52px. Input minimum height: 48px.
- Card padding: 18px on mobile, 24px on desktop. Card radius: 14-16px.
- Minimum input font-size: 16px, to prevent iOS Safari auto-zoom on focus.
- Minimum body contrast: 4.5:1 (WCAG AA). Nothing below 13px except the footer legal line.

# **11\. QA sign-off checklist**

_Test on real devices, not only the browser emulator. Paid social traffic opens inside the Instagram and Facebook in-app browsers, which behave differently for sticky elements and modals._

|     | iOS Safari (iPhone SE / 13 / 15 Pro Max), Android Chrome, and the Instagram and Facebook in-app browsers                                        |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
|     | Sticky countdown visible on load, stays fixed through the full scroll, never covers content                                                     |
|     | Countdown shows the correct remaining time after a hard refresh - it does not reset                                                             |
|     | Countdown continues correctly across a cycle rollover (test with the cycle end two minutes out)                                                 |
|     | Seat counter reflects the real registration count - verify with a test registration                                                             |
|     | Form opens from every CTA entry point with nothing overlapping                                                                                  |
|     | All three fields and the submit button usable without closing anything                                                                          |
|     | Correct keyboard type per field; no Safari auto-zoom on focus                                                                                   |
|     | Validation messages appear inline, before submission                                                                                            |
|     | Submit button shows a loading state and cannot be double-tapped                                                                                 |
|     | Razorpay flow completes and lands on the success screen, not the landing page                                                                   |
|     | Test payment triggers the WhatsApp and email automation within five minutes                                                                     |
|     | The line "Batch dates & Zoom link shared on WhatsApp right after registration" is visible under the submit button without scrolling             |
|     | Codebase, CMS content, meta tags, OG image, schema and linked PDFs contain no month, date or year string - except the auto-rendered footer year |
|     | Event schema removed; Course + Product + FAQPage schema validates in the Rich Results Test                                                      |
|     | showDates config flag turns the date display on and off with no deploy                                                                          |
|     | Meta Pixel and Conversions API events fire correctly in Test Events                                                                             |
|     | No text below 13px anywhere except the footer legal line                                                                                        |
|     | No clipped or truncated text in any card                                                                                                        |
|     | Landscape orientation does not break the sticky bar or the modal                                                                                |
|     | Largest Contentful Paint under 2.5 seconds on a throttled 4G connection                                                                         |
|     | Keyboard navigation works and focus is visible throughout the form                                                                              |

# **Appendix A: Standard phrasing list**

One vocabulary for the whole page, the ad creatives and the support scripts. Consistency is what makes an evergreen page feel intentional rather than vague.

| **Use this**                                                | **Not this**                      | **Where**                                  |
| ----------------------------------------------------------- | --------------------------------- | ------------------------------------------ |
| 2 Days                                                      | two-day, 2-day workshop, 48 hours | Everywhere                                 |
| 2 hours a day, evening batch                                | 6:00 PM - 8:00 PM                 | Hero chip, FAQ, modal                      |
| Live on Zoom + full recording                               | Online class                      | Hero chip, modal, ads                      |
| Next batch starting soon                                    | Any specific date                 | Urgency line, ads                          |
| Launch price ends in …                                      | Offer ends in …                   | Countdown bar                              |
| Join Masterclass - ₹499                                     | Enroll Now, Join Now, Register    | All in-page CTAs                           |
| Enroll - ₹499                                               | -                                 | Sticky bar only                            |
| Batch dates are shared on WhatsApp right after registration | -                                 | Under the submit button, FAQ, agent script |
| Complete Registration - ₹499                                | Submit, Complete Registration     | Form button                                |

_End of document - DS Astro Institute, Face Reading Masterclass landing page fix report, version 1.0._