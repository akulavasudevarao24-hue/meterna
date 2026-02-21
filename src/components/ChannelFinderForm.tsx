import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Search, MapPin } from "lucide-react";

const districts = [
  "Hyderabad", "Secunderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam",
  "Mahbubnagar", "Nalgonda", "Adilabad", "Medak", "Rangareddy", "Sangareddy",
  "Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Rajahmundry",
  "Tirupati", "Kakinada", "Eluru", "Ongole", "Anantapur", "Kadapa", "Srikakulam",
  "Vizianagaram", "Chittoor", "Prakasam", "Krishna", "West Godavari", "East Godavari",
];

interface Props {
  onSearch: (params: { district: string; profile: string; additionalContext: string }) => void;
  isLoading: boolean;
}

const ChannelFinderForm = ({ onSearch, isLoading }: Props) => {
  const [district, setDistrict] = useState("");
  const [profile, setProfile] = useState("both");
  const [additionalContext, setAdditionalContext] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ district, profile, additionalContext });
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
        <MapPin className="w-5 h-5 text-primary" />
        <h3 className="font-display text-lg font-semibold text-foreground">Find Outreach Channels</h3>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>District / City</label>
          <select value={district} onChange={(e) => setDistrict(e.target.value)} required className={`${inputClass} appearance-none`}>
            <option value="">Select location</option>
            {districts.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Mother Profile</label>
          <select value={profile} onChange={(e) => setProfile(e.target.value)} className={`${inputClass} appearance-none`}>
            <option value="both">Both Rural & Urban</option>
            <option value="rural">Rural Only</option>
            <option value="urban">Urban Only</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Additional Context</label>
          <input
            type="text"
            placeholder="e.g. focus on first-time mothers"
            value={additionalContext}
            onChange={(e) => setAdditionalContext(e.target.value)}
            maxLength={200}
            className={inputClass}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="mt-5 w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-warm text-primary-foreground font-body font-semibold text-sm hover:opacity-90 transition-opacity shadow-elevated disabled:opacity-60"
      >
        {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Discovering Channels…</> : <><Search className="w-4 h-4" /> Discover Channels</>}
      </button>
    </motion.form>
  );
};

export default ChannelFinderForm;
