import { motion } from "framer-motion";
import { Hospital, Shield, Heart, Brain, BarChart3, Eye } from "lucide-react";

const features = [
  { icon: Hospital, title: "Smart Hospital Matching", desc: "Filters hospitals by ICU availability, C-section capability, and proximity to the patient." },
  { icon: Shield, title: "Government Scheme Eligibility", desc: "Matches user profiles against scheme criteria for income, location, and rural/urban classification." },
  { icon: Heart, title: "NGO Support Finder", desc: "Recommends local NGOs providing financial assistance, emergency transport, and logistics." },
  { icon: Brain, title: "AI-Powered Reasoning", desc: "LLM layer generates human-readable explanations for every recommendation made." },
  { icon: BarChart3, title: "Confidence Scoring", desc: "Each recommendation carries a reliability confidence score for transparency." },
  { icon: Eye, title: "Explainable AI", desc: "No black box — users see exactly why each hospital, scheme, or NGO was recommended." },
];

const FeaturesSection = () => (
  <section id="features" className="py-24 bg-muted/30">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
          Core Features
        </span>
        <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">
          Intelligent, Personalized,{" "}
          <span className="text-gradient-warm">Transparent</span>
        </h2>
      </motion.div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="group p-7 rounded-2xl bg-background border border-border/50 shadow-card hover:shadow-elevated hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-warm flex items-center justify-center mb-5">
              <f.icon className="w-5 h-5 text-primary-foreground" />
            </div>
            <h3 className="font-display text-lg font-semibold text-foreground mb-2">{f.title}</h3>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
