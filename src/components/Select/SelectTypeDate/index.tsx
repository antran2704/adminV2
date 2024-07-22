import { useState, useMemo } from "react";
import { DatePicker, DatePickerProps } from "antd";
import clsx from "clsx";
import { useTranslations } from "next-intl";

const SelectTypeDate = () => {
  const tFilter = useTranslations("Filter");
  const dataDate = useMemo(() => {
    return [
      { name: "day", label: tFilter("day") },
      { name: "week", label: tFilter("week") },
      { name: "month", label: tFilter("month") },
      { name: "year", label: tFilter("year") },
    ];
  }, []);

  const [date, setDate] = useState<string>("year");

  const onChange: DatePickerProps["onChange"] = (date, dateString) => {};

  const selectFilterDate = useMemo(() => {
    switch (date) {
      case "day":
        return (
          <DatePicker
            onChange={onChange}
            placeholder={tFilter("selectDate")}
            className="w-full !py-2 !px-3"
          />
        );
      case "week":
        return (
          <DatePicker
            onChange={onChange}
            picker="week"
            placeholder={tFilter("selectWeek")}
            className="w-full !py-2 !px-3"
          />
        );
      case "month":
        return (
          <DatePicker
            onChange={onChange}
            placeholder={tFilter("selectMonth")}
            picker="month"
            className="w-full !py-2 !px-3"
          />
        );
      default:
        return (
          <DatePicker
            onChange={onChange}
            placeholder={tFilter("selectYear")}
            picker="year"
            className="w-full !py-2 !px-3"
          />
        );
    }
  }, [date]);
  return (
    <div className="w-full flex md:flex-row flex-col dark:bg-black-50 dark:text-white lg:gap-2 gap-5">
      <ul className="flex items-center lg:justify-start justify-end gap-2">
        {dataDate.map((item, index) => (
          <li
            key={index}
            className={clsx(
              "text-[0.813rem] h-fit text-neutral-300 font-normal cursor-pointer hover:rounded-[0.625rem] py-2.5 px-5 hover:bg-primary-200 hover:text-white",
              date === item.name
                ? "bg-primary-200 text-white rounded-[0.625rem]"
                : "bg-transparent",
            )}
            onClick={() => setDate(item.name)}
          >
            {item.label}
          </li>
        ))}
      </ul>
      <div className="w-full">{selectFilterDate}</div>
    </div>
  );
};

export default SelectTypeDate;
