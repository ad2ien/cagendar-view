"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/server/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ComponentProps } from "react";
import type { CustomComponents } from "react-day-picker";
import { DayPicker as ReactDayPicker } from "react-day-picker";
import { getLocale } from "../calendar/helpers";

type TDayPickerProps = ComponentProps<typeof ReactDayPicker>;

function DayPicker({ className, classNames, showOutsideDays = true, ...props }: TDayPickerProps) {
  return (
    <ReactDayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col select-none sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",

        caption_label: "text-sm font-medium",

        nav: "space-x-1 flex items-center",
        day: cn(buttonVariants({ variant: "ghost" }), "size-8.5 p-0 font-normal aria-selected:opacity-100"),
        ...classNames,
      }}
      components={
        {
          IconLeft: () => <ChevronLeft className="size-4" />,
          IconRight: () => <ChevronRight className="size-4" />,
        } as Partial<CustomComponents>
      }
      locale={getLocale()}
      {...props}
    />
  );
}

export { DayPicker };
