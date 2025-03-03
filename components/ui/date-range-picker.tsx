"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "../../lib/utils";
import { Button } from "./button";
import { Calendar } from "./calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover";

interface DateRangePickerProps {
  className?: string;
  value?: DateRange;
  onChange?: (date: DateRange | undefined) => void;
  placeholder?: string;
  locale?: any;
}

export function DateRangePicker({
  className,
  value,
  onChange,
  placeholder = "日付範囲を選択",
  locale,
}: DateRangePickerProps) {
  
  const handleSelect = (range: DateRange | undefined) => {
    onChange?.(range);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value?.from ? (
              value.to ? (
                <>
                  {format(value.from, "yyyy/MM/dd", { locale })} -{" "}
                  {format(value.to, "yyyy/MM/dd", { locale })}
                </>
              ) : (
                format(value.from, "yyyy/MM/dd", { locale })
              )
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={value?.from ? value.from : new Date()}
            selected={value}
            onSelect={handleSelect}
            numberOfMonths={2}
            locale={locale}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
