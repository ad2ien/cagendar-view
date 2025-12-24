import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AvatarGroup } from "@/components/ui/avatar-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useCalendar } from "@/components/calendar/contexts/calendar-context";

export function CalendarSelect() {
	const { calendars: calendars, selectedCalendarId: selectedCalendarId, filterEventsBySelectedUser } = useCalendar();

	return (
		<Select value={selectedCalendarId!} onValueChange={filterEventsBySelectedUser}>
			<SelectTrigger className="w-full">
				<SelectValue placeholder="Choix calendrier" />
			</SelectTrigger>
			<SelectContent align="end">
				<SelectItem value="all">
					<AvatarGroup className="mx-2 flex items-center" max={3}>
						{calendars.map((calendar) => (
							<Avatar key={calendar.id} className="size-6 text-xxs">
								<AvatarImage
									src={calendar.picturePath ?? undefined}
									alt={calendar.name}
								/>
								<AvatarFallback className="text-xxs">
									{calendar.name[0]}
								</AvatarFallback>
							</Avatar>
						))}
					</AvatarGroup>
					Tous
				</SelectItem>

				{calendars.map((calendar) => (
					<SelectItem
						key={calendar.id}
						value={calendar.id}
						className="flex-1 cursor-pointer"
					>
						<div className="flex items-center gap-2">
							<Avatar key={calendar.id} className="size-6">
								<AvatarImage
									src={calendar.picturePath ?? undefined}
									alt={calendar.name}
								/>
								<AvatarFallback className="text-xxs">
									{calendar.name[0]}
								</AvatarFallback>
							</Avatar>

							<p className="truncate">{calendar.name}</p>
						</div>
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
