import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { Menu, X, BookOpen, MapPin, Phone, Mail, ChevronRight, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../context/AuthContext';

export function PublicLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Academics', path: '/academics' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Notices & Events', path: '/notices' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <div className="min-h-screen flex flex-col font-body bg-[var(--bg-page)] text-content selection:bg-primary/25 selection:text-primary">
      
      {/* Top Bar */}
      <aside className="bg-[var(--bg-surface-raised)] border-b border-line text-content-secondary py-2.5 px-4 sm:px-6 lg:px-8 text-xs sm:text-sm font-semibold" aria-label="Quick contact and portal links">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center"><Phone className="w-3.5 h-3.5 mr-1.5 text-primary" aria-hidden="true" /> <a href="tel:+919470818538" className="hover:text-primary transition-colors">+91 9470818538</a></span>
            <span className="flex items-center"><Mail className="w-3.5 h-3.5 mr-1.5 text-primary" aria-hidden="true" /> Email: Coming Soon</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <Link to="/results" className="hover:text-primary transition-colors">Results Portal</Link>
            <span className="text-line" aria-hidden="true">|</span>
            {user ? (
              <Link to="/dashboard" className="text-primary hover:text-primary-hover font-bold transition-colors">Dashboard</Link>
            ) : (
              <Link to="/login" className="hover:text-primary font-bold transition-colors">Staff Login</Link>
            )}
          </div>
        </div>
      </aside>

      {/* Main Header */}
      <header className={`sticky top-0 z-50 transition-all duration-base ${isScrolled ? 'glass-panel shadow-e1 border-b border-line' : 'bg-[var(--bg-surface)] border-b border-line/60'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group" aria-label="Hazrat Aisha Academy Home">
              <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center text-primary shrink-0 transition-transform group-hover:scale-105" aria-hidden="true">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="whitespace-nowrap">
                <span className="text-xl font-black text-content font-display uppercase tracking-tight leading-none block whitespace-nowrap">Hazrat Aisha</span>
                <span className="text-xl font-black text-primary font-display uppercase tracking-tight leading-none block whitespace-nowrap">Academy</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  aria-current={location.pathname === link.path ? 'page' : undefined}
                  className={`text-xs font-extrabold font-display uppercase tracking-wider transition-colors hover:text-primary ${location.pathname === link.path ? 'text-primary' : 'text-content-secondary'}`}
                >
                  {link.name}
                </Link>
              ))}
              <Button onClick={() => navigate('/contact')} size="md" className="font-display font-extrabold uppercase tracking-wide">Apply Now</Button>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 rounded-lg hover:bg-surface-raised text-content-secondary hover:text-content transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[var(--bg-surface)] border-b border-line shadow-e2 overflow-hidden"
          >
            <nav className="flex flex-col px-4 py-4 space-y-2" aria-label="Mobile Navigation">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  aria-current={location.pathname === link.path ? 'page' : undefined}
                  className={`block px-4 py-3 rounded-xl text-sm font-extrabold font-display uppercase tracking-wider ${location.pathname === link.path ? 'bg-primary/10 text-primary border-l-4 border-l-primary' : 'text-content-secondary hover:bg-surface-raised'}`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="px-4 py-3">
                <Button className="w-full font-display font-extrabold uppercase tracking-wide" onClick={() => navigate('/contact')}>Apply Now</Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="w-full flex-1 min-w-0">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[var(--bg-surface)] text-content-secondary pt-16 pb-8 border-t border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center text-primary shrink-0" aria-hidden="true">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-content uppercase tracking-tight leading-none font-display whitespace-nowrap">Hazrat Aisha<br/><span className="text-primary">Academy</span></h2>
              </div>
              <p className="text-sm text-content-secondary font-medium mb-6 leading-relaxed">
                Cultivating character, knowledge, and faith through CBSE-aligned modern academic excellence integrated with authentic Islamic values.
              </p>
              <div className="flex gap-3">
                {[
                  { icon: Facebook, label: "Facebook", href: "https://www.facebook.com/share/1JfkJgLQsW/" },
                  { icon: Twitter, label: "Twitter", href: "#" },
                  { icon: Instagram, label: "Instagram", href: "#" },
                  { icon: Linkedin, label: "LinkedIn", href: "#" }
                ].map((social, i) => (
                  <a key={i} href={social.href} target={social.href !== "#" ? "_blank" : undefined} rel={social.href !== "#" ? "noopener noreferrer" : undefined} aria-label={social.label} className="w-9 h-9 rounded-xl bg-surface-raised border border-line flex items-center justify-center text-content-secondary hover:text-primary hover:border-primary transition-all duration-fast">
                    <social.icon className="w-4 h-4" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
            
            <nav aria-label="Quick Links">
              <h2 className="text-sm font-black text-content font-display uppercase tracking-wider mb-6 relative inline-block">
                Quick Links
                <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-primary -mb-2" aria-hidden="true"></span>
              </h2>
              <ul className="space-y-3">
                {navLinks.map(link => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-sm font-semibold hover:text-primary transition-colors flex items-center group">
                      <ChevronRight className="w-3.5 h-3.5 mr-2 text-primary group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                      {link.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link to="/results" className="text-sm font-semibold hover:text-primary transition-colors flex items-center group">
                    <ChevronRight className="w-3.5 h-3.5 mr-2 text-primary group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                    Results Portal
                  </Link>
                </li>
              </ul>
            </nav>

            <nav aria-label="Information Links">
              <h2 className="text-sm font-black text-content font-display uppercase tracking-wider mb-6 relative inline-block">
                Information
                <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-primary -mb-2" aria-hidden="true"></span>
              </h2>
              <ul className="space-y-3 text-sm font-semibold">
                <li><Link to="/admissions-info" className="hover:text-primary transition-colors flex items-center"><ChevronRight className="w-3.5 h-3.5 mr-2 text-primary" aria-hidden="true" /> Admissions</Link></li>
                <li><Link to="/fee-structure" className="hover:text-primary transition-colors flex items-center"><ChevronRight className="w-3.5 h-3.5 mr-2 text-primary" aria-hidden="true" /> Fee Structure</Link></li>
                <li><Link to="/notices" className="hover:text-primary transition-colors flex items-center"><ChevronRight className="w-3.5 h-3.5 mr-2 text-primary" aria-hidden="true" /> Downloads</Link></li>
                <li><Link to="/privacy" className="hover:text-primary transition-colors flex items-center"><ChevronRight className="w-3.5 h-3.5 mr-2 text-primary" aria-hidden="true" /> Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-primary transition-colors flex items-center"><ChevronRight className="w-3.5 h-3.5 mr-2 text-primary" aria-hidden="true" /> Terms & Conditions</Link></li>
              </ul>
            </nav>

            <address className="not-italic">
              <h2 className="text-sm font-black text-content font-display uppercase tracking-wider mb-6 relative inline-block">
                Contact Us
                <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-primary -mb-2" aria-hidden="true"></span>
              </h2>
              <ul className="space-y-4 text-sm font-semibold">
                <li className="flex items-start">
                  <MapPin className="w-5 h-5 text-primary mr-3 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>Sharif Colony, Ansari Road,<br/>Chak Rajopatti, Sitamarhi,<br/>Bihar - 843302</span>
                </li>
                <li className="flex items-center">
                  <Phone className="w-5 h-5 text-primary mr-3 shrink-0" aria-hidden="true" />
                  <a href="tel:+919470818538" className="hover:text-primary transition-colors">+91 9470818538</a>
                </li>
                <li className="flex items-center">
                  <Mail className="w-5 h-5 text-primary mr-3 shrink-0" aria-hidden="true" />
                  <span className="text-content-secondary">Email: Coming Soon</span>
                </li>
              </ul>
            </address>
          </div>
          
          <div className="border-t border-line pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-semibold text-content-tertiary">
            <p>&copy; {new Date().getFullYear()} Hazrat Aisha Academy. All rights reserved.</p>
            <p className="text-xs bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full uppercase tracking-wider">Affiliated to CBSE, New Delhi</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
