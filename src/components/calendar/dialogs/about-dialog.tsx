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
          <p className="text-gray-600 mb-4">
            📝 {t("source")}{" "}
            <a className="text-blue-500 hover:underline" href="https://github.com/ad2ien/cagendar-view">
              https://github.com/ad2ien/cagendar-view
            </a>
          </p>
          <p className="text-gray-600 mb-4">
            🛠️ &nbsp;{t("description")}
            <a className="text-blue-500 hover:underline" href="https://github.com/ad2ien">
              ad2ien
            </a>
            {t("for")}
            <a className="text-blue-500 hover:underline" href="https://solidaritepaysans.org/">
              Solidarité Paysans
            </a>
          </p>
          <p className="text-gray-600 mb-4">
            📜 © 2026 ad2ien&nbsp;
            <a className="text-blue-500 hover:underline" href="https://opensource.org/license/mit">
              MIT License
            </a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
