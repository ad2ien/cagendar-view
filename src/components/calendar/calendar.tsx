import { CalendarProvider } from "@/components/calendar/contexts/calendar-context";
import {
    getCalendars,
    getCalendarsData,
    getEvents,
} from "@/components/data/requests";
import { CalendarClientPart } from "./calendar-client-part";

async function getCalendarData() {
  return {
    events: await getEvents(),
    calendars: getCalendars(),
    calendarsData: getCalendarsData(),
  };
}

export async function Calendar() {
  const { events, calendars, calendarsData } = await getCalendarData();

  return (
    <CalendarProvider
      events={events}
      calendars={calendars}
      calendarsData={calendarsData}
      view="month"
    >
      <CalendarClientPart />
    </CalendarProvider>
  );
}
