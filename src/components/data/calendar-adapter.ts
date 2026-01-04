import { TCalendarSetupData } from "../config/data-settings";
import { IEvent } from "./interfaces";

export const MAX_DESCRIPTION_LENGTH = 500;

export abstract class CalendarAdapter {
  constructor(protected readonly revalidateIntervalMinutes: number) {}

  public abstract fetchEvents(calData: TCalendarSetupData): Promise<IEvent[]>;
}
