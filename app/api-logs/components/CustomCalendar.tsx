"use client";

import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { Calendar as DatePicker } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { type DateRange } from "react-day-picker";

interface CalendarRangeProps {
  selected?: DateRange;
  onSelect: (range: DateRange | undefined) => void;
  onResetFilters?: () => void;
}

export default function CustomCalendar({
  selected,
  onSelect,
  onResetFilters,
}: CalendarRangeProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-lg border-[#E0E0E0] bg-white"
        >
          <CalendarIcon className="h-5 w-5 text-[#666666]" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-4 z-50 bg-white shadow-lg rounded-lg"
        side="bottom"
        align="end"
        sideOffset={4}
      >
        <DatePicker
          mode="range"
          selected={selected}
          onSelect={(range: DateRange | undefined) => {
            onSelect(range);
          }}
          numberOfMonths={2}
          disabled={(date) => date > new Date()}
          classNames={{
            day_today: "border border-[#FFB020]",
            day_selected: "bg-[#F0F0F0] text-black",
            day_outside: "text-gray-400",
          }}
        />
        <Button
          variant="ghost"
          className="w-full text-center text-xs text-[#999] hover:bg-[#F5F5F5] transition mt-2"
          onClick={() => {
            onSelect(undefined);
            onResetFilters?.();
            setOpen(false);
          }}
        >
          전체 날짜 보기
        </Button>
      </PopoverContent>
    </Popover>
  );
}
