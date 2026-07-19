import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { Library, Laptop, Camera, Shield, Droplet, Users, BookOpen, Heart } from 'lucide-react';
import { SEO } from '../../../components/seo/SEO';
import { Card } from '../../../components/ui/card';

export function Academics() {
  return (
    <div className="bg-transparent min-h-screen pb-24 font-body">
      <SEO title="Academics" description="Explore our CBSE-aligned curriculum and Tarbiyah programs at Hazrat Aisha Academy." />
      
      {/* Header */}
      <header className="public-page-header">
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 font-display tracking-tight">Academic Excellence</h1>
        <p className="text-white/80 font-semibold max-w-2xl mx-auto text-sm sm:text-base mb-6">A comprehensive curriculum designed to nurture intellect, creativity, and character.</p>

        {/* Page Heading Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          <Link to="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase border border-white/20 bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-md">
            <span>← Back to Home</span>
          </Link>
          <Link to="/admissions-info" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase bg-amber-500 hover:bg-amber-600 text-white transition-all shadow-[0_4px_12px_rgba(245,158,11,0.3)] hover:-translate-y-0.5">
            <span>Admission Details</span>
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        
        {/* Programs */}
        <section className="mb-24" aria-labelledby="programs-heading">
          <header className="text-center mb-12">
            <h2 id="programs-heading" className="text-3xl font-bold text-content font-display mb-4 tracking-tight">Our Programs</h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full" aria-hidden="true"></div>
          </header>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              className="h-full"
            >
              <Card className="h-full p-8 hover:-translate-y-1 transition-transform duration-300">
                <h3 className="text-xl font-bold text-primary font-display mb-2">Pre-Primary Section</h3>
                <p className="text-xs text-content-tertiary font-bold uppercase tracking-wider mb-4">Baby Class to UKG</p>
                <p className="text-content-secondary font-medium mb-6 leading-relaxed text-sm">A joyful, English Medium nurturing space focusing on foundational motor, speech, and cognitive skills combined with daily morals and basic Duas.</p>
                <ul className="space-y-3 text-sm font-semibold text-content-secondary">
                  <li className="flex items-center"><div className="w-2 h-2 rounded-full bg-primary mr-3" aria-hidden="true"></div>Activity-based learning</li>
                  <li className="flex items-center"><div className="w-2 h-2 rounded-full bg-primary mr-3" aria-hidden="true"></div>Phonics & early numeracy</li>
                  <li className="flex items-center"><div className="w-2 h-2 rounded-full bg-primary mr-3" aria-hidden="true"></div>Islamic manners & etiquette</li>
                </ul>
              </Card>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ delay: 0.1 }} 
              className="h-full"
            >
              <Card className="h-full p-8 hover:-translate-y-1 transition-transform duration-300">
                <h3 className="text-xl font-bold text-primary font-display mb-2">Primary Section</h3>
                <p className="text-xs text-content-tertiary font-bold uppercase tracking-wider mb-4">Classes I to V</p>
                <p className="text-content-secondary font-medium mb-6 leading-relaxed text-sm">Focuses on building strong foundational skills in mathematics, environmental sciences, and languages under modern English Medium standard instruction.</p>
                <ul className="space-y-3 text-sm font-semibold text-content-secondary">
                  <li className="flex items-center"><div className="w-2 h-2 rounded-full bg-primary mr-3" aria-hidden="true"></div>Language proficiency (English & Urdu)</li>
                  <li className="flex items-center"><div className="w-2 h-2 rounded-full bg-primary mr-3" aria-hidden="true"></div>Mental Math & basic sciences</li>
                  <li className="flex items-center"><div className="w-2 h-2 rounded-full bg-primary mr-3" aria-hidden="true"></div>Tarbiyah & Islamic values</li>
                </ul>
              </Card>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ delay: 0.2 }} 
              className="h-full"
            >
              <Card className="h-full p-8 hover:-translate-y-1 transition-transform duration-300">
                <h3 className="text-xl font-bold text-primary font-display mb-2">Middle & Islamic Section</h3>
                <p className="text-xs text-content-tertiary font-bold uppercase tracking-wider mb-4">Classes VI to VIII & Madarsa Wing</p>
                <p className="text-content-secondary font-medium mb-6 leading-relaxed text-sm">Introduces advanced subjects, analytical thinking, and deeper Islamic theology through our specialized Idara Ashraful Banat (Madarsa Wing).</p>
                <ul className="space-y-3 text-sm font-semibold text-content-secondary">
                  <li className="flex items-center"><div className="w-2 h-2 rounded-full bg-primary mr-3" aria-hidden="true"></div>CBSE-aligned core subjects</li>
                  <li className="flex items-center"><div className="w-2 h-2 rounded-full bg-primary mr-3" aria-hidden="true"></div>Arabic Language & Hadith studies</li>
                  <li className="flex items-center"><div className="w-2 h-2 rounded-full bg-primary mr-3" aria-hidden="true"></div>Quran Memorization & Recitation</li>
                </ul>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Facilities */}
        <section aria-labelledby="facilities-heading">
          <header className="text-center mb-12">
            <h2 id="facilities-heading" className="text-3xl font-bold text-content font-display mb-4 tracking-tight">Campus Facilities</h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full" aria-hidden="true"></div>
          </header>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Library, title: "Library", desc: "Extensive collection of educational and moral reading materials." },
              { icon: Laptop, title: "Computer Lab", desc: "Equipped system stations supporting modern digital literacy." },
              { icon: Camera, title: "CCTV", desc: "24/7 security surveillance covering the entire academy campus." },
              { icon: Shield, title: "Playground", desc: "Safe, spacious outdoor arena for recreation and active play." },
              { icon: Droplet, title: "Clean Drinking Water", desc: "Pure, filtered drinking water points accessible to all pupils." },
              { icon: Users, title: "Separate Toilets", desc: "Dedicated, hygienic washroom and separate toilet facilities." },
              { icon: BookOpen, title: "Prayer Area", desc: "A clean, quiet devotional space for congregational prayers." },
              { icon: Heart, title: "First Aid", desc: "Equipped medical boxes for rapid health care and emergency support." }
            ].map((facility, i) => (
              <Card key={i} className="p-6 text-center hover:-translate-y-1 transition-transform duration-300">
                <div className="w-14 h-14 bg-primary/20 border border-primary/30 rounded-[1.25rem] backdrop-blur-md flex items-center justify-center mx-auto mb-4 text-primary" aria-hidden="true">
                  <facility.icon className="w-7 h-7 drop-shadow-md" />
                </div>
                <h4 className="text-lg font-bold text-content font-display mb-2">{facility.title}</h4>
                <p className="text-sm font-semibold text-content-secondary">{facility.desc}</p>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
