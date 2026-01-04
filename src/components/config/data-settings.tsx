import fs from "fs";
import { ICalendar } from "../data/interfaces";

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

export function loadSettings(): ICagendarConfig {
  const settingsPath = process.env.SETTINGS_FILE_PATH;
  if (!settingsPath) {
    console.warn("SETTINGS_FILE_PATH environment variable is not set. Using default settings.");
    // Return an empty array as default configuration to avoid exception a build time
    return { revalidateIntervalMinutes: 15, calendars: [] };
  }
  return JSON.parse(fs.readFileSync(settingsPath, "utf-8")) as ICagendarConfig;
}

module.exports = loadSettings;
