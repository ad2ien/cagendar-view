"use client";

import { useLocalStorage } from "@/components/calendar/hooks";
import type { ICalendar, IEvent } from "@/lib/interfaces";
import { TCalendarView } from "@/lib/types";
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
  startOfDayHour: number;
  setStartOfDayHour: (newVal: number) => void;
  setSelectedDate: (date: Date | undefined) => void;
  selectedCalendars: ICalendar[] | "all";
  badgeVariant: "dot" | "colored";
  setBadgeVariant: (variant: "dot" | "colored") => void;
  filterEventsBySelectedCalendars: (calendarId: ICalendar["id"]) => void;
  calendars: ICalendar[];
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
  startOfDayHour: number;
  agendaModeGroupBy: "date" | "color";
}

export const MIN_SCROLL_HOUR = 0;
// With a fixed calendar height, having 16h on top
// of the frame allows to see the rest of the day
export const MAX_SCROLL_HOUR = 16;

const DEFAULT_SETTINGS: CalendarSettings = {
  badgeVariant: "colored",
  view: "day",
  use24HourFormat: true,
  startOfDayHour: 8,
  agendaModeGroupBy: "date",
};

const CalendarContext = createContext({} as ICalendarContext);

export function CalendarProvider({
  children,
  calendars: calendars,
  events,
  badge = "colored",
  view = "day",
}: {
  children: React.ReactNode;
  calendars: ICalendar[];
  events: IEvent[];
  view?: TCalendarView;
  badge?: "dot" | "colored";
}) {
  const [rawSettings, setSettings] = useLocalStorage<Partial<CalendarSettings>>("calendar-settings", {});

  const settings: CalendarSettings = {
    ...DEFAULT_SETTINGS,
    badgeVariant: badge,
    view: view,
    ...rawSettings,
  };

  const [badgeVariant, setBadgeVariantState] = useState<"dot" | "colored">(settings.badgeVariant);
  const [currentView, setCurrentViewState] = useState<TCalendarView>(settings.view);
  const [use24HourFormat, setUse24HourFormatState] = useState<boolean>(settings.use24HourFormat);
  const [startOfDayHour, setStartOfDayHourState] = useState<number>(settings.startOfDayHour);
  const [agendaModeGroupBy, setAgendaModeGroupByState] = useState<"date" | "color">(settings.agendaModeGroupBy);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCalendars, setSelectedCalendars] = useState<ICalendar[] | "all">("all");

  const [allEvents, setAllEvents] = useState<IEvent[]>(events || []);
  const [filteredEvents, setFilteredEvents] = useState<IEvent[]>(events || []);

  const updateSettings = (newPartialSettings: Partial<CalendarSettings>) => {
    setSettings((prev) => ({
      ...prev,
      ...newPartialSettings,
    }));
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

  const setStartOfDayHour = (newVal: number) => {
    if (!isNaN(newVal) && newVal >= MIN_SCROLL_HOUR && newVal <= MAX_SCROLL_HOUR) {
      setStartOfDayHourState(newVal);
      updateSettings({ startOfDayHour: newVal });
    }
  };

  const setAgendaModeGroupBy = (groupBy: "date" | "color") => {
    setAgendaModeGroupByState(groupBy);
    updateSettings({ agendaModeGroupBy: groupBy });
  };

  const filterEventsBySelectedCalendars = (calendarId: ICalendar["id"] | "all") => {
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
    setFilteredEvents((prev) => prev.map((e) => (e.id === event.id ? event : e)));
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
    filterEventsBySelectedCalendars: filterEventsBySelectedCalendars,
    events: filteredEvents,
    view: currentView,
    use24HourFormat,
    toggleTimeFormat,
    startOfDayHour,
    setStartOfDayHour,
    setView,
    agendaModeGroupBy,
    setAgendaModeGroupBy,
    addEvent,
    updateEvent,
    removeEvent,
    clearFilter,
  };

  return <CalendarContext.Provider value={value}>{children}</CalendarContext.Provider>;
}

export function useCalendar(): ICalendarContext {
  const context = useContext(CalendarContext);
  if (!context) throw new Error("useCalendar must be used within a CalendarProvider.");
  return context;
}
