import { ICalendar, IEvent } from "@/lib/interfaces";
import { IcsAdapter } from "./ics-adapter";
import { WebDavAdapter } from "./webdav-adapter";
import logger from "@/server/logger";
import { generateId } from "../utils";
import { getNextColor } from "@/lib/types";
import { CalendarAdapter } from "./calendar-adapter";
import { CalendarSetupType, ICalendarSetting, ICalendarSettings, getConfig, TCalendarSetupData } from "./data-settings";

const MAX_CALENDARS = 9;

export class CalendarService {
  private configData: ICalendarSettings;
  private calendars: ICalendar[];
  private calData: TCalendarSetupData[];
  private icsAdapter: IcsAdapter;
  private webDavAdapter: WebDavAdapter;

  constructor() {
    const allConfig = getConfig();
    this.configData = allConfig.calendars;
    if (this.configData.length > MAX_CALENDARS) {
      throw new Error("Too many configured calendars, the maximum is " + MAX_CALENDARS);
    }
    this.calendars = this.configData.map(this.configToCalendar);
    this.calData = this.buildCalData(this.configData, this.calendars);
    this.icsAdapter = new IcsAdapter(allConfig.revalidateIntervalMinutes);
    this.webDavAdapter = new WebDavAdapter(allConfig.revalidateIntervalMinutes);
  }

  public getCalendarsData(): TCalendarSetupData[] {
    return this.calData;
  }

  private configToCalendar(setting: ICalendarSetting): ICalendar {
    return {
      id: generateId().toString(),
      name: setting.name,
      picturePath: null,
      color: getNextColor(),
    };
  }

  private buildCalData(configData: ICalendarSettings, calendars: ICalendar[]): TCalendarSetupData[] {
    return configData.map((setting, index) => ({
      clientConfig: calendars[index],
      serverConfig: setting,
    }));
  }

  public getCalendars(): ICalendar[] {
    return this.calendars;
  }

  public async getEvents(): Promise<IEvent[]> {
    const fetchPromises = this.calData.map(async (cal) => {
      try {
        let adapter: CalendarAdapter;
        switch (cal.serverConfig.type) {
          case CalendarSetupType.ICS:
            adapter = this.icsAdapter;
            break;
          case CalendarSetupType.WEBDAV:
            adapter = this.webDavAdapter;
            break;
          default:
            throw new Error(`Unsupported calendar type: ${cal.serverConfig.type}`);
        }

        return await adapter.fetchEvents(cal);
      } catch (error) {
        logger.error(error, `Error fetching events for calendar ${cal.serverConfig.name}:`);
        return [];
      }
    });

    const allEvents = await Promise.all(fetchPromises);
    return allEvents.flat();
  }
}
