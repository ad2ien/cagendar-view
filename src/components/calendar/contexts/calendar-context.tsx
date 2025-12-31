"use client";

import { useLocalStorage } from "@/components/calendar/hooks";
import type { TCalendarView } from "@/components/calendar/types";
import type { ICalendar, IEvent, TCalData } from "@/components/data/interfaces";
import type React from "react";
import { createContext, useContext, useState } from "react";

interface ICalendarContext {
  selectedDate: Date;
  view: TCalendarView;
  setView: (view: TCalendarView) => void;
  agendaModeGroupBy: "date" | "color";
  setAgendaModeGroupBy: (groupBy: "date" | "color") => void;
  use24HourFormat: boolean;
  toggleTimeFormat: () => void;
  setSelectedDate: (date: Date | undefined) => void;
  selectedCalendars: ICalendar[] | "all";
  badgeVariant: "dot" | "colored";
  setBadgeVariant: (variant: "dot" | "colored") => void;
  filterEventsBySelectedCalendars: (calendarId: ICalendar["id"]) => void;
  calendars: ICalendar[];
  calendarsData: TCalData[];
  events: IEvent[];
  addEvent: (event: IEvent) => void;
  updateEvent: (event: IEvent) => void;
  removeEvent: (eventId: number) => void;
  clearFilter: () => void;
}

interface CalendarSettings {
  badgeVariant: "dot" | "colored";
  view: TCalendarView;
  use24HourFormat: boolean;
  agendaModeGroupBy: "date" | "color";
}

const DEFAULT_SETTINGS: CalendarSettings = {
  badgeVariant: "colored",
  view: "day",
  use24HourFormat: true,
  agendaModeGroupBy: "date",
};

const CalendarContext = createContext({} as ICalendarContext);

export function CalendarProvider({
  children,
  calendars: calendars,
  calendarsData: calendarsData,
  events,
  badge = "colored",
  view = "day",
}: {
  children: React.ReactNode;
  calendars: ICalendar[];
  calendarsData: TCalData[];
  events: IEvent[];
  view?: TCalendarView;
  badge?: "dot" | "colored";
}) {
  const [settings, setSettings] = useLocalStorage<CalendarSettings>(
    "calendar-settings",
    {
      ...DEFAULT_SETTINGS,
      badgeVariant: badge,
      view: view,
    },
  );

  const [badgeVariant, setBadgeVariantState] = useState<"dot" | "colored">(
    settings.badgeVariant,
  );
  const [currentView, setCurrentViewState] = useState<TCalendarView>(
    settings.view,
  );
  const [use24HourFormat, setUse24HourFormatState] = useState<boolean>(
    settings.use24HourFormat,
  );
  const [agendaModeGroupBy, setAgendaModeGroupByState] = useState<
    "date" | "color"
  >(settings.agendaModeGroupBy);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCalendars, setSelectedCalendars] = useState<
    ICalendar[] | "all"
  >("all");

  const [allEvents, setAllEvents] = useState<IEvent[]>(events || []);
  const [filteredEvents, setFilteredEvents] = useState<IEvent[]>(events || []);

  const updateSettings = (newPartialSettings: Partial<CalendarSettings>) => {
    setSettings({
      ...settings,
      ...newPartialSettings,
    });
  };

  const setBadgeVariant = (variant: "dot" | "colored") => {
    setBadgeVariantState(variant);
    updateSettings({ badgeVariant: variant });
  };

  const setView = (newView: TCalendarView) => {
    setCurrentViewState(newView);
    updateSettings({ view: newView });
  };

  const toggleTimeFormat = () => {
    const newValue = !use24HourFormat;
    setUse24HourFormatState(newValue);
    updateSettings({ use24HourFormat: newValue });
  };

  const setAgendaModeGroupBy = (groupBy: "date" | "color") => {
    setAgendaModeGroupByState(groupBy);
    updateSettings({ agendaModeGroupBy: groupBy });
  };

  const filterEventsBySelectedCalendars = (
    calendarId: ICalendar["id"] | "all",
  ) => {
    if (calendarId === "all") {
      setFilteredEvents(allEvents);
      setSelectedCalendars("all");
      return;
    }

    let newlySelected: ICalendar[] | "all" = [];
    if (selectedCalendars === "all") {
      newlySelected = calendars.filter((c) => c.id === calendarId);
    } else {
      const alreadySelectedCalendarIds = selectedCalendars.map((c) => c.id);
      const clickedCalendar = calendars.find((c) => c.id === calendarId);
      if (clickedCalendar == undefined) return;
      if (alreadySelectedCalendarIds.includes(calendarId)) {
        //remove calendar
        newlySelected = selectedCalendars.filter((c) => c.id !== calendarId);
      } else {
        //add calendar
        newlySelected = [...selectedCalendars, clickedCalendar];
      }
    }
    // if nothing is selected back to all
    if (newlySelected.length === 0) {
      newlySelected = "all";
    }

    setSelectedCalendars(newlySelected);
    if (newlySelected === "all") {
      setFilteredEvents(allEvents);
      return;
    }

    const selectedCalendarIds = newlySelected.map((c) => c.id);
    const filtered = allEvents.filter((event) => {
      return selectedCalendarIds.indexOf(event.calendar.id) > -1;
    });
    setFilteredEvents(filtered);
  };

  const handleSelectDate = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);
  };

  const addEvent = (event: IEvent) => {
    setAllEvents((prev) => [...prev, event]);
    setFilteredEvents((prev) => [...prev, event]);
  };

  const updateEvent = (event: IEvent) => {
    setAllEvents((prev) => prev.map((e) => (e.id === event.id ? event : e)));
    setFilteredEvents((prev) =>
      prev.map((e) => (e.id === event.id ? event : e)),
    );
  };

  const removeEvent = (eventId: number) => {
    setAllEvents((prev) => prev.filter((e) => e.id !== eventId));
    setFilteredEvents((prev) => prev.filter((e) => e.id !== eventId));
  };

  const clearFilter = () => {
    setFilteredEvents(allEvents);
    setSelectedCalendars("all");
  };

  const value = {
    selectedDate,
    setSelectedDate: handleSelectDate,
    selectedCalendars: selectedCalendars,
    setSelectedCalendars: setSelectedCalendars,
    badgeVariant,
    setBadgeVariant,
    calendars: calendars,
    calendarsData: calendarsData,
    filterEventsBySelectedCalendars: filterEventsBySelectedCalendars,
    events: filteredEvents,
    view: currentView,
    use24HourFormat,
    toggleTimeFormat,
    setView,
    agendaModeGroupBy,
    setAgendaModeGroupBy,
    addEvent,
    updateEvent,
    removeEvent,
    clearFilter,
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar(): ICalendarContext {
  const context = useContext(CalendarContext);
  if (!context)
    throw new Error("useCalendar must be used within a CalendarProvider.");
  return context;
}
