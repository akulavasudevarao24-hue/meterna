import { createContext, useContext, useState } from "react";

type RecommendationContextType = {
  results: any;
  setResults: (data: any) => void;
};

const RecommendationContext = createContext<RecommendationContextType | null>(null);

export const RecommendationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [results, setResults] = useState<any>(null);

  return (
    <RecommendationContext.Provider value={{ results, setResults }}>
      {children}
    </RecommendationContext.Provider>
  );
};

export const useRecommendation = () => {
  const context = useContext(RecommendationContext);
  if (!context) {
    throw new Error("useRecommendation must be used within RecommendationProvider");
  }
  return context;
};