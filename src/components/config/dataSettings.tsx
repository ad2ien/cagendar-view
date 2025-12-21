interface IcsCalendar {
  name: string;
  url: URL;
}

interface WebDavCalendar {
  name: string;
  url: URL;
  user: string;
  password: string;
}

type CalendarSetting = IcsCalendar | WebDavCalendar;

interface CalendarSettings {
  calendars: CalendarSetting[];
}
