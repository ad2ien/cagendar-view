import { generateId } from "@/lib/utils";
import { convertIcsCalendar, IcsEvent, type IcsCalendar } from "ts-ics";
import { durationInDays, isZeroTime } from "../calendar/helpers";
import { IEvent } from "./interfaces";
import { TCalData } from "./requests";
import { addDays } from "date-fns";

export async function getIcsEvents(calData: TCalData) {
  const response = await fetch(calData.config.url).then((response) =>
    response.text(),
  );
  const calendar: IcsCalendar = convertIcsCalendar(undefined, response);
  return icsCalendarsToEvents(calendar.events!, calData);
}

function icsCalendarsToEvents(events: IcsEvent[], calData: TCalData): IEvent[] {
  return events
    .map((e) => icsCalendarToEvent(e, calData))
    .filter((v) => v !== undefined);
}

function icsCalendarToEvent(
  event: IcsEvent,
  calData: TCalData,
): IEvent | undefined {
  if (!event.end || !event.start) {
    return undefined;
  }
  let endDate = event.end?.date;
  let wholeDay = false;
  if (isZeroTime(event.end?.date) && isZeroTime(event.start?.date)) {
    // if 24h, set end time to the same day
    const numberOfDays = durationInDays(event.start.date, event.end.date);
    endDate = addDays(event.start.date,  numberOfDays - 1 );
    endDate.setHours(23, 59, 59);
    wholeDay = true;
  }

  return {
    id: generateId(),
    startDate: event.start?.date.toISOString(),
    endDate: endDate.toISOString() || "",
    description: event.description || "",
    title: event.summary || "",
    color: calData.color,
    calendar: {
      id: calData.calendar.id,
      name: calData.calendar.name,
      picturePath: "",
    },
    wholeDay: wholeDay,
  };
}
