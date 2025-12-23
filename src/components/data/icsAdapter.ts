import { generateId } from "@/lib/utils";
import { convertIcsCalendar, IcsEvent, type IcsCalendar } from "ts-ics";
import { IEvent } from "./interfaces";
import { TCalData } from "./requests";
import { isZeroTime } from "../calendar/helpers";

export async function getIcsEvents(calData: TCalData) {
  const response = await fetch(calData.config.url).then((response) => response.text());
  const calendar: IcsCalendar = convertIcsCalendar(undefined, response);

  // if (calendar.events) {
  //   return icsCalendarsToEvents(
  //     calendar.events.slice(
  //       calendar.events.length - 10,
  //       calendar.events.length - 1,
  //     ),
  //     calData
  //   );
    return icsCalendarsToEvents(calendar.events!, calData);
}

function icsCalendarsToEvents(
  events: IcsEvent[],
  calData: TCalData,
): IEvent[] {
  return events.map((e) => icsCalendarToEvent(e, calData)).filter( v => v !== undefined);
}

function icsCalendarToEvent(
  event: IcsEvent,
  calData: TCalData,
): IEvent | undefined {
  if(!event.end || !event.start){
    return undefined
  }
  const endDate = event.end?.date;
  if (isZeroTime(event.end?.date) && isZeroTime(event.start?.date)) {
    endDate.setHours(endDate.getHours() - 2);
  }
  return {
    id: generateId(),
    startDate: event.start?.date.toISOString(),
    endDate: endDate.toISOString() || "",
    description: event.description || "",
    title: event.summary || "",
    color: calData.color,
    user: {
      id: calData.user.id,
      name: calData.user.name,
      picturePath: "",
    },
  };
}
