import LegalPolicyLayout from '../components/LegalPolicyLayout';
import { PAGE_BANNERS } from '../data/pageBanners';
import { CONTACT_PHONE_DISPLAY } from '../utils/contactInfo';

const sections = [
    { id: 'definitions', label: '1. Definitions' },
    { id: 'eligibility', label: '2. Eligibility' },
    { id: 'account-security', label: '3. Account Registration & Security' },
    { id: 'courses', label: '4. Courses — Enrolment & Access' },
    { id: 'consultations', label: '5. Astrology Consultation Services' },
    { id: 'merchandise', label: '6. Merchandise — Purchase & Delivery' },
    { id: 'payment', label: '7. Payment Terms' },
    { id: 'cancellation', label: '8. Cancellation & Refund Policy' },
    { id: 'intellectual-property', label: '9. Intellectual Property Rights' },
    { id: 'user-conduct', label: '10. User Conduct & Prohibited Activities' },
    { id: 'third-party', label: '11. Third-Party Services & Links' },
    { id: 'liability', label: '12. Limitation of Liability' },
    { id: 'disclaimers', label: '13. Disclaimers & Warranties' },
    { id: 'indemnification', label: '14. Indemnification' },
    { id: 'force-majeure', label: '15. Force Majeure' },
    { id: 'privacy', label: '16. Privacy' },
    { id: 'amendments', label: '17. Amendments to These Terms' },
    { id: 'termination', label: '18. Termination' },
    { id: 'governing-law', label: '19. Governing Law & Dispute Resolution' },
    { id: 'grievance-officer', label: '20. Grievance Officer' }
];

