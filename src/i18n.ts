import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import resourceEn from "../public/locales/en/translation.json";
import resourceVi from "../public/locales/vi/translation.json";

const resources = {
  en: resourceEn,
  vi: resourceVi,
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "vi",
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    resources,
  });

export default i18n;
