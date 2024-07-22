import { message } from "antd";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { Fragment, memo } from "react";
import { FiCopy } from "react-icons/fi";

interface Props {
  value: string;
  className?: string;
}

const Copy = (props: Props) => {
  const { value, className } = props;

  const tCommon = useTranslations("Common");
  const [messageApi, contextHolder] = message.useMessage();

  const onClick = () => {
    navigator.clipboard.writeText(value);
    messageApi.success(tCommon("copied"));
  };

  return (
    <Fragment>
      <FiCopy
        className={clsx(
          "cursor-pointer hover:opacity-50 transition-all ease-linear duration-75",
          className,
        )}
        onClick={onClick}
      />

      {contextHolder}
    </Fragment>
  );
};

export default memo(Copy);
