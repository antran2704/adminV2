import qs from "qs";

const urlToBase64 = (value: string) => {
  return btoa(value.replace(/%([0-9A-F]{2})/g, "")).replaceAll("?", "");
};

const decodeUrl = (value: string) => {
  return atob(value.replace(/%([0-9A-F]{2})/g, ""));
};

const stringToSlug = (str: string) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/-/g, "-")
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const slugToString = (str: string) => {
  return str
    .split("-")
    .map((word) => (word === "" ? "-" : word))
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const parseQueryString = <T>(currentParam: T) => {
  const parseParameters = qs.stringify(
    { ...currentParam },
    {
      filter: (_, value) => value || undefined,
    },
  );

  return parseParameters;
};

export { urlToBase64, decodeUrl, stringToSlug, slugToString, parseQueryString };
