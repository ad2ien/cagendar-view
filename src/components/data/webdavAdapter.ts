import { generateId } from "@/lib/utils";
import { addDays } from "date-fns";
import { CalDAVClient, Event } from "ts-caldav";
import { durationInDays, isZeroTime } from "../calendar/helpers";
import {
    CalendarType,
    ICalendar,
    IWebDavCalendar,
} from "../config/dataSettings";
import { IEvent } from "./interfaces";
import { TCalData } from "./requests";

export function isWebDavCalendar(config: ICalendar): config is IWebDavCalendar {
  return (
    config.type === CalendarType.WEBDAV &&
    "calendarPath" in config &&
    "username" in config &&
    "password" in config
  );
}

export async function getWebdavEvents(calData: TCalData) {
  if (!isWebDavCalendar(calData.config)) {
    throw new Error("Should be web dav config : " + calData.config.name);
  }
  const wdConfig: IWebDavCalendar = calData.config;
  const client = await CalDAVClient.create({
    baseUrl: wdConfig.url.toString(),
    auth: {
      type: "basic",
      username: wdConfig.username,
      password: wdConfig.password,
    },
  });
  // check calendar if needed
  // const calendars = await client.getCalendars();
  // console.log(calendars);
  try {
    const events = await client.getEvents(wdConfig.calendarPath, { all: true });
    // console.log(events);
    const localEvents = icsCalendarsToEvents(events, calData);
    return localEvents;
  } catch (error) {
    console.error(error);
  }
  return [];
}

function icsCalendarsToEvents(events: Event[], calData: TCalData): IEvent[] {
  return events.map((e) => webdavCalendarToEvent(e, calData));
}

function webdavCalendarToEvent(event: Event, calData: TCalData): IEvent {
  let endDate = event.end;
  if (event.wholeDay || (isZeroTime(event.end) && isZeroTime(event.start))) {
    // if 24h, set end time to the same day
    const numberOfDays = durationInDays(event.start, event.end);
    endDate = addDays(event.start,  numberOfDays - 1 );
    endDate.setHours(23, 59, 59);
  }

  return {
    id: generateId(),
    startDate: event.start.toISOString(),
    endDate: endDate.toISOString() || "",
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
