import { CalendarProvider } from "@/components/calendar/contexts/calendar-context";
import { CalendarClientPart } from "./calendar-client-part";

import { CalendarService } from "../../server/data/calendar-service";

export async function Calendar() {
  const calendarService = new CalendarService();

  return (
    <CalendarProvider
      events={await calendarService.getEvents()}
      calendars={calendarService.getCalendars()}
      view="month"
    >
      <CalendarClientPart />
    </CalendarProvider>
  );
}
