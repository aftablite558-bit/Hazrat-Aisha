import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { Target, Heart, Shield, BookOpen } from 'lucide-react';
import { SEO } from '../../../components/seo/SEO';
import { Card } from '../../../components/ui/card';

export function About() {
  return (
    <div className="bg-transparent pb-24 font-body">
      <SEO title="About Us" description="Learn about the history, mission, and vision of Hazrat Aisha Academy." />
      
      {/* Header */}
      <header className="public-page-header">
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 font-display tracking-tight">About Our Academy</h1>
        <p className="text-white/80 font-semibold max-w-2xl mx-auto text-sm sm:text-base mb-6">A legacy of excellence in education, nurturing the leaders of tomorrow.</p>
        
        <div className="flex flex-col items-center justify-center gap-1.5 text-emerald-300 dark:text-sky-300">
          <p className="font-display font-bold text-xs sm:text-sm tracking-widest uppercase">Learn • Lead • Serve</p>
          <p className="font-display font-bold text-xs sm:text-sm tracking-widest animate-pulse" dir="rtl">سیکھیں • قیادت کریں • خدمت کریں</p>
        </div>

        {/* Page Heading Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          <Link to="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase border border-white/20 bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-md">
            <span>← Back to Home</span>
          </Link>
          <Link to="/admissions-info" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase bg-amber-500 hover:bg-amber-600 text-white transition-all shadow-[0_4px_12px_rgba(245,158,11,0.3)] hover:-translate-y-0.5">
            <span>Admissions Info</span>
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Content */}
        <Card className="p-8 md:p-12 mb-16 -mt-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <article>
              <h2 className="text-3xl font-bold text-content font-display mb-6 tracking-tight">Principal's Message</h2>
              <p className="text-content-secondary font-medium leading-relaxed mb-6">
                "Welcome to Hazrat Aisha Academy. Our institution stands as a beacon of knowledge, where we strive to provide holistic education that balances modern academic rigor with timeless moral values. We believe that every child is unique and possesses immense potential. Our dedicated faculty works tirelessly to create an environment that encourages curiosity, creativity, and character development."
              </p>
              <div className="flex items-center gap-4">
                <figure className="w-16 h-16 border border-white/20 rounded-full overflow-hidden m-0">
                  <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?fm=webp&fit=crop&w=200&q=80" alt="Portrait of Md. Leyaqat Hussain, Principal" className="w-full h-full object-cover" loading="lazy" referrerPolicy="no-referrer" />
                </figure>
                <div>
                  <h3 className="font-bold text-content font-display">Md. Leyaqat Hussain</h3>
                  <p className="text-sm font-semibold text-content-tertiary">Principal</p>
                </div>
              </div>
            </article>
            <figure className="relative m-0">
              <div className="absolute -inset-2 bg-gradient-to-tr from-primary/10 to-transparent rounded-3xl -z-10" aria-hidden="true"></div>
              <img src="https://images.unsplash.com/photo-1577896851231-70ef18881754?fm=webp&fit=crop&w=800&q=80" alt="Exterior view of Hazrat Aisha Academy School Building" className="rounded-2xl shadow-e2 border border-white/20 w-full object-cover h-[400px]" loading="lazy" referrerPolicy="no-referrer" />
            </figure>
          </div>
        </Card>

        {/* Vision & Mission */}
        <section className="grid md:grid-cols-2 gap-8 mb-16" aria-label="Vision and Mission">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="h-full"
          >
            <Card className="h-full p-10 border-l-4 border-l-primary hover:-translate-y-1 transition-transform duration-300">
              <div className="w-14 h-14 bg-primary/20 rounded-[1.25rem] border border-primary/30 flex items-center justify-center text-primary mb-6 backdrop-blur-md" aria-hidden="true">
                <Target className="w-7 h-7 drop-shadow-md" />
              </div>
              <h2 className="text-2xl font-bold text-content font-display mb-4 tracking-tight">Our Vision</h2>
              <p className="text-content-secondary font-medium leading-relaxed">
                To provide quality education with Islamic values while nurturing knowledgeable, disciplined, compassionate and responsible citizens.
              </p>
            </Card>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="h-full"
          >
            <Card className="h-full p-10 border-l-4 border-l-primary hover:-translate-y-1 transition-transform duration-300">
              <div className="w-14 h-14 bg-primary/20 rounded-[1.25rem] border border-primary/30 flex items-center justify-center text-primary mb-6 backdrop-blur-md" aria-hidden="true">
                <Heart className="w-7 h-7 drop-shadow-md" />
              </div>
              <h2 className="text-2xl font-bold text-content font-display mb-4 tracking-tight">Our Mission</h2>
              <p className="text-content-secondary font-medium leading-relaxed">
                Our mission is to cultivate academic excellence alongside authentic Islamic moral values, providing a professional and intellectually stimulating learning environment that prepares disciplined, compassionate, and responsible citizens to serve their families, community, and nation with integrity.
              </p>
            </Card>
          </motion.div>
        </section>

        {/* Core Values */}
        <section aria-labelledby="core-values-heading">
          <div className="text-center mb-12">
            <h2 id="core-values-heading" className="text-3xl font-bold text-content font-display mb-4 tracking-tight">Our Core Values</h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full" aria-hidden="true"></div>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: BookOpen, title: "Excellence", desc: "Striving for the highest standards in academics and conduct." },
              { icon: Shield, title: "Integrity", desc: "Upholding honesty, truthfulness, and strong moral principles." },
              { icon: Heart, title: "Compassion", desc: "Fostering empathy, respect, and kindness towards all." },
              { icon: Target, title: "Perseverance", desc: "Building resilience and the determination to overcome challenges." }
            ].map((value, i) => (
              <Card key={i} className="text-center p-6 hover:-translate-y-1 transition-transform duration-300">
                <div className="w-14 h-14 bg-primary/20 border border-primary/30 rounded-[1.25rem] backdrop-blur-md flex items-center justify-center mx-auto mb-5 text-primary" aria-hidden="true">
                  <value.icon className="w-7 h-7 drop-shadow-md" />
                </div>
                <h3 className="text-lg font-bold text-content font-display mb-2">{value.title}</h3>
                <p className="text-sm font-semibold text-content-secondary">{value.desc}</p>
              </Card>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
