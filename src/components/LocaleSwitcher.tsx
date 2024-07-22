"use client";
import { useTranslations } from "next-intl";
import clsx from "clsx";
import { useParams } from "next/navigation";
import { Link, usePathname } from "~/navigation";

export default function LocaleSwitcher() {
  const t = useTranslations("LocaleSwitcher");
  const pathname = usePathname();
  const params = useParams();

  return (
    <div>
      <Link
        className={clsx(
          "md:text-sm sm:text-sm text-xs text-[#202020] hover:underline hover:text-[#0459DD]",
          params.locale === "en" ? "block" : "hidden",
        )}
        locale={"vi"}
        href={`/${pathname}`}
      >
        {t("locale", { locale: "en" })}
      </Link>
      <Link
        className={clsx(
          "md:text-sm sm:text-sm text-xs text-[#202020] hover:underline hover:text-[#0459DD]",
          params.locale === "vi" ? "block" : "hidden",
        )}
        locale={"en"}
        href={`/${pathname}`}
      >
        {t("locale", { locale: "vi" })}
      </Link>
    </div>
  );
}
