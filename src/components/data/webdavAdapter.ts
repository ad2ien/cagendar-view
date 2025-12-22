import { CalDAVClient } from "ts-caldav";
import { IEvent } from "./interfaces";
import { generateId } from "@/lib/utils";
import {Event } from "ts-caldav";
import {
  CalendarType,
  ICalendar,
  IWebDavCalendar,
} from "../config/dataSettings";

export function isWebDavCalendar(config: ICalendar): config is IWebDavCalendar {
  return (
    config.type === CalendarType.WEBDAV &&
    "calendarPath" in config &&
    "username" in config &&
    "password" in config
  );
}

export async function getWebdavEvents(calendar: IWebDavCalendar) {
  const client = await CalDAVClient.create({
    baseUrl: calendar.url.toString(),
    auth: {
      type: "basic",
      username: calendar.username,
      password: calendar.password,
    },
  });
  // check calendar if needed
  // const calendars = await client.getCalendars();
  // console.log(calendars);
  try {
    const events = await client.getEvents(calendar.calendarPath);
    const localEvents = icsCalendarsToEvents(events);
    return localEvents;
  } catch (error) {
    console.error(error);
  }
  return [];
}

function icsCalendarsToEvents(events: Event[]): IEvent[] {
  return events.map(webdavCalendarToEvent);
}

function webdavCalendarToEvent(event: Event): IEvent {
  return {
    id: generateId(),
    startDate: event.start.toISOString(),
    endDate: event.end.toISOString() || "",
    description: event.description || "",
    title: event.summary || "",
    color: "blue",
    user: {
      id: "1",
      name: "marc",
      picturePath: "",
    },
  };
}
