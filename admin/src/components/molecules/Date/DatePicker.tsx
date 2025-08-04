"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState, useEffect } from "react";
import { getLocalDateTimeValue } from "@/lib/utils";

interface DatePickerProps {
  value?: Date;
  onChange: (value: Date) => void;
}
const localValue = getLocalDateTimeValue();
const hoursAndMinute = localValue.split("T")[1]

export function DatePicker({ onChange, value }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(value);
  const [time, setTime] = useState<string>(`${hoursAndMinute}:00`);

  useEffect(() => {
    if (time && date) {
      const [hours, minutes, seconds] = time.split(":").map(Number);
      const combined = new Date(date);
      combined.setHours(hours);
      combined.setMinutes(minutes);
      combined.setSeconds(seconds);

      onChange(combined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time, date]);

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-3">
        <Label htmlFor="date-picker" className="px-1">
          Date
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker"
              className="w-32 justify-between font-normal"
            >
              {date ? date.toLocaleDateString() : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={(date) => {
                if (!date) return;
                setDate(date);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col gap-3">
        <Label htmlFor="time-picker" className="px-1">
          Time
        </Label>
        <Input
          type="time"
          id="time-picker"
          step="1"
          onChange={(e) => setTime(e.target.value)}
          defaultValue={time}
          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </div>
    </div>
  );
}
