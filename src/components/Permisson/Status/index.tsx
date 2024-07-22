import { Switch, message } from "antd";
import { Fragment, useEffect, useState } from "react";
import { disableUser, enableUser } from "~/api-client/permission";

import "./Status.scss";
import { EPlatform } from "~/enum";
import { useTranslations } from "next-intl";
import MESSAGE_ERROR from "~/commons/error";

interface Props {
  userId: string;
  isCheck: boolean;
  platform: EPlatform;
}

const StatusUser = (props: Props) => {
  const { isCheck, userId, platform } = props;

  const tSuccess = useTranslations("Success");
  const tError = useTranslations("Error");

  const [checked, setChecked] = useState<boolean>(true);
  const [messageApi, contextHolder] = message.useMessage();

  const onChangeStatus = async (userId: string) => {
    try {
      if (checked) {
        await disableUser(userId, platform);
      } else {
        await enableUser(userId, platform);
      }

      setChecked(!checked);
      messageApi.success(tSuccess("ok"));
    } catch (error: any) {
      messageApi.error(tError(MESSAGE_ERROR.TRY_AGAIN));
    }
  };

  useEffect(() => {
    setChecked(isCheck);
  }, [isCheck]);

  return (
    <Fragment>
      {contextHolder}
      <Switch value={checked} onChange={() => onChangeStatus(userId)} />
    </Fragment>
  );
};

export default StatusUser;
