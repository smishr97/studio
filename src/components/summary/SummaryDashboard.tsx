"use client";

import type { MealEntry } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, Brain, Tangent, Grape } from "lucide-react"; // Using Brain for Protein, Tangent for Fats
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

interface SummaryDashboardProps {
  meals: MealEntry[];
  selectedDate: Date;
}

interface NutrientSummary {
  calories: number;
  protein: number;
  fats: number;
  sugar: number;
}

const calculateSummary = (meals: MealEntry[]): NutrientSummary => {
  return meals.reduce(
    (acc, meal) => {
      acc.calories += meal.calories || 0;
      acc.protein += meal.protein || 0;
      acc.fats += meal.fats || 0;
      acc.sugar += meal.sugar || 0;
      return acc;
    },
    { calories: 0, protein: 0, fats: 0, sugar: 0 }
  );
};

const filterMealsByPeriod = (meals: MealEntry[], period: 'day' | 'week' | 'month', date: Date): MealEntry[] => {
  const todayStr = format(date, 'yyyy-MM-dd');
  if (period === 'day') {
    return meals.filter(meal => meal.date === todayStr);
  }
  if (period === 'week') {
    const start = startOfWeek(date, { weekStartsOn: 1 }); // Assuming week starts on Monday
    const end = endOfWeek(date, { weekStartsOn: 1 });
    return meals.filter(meal => {
      const mealDate = meal.date; // date is already yyyy-MM-dd string
      return mealDate >= format(start, 'yyyy-MM-dd') && mealDate <= format(end, 'yyyy-MM-dd');
    });
  }
  if (period === 'month') {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    return meals.filter(meal => {
      const mealDate = meal.date;
      return mealDate >= format(start, 'yyyy-MM-dd') && mealDate <= format(end, 'yyyy-MM-dd');
    });
  }
  return [];
};


const ChartDataKeyMap = {
  calories: { name: "Calories", unit: "kcal", icon: Flame, color: "var(--chart-1)" },
  protein: { name: "Protein", unit: "g", icon: Brain, color: "var(--chart-2)" },
  fats: { name: "Fats", unit: "g", icon: Tangent, color: "var(--chart-3)" },
  sugar: { name: "Sugar", unit: "g", icon: Grape, color: "var(--chart-4)" },
} as const;


export function SummaryDashboard({ meals, selectedDate }: SummaryDashboardProps) {
  
  const dailySummary = calculateSummary(filterMealsByPeriod(meals, 'day', selectedDate));
  const weeklySummary = calculateSummary(filterMealsByPeriod(meals, 'week', selectedDate));
  const monthlySummary = calculateSummary(filterMealsByPeriod(meals, 'month', selectedDate));

  const summaryData = [
    { name: "Daily", ...dailySummary },
    { name: "Weekly Average", calories: weeklySummary.calories / 7, protein: weeklySummary.protein / 7, fats: weeklySummary.fats / 7, sugar: weeklySummary.sugar / 7 },
    { name: "Monthly Average", calories: monthlySummary.calories / 30, protein: monthlySummary.protein / 30, fats: monthlySummary.fats / 30, sugar: monthlySummary.sugar / 30 },
  ];
  
  const renderSummaryCard = (title: string, summary: NutrientSummary, period: string) => (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>Nutrient totals for {period}.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        {Object.entries(ChartDataKeyMap).map(([key, item]) => (
          <div key={key} className="flex items-start space-x-2 p-3 bg-secondary/30 rounded-lg">
            <item.icon className="h-6 w-6 mt-1" style={{color: item.color}} />
            <div>
              <p className="text-xs text-muted-foreground">{item.name}</p>
              <p className="text-lg font-semibold">
                {summary[key as keyof NutrientSummary].toFixed(0)} {item.unit}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  return (
    <Tabs defaultValue="daily" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="daily">Daily</TabsTrigger>
        <TabsTrigger value="weekly">Weekly</TabsTrigger>
        <TabsTrigger value="monthly">Monthly</TabsTrigger>
      </TabsList>
      <TabsContent value="daily">
        {renderSummaryCard(`Daily Summary (${format(selectedDate, "MMM d")})`, dailySummary, `the day of ${format(selectedDate, "MMMM d, yyyy")}`)}
      </TabsContent>
      <TabsContent value="weekly">
        {renderSummaryCard(`Weekly Summary (Week of ${format(startOfWeek(selectedDate, {weekStartsOn:1}), "MMM d")})`, weeklySummary, `the week of ${format(startOfWeek(selectedDate, {weekStartsOn:1}), "MMMM d")}`)}
      </TabsContent>
      <TabsContent value="monthly">
        {renderSummaryCard(`Monthly Summary (${format(selectedDate, "MMMM yyyy")})`, monthlySummary, `the month of ${format(selectedDate, "MMMM yyyy")}`)}
      </TabsContent>

      <Card className="mt-8 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Nutrient Overview Chart</CardTitle>
          <CardDescription>Comparison of daily, weekly average, and monthly average nutrient intake.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={summaryData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)"}}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Legend wrapperStyle={{fontSize: "12px"}} />
              <Bar dataKey="calories" fill="var(--chart-1)" name="Calories (kcal)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="protein" fill="var(--chart-2)" name="Protein (g)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="fats" fill="var(--chart-3)" name="Fats (g)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="sugar" fill="var(--chart-4)" name="Sugar (g)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </Tabs>
  );
}
