import { CalendarProvider } from "@/components/calendar/contexts/calendar-context";
import { CalendarClientPart } from "./calendar-client-part";

import { CalendarService } from "../data/calendarService";

export async function Calendar() {
  const calendarService = new CalendarService();

  return (
    <CalendarProvider
      events={await calendarService.getEvents()}
      calendars={calendarService.getCalendars()}
      calendarsData={calendarService.getCalendarsData()}
      view="month"
    >
      <CalendarClientPart />
    </CalendarProvider>
  );
}
