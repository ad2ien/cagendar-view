import { useCalendar } from "@/components/calendar/contexts/calendar-context";
import { ICalendar } from "@/components/calendar/interfaces";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import { CheckIcon, Filter, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function CalendarFilter() {
  const { calendars, selectedCalendars, filterEventsBySelectedCalendars, clearFilter } = useCalendar();
  const { t } = useTranslation("", {
    keyPrefix: "calendar.actions",
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  const isCalendarSelected = (calendarId: ICalendar["id"] | "all") => {
    if (selectedCalendars === "all") return true;
    return selectedCalendars.some((c) => c.id === calendarId);
  };

  const getCalendarColor = (calendar: ICalendar) => {
    return calendars.find((c) => c.id === calendar.id)?.color || "#000000";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Toggle variant="outline" className="cursor-pointer w-fit">
          {t("selectCalendar")}
          <Filter className="h-4 w-4" />
        </Toggle>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-50">
        {calendars.map((cal, index) => (
          <DropdownMenuItem
            key={index}
            className="flex items-center gap-2 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              filterEventsBySelectedCalendars(cal.id);
            }}
          >
            <div
              className={`size-3.5 rounded-full bg-${getCalendarColor(cal)}-600 dark:bg-${getCalendarColor(cal)}-700`}
            />
            <div className="flex justify-between items-center w-full">
              <span className="capitalize">{cal.name}</span>
              {isCalendarSelected(cal.id) && (
                <span className="text-blue-500">
                  <CheckIcon className="size-4" />
                </span>
              )}
            </div>
          </DropdownMenuItem>
        ))}
        <Separator className="my-2" />
        <DropdownMenuItem
          disabled={selectedCalendars.length === 0 || selectedCalendars === "all"}
          className="flex gap-2 cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            clearFilter();
          }}
        >
          <RefreshCcw className="size-3.5" />
          {t("showAll")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
