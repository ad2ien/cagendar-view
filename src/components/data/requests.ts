import { CALENDAR_ITEMS_MOCK, USERS_MOCK } from "@/components/data/mocks";
import { CalDAVClient } from "ts-caldav";
import { convertIcsCalendar, type IcsCalendar } from "ts-ics";

export const getEvents = async () => {
  // test webdav
  // const client = await CalDAVClient.create({
  //   baseUrl: "URL",
  //   auth: {
  //     type: "basic",
  //     username: "",
  //     password: "",
  //   },
  // });

  // // List calendars
  // const calendars = await client.getCalendars();

  // console.log(calendars);

  // // Fetch events
  // const events = await client.getEvents(
  //   "/remote.php/dav/calendars/USER/CALENDAR/",
  // );

  // test fetch ics
  // await fetch(
  //   "URL",
  // )
  //   .then((response) => response.text())
  //   .then((text) => {
  //     const calendar: IcsCalendar = convertIcsCalendar(undefined, text);
  //     console.log(calendar);
  //   });
  // console.log(events);
  return CALENDAR_ITEMS_MOCK;
};

export const getUsers = async () => {
  return USERS_MOCK;
};
