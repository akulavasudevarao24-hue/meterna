import { motion } from "framer-motion";

const criteria = [
  {
    label: "Problem Relevance",
    score: 9.2,
    color: "bg-primary",
    analysis:
      "Maternal mortality disproportionately affects rural communities. WHO data confirms 94% of maternal deaths occur in low/middle-income settings. This problem is urgent, well-defined, and directly measurable.",
  },
  {
    label: "Technical Innovation",
    score: 8.5,
    color: "bg-secondary",
    analysis:
      "Combines structured rule-based filtering with LLM-powered explainability — a hybrid approach that outperforms static listings while maintaining transparency through confidence scoring.",
  },
  {
    label: "Practical Feasibility",
    score: 8.8,
    color: "bg-accent",
    analysis:
      "Built on proven technologies (React + FastAPI + CSV datasets). MVP is achievable within hackathon timelines. CSV data can be swapped for live APIs without architectural changes.",
  },
  {
    label: "Social Impact",
    score: 9.5,
    color: "bg-primary",
    analysis:
      "Directly bridges the information asymmetry causing preventable maternal deaths. Improves scheme utilization efficiency and connects underserved populations with available resources.",
  },
  {
    label: "Scalability Potential",
    score: 8.7,
    color: "bg-secondary",
    analysis:
      "Clear expansion paths: real-time health APIs, predictive risk models, multilingual voice access, and generalization to other healthcare verticals beyond maternal care.",
  },
  {
    label: "Hackathon Competitiveness",
    score: 9.0,
    color: "bg-primary",
    analysis:
      "Strong theme alignment (Healthcare + AI + Social Impact), clear demo potential, emotionally compelling narrative, and technically differentiated by AI explainability layer.",
  },
];

const EvaluationSection = () => (
  <section id="evaluation" className="py-24 bg-background">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          AI Evaluation
        </span>
        <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
          Structured Project{" "}
          <span className="text-gradient-warm">Assessment</span>
        </h2>
        <p className="font-body text-muted-foreground max-w-xl mx-auto">
          An objective analysis across six dimensions of hackathon excellence.
        </p>
      </motion.div>

      {/* Overall Score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="max-w-md mx-auto mb-16 text-center"
      >
        <div className="inline-flex items-center justify-center w-36 h-36 rounded-full bg-gradient-warm shadow-elevated">
          <div className="w-28 h-28 rounded-full bg-background flex flex-col items-center justify-center">
            <span className="font-display text-4xl font-bold text-foreground">
              {(criteria.reduce((a, c) => a + c.score, 0) / criteria.length).toFixed(1)}
            </span>
            <span className="font-body text-xs text-muted-foreground uppercase tracking-wider">
              Overall
            </span>
          </div>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {criteria.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className="p-6 rounded-2xl bg-card border border-border/50 shadow-card"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-lg font-semibold text-foreground">
                {c.label}
              </h3>
              <span className="font-body text-2xl font-bold text-foreground">
                {c.score}
                <span className="text-sm text-muted-foreground font-normal">/10</span>
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-muted mb-4 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${c.score * 10}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: i * 0.1 }}
                className={`h-full rounded-full ${c.color}`}
              />
            </div>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              {c.analysis}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default EvaluationSection;
