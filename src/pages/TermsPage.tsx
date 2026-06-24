import React from "react";
import { HalftoneOverlay } from "../components/ui/HalftoneOverlay";
import { Footer } from "../components/layout/Footer";
import { useSEO } from "../lib/useSEO";

export function TermsPage() {
  useSEO("Terms of Use", "LEKHYAS TERMS OF USE");

  return (
    <div className="min-h-screen bg-[#F4EFE0] pt-20">
      <div className="relative bg-[#0D0D0D] py-14 overflow-hidden">
        <HalftoneOverlay opacity={0.15} />
        <div className="max-w-4xl mx-auto px-6 relative">
          <h1 className="text-white" style={{ fontFamily: "Bangers, cursive", fontSize: "clamp(40px, 6vw, 68px)", letterSpacing: "0.05em", textShadow: "3px 3px 0 #C8181E" }}>LEKHYAS TERMS OF USE</h1>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-8" style={{ background: "#F4EFE0", clipPath: "polygon(0 100%, 100% 0, 100% 100%)" }} />
      </div>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="border-4 border-black bg-white p-8 md:p-12" style={{ boxShadow: "4px 4px 0 #0D0D0D" }}>
          <div className="prose max-w-none text-sm md:text-base leading-relaxed space-y-6 text-[#2A2A2A]" style={{ fontFamily: "DM Sans, sans-serif" }}>
            <p className="font-bold">Effective Date: June 24, 2026</p>
            <p>Welcome to LEKHYAS. These Terms of Use ("Agreement") form a binding legal contract between you ("User", "you", or "your") and LEKHYAS ("Company", "we", "us", or "our") governing your access to and use of our websites, mobile applications, interactive platforms, publications, digital products, entertainment content, and other related services (collectively, the "LEKHYAS Services").</p>
            
            <div className="bg-red-50 border-l-4 border-red-600 p-4 font-medium text-red-900">
              <p>IMPORTANT LEGAL NOTICE: PLEASE READ THESE TERMS OF USE CAREFULLY BEFORE ACCESSING OR USING THE LEKHYAS SERVICES. BY ACCESSING, REGISTERING FOR, OR USING THE SERVICES, YOU AGREE TO BE BOUND BY THESE TERMS, WHICH INCLUDE A MANDATORY ARBITRATION CLAUSE AND GOVERNING LAW CLAUSES UNDER THE LAWS OF INDIA.</p>
            </div>
            
            <h3 className="font-bold text-lg text-[#0D0D0D] mt-8 mb-4">1. Acceptance of Terms & Eligibility</h3>
            <p>By downloading, accessing, browsing, or using any part of the LEKHYAS Services, you acknowledge that you have read, understood, and agree to be bound by this Agreement. If you do not agree to these terms, you must immediately cease using the LEKHYAS Services.</p>
            <p>In compliance with the Indian Contract Act, 1872, you represent that you are at least 18 years of age and competent to enter into a legally binding contract. If you are under the age of 18, you may use the LEKHYAS Services only under the supervision and guidance of a parent or legal guardian who agrees to be bound by these terms.</p>
            
            <h3 className="font-bold text-lg text-[#0D0D0D] mt-8 mb-4">2. Intellectual Property Rights & Character Ownership</h3>
            <p>All materials and content included in or made available through the LEKHYAS Services—including but not limited to text, graphics, logos, brand names, character names, character likenesses, scripts, artwork, animations, audio, video, digital downloads, data compilations, and software—are the exclusive intellectual property of LEKHYAS or its content suppliers. This property is protected under the Indian Copyright Act, 1957, the Trade Marks Act, 1999, and other applicable intellectual property laws of India and international treaties.</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Limited License:</strong> LEKHYAS grants you a limited, non-exclusive, non-sublicensable, non-transferable, and revocable license to access and make personal, non-commercial use of the LEKHYAS Services.</li>
              <li><strong>Strict Restrictions:</strong> You shall not copy, reproduce, duplicate, modify, redistribute, sell, resell, lease, broadcast, publicly display, or create derivative works from any LEKHYAS content or characters without our explicit, prior written authorization. Any unauthorized use automatically terminates the license granted herein.</li>
            </ul>

            <h3 className="font-bold text-lg text-[#0D0D0D] mt-8 mb-4">3. User Accounts and Content Compliance</h3>
            <p>To access certain premium features, digital libraries, or community forums, you may be required to register and create a user account. You agree to provide accurate, current, and complete information during registration. You are solely responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
            <p>In accordance with Rule 3 of the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, you explicitly agree that you will not host, display, upload, modify, publish, transmit, store, update, or share any information or User-Generated Content that:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Belongs to another person and to which you do not have any right;</li>
              <li>Is defamatory, obscene, pornographic, pedophilic, invasive of another's privacy, insulting or harassing on the basis of gender, libelous, racially or ethnically objectionable;</li>
              <li>Infringes any patent, trademark, copyright, or other proprietary rights;</li>
              <li>Violates any law for the time being in force;</li>
              <li>Deceives or misleads the addressee about the origin of the message or knowingly communicates any misinformation;</li>
              <li>Threatens the unity, integrity, defense, security, or sovereignty of India, friendly relations with foreign States, or public order.</li>
            </ul>

            <h3 className="font-bold text-lg text-[#0D0D0D] mt-8 mb-4">4. Digital Purchases, Payments, and Subscriptions</h3>
            <p>If you purchase any digital merchandise, access tokens, or subscription plans (such as a LEKHYAS digital library pass) through the platform:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>All payments are processed securely through authorized third-party payment gateways operating under the regulations of the Reserve Bank of India (RBI).</li>
              <li>Prices for products and services are inclusive of applicable taxes, including Goods and Services Tax (GST), unless stated otherwise.</li>
              <li><strong>Cancellation & Refunds:</strong> Subscription fees are non-refundable once billed, except as explicitly required under applicable consumer protection rules. You may cancel your subscription at any time to prevent future automated billing.</li>
            </ul>

            <h3 className="font-bold text-lg text-[#0D0D0D] mt-8 mb-4">5. Grievance Redressal Mechanism & Intellectual Property Infringement</h3>
            <p>LEKHYAS respects the intellectual property rights of others and is committed to maintaining a safe and lawful platform environment in compliance with Indian internet regulations.</p>
            <p><strong>Grievance Officer:</strong> In accordance with the Information Technology Act, 2000 and Rules made thereunder, the name and contact details of the Grievance Officer for LEKHYAS are provided below for handling user complaints, content objections, or copyright infringement notifications:</p>
            <div className="bg-gray-50 p-4 border border-gray-200 mt-2">
              <p>Attn: Grievance Officer / Copyright Agent<br/>
              LEKHYAS Legal Department<br/>
              Email: grievance@lekhyas-entertainment.in<br/>
              Address: [Insert Indian Corporate Office Address]</p>
            </div>
            <p>Upon receipt of a valid and legitimate notice containing specific details of copyright infringement or offensive content, LEKHYAS will investigate and take appropriate action (such as disabling access or removing the content) within the timelines mandated under Indian law.</p>

            <h3 className="font-bold text-lg text-[#0D0D0D] mt-8 mb-4">6. Disclaimer of Warranties & Limitation of Liability</h3>
            <p className="uppercase text-xs md:text-sm">THE LEKHYAS SERVICES ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT ANY REPRESENTATIONS OR WARRANTIES, EXPRESS OR IMPLIED, EXCEPT AS OTHERWISE SPECIFIED IN WRITING. LEKHYAS DOES NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE. TO THE MAXIMUM EXTENT PERMITTED UNDER APPLICABLE LAW, LEKHYAS, ITS DIRECTORS, EMPLOYEES, OR AFFILIATES SHALL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING OUT OF THE USE OF OR INABILITY TO USE THE SERVICES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.</p>

            <h3 className="font-bold text-lg text-[#0D0D0D] mt-8 mb-4">7. Governing Law and Jurisdiction</h3>
            <p>This Agreement, its construction, validity, performance, and any disputes arising out of or in connection with it shall be governed by, and interpreted exclusively in accordance with, the laws of the Republic of India, without giving effect to any principles of conflicts of laws. Subject to the dispute resolution provision below, you explicitly agree that the courts located in [Insert City, e.g., Hyderabad / Mumbai / New Delhi], India, shall have exclusive jurisdiction over any legal actions or proceedings arising out of this Agreement.</p>

            <h3 className="font-bold text-lg text-[#0D0D0D] mt-8 mb-4">8. Dispute Resolution (Arbitration)</h3>
            <p>Any dispute, controversy, or claim arising out of or relating to this Agreement, including its existence, validity, interpretation, performance, breach, or termination, shall be referred to and finally resolved by binding arbitration in accordance with the Arbitration and Conciliation Act, 1996 (as amended from time to time).</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>The arbitration shall be conducted by a sole arbitrator mutually appointed by both parties.</li>
              <li>The place and seat of the arbitration shall be [Insert City, India].</li>
              <li>The language of the arbitration proceedings shall be English.</li>
              <li>The arbitral award shall be final, binding, and enforceable on both parties.</li>
            </ul>

            <h3 className="font-bold text-lg text-[#0D0D0D] mt-8 mb-4">9. Severability and Amendments</h3>
            <p>If any provision of this Agreement is found to be unlawful, void, or for any reason unenforceable by a court or arbitral tribunal, then that provision shall be deemed severable from this Agreement and shall not affect the validity and enforceability of any remaining provisions.</p>
            <p>LEKHYAS reserves the right to modify, amend, or update these Terms of Use at any time to reflect legislative changes, business practices, or new product offerings. Updated terms will be posted on our platform with a revised effective date. Your continued use of the platform after such updates implies absolute acceptance of the revised Terms of Use.</p>
            
            <p className="text-center text-gray-500 mt-12 pt-8 border-t border-gray-200">LEKHYAS © 2026</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
