import React from 'react';
import { motion } from 'motion/react';
import { FileWarning, HelpCircle, Scale, ShieldAlert, CheckSquare } from 'lucide-react';
import { SEO } from '../../components/seo/SEO';

export function TermsConditions() {
  const terms = [
    {
      icon: Scale,
      title: "1. Acceptance of Academic Rules",
      desc: "By securing admission for their child or accessing the digital portals, parents and candidates explicitly agree to be bound by the official academic curriculum, disciplinary regulations, and general code of conduct set by Hazrat Aisha Academy."
    },
    {
      icon: CheckSquare,
      title: "2. Payment Obligations & Refunds",
      desc: "Fees are payable in quarterly installments by the designated 15th-day deadline. All registrations, prospectuses, admission fees, and quarterly tuition payments are strictly non-refundable and non-transferable."
    },
    {
      icon: ShieldAlert,
      title: "3. Responsible Digital Usage",
      desc: "Students and guardians are prohibited from sharing portal credentials, manipulating digital results files, or scraping any school metadata from our web infrastructure. Academic records published on our Results portal are the intellectual property of Hazrat Aisha Academy."
    },
    {
      icon: FileWarning,
      title: "4. Attendance & Code of Conduct",
      desc: "To be eligible for quarterly and final school examinations, students must maintain a minimum attendance of 75% in all registered classes. High moral standards, courtesy, and respect towards peers and faculty members are mandatory."
    }
  ];

  return (
    <div className="bg-[var(--bg-surface-raised)] min-h-screen pb-24 font-body">
      <SEO title="Terms & Conditions" description="Review the official school code of conduct, digital policies, and terms of service for Hazrat Aisha Academy." />

      {/* Header */}
      <header className="bg-primary py-16 text-center px-4 relative overflow-hidden border-b border-line shadow-sm">
        <h1 className="text-3xl sm:text-4xl font-black text-content-inverse mb-4 font-display uppercase tracking-tight">
          Terms & Conditions
        </h1>
        <p className="text-content-inverse/80 font-semibold max-w-2xl mx-auto text-sm sm:text-base">
          Standard code of conduct, financial, and digital usage agreements of Hazrat Aisha Academy.
        </p>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">

        {/* Introduction */}
        <section className="bg-surface border border-line rounded-2xl p-6 mb-12 shadow-e1">
          <p className="text-xs font-bold text-content-secondary leading-relaxed">
            <strong>Last Updated: July 16, 2026</strong>. By enrolling a candidate at Hazrat Aisha Academy or accessing this digital school portal, you agree to these Terms. Please review them thoroughly before initiating admissions or registrations.
          </p>
        </section>

        {/* List of Terms */}
        <div className="space-y-8">
          {terms.map((term, index) => {
            const Icon = term.icon;
            return (
              <motion.article 
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-surface border border-line rounded-2xl p-6 md:p-8 shadow-e1 hover:shadow-e2 transition-all duration-fast"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0" aria-hidden="true">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-content font-display mb-2">
                      {term.title}
                    </h2>
                    <p className="text-sm font-medium text-content-secondary leading-relaxed">
                      {term.desc}
                    </p>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Footer Query */}
        <section className="mt-16 bg-surface border border-line rounded-2xl p-8 text-center shadow-e1">
          <HelpCircle className="w-8 h-8 text-primary mx-auto mb-4" />
          <h3 className="text-base font-extrabold text-content font-display mb-2">Need clarification on these terms?</h3>
          <p className="text-xs font-bold text-content-secondary max-w-lg mx-auto mb-4">
            If you have questions about school bylaws, fine policies, or attendance rules, contact our Administrative Office during standard school hours.
          </p>
          <a href="tel:+919470818538" className="text-xs font-black text-primary hover:underline">
            +91 9470818538
          </a>
        </section>

      </div>
    </div>
  );
}
