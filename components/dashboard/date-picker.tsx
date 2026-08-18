"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"

interface DatePickerProps {
  className?: string
  date?: Date
  setDate?: (date: Date | undefined) => void
  placeholder?: string
  name?: string
  align?: "start" | "end"
}

export function DatePicker({ className, date, setDate, placeholder = "Sélectionner une date", name, align = "start" }: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className={cn("relative", className)}>
      <Button
        variant={"outline"}
        className={cn(
          "w-[140px] justify-start text-left font-normal bg-white h-9 px-3",
          !date && "text-muted-foreground"
        )}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {date ? format(date, "dd LLL yyyy", { locale: fr }) : <span>{placeholder}</span>}
      </Button>
      {name && <input type="hidden" name={name} value={date ? format(date, 'yyyy-MM-dd') : ''} />}
      {isOpen && (
         <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
            <div className={cn(
              "absolute top-10 z-50 rounded-md border bg-popover text-popover-foreground shadow-md outline-none bg-white",
              align === "end" ? "right-0" : "left-0"
            )}>
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => {
                  setDate?.(d)
                  setIsOpen(false)
                }}
                initialFocus
                disabled={{ after: new Date() }}
                locale={fr}
              />
            </div>
         </>
      )}
    </div>
  )
}
