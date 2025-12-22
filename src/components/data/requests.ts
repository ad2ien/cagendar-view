import { CALENDAR_ITEMS_MOCK, USERS_MOCK } from "@/components/data/mocks";
import {
  loadSettings,
  CalendarType,
  IWebDavCalendar,
} from "@/components/config/dataSettings";
import { getIcsEvents } from "./icsAdapter";
import { getWebdavEvents, isWebDavCalendar } from "./webdavAdapter";
import { IEvent, IUser } from "./interfaces";

export const getEvents = async () => {
  const configData = loadSettings();
  let resultEvents: IEvent[] = [];

  // TODO add color / calendar
  // rename
  // interface for adapters?
  for (const config of configData) {
    switch (config.type) {
      case CalendarType.ICS:
        const icsEvents = await getIcsEvents(config.url);
        resultEvents = resultEvents.concat(icsEvents);
        break;

      case CalendarType.WEBDAV:
        if (isWebDavCalendar(config)) {
          const wdconfig: IWebDavCalendar = config;
          const webdavEvents = await getWebdavEvents(wdconfig);
          resultEvents = resultEvents.concat(webdavEvents);
        } else {
          console.error("Bad config");
        }
        break;
    }
  }
  resultEvents = resultEvents.concat(CALENDAR_ITEMS_MOCK);
  console.log(resultEvents);
  return resultEvents;
};

export async function getUsers(): Promise<IUser[]> {
  return USERS_MOCK;
}
