import {
  CalendarType,
  ICalendarSetting,
  ICalendarSettings,
  loadSettings
} from "@/components/config/dataSettings";
import { generateId } from "@/lib/utils";
import { getNextColor, TEventColor } from "../calendar/types";
import { getIcsEvents } from "./icsAdapter";
import { IEvent, IUser } from "./interfaces";
import { getWebdavEvents, isWebDavCalendar } from "./webdavAdapter";

const configData = loadSettings();
const users = configData.map(configToUser);
const calData = buildCalData(configData, users);

export type TCalData = {
  config: ICalendarSetting;
  user: IUser;
  color: TEventColor;
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
  // resultEvents = resultEvents.concat(CALENDAR_ITEMS_MOCK);
  return resultEvents;
};

export function getUsers(): IUser[] {
  return users;
}

function configToUser(setting: ICalendarSetting): IUser {
  return {
    id: generateId().toString(),
    name: setting.name,
    picturePath: null,
  };
}

function buildCalData(
  calSettings: ICalendarSettings,
  users: IUser[],
): TCalData[] {
  return calSettings.map((setting, index) => ({
    config: setting,
    user: users[index],
    color: getNextColor(),
  }));
}
