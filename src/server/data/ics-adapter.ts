import { generateId } from "@/server/utils";
import { addDays } from "date-fns";
import { convertIcsCalendar, IcsEvent, type IcsCalendar } from "ts-ics";
import { CalendarAdapter, MAX_DESCRIPTION_LENGTH } from "./calendar-adapter";
import { TCalendarSetupData } from "./data-settings";
import logger from "@/server/logger";
import { IEvent } from "@/lib/interfaces";
import { durationInDays, htmlToText, isZeroTime, safeTruncate } from "@/components/calendar/helpers";

export class IcsAdapter extends CalendarAdapter {
  public async fetchEvents(calData: TCalendarSetupData): Promise<IEvent[]> {
    try {
      const response = await fetch(calData.serverConfig.url, {
        next: {
          revalidate: this.revalidateIntervalMinutes * 60,
          tags: [`calendar-${calData.clientConfig.id}`],
        },
      }).then((response) => response.text());
      const calendar: IcsCalendar = convertIcsCalendar(undefined, response);
      return icsCalendarsToEvents(calendar.events!, calData);
    } catch (error) {
      logger.error(error, "Error fetching events:");
      return [];
    }
  }
}

function icsCalendarsToEvents(events: IcsEvent[], calData: TCalendarSetupData): IEvent[] {
  return events.map((e) => icsCalendarToEvent(e, calData)).filter((v) => v !== undefined);
}

function icsCalendarToEvent(event: IcsEvent, calData: TCalendarSetupData): IEvent | undefined {
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
    color: calData.clientConfig.color,
    calendar: {
      id: calData.clientConfig.id,
      color: calData.clientConfig.color,
      name: calData.clientConfig.name,
      picturePath: calData.clientConfig.picturePath || "",
    },
    wholeDay: wholeDay,
  };
}
