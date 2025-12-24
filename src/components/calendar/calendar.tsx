import React from "react";
import { CalendarBody } from "@/components/calendar/calendar-body";
import { CalendarProvider } from "@/components/calendar/contexts/calendar-context";
import { DndProvider } from "@/components/calendar/contexts/dnd-context";
import { CalendarHeader } from "@/components/calendar/header/calendar-header";
import { getEvents, getCalendars } from "@/components/data/requests";

async function getCalendarData() {
	return {
		events: await getEvents(),
		users: getCalendars(),
	};
}

export async function Calendar() {
	const { events, users } = await getCalendarData();

	return (
		<CalendarProvider events={events} calendars={users} view="month">
			<DndProvider showConfirmation={false}>
				<div className="w-full border rounded-xl">
					<CalendarHeader />
					<CalendarBody />
				</div>
			</DndProvider>
		</CalendarProvider>
	);
}
