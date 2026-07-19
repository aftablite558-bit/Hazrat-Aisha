import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { FileWarning, HelpCircle, Scale, ShieldAlert, CheckSquare } from 'lucide-react';
import { SEO } from '../../components/seo/SEO';
import { Card } from '../../components/ui/card';

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
    <div className="bg-transparent min-h-screen pb-24 font-body">
      <SEO title="Terms & Conditions" description="Review the official school code of conduct, digital policies, and terms of service for Hazrat Aisha Academy." />

      {/* Header */}
      <header className="public-page-header">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-display tracking-tight">
          Terms & Conditions
        </h1>
        <p className="text-white/80 font-semibold max-w-2xl mx-auto text-sm sm:text-base mb-6">
          Standard code of conduct, financial, and digital usage agreements of Hazrat Aisha Academy.
        </p>

        {/* Page Heading Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          <Link to="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase border border-white/20 bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-md">
            <span>← Back to Home</span>
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">

        {/* Introduction */}
        <Card className="p-6 mb-12">
          <p className="text-sm font-bold text-content-secondary leading-relaxed relative z-10">
            <strong>Last Updated: July 16, 2026</strong>. By enrolling a candidate at Hazrat Aisha Academy or accessing this digital school portal, you agree to these Terms. Please review them thoroughly before initiating admissions or registrations.
          </p>
        </Card>

        {/* List of Terms */}
        <div className="space-y-8">
          {terms.map((term, index) => {
            const Icon = term.icon;
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-6 md:p-8 hover:-translate-y-1 transition-transform duration-300">
                  <div className="flex items-start gap-4 relative z-10">
                    <div className="w-12 h-12 rounded-[1.25rem] bg-primary/20 backdrop-blur-md border border-primary/30 flex items-center justify-center text-primary shrink-0" aria-hidden="true">
                      <Icon className="w-6 h-6 drop-shadow-md" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-content font-display mb-2">
                        {term.title}
                      </h2>
                      <p className="text-sm font-medium text-content-secondary leading-relaxed">
                        {term.desc}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Footer Query */}
        <Card className="mt-16 p-8 text-center bg-white/40 dark:bg-black/20">
          <div className="relative z-10">
            <HelpCircle className="w-10 h-10 text-primary mx-auto mb-4 drop-shadow-md" />
            <h3 className="text-lg font-bold text-content font-display mb-2">Need clarification on these terms?</h3>
            <p className="text-sm font-bold text-content-secondary max-w-lg mx-auto mb-4">
              If you have questions about school bylaws, fine policies, or attendance rules, contact our Administrative Office during standard school hours.
            </p>
            <a href="tel:+919470818538" className="text-sm font-bold text-primary hover:underline">
              +91 9470818538
            </a>
          </div>
        </Card>

      </div>
    </div>
  );
}
