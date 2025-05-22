"use client";

import { useState, useEffect } from "react";
import { CalendarView } from "@/components/calendar/CalendarView";
import { DailyView } from "@/components/daily-view/DailyView";
import type { MealEntry } from "@/lib/types";
import useLocalStorage from "@/hooks/useLocalStorage";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [allMeals, setAllMeals] = useLocalStorage<MealEntry[]>("nutrijournal-meals", []);
  const { toast } = useToast();

  // This state ensures DailyView re-renders when meals for the selectedDate change.
  const [mealsForSelectedDate, setMealsForSelectedDate] = useState<MealEntry[]>([]);

  useEffect(() => {
    if (selectedDate) {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      setMealsForSelectedDate(allMeals.filter(meal => meal.date === formattedDate));
    } else {
      setMealsForSelectedDate([]);
    }
  }, [selectedDate, allMeals]);


  const handleUpdateMeal = (mealToUpdate: MealEntry) => {
    setAllMeals((prevMeals) => {
      const index = prevMeals.findIndex((m) => m.id === mealToUpdate.id);
      if (index > -1) {
        const updatedMeals = [...prevMeals];
        updatedMeals[index] = mealToUpdate;
        toast({ title: "Meal Updated", description: `${mealToUpdate.name} for ${mealToUpdate.type} has been updated.` });
        return updatedMeals;
      }
      toast({ title: "Meal Added", description: `${mealToUpdate.name} for ${mealToUpdate.type} has been added.` });
      return [...prevMeals, mealToUpdate];
    });
  };

  const handleDeleteMeal = (mealIdToDelete: string) => {
    setAllMeals((prevMeals) => {
      const mealToDelete = prevMeals.find(m => m.id === mealIdToDelete);
      if (mealToDelete) {
        toast({ 
          title: "Meal Deleted", 
          description: `${mealToDelete.name} for ${mealToDelete.type} has been deleted.`,
          variant: "destructive" 
        });
      }
      return prevMeals.filter((meal) => meal.id !== mealIdToDelete);
    });
  };
  
  // Ensure selectedDate is always defined for DailyView after initial load
  if (!selectedDate) {
     // You can show a loading state or default to today if selectedDate is somehow undefined client-side initially
    return (
      <div className="container mx-auto p-4 md:p-8 text-center">
        <p>Loading calendar...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-[380px] lg:sticky lg:top-20 self-start"> {/* Adjusted width for calendar */}
          <CalendarView selectedDate={selectedDate} onDateChange={setSelectedDate} />
        </aside>
        <main className="flex-1 min-w-0"> {/* Added min-w-0 for flex child overflow */}
          <DailyView 
            selectedDate={selectedDate} 
            meals={allMeals} // Pass allMeals, DailyView will filter
            onUpdateMeal={handleUpdateMeal}
            onDeleteMeal={handleDeleteMeal}
          />
        </main>
      </div>
    </div>
  );
}
