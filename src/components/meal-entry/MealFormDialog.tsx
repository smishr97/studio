"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { MealEntry, MealType, MealCategory } from "@/lib/types";
import { mealCategories } from "@/lib/types";
import { PlusCircle, Edit3 } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(2, { message: "Meal name must be at least 2 characters." }),
  category: z.enum(mealCategories),
  notes: z.string().optional(),
  sideDishes: z.string().optional(),
  prepTime: z.coerce.number().int().min(0).optional(),
  cookTime: z.coerce.number().int().min(0).optional(),
  calories: z.coerce.number().min(0).optional(),
  protein: z.coerce.number().min(0).optional(),
  fats: z.coerce.number().min(0).optional(),
  sugar: z.coerce.number().min(0).optional(),
});

type MealFormValues = z.infer<typeof formSchema>;

interface MealFormDialogProps {
  mealType: MealType;
  selectedDate: string; // YYYY-MM-DD
  existingMeal?: MealEntry;
  onSave: (mealEntry: MealEntry) => void;
  trigger?: ReactNode;
}

export function MealFormDialog({
  mealType,
  selectedDate,
  existingMeal,
  onSave,
  trigger,
}: MealFormDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<MealFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: existingMeal
      ? {
          name: existingMeal.name,
          category: existingMeal.category,
          notes: existingMeal.notes || "",
          sideDishes: existingMeal.sideDishes || "",
          prepTime: existingMeal.prepTime || undefined,
          cookTime: existingMeal.cookTime || undefined,
          calories: existingMeal.calories || undefined,
          protein: existingMeal.protein || undefined,
          fats: existingMeal.fats || undefined,
          sugar: existingMeal.sugar || undefined,
        }
      : {
          name: "",
          category: "General",
          notes: "",
          sideDishes: "",
        },
  });

  function onSubmit(values: MealFormValues) {
    const mealEntry: MealEntry = {
      id: existingMeal?.id || crypto.randomUUID(),
      date: selectedDate,
      type: mealType,
      ...values,
    };
    onSave(mealEntry);
    setIsOpen(false);
    form.reset( existingMeal ? values : { name: "", category: "General", notes: "", sideDishes: "" }); // Reset form after submission
  }

  const defaultTrigger = existingMeal ? (
    <Button variant="outline" size="sm" className="flex items-center gap-1">
      <Edit3 className="h-4 w-4" /> Edit
    </Button>
  ) : (
    <Button variant="ghost" className="w-full justify-start text-left flex items-center gap-2 text-muted-foreground hover:text-accent-foreground hover:bg-accent/50">
      <PlusCircle className="h-5 w-5" /> Add {mealType}
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[480px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{existingMeal ? "Edit" : "Add"} {mealType}</DialogTitle>
          <DialogDescription>
            Log your {mealType.toLowerCase()} for {selectedDate}. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meal Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Chicken Salad" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mealCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="calories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Calories (kcal)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 350" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="protein"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Protein (g)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 30" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Extra spicy, homemade dressing" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sideDishes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Side Dishes</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Steamed broccoli, quinoa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <h3 className="text-lg font-medium pt-2 border-t mt-4">Time & Advanced Macros (Optional)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="prepTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prep Time (min)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cookTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cook Time (min)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 20" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="fats"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fats (g)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 15" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sugar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sugar (g)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" variant="default">
                {existingMeal ? "Save Changes" : "Add Meal"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
