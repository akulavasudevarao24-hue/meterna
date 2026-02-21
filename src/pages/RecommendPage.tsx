import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import ProfileForm, { type ProfileData } from "@/components/ProfileForm";
import RecommendationResults from "@/components/RecommendationResults";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const RecommendPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleSubmit = async (profile: ProfileData) => {
    setIsLoading(true);
    setResults(null);
    try {
      const { data, error } = await supabase.functions.invoke("recommend", {
        body: { profile },
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to get recommendations.",
          variant: "destructive",
        });
        setResults({ error: error.message });
      } else {
        setResults(data);
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Something went wrong.",
        variant: "destructive",
      });
      setResults({ error: err?.message || "Unknown error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-hero border-b border-border">
        <div className="container mx-auto px-6 py-8">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-body mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Overview
          </a>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-3xl md:text-4xl font-bold text-foreground"
          >
            AI Recommendation Engine
          </motion.h1>
          <p className="font-body text-muted-foreground mt-2 max-w-xl">
            Enter your health profile to receive personalized hospital, scheme, and NGO recommendations powered by explainable AI.
          </p>
        </div>
      </div>

      {/* Form */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <ProfileForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </section>

      {/* Results */}
      {results && (
        <section ref={resultsRef} className="pb-20">
          <div className="container mx-auto px-6">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-display text-2xl md:text-3xl font-bold text-foreground text-center mb-8"
            >
              Your Personalized{" "}
              <span className="text-gradient-warm">Recommendations</span>
            </motion.h2>
            <RecommendationResults data={results} />
          </div>
        </section>
      )}
    </main>
  );
};

export default RecommendPage;
