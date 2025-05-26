"use client"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DatePickerWithRangeProps {
  className?: string
  date: DateRange | undefined
  setDate: (date: DateRange) => void
}

export function DatePickerWithRange({ className, date, setDate }: DatePickerWithRangeProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "yyyy년 MM월 dd일", { locale: ko })} -{" "}
                  {format(date.to, "yyyy년 MM월 dd일", { locale: ko })}
                </>
              ) : (
                format(date.from, "yyyy년 MM월 dd일", { locale: ko })
              )
            ) : (
              <span>유효기간을 선택하세요</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3 border-b">
            <h4 className="font-medium text-sm">유효기간 선택</h4>
            <p className="text-xs text-muted-foreground mt-1">시작일과 종료일을 선택하세요</p>
          </div>
          <div className="p-3">
            <DayPicker
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={1}
              locale={ko}
              showOutsideDays={true}
              className="custom-calendar"
              classNames={{
                months: "flex flex-col",
                month: "space-y-4",
                caption: "flex justify-between pt-1 relative items-center",
                caption_label: "text-sm font-medium",
                nav: "flex items-center gap-1",
                nav_button: "h-7 w-7 bg-transparent p-0 hover:bg-gray-100 rounded-md",
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse",
                head_row: "flex w-full",
                head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] text-center",
                row: "flex w-full mt-2",
                cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-md",
                day_selected:
                  "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground",
                day_outside: "text-muted-foreground opacity-50",
                day_disabled: "text-muted-foreground opacity-50",
                day_range_middle: "aria-selected:bg-blue-100 aria-selected:text-blue-900",
                day_range_start: "aria-selected:bg-blue-500 aria-selected:text-white rounded-l-md",
                day_range_end: "aria-selected:bg-blue-700 aria-selected:text-white rounded-r-md",
                day_hidden: "invisible",
              }}
              components={{
                IconLeft: () => <ChevronLeft className="h-4 w-4" />,
                IconRight: () => <ChevronRight className="h-4 w-4" />,
              }}
            />
          </div>
          <div className="p-3 border-t flex justify-between items-center">
            <div className="text-xs text-muted-foreground">
              {date?.from && date?.to && (
                <span>{Math.ceil((date.to.getTime() - date.from.getTime()) / (1000 * 60 * 60 * 24))}일간 유효</span>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setDate({ from: undefined, to: undefined })}>
                초기화
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
