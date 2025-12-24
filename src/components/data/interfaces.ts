import type { TEventColor } from "@/components/calendar/types";

export interface ICalendar {
	id: string;
	name: string;
	picturePath: string | null;
}

export interface IEvent {
	id: number;
	startDate: string;
	endDate: string;
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
