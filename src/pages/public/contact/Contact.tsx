import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { SEO } from '../../../components/seo/SEO';
import { Card } from '../../../components/ui/card';

export function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitted(false);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <div className="bg-transparent min-h-screen pb-24 font-body">
      <SEO title="Contact Us" description="Get in touch with Hazrat Aisha Academy. Contact us for admissions, inquiries, or feedback." />
      
      {/* Header */}
      <header className="public-page-header">
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 font-display tracking-tight">Contact Us</h1>
        <p className="text-white/80 font-semibold max-w-2xl mx-auto text-sm sm:text-base mb-6">We'd love to hear from you. Get in touch with us for any inquiries.</p>

        {/* Page Heading Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          <Link to="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase border border-white/20 bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-md">
            <span>← Back to Home</span>
          </Link>
          <a href="tel:+919470818538" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase bg-amber-500 hover:bg-amber-600 text-white transition-all shadow-[0_4px_12px_rgba(245,158,11,0.3)] hover:-translate-y-0.5">
            <span>Call School</span>
          </a>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16" aria-label="Contact Information and Form">
        <div className="grid lg:grid-cols-2 gap-16">
          
          {/* Contact Info */}
          <article>
            <h2 className="text-3xl font-bold text-content font-display mb-8 tracking-tight">Get In Touch</h2>
            <p className="text-content-secondary font-medium mb-10 leading-relaxed">
              Whether you have a question about admissions, fee structures, or anything else, our team is ready to answer all your questions.
            </p>
            
            <address className="space-y-8 not-italic">
              <div className="flex items-start">
                <div className="w-14 h-14 bg-primary/20 border border-primary/30 rounded-[1.25rem] backdrop-blur-md flex items-center justify-center shrink-0 mr-6" aria-hidden="true">
                  <MapPin className="w-7 h-7 text-primary drop-shadow-md" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-content font-display mb-1">Our Location</h3>
                  <p className="text-content-secondary font-semibold">Hazrat Aisha Academy<br/>Sharif Colony, Ansari Road, Chak Rajopatti<br/>Sitamarhi, Bihar – 843302</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-14 h-14 bg-primary/20 border border-primary/30 rounded-[1.25rem] backdrop-blur-md flex items-center justify-center shrink-0 mr-6" aria-hidden="true">
                  <Phone className="w-7 h-7 text-primary drop-shadow-md" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-content font-display mb-1">Phone Number</h3>
                  <p className="text-content-secondary font-semibold flex flex-col gap-1">
                    <a href="tel:+919470818538" className="hover:text-primary transition-colors hover:underline">+91 9470818538</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-14 h-14 bg-primary/20 border border-primary/30 rounded-[1.25rem] backdrop-blur-md flex items-center justify-center shrink-0 mr-6" aria-hidden="true">
                  <Mail className="w-7 h-7 text-primary drop-shadow-md" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-content font-display mb-1">Email Address</h3>
                  <p className="text-content-secondary font-semibold flex flex-col gap-1">
                    <span>Email: Coming Soon</span>
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-14 h-14 bg-primary/20 border border-primary/30 rounded-[1.25rem] backdrop-blur-md flex items-center justify-center shrink-0 mr-6" aria-hidden="true">
                  <Clock className="w-7 h-7 text-primary drop-shadow-md" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-content font-display mb-1">Office Hours</h3>
                  <div className="text-content-secondary font-semibold space-y-1 text-sm">
                    <p>Summer: 8:00 AM – 12:00 PM</p>
                    <p>Winter: 9:00 AM – 1:00 PM</p>
                    <p>Office: 8:00 AM – 1:00 PM</p>
                    <p className="font-bold text-danger-500">Friday Closed</p>
                  </div>
                </div>
              </div>
            </address>
          </article>

          {/* Form */}
          <Card className="p-8 md:p-10">
            <h3 className="text-2xl font-bold text-content font-display mb-6 tracking-tight">Send us a Message</h3>
            
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-success-500/10 border border-success-500/20 text-success-500 rounded-xl p-6 flex flex-col items-center text-center font-display shadow-sm shadow-success-500/5"
                >
                  <CheckCircle2 className="w-12 h-12 mb-3 text-success-500" />
                  <h4 className="text-lg font-bold">Message Sent Successfully</h4>
                  <p className="text-sm font-semibold mt-2 text-success-500/90 leading-relaxed max-w-sm">
                    Thank you for contacting us. We will get back to you shortly.
                  </p>
                  <Button variant="secondary" className="mt-6 font-bold bg-white/10 border-white/20 text-content hover:bg-white/20 hover:border-white/30 backdrop-blur-md" onClick={() => setSubmitted(false)}>
                    Send Another Message
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="text-xs font-bold text-content-tertiary uppercase tracking-wider">First Name</label>
                      <input id="firstName" name="firstName" required type="text" className="w-full px-4 py-2.5 border border-white/20 rounded-xl bg-black/20 text-sm text-content transition-all focus:outline-none focus:border-white/40 focus:bg-black/40 backdrop-blur-md placeholder:text-content-tertiary/50" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="lastName" className="text-xs font-bold text-content-tertiary uppercase tracking-wider">Last Name</label>
                      <input id="lastName" name="lastName" required type="text" className="w-full px-4 py-2.5 border border-white/20 rounded-xl bg-black/20 text-sm text-content transition-all focus:outline-none focus:border-white/40 focus:bg-black/40 backdrop-blur-md placeholder:text-content-tertiary/50" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-xs font-bold text-content-tertiary uppercase tracking-wider">Email Address</label>
                    <input id="email" name="email" required type="email" className="w-full px-4 py-2.5 border border-white/20 rounded-xl bg-black/20 text-sm text-content transition-all focus:outline-none focus:border-white/40 focus:bg-black/40 backdrop-blur-md placeholder:text-content-tertiary/50" />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-xs font-bold text-content-tertiary uppercase tracking-wider">Phone Number (Optional)</label>
                    <input id="phone" name="phone" type="tel" className="w-full px-4 py-2.5 border border-white/20 rounded-xl bg-black/20 text-sm text-content transition-all focus:outline-none focus:border-white/40 focus:bg-black/40 backdrop-blur-md placeholder:text-content-tertiary/50" />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-xs font-bold text-content-tertiary uppercase tracking-wider">Message</label>
                    <textarea id="message" name="message" required rows={4} className="w-full px-4 py-2.5 border border-white/20 rounded-xl bg-black/20 text-sm text-content transition-all focus:outline-none focus:border-white/40 focus:bg-black/40 backdrop-blur-md placeholder:text-content-tertiary/50 resize-none"></textarea>
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full py-6 text-base font-bold font-display shadow-sm">
                    {isSubmitting ? 'Sending...' : (
                      <span className="flex items-center justify-center">
                        Send Message <Send className="w-5 h-5 ml-2" aria-hidden="true" />
                      </span>
                    )}
                  </Button>
                </form>
              )}
            </AnimatePresence>
          </Card>
        </div>
      </section>
    </div>
  );
}
