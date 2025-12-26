import {
  CalendarType,
  ICalendarSetting,
  ICalendarSettings,
  loadSettings,
} from "@/components/config/dataSettings";
import { generateId } from "@/lib/utils";
import { getNextColor, TEventColor } from "../calendar/types";
import { getIcsEvents } from "./icsAdapter";
import { IEvent, ICalendar } from "./interfaces";
import { getWebdavEvents, isWebDavCalendar } from "./webdavAdapter";

const configData = loadSettings();
const calendars = configData.map(configToCalendar);
const calData = buildCalData(configData, calendars);

export type TCalData = {
  config: ICalendarSetting;
  calendar: ICalendar;
  color: TEventColor;
};

export const getCalendarsData = () => {
  return calData;
};

export const getEvents = async () => {
  let resultEvents: IEvent[] = [];

  for (const cal of calData) {
    switch (cal.config.type) {
      case CalendarType.ICS:
        const icsEvents = await getIcsEvents(cal);
        resultEvents = resultEvents.concat(icsEvents);
        break;

      case CalendarType.WEBDAV:
        if (isWebDavCalendar(cal.config)) {
          const webdavEvents = await getWebdavEvents(cal);
          resultEvents = resultEvents.concat(webdavEvents);
        } else {
          console.error("Bad config");
        }
        break;
    }

  }

  return resultEvents;
};

export function getCalendars(): ICalendar[] {
  return calendars;
}

function configToCalendar(setting: ICalendarSetting): ICalendar {
  return {
    id: generateId().toString(),
    name: setting.name,
    picturePath: null,
  };
}

function buildCalData(
  calSettings: ICalendarSettings,
  calendars: ICalendar[],
): TCalData[] {
  return calSettings.map((setting, index) => ({
    config: setting,
    calendar: calendars[index],
    color: getNextColor(),
  }));
}
