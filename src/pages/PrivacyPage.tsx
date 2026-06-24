import React from "react";
import { HalftoneOverlay } from "../components/ui/HalftoneOverlay";
import { Footer } from "../components/layout/Footer";
import { useSEO } from "../lib/useSEO";

export function PrivacyPage() {
  useSEO("Privacy Policy", "LEKHYAS PRIVACY POLICY");

  return (
    <div className="min-h-screen bg-[#F4EFE0] pt-20">
      <div className="relative bg-[#0D0D0D] py-14 overflow-hidden">
        <HalftoneOverlay opacity={0.15} />
        <div className="max-w-4xl mx-auto px-6 relative">
          <h1 className="text-white" style={{ fontFamily: "Bangers, cursive", fontSize: "clamp(40px, 6vw, 68px)", letterSpacing: "0.05em", textShadow: "3px 3px 0 #C8181E" }}>LEKHYAS PRIVACY POLICY</h1>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-8" style={{ background: "#F4EFE0", clipPath: "polygon(0 100%, 100% 0, 100% 100%)" }} />
      </div>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="border-4 border-black bg-white p-8 md:p-12" style={{ boxShadow: "4px 4px 0 #0D0D0D" }}>
          <div className="prose max-w-none text-sm md:text-base leading-relaxed space-y-6 text-[#2A2A2A]" style={{ fontFamily: "DM Sans, sans-serif" }}>
            <p className="font-bold">Effective Date: June 24, 2026</p>
            <p>Welcome to the LEKHYAS Privacy Center. Your privacy is exceptionally important to us. This Privacy Policy describes how LEKHYAS ("Company", "we", "us", or "our") collects, uses, processes, stores, and protects your personal data when you interact with our websites, mobile applications, digital libraries, streaming services, and interactive entertainment experiences (collectively, the "LEKHYAS Services").</p>
            
            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 font-medium text-blue-900">
              <p>COMPLIANCE NOTICE: This Privacy Policy is formulated in strict compliance with the Digital Personal Data Protection (DPDP) Act, 2023 of India, the Information Technology Act, 2000, and other applicable data protection regulations in India. By using our services, you signify your explicit consent to the processing of your personal data as outlined below.</p>
            </div>
            
            <h3 className="font-bold text-lg text-[#0D0D0D] mt-8 mb-4">1. Data We Collect</h3>
            <p>We collect personal data to provide and improve the LEKHYAS Services. The types of digital personal data we process include:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Account Information:</strong> Name, email address, phone number, date of birth, username, and password created when you register an account.</li>
              <li><strong>Transaction Data:</strong> Details regarding payment modes, subscriptions, billing history, and purchases processed through RBI-approved gateways. We do not store full credit/debit card numbers on our servers.</li>
              <li><strong>Usage and Device Data:</strong> IP addresses, unique device identifiers, browser types, operating systems, platform interactions, preferences, and viewing history.</li>
              <li><strong>User Submissions:</strong> Feedback, chat history, community forum posts, and content uploaded to our services.</li>
            </ul>

            <h3 className="font-bold text-lg text-[#0D0D0D] mt-8 mb-4">2. Grounds and Purposes for Processing Personal Data</h3>
            <p>In accordance with the DPDP Act, 2023, LEKHYAS processes your digital personal data only based on valid grounds, primarily your unambiguous, specific, and revocable Consent, or for certain legitimate uses as specified under law. We use your data for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide, personalize, maintain, and improve the LEKHYAS Services.</li>
              <li>To manage your account registration, subscriptions, and verified payments.</li>
              <li>To communicate with you regarding service updates, technical alerts, promotional material, and marketing campaigns (where consented to).</li>
              <li>To maintain secure systems, prevent fraudulent activity, and enforce our Terms of Use.</li>
              <li>To comply with legal obligations, judicial directions, or statutory requirements under Indian law.</li>
            </ul>

            <h3 className="font-bold text-lg text-[#0D0D0D] mt-8 mb-4">3. Consent and Your Rights as a Data Principal</h3>
            <p>Under the DPDP Act, 2023, you are recognized as the "Data Principal" and have complete autonomy over your digital personal data. You are entitled to exercise the following rights:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Right to Access:</strong> Request a summary of your personal data being processed by us and the list of third parties with whom it has been shared.</li>
              <li><strong>Right to Correction and Erasure:</strong> Request the correction of inaccurate or incomplete data, or the deletion of data that is no longer necessary for the purposes it was collected for.</li>
              <li><strong>Right to Withdraw Consent:</strong> You have the right to withdraw your consent to data processing at any time. Withdrawal of consent will not affect the legality of processing done prior to withdrawal, but may limit your access to certain features.</li>
              <li><strong>Right of Grievance Redressal:</strong> Register grievances regarding any data processing discrepancies directly with our designated Data Protection Officer/Grievance Officer.</li>
              <li><strong>Right to Nominate:</strong> Nominate an individual to exercise your data rights in the event of death or incapacity.</li>
            </ul>

            <h3 className="font-bold text-lg text-[#0D0D0D] mt-8 mb-4">4. Data Sharing and Transfers</h3>
            <p>We do not sell your personal data to third parties. We share your data only with your explicit consent or under the following circumstances:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Service Providers:</strong> Trusted vendors handling payment processing, customer support, analytics, and marketing deployment under strict data privacy contracts.</li>
              <li><strong>Corporate Affiliates:</strong> Group entities under the LEKHYAS brand to ensure seamless single sign-on capabilities and global infrastructure support.</li>
              <li><strong>Legal Requirements:</strong> Government agencies, law enforcement, or regulatory bodies when required by law or to protect our legal rights.</li>
              <li><strong>Cross-Border Transfers:</strong> Data may be transferred outside India for cloud storage or processing, ensuring alignment with the cross-border transfer rules mandated by the Government of India under the DPDP Act.</li>
            </ul>

            <h3 className="font-bold text-lg text-[#0D0D0D] mt-8 mb-4">5. Data Security and Retention</h3>
            <p>LEKHYAS implements appropriate technical and organizational security measures to prevent unauthorized access, alteration, disclosure, or destruction of your digital personal data. We retain your personal data only as long as necessary to fulfill the operational purposes detailed in this policy, or to fulfill legal, accounting, and statutory requirements under Indian law. Once the purpose is met or consent is withdrawn, your data will be securely erased or anonymized.</p>

            <h3 className="font-bold text-lg text-[#0D0D0D] mt-8 mb-4">6. Children's Data</h3>
            <p>LEKHYAS provides services intended for broad audiences, including families and children. In accordance with the DPDP Act, 2023, processing personal data of children (individuals under the age of 18) requires verifiable parental consent. We do not engage in tracking, behavioral monitoring, or targeted advertising directed at children, nor do we process data that could harm a child's well-being.</p>

            <h3 className="font-bold text-lg text-[#0D0D0D] mt-8 mb-4">7. Data Protection Officer (DPO) & Grievance Redressal</h3>
            <p>If you have any questions, wish to exercise your rights as a Data Principal, or intend to file a complaint regarding our data handling practices, please contact our designated Grievance Officer and Data Protection Officer:</p>
            <div className="bg-gray-50 p-4 border border-gray-200 mt-2">
              <p>Attn: Data Protection Officer / Grievance Officer<br/>
              LEKHYAS Privacy & Compliance Division<br/>
              Email: privacy@lekhyas-entertainment.in<br/>
              Address: [Insert Indian Corporate Office Address]</p>
            </div>
            <p>We aim to acknowledge and address all valid grievances in an expedited manner and within the statutory period stipulated under Indian law. If you remain unsatisfied with our resolution, you have the right to approach the Data Protection Board of India (DPBI).</p>

            <h3 className="font-bold text-lg text-[#0D0D0D] mt-8 mb-4">8. Updates to this Privacy Policy</h3>
            <p>LEKHYAS may periodically update this Privacy Policy to reflect statutory changes or evolving business practices. We will notify you of significant changes by modifying the effective date at the top of this policy and updating the notification banners on our platform where appropriate.</p>

            <p className="text-center text-gray-500 mt-12 pt-8 border-t border-gray-200">LEKHYAS Privacy Center</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
