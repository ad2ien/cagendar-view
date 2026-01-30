import { IEvent } from "@/lib/interfaces";
import { TCalendarSetupData } from "./data-settings";

export const MAX_DESCRIPTION_LENGTH = 500;

export abstract class CalendarAdapter {
  constructor(protected readonly revalidateIntervalMinutes: number) {}

  public abstract fetchEvents(calData: TCalendarSetupData): Promise<IEvent[]>;
}
