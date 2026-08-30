"use client";

import { useState } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isBefore, startOfDay } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookingCalendarProps {
  selectedStart: Date | null;
  selectedEnd: Date | null;
  onSelectStart: (date: Date) => void;
  onSelectEnd: (date: Date) => void;
}

export default function BookingCalendar({ selectedStart, selectedEnd, onSelectStart, onSelectEnd }: BookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = startOfDay(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const isInRange = (day: Date) => {
    if (!selectedStart || !selectedEnd) return false;
    return day >= selectedStart && day <= selectedEnd;
  };

  const handleDateClick = (day: Date) => {
    if (isBefore(day, today)) return;

    if (!selectedStart || (selectedStart && selectedEnd)) {
      onSelectStart(day);
      onSelectEnd(day);
    } else if (selectedStart && !selectedEnd) {
      if (day < selectedStart) {
        onSelectStart(day);
      } else {
        onSelectEnd(day);
      }
    }
  };

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="bg-white rounded-2xl border border-secondary-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-semibold text-secondary-900">
          {format(currentMonth, "MMMM yyyy")}
        </h3>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-secondary-400 py-2">
            {day}
          </div>
        ))}
        {days.map((day, index) => {
          const isSelected = Boolean(
            (selectedStart && isSameDay(day, selectedStart)) ||
            (selectedEnd && isSameDay(day, selectedEnd))
          );
          const isRange = isInRange(day);
          const isPast = isBefore(day, today);
          const isCurrentMonth = isSameMonth(day, currentMonth);

          return (
            <button
              key={index}
              onClick={() => handleDateClick(day)}
              disabled={isPast}
              className={cn(
                "aspect-square flex items-center justify-center text-sm rounded-lg transition-all",
                !isCurrentMonth && "text-secondary-300",
                isPast && "text-secondary-300 cursor-not-allowed",
                isSelected && "bg-primary-600 text-white font-semibold shadow-lg shadow-primary-200",
                isRange && !isSelected && "bg-primary-50 text-primary-700",
                !isSelected && !isRange && !isPast && isCurrentMonth && "hover:bg-secondary-100 text-secondary-700"
              )}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-4 text-xs text-secondary-500">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-primary-600" />
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-primary-50" />
          <span>Range</span>
        </div>
      </div>
    </div>
  );
}
