import { IEvent, TCalData } from "./interfaces";

export const REVALIDATE_SECONDS = 30 * 60;

export const MAX_DESCRIPTION_LENGTH = 500;

export abstract class CalendarAdapter {
  public abstract fetchEvents(calData: TCalData): Promise<IEvent[]>;
}
