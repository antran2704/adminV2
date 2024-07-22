"use client";

import { ChangeEvent, Fragment, useEffect, useState } from "react";
import { Button, Input, Modal, Radio, message as messageAntd } from "antd";
import type { RadioChangeEvent } from "antd";
import { InputPassword, InputSelectPhone } from "~/components/Input";
import { IUpdateUser, IUser } from "~/interface";
import { checkEmail, checkPassword } from "~/helper/auth";
import { updateInfoUser } from "~/api-client/permission";
import { EPlatform } from "~/enum";
import { useTranslations } from "next-intl";
import { checkPhoneNumber } from "~/helper/phoneNumber";
import { ModalConfirm } from "~/components/Modal";
import MESSAGE_ERROR from "~/commons/error";
import clsx from "clsx";

interface Props {
  user: IUser | null;
  platform: EPlatform;
  open: boolean;
  onClose: () => void;
  onUpdate: () => void;
}
interface IField {
  value: string;
  message: string | null;
}

interface IForm {
  fullName: IField;
  username: IField;
  password: IField;
  confirmPassword: IField;
}

const initForm: IForm = {
  fullName: {
    value: "",
    message: null,
  },
  username: {
    value: "",
    message: null,
  },
  password: {
    value: "",
    message: null,
  },
  confirmPassword: {
    value: "",
    message: null,
  },
};

