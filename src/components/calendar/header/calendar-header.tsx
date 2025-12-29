"use client";

import { motion } from "framer-motion";

import {
  slideFromLeft,
  slideFromRight,
  transition,
} from "@/components/calendar/animations";
import { useCalendar } from "@/components/calendar/contexts/calendar-context";
import { DateNavigator } from "@/components/calendar/header/date-navigator";
import { TodayButton } from "@/components/calendar/header/today-button";
import { Settings } from "@/components/calendar/settings/settings";
import CalendarFilter from "./calendar-filter";
import Views from "./view-tabs";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n";

export function CalendarHeader() {
  const { view } = useCalendar();

  return (
    <I18nextProvider i18n={i18n}>
      <div className="flex flex-col gap-4 border-b p-4 lg:flex-row lg:items-center lg:justify-between">
        <motion.div
          className="flex items-center gap-3"
          variants={slideFromLeft}
          initial="initial"
          animate="animate"
          transition={transition}
        >
          <TodayButton />
          <DateNavigator view={view} />
        </motion.div>

        <motion.div
          className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-1.5"
          variants={slideFromRight}
          initial="initial"
          animate="animate"
          transition={transition}
        >
          <div className="options flex-wrap flex items-center gap-4 md:gap-2">
            <CalendarFilter />
            <Views />
          </div>
          <Settings />
        </motion.div>
      </div>
    </I18nextProvider>
  );
}
