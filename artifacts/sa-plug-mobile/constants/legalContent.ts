export type LegalSection = { heading: string; body: string };
export type LegalDoc = {
  title: string;
  date: string;
  intro: string;
  sections: LegalSection[];
};

export const TERMS: LegalDoc = {
  title: 'Terms & Conditions',
  date: 'Last Updated: 10 May 2026',
  intro:
    'Welcome to SA Plug (\u201cSA Plug\u201d, \u201cwe\u201d, \u201cour\u201d, or \u201cus\u201d). These Terms & Conditions govern your access to and use of the SA Plug mobile application, website, booking platform, and related services within the Republic of South Africa.\n\nBy accessing or using SA Plug, you agree to be legally bound by these Terms & Conditions. If you do not agree with any part of these terms, you must not use the platform.',
  sections: [
    {
      heading: '1. About SA Plug',
      body: 'SA Plug is a digital booking and lifestyle platform that allows users to discover, reserve, purchase, and manage:\n\n\u2022 Club reservations\n\u2022 VIP tables and bottle service\n\u2022 Tours and experiences\n\u2022 Dining reservations\n\u2022 Events and nightlife experiences\n\u2022 Products and merchandise\n\u2022 Hospitality-related services\n\nSA Plug acts as a technology and booking platform connecting users with independent venues, operators, restaurants, merchants, and service providers.',
    },
    {
      heading: '2. Eligibility',
      body: 'To use SA Plug, you must:\n\n\u2022 Be at least 18 years old\n\u2022 Have the legal capacity to enter into binding agreements\n\u2022 Provide accurate and complete information\n\u2022 Comply with all applicable South African laws and regulations\n\nCertain venues, events, and services may require valid identification upon entry or collection.\n\nSA Plug reserves the right to restrict or terminate access where age verification requirements are not met.',
    },
    {
      heading: '3. User Accounts',
      body: 'Users may be required to create an account to access certain services.\n\nYou are responsible for:\n\n\u2022 Maintaining the confidentiality of your account credentials\n\u2022 All activity conducted under your account\n\u2022 Ensuring your information remains accurate and current\n\nYou agree not to:\n\n\u2022 Share your account with others\n\u2022 Impersonate another individual or entity\n\u2022 Use false information\n\u2022 Attempt unauthorized access to the platform or its systems\n\nSA Plug reserves the right to suspend, restrict, or terminate accounts suspected of fraudulent, abusive, or unauthorized activity.',
    },
    {
      heading: '4. Platform Role',
      body: 'SA Plug operates as an intermediary platform between users and independent third-party service providers.\n\nSA Plug does not own, operate, manage, or control:\n\n\u2022 Clubs\n\u2022 Restaurants\n\u2022 Tour operators\n\u2022 Event organizers\n\u2022 Hospitality venues\n\u2022 Merchants or third-party vendors\n\nEach venue or provider remains independently responsible for service delivery, venue operations, admission policies, safety standards, licensing compliance, product quality, and operational decisions.',
    },
    {
      heading: '5. Venue Entry & Admission',
      body: 'Venue entry and participation remain subject to the rules, discretion, and operational policies of the applicable venue or service provider.\n\nA venue may refuse entry for reasons including but not limited to:\n\n\u2022 Intoxication\n\u2022 Aggressive behaviour\n\u2022 Failure to meet dress codes\n\u2022 Failure to provide identification\n\u2022 Capacity limitations\n\u2022 Safety or security concerns\n\u2022 Non-compliance with venue rules\n\nSA Plug is not responsible for decisions made independently by venues or operators.',
    },
    {
      heading: '6. User Conduct',
      body: 'Users agree not to:\n\n\u2022 Engage in unlawful conduct\n\u2022 Harass staff, venues, or other users\n\u2022 Use the platform for fraudulent purposes\n\u2022 Resell bookings without authorization\n\u2022 Upload malicious software or harmful content\n\u2022 Interfere with platform functionality\n\u2022 Use SA Plug in a manner that may damage the reputation of the platform or its partners\n\nSA Plug reserves the right to remove content, suspend access, or terminate accounts where misconduct occurs.',
    },
    {
      heading: '7. Third-Party Services',
      body: 'The platform may integrate with or provide access to third-party services including:\n\n\u2022 Payment providers\n\u2022 Booking systems\n\u2022 Mapping services\n\u2022 Analytics providers\n\u2022 Communication tools\n\u2022 Hospitality partners\n\nSA Plug is not responsible for the availability, accuracy, policies, or practices of third-party services. Use of third-party services may also be subject to their own terms and conditions.',
    },
    {
      heading: '8. Intellectual Property',
      body: 'All content, branding, technology, designs, logos, graphics, interfaces, trademarks, and software associated with SA Plug remain the exclusive property of SA Plug or its licensors.\n\nUsers may not:\n\n\u2022 Reproduce\n\u2022 Copy\n\u2022 Modify\n\u2022 Sell\n\u2022 Redistribute\n\u2022 Reverse engineer\n\u2022 Exploit\n\nany part of the platform without prior written consent. Unauthorized use may result in legal action.',
    },
    {
      heading: '9. Availability of Services',
      body: 'SA Plug does not guarantee uninterrupted or error-free operation of the platform.\n\nServices may be suspended, modified, removed, or restricted at any time for:\n\n\u2022 Maintenance\n\u2022 Security\n\u2022 Operational changes\n\u2022 Third-party issues\n\u2022 Technical failures\n\u2022 Legal compliance\n\nSA Plug reserves the right to modify or discontinue features without notice.',
    },
    {
      heading: '10. Limitation of Liability',
      body: 'To the maximum extent permitted under South African law, SA Plug shall not be liable for:\n\n\u2022 Indirect or consequential losses\n\u2022 Lost profits or revenue\n\u2022 Venue disputes\n\u2022 Service interruptions\n\u2022 Booking errors caused by third parties\n\u2022 Injuries, incidents, or damages occurring at venues or events\n\u2022 User conduct\n\u2022 Delays or operational failures outside reasonable control\n\nUsers attend venues, tours, and events at their own risk.',
    },
    {
      heading: '11. Indemnity',
      body: 'You agree to indemnify and hold harmless SA Plug, its affiliates, directors, employees, contractors, and partners from any claims, losses, damages, liabilities, or expenses arising from:\n\n\u2022 Your misuse of the platform\n\u2022 Violation of these Terms\n\u2022 Breach of law\n\u2022 Disputes with venues or providers\n\u2022 User-generated content\n\u2022 Fraudulent or unauthorized activity',
    },
    {
      heading: '12. Governing Law',
      body: 'These Terms & Conditions shall be governed and interpreted in accordance with the laws of the Republic of South Africa.\n\nAny disputes arising in connection with SA Plug shall be subject to the jurisdiction of the South African courts.',
    },
    {
      heading: '13. Changes to Terms',
      body: 'SA Plug reserves the right to modify or update these Terms & Conditions at any time.\n\nUpdated versions will be published on the platform with a revised \u201cLast Updated\u201d date.\n\nContinued use of the platform after updates constitutes acceptance of the revised terms.',
    },
    {
      heading: '14. Contact Information',
      body: 'For questions regarding these Terms & Conditions, contact:\n\nSA Plug\nEmail: support@saplug.com\nWebsite: www.saplug.com',
    },
  ],
};

