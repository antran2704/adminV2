import { Row, Card, Statistic } from "antd";
import React from "react";
import Project from "@assets/icons/order-icon.svg";
import DiscIcon from "@assets/icons/disc-icon.svg";
import SalesIcon from "@assets/icons/sales-icon.svg";
import clsx from "clsx";
import SelectTypeDate from "../Select/SelectTypeDate";
import { useTranslation } from "react-i18next";

interface IFormatterStatic {
  icon: React.ReactNode;
  value: number;
  description: string;
  profit: string;
  iconColor: string;
}

const Statistical = () => {
  const { t } = useTranslation("HomePage");

  const valueStatical = [
    {
      icon: <img src={Project} alt="project" />,
      iconColor: "bg-[#FF6D00]",
      value: 300,
      description: t("investor"),
      profit: "+8% " + t("increase"),
      color: "!bg-[#FF6D00]/20",
    },
    {
      icon: <img src={Project} alt="project" />,
      iconColor: "bg-green-500",
      value: 300,
      description: t("project"),
      profit: "+5% " + t("increase"),
      color: "!bg-green-600",
    },
    {
      icon: <img src={DiscIcon} alt="project" />,
      iconColor: "bg-primary-600",
      value: 500000,
      description: t("nft"),
      profit: "+1.2% " + t("increase"),
      color: "!bg-primary-800",
    },
    {
      icon: <img src={SalesIcon} alt="project" />,
      iconColor: "bg-orange-500",
      value: 80000,
      description: t("transaction"),
      profit: "+0.5% " + t("increase"),
      color: "!bg-yellow-50",
    },
  ];

  const renderLogicStatic = ({
    icon,
    value,
    description,
    profit,
    iconColor,
  }: IFormatterStatic) => {
    return (
      <div className="flex flex-col items-center justify-center gap-y-[0.688rem] dark:text-white">
        <div className={clsx("p-2 w-fit h-fit rounded-full", iconColor)}>
          {icon}
        </div>
        <span className="text-2xl font-bold text-primary-900 dark:text-white">
          {value}
        </span>
        <span className="text-base font-medium text-neutral-900 dark:text-white">
          {description}
        </span>
        <span className="text-xs font-medium text-primary-1000 dark:text-white">
          {profit}
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white flex flex-col p-5 rounded-[1.25rem] gap-y-5 w-full dark:bg-black-50 dark:text-white">
      <div className="flex lg:flex-row flex-col justify-between">
        <span
          className={clsx(
            "xl:text-2xl lg:text-xl text-lg lg:text-left text-center font-semibold lg:py-0 py-5",
          )}
        >
          {t("statistics")}
        </span>
        <div className="xl:w-6/12 lg:w-8/12 md:w-full">
          <SelectTypeDate />
        </div>
      </div>

      <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-5">
        {valueStatical.map(
          ({ icon, iconColor, value, description, profit, color }, index) => (
            <Row key={index}>
              <Card
                bordered={false}
                className={clsx(
                  "flex justify-center w-full dark:bg-slate-800 dark:text-white",
                  color,
                )}
              >
                <Statistic
                  formatter={() =>
                    renderLogicStatic({
                      icon,
                      value,
                      description,
                      profit,
                      iconColor,
                    })
                  }
                />
              </Card>
            </Row>
          ),
        )}
      </div>
    </div>
  );
};

export default Statistical;
