import React, { useMemo } from "react";
import { Select, SelectProps } from "antd";
import clsx from "clsx";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import SelectTypeDate from "../Select/SelectTypeDate";
import { useTranslation } from "react-i18next";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export const optionsChart = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom" as const,
    },
  },
};

const labels = ["1", "1", "1", "1", "1", "1", "1"];

const Transaction = () => {
  const { t } = useTranslation("HomePage");
  const { t: tTransaction } = useTranslation("Transaction");

  const options: SelectProps["options"] = [
    { value: "project", label: "Dự án" },
    { value: "project2", label: "Dự án 2" },
    { value: "project3", label: "Dự án 3" },
    { value: "project4", label: "Dự án 4" },
    { value: "project5", label: "Dự án 5" },
    { value: "project6", label: "Dự án 6" },
    { value: "project7", label: "Dự án 7" },
  ];

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: tTransaction("quantity"),
          data: [1, 2, 3, 4, 5, 6],
          backgroundColor: "#1A6DE3",
        },
        {
          label: tTransaction("value"),
          data: [1, 2, 3, 4, 5, 6],
          backgroundColor: "#19E6B3",
        },
      ],
    }),
    [],
  );

  return (
    <div className="p-5 rounded-xl bg-white flex flex-col w-full h-full dark:bg-black-50 dark:text-white gap-5">
      <div className="flex lg:justify-between sm:gap-5 xl:flex-row flex-col">
        <span
          className={clsx(
            "lg:text-xl text-lg lg:text-left text-center lg:pt-0 pt-5 font-semibold whitespace-nowrap",
          )}
        >
          {t("transaction")}
        </span>
        <div className="xl:w-8/12 w-full flex lg:flex-row flex-col-reverse items-center lg:justify-end justify-between gap-2">
          <Select
            defaultValue="Dự án"
            options={options}
            className="lg:w-4/12 w-full !h-10"
          />
          <SelectTypeDate />
        </div>
      </div>
      <Bar options={optionsChart} data={data} className="w-full !h-full" />
    </div>
  );
};

export default Transaction;
