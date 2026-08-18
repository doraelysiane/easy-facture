"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"

interface DatePickerWithRangeProps {
  className?: string
  initialDate?: DateRange
}

export function DatePickerWithRange({ className, initialDate }: DatePickerWithRangeProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(initialDate)
  const [isOpen, setIsOpen] = React.useState(false)

  // This is a simple popover fallback using relative/absolute
  return (
    <div className={cn("relative grid gap-2", className)}>
      <Button
        id="date"
        variant={"outline"}
        className={cn(
          "w-[300px] justify-start text-left font-normal bg-white",
          !date && "text-muted-foreground"
        )}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {date?.from ? (
          date.to ? (
            <>
              {format(date.from, "dd LLL yyyy", { locale: fr })} -{" "}
              {format(date.to, "dd LLL yyyy", { locale: fr })}
            </>
          ) : (
            format(date.from, "dd LLL yyyy", { locale: fr })
          )
        ) : (
          <span>Sélectionner une période</span>
        )}
      </Button>
      {isOpen && (
         <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
            <div className="absolute top-12 left-0 z-50 rounded-md border bg-popover text-popover-foreground shadow-md outline-none bg-white">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
                locale={fr}
              />
            </div>
         </>
      )}
      
      {/* Hidden inputs to pass data to server action/form if needed */}
      <input type="hidden" name="startDate" value={date?.from ? date.from.toISOString() : ''} />
      <input type="hidden" name="endDate" value={date?.to ? date.to.toISOString() : ''} />
    </div>
  )
}
