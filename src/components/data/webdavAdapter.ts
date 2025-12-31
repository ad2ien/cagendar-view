import { generateId } from "@/lib/utils";
import { addDays } from "date-fns";
import { unstable_cache } from "next/cache";
import { CalDAVClient, Event } from "ts-caldav";
import { durationInDays, isZeroTime } from "../calendar/helpers";
import {
    CalendarType,
    ICalendar,
    IWebDavCalendar,
} from "../config/dataSettings";
import { CalendarAdapter, REVALIDATE_SECONDS } from "./calendarAdapter";
import { IEvent, TCalData } from "./interfaces";

export function isWebDavCalendar(config: ICalendar): config is IWebDavCalendar {
  return (
    config.type === CalendarType.WEBDAV &&
    "calendarPath" in config &&
    "username" in config &&
    "password" in config
  );
}

export class WebDavAdapter extends CalendarAdapter {
  public async fetchEvents(calData: TCalData): Promise<IEvent[]> {
    if (!isWebDavCalendar(calData.config)) {
      throw new Error("Should be webdav config : " + calData.config.name);
    }
    const wdConfig: IWebDavCalendar = calData.config;

    const cachedFetchEvents = unstable_cache(
      async (wdConfig: IWebDavCalendar): Promise<Event[]> => {
        const client = await CalDAVClient.create({
          baseUrl: wdConfig.url.toString(),
          auth: {
            type: "basic",
            username: wdConfig.username,
            password: wdConfig.password,
          },
        });

        try {
          return await client.getEvents(wdConfig.calendarPath, {
            all: true,
          });
        } catch (error) {
          console.error(error);
          return [];
        }
      },
      [`calendar-${calData.calendar.id}`],
      { revalidate: REVALIDATE_SECONDS },
    );
    const events = await cachedFetchEvents(wdConfig);
    return icsCalendarsToEvents(events, calData);
  }
}

function icsCalendarsToEvents(events: Event[], calData: TCalData): IEvent[] {
  return events.map((e) => webdavCalendarToEvent(e, calData));
}

function webdavCalendarToEvent(event: Event, calData: TCalData): IEvent {
  // not sure why we need the following but we do
  let endDate: Date = new Date(event.end);
  const startDate: Date = new Date(event.start);

  if (event.wholeDay || (isZeroTime(endDate) && isZeroTime(startDate))) {
    // if 24h, set end time to the same day
    const numberOfDays = durationInDays(startDate, endDate);
    endDate = addDays(startDate, numberOfDays - 1);
    endDate.setHours(23, 59, 59);
  }

  return {
    id: generateId(),
    startDate: startDate,
    endDate: endDate || "",
    description: event.description || "",
    title: event.summary || "",
    color: calData.color,
    calendar: {
      id: calData.calendar.id,
      name: calData.calendar.name,
      picturePath: "",
    },
    wholeDay: event.wholeDay ? event.wholeDay! : false,
  };
}
