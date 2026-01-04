import { IEvent, TCalData } from "./interfaces";

export const MAX_DESCRIPTION_LENGTH = 500;

export abstract class CalendarAdapter {
  constructor(protected readonly revalidateIntervalMinutes: number) {}

  public abstract fetchEvents(calData: TCalData): Promise<IEvent[]>;
}