function Terms() {
  return (
    <LegalPolicyLayout
      seo={{
        title: 'Terms and Conditions',
        description: 'Read the terms and conditions for using the DS Astrology website and services.',
        url: '/terms-and-conditions'
      }}
      banner={PAGE_BANNERS.terms}
      sections={sections}
    >
          <section id="definitions" className="content-section">
            <h2 className="section-title">1. Definitions</h2>
            <ul className="content-list">
              <li><strong>Company:</strong> Refers to DS ASTROLOGY LLP.</li>
              <li><strong>Services:</strong> Means all offerings by the Company including but not limited to live and recorded astrology courses, astrology consultations, digital content, and astrology-related merchandise.</li>
              <li><strong>Platform:</strong> Means the website https://dsastroinstitute.com/ and any associated mobile applications or digital channels operated by the Company.</li>
              <li><strong>User / you:</strong> Refers to any person who accesses, registers on, or uses the Platform or Services.</li>
              <li><strong>Course:</strong> Refers to any live, recorded, or hybrid astrology learning programme offered by the Company.</li>
              <li><strong>Consultation:</strong> Refers to personalised astrology sessions, readings, chart analysis, or related advisory sessions offered by the Company.</li>
              <li><strong>Content:</strong> Means all text, videos, audio, PDFs, study materials, charts, images, and other materials published or provided by the Company.</li>
            </ul>
          </section>

          <section id="eligibility" className="content-section">
            <h2 className="section-title">2. Eligibility</h2>
            <p>To access or use our Services, you must:</p>
            <ul className="content-list">
              <li>Be at least 18 years of age, or access our Services under the supervision and with the verified consent of a parent or legal guardian.</li>
              <li>Have the legal capacity to enter into a binding contract under Indian law.</li>
              <li>Not be barred from receiving services under applicable Indian law or any other jurisdiction.</li>
            </ul>
            <p>
              By using our Services, you represent and warrant that you meet all eligibility requirements. The Company reserves the right to terminate access for any user found to be ineligible.
            </p>
          </section>

          <section id="account-security" className="content-section">
            <h2 className="section-title">3. Account Registration and Security</h2>
            <p>Certain Services require creation of a user account. By registering, you agree to:</p>
            <ul className="content-list">
              <li>Provide accurate, current, and complete information during registration and keep it updated.</li>
              <li>Maintain the confidentiality of your login credentials. You must not share your username or password with any third party.</li>
              <li>Accept full responsibility for all activities conducted under your account.</li>
              <li>Notify us immediately at help@dsastroinstitute.com upon becoming aware of any unauthorised access to or use of your account.</li>
            </ul>
            <p>
              The Company shall not be liable for any loss or damage arising from your failure to comply with these obligations. The Company reserves the right to terminate accounts found to be shared, misused, or otherwise in violation of these Terms.
            </p>
          </section>

          <section id="courses" className="content-section">
            <h2 className="section-title">4. Courses — Enrolment, Access & Usage</h2>
            <h3 className="subsection-title">A. Enrolment</h3>
            <ul className="content-list">
              <li>Enrolment in a course is confirmed only upon successful receipt of payment.</li>
              <li>Course access details will be shared via email or WhatsApp within the timelines specified on the Platform.</li>
              <li>Enrolment is personal to the registered user and is non-transferable.</li>
            </ul>
            
            <h3 className="subsection-title">B. Access</h3>
            <ul className="content-list">
              <li>Access to course materials is granted for the duration specified at the time of purchase.</li>
              <li>The Company reserves the right to update, modify, or discontinue course content to improve quality or reflect updated information.</li>
              <li>Technical access issues must be reported to our support team promptly; the Company will make reasonable efforts to resolve them.</li>
            </ul>

            <h3 className="subsection-title">C. Prohibited Use of Course Content</h3>
            <p>Users are strictly prohibited from:</p>
            <ul className="content-list">
              <li>Recording, downloading, screenshotting, or capturing any live or recorded session without prior written consent.</li>
              <li>Sharing, distributing, reselling, sublicensing, or uploading any course material to any platform, group, or individual.</li>
              <li>Sharing login credentials with any other person.</li>
              <li>Using course content for any commercial purpose without written authorisation from the Company.</li>
            </ul>
            <p>
              Violation of any of the above will result in immediate account termination, forfeiture of any fees paid, and may attract civil and criminal liability under the Copyright Act, 1957, the Information Technology Act, 2000, and other applicable laws.
            </p>
          </section>

          <section id="consultations" className="content-section">
            <h2 className="section-title">5. Astrology Consultation Services</h2>
            <h3 className="subsection-title">A. Booking and Conduct</h3>
            <ul className="content-list">
              <li>Consultation bookings are confirmed only upon receipt of full payment.</li>
              <li>Users must provide accurate birth details (date, time, and place of birth) at the time of booking. The Company shall not be responsible for inaccurate readings resulting from incorrect information provided by the user.</li>
              <li>Users must join the session at the scheduled time. No extension or refund will be provided for time lost due to late joining by the user.</li>
              <li>Sessions must be conducted respectfully. The Company reserves the right to terminate sessions involving abusive, threatening, or inappropriate conduct.</li>
            </ul>

            <h3 className="subsection-title">B. Important Disclaimer</h3>
            <p>
              Astrology consultations, kundali readings, birth chart analyses, predictions, and all related advisory content provided by DS ASTROLOGY LLP are offered solely for informational, educational, and entertainment purposes.
            </p>
            <p>They must NOT be construed as, relied upon as, or used as a substitute for:</p>
            <ul className="content-list">
              <li>Medical diagnosis or treatment</li>
              <li>Financial or investment advice</li>
              <li>Legal advice</li>
              <li>Psychological or psychiatric counsel</li>
              <li>Any form of professional licensed advice</li>
            </ul>
            <p>
              The Company makes no warranty, express or implied, regarding the accuracy, completeness, or outcome of any consultation. Users exercise their own judgment and bear sole responsibility for decisions made on the basis of consultations. The Company shall not be held liable for any outcome, loss, or consequence arising from reliance on consultation content.
            </p>

            <h3 className="subsection-title">C. Recording of Consultations</h3>
            <p>
              Consultations may be recorded by the Company for quality assurance and record-keeping purposes. Users who do not wish to be recorded must notify us before the session begins. Recording of sessions by users without prior written consent is strictly prohibited.
            </p>
          </section>

          <section id="merchandise" className="content-section">
            <h2 className="section-title">6. Merchandise — Purchase and Delivery</h2>
            <h3 className="subsection-title">A. Product Listings and Pricing</h3>
            <ul className="content-list">
              <li>All products listed on the Platform are subject to availability.</li>
              <li>Prices are displayed in Indian Rupees (INR) and are inclusive of applicable GST unless stated otherwise.</li>
              <li>The Company reserves the right to modify prices at any time without prior notice. Price changes will not affect orders already confirmed.</li>
            </ul>

            <h3 className="subsection-title">B. Order Confirmation</h3>
            <ul className="content-list">
              <li>An order is confirmed only upon successful payment and receipt of a confirmation email or message from the Company.</li>
              <li>The Company reserves the right to cancel orders in cases of pricing errors, stock unavailability, or suspected fraudulent activity. A full refund will be issued in such cases.</li>
            </ul>

            <h3 className="subsection-title">C. Delivery</h3>
            <ul className="content-list">
              <li>Estimated delivery timelines are indicative and may vary based on location and logistics.</li>
              <li>The Company shall not be liable for delays caused by third-party logistics providers, natural events, or circumstances beyond our control.</li>
              <li>Users must ensure accurate delivery addresses are provided. The Company shall not be responsible for non-delivery due to incorrect address details.</li>
            </ul>

            <h3 className="subsection-title">D. Damaged or Incorrect Items</h3>
            <p>
              In the event of receipt of a damaged or incorrect product, users must notify the Company within 48 hours of delivery with photographs as evidence. The Company will arrange a replacement or refund at its discretion.
            </p>
          </section>

          <section id="payment" className="content-section">
            <h2 className="section-title">7. Payment Terms</h2>
            <ul className="content-list">
              <li>All payments must be made through the payment methods available on the Platform.</li>
              <li>Payments are processed through RBI-regulated, PCI-DSS compliant third-party payment gateways. The Company does not store card numbers, CVV, UPI PINs, or banking passwords.</li>
              <li>Prices are in Indian Rupees (INR). International users are responsible for any foreign exchange conversion fees or charges levied by their banks.</li>
              <li>GST and other applicable taxes are charged as per prevailing Indian tax laws.</li>
              <li>In the event of a payment failure, users should not make repeated payment attempts before confirming transaction status with our support team to avoid duplicate charges.</li>
            </ul>
          </section>

          <section id="cancellation" className="content-section">
            <h2 className="section-title">8. Cancellation and Refund Policy</h2>
            <h3 className="subsection-title">A. Courses</h3>
            <ul className="content-list">
              <li>Once access to course content has been granted, no refund will be issued.</li>
              <li>Cancellation requests before access is granted must be made within 24 hours of purchase. Approved refunds will be processed within 7-10 working days.</li>
              <li>In case of a technical failure attributable solely to the Company that prevents course delivery, appropriate remedy (extension, replacement session, or refund) will be offered at the Company's discretion.</li>
            </ul>

            <h3 className="subsection-title">B. Consultations</h3>
            <ul className="content-list">
              <li>Cancellations made at least 24 hours before the scheduled session will be eligible for a full refund or reschedule.</li>
              <li>Cancellations made within 24 hours of the scheduled session will not be eligible for a refund.</li>
              <li>No-shows (user failing to join at scheduled time) will not be eligible for a refund or reschedule.</li>
              <li>If the Company is unable to conduct a confirmed consultation for reasons within its control, the user will be offered a reschedule or full refund.</li>
            </ul>

            <h3 className="subsection-title">C. Merchandise</h3>
            <ul className="content-list">
              <li>Merchandise returns are accepted only in cases of damaged, defective, or incorrect items, reported within 48 hours of delivery with supporting evidence.</li>
              <li>Change-of-mind returns are not accepted.</li>
              <li>Approved refunds will be credited to the original payment method within 7-10 working days.</li>
            </ul>
          </section>

          <section id="intellectual-property" className="content-section">
            <h2 className="section-title">9. Intellectual Property Rights</h2>
            <p>
              All Content available on the Platform, including but not limited to course videos, live session recordings, PDFs, study materials, charts, software, logos, brand name, and website design, is the exclusive intellectual property of DS ASTROLOGY LLP and is protected under:
            </p>
            <ul className="content-list">
              <li>The Copyright Act, 1957</li>
              <li>The Trade Marks Act, 1999</li>
              <li>The Information Technology Act, 2000</li>
              <li>Other applicable Indian and international intellectual property laws</li>
            </ul>
            <p>
              No Content may be copied, reproduced, adapted, distributed, publicly displayed, transmitted, or used to create derivative works without the express prior written consent of the Company.
            </p>
            <p>
              Users are granted a limited, non-exclusive, non-transferable, revocable licence to access and use course content solely for their personal, non-commercial learning purposes during the access period.
            </p>
          </section>

          <section id="user-conduct" className="content-section">
            <h2 className="section-title">10. User Conduct and Prohibited Activities</h2>
            <p>By using our Platform and Services, you agree not to:</p>
            <ul className="content-list">
              <li>Use the Platform for any unlawful, fraudulent, or harmful purpose.</li>
              <li>Post, transmit, or share any content that is defamatory, abusive, obscene, hateful, or violates the rights of any third party.</li>
              <li>Attempt to gain unauthorised access to any part of the Platform, other user accounts, or our systems.</li>
              <li>Introduce viruses, malware, or any other harmful code.</li>
              <li>Engage in scraping, data mining, or automated data collection from the Platform.</li>
              <li>Impersonate any person or entity, or misrepresent your affiliation with any person or entity.</li>
              <li>Engage in any activity that disrupts or interferes with the Platform or its services.</li>
            </ul>
            <p>
              The Company reserves the right to suspend or permanently terminate any user account that violates these Terms, without notice or refund.
            </p>
          </section>

          <section id="third-party" className="content-section">
            <h2 className="section-title">11. Third-Party Services and Links</h2>
            <p>
              Our Platform may integrate with or contain links to third-party services including payment gateways, social media platforms, and video conferencing tools. These third-party services are governed by their own terms and privacy policies.
            </p>
            <p>
              The Company does not endorse, control, or accept responsibility for the content, practices, or reliability of any third-party service. Users access such services at their own risk.
            </p>
          </section>

          <section id="liability" className="content-section">
            <h2 className="section-title">12. Limitation of Liability</h2>
            <p>To the maximum extent permitted by applicable law:</p>
            <ul className="content-list">
              <li>The Company shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or in connection with your use of the Services.</li>
              <li>The Company's total aggregate liability to any user for any claim shall not exceed the total amount paid by that user to the Company in the three months preceding the claim.</li>
              <li>The Company is not liable for any loss arising from reliance on astrology consultation content, course content, or any other service output.</li>
              <li>The Company is not liable for service interruptions, data loss, or technical failures attributable to third-party providers, internet connectivity issues, or force majeure events.</li>
            </ul>
          </section>

          <section id="disclaimers" className="content-section">
            <h2 className="section-title">13. Disclaimers and Warranties</h2>
            <ul className="content-list">
              <li>Services are provided on an "as is" and "as available" basis without warranties of any kind, express or implied.</li>
              <li>The Company does not warrant uninterrupted, error-free access to the Platform.</li>
              <li>The Company does not guarantee specific outcomes or results from any course, consultation, or other service.</li>
              <li>Astrology services are not a substitute for professional medical, legal, financial, or psychological advice. Users are strongly encouraged to seek qualified professional assistance for serious personal matters.</li>
            </ul>
          </section>

          <section id="indemnification" className="content-section">
            <h2 className="section-title">14. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless DS ASTROLOGY LLP, its partners, directors, employees, consultants, and agents from and against any claims, liabilities, damages, losses, costs, and expenses (including reasonable legal fees) arising out of or relating to:
            </p>
            <ul className="content-list">
              <li>Your use of the Platform or Services.</li>
              <li>Your violation of these Terms.</li>
              <li>Your violation of any applicable law or regulation.</li>
              <li>Any content or information you submit or transmit through the Platform.</li>
              <li>Your infringement of any third-party intellectual property or other rights.</li>
            </ul>
          </section>

          <section id="force-majeure" className="content-section">
            <h2 className="section-title">15. Force Majeure</h2>
            <p>
              The Company shall not be in breach of these Terms, nor liable for any delay or failure to perform its obligations, if such delay or failure is caused by circumstances beyond its reasonable control, including but not limited to acts of God, natural disasters, pandemics, government orders, internet or power failures, civil unrest, or any other force majeure event.
            </p>
          </section>

          <section id="privacy" className="content-section">
            <h2 className="section-title">16. Privacy</h2>
            <p>
              Your use of our Services is also governed by our Privacy Policy, available at https://dsastroinstitute.com/, which is incorporated into these Terms by reference. By agreeing to these Terms, you also consent to the collection, use, and processing of your personal data as described in our Privacy Policy.
            </p>
          </section>

          <section id="amendments" className="content-section">
            <h2 className="section-title">17. Amendments to These Terms</h2>
            <p>
              DS ASTROLOGY LLP reserves the right to modify, update, or revise these Terms at any time without prior notice. Revised Terms will be published on the Platform with an updated effective date.
            </p>
            <p>
              Your continued use of the Platform or Services after any such changes constitutes your acceptance of the revised Terms. It is your responsibility to review these Terms periodically.
            </p>
          </section>

          <section id="termination" className="content-section">
            <h2 className="section-title">18. Termination</h2>
            <p>
              The Company may, at its sole discretion, suspend or terminate your access to the Platform and Services, with or without notice, if you:
            </p>
            <ul className="content-list">
              <li>Violate any provision of these Terms.</li>
              <li>Engage in fraudulent, abusive, or illegal activity.</li>
              <li>Share account credentials or course content with third parties.</li>
            </ul>
            <p>
              Upon termination, your right to access the Platform and Services will immediately cease. The Company shall not be liable for any losses resulting from such termination.
            </p>
          </section>

          <section id="governing-law" className="content-section">
            <h2 className="section-title">19. Governing Law and Dispute Resolution</h2>
            <p>
              These Terms are governed by and construed in accordance with the laws of India, including the Indian Contract Act, 1872, the Consumer Protection Act, 2019, the Information Technology Act, 2000, and other applicable statutes.
            </p>
            <p>
              In the event of any dispute arising out of or in connection with these Terms or the Services, the parties shall first attempt to resolve the dispute amicably through good-faith negotiation. If the dispute is not resolved within 30 days, it shall be subject to the exclusive jurisdiction of the competent courts located in Lucknow, Uttar Pradesh, India.
            </p>
          </section>

          <section id="grievance-officer" className="content-section">
            <h2 className="section-title">20. Grievance Officer</h2>
            <p>
              In accordance with the Information Technology Act, 2000 and the Consumer Protection Act, 2019, DS ASTROLOGY LLP has designated a Grievance Officer for addressing user concerns.
            </p>
            <div className="contact-box">
              <p><strong>Name:</strong> Ananya Singh</p>
              <p><strong>Designation:</strong> Grievance Officer</p>
              <p><strong>Email:</strong> help@dsastroinstitute.com</p>
              <p><strong>Phone:</strong> {CONTACT_PHONE_DISPLAY}</p>
              <p><strong>Address:</strong> D321, Vibhuti Khand, Lucknow, Uttar Pradesh - 226010</p>
              <p><strong>Response Time:</strong> Within 7 working days of receipt of complaint</p>
            </div>
          </section>

          <section id="contact-us" className="contact-section">
            <h2 className="contact-title">Questions?</h2>
            <p className="contact-desc">
              For any questions or concerns regarding these Terms, please contact us.
            </p>
            <div className="contact-details">
              <p><strong>Company Name:</strong> DS ASTROLOGY LLP</p>
              <p><strong>Registered Address:</strong> D321, Vibhuti Khand, Lucknow, Uttar Pradesh - 226010</p>
              <p><strong>Email:</strong> info@dsastroinstitute.com</p>
              <p><strong>Phone:</strong> {CONTACT_PHONE_DISPLAY}</p>
              <p><strong>Website:</strong> https://dsastroinstitute.com/</p>
            </div>
            <a href="mailto:info@dsastroinstitute.com" className="contact-button">Contact Support</a>
          </section>
    </LegalPolicyLayout>
  );
}

export default Terms;