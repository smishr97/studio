"use client";

import { SummaryDashboard } from "@/components/summary/SummaryDashboard";
import type { MealEntry } from "@/lib/types";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useState, useEffect } from "react";

export default function SummaryPage() {
  const [allMeals, setAllMeals] = useLocalStorage<MealEntry[]>("nutrijournal-meals", []);
  const [currentDate, setCurrentDate] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentDate(new Date());
  }, []);

  if (!currentDate) {
    return (
      <div className="container mx-auto p-4 md:p-8 text-center">
        <p>Loading summary data...</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Nutrient Summary</h1>
      <SummaryDashboard meals={allMeals} selectedDate={currentDate} />
    </div>
  );
}
