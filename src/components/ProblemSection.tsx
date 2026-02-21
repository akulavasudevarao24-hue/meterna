import { motion } from "framer-motion";
import { AlertTriangle, MapPin, FileQuestion, HandCoins } from "lucide-react";

const problems = [
  {
    icon: MapPin,
    title: "No Hospital Guidance",
    desc: "Women don't know which hospitals match their medical risk level or location.",
  },
  {
    icon: FileQuestion,
    title: "Scheme Unawareness",
    desc: "Eligible government healthcare schemes go unutilized due to lack of awareness.",
  },
  {
    icon: HandCoins,
    title: "No Financial Support Access",
    desc: "NGOs providing emergency transport and funds remain disconnected from beneficiaries.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6 },
  }),
};

const ProblemSection = () => (
  <section className="py-24 bg-background">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-destructive/10 text-destructive text-sm font-medium mb-4">
          <AlertTriangle className="w-4 h-4" />
          The Problem
        </div>
        <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">
          Maternal mortality persists due to<br />
          <span className="text-gradient-warm">systemic information gaps</span>
        </h2>
      </motion.div>
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {problems.map((p, i) => (
          <motion.div
            key={p.title}
            custom={i}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="p-8 rounded-2xl bg-card shadow-card border border-border/50 hover:shadow-elevated transition-shadow duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
              <p.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground mb-3">{p.title}</h3>
            <p className="font-body text-muted-foreground leading-relaxed">{p.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ProblemSection;
