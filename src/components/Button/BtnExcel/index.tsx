import { Button, ButtonProps } from "antd";
import { useTranslations } from "next-intl";
import { DownloadOutlined } from "@ant-design/icons";

interface Props extends ButtonProps {}

const BtnExcel = (props: Props) => {
  const tCommon = useTranslations("Common");

  return (
    <Button
      className="!flex items-center"
      icon={<DownloadOutlined />}
      {...props}
    >
      {tCommon("exportExcel")}
    </Button>
  );
};

export default BtnExcel;
