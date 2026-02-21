import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, DollarSign, Search } from "lucide-react";

interface Props {
  onSearch: (params: { focusArea: string; programDescription: string; fundingType: string }) => void;
  isLoading: boolean;
}

const FundingScoutForm = ({ onSearch, isLoading }: Props) => {
  const [focusArea, setFocusArea] = useState("Maternal Health & Child Nutrition");
  const [programDescription, setProgramDescription] = useState(
    "A pilot program to onboard 1,000 mothers across AP and Telangana for maternal health support, nutrition guidance, and early childhood development."
  );
  const [fundingType, setFundingType] = useState("all");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ focusArea, programDescription, fundingType });
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow";
  const labelClass = "block font-body text-sm font-medium text-foreground mb-1.5";

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl bg-card border border-border/50 shadow-card"
    >
      <div className="flex items-center gap-2 mb-5">
        <DollarSign className="w-5 h-5 text-secondary" />
        <h3 className="font-display text-lg font-semibold text-foreground">Scout Funding & Partners</h3>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Focus Area</label>
          <input type="text" value={focusArea} onChange={(e) => setFocusArea(e.target.value)} required maxLength={200} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Funder Type</label>
          <select value={fundingType} onChange={(e) => setFundingType(e.target.value)} className={`${inputClass} appearance-none`}>
            <option value="all">All Types</option>
            <option value="foundation">Global Foundations</option>
            <option value="ai_fund">AI for Social Good Funds</option>
            <option value="hni">HNIs & Philanthropists</option>
            <option value="ngo_partner">NGO Implementation Partners</option>
            <option value="grant">Open Grants</option>
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label className={labelClass}>Program Description</label>
        <textarea
          value={programDescription}
          onChange={(e) => setProgramDescription(e.target.value)}
          rows={3}
          maxLength={500}
          className={`${inputClass} resize-none`}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="mt-5 w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-teal text-secondary-foreground font-body font-semibold text-sm hover:opacity-90 transition-opacity shadow-elevated disabled:opacity-60"
      >
        {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Scouting Funders…</> : <><Search className="w-4 h-4" /> Scout Funding Sources</>}
      </button>
    </motion.form>
  );
};

export default FundingScoutForm;
