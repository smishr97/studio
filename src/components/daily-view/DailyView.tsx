"use client";

import type { MealEntry, MealType } from "@/lib/types";
import { mealTypes } from "@/lib/types";
import { MealCard } from "@/components/meal-entry/MealCard";
import { format, parseISO } from "date-fns";

interface DailyViewProps {
  selectedDate: Date;
  meals: MealEntry[];
  onUpdateMeal: (meal: MealEntry) => void;
  onDeleteMeal: (mealId: string) => void;
}

export function DailyView({ selectedDate, meals, onUpdateMeal, onDeleteMeal }: DailyViewProps) {
  const formattedDate = format(selectedDate, "yyyy-MM-dd");
  const dayName = format(selectedDate, "EEEE");
  const displayDate = format(selectedDate, "MMMM d, yyyy");

  const mealsForDayAndType = (mealType: MealType) => {
    return meals.find(
      (meal) => meal.date === formattedDate && meal.type === mealType
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          {dayName}
        </h2>
        <p className="text-muted-foreground text-lg">{displayDate}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mealTypes.map((type) => (
          <MealCard
            key={type}
            mealType={type}
            mealEntry={mealsForDayAndType(type)}
            selectedDate={formattedDate}
            onSaveMeal={onUpdateMeal}
            onDeleteMeal={onDeleteMeal}
          />
        ))}
      </div>
    </div>
  );
}
