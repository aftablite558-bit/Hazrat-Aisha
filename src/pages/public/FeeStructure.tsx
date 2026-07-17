import React from 'react';
import { CreditCard, Wallet, Phone, Clock, Landmark } from 'lucide-react';
import { SEO } from '../../components/seo/SEO';

export function FeeStructure() {
  return (
    <div className="bg-[var(--bg-surface-raised)] min-h-screen pb-24 font-body">
      <SEO title="Fee Structure" description="For transparent and complete fee structure details, please contact the Hazrat Aisha Academy administrative office." />

      {/* Header */}
      <header className="bg-primary py-20 text-center px-4 relative overflow-hidden border-b border-line shadow-sm">
        <h1 className="text-4xl sm:text-5xl font-black text-content-inverse mb-4 font-display uppercase tracking-tight">
          Fee Structure
        </h1>
        <p className="text-content-inverse/80 font-semibold max-w-7xl mx-auto text-sm sm:text-base">
          Investing in your child's academic and moral future with transparent school fees.
        </p>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">

        {/* Core Info Card */}
        <section className="bg-surface border border-line rounded-3xl p-8 md:p-12 mb-12 shadow-e3 relative overflow-hidden text-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
          
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-6 border border-primary/20 text-primary">
            <CreditCard className="w-10 h-10" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-content font-display tracking-tight mb-4 uppercase">
            Contact School Office for Fee Details
          </h2>
          
          <p className="text-content-secondary font-semibold leading-relaxed max-w-2xl mx-auto mb-8 text-sm sm:text-base">
            In our commitment to providing clear and personalized information, the detailed fee structure for the current academic session—covering classes from **Baby Class to Class VIII**—is available directly through the school administration. We keep our fees balanced to ensure high-quality, modern English Medium education integrated with authentic Islamic values is accessible to our community.
          </p>

          <div className="grid sm:grid-cols-2 gap-6 max-w-lg mx-auto mb-10 text-left">
            <div className="bg-surface-raised border border-line p-5 rounded-2xl flex items-start gap-4">
              <Phone className="w-6 h-6 text-primary shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-black text-content uppercase tracking-wider mb-1">Call Office</h3>
                <a href="tel:+919470818538" className="text-base font-extrabold text-primary hover:underline">+91 9470818538</a>
              </div>
            </div>

            <div className="bg-surface-raised border border-line p-5 rounded-2xl flex items-start gap-4">
              <Clock className="w-6 h-6 text-primary shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-black text-content uppercase tracking-wider mb-1">Office Hours</h3>
                <p className="text-xs font-semibold text-content-secondary leading-relaxed">
                  Summer: 8:00 AM – 1:00 PM<br />
                  Winter: 9:00 AM – 1:00 PM<br />
                  <span className="font-bold text-danger-500">Friday Closed</span>
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-line pt-8 max-w-xl mx-auto">
            <h3 className="text-sm font-black text-content uppercase tracking-wider mb-3">Campus Location</h3>
            <p className="text-sm font-semibold text-content-secondary leading-relaxed">
              Sharif Colony, Ansari Road, Chak Rajopatti,<br />
              Sitamarhi, Bihar – 843302
            </p>
          </div>
        </section>

        {/* Concessions / Guidelines */}
        <section className="bg-surface border border-line rounded-2xl p-6 shadow-e1">
          <h3 className="text-lg font-extrabold text-content font-display mb-4 flex items-center gap-2">
            <Wallet className="w-5 h-5 text-primary" />
            <span>Admissions & Payment Guidelines</span>
          </h3>
          <ul className="space-y-3 text-xs font-semibold text-content-secondary leading-relaxed list-disc list-inside">
            <li>Admissions are officially open every **April** for all grades.</li>
            <li>We offer **English Medium** instructions integrated with authentic Islamic teachings via our **Idara Ashraful Banat (Madarsa Wing)**.</li>
            <li>Uniform compliance is required: **4 Days Green & White**, and **2 Days Full White**.</li>
            <li>For any concessions or sibling benefits, please present relevant documentation to the Principal's Office.</li>
          </ul>
        </section>

      </div>
    </div>
  );
}
