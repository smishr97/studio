"use client";

import { useState, useEffect } from "react";
import { CalendarView } from "@/components/calendar/CalendarView";
import { DailyView } from "@/components/daily-view/DailyView";
import type { MealEntry } from "@/lib/types";
import useLocalStorage from "@/hooks/useLocalStorage";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [allMeals, setAllMeals] = useLocalStorage<MealEntry[]>("nutrijournal-meals", []);
  const { toast } = useToast();
  const [mealsForSelectedDate, setMealsForSelectedDate] = useState<MealEntry[]>([]);
  const [clientReady, setClientReady] = useState(false);

  useEffect(() => {
    // This effect runs once on the client after hydration
    setSelectedDate(new Date());
    setClientReady(true);
  }, []); // Empty dependency array ensures this runs once on mount

  useEffect(() => {
    if (selectedDate && clientReady) {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      setMealsForSelectedDate(allMeals.filter(meal => meal.date === formattedDate));
    } else {
      setMealsForSelectedDate([]);
    }
  }, [selectedDate, allMeals, clientReady]);


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
  
  if (!clientReady || !selectedDate) {
    // Render a placeholder on the server and during initial client render
    // The actual content will render after client-side effects run.
    return (
      <div className="container mx-auto p-4 md:p-8 text-center">
        <p>Loading NutriJournal...</p>
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