export const PRIVACY: LegalDoc = {
  title: 'Privacy Policy',
  date: 'Last Updated: 10 May 2026',
  intro:
    'Welcome to SA Plug (\u201cSA Plug\u201d, \u201cwe\u201d, \u201cour\u201d, or \u201cus\u201d). Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, store, and protect your information when you use the SA Plug mobile application, website, and related services.\n\nBy using SA Plug, you agree to the collection and use of information in accordance with this Privacy Policy.',
  sections: [
    {
      heading: '1. Information We Collect',
      body: 'Personal Information\n\nWe may collect personal information including:\n\u2022 Full name\n\u2022 Email address\n\u2022 Phone number\n\u2022 Account login details\n\u2022 Profile information\n\u2022 Booking preferences\n\nBooking & Reservation Information\n\nWhen using SA Plug, we may collect:\n\u2022 Club reservations\n\u2022 Bottle service selections\n\u2022 Tour bookings\n\u2022 Restaurant reservations\n\u2022 Guest counts\n\u2022 Dates and times\n\u2022 Order history\n\u2022 Purchase information\n\nPayment Information\n\nPayments are processed through third-party payment providers. We may receive transaction confirmations and billing-related information, but we do not store full credit or debit card details on our servers unless required by our payment processor.\n\nDevice & Usage Information\n\nWe may automatically collect:\n\u2022 Device type\n\u2022 Operating system\n\u2022 IP address\n\u2022 App usage activity\n\u2022 Browser type\n\u2022 Crash reports\n\u2022 Analytics data\n\nLocation Information\n\nWith your permission, SA Plug may collect approximate or precise location data to help display nearby venues, experiences, restaurants, or services.\n\nCommunications\n\nWe may collect information when you:\n\u2022 Contact customer support\n\u2022 Submit reviews or feedback\n\u2022 Send messages through the app\n\u2022 Participate in promotions or surveys',
    },
    {
      heading: '2. How We Use Your Information',
      body: 'We use your information to:\n\n\u2022 Create and manage your account\n\u2022 Process bookings, reservations, and purchases\n\u2022 Confirm and manage club reservations and bottle service\n\u2022 Facilitate tour and dining reservations\n\u2022 Process payments and refunds\n\u2022 Communicate updates and confirmations\n\u2022 Improve app functionality and user experience\n\u2022 Provide customer support\n\u2022 Detect fraud and unauthorized activity\n\u2022 Comply with legal obligations',
    },
    {
      heading: '3. Sharing Your Information',
      body: 'We may share information with trusted third parties including:\n\nService Providers\n\nWe may share information with third-party companies that help us operate SA Plug, including:\n\u2022 Payment processors\n\u2022 Cloud hosting providers\n\u2022 Analytics providers\n\u2022 Messaging and notification providers\n\u2022 Customer support systems\n\u2022 Security and fraud prevention services\n\nVenues & Business Partners\n\nTo complete your booking or reservation, we may share relevant information with:\n\u2022 Clubs and nightlife venues\n\u2022 Tour operators\n\u2022 Restaurants\n\u2022 Hospitality partners\n\u2022 Product fulfillment providers\n\nInformation shared may include your name, booking time, guest count, reservation details, and contact information.\n\nLegal & Compliance\n\nWe may disclose information where required by law or where necessary to respond to lawful requests, enforce our Terms of Service, protect users or partners, or prevent fraud.\n\nBusiness Transfers\n\nIf SA Plug is involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.',
    },
    {
      heading: '4. Data Security',
      body: 'We implement reasonable administrative, technical, and security safeguards designed to protect your information from unauthorized access, disclosure, alteration, or destruction.\n\nHowever, no online platform or electronic transmission method can be guaranteed to be completely secure.',
    },
    {
      heading: '5. Data Retention',
      body: 'We retain personal information only as long as necessary to:\n\n\u2022 Provide our services\n\u2022 Fulfill legal obligations\n\u2022 Resolve disputes\n\u2022 Enforce agreements\n\u2022 Support legitimate business operations\n\nInformation that is no longer required may be securely deleted, anonymized, or archived.',
    },
    {
      heading: '6. Cookies & Analytics',
      body: 'SA Plug may use cookies, analytics tools, SDKs, and similar technologies to:\n\n\u2022 Improve app performance\n\u2022 Remember user preferences\n\u2022 Analyze app traffic and usage\n\u2022 Enhance user experience\n\u2022 Deliver relevant content and promotions\n\nYou may disable certain tracking technologies through your device or browser settings.',
    },
    {
      heading: '7. Your Rights',
      body: 'Depending on your location and applicable laws, you may have the right to:\n\n\u2022 Access your personal information\n\u2022 Correct inaccurate information\n\u2022 Request deletion of information\n\u2022 Withdraw consent\n\u2022 Object to certain processing\n\u2022 Opt out of marketing communications\n\nTo exercise these rights, please contact us using the information below.',
    },
    {
      heading: '8. Children\'s Privacy',
      body: 'SA Plug is not intended for users under the age of 18. We do not knowingly collect personal information from children.',
    },
    {
      heading: '9. Third-Party Services',
      body: 'Our platform may contain links to third-party websites or services. We are not responsible for the privacy practices or content of third-party platforms.\n\nWe encourage users to review third-party privacy policies before using their services.',
    },
    {
      heading: '10. International Data Transfers',
      body: 'Your information may be transferred to and processed in countries outside your country of residence where our service providers or partners operate.\n\nBy using SA Plug, you consent to such transfers where permitted by law.',
    },
    {
      heading: '11. Changes to This Privacy Policy',
      body: 'We may update this Privacy Policy periodically. Updates will be posted on this page with a revised \u201cLast Updated\u201d date.\n\nContinued use of SA Plug after updates means you accept the revised Privacy Policy.',
    },
    {
      heading: '12. Contact Us',
      body: 'If you have questions, concerns, or requests regarding this Privacy Policy, please contact us:\n\nSA Plug\nEmail: support@saplug.com\nWebsite: www.saplug.com',
    },
  ],
};

