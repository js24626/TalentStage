import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { 
  Sparkles, 
  Target, 
  Clock, 
  TrendingUp, 
  Users, 
  MessageSquare,
  ChevronRight,
  Menu,
  X,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import './MarketingPage.css';

const MarketingPage = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="marketing-page">
      <Header scrolled={scrolled} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <Hero navigate={navigate} />
      <Features />
      
      <Contact />
      <Footer />
    </div>
  );
};

// Fast Header Component
const Header = ({ scrolled, mobileMenuOpen, setMobileMenuOpen }) => {
  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <Sparkles size={32} />
            <span>TalentSage</span>
          </div>
          
          <nav className= {`nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            <a href="#features">Features</a>
          
            <a href="#contact">Contact</a>
            <a href="/dashboard" className="btn btn-sm">Dashboard</a>
          </nav>
          
          <button 
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
};

const Hero = ({ navigate }) => {

  useEffect(() => {
    // STAGGER ANIMATION
    const animatedEls = document.querySelectorAll(".animate");

    animatedEls.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add("show");
      }, index * 200);
    });

    // COUNTER ANIMATION
    const counters = document.querySelectorAll("[data-target]");

    counters.forEach(counter => {
      const target = +counter.dataset.target;
      const suffix = counter.dataset.suffix || "";
      let current = 0;
      const increment = target / 40;

      const updateCounter = () => {
        current += increment;
        if (current >= target) {
          counter.innerText = target + suffix;
        } else {
          counter.innerText = Math.floor(current) + suffix;
          requestAnimationFrame(updateCounter);
        }
      };

      updateCounter();
    });
  }, []);

  return (
    <div className="hero">
      <div className="container">
        <div className="hero-content">

          <h1 className="hero-title animate">
            AI-Native Recruitment<br />
            <span className="gradient-text">Operating System</span>
          </h1>

          <p className="hero-subtitle animate">
            Transform your hiring process with intelligent automation,
            conversational AI, and predictive analytics.
            Reduce time-to-hire by 60% while improving candidate quality.
          </p>

          <div className="hero-cta animate">
            <button
              className="btn  btn-lg"
              onClick={() => navigate("/dashboard")}
            >
              Try Demo <ChevronRight size={20} />
            </button>

            <button className="btn btn-secondary btn-lg">
              Learn More
            </button>
          </div>

     <div className="hero-stats animate">
  <div className="stat">
    <div className="stat-value" data-target="60" data-suffix="%">0</div>
    <div className="stat-label">Reduction in time-to-hire</div>
  </div>

  <div className="stat">
    <div className="stat-value" data-target="75" data-suffix="%">0</div>
    <div className="stat-label">Faster screening and shortlisting</div>
  </div>

  <div className="stat">
    <div className="stat-value" data-target="40" data-suffix="%">0</div>
    <div className="stat-label">Improvement in candidate engagement</div>
  </div>

  <div className="stat">
    <div className="stat-value" data-target="30" data-suffix="%">0</div>
    <div className="stat-label">Higher recruiter productivity</div>
  </div>
</div>


        </div>
      </div>
    </div>
  );
};


// Features Section with Scroll Animations
const Features = () => {
  const features = [
    {
      icon: Target,
      title: 'Intelligent Candidate Matching',
      description: 'AI-powered matching algorithm connects the right talent with the right roles based on skills, experience, and cultural fit.'
    },
    {
      icon: Sparkles,
      title: 'Automated Resume Parsing',
      description: 'Extract and structure candidate information automatically from resumes in any format with 99% accuracy.'
    },
    {
      icon: TrendingUp,
      title: 'AI-Driven Shortlisting & Scoring',
      description: 'Evaluate candidates objectively using custom rubrics and ML-powered scoring for consistent, bias-free assessment.'
    },
    {
      icon: Clock,
      title: 'Smart Interview Scheduling',
      description: 'Automated scheduling with calendar integration, timezone handling, and instant confirmations for candidates and interviewers.'
    },
    {
      icon: Users,
      title: 'Predictive Hiring Analytics',
      description: 'Data-driven insights on hiring patterns, candidate quality, time-to-fill metrics, and pipeline health.'
    },
    {
      icon: MessageSquare,
      title: 'Chat-based Candidate Engagement',
      description: '24/7 conversational AI assistant handles candidate questions, updates, and engagement throughout the hiring journey.'
    }
  ];

  return (
    <section id="features" className="features">
      <div className="container">
      
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ feature, index }) => {
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const Icon = feature.icon;

  return (
    <motion.div
      ref={ref}
      className="feature-card"
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="feature-icon">
        <Icon size={28} />
      </div>
      <h3>{feature.title}</h3>
      <p>{feature.description}</p>
    </motion.div>
  );
};


 

// Contact Section
const Contact = () => {
  return (
    <section id="contact" className="professional-contact-section">
      <div className="professional-container">
     
        
        <div className="contact-cards-wrapper">
          <div className="professional-contact-card">
            <div className="contact-icon-wrapper">
              <Phone className="contact-icon" size={28} />
            </div>
            <h4 className="contact-card-title">Phone</h4>
            <p className="contact-card-info">+(1) 281-786-0706</p>
            <a href="tel:+12817860706" className="contact-action-link">Call Now</a>
          </div>
          
          <div className="professional-contact-card">
            <div className="contact-icon-wrapper">
              <Mail className="contact-icon" size={28} />
            </div>
            <h4 className="contact-card-title">Email</h4>
            <p className="contact-card-info">info@visiontact.com</p>
            <a href="mailto:info@visiontact.com" className="contact-action-link">Send Email</a>
          </div>
          
          <div className="professional-contact-card">
            <div className="contact-icon-wrapper">
              <MapPin className="contact-icon" size={28} />
            </div>
            <h4 className="contact-card-title">Houston Office</h4>
            <p className="contact-card-info">
              8990 Kirby Dr, Ste 220<br />
              Houston, TX 77054, USA
            </p>
            <a  rel="noopener noreferrer" className="contact-action-link">View Map</a>
          </div>
          
          <div className="professional-contact-card">
            <div className="contact-icon-wrapper">
              <MapPin className="contact-icon" size={28} />
            </div>
            <h4 className="contact-card-title">Dubai Office</h4>
            <p className="contact-card-info">
              Building A1, Dubai Digital Park<br />
              Dubai Silicon Oasis, UAE
            </p>
            <a rel="noopener noreferrer" className="contact-action-link">View Map</a>
          </div>
        </div>
      </div>
    </section>
  );
};

// Footer
const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="logo">
              <Sparkles size={28} />
              <span>TalentSage</span>
            </div>
            <p>AI-Native Recruitment Operating System</p>
          </div>
          
          <div className="footer-links">
            <div>
              <h5>Product</h5>
              <a href="#features">Features</a>
              <a href="#metrics">Impact</a>
              <a href="/dashboard">Dashboard</a>
            </div>
            <div>
              <h5>Company</h5>
              <a href="#contact">Contact</a>
              <a href="#">About</a>
              <a href="#">Careers</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2026 TalentSage. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

// Reusable Section Header
const SectionHeader = ({ title, subtitle }) => {
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      className="section-header"
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </motion.div>
  );
};

export default MarketingPage;