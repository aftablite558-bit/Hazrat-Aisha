import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { ShieldCheck, Eye, Lock, FileText, UserCheck } from 'lucide-react';
import { SEO } from '../../components/seo/SEO';
import { Card } from '../../components/ui/card';

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
    <div className="bg-transparent min-h-screen pb-24 font-body">
      <SEO title="Privacy Policy" description="Learn about how student and parental information is processed and secured at Hazrat Aisha Academy." />

      {/* Header */}
      <header className="public-page-header">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-display tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-white/80 font-semibold max-w-2xl mx-auto text-sm sm:text-base mb-6">
          Hazrat Aisha Academy is committed to keeping the digital records of our families private and safe.
        </p>

        {/* Page Heading Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          <Link to="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase border border-white/20 bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-md">
            <span>← Back to Home</span>
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        
        {/* Core Notice */}
        <Card className="p-6 mb-12">
          <p className="text-sm font-bold text-content-secondary leading-relaxed relative z-10">
            <strong>Last Updated: July 16, 2026</strong>. This privacy policy applies to all parent interactions, online admission inquiries, student result inquiry workflows, and staff dashboards accessed on the official <strong>hazrataishaacademy.edu</strong> website. Please read it carefully.
          </p>
        </Card>

        {/* Breakdown of sections */}
        <div className="space-y-8">
          {sections.map((sec, index) => {
            const Icon = sec.icon;
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
                        {sec.title}
                      </h2>
                      <p className="text-sm font-medium text-content-secondary leading-relaxed">
                        {sec.desc}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Contact Legal */}
        <Card className="mt-16 p-8 text-center bg-white/40 dark:bg-black/20">
          <div className="relative z-10">
            <FileText className="w-10 h-10 text-primary mx-auto mb-4 drop-shadow-md" />
            <h3 className="text-lg font-bold text-content font-display mb-2">Have questions about our data practices?</h3>
            <p className="text-sm font-bold text-content-secondary max-w-lg mx-auto mb-4">
              If you have concerns about student record access, deletion, or correction, contact the Chief IT Officer or Registrar at our school office.
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
