"use client";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

export default function LocaleSwitcher() {
  const { i18n } = useTranslation("LocaleSwitcher");

  const onChangeLanguage = (locale: string) => {
    i18n.changeLanguage(locale);
    localStorage.setItem("i18nextLng", locale);
  };

  return (
    <div>
      <button
        className={clsx(
          "md:text-sm sm:text-sm text-xs text-[#202020] hover:underline hover:text-[#0459DD]",
          i18n.resolvedLanguage === "en" ? "block" : "hidden",
        )}
        onClick={() => onChangeLanguage("vi")}
      >
        English
      </button>
      <button
        className={clsx(
          "md:text-sm sm:text-sm text-xs text-[#202020] hover:underline hover:text-[#0459DD]",
          i18n.resolvedLanguage === "vi" ? "block" : "hidden",
        )}
        onClick={() => onChangeLanguage("en")}
      >
        Tiếng Việt
      </button>
    </div>
  );
}
