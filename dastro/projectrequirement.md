DS Astro Platform – Complete Website 
Flow & System Understanding 
Objective of the Platform 
The DS Astro platform is not just a website. 
It is a complete ecosystem where users can: 
● Browse and enquire about LIVE astrology courses 
● Buy RECORDED courses instantly 
● Book PAID consultations 
● Purchase merchandise through Shopify integration 
● Become a registered student and access their learning dashboard 
● Generate leads at every stage, whether they pay or not 
The most important goal of the system is: 
Capture every interested customer’s details and store them inside the admin panel. 
MAIN NAVIGATION STRUCTURE 
The website will mainly contain these sections: 
1. HOME 
2. LIVE COURSES 
3. RECORDED COURSES 
4. CONSULTATIONS 
5. SHOP 
6. STUDENT LOGIN 
7. ABOUT / CONTACT (basic pages) 
1. LIVE COURSES FLOW 
Purpose 
These are instructor-led live classes conducted over Zoom/Meet or integrated live systems. 
Usually: 
● 15–30 classes 
● 1 hour each 
● Duration: 1–2 months 
These courses are NOT directly purchased online. 
Frontend User Flow 
Step 1 – Course Listing Page 
Users enter the LIVE COURSES section. 
They see: 
● Course banners/cards 
● Attractive catalogue-style UI 
● Brief information: 
○ Course Name 
○ Duration 
○ Level 
○ Instructor 
○ Short description 
Step 2 – Course Detail Page 
When user clicks any course tile: 
Detailed page opens with: 
● Full course details 
● Curriculum 
● Duration 
● Batch details 
● Pricing 
● Benefits 
● FAQs 
● CTA Button: “ENQUIRE NOW” 
Step 3 – Enquiry Form 
No payment gateway required here. 
Instead user fills: 
● Name 
● Phone Number 
● Email 
● City 
● Age 
● Interest 
● Optional notes 
Backend Requirement 
Once enquiry submitted: 
Data should: 
● Go to Admin Panel Lead Section 
● Mark as: 
○ LIVE COURSE LEAD 
○ ENQUIRY RECEIVED 
No payment processing required. 
Sales team later contacts lead manually. 
2. RECORDED COURSES FLOW 
Purpose 
This is the main automated selling system. 
Users can: 
● Browse 
● Purchase directly 
● Get instant access 
● Watch secured videos 
RECORDED COURSES USER FLOW 
Step 1 – Recorded Courses Listing Page 
Navigation tab: 
“RECORDED COURSES” 
Users see engaging course cards with: 
● Course Name 
● Duration 
● Modules count 
● Beginner / Advanced level 
● Price (important visibility) 
Step 2 – Course Detail Page 
When user clicks course: 
Detailed page opens with: 
● Full description 
● Learning outcomes 
● Modules 
● Instructor details 
● Testimonials 
● Pricing 
● Strong BUY NOW CTA 
Important UI Requirements 
A. Reverse Countdown Timer 
A 5-hour reverse timer must appear near payment section. 
Example: 
“OFFER EXPIRES IN 04:52:11” 
Important: 
● Kajal already designed this timer UI. 
● Developers only need to integrate it. 
B. Coupon System 
There must be: 
● “Apply Coupon” field/button 
Coupon types: 
● Admin-generated coupons 
● Creator/marketing coupons 
Discount logic controlled from backend admin panel. 
PAYMENT FLOW 
After user clicks BUY NOW 
Integrated Payment Gateway handles: 
● UPI 
● Cards 
● Net banking 
● Wallets 
AFTER SUCCESSFUL PAYMENT 
System automatically: 
1. Verifies payment 
2. Creates student account 
3. Generates: 
○ Username 
○ Password 
4. Sends credentials through: 
○ Email 
○ Optional WhatsApp/SMS later 
STUDENT LOGIN SYSTEM 
Navigation button: 
“STUDENT LOGIN” 
Student logs in using credentials. 
STUDENT DASHBOARD 
Inside dashboard student can: 
● View purchased courses 
● Watch videos 
● Check course validity 
● Access course materials 
Additional space should exist for: 
● Promotional banners 
● Merchandise promotions 
● New course launches 
● Offers 
VIDEO SECURITY REQUIREMENT 
Videos must NOT be directly uploaded insecurely. 
Need third-party secure video hosting solution that: 
● Prevents downloads 
● Restricts screen recording as much as possible 
● Provides secured streaming 
● Supports expiry/access control 
Possible services can be suggested later by IT team. 
COURSE MANAGEMENT LOGIC 
Important Understanding 
Updating Existing Videos 
Developers/admin may need to update videos from third-party hosting panel. 
Adding New Courses 
New courses and details should be manageable from: 
● Internal Admin Panel 
Without developer dependency. 
CONSULTATION CTA INSIDE COURSE 
PLAYER 
Inside recorded course watching page: 
Display: 
“BOOK YOUR 1 FREE CONSULTATION” 
With note: 
Please book this only after completing the course, otherwise discussion quality may suffer. 
3. SHOP / MERCHANDISE FLOW 
Important 
DS Astro will sell merchandise. 
BUT: 
Entire ecommerce/cart system will be handled by Shopify. 
Required Structure 
Navigation tab: 
“SHOP” 
When user clicks: 
● Shopify store experience loads/integrates 
NOT REQUIRED TO BUILD 
The development team does NOT need to build: 
● Cart 
● Inventory logic 
● Delivery system 
● Order tracking 
● Checkout system 
Shopify handles all of this. 
4. CONSULTATION BOOKING FLOW 
Purpose 
Users can directly book paid consultations. 
These have: 
● Fixed pricing 
● Instant payment flow 
CONSULTATION USER FLOW 
Step 1 – Consultation Listing Page 
Display consultation service tiles/cards. 
Each card shows: 
● Service name 
● Short details 
● Duration 
● Price 
Step 2 – Detail Page 
When clicked: 
● Full consultation details open 
● Payment button visible 
PAYMENT SYSTEM 
Payment gateway integrated. 
Important: 
● NO coupon system currently required. 
ADMIN PANEL REQUIREMENT 
Whether: 
● User pays 
OR 
● User abandons payment 
Both should enter admin dashboard. 
Lead Status Logic 
Example statuses: 
● Consultation Lead – Not Paid 
● Consultation Lead – Paid 
● Recorded Course Lead – Paid 
● Recorded Course Lead – Failed Payment 
● Live Course Enquiry 
UNIVERSAL LEAD CAPTURE 
REQUIREMENT 
This is one of the MOST IMPORTANT requirements. 
At every important action: 
● Enquiry 
● Payment attempt 
● Cart intent 
● Consultation interest 
● Course purchase 
Customer details must be captured. 
Even if payment fails. 
ADMIN PANEL REQUIREMENTS 
Admin should be able to: 
● View all leads 
● Filter by type 
● See paid/unpaid status 
● Access user details 
● Access course purchases 
● View consultation bookings 
● Manage coupons 
● Add/edit courses 
● Add banners 
REAL-TIME EMAIL NOTIFICATIONS 
Real-time email alerts required for: 
Paid actions: 
● Consultation booked 
● Recorded course purchased 
Admin receives instant email notification. 
Not required for normal enquiries: 
Simple live-course enquiries only need dashboard entry. 
No instant email necessary. 
FINAL SYSTEM UNDERSTANDING 
The platform has 4 business engines: 
1. LIVE COURSES 
Lead generation focused 
2. RECORDED COURSES 
Automated scalable revenue system 
3. SHOPIFY SHOP 
External ecommerce integration 
4. CONSULTATIONS 
Direct paid service booking 
MOST IMPORTANT BUSINESS GOALS 
1. Smooth user experience 
2. Strong lead collection 
3. Secure course delivery 
4. Easy admin management 
5. Automated student onboarding 
6. Real-time payment tracking 
7. Scalable future-ready architecture 