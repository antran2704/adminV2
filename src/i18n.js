import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import resourceEn from "../public/locales/en/translation.json";
import resourceVi from "../public/locales/vi/translation.json";
// don't want to use this?
// have a look at the Quick start guide
// for passing in lng and translations on init

const resources = {
  "en-US": resourceEn,
  "vi-VN": resourceVi,
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    debug: true,

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources,
  });

export default i18n;
