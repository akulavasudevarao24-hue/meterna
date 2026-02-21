import { motion } from "framer-motion";
import { Hospital, Shield, Heart, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import { useState } from "react";

interface RecommendationData {
  hospitals?: Array<{
    name: string;
    location: string;
    suitability: string;
    distance: string;
    confidence: number;
  }>;
  schemes?: Array<{
    name: string;
    benefits: string;
    eligibility: string;
    howToApply: string;
    confidence: number;
  }>;
  ngos?: Array<{
    name: string;
    supportType: string;
    coverage: string;
    contact: string;
    confidence: number;
  }>;
  overallConfidence?: number;
  reasoning?: string;
  raw?: string;
  parseError?: boolean;
  error?: string;
}

interface Props {
  data: RecommendationData;
}

const ConfidenceBadge = ({ score }: { score: number }) => {
  const color =
    score >= 80
      ? "bg-secondary/15 text-secondary"
      : score >= 60
      ? "bg-accent/20 text-accent-foreground"
      : "bg-destructive/15 text-destructive";
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-body ${color}`}>
      {score}% confidence
    </span>
  );
};

const Section = ({
  icon: Icon,
  title,
  children,
  defaultOpen = true,
}: {
  icon: typeof Hospital;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl border border-border/50 bg-card shadow-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-warm flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary-foreground" />
          </div>
          <h3 className="font-display text-lg font-semibold text-foreground">{title}</h3>
        </div>
        {open ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>
      {open && <div className="px-5 pb-5 space-y-4">{children}</div>}
    </div>
  );
};

const RecommendationResults = ({ data }: Props) => {
  if (data.error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-start gap-3 max-w-4xl mx-auto"
      >
        <AlertCircle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
        <div>
          <p className="font-body font-medium text-foreground">Something went wrong</p>
          <p className="font-body text-sm text-muted-foreground mt-1">{data.error}</p>
        </div>
      </motion.div>
    );
  }

  if (data.parseError && data.raw) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl bg-card border border-border/50 shadow-card max-w-4xl mx-auto"
      >
        <p className="font-body text-sm text-muted-foreground whitespace-pre-wrap">{data.raw}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 max-w-4xl mx-auto"
    >
      {/* Overall confidence */}
      {data.overallConfidence != null && (
        <div className="text-center mb-2">
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-card border border-border/50 shadow-card">
            <span className="font-body text-sm text-muted-foreground">Overall Confidence</span>
            <span className="font-display text-2xl font-bold text-foreground">
              {data.overallConfidence}%
            </span>
          </div>
        </div>
      )}

      {/* Hospitals */}
      {data.hospitals && data.hospitals.length > 0 && (
        <Section icon={Hospital} title="Recommended Hospitals">
          {data.hospitals.map((h, i) => (
            <div key={i} className="p-4 rounded-xl bg-muted/30 border border-border/30">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h4 className="font-display text-base font-semibold text-foreground">{h.name}</h4>
                <ConfidenceBadge score={h.confidence} />
              </div>
              <p className="font-body text-sm text-muted-foreground mb-1">
                📍 {h.location} · {h.distance}
              </p>
              <p className="font-body text-sm text-foreground/80">{h.suitability}</p>
            </div>
          ))}
        </Section>
      )}

      {/* Schemes */}
      {data.schemes && data.schemes.length > 0 && (
        <Section icon={Shield} title="Eligible Government Schemes">
          {data.schemes.map((s, i) => (
            <div key={i} className="p-4 rounded-xl bg-muted/30 border border-border/30">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h4 className="font-display text-base font-semibold text-foreground">{s.name}</h4>
                <ConfidenceBadge score={s.confidence} />
              </div>
              <p className="font-body text-sm text-foreground/80 mb-1">
                <strong>Benefits:</strong> {s.benefits}
              </p>
              <p className="font-body text-sm text-muted-foreground mb-1">
                <strong>Eligibility:</strong> {s.eligibility}
              </p>
              <p className="font-body text-sm text-secondary font-medium">
                <strong>How to Apply:</strong> {s.howToApply}
              </p>
            </div>
          ))}
        </Section>
      )}

      {/* NGOs */}
      {data.ngos && data.ngos.length > 0 && (
        <Section icon={Heart} title="NGO Support">
          {data.ngos.map((n, i) => (
            <div key={i} className="p-4 rounded-xl bg-muted/30 border border-border/30">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h4 className="font-display text-base font-semibold text-foreground">{n.name}</h4>
                <ConfidenceBadge score={n.confidence} />
              </div>
              <p className="font-body text-sm text-foreground/80 mb-1">
                <strong>Support:</strong> {n.supportType}
              </p>
              <p className="font-body text-sm text-muted-foreground mb-1">
                <strong>Coverage:</strong> {n.coverage}
              </p>
              <p className="font-body text-sm text-secondary font-medium">
                <strong>Contact:</strong> {n.contact}
              </p>
            </div>
          ))}
        </Section>
      )}

      {/* Reasoning */}
      {data.reasoning && (
        <div className="p-5 rounded-2xl bg-muted/20 border border-border/30">
          <h4 className="font-display text-sm font-semibold text-foreground mb-2">AI Reasoning</h4>
          <p className="font-body text-sm text-muted-foreground leading-relaxed">
            {data.reasoning}
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default RecommendationResults;
