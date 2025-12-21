import React, { Suspense } from "react";
import { Calendar } from "@/modules/components/calendar/calendar";
import { CalendarSkeleton } from "@/modules/components/calendar/skeletons/calendar-skeleton";

export default function Home() {
  return (
    <Suspense fallback={<CalendarSkeleton />}>
      <Calendar />
    </Suspense>
  );
}
