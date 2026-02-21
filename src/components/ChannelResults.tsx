import { motion } from "framer-motion";
import { useState } from "react";
import { Hospital, Building2, Users, Landmark, ChevronDown, ChevronUp, Filter, AlertCircle } from "lucide-react";

interface Channel {
  name: string;
  type: string;
  category: string;
  location: string;
  relevanceScore: number;
  reasoning: string;
  contactInfo: string;
  whyItMatters: string;
  outreachApproach: string;
  confidence: string;
}

interface ChannelData {
  channels?: Channel[];
  summary?: string;
  totalDiscovered?: number;
  coverageAnalysis?: string;
  raw?: string;
  parseError?: boolean;
  error?: string;
}

const typeIcons: Record<string, typeof Hospital> = {
  hospital: Hospital,
  clinic: Hospital,
  medical_college: Landmark,
  corporate: Building2,
  ngo: Users,
  health_office: Landmark,
  PHC: Hospital,
};

const typeColors: Record<string, string> = {
  hospital: "bg-primary/10 text-primary",
  clinic: "bg-primary/10 text-primary",
  medical_college: "bg-accent/20 text-accent-foreground",
  corporate: "bg-secondary/10 text-secondary",
  ngo: "bg-secondary/15 text-secondary",
  health_office: "bg-muted text-muted-foreground",
  PHC: "bg-primary/10 text-primary",
};

const ScoreBadge = ({ score }: { score: number }) => {
  const color = score >= 80 ? "bg-secondary/15 text-secondary" : score >= 60 ? "bg-accent/20 text-accent-foreground" : "bg-muted text-muted-foreground";
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-body ${color}`}>{score}/100</span>;
};

const ChannelResults = ({ data }: { data: ChannelData }) => {
  const [filterType, setFilterType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("relevance");
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

  const channels = data.channels || [];
  const types = [...new Set(channels.map((c) => c.type))];

  const filtered = filterType === "all" ? channels : channels.filter((c) => c.type === filterType);
  const sorted = [...filtered].sort((a, b) => sortBy === "relevance" ? b.relevanceScore - a.relevanceScore : a.name.localeCompare(b.name));

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      {/* Summary */}
      {data.summary && (
        <div className="p-4 rounded-xl bg-muted/30 border border-border/30">
          <p className="font-body text-sm text-foreground">{data.summary}</p>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-border bg-background text-foreground font-body text-xs appearance-none"
        >
          <option value="all">All Types ({channels.length})</option>
          {types.map((t) => <option key={t} value={t}>{t} ({channels.filter((c) => c.type === t).length})</option>)}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-border bg-background text-foreground font-body text-xs appearance-none"
        >
          <option value="relevance">Sort by Relevance</option>
          <option value="name">Sort by Name</option>
        </select>
        <span className="ml-auto font-body text-xs text-muted-foreground">{sorted.length} results</span>
      </div>

      {/* Channel Cards */}
      <div className="space-y-3">
        {sorted.map((ch, i) => {
          const Icon = typeIcons[ch.type] || Hospital;
          const colorCls = typeColors[ch.type] || "bg-muted text-muted-foreground";
          const isExpanded = expandedIdx === i;

          return (
            <div key={i} className="rounded-xl border border-border/50 bg-card shadow-card overflow-hidden">
              <button
                onClick={() => setExpandedIdx(isExpanded ? null : i)}
                className="w-full flex items-center gap-4 p-4 text-left hover:bg-muted/20 transition-colors"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colorCls}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-display text-sm font-semibold text-foreground truncate">{ch.name}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider ${colorCls}`}>{ch.type}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground uppercase tracking-wider">{ch.category?.replace("_", " ")}</span>
                  </div>
                  <p className="font-body text-xs text-muted-foreground mt-0.5">📍 {ch.location}</p>
                </div>
                <ScoreBadge score={ch.relevanceScore} />
                {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
              </button>
              {isExpanded && (
                <div className="px-4 pb-4 space-y-2 border-t border-border/30 pt-3">
                  <div><span className="font-body text-xs font-medium text-foreground">Why it matters:</span><p className="font-body text-xs text-muted-foreground">{ch.whyItMatters}</p></div>
                  <div><span className="font-body text-xs font-medium text-foreground">AI Reasoning:</span><p className="font-body text-xs text-muted-foreground">{ch.reasoning}</p></div>
                  <div><span className="font-body text-xs font-medium text-foreground">Outreach Approach:</span><p className="font-body text-xs text-secondary">{ch.outreachApproach}</p></div>
                  {ch.contactInfo && <div><span className="font-body text-xs font-medium text-foreground">Contact:</span><p className="font-body text-xs text-muted-foreground">{ch.contactInfo}</p></div>}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Coverage Analysis */}
      {data.coverageAnalysis && (
        <div className="p-4 rounded-xl bg-muted/20 border border-border/30 mt-4">
          <h4 className="font-display text-sm font-semibold text-foreground mb-1">Coverage Analysis</h4>
          <p className="font-body text-xs text-muted-foreground leading-relaxed">{data.coverageAnalysis}</p>
        </div>
      )}
    </motion.div>
  );
};

export default ChannelResults;
