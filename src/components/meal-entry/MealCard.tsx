"use client";

import type { MealEntry, MealType } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coffee, Cookie, Drumstick, Salad, Flame, Tangent, Grape, Brain, Edit3, Trash2, Clock } from "lucide-react"; // Added Brain for Protein, Tangent for Fats
import { MealFormDialog } from "./MealFormDialog";

interface MealCardProps {
  mealType: MealType;
  mealEntry?: MealEntry;
  selectedDate: string; // YYYY-MM-DD
  onSaveMeal: (meal: MealEntry) => void;
  onDeleteMeal: (mealId: string) => void;
}

const mealIcons: Record<MealType, React.ElementType> = {
  Breakfast: Coffee,
  Lunch: Salad,
  Dinner: Drumstick,
  Snack: Cookie,
};

export function MealCard({ mealType, mealEntry, selectedDate, onSaveMeal, onDeleteMeal }: MealCardProps) {
  const Icon = mealIcons[mealType];

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center">
          <Icon className="h-6 w-6 text-muted-foreground mr-3" />
          <CardTitle className="text-xl font-semibold">{mealType}</CardTitle>
        </div>
        {mealEntry && (
           <div className="flex items-center gap-2">
            <MealFormDialog
              mealType={mealType}
              selectedDate={selectedDate}
              existingMeal={mealEntry}
              onSave={onSaveMeal}
              trigger={
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Edit3 className="h-4 w-4" />
                  <span className="sr-only">Edit Meal</span>
                </Button>
              }
            />
             <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => onDeleteMeal(mealEntry.id)}>
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete Meal</span>
             </Button>
           </div>
        )}
      </CardHeader>
      <CardContent>
        {mealEntry ? (
          <div className="space-y-3">
            <h4 className="text-lg font-medium">{mealEntry.name}</h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{mealEntry.category}</Badge>
              {mealEntry.calories && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Flame className="h-3 w-3" /> {mealEntry.calories} kcal
                </Badge>
              )}
              {mealEntry.protein && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Brain className="h-3 w-3" /> {mealEntry.protein}g protein
                </Badge>
              )}
            </div>
            {mealEntry.notes && (
              <p className="text-sm text-muted-foreground italic">Notes: {mealEntry.notes}</p>
            )}
            {mealEntry.sideDishes && (
              <p className="text-sm text-muted-foreground">Sides: {mealEntry.sideDishes}</p>
            )}
            {(mealEntry.prepTime || mealEntry.cookTime) && (
                 <div className="flex items-center text-xs text-muted-foreground gap-1 pt-1">
                    <Clock className="h-3 w-3" />
                    {mealEntry.prepTime && `Prep: ${mealEntry.prepTime}m`}
                    {mealEntry.prepTime && mealEntry.cookTime && `, `}
                    {mealEntry.cookTime && `Cook: ${mealEntry.cookTime}m`}
                 </div>
            )}
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground pt-1">
                {mealEntry.fats !== undefined && <div><Tangent className="inline h-3 w-3 mr-1" />Fats: {mealEntry.fats}g</div>}
                {mealEntry.sugar !== undefined && <div><Grape className="inline h-3 w-3 mr-1" />Sugar: {mealEntry.sugar}g</div>}
            </div>
          </div>
        ) : (
          <MealFormDialog
            mealType={mealType}
            selectedDate={selectedDate}
            onSave={onSaveMeal}
          />
        )}
      </CardContent>
    </Card>
  );
}
