"use client";

import { Button, Modal } from "antd";
import { FaTrash } from "react-icons/fa";
import { useTranslations } from "next-intl";

interface Props {
  open: boolean;
  onClick?: () => void;
  onClose?: () => void;
}

const ModalDeleteUser = (props: Props) => {
  const { open, onClick, onClose } = props;

  const t = useTranslations("PermissionPage");
  const tCommon = useTranslations("Common");

  return (
    <Modal
      centered
      title={
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-10 h-10 bg-red-300 rounded-full">
            <FaTrash className="text-lg text-white" />
          </div>
          <div>
            <p className="text-lg">{t("deleteUser.title")}</p>
            <p className="text-base font-normal">
              {t("deleteUser.description")}
            </p>
          </div>
        </div>
      }
      footer={
        <div className="flex items-center justify-end gap-5">
          <Button onClick={onClose} className="md:w-[100px] w-1/2" size="large">
            {tCommon("goBack")}
          </Button>
          <Button
            className="md:w-[100px] w-1/2"
            type="primary"
            size="large"
            danger
            onClick={onClick}
          >
            {tCommon("confirm")}
          </Button>
        </div>
      }
      onCancel={onClose}
      open={open}
    />
  );
};

export default ModalDeleteUser;
