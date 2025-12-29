"use client";

import { isSameDay, parseISO } from "date-fns";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { fadeIn, transition } from "@/components/calendar/animations";
import { useCalendar } from "@/components/calendar/contexts/calendar-context";
import { AgendaEvents } from "@/components/calendar/views/agenda-view/agenda-events";
import { CalendarMonthView } from "@/components/calendar/views/month-view/calendar-month-view";
import { CalendarDayView } from "@/components/calendar/views/week-and-day-view/calendar-day-view";
import { CalendarWeekView } from "@/components/calendar/views/week-and-day-view/calendar-week-view";
import { CalendarYearView } from "@/components/calendar/views/year-view/calendar-year-view";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n";

export function CalendarBody() {
  const { view, events } = useCalendar();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  const singleDayEvents = events.filter((event) => {
    const startDate = parseISO(event.startDate);
    const endDate = parseISO(event.endDate);
    return isSameDay(endDate, startDate);
  });

  const multiDayEvents = events.filter((event) => {
    const startDate = parseISO(event.startDate);
    const endDate = parseISO(event.endDate);
    return !isSameDay(endDate, startDate);
  });

  return (
    <I18nextProvider i18n={i18n}>
      <div className="w-full h-full overflow-scroll relative">
        <motion.div
          key={view}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={fadeIn}
          transition={transition}
        >
          {view === "month" && (
            <CalendarMonthView
              singleDayEvents={singleDayEvents}
              multiDayEvents={multiDayEvents}
            />
          )}
          {view === "week" && (
            <CalendarWeekView
              singleDayEvents={singleDayEvents}
              multiDayEvents={multiDayEvents}
            />
          )}
          {view === "day" && (
            <CalendarDayView
              singleDayEvents={singleDayEvents}
              multiDayEvents={multiDayEvents}
            />
          )}
          {view === "year" && (
            <CalendarYearView
              singleDayEvents={singleDayEvents}
              multiDayEvents={multiDayEvents}
            />
          )}
          {view === "agenda" && (
            <motion.div
              key="agenda"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={fadeIn}
              transition={transition}
            >
              <AgendaEvents />
            </motion.div>
          )}
        </motion.div>
      </div>
    </I18nextProvider>
  );
}
