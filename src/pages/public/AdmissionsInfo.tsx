import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { CheckCircle2, FileText, Calendar, Clock, UserCheck, ArrowRight, ShieldAlert } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { SEO } from '../../components/seo/SEO';

export function AdmissionsInfo() {
  const navigate = useNavigate();

  const admissionSteps = [
    {
      step: "01",
      title: "Online Registration",
      desc: "Fill out the online admission inquiry or registration form on our Contact page with your details."
    },
    {
      step: "02",
      title: "Interaction / Entrance Test",
      desc: "An interaction or entrance test (for Classes III and above) will be conducted to assess the student's foundation."
    },
    {
      step: "03",
      title: "Document Verification",
      desc: "Bring the required documents (birth certificate, transfer certificate, etc.) to the school office."
    },
    {
      step: "04",
      title: "Admission Confirmation",
      desc: "Upon successful verification and evaluation, complete the fee payment to secure your seat."
    }
  ];

  const eligibilityCriteria = [
    { class: "Baby Class & Nursery (Nursery / LKG)", age: "3 to 4 Years", criteria: "Direct interaction with parents and child." },
    { class: "UKG & Class I", age: "5 to 6 Years", criteria: "Basic evaluation of language, motor skills, and foundational moral manners." },
    { class: "Classes II to V (Primary)", age: "7 to 10 Years", criteria: "Assessment in Mathematics, English, and Basic Arabic/Urdu." },
    { class: "Classes VI to VIII (Middle)", age: "11 to 13 Years", criteria: "Entrance test in Mathematics, English, General Science, and Urdu/Deeniyat." }
  ];

  return (
    <div className="bg-[var(--bg-surface-raised)] min-h-screen pb-24 font-body">
      <SEO title="Admissions Info" description="Learn about the admission process, eligibility criteria, and required documents for Hazrat Aisha Academy." />

      {/* Header */}
      <header className="bg-primary py-20 text-center px-4 relative overflow-hidden border-b border-line shadow-sm">
        <h1 className="text-4xl sm:text-5xl font-black text-content-inverse mb-4 font-display uppercase tracking-tight">
          Admissions Guidance
        </h1>
        <p className="text-content-inverse/80 font-semibold max-w-7xl mx-auto text-sm sm:text-base">
          Cultivating character and academic excellence. Find everything you need to join Hazrat Aisha Academy.
        </p>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        
        {/* Core CTA Card */}
        <section className="bg-surface border border-line rounded-3xl p-8 md:p-12 mb-16 relative overflow-hidden shadow-e3">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-block text-[10px] font-extrabold text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full uppercase tracking-wider mb-4">
                Now Enrolling
              </span>
              <h2 className="text-3xl font-extrabold text-content font-display tracking-tight mb-4">
                Admissions Open Every April
              </h2>
              <p className="text-content-secondary font-medium leading-relaxed mb-6">
                Hazrat Aisha Academy invites applications from motivated students looking for an exceptional academic environment integrated with holistic Tarbiyah and deep-rooted moral values.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="xl" variant="gold" className="font-display font-extrabold uppercase tracking-wide flex items-center justify-center" onClick={() => navigate('/contact')}>
                  Inquire Online <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <a href="tel:+919470818538" className="inline-flex items-center justify-center px-6 py-3.5 border border-line rounded-xl font-bold text-content hover:bg-surface-overlay transition-colors">
                  Call Admissions Office
                </a>
              </div>
            </div>
            <div className="bg-surface-raised border border-line rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-extrabold text-content font-display">Important Dates</h3>
              <div className="flex items-start gap-4">
                <Calendar className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-content">Registration Starts</h4>
                  <p className="text-xs text-content-secondary font-medium">January onwards annually</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-content">Entrance Assessments</h4>
                  <p className="text-xs text-content-secondary font-medium">Weekly on Saturdays (Feb - Apr)</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <UserCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-content">Session Begins</h4>
                  <p className="text-xs text-content-secondary font-medium">First Week of April Every Year</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Admissions Process Steps */}
        <section className="mb-24" aria-labelledby="steps-heading">
          <header className="text-center mb-16">
            <h2 id="steps-heading" className="text-3xl font-extrabold text-content font-display uppercase tracking-tight">
              Admission Process
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto mt-4 rounded-full" aria-hidden="true"></div>
            <p className="text-content-secondary font-semibold text-sm max-w-xl mx-auto mt-4">
              Our streamlined admissions process is designed to ensure a mutual fit between the school's vision and the student's learning aspirations.
            </p>
          </header>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {admissionSteps.map((step, index) => (
              <motion.article 
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="bg-surface border border-line rounded-2xl p-6 relative shadow-e1 hover:shadow-e2 transition-all duration-fast"
              >
                <div className="text-3xl font-black text-primary/25 font-display mb-4">
                  {step.step}
                </div>
                <h3 className="text-lg font-extrabold text-content font-display mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-content-secondary font-medium leading-relaxed">
                  {step.desc}
                </p>
              </motion.article>
            ))}
          </div>
        </section>

        {/* Eligibility Table */}
        <section className="mb-24" aria-labelledby="eligibility-heading">
          <header className="text-center mb-12">
            <h2 id="eligibility-heading" className="text-3xl font-extrabold text-content font-display uppercase tracking-tight">
              Eligibility & Guidelines
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto mt-4 rounded-full" aria-hidden="true"></div>
          </header>

          <div className="bg-surface border border-line rounded-2xl overflow-hidden shadow-e1">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-raised border-b border-line">
                    <th className="p-4 font-display font-extrabold text-sm text-content">Target Grade / Class</th>
                    <th className="p-4 font-display font-extrabold text-sm text-content">Age Requirement (as of April 1st)</th>
                    <th className="p-4 font-display font-extrabold text-sm text-content">Assessment Method</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {eligibilityCriteria.map((item, index) => (
                    <tr key={index} className="hover:bg-surface-overlay/50 transition-colors">
                      <td className="p-4 text-sm font-bold text-content">{item.class}</td>
                      <td className="p-4 text-sm font-semibold text-content-secondary">{item.age}</td>
                      <td className="p-4 text-sm font-medium text-content-secondary">{item.criteria}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Required Documents Checklist */}
        <section className="grid md:grid-cols-2 gap-12 items-start" aria-labelledby="docs-heading">
          <article className="bg-surface border border-line rounded-3xl p-8 shadow-e1">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-6 h-6 text-primary" />
              <h2 id="docs-heading" className="text-2xl font-extrabold text-content font-display tracking-tight">
                Required Documents
              </h2>
            </div>
            <p className="text-content-secondary font-medium text-sm mb-6">
              Please prepare self-attested copies of the following documents to be submitted at the school office along with the finalized application form:
            </p>
            <ul className="space-y-4">
              {[
                "Birth Certificate issued by municipal authority",
                "Progress Report Card from previous academic year",
                "Original Transfer Certificate (TC) from the last school attended (Class II and above)",
                "Passport size student photographs (4 copies)",
                "Parents' Aadhaar Card copy (Mother and Father)",
                "Student's Aadhaar Card copy",
                "Blood Group Report certificate"
              ].map((doc, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm font-semibold text-content-secondary">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="bg-surface border border-line rounded-3xl p-8 shadow-e1">
            <div className="flex items-center gap-3 mb-6">
              <ShieldAlert className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-extrabold text-content font-display tracking-tight">
                Admissions Policy
              </h2>
            </div>
            <div className="space-y-4 text-sm font-medium text-content-secondary leading-relaxed">
              <p>
                <strong>Equal Opportunity:</strong> Hazrat Aisha Academy is committed to an open, fair admissions policy. Decisions are based purely on academic aptitude, conduct, and vacancy.
              </p>
              <p>
                <strong>Authentic Information:</strong> Providing incomplete, falsified, or inaccurate details during registration will result in the immediate cancellation of the admission at any stage.
              </p>
              <p>
                <strong>Sibling Priority:</strong> Direct siblings of current outstanding pupils are given prioritized registration seats, subject to achieving baseline test requirements.
              </p>
              <p>
                <strong>Reservation of Rights:</strong> The School Management reserves all administrative rights concerning seat distribution, class strength capacity, and final admission confirmations.
              </p>
            </div>
          </article>
        </section>

      </div>
    </div>
  );
}
