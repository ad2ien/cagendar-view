import fs from "fs";

export interface ICagendarConfig {
  revalidateIntervalMinutes: number;
  calendars: ICalendarSettings;
}
export enum CalendarType {
  ICS = "ics",
  WEBDAV = "webdav",
}

// enough to define a ICS calendar
export interface ICalendar {
  type: CalendarType;
  name: string;
  url: URL;
}

export interface IWebDavCalendar extends ICalendar {
  calendarPath: string;
  username: string;
  password: string;
}

export type ICalendarSetting = ICalendar | IWebDavCalendar;
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
