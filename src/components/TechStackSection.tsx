import { motion } from "framer-motion";
import { Code2, Server, Cpu } from "lucide-react";

const stacks = [
  {
    icon: Code2,
    title: "Frontend",
    items: ["React (Vite)", "Axios", "Responsive UI"],
  },
  {
    icon: Server,
    title: "Backend",
    items: ["FastAPI (Python)", "CSV Datasets", "Rule-based Filtering"],
  },
  {
    icon: Cpu,
    title: "AI Layer",
    items: ["LLM Reasoning", "Confidence Scoring", "Explainable Output"],
  },
];

const TechStackSection = () => (
  <section className="py-24 bg-muted/30">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
          Architecture
        </span>
        <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">
          Technology Stack
        </h2>
      </motion.div>
      <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {stacks.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.5 }}
            className="text-center p-8 rounded-2xl bg-background border border-border/50 shadow-card"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-teal flex items-center justify-center mx-auto mb-5">
              <s.icon className="w-7 h-7 text-secondary-foreground" />
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground mb-4">{s.title}</h3>
            <ul className="space-y-2">
              {s.items.map((item) => (
                <li key={item} className="font-body text-sm text-muted-foreground">
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TechStackSection;
