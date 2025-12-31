import { buttonHover, transition } from "@/components/calendar/animations";
import { useCalendar } from "@/components/calendar/contexts/calendar-context";
import { Button } from "@/components/ui/button";
import { formatDate } from "date-fns";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

import { getLocale, navigateDate, rangeText } from "@/components/calendar/helpers";

import type { TCalendarView } from "@/components/calendar/types";

interface IProps {
  view: TCalendarView;
}

const MotionButton = motion.create(Button);

export function DateNavigator({ view }: IProps) {
  const { selectedDate, setSelectedDate } = useCalendar();


  const month = formatDate(selectedDate, "MMMM", { locale: getLocale() });
  const year = selectedDate.getFullYear();

  const handlePrevious = () =>
    setSelectedDate(navigateDate(selectedDate, view, "previous"));
  const handleNext = () =>
    setSelectedDate(navigateDate(selectedDate, view, "next"));

  const [dateRangeText, setDateRangeText] = useState("");
  useEffect(() => {
    setDateRangeText(rangeText(view, selectedDate));
  }, [view, selectedDate]);

  return (
    <div className="space-y-0.5">
      <div className="flex items-center gap-2">
        <motion.span
          className="text-lg font-semibold text-primary"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={transition}
        >
          {month} {year}
        </motion.span>
      </div>

      <div className="flex items-center gap-2">
        <MotionButton
          variant="outline"
          size="icon"
          className="h-6 w-6"
          onClick={handlePrevious}
          variants={buttonHover}
          whileHover="hover"
          whileTap="tap"
        >
          <ChevronLeft className="h-4 w-4" />
        </MotionButton>

        <motion.p
          className="text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={transition}
        >
          {dateRangeText}
        </motion.p>

        <MotionButton
          variant="outline"
          size="icon"
          className="h-6 w-6"
          onClick={handleNext}
          variants={buttonHover}
          whileHover="hover"
          whileTap="tap"
        >
          <ChevronRight className="h-4 w-4" />
        </MotionButton>
      </div>
    </div>
  );
}
