
"use client";

import type { MealEntry, MealType } from "@/lib/types";
import { mealTypes } from "@/lib/types";
import { MealCard } from "@/components/meal-entry/MealCard";
import { format } from "date-fns";

interface DailyViewProps {
  selectedDate: Date;
  meals: MealEntry[];
  onUpdateMeal: (meal: MealEntry) => void;
  onDeleteMeal: (mealId: string) => void;
}

export function DailyView({ selectedDate, meals, onUpdateMeal, onDeleteMeal }: DailyViewProps) {
  const formattedDate = format(selectedDate, "yyyy-MM-dd");

  const mealsForDayAndType = (mealType: MealType) => {
    return meals.find(
      (meal) => meal.date === formattedDate && meal.type === mealType
    );
  };

  return (
    // The surrounding div with date display has been removed.
    // DashboardPage now handles the date display and calendar trigger.
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {mealTypes.map((type) => (
        <MealCard
          key={type}
          mealType={type}
          mealEntry={mealsForDayAndType(type)}
          selectedDate={formattedDate} // MealCard needs this for saving new/updated entries
          onSaveMeal={onUpdateMeal}
          onDeleteMeal={onDeleteMeal}
        />
      ))}
    </div>
  );
}