const ModalUpdateUser = (props: Props) => {
  const { user, open, platform, onClose, onUpdate } = props;

  const t = useTranslations("PermissionPage");
  const tCommon = useTranslations("Common");
  const tError = useTranslations("Error");
  const tSuccess = useTranslations("Success");

  const [selectTypeUpdate, setSelectTypeUpdate] = useState(1);
  const [dataSend, setDataSend] = useState<IUpdateUser | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState<IForm>(initForm);
  const [codeArea, setCodeArea] = useState<string>("+84");
  const [messageApi, contextHolder] = messageAntd.useMessage();

  const [modalConfirmUpdate, setModalConfirmUpdate] = useState(false);

  const onCloseModal = () => {
    onClose();
    setDataSend(null);
    setForm(initForm);
  };

  const onChangeCodeArea = (value: string) => {
    setCodeArea(value);
  };

  const onChangeForm = (value: string, name: string) => {
    if (message) setMessage(null);

    setForm({ ...form, [name]: { value, message: null } });
  };

  const onShowModalConfirmUpdate = () => {
    setModalConfirmUpdate(!modalConfirmUpdate);
  };

  const onSelectTypeUpdate = (e: RadioChangeEvent) => {
    setSelectTypeUpdate(e.target.value);
  };

  const onSubmit = () => {
    if (!user?._id) return;

    let data: IUpdateUser = {
      fullname: "",
      username: "",
      isPasswordGenerated: true,
    };

    let phone: string = "";
    let validEmail: boolean = false;

    switch (platform) {
      case EPlatform.INVESTOR_WEB:
        if (!codeArea || !form.username.value) {
          setForm({
            ...form,
            username: {
              ...form.username,
              message: tError("inputField", { name: tError("fields") }),
            },
          });
        }

        if (!form.fullName.value) {
          setForm({
            ...form,
            fullName: {
              ...form.fullName,
              message: tError("inputField", { name: tError("fields") }),
            },
          });
          return;
        }

        phone = checkPhoneNumber(codeArea, form.username.value);
        if (!phone) return;

        data = {
          username: phone,
          fullname: form.fullName.value,
          isPasswordGenerated: true,
        };
        break;

      case EPlatform.MERCHANT_WEB:
        if (!form.fullName.value) {
          setForm({
            ...form,
            fullName: {
              ...form.fullName,
              message: tError("inputField", { name: tError("fields") }),
            },
          });
          return;
        }

        if (!form.username.value) {
          setForm({
            ...form,
            username: {
              ...form.username,
              message: tError("inputField", { name: tError("fields") }),
            },
          });
          return;
        }

        validEmail = checkEmail(form.username.value);
        if (!validEmail) {
          setForm({
            ...form,
            username: {
              ...form.username,
              message: tError("invalidEmail"),
            },
          });
          return;
        }

        data = {
          fullname: form.fullName.value,
          username: form.username.value,
          isPasswordGenerated: true,
        };
        break;

      default:
        if (!form.fullName.value) {
          setForm({
            ...form,
            fullName: {
              ...form.fullName,
              message: tError("inputField", { name: tError("fields") }),
            },
          });
          return;
        }

        if (!form.username.value) {
          setForm({
            ...form,
            username: {
              ...form.username,
              message: tError("inputField", { name: tError("fields") }),
            },
          });
          return;
        }

        validEmail = checkEmail(form.username.value);
        if (!validEmail) {
          setForm({
            ...form,
            username: {
              ...form.username,
              message: tError("invalidEmail"),
            },
          });
          return;
        }

        data = {
          fullname: form.fullName.value,
          username: form.username.value,
          isPasswordGenerated: true,
        };
    }

    if (selectTypeUpdate === 2) {
      const inValidPassword = checkPassword(form.password.value as string);

      if (inValidPassword) {
        setForm({
          ...form,
          password: {
            ...form.password,
            message: inValidPassword,
          },
        });
        return;
      }

      if (form.password.value !== form.confirmPassword.value) {
        setForm({
          ...form,
          confirmPassword: {
            ...form.confirmPassword,
            message: "Mật khẩu xác nhận không đúng",
          },
        });
        return;
      }
      data = {
        ...data,
        isPasswordGenerated: false,
        password: form.password.value,
      };
    }

    setDataSend(data);
    onShowModalConfirmUpdate();
  };

  const onConfirm = async () => {
    if (!dataSend) return;

    try {
      await updateInfoUser(user?._id as string, dataSend, platform);

      onUpdate();
      onShowModalConfirmUpdate();
      messageApi.success(tSuccess("create"));
    } catch (error) {
      messageApi.error(tError(MESSAGE_ERROR.TRY_AGAIN));
    }
    onCloseModal();
  };

  useEffect(() => {
    if (user?._id) {
      if (platform === EPlatform.INVESTOR_WEB) {
        setForm({
          fullName: { value: user.fullName || "", message: null },
          username: { value: user.username.slice(2) || "", message: null },
          confirmPassword: { value: "", message: null },
          password: { value: "", message: null },
        });
      } else {
        setForm({
          fullName: { value: user.fullName || "", message: null },
          username: { value: user.username || "", message: null },
          confirmPassword: { value: "", message: null },
          password: { value: "", message: null },
        });
      }
    }
  }, [user, platform]);

  return (
    <Fragment>
      {/* Message antd */}
      {contextHolder}

      {/* Modal confirm */}
      <ModalConfirm
        title="Đổi mật khẩu tài khoản"
        subtitle="Bạn muốn đổi mật khẩu tài khoản này?"
        open={modalConfirmUpdate}
        type="danger"
        description="*Lưu ý: Mật khẩu mới được gửi qua mail/sđt tài khoản"
        onCancel={onShowModalConfirmUpdate}
        onOk={onConfirm}
        okText={tCommon("confirm")}
        cancelText={tCommon("goBack")}
        okButtonProps={{
          size: "large",
          className: clsx("md:w-[100px] w-1/2 !bg-[#F0A328]"),
        }}
        cancelButtonProps={{
          className: "md:w-[100px] w-1/2",
          size: "large",
        }}
        destroyOnClose={true}
      />

      {/* Modal update */}
      <Modal
        title={
          <h4 className="lg:text-xl text-lg font-semibold text-primary-200">
            {t("updateInfo.title")}
          </h4>
        }
        centered={true}
        open={open}
        onCancel={onCloseModal}
        destroyOnClose={true}
        footer={
          <div className="flex items-center justify-end gap-5">
            <Button
              onClick={onCloseModal}
              className="md:w-[100px] w-1/2"
              size="large"
            >
              {tCommon("goBack")}
            </Button>
            <Button
              className="md:w-[100px] w-1/2"
              type="primary"
              size="large"
              onClick={onSubmit}
            >
              {tCommon("confirm")}
            </Button>
          </div>
        }
      >
        {/* Form change password */}
        <div>
          {platform === EPlatform.INVESTOR_WEB && (
            <Fragment>
              <div className="py-2">
                <p className="text-sm font-semibold min-w-[100px] w-fit whitespace-nowrap pb-1">
                  Full Name
                </p>
                <Input
                  className="!py-2 !rounded-lg"
                  placeholder="Nhập user name"
                  name="fullName"
                  value={form.fullName.value}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    onChangeForm(e.target.value, e.target.name)
                  }
                  status={form.fullName.message ? "error" : ""}
                />
                {form.fullName.message && (
                  <p className="text-sm text-red-200">
                    {form.fullName.message}
                  </p>
                )}
              </div>
              <div className="py-2">
                <p className="text-sm font-semibold min-w-[100px] w-fit whitespace-nowrap pb-1">
                  {t("updateInfo.phoneNumber")}
                </p>
                <InputSelectPhone
                  selectedCode={codeArea}
                  maxLength={10}
                  placeholder="xxxx - xxxx - xxxx"
                  name="username"
                  value={form.username.value}
                  onChange={onChangeForm}
                  onChangeCodeArea={onChangeCodeArea}
                  important={true}
                />

                {form.username.message && (
                  <p className="text-sm text-red-200">
                    {form.username.message}
                  </p>
                )}
              </div>
            </Fragment>
          )}

          {/* Form create Investor */}
          {platform === EPlatform.MERCHANT_WEB && (
            <Fragment>
              <div className="py-2">
                <p className="text-sm font-semibold min-w-[100px] w-fit whitespace-nowrap pb-1">
                  {t("updateInfo.companyName")}
                </p>
                <Input
                  className="!py-2 !rounded-lg"
                  placeholder="Nhập company name"
                  name="fullName"
                  value={form.fullName.value}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    onChangeForm(e.target.value, e.target.name)
                  }
                  status={form.fullName.message ? "error" : ""}
                />

                {form.fullName.message && (
                  <p className="text-sm text-red-200">
                    {form.fullName.message}
                  </p>
                )}
              </div>
              <div className="py-2">
                <p className="text-sm font-semibold min-w-[100px] w-fit whitespace-nowrap pb-1">
                  Email
                </p>
                <Input
                  className="!py-2 !rounded-lg"
                  placeholder="Nhập user name"
                  name="username"
                  value={form.username.value}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    onChangeForm(e.target.value, e.target.name)
                  }
                  status={form.username.message ? "error" : ""}
                />

                {form.username.message && (
                  <p className="text-sm text-red-200">
                    {form.username.message}
                  </p>
                )}
              </div>
            </Fragment>
          )}

          {/* Form create Admin */}
          {platform === EPlatform.ADMIN_WEB && (
            <Fragment>
              <div className="py-2">
                <p className="text-sm font-semibold min-w-[100px] w-fit whitespace-nowrap pb-1">
                  Full Name
                </p>
                <Input
                  className="!py-2 !rounded-lg"
                  placeholder="Nhập user name"
                  name="fullName"
                  value={form.fullName.value}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    onChangeForm(e.target.value, e.target.name)
                  }
                  status={form.fullName.message ? "error" : ""}
                />

                {form.fullName.message && (
                  <p className="text-sm text-red-200">
                    {form.fullName.message}
                  </p>
                )}
              </div>
              <div className="py-2">
                <p className="text-sm font-semibold min-w-[100px] w-fit whitespace-nowrap pb-1">
                  Email
                </p>
                <Input
                  className="!py-2 !rounded-lg"
                  placeholder="Nhập user name"
                  name="username"
                  value={form.username.value}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    onChangeForm(e.target.value, e.target.name)
                  }
                  status={form.username.message ? "error" : ""}
                />
                {form.username.message && (
                  <p className="text-sm text-red-200">
                    {form.username.message}
                  </p>
                )}
              </div>
            </Fragment>
          )}
          <div className="py-2">
            <p className="text-sm font-semibold min-w-[100px] w-fit whitespace-nowrap pb-1">
              {t("updateInfo.password")} <span className="text-red-200">*</span>
            </p>

            <Radio.Group onChange={onSelectTypeUpdate} value={selectTypeUpdate}>
              {platform === EPlatform.INVESTOR_WEB && (
                <Radio className="w-full" value={1}>
                  {t("createUser.sendToPhone")}
                </Radio>
              )}
              {platform !== EPlatform.INVESTOR_WEB && (
                <Radio className="w-full" value={1}>
                  {t("createUser.sendToEmail")}
                </Radio>
              )}
              <Radio className="w-full" value={2}>
                {t("updateInfo.createPassword")}
              </Radio>
            </Radio.Group>

            {selectTypeUpdate === 2 && (
              <div>
                <div className="py-2">
                  <p className="text-sm font-semibold min-w-[100px] w-fit whitespace-nowrap pb-1">
                    {t("updateInfo.password")}
                  </p>
                  <InputPassword
                    className="!py-2 !rounded-lg"
                    placeholder="*****"
                    name="password"
                    onChange={onChangeForm}
                    value={form.password.value}
                    isError={!!form.password.message}
                  />

                  {form.password.message && (
                    <p className="text-sm text-red-200">
                      {form.password.message}
                    </p>
                  )}
                </div>
                <div className="py-2">
                  <p className="text-sm font-semibold min-w-[100px] w-fit whitespace-nowrap pb-1">
                    {t("updateInfo.confirmPassword")}
                  </p>
                  <InputPassword
                    className="!py-2 !rounded-lg"
                    placeholder="*****"
                    onChange={onChangeForm}
                    name="confirmPassword"
                    value={form.confirmPassword.value}
                    isError={!!form.confirmPassword.message}
                  />

                  {form.confirmPassword.message && (
                    <p className="text-sm text-red-200">
                      {form.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
          {message && <p className="text-sm text-red-200">{message}</p>}
        </div>
      </Modal>
    </Fragment>
  );
};

export default ModalUpdateUser;
