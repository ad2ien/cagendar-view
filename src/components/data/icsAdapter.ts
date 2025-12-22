import { convertIcsCalendar, IcsEvent, type IcsCalendar } from "ts-ics";
import { IEvent } from "./interfaces";
import { generateId } from "@/lib/utils";

export async function getIcsEvents(url: URL) {
  const response = await fetch(url).then((response) => response.text());
  const calendar: IcsCalendar = convertIcsCalendar(undefined, response);

  if (calendar.events){
    // return icsCalendarsToEvents(calendar.events.slice(calendar.events.length-10, calendar.events.length-1));
    return icsCalendarsToEvents(calendar.events);
  }
  return [];
}

function icsCalendarsToEvents(events: IcsEvent[]): IEvent[]{
  return events.map(icsCalendarToEvent);
}

function icsCalendarToEvent(event: IcsEvent): IEvent {
  return {
    id: generateId(),
    startDate: event.start?.date.toISOString(),
    endDate: event.end?.date.toISOString() || "",
    description: event.description || "",
    title: event.summary || "",
    color: "blue",
    user: {
     	id: "1",
     	name: "marc",
      picturePath: ""
    }
  };
}
