"use client";

import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";

interface CalendarViewProps {
  selectedDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  disabledDates?: (date: Date) => boolean;
}

export function CalendarView({ selectedDate, onDateChange, disabledDates }: CalendarViewProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-xl">
          <CalendarDays className="mr-2 h-6 w-6 text-primary" />
          Select Date
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateChange}
          disabled={disabledDates}
          className="rounded-md p-0"
          initialFocus
        />
      </CardContent>
    </Card>
  );
}
