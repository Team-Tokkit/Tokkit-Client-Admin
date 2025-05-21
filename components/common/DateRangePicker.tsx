import Calendar, { CalendarProps } from "react-calendar";
import { cn } from "@/lib/utils";

type CalendarValue = Date | [Date, Date] | null;

export default function DateRangePicker({
  value,
  onChange,
}: {
  value: CalendarValue;
  onChange: CalendarProps["onChange"];
}) {
  return (
    <div className="rounded-md bg-white p-2 shadow-md">
      <Calendar
        onChange={onChange}
        value={value}
        selectRange
        calendarType="gregory"
        locale="ko-KR"
        next2Label={null}
        prev2Label={null}
        maxDate={new Date()}
        tileDisabled={({ date }) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return date > today;
        }}
        formatShortWeekday={(locale, date) =>
          ["일", "월", "화", "수", "목", "금", "토"][date.getDay()]
        }
        formatMonthYear={(locale, date) =>
          `${date.getFullYear()}. ${date.getMonth() + 1}`
        }
        formatDay={(locale, date) => String(date.getDate())}
        tileClassName={({ date, view }) => {
          const now = new Date();
          const isToday =
            date.getDate() === now.getDate() &&
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear();

          return cn(
            "text-sm text-center py-1 rounded hover:bg-blue-100 transition",
            isToday && "bg-blue-100 font-semibold",
            view === "month" && "cursor-pointer"
          );
        }}
        className="w-full text-sm"
      />
    </div>
  );
}
