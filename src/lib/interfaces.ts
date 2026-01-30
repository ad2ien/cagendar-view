
/**
 * The following interfaces are used on client side
 */

import { TEventColor } from "./types";

export interface IEvent {
  id: number;
  startDate: Date;
  endDate: Date;
  title: string;
  // TODO: completely move it to calendar
  color: TEventColor;
  description: string;
  calendar: ICalendar;
  wholeDay: boolean;
}

export interface ICalendar {
  id: string;
  name: string;
  picturePath: string | null;
  color: TEventColor;
}

export interface ICalendarCell {
  day: number;
  currentMonth: boolean;
  date: Date;
}
