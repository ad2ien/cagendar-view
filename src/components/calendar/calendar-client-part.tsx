"use client";

import { CalendarBody } from "@/components/calendar/calendar-body";
import { CalendarHeader } from "@/components/calendar/header/calendar-header";
import { default as i18n, initI18n } from "@/i18n";
import { useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import { CalendarSkeleton } from "./skeletons/calendar-skeleton";
import { ThemeProvider } from "next-themes";

export function CalendarClientPart() {
  const [isI18nLoaded, setIsI18nLoaded] = useState(false);

  useEffect(() => {
    initI18n.then(() => {
      setIsI18nLoaded(true);
    });
  }, []);

  if (!isI18nLoaded) {
    return <CalendarSkeleton />;
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <I18nextProvider i18n={i18n}>
        <div className="w-full border rounded-xl">
          <CalendarHeader />
          <CalendarBody />
        </div>
      </I18nextProvider>
    </ThemeProvider>
  );
}
