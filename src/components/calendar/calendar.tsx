import { CalendarBody } from "@/components/calendar/calendar-body";
import { CalendarProvider } from "@/components/calendar/contexts/calendar-context";
import { DndProvider } from "@/components/calendar/contexts/dnd-context";
import { CalendarHeader } from "@/components/calendar/header/calendar-header";
import { getCalendars, getCalendarsData, getEvents } from "@/components/data/requests";

async function getCalendarData() {
	return {
		events: await getEvents(),
		calendars: getCalendars(),
		calendarsData: getCalendarsData(),
	};
}

export async function Calendar() {
	const { events, calendars, calendarsData } = await getCalendarData();

	return (
		<CalendarProvider events={events} calendars={calendars} calendarsData={calendarsData} view="month">
			<DndProvider showConfirmation={false}>
				<div className="w-full border rounded-xl">
					<CalendarHeader />
					<CalendarBody />
				</div>
			</DndProvider>
		</CalendarProvider>
	);
}