export const REFUND: LegalDoc = {
  title: 'Cancellation & Refund Policy',
  date: 'Last Updated: 10 May 2026',
  intro:
    'This Cancellation & Refund Policy applies to all bookings, reservations, purchases, and services made through SA Plug, including club bookings, bottle service, tours, dining reservations, event access, and shop purchases unless otherwise stated by the service provider.\n\nBy completing a booking through SA Plug, you acknowledge and agree to the terms outlined below.',
  sections: [
    {
      heading: '1. Booking Confirmation',
      body: 'Once a booking has been confirmed, venue allocation, staffing, availability, and service preparation are secured on your behalf.\n\nAll confirmed bookings are subject to this Cancellation & Refund Policy.',
    },
    {
      heading: '2. Standard Cancellation Fee',
      body: 'If a cancellation request is made more than 12 hours before the scheduled booking or event time:\n\n\u2022 A 20% cancellation fee will apply to the total booking value.\n\u2022 The remaining eligible balance may be refunded to the original payment method.\n\nRefund processing times may vary depending on your payment provider or financial institution.',
    },
    {
      heading: '3. No Refund Window',
      body: 'If a cancellation is made within 12 hours of the booking, reservation, tour, event, or service start time:\n\n\u2022 No refund will be provided\n\u2022 No partial refund will be issued\n\u2022 No credit is guaranteed\n\nThis applies to all:\n\u2022 Club reservations\n\u2022 VIP table bookings\n\u2022 Bottle service bookings\n\u2022 Tours and experiences\n\u2022 Restaurant reservations\n\u2022 Event packages\n\u2022 Add-ons and upgrades',
    },
    {
      heading: '4. No-Shows & Late Arrivals',
      body: 'Failure to attend a booking, arriving after venue admission cut-off times, or failure to use the reserved service will be considered a No-Show.\n\nNo-Shows are strictly non-refundable.',
    },
    {
      heading: '5. Rescheduling Requests',
      body: 'Rescheduling requests are subject to approval by the venue, operator, or service provider and are dependent on availability.\n\nRequests made within 12 hours of the booking time may be treated as cancellations and handled under the no-refund policy.\n\nSA Plug does not guarantee rescheduling availability.',
    },
    {
      heading: '6. Service Fees & Processing Charges',
      body: 'All service fees, convenience fees, platform charges, administration fees, and payment processing fees are non-refundable except where required under applicable law.',
    },
    {
      heading: '7. Provider or Venue Cancellations',
      body: 'If a booking is cancelled by SA Plug, a venue, restaurant, tour operator, or event partner, customers may receive one of the following remedies:\n\n\u2022 Full refund\n\u2022 Partial refund\n\u2022 Store credit\n\u2022 Rescheduled booking\n\u2022 Alternative service or experience\n\nThe remedy offered will depend on the nature of the cancellation and availability.',
    },
    {
      heading: '8. Operational Changes',
      body: 'SA Plug and its partners reserve the right to make operational adjustments including:\n\n\u2022 Venue changes\n\u2022 Time adjustments\n\u2022 Seating changes\n\u2022 Line-up changes\n\u2022 Capacity restrictions\n\u2022 Service modifications\n\nMinor operational changes do not qualify for refunds.',
    },
    {
      heading: '9. Shop Purchases',
      body: 'For products sold through the SA Plug Shop:\n\n\u2022 Orders that have already been processed or dispatched cannot be cancelled\n\u2022 Digital products are final once delivered\n\u2022 Refunds are only provided for defective, damaged, or incorrect products where required by law',
    },
    {
      heading: '10. Fraud, Abuse & Chargebacks',
      body: 'SA Plug reserves the right to investigate suspicious transactions, fraudulent activity, excessive cancellation behaviour, misuse of promotional offers, or abusive chargeback activity.\n\nAccounts involved in suspicious activity may be:\n\n\u2022 Restricted\n\u2022 Suspended\n\u2022 Permanently removed from the platform',
    },
    {
      heading: '11. Consumer Rights',
      body: 'Nothing in this policy excludes or limits rights available under applicable consumer protection laws.',
    },
    {
      heading: '12. Contact Us',
      body: 'For support regarding cancellations, refunds, or booking issues, contact:\n\nSA Plug\nEmail: support@saplug.com\nWebsite: www.saplug.com',
    },
  ],
};

