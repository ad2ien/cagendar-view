"use client";

import { useCalendar } from "@/components/calendar/contexts/calendar-context";
import { formatTime } from "@/components/calendar/helpers";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDate, isSameDay } from "date-fns";
import { Calendar, Clock, User } from "lucide-react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { getLocale } from "../helpers";
import { IEvent } from "../interfaces";

interface IProps {
  event: IEvent;
  children: ReactNode;
}

export function EventDetailsDialog({ event, children }: IProps) {
  const startDate = event.startDate;
  const endDate = event.endDate;
  const { use24HourFormat } = useCalendar();
  const { t } = useTranslation("", {
    keyPrefix: "calendar.dialog",
  });

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{event.title}</DialogTitle>
        </DialogHeader>
        <DialogDescription>{event.description}</DialogDescription>
        <ScrollArea className="max-h-[80vh]">
          <div className="space-y-4 p-4">
            <div className="flex items-start gap-2">
              <User className="mt-1 size-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground font-medium">{t("agenda")}</p>
                <p className="text-sm ">{event.calendar.name}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Calendar className="mt-1 size-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground font-medium">{t("start")}</p>
                <p className="text-sm">
                  {formatDate(startDate, "EEEE d MMMM", {
                    locale: getLocale(),
                  })}
                  {!event.wholeDay ? (
                    <>
                      <span className="mx-1">{t("at")}</span>
                      {formatTime(event.startDate, use24HourFormat)}
                    </>
                  ) : null}
                </p>
              </div>
            </div>

            {!event.wholeDay || !isSameDay(event.endDate, event.startDate) ? (
              <div className="flex items-start gap-2">
                <Clock className="mt-1 size-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground font-medium">{t("end")}</p>
                  <p className="text-sm ">
                    {formatDate(endDate, "EEEE d MMMM", {
                      locale: getLocale(),
                    })}
                    {!event.wholeDay ? (
                      <>
                        <span className="mx-1">{t("at")}</span>
                        {formatTime(event.startDate, use24HourFormat)}
                      </>
                    ) : null}
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </ScrollArea>
        <DialogClose />
      </DialogContent>
    </Dialog>
  );
}
