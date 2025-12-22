import { generateId } from "@/lib/utils";
import { convertIcsCalendar, IcsEvent, type IcsCalendar } from "ts-ics";
import { IEvent } from "./interfaces";
import { TCalData } from "./requests";

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
  return events.map((e) => icsCalendarToEvent(e, calData));
}

function icsCalendarToEvent(
  event: IcsEvent,
  calData: TCalData,
): IEvent {
  // console.log("\n--- " +event.summary);
  // console.log(event.start);
  // console.log("  ISOString : " + event.start?.date.toISOString());
  // console.log(event.end);
  // console.log("  ISOString : " + event.end?.date.toISOString());
  return {
    id: generateId(),
    startDate: event.start?.date.toISOString(),
    endDate: event.end?.date.toISOString() || "",
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
