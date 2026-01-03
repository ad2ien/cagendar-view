import type { TEventColor } from "@/components/calendar/types";
import { ICalendarSetting } from "../config/dataSettings";

export interface ICalendar {
  id: string;
  name: string;
  picturePath: string | null;
}

export interface IEvent {
  id: number;
  startDate: Date;
  endDate: Date;
  title: string;
  color: TEventColor;
  description: string;
  calendar: ICalendar;
  wholeDay: boolean;
}

export interface ICalendarCell {
  day: number;
  currentMonth: boolean;
  date: Date;
}

export type TCalData = {
  config: ICalendarSetting;
  calendar: ICalendar;
  color: TEventColor;
};
