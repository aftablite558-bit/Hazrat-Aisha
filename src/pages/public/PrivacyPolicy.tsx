import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Eye, Lock, FileText, UserCheck } from 'lucide-react';
import { SEO } from '../../components/seo/SEO';

export function PrivacyPolicy() {
  const sections = [
    {
      icon: Eye,
      title: "Information We Collect",
      desc: "We collect basic identifying personal information during student registration, admission inquiries, and portals. This includes candidate name, age, gender, previous academic grades, parent/guardian contact details, address, billing details, and any document files uploaded to our servers."
    },
    {
      icon: UserCheck,
      title: "How We Use Information",
      desc: "The collected information is solely used to process administrative registrations, publish exam results on the portal, facilitate safe parent-teacher-principal communications, process school fee schedules, and deliver official school notices or academic newsletters."
    },
    {
      icon: Lock,
      title: "Data Protection & Storage",
      desc: "Our platform integrates Firebase Cloud Firestore and Authentication. All student files, credentials, and records are protected by backend firewalls and strict security rules to prevent leaks, hacks, or unauthorized access by external users."
    },
    {
      icon: ShieldCheck,
      title: "Cookie Usage & Analytics",
      desc: "We utilize minimal browser cookies solely to maintain active sessions for logged-in staff members and preserve system preferences (such as light/dark interface modes). We do not run any invasive third-party ad tracking or sharing mechanisms."
    }
  ];

  return (
    <div className="bg-[var(--bg-surface-raised)] min-h-screen pb-24 font-body">
      <SEO title="Privacy Policy" description="Learn about how student and parental information is processed and secured at Hazrat Aisha Academy." />

      {/* Header */}
      <header className="bg-primary py-16 text-center px-4 relative overflow-hidden border-b border-line shadow-sm">
        <h1 className="text-3xl sm:text-4xl font-black text-content-inverse mb-4 font-display uppercase tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-content-inverse/80 font-semibold max-w-2xl mx-auto text-sm sm:text-base">
          Hazrat Aisha Academy is committed to keeping the digital records of our families private and safe.
        </p>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        
        {/* Core Notice */}
        <section className="bg-surface border border-line rounded-2xl p-6 mb-12 shadow-e1">
          <p className="text-xs font-bold text-content-secondary leading-relaxed">
            <strong>Last Updated: July 16, 2026</strong>. This privacy policy applies to all parent interactions, online admission inquiries, student result inquiry workflows, and staff dashboards accessed on the official <strong>hazrataishaacademy.edu</strong> website. Please read it carefully.
          </p>
        </section>

        {/* Breakdown of sections */}
        <div className="space-y-8">
          {sections.map((sec, index) => {
            const Icon = sec.icon;
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
                      {sec.title}
                    </h2>
                    <p className="text-sm font-medium text-content-secondary leading-relaxed">
                      {sec.desc}
                    </p>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Contact Legal */}
        <section className="mt-16 bg-surface border border-line rounded-2xl p-8 text-center shadow-e1">
          <FileText className="w-8 h-8 text-primary mx-auto mb-4" />
          <h3 className="text-base font-extrabold text-content font-display mb-2">Have questions about our data practices?</h3>
          <p className="text-xs font-bold text-content-secondary max-w-lg mx-auto mb-4">
            If you have concerns about student record access, deletion, or correction, contact the Chief IT Officer or Registrar at our school office.
          </p>
          <a href="tel:+919470818538" className="text-xs font-black text-primary hover:underline">
            +91 9470818538
          </a>
        </section>

      </div>
    </div>
  );
}
