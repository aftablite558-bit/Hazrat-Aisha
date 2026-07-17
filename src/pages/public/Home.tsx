import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { Button } from '../../components/ui/button';
import { ArrowRight, Award, BookOpen, Users, Trophy, ChevronRight, Calendar, Heart, Laptop } from 'lucide-react';
import { SEO } from '../../components/seo/SEO';

export function Home() {
  const navigate = useNavigate();
  const stats = [
    { label: 'Classes Offered', value: 'Baby to VIII', icon: Users },
    { label: 'Islamic Integration', value: '100%', icon: BookOpen },
    { label: 'Campus Facilities', value: '8+', icon: Trophy },
    { label: 'Established', value: '2018', icon: Award },
  ];

  return (
    <div className="bg-[var(--bg-page)] min-h-screen font-body">
      <SEO title="Home" description="Welcome to Hazrat Aisha Academy, a premium Islamic school in Sitamarhi." />
      
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden" aria-label="Welcome">
        <div className="absolute inset-0 bg-black/65 z-10" aria-hidden="true" />
        <picture className="absolute inset-0 w-full h-full">
          <source srcSet="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?fm=webp&fit=crop&q=80" type="image/webp" />
          <img 
            src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?fm=jpg&fit=crop&q=80" 
            alt="Students on school campus" 
            className="w-full h-full object-cover animate-[shimmer_8s_infinite]"
            referrerPolicy="no-referrer"
          />
        </picture>
        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-stretch justify-center min-w-0">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full min-w-0 text-4xl md:text-6xl font-black text-white tracking-tight mb-6 font-display uppercase"
          >
            Empowering Minds,<br />
            <span className="text-accent">Shaping the Future</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full min-w-0 text-lg md:text-xl text-white/95 mb-4 mx-auto font-medium"
          >
            A premium Islamic school blending CBSE-aligned modern academic excellence with authentic Islamic values.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col items-center gap-1 mb-8 text-accent font-display font-black tracking-widest"
          >
            <p className="text-sm sm:text-base uppercase">Learn • Lead • Serve</p>
            <p className="text-sm sm:text-base" dir="rtl">سیکھیں • قیادت کریں • خدمت کریں</p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button size="xl" variant="gold" className="font-display font-extrabold uppercase tracking-wide w-full sm:w-auto" onClick={() => navigate('/admissions-info')}>
              Apply for Admission
            </Button>
            <Button size="xl" variant="glass" className="font-display font-extrabold uppercase tracking-wide w-full sm:w-auto" onClick={() => navigate('/results')}>
              Check Results
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-surface border-b border-line" aria-label="School Statistics">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 mx-auto bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center mb-4 text-primary" aria-hidden="true">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-3xl font-extrabold text-content font-display mb-2">{stat.value}</h3>
                  <p className="text-xs font-extrabold text-content-secondary uppercase tracking-wider">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features/Highlights */}
      <section className="py-24" aria-labelledby="features-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center mb-16">
            <h2 id="features-heading" className="text-3xl font-extrabold text-content font-display uppercase tracking-tight">Why Choose Hazrat Aisha Academy?</h2>
            <div className="w-24 h-1 bg-primary mx-auto mt-4 rounded-full" aria-hidden="true"></div>
          </header>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                title: "Academic Excellence",
                desc: "CBSE-aligned modern English Medium curriculum covering grades from Baby Class to Class VIII.",
                icon: BookOpen
              },
              {
                title: "Islamic Values",
                desc: "Authentic Deeniyat and moral studies integrated with our Idara Ashraful Banat (Madarsa Wing).",
                icon: Heart
              },
              {
                title: "Campus Facilities",
                desc: "Equipped campus featuring a library, computer lab, secure CCTV surveillance, separate toilets, and playground.",
                icon: Laptop
              }
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.article 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-surface border border-line p-8 rounded-2xl shadow-e1 hover:shadow-e2 transition-all duration-fast"
                >
                  <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center mb-6 text-primary" aria-hidden="true">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-extrabold text-content font-display mb-4 tracking-tight">{feature.title}</h3>
                  <p className="text-content-secondary font-medium leading-relaxed text-sm">{feature.desc}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Latest News & Notices */}
      <section className="py-24 bg-surface border-t border-line" aria-labelledby="news-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="flex justify-between items-end mb-12">
            <div>
              <h2 id="news-heading" className="text-3xl font-extrabold text-content font-display uppercase tracking-tight">Latest Updates</h2>
              <div className="w-16 h-1 bg-primary mt-4 rounded-full" aria-hidden="true"></div>
            </div>
            <Button variant="ghost" className="hidden sm:flex text-primary font-bold font-display hover:text-primary-hover" onClick={() => navigate('/notices')}>
              View All <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
            </Button>
          </header>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <article key={item} className="bg-surface border border-line rounded-2xl overflow-hidden shadow-e1 hover:shadow-e2 transition-all duration-fast group cursor-pointer" onClick={() => navigate('/notices')}>
                <figure className="h-48 overflow-hidden m-0 relative">
                  <img src={`https://images.unsplash.com/photo-1577896851231-70ef18881754?fm=webp&fit=crop&w=800&q=80`} alt="School event update thumbnail" loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" aria-hidden="true" />
                </figure>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs font-bold text-primary mb-3 uppercase tracking-wider">
                    <Calendar className="w-4 h-4" aria-hidden="true" />
                    <time dateTime="2026-07-15">July 15, 2026</time>
                  </div>
                  <h3 className="text-lg font-extrabold text-content font-display mb-2 group-hover:text-primary transition-colors tracking-tight line-clamp-2">Admissions Open for Academic Year 2026-27</h3>
                  <p className="text-content-secondary font-medium text-sm mb-4 line-clamp-2 leading-relaxed">We are thrilled to announce that the admission process for the upcoming academic year has officially begun.</p>
                  <span className="text-primary text-sm font-bold flex items-center group-hover:underline">Read More <ChevronRight className="w-4 h-4 ml-1" aria-hidden="true" /></span>
                </div>
              </article>
            ))}
          </div>
          <Button variant="secondary" className="w-full mt-8 sm:hidden font-bold font-display" onClick={() => navigate('/notices')}>
            View All Updates
          </Button>
        </div>
      </section>
    </div>
  );
}
