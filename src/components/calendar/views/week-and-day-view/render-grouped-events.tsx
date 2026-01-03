import { getEventBlockStyle } from "@/components/calendar/helpers";
import { EventBlock } from "@/components/calendar/views/week-and-day-view/event-block";
import type { IEvent } from "@/components/data/interfaces";
import { areIntervalsOverlapping } from "date-fns";

interface RenderGroupedEventsProps {
  groupedEvents: IEvent[][];
  day: Date;
}

export function RenderGroupedEvents({ groupedEvents, day }: RenderGroupedEventsProps) {
  return groupedEvents.map((group, groupIndex) =>
    group.map((event) => {
      let style = getEventBlockStyle(event, day, groupIndex, groupedEvents.length);
      const hasOverlap = groupedEvents.some(
        (otherGroup, otherIndex) =>
          otherIndex !== groupIndex &&
          otherGroup.some((otherEvent) =>
            areIntervalsOverlapping(
              {
                start: event.startDate,
                end: event.endDate,
              },
              {
                start: otherEvent.startDate,
                end: otherEvent.endDate,
              }
            )
          )
      );

      if (!hasOverlap) style = { ...style, width: "100%", left: "0%" };

      return (
        <div key={event.id} className="absolute p-1" style={style}>
          <EventBlock event={event} />
        </div>
      );
    })
  );
}