export const PAYMENT: LegalDoc = {
  title: 'Payment Terms',
  date: 'Last Updated: 10 May 2026',
  intro:
    'These Payment Terms govern all payments, bookings, reservations, purchases, transactions, and financial interactions made through SA Plug within the Republic of South Africa.\n\nBy using SA Plug and completing a transaction, you agree to these Payment Terms.',
  sections: [
    {
      heading: '1. Payment Processing',
      body: 'SA Plug uses third-party payment providers and processors to facilitate transactions through the platform.\n\nPayments may include:\n\n\u2022 Club reservations\n\u2022 VIP table bookings\n\u2022 Bottle service\n\u2022 Tours and experiences\n\u2022 Dining reservations\n\u2022 Event-related purchases\n\u2022 Merchandise and shop purchases\n\u2022 Platform fees and service charges\n\nBy submitting payment information, you authorise SA Plug and its payment providers to process the transaction.',
    },
    {
      heading: '2. Accepted Payment Methods',
      body: 'SA Plug may accept payment methods including:\n\n\u2022 Debit cards\n\u2022 Credit cards\n\u2022 Digital wallets\n\u2022 Online payment platforms\n\u2022 Approved third-party payment services\n\nAvailable payment methods may vary depending on the service, provider, or region.',
    },
    {
      heading: '3. Currency',
      body: 'All prices displayed on SA Plug are processed in South African Rand (ZAR), unless otherwise specified.\n\nUsers are responsible for any exchange rate differences, international transaction fees, or banking charges imposed by their financial institution.',
    },
    {
      heading: '4. Pricing & Charges',
      body: 'Prices displayed on SA Plug may include:\n\n\u2022 Booking charges\n\u2022 Service fees\n\u2022 Processing fees\n\u2022 Convenience fees\n\u2022 Taxes where applicable\n\u2022 Provider-specific pricing\n\nSA Plug reserves the right to update pricing, fees, or charges at any time before a booking is confirmed.',
    },
    {
      heading: '5. Booking Authorisation',
      body: 'When completing a transaction, users authorise SA Plug and its payment processors to:\n\n\u2022 Charge the selected payment method\n\u2022 Verify payment information\n\u2022 Perform fraud prevention checks\n\u2022 Place temporary authorisation holds where necessary\n\nFailure of payment authorisation may result in booking cancellation or refusal of service.',
    },
    {
      heading: '6. Failed or Declined Payments',
      body: 'If a payment fails, is declined, reversed, or disputed:\n\n\u2022 The booking may be cancelled\n\u2022 Access to services may be denied\n\u2022 Accounts may be restricted pending resolution\n\nUsers remain responsible for outstanding amounts owed.',
    },
    {
      heading: '7. Chargebacks & Payment Disputes',
      body: 'Users agree not to initiate fraudulent or unjustified chargebacks.\n\nSA Plug reserves the right to:\n\n\u2022 Challenge disputed transactions\n\u2022 Suspend accounts\n\u2022 Recover outstanding amounts\n\u2022 Restrict future bookings\n\nEvidence provided in chargeback disputes may include booking confirmations, transaction records, venue confirmations, communication logs, and usage activity.',
    },
    {
      heading: '8. Refund Processing',
      body: 'Approved refunds are processed back to the original payment method where possible.\n\nRefund timing may vary depending on banks, card providers, payment processors, and international processing timelines.\n\nSA Plug does not control external banking processing times. Refund eligibility is governed separately under the applicable Cancellation & Refund Policy.',
    },
    {
      heading: '9. Fraud Prevention',
      body: 'SA Plug reserves the right to investigate and prevent suspected fraud, including:\n\n\u2022 Stolen payment methods\n\u2022 Unauthorised transactions\n\u2022 Suspicious booking activity\n\u2022 Identity misuse\n\u2022 Promotional abuse\n\nTransactions flagged as suspicious may be delayed, restricted, cancelled, or reviewed before approval.',
    },
    {
      heading: '10. Taxes & Regulatory Charges',
      body: 'Users remain responsible for any applicable taxes, duties, levies, government charges, or banking fees associated with their transactions where applicable under South African law.',
    },
    {
      heading: '11. Third-Party Payment Providers',
      body: 'SA Plug may rely on third-party payment gateways and processors.\n\nUsers acknowledge that:\n\n\u2022 Third-party payment services operate independently\n\u2022 External providers maintain their own terms and privacy policies\n\u2022 SA Plug is not responsible for failures, interruptions, or errors caused by external payment systems',
    },
    {
      heading: '12. Promotional Credits & Discounts',
      body: 'Promotional codes, discounts, referral credits, or vouchers:\n\n\u2022 May be subject to expiration dates\n\u2022 May not be transferable\n\u2022 May not be redeemable for cash\n\u2022 May be revoked where misuse is detected\n\nSA Plug reserves the right to cancel promotions or refuse promotional usage where abuse occurs.',
    },
    {
      heading: '13. Limitation of Liability',
      body: 'To the maximum extent permitted by South African law, SA Plug shall not be liable for:\n\n\u2022 Banking delays\n\u2022 Failed payment processing\n\u2022 Exchange rate fluctuations\n\u2022 Third-party payment provider interruptions\n\u2022 Unauthorised use caused by external compromise beyond reasonable control',
    },
    {
      heading: '14. Governing Law',
      body: 'These Payment Terms are governed by the laws of the Republic of South Africa.',
    },
    {
      heading: '15. Contact Information',
      body: 'For payment-related support or disputes, contact:\n\nSA Plug\nEmail: support@saplug.com\nWebsite: www.saplug.com\n\n\u00a9 2026 SA Plug. All Rights Reserved.',
    },
  ],
};

