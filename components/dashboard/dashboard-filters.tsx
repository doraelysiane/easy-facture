"use client"

import { useState } from "react"
import { DatePicker } from "@/components/dashboard/date-picker"
import { Button } from "@/components/ui/button"

export function DashboardFilters({ initialStart, initialEnd }: { initialStart?: string, initialEnd?: string }) {
  const [startDate, setStartDate] = useState<Date | undefined>(initialStart ? new Date(initialStart) : undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(initialEnd ? new Date(initialEnd) : undefined);

  return (
    <form className="flex items-center gap-4 bg-white p-2 rounded-lg border shadow-sm">
       <div className="flex items-center gap-2">
         <label className="text-sm font-medium text-muted-foreground ml-2">Du</label>
         <DatePicker date={startDate} setDate={setStartDate} name="startDate" placeholder="Date début" />
       </div>
       <div className="flex items-center gap-2">
         <label className="text-sm font-medium text-muted-foreground">Au</label>
         <DatePicker date={endDate} setDate={setEndDate} name="endDate" placeholder="Date fin" align="end" />
       </div>
       <Button type="submit" size="sm" variant="default" className="h-9 px-4">Filtrer</Button>
    </form>
  )
}
