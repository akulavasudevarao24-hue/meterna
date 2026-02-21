import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import ChannelFinderForm from "@/components/ChannelFinderForm";
import ChannelResults from "@/components/ChannelResults";
import FundingScoutForm from "@/components/FundingScoutForm";
import FundingResults from "@/components/FundingResults";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Tab = "channels" | "funding";

const IntelligencePage = () => {
  const [activeTab, setActiveTab] = useState<Tab>("channels");
  const [channelLoading, setChannelLoading] = useState(false);
  const [fundingLoading, setFundingLoading] = useState(false);
  const [channelResults, setChannelResults] = useState<any>(null);
  const [fundingResults, setFundingResults] = useState<any>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToResults = () => {
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const handleChannelSearch = async (params: { district: string; profile: string; additionalContext: string }) => {
    setChannelLoading(true);
    setChannelResults(null);
    try {
      const { data, error } = await supabase.functions.invoke("channel-finder", { body: params });
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        setChannelResults({ error: error.message });
      } else {
        setChannelResults(data);
        scrollToResults();
      }
    } catch (err: any) {
      toast({ title: "Error", description: err?.message || "Something went wrong", variant: "destructive" });
      setChannelResults({ error: err?.message });
    } finally {
      setChannelLoading(false);
    }
  };

  const handleFundingSearch = async (params: { focusArea: string; programDescription: string; fundingType: string }) => {
    setFundingLoading(true);
    setFundingResults(null);
    try {
      const { data, error } = await supabase.functions.invoke("funding-scout", { body: params });
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        setFundingResults({ error: error.message });
      } else {
        setFundingResults(data);
        scrollToResults();
      }
    } catch (err: any) {
      toast({ title: "Error", description: err?.message || "Something went wrong", variant: "destructive" });
      setFundingResults({ error: err?.message });
    } finally {
      setFundingLoading(false);
    }
  };

  const tabs = [
    { id: "channels" as Tab, label: "Mother Onboarding Finder", icon: MapPin, desc: "Discover outreach channels across AP & Telangana" },
    { id: "funding" as Tab, label: "Funding & Partnership Scout", icon: DollarSign, desc: "Find funders and implementation partners" },
  ];

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-hero border-b border-border">
        <div className="container mx-auto px-6 py-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-body mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Overview
          </Link>
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Intelligence <span className="text-gradient-warm">Dashboard</span>
          </motion.h1>
          <p className="font-body text-muted-foreground mt-2 max-w-2xl">
            AI-powered dual-engine system for discovering outreach channels and funding sources for the 1,000 mothers pilot across AP & Telangana.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border bg-card/50">
        <div className="container mx-auto px-6">
          <div className="flex gap-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-body text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.id === "channels" ? "Channels" : "Funding"}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <section className="py-8">
        <div className="container mx-auto px-6">
          {activeTab === "channels" ? (
            <ChannelFinderForm onSearch={handleChannelSearch} isLoading={channelLoading} />
          ) : (
            <FundingScoutForm onSearch={handleFundingSearch} isLoading={fundingLoading} />
          )}
        </div>
      </section>

      {/* Results */}
      <section ref={resultsRef} className="pb-20">
        <div className="container mx-auto px-6">
          {activeTab === "channels" && channelResults && (
            <>
              <h2 className="font-display text-xl font-bold text-foreground mb-4">
                Discovered <span className="text-gradient-warm">Channels</span>
              </h2>
              <ChannelResults data={channelResults} />
            </>
          )}
          {activeTab === "funding" && fundingResults && (
            <>
              <h2 className="font-display text-xl font-bold text-foreground mb-4">
                Funding <span className="text-gradient-warm">Intelligence</span>
              </h2>
              <FundingResults data={fundingResults} />
            </>
          )}
        </div>
      </section>
    </main>
  );
};

export default IntelligencePage;
