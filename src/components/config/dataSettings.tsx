import fs from "fs";

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

export function loadSettings(): ICalendarSettings {
  const settingsPath = process.env.SETTINGS_FILE_PATH;
  if (!settingsPath) {
    throw new Error("SETTINGS_FILE_PATH environment variable is not set");
  }
  return JSON.parse(
    fs.readFileSync(settingsPath, "utf-8"),
  ) as ICalendarSettings;
}

module.exports = loadSettings;
