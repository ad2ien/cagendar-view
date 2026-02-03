import { ICalendar } from "@/lib/interfaces";
import logger from "@/server/logger";
import fs from "fs";

const configFile = "config.json";

const config = loadSettings();

export const getConfig = () => config;

/**
 * The following interfaces are for server side only
 */
export interface ICagendarConfig {
  revalidateIntervalMinutes: number;
  calendars: ICalendarSettings;
}
export enum CalendarSetupType {
  ICS = "ics",
  WEBDAV = "webdav",
}

// enough to define a ICS calendar
export interface IIcsSetup {
  type: CalendarSetupType;
  name: string;
  url: URL;
}

export interface IWebDavCalendarSetup extends IIcsSetup {
  calendarPath: string;
  username: string;
  password: string;
}

// joins server and client settings
export interface TCalendarSetupData {
  clientConfig: ICalendar;
  serverConfig: IIcsSetup;
}

export type ICalendarSetting = IIcsSetup | IWebDavCalendarSetup;
export type ICalendarSettings = ICalendarSetting[];

function loadSettings(): ICagendarConfig {
  logger.info("Loading settings : configFile");
  return JSON.parse(fs.readFileSync(configFile, "utf-8")) as ICagendarConfig;
}
