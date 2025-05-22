
"use client";

import { useState, useEffect } from "react";
import { CalendarView } from "@/components/calendar/CalendarView";
import { DailyView } from "@/components/daily-view/DailyView";
import type { MealEntry } from "@/lib/types";
import useLocalStorage from "@/hooks/useLocalStorage";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react"; // Renamed to avoid conflict with Calendar component

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [allMeals, setAllMeals] = useLocalStorage<MealEntry[]>("nutrijournal-meals", []);
  const { toast } = useToast();
  const [clientReady, setClientReady] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  useEffect(() => {
    setSelectedDate(new Date());
    setClientReady(true);
  }, []);

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setIsCalendarOpen(false);
    }
  };

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
    return (
      <div className="container mx-auto p-4 md:p-8 text-center">
        <p>Loading NutriJournal...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {format(selectedDate, "EEEE")}
          </h1>
          <p className="text-lg text-muted-foreground">
            {format(selectedDate, "MMMM d, yyyy")}
          </p>
        </div>
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 w-full sm:w-auto justify-center">
              <CalendarIcon className="h-5 w-5" />
              <span>{format(selectedDate, "MMM d, yyyy")}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <CalendarView
              selectedDate={selectedDate}
              onDateChange={handleDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <main className="flex-1 min-w-0">
        <DailyView 
          selectedDate={selectedDate} 
          meals={allMeals}
          onUpdateMeal={handleUpdateMeal}
          onDeleteMeal={handleDeleteMeal}
        />
      </main>
    </div>
  );
}
