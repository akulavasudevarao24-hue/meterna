import { motion } from "framer-motion";
import { TrendingUp, Globe, Languages, BarChart } from "lucide-react";

const impacts = [
  { icon: TrendingUp, stat: "94%", label: "of maternal deaths in low-income regions are preventable" },
  { icon: Globe, stat: "50+", label: "government schemes can be matched per user profile" },
  { icon: Languages, stat: "∞", label: "scalable to multilingual voice-based access" },
  { icon: BarChart, stat: "Real-time", label: "integration-ready with government health APIs" },
];

const ImpactSection = () => (
  <section className="py-24 bg-background">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent-foreground text-sm font-medium mb-4">
          Impact & Scale
        </span>
        <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">
          Built to <span className="text-gradient-warm">Save Lives</span>
        </h2>
      </motion.div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {impacts.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="text-center p-6 rounded-2xl bg-card border border-border/50 shadow-card"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <item.icon className="w-6 h-6 text-primary" />
            </div>
            <div className="font-display text-3xl font-bold text-foreground mb-1">{item.stat}</div>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">{item.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ImpactSection;
