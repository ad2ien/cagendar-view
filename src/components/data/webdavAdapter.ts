import { generateId } from "@/lib/utils";
import { CalDAVClient, Event } from "ts-caldav";
import {
  CalendarType,
  ICalendar,
  IWebDavCalendar
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
      throw new Error("Sould be web dav config : " + calData.config.name);
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
    const events = await client.getEvents(wdConfig.calendarPath);
    const localEvents = icsCalendarsToEvents(events, calData);
    return localEvents;
  } catch (error) {
    console.error(error);
  }
  return [];
}

function icsCalendarsToEvents(events: Event[],calData: TCalData ): IEvent[] {
  return events.map(e => webdavCalendarToEvent(e, calData));
}

function webdavCalendarToEvent(event: Event, calData: TCalData ): IEvent {
  return {
    id: generateId(),
    startDate: event.start.toISOString(),
    endDate: event.end.toISOString() || "",
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
