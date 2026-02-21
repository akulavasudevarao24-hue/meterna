import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";

interface ProfileFormProps {
  onSubmit: (profile: ProfileData) => void;
  isLoading: boolean;
}

export interface ProfileData {
  state: string;
  district: string;
  areaType: string;
  income: string;
  riskLevel: string;
  gestationalAge: string;
  notes: string;
}

const indianStates = [
  "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal",
];

const ProfileForm = ({ onSubmit, isLoading }: ProfileFormProps) => {
  const [form, setForm] = useState<ProfileData>({
    state: "",
    district: "",
    areaType: "rural",
    income: "",
    riskLevel: "low",
    gestationalAge: "",
    notes: "",
  });

  const update = (key: keyof ProfileData, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const selectClass =
    "w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow appearance-none";
  const inputClass = selectClass;
  const labelClass = "block font-body text-sm font-medium text-foreground mb-1.5";

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-8 rounded-2xl bg-card border border-border/50 shadow-card max-w-2xl mx-auto"
    >
      <h3 className="font-display text-2xl font-bold text-foreground mb-1">
        Your Health Profile
      </h3>
      <p className="font-body text-sm text-muted-foreground mb-8">
        Fill in your details for personalized AI-powered recommendations.
      </p>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>State</label>
          <select
            value={form.state}
            onChange={(e) => update("state", e.target.value)}
            required
            className={selectClass}
          >
            <option value="">Select state</option>
            {indianStates.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>District / City</label>
          <input
            type="text"
            placeholder="e.g. Lucknow"
            value={form.district}
            onChange={(e) => update("district", e.target.value)}
            required
            maxLength={100}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Area Type</label>
          <select
            value={form.areaType}
            onChange={(e) => update("areaType", e.target.value)}
            className={selectClass}
          >
            <option value="rural">Rural</option>
            <option value="semi-urban">Semi-Urban</option>
            <option value="urban">Urban</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Monthly Income (₹)</label>
          <input
            type="number"
            placeholder="e.g. 15000"
            value={form.income}
            onChange={(e) => update("income", e.target.value)}
            required
            min={0}
            max={10000000}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Pregnancy Risk Level</label>
          <select
            value={form.riskLevel}
            onChange={(e) => update("riskLevel", e.target.value)}
            className={selectClass}
          >
            <option value="low">Low Risk</option>
            <option value="moderate">Moderate Risk</option>
            <option value="high">High Risk</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Gestational Age (weeks)</label>
          <input
            type="number"
            placeholder="e.g. 24"
            value={form.gestationalAge}
            onChange={(e) => update("gestationalAge", e.target.value)}
            required
            min={1}
            max={42}
            className={inputClass}
          />
        </div>
      </div>

      <div className="mt-5">
        <label className={labelClass}>Additional Notes (optional)</label>
        <textarea
          placeholder="Any specific health conditions, previous complications, etc."
          value={form.notes}
          onChange={(e) => update("notes", e.target.value)}
          maxLength={500}
          rows={3}
          className={`${inputClass} resize-none`}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="mt-8 w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-warm text-primary-foreground font-body font-semibold text-sm tracking-wide hover:opacity-90 transition-opacity shadow-elevated disabled:opacity-60"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Analyzing Profile…
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            Get AI Recommendations
          </>
        )}
      </button>
    </motion.form>
  );
};

export default ProfileForm;
