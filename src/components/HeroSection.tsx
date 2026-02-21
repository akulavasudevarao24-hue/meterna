import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
      <div className="absolute inset-0 opacity-20">
        <img src={heroBg} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="relative z-10 container mx-auto px-6 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-body text-sm font-medium tracking-wide mb-6">
            Healthcare + AI + Social Impact
          </span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
        >
          <span className="text-gradient-warm">MotherSource</span>{" "}
          <span className="text-foreground">AI</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="font-body text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          AI-powered outreach & funding intelligence for maternal health.
          Discover hospitals, government schemes, NGO partners, and funding
          sources across Andhra Pradesh & Telangana — in seconds.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <Link to="/intelligence" className="inline-flex items-center px-8 py-3.5 rounded-lg bg-gradient-warm text-primary-foreground font-body font-semibold text-sm tracking-wide hover:opacity-90 transition-opacity shadow-elevated">
            🧠 Intelligence Dashboard
          </Link>
          <Link to="/recommend" className="inline-flex items-center px-8 py-3.5 rounded-lg bg-gradient-teal text-secondary-foreground font-body font-semibold text-sm tracking-wide hover:opacity-90 transition-opacity">
            🏥 Get Recommendations
          </Link>
          <a href="#evaluation" className="inline-flex items-center px-8 py-3.5 rounded-lg border border-border bg-background/60 backdrop-blur text-foreground font-body font-semibold text-sm tracking-wide hover:bg-muted transition-colors">
            View Evaluation
          </a>
        </motion.div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