export const DISCLAIMER: LegalDoc = {
  title: 'Partner & Venue Disclaimer',
  date: 'Last Updated: 10 May 2026',
  intro:
    'This Partner & Venue Disclaimer applies to all bookings, reservations, experiences, purchases, and services facilitated through SA Plug within the Republic of South Africa.\n\nBy using SA Plug, you acknowledge and agree to the terms outlined below.',
  sections: [
    {
      heading: '1. Independent Third-Party Providers',
      body: 'SA Plug operates as a digital booking and discovery platform connecting users with independent third-party venues, restaurants, tour operators, event organizers, merchants, and hospitality providers.\n\nAll venues and providers featured on SA Plug operate independently and are solely responsible for their own:\n\n\u2022 Operations\n\u2022 Staffing\n\u2022 Service delivery\n\u2022 Licensing\n\u2022 Pricing\n\u2022 Safety practices\n\u2022 Customer service\n\u2022 Venue policies\n\u2022 Legal compliance\n\nSA Plug does not own, control, manage, or supervise third-party venues or operators.',
    },
    {
      heading: '2. Booking Facilitation Only',
      body: 'SA Plug\u2019s role is limited to facilitating bookings, reservations, payments, and customer discovery through the platform.\n\nSA Plug is not a party to the direct agreement between users and third-party venues or providers.\n\nAny disputes regarding services, venue experiences, product quality, operational issues, or customer experience remain primarily between the user and the applicable provider.',
    },
    {
      heading: '3. Venue Policies & Operational Decisions',
      body: 'Each venue or operator maintains sole discretion regarding:\n\n\u2022 Admission decisions\n\u2022 Dress code enforcement\n\u2022 Age verification\n\u2022 Service availability\n\u2022 Booking acceptance\n\u2022 Event capacity\n\u2022 Alcohol service\n\u2022 Operational hours\n\u2022 Event schedules\n\u2022 Seating arrangements\n\u2022 Safety procedures\n\nSA Plug is not responsible for decisions independently made by venues or service providers.',
    },
    {
      heading: '4. Changes, Delays & Availability',
      body: 'Venues and providers may modify or cancel services due to circumstances including but not limited to:\n\n\u2022 Operational requirements\n\u2022 Weather conditions\n\u2022 Staffing shortages\n\u2022 Technical issues\n\u2022 Licensing matters\n\u2022 Government restrictions\n\u2022 Security concerns\n\u2022 Force majeure events\n\nSA Plug does not guarantee uninterrupted availability of any listed venue, experience, event, or service.',
    },
    {
      heading: '5. Service Quality Disclaimer',
      body: 'While SA Plug aims to work with reputable partners, SA Plug does not guarantee:\n\n\u2022 Quality of service\n\u2022 Venue conditions\n\u2022 Staff conduct\n\u2022 Food quality\n\u2022 Entertainment line-ups\n\u2022 Transportation reliability\n\u2022 Event outcomes\n\u2022 Provider performance\n\nUser experiences may vary depending on the provider.',
    },
    {
      heading: '6. Third-Party Liability',
      body: 'To the maximum extent permitted under South African law, SA Plug shall not be responsible for:\n\n\u2022 Venue incidents\n\u2022 Customer disputes\n\u2022 Injuries or accidents\n\u2022 Property loss\n\u2022 Intoxication-related incidents\n\u2022 Operational failures\n\u2022 Delays\n\u2022 Cancellations\n\u2022 Provider misconduct\n\u2022 Dissatisfaction with third-party services\n\nUsers engage with venues and providers at their own discretion and risk.',
    },
    {
      heading: '7. Reviews & Listings',
      body: 'Venue descriptions, listings, images, ratings, promotions, menus, and service details may be supplied by third-party providers or sourced from publicly available information.\n\nSA Plug does not guarantee that all listing information is continuously accurate, complete, or current.\n\nProviders remain responsible for the accuracy of their own information.',
    },
    {
      heading: '8. External Agreements',
      body: 'Certain venues or operators may require users to agree to additional:\n\n\u2022 Venue terms\n\u2022 Waiver forms\n\u2022 Admission rules\n\u2022 Tour conditions\n\u2022 Transportation policies\n\u2022 Event conditions\n\nUsers remain responsible for reviewing and complying with any additional provider-specific requirements.',
    },
    {
      heading: '9. No Employment or Agency Relationship',
      body: 'Nothing in these terms creates any employment relationship, partnership, agency relationship, or joint venture between SA Plug and any third-party venue, provider, operator, or merchant.',
    },
    {
      heading: '10. User Responsibility',
      body: 'Users are responsible for:\n\n\u2022 Reviewing venue details\n\u2022 Complying with venue rules\n\u2022 Acting responsibly\n\u2022 Ensuring they meet age or admission requirements\n\u2022 Safeguarding personal belongings\n\u2022 Arranging transportation where necessary',
    },
    {
      heading: '11. Limitation of Liability',
      body: 'To the fullest extent permitted under applicable law, SA Plug disclaims liability for any loss, damage, claim, injury, or dispute arising from interactions with third-party venues or providers.',
    },
    {
      heading: '12. Governing Law',
      body: 'This Partner & Venue Disclaimer shall be governed by the laws of the Republic of South Africa.',
    },
    {
      heading: '13. Contact Information',
      body: 'For questions regarding this disclaimer, contact:\n\nSA Plug\nEmail: support@saplug.com\nWebsite: www.saplug.com',
    },
  ],
};
