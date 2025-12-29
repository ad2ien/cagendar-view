"use client";

import { useCalendar } from "@/components/calendar/contexts/calendar-context";
import { formatTime, getLocale } from "@/components/calendar/helpers";
import type { IEvent } from "@/components/data/interfaces";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDate, parseISO } from "date-fns";
import { t } from "i18next";
import { Calendar, Clock, Text, User } from "lucide-react";
import type { ReactNode } from "react";

interface IProps {
  event: IEvent;
  children: ReactNode;
}

export function EventDetailsDialog({ event, children }: IProps) {
  const startDate = parseISO(event.startDate);
  const endDate = parseISO(event.endDate);
  const { use24HourFormat } = useCalendar();

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{event.title}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[80vh]">
          <div className="space-y-4 p-4">
            <div className="flex items-start gap-2">
              <User className="mt-1 size-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Agenda</p>
                <p className="text-sm text-muted-foreground">
                  {event.calendar.name}
                </p>
              </div>
            </div>

            {!event.wholeDay ? (
              <div className="flex items-start gap-2">
                <Calendar className="mt-1 size-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Début</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(startDate, "EEEE d MMMM", { locale: getLocale() })}
                    <span className="mx-1">at</span>
                    {formatTime(parseISO(event.startDate), use24HourFormat)}
                  </p>
                </div>
              </div>
            ) : null}
            {!event.wholeDay ? (
              <div className="flex items-start gap-2">
                <Clock className="mt-1 size-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Fin</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(endDate, "EEEE d MMMM", { locale: getLocale() })}
                    <span className="mx-1">{t('calendar.dialog.at')}</span>
                    {formatTime(parseISO(event.endDate), use24HourFormat)}
                  </p>
                </div>
              </div>
            ) : null}

            <div className="flex items-start gap-2">
              <Text className="mt-1 size-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{t('calendar.dialog.description')}</p>
                <p className="text-sm text-muted-foreground">
                  {event.description}
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>
        <DialogClose />
      </DialogContent>
    </Dialog>
  );
}
