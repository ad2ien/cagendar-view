import { generateId } from "@/server/utils";
import { addDays } from "date-fns";
import { unstable_cache } from "next/cache";
import { CalDAVClient, Event } from "ts-caldav";
import { CalendarAdapter, MAX_DESCRIPTION_LENGTH } from "./calendar-adapter";
import { CalendarSetupType, IIcsSetup, IWebDavCalendarSetup, TCalendarSetupData } from "./data-settings";
import logger from "@/server/logger";
import { IEvent } from "@/lib/interfaces";
import { durationInDays, htmlToText, isZeroTime, safeTruncate } from "@/components/calendar/helpers";

export function isWebDavCalendar(config: IIcsSetup): config is IWebDavCalendarSetup {
  return (
    config.type === CalendarSetupType.WEBDAV && "calendarPath" in config && "username" in config && "password" in config
  );
}

export class WebDavAdapter extends CalendarAdapter {
  public async fetchEvents(calData: TCalendarSetupData): Promise<IEvent[]> {
    if (!isWebDavCalendar(calData.serverConfig)) {
      throw new Error("Should be webdav config : " + calData.serverConfig.name);
    }
    const wdConfig: IWebDavCalendarSetup = calData.serverConfig;

    const cachedFetchEvents = unstable_cache(
      async (wdConfig: IWebDavCalendarSetup): Promise<Event[]> => {
        try {
          const client = await CalDAVClient.create({
            baseUrl: wdConfig.url.toString(),
            auth: {
              type: "basic",
              username: wdConfig.username,
              password: wdConfig.password,
            },
          });

          return await client.getEvents(wdConfig.calendarPath, {
            all: true,
          });
        } catch (error) {
          logger.error(error, "fetchEvents()");
          return [];
        }
      },
      [`calendar-${calData.clientConfig.id}`],
      { revalidate: this.revalidateIntervalMinutes * 60 }
    );
    const events = await cachedFetchEvents(wdConfig);
    return webDavEvtToEvents(events, calData);
  }
}

function webDavEvtToEvents(events: Event[], calData: TCalendarSetupData): IEvent[] {
  return events.map((e) => webdavEvtToEvent(e, calData));
}

function webdavEvtToEvent(event: Event, calData: TCalendarSetupData): IEvent {
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
    description: safeTruncate(htmlToText(event.description || ""), MAX_DESCRIPTION_LENGTH) || "",
    title: event.summary || "",
    color: calData.clientConfig.color,
    calendar: {
      id: calData.clientConfig.id,
      name: calData.clientConfig.name,
      color: calData.clientConfig.color,
      picturePath: calData.clientConfig.picturePath || "",
    },
    wholeDay: event.wholeDay ? event.wholeDay! : false,
  };
}
