import { IEvent, TCalData } from "./interfaces";

export const REVALIDATE_SECONDS = 30 * 60;

export abstract class CalendarAdapter {
  public abstract fetchEvents(calData: TCalData): Promise<IEvent[]>;
}
