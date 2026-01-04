import { generateId } from "@/lib/utils";
import { addDays } from "date-fns";
import { convertIcsCalendar, IcsEvent, type IcsCalendar } from "ts-ics";
import { durationInDays, htmlToText, isZeroTime, safeTruncate } from "../calendar/helpers";
import { CalendarAdapter, MAX_DESCRIPTION_LENGTH } from "./calendar-adapter";
import { IEvent, TCalData } from "./interfaces";

export class IcsAdapter extends CalendarAdapter {
  public async fetchEvents(calData: TCalData): Promise<IEvent[]> {
    try {
      const response = await fetch(calData.config.url, {
        next: {
          revalidate: this.revalidateIntervalMinutes * 60,
          tags: [`calendar-${calData.calendar.id}`],
        },
      }).then((response) => response.text());
      const calendar: IcsCalendar = convertIcsCalendar(undefined, response);
      return icsCalendarsToEvents(calendar.events!, calData);
    } catch (error) {
      console.error("Error fetching events:", error);
      return [];
    }
  }
}

function icsCalendarsToEvents(events: IcsEvent[], calData: TCalData): IEvent[] {
  return events.map((e) => icsCalendarToEvent(e, calData)).filter((v) => v !== undefined);
}

function icsCalendarToEvent(event: IcsEvent, calData: TCalData): IEvent | undefined {
  if (!event.end || !event.start) {
    return undefined;
  }
  let endDate = event.end?.date;
  let wholeDay = false;
  if (isZeroTime(event.end?.date) && isZeroTime(event.start?.date)) {
    // if 24h, set end time to the same day
    const numberOfDays = durationInDays(event.start.date, event.end.date);
    endDate = addDays(event.start.date, numberOfDays - 1);
    endDate.setHours(23, 59, 59);
    wholeDay = true;
  }

  return {
    id: generateId(),
    startDate: event.start?.date,
    endDate: endDate || "",
    description: safeTruncate(htmlToText(event.description || ""), MAX_DESCRIPTION_LENGTH) || "",
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
