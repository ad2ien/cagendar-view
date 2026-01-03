"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

const initI18n = i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "fr",
    debug: process.env.NODE_ENV === "development",
    load: "languageOnly",
    supportedLngs: ["en", "fr"],
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    backend: {
      loadPath: "/locales/{{lng}}/translation.json",
    },
    detection: {
      order: ["navigator", "localStorage", "cookie", "htmlTag"],
      caches: ["localStorage", "cookie"],
    },
  });

export { initI18n };
export default i18n;
