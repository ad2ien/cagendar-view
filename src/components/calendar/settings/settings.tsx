import { useCalendar } from "@/components/calendar/contexts/calendar-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { SettingsIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AboutDialog } from "../dialogs/about-dialog";

export function Settings() {
  const { badgeVariant, setBadgeVariant, use24HourFormat, toggleTimeFormat, agendaModeGroupBy, setAgendaModeGroupBy } =
    useCalendar();
  const { t } = useTranslation("", { keyPrefix: "calendar.settings" });
  const { theme, setTheme } = useTheme();
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const isDarkMode = theme === "dark";
  const isDotVariant = badgeVariant === "dot";

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <SettingsIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>{t("label")}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              {t("darkMode")}
              <DropdownMenuShortcut>
                <Switch checked={isDarkMode} onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>

            <DropdownMenuItem>
              {t("useDotBadge")}
              <DropdownMenuShortcut>
                <Switch
                  checked={isDotVariant}
                  onCheckedChange={(checked) => setBadgeVariant(checked ? "dot" : "colored")}
                />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              {t("use24HourFormat")}
              <DropdownMenuShortcut>
                <Switch checked={use24HourFormat} onCheckedChange={toggleTimeFormat} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel> {t("agendaModeGroupBy")}</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={agendaModeGroupBy}
              onValueChange={(value) => setAgendaModeGroupBy(value as "date" | "color")}
            >
              <DropdownMenuRadioItem value="date">{t("date")}</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="color">{t("color")}</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setIsAboutOpen(true)}>{t("about")}</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AboutDialog open={isAboutOpen} onOpenChange={setIsAboutOpen} />
    </div>
  );
}
