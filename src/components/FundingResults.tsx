import { motion } from "framer-motion";
import { useState } from "react";
import { DollarSign, Globe, Heart, Lightbulb, Award, ChevronDown, ChevronUp, Filter, AlertCircle } from "lucide-react";

interface Funder {
  name: string;
  type: string;
  focusAreas: string[];
  geographicFocus: string;
  relevanceScore: number;
  reasoning: string;
  fundingCapacity: string;
  whyTheyFund: string;
  approachStrategy: string;
  contactInfo: string;
  priority: string;
}

interface FundingData {
  funders?: Funder[];
  summary?: string;
  totalDiscovered?: number;
  topRecommendation?: string;
  raw?: string;
  parseError?: boolean;
  error?: string;
}

const typeIcons: Record<string, typeof DollarSign> = {
  foundation: Globe,
  corporate_fund: Lightbulb,
  hni: Award,
  ngo_partner: Heart,
  grant_program: DollarSign,
};

const typeColors: Record<string, string> = {
  foundation: "bg-primary/10 text-primary",
  corporate_fund: "bg-secondary/10 text-secondary",
  hni: "bg-accent/20 text-accent-foreground",
  ngo_partner: "bg-secondary/15 text-secondary",
  grant_program: "bg-primary/15 text-primary",
};

const priorityColors: Record<string, string> = {
  high: "bg-primary/15 text-primary",
  medium: "bg-accent/20 text-accent-foreground",
  low: "bg-muted text-muted-foreground",
};

const capacityLabels: Record<string, string> = {
  small: "< $100K",
  medium: "$100K–$1M",
  large: "> $1M",
};

const FundingResults = ({ data }: { data: FundingData }) => {
  const [filterType, setFilterType] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  if (data.error) {
    return (
      <div className="p-6 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
        <div>
          <p className="font-body font-medium text-foreground">Error</p>
          <p className="font-body text-sm text-muted-foreground mt-1">{data.error}</p>
        </div>
      </div>
    );
  }

  if (data.parseError && data.raw) {
    return <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-card"><p className="font-body text-sm text-muted-foreground whitespace-pre-wrap">{data.raw}</p></div>;
  }

  const funders = data.funders || [];
  const types = [...new Set(funders.map((f) => f.type))];

  let filtered = filterType === "all" ? funders : funders.filter((f) => f.type === filterType);
  if (filterPriority !== "all") filtered = filtered.filter((f) => f.priority === filterPriority);
  const sorted = [...filtered].sort((a, b) => b.relevanceScore - a.relevanceScore);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      {data.summary && (
        <div className="p-4 rounded-xl bg-muted/30 border border-border/30">
          <p className="font-body text-sm text-foreground">{data.summary}</p>
        </div>
      )}

      {data.topRecommendation && (
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
          <p className="font-body text-xs font-medium text-primary mb-1">⭐ Top Recommendation</p>
          <p className="font-body text-sm text-foreground">{data.topRecommendation}</p>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="px-3 py-1.5 rounded-lg border border-border bg-background text-foreground font-body text-xs appearance-none">
          <option value="all">All Types ({funders.length})</option>
          {types.map((t) => <option key={t} value={t}>{t.replace("_", " ")} ({funders.filter((f) => f.type === t).length})</option>)}
        </select>
        <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="px-3 py-1.5 rounded-lg border border-border bg-background text-foreground font-body text-xs appearance-none">
          <option value="all">All Priorities</option>
          <option value="high">🔴 High Priority</option>
          <option value="medium">🟡 Medium</option>
          <option value="low">⚪ Low</option>
        </select>
        <span className="ml-auto font-body text-xs text-muted-foreground">{sorted.length} results</span>
      </div>

      {/* Funder Cards */}
      <div className="space-y-3">
        {sorted.map((f, i) => {
          const Icon = typeIcons[f.type] || DollarSign;
          const colorCls = typeColors[f.type] || "bg-muted text-muted-foreground";
          const priCls = priorityColors[f.priority] || priorityColors.low;
          const isExpanded = expandedIdx === i;

          return (
            <div key={i} className="rounded-xl border border-border/50 bg-card shadow-card overflow-hidden">
              <button onClick={() => setExpandedIdx(isExpanded ? null : i)} className="w-full flex items-center gap-4 p-4 text-left hover:bg-muted/20 transition-colors">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colorCls}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-display text-sm font-semibold text-foreground truncate">{f.name}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider ${colorCls}`}>{f.type.replace("_", " ")}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider ${priCls}`}>{f.priority}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <p className="font-body text-xs text-muted-foreground">🌍 {f.geographicFocus}</p>
                    {f.fundingCapacity && <p className="font-body text-xs text-secondary font-medium">{capacityLabels[f.fundingCapacity] || f.fundingCapacity}</p>}
                  </div>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-body bg-secondary/15 text-secondary">{f.relevanceScore}/100</span>
                {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
              </button>
              {isExpanded && (
                <div className="px-4 pb-4 space-y-2 border-t border-border/30 pt-3">
                  {f.focusAreas && f.focusAreas.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {f.focusAreas.map((a, j) => <span key={j} className="px-2 py-0.5 rounded-full bg-muted text-[10px] font-body text-muted-foreground">{a}</span>)}
                    </div>
                  )}
                  <div><span className="font-body text-xs font-medium text-foreground">Why they'd fund this:</span><p className="font-body text-xs text-muted-foreground">{f.whyTheyFund}</p></div>
                  <div><span className="font-body text-xs font-medium text-foreground">AI Reasoning:</span><p className="font-body text-xs text-muted-foreground">{f.reasoning}</p></div>
                  <div><span className="font-body text-xs font-medium text-foreground">Approach Strategy:</span><p className="font-body text-xs text-secondary">{f.approachStrategy}</p></div>
                  {f.contactInfo && <div><span className="font-body text-xs font-medium text-foreground">Contact/Website:</span><p className="font-body text-xs text-muted-foreground">{f.contactInfo}</p></div>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default FundingResults;
