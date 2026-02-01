import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";

interface IProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AboutDialog({ open, onOpenChange }: IProps) {
  const { t } = useTranslation("", { keyPrefix: "calendar.about" });
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>{t("title")}</DialogTitle>
        <div className="flex flex-col">
          {/*<h2 className="text-2xl font-bold mb-4">{t('title')}</h2>*/}
          <p className="text-gray-600 mb-4">
            {t("source")}{" "}
            <a className="text-blue-500 hover:underline" href="https://github.com/ad2ien/cagendar-view">
              https://github.com/ad2ien/cagendar-view
            </a>
          </p>

          <p className="text-gray-600 mb-4">
            {t("description")}
            <a className="text-blue-500 hover:underline" href="https://github.com/ad2ien">
              ad2ien
            </a>
            {t("for")}
            <a className="text-blue-500 hover:underline" href="https://solidaritepaysans.org/">
              Solidarité Paysans
            </a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
