export const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snack"] as const;
export type MealType = typeof mealTypes[number];

export const mealCategories = [
  "General",
  "Vegetarian",
  "Vegan",
  "High Protein",
  "Low Carb",
  "Homemade",
  "Restaurant",
  "Fast Food",
  "Dessert",
  "Beverage",
  "Other"
] as const;
export type MealCategory = typeof mealCategories[number];

export interface MealEntry {
  id: string;
  date: string; // YYYY-MM-DD
  type: MealType;
  name: string;
  category: MealCategory;
  notes?: string;
  sideDishes?: string;
  prepTime?: number; // in minutes
  cookTime?: number; // in minutes
  calories?: number;
  protein?: number; // in grams
  fats?: number; // in grams
  sugar?: number; // in grams
}
