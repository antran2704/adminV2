/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "primary-50": "#E8F3FC",
        "primary-100": "#DDECFB",
        "primary-200": "#1A82E3",
        "primary-300": "#1775CC",
        "primary-400": "#1568B6",
        "primary-500": "#B8D8F6",
        "primary-600": "#165FA4",
        "primary-700": "#E1F1FF",
        "primary-800": "rgba(22, 95, 164, 0.48)",
        "primary-900": "#151D48",

        // new primary color
        "primary-1000": "#75B5FB",
        "primary-1100": "#022964",
        "primary-1200": "#3784FB",

        "neutral-50": "rgba(187, 187, 187, 0.7)",
        "neutral-100": "#ECECEC",
        "neutral-200": "#E3E3E3",
        "neutral-300": "#C5C5C5",
        "neutral-400": "#454545",
        "neutral-500": "#181818",
        "neutral-600": "rgba(77, 76, 76, 0.6)",
        "neutral-700": "rgba(67, 67, 67, 0.7)",
        "neutral-800": "#ADB5BD",
        "neutral-900": "#425166",
        "neutral-1000": "#96A5B8",
        "neutral-1100": "#F4F4F4",

        // new neutral color
        "neutral-1200": "#F5F7FA",
        "neutral-1300": "#ABBED1",
        "neutral-1400": "#89939E",
        "neutral-1500": "#717171",
        "neutral-1600": "#4D4D4D",
        "neutral-1700": "#263238",

        // config semantic color
        "green-50": "#DEFAE2",
        "green-100": "#BCF5C2",
        "green-200": "#26DF3B",
        "green-300": "#1EB22F",
        "green-400": "#178623",
        "green-500": "#007052",
        "green-600": "rgba(0, 112, 82, 0.43)",
        "green-700": "#19E6B3",

        "red-50": "#FFD9D9",
        "red-100": "#FFB0B0",
        "red-200": "#FF0000",
        "red-300": "#E60000",
        "red-400": "#CC0000",

        "orange-50": "#FFEADB",
        "orange-100": "#FED3B6",
        "orange-200": "#FD7012",
        "orange-300": "#E46510",
        "orange-400": "#CA5A0E",
        "orange-500": "#FF6D00",

        "yellow-50": "rgba(255, 199, 0, 0.33)",

        "black-50": "#121212",
        "black-100": "#2C333A",

        // tint color
        "tint-50": "#F0F5FF",
        "tint-100": "#E0E9FB",
        "tint-200": "#CFDCF7",
        "tint-300": "#A9C6F8",
        "tint-400": "#83B0F9",

        // shade color
        "shade-50": "#3784FB",
        "shade-100": "#2D73E0",
        "shade-200": "#2463C4",
        "shade-300": "#1A52A9",
        "shade-400": "#10428D",

        // support color
        "support-gray-50": "rgba(179, 191, 209, 0.2)",
        "support-gray-100": "rgba(179, 191, 209, 0.3)",

        "support-success-50": "#BCE9CE",
        "support-success-100": "#79D39D",
        "support-success-200": "#57C885",

        "support-error-50": "#EDB29F",
        "support-error-100": "#DB653F",
        "support-error-200": "#D23F0F",

        "support-warn-100": "#FBAE05",
        "support-warn-200": "#FFAD0A",
      },
    },
  },
  plugins: [],
};
