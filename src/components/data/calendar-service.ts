import {
    CalendarType,
    ICalendarSetting,
    ICalendarSettings,
    loadSettings,
} from "@/components/config/dataSettings";
import { generateId } from "@/lib/utils";
import { getNextColor } from "../calendar/types";
import { CalendarAdapter } from "./calendar-adapter";
import { IcsAdapter } from "./ics-adapter";
import { ICalendar, IEvent, TCalData } from "./interfaces";
import { WebDavAdapter } from "./webdav-adapter";

export class CalendarService {
  private configData: ICalendarSettings;
  private calendars: ICalendar[];
  private calData: TCalData[];
  private icsAdapter: IcsAdapter;
  private webDavAdapter: WebDavAdapter;

  constructor() {
    this.configData = loadSettings();
    this.calendars = this.configData.map(this.configToCalendar);
    this.calData = this.buildCalData(this.configData, this.calendars);
    this.icsAdapter = new IcsAdapter();
    this.webDavAdapter = new WebDavAdapter();
  }

  public getCalendarsData(): TCalData[] {
    return this.calData;
  }

  private configToCalendar(setting: ICalendarSetting): ICalendar {
    return {
      id: generateId().toString(),
      name: setting.name,
      picturePath: null,
    };
  }

  private buildCalData(
    calSettings: ICalendarSettings,
    calendars: ICalendar[],
  ): TCalData[] {
    return calSettings.map((setting, index) => ({
      config: setting,
      calendar: calendars[index],
      color: getNextColor(),
    }));
  }

  public getCalendars(): ICalendar[] {
    return this.calendars;
  }

  public async getEvents(): Promise<IEvent[]> {
    const fetchPromises = this.calData.map(async (cal) => {
      try {
        let adapter: CalendarAdapter;
        switch (cal.config.type) {
          case CalendarType.ICS:
            adapter = this.icsAdapter;
            break;
          case CalendarType.WEBDAV:
            adapter = this.webDavAdapter;
            break;
          default:
            throw new Error(`Unsupported calendar type: ${cal.config.type}`);
        }

        return await adapter.fetchEvents(cal);
      } catch (error) {
        console.error(
          `Error fetching events for calendar ${cal.calendar.name}:`,
          error,
        );
        return [];
      }
    });

    const allEvents = await Promise.all(fetchPromises);
    return allEvents.flat();
  }
}
