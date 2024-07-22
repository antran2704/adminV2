"use client";

import { ChangeEvent, Fragment, useState } from "react";
import { Button, Input, Modal, Radio, message as messageAntd } from "antd";
import type { RadioChangeEvent } from "antd";
import { InputPassword, InputSelectPhone } from "~/components/Input";
import { ICreateAdmin, ICreateInvestor, ICreateMerchant } from "~/interface";
import { EPlatform } from "~/enum";
import { checkEmail, checkPassword } from "~/helper/auth";
import {
  createAdmin,
  createInvestor,
  createMerchant,
} from "~/api-client/permission";
import { useTranslations } from "next-intl";

import MESSAGE_ERROR from "~/commons/error";
import hanldeErrorAxios from "~/helper/handleErrorAxios";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: () => void;
}

interface IField {
  value: string;
  message: string | null;
}
interface IForm {
  fullName: IField;
  phoneNumber: IField;
  password: IField;
  confirmPassword: IField;
  email: IField;
}

const initForm: IForm = {
  fullName: {
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
  phoneNumber: {
    value: "",
    message: null,
  },
  email: {
    value: "",
    message: null,
  },
};

const ModalCreatUser = (props: Props) => {
  const { open, onClose, onCreate } = props;

  const t = useTranslations("PermissionPage");
  const tCommon = useTranslations("Common");
  const tError = useTranslations("Error");
  const tSuccess = useTranslations("Success");

  const [messageApi, contextHolder] = messageAntd.useMessage();

  const [form, setForm] = useState<IForm>(initForm);
  const [codeArea, setCodeArea] = useState<string>("+84");
  const [selectTypeUpdate, setSelectTypeUpdate] = useState(1);
  const [selectFlatform, setSelectFlatform] = useState<EPlatform>(
    EPlatform.INVESTOR_WEB,
  );

  const [message, setMessage] = useState<string | null>(null);

  const onCloseModal = () => {
    onClose();
    setForm(initForm);

    if (message) setMessage(null);
  };

  // update data when change code area phone
  const onChangeCodeArea = (value: string) => {
    setCodeArea(value);
  };

  // update data when change input
  const onChangeForm = (value: string, name: string) => {
    if (message) setMessage(null);

    setForm({ ...form, [name]: { value, message: null } });
  };

  // update when select Platform
  const onSelectTypePlatform = (e: RadioChangeEvent) => {
    if (!e || !e.target) return;
    if (message) setMessage(null);

    const value: EPlatform = e.target.value as EPlatform;
    setSelectFlatform(value);
    setForm(initForm);
  };

  // handle check generate password manual or auto by server
  const onSelectTypeUpdate = (e: RadioChangeEvent) => {
    if (!e || !e.target) return;

    const value: number = e.target.value;
    setSelectTypeUpdate(value);
  };

  // handle check phone number is valid
  const checkPhoneNumber = (codeArea: string, phone: string): string => {
    let phoneNumber = phone;

    // check user input 0 in the first of phone number
    if (phoneNumber.length >= 10) {
      phoneNumber = phoneNumber.slice(1);
    }

    phoneNumber = codeArea.slice(1) + phoneNumber;

    return phoneNumber;
  };

  // handle call api create new user for Investor - Merchant - Admin
  const onSubmit = async () => {
    if (!selectFlatform) {
      setMessage("Vui lòng lựa chọn người dùng");
      return;
    }

    let data: ICreateAdmin | ICreateInvestor | ICreateMerchant = {
      companyName: form.fullName.value,
      email: form.email.value,
      fullName: form.fullName.value,
      isPasswordGenerated: true,
    };

    let phone: string = "";
    let validEmail: boolean = false;

    // check fields with each platform Investor - Merchant - Admin
    switch (selectFlatform) {
      case EPlatform.INVESTOR_WEB:
        if (!codeArea || !form.phoneNumber.value) {
          setForm({
            ...form,
            phoneNumber: {
              ...form.phoneNumber,
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

        phone = checkPhoneNumber(codeArea, form.phoneNumber.value);
        if (!phone) return;

        data = {
          phoneNumber: phone,
          fullName: form.fullName.value,
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

        if (!form.email.value) {
          setForm({
            ...form,
            email: {
              ...form.email,
              message: tError("inputField", { name: tError("fields") }),
            },
          });
          return;
        }

        validEmail = checkEmail(form.email.value);
        if (!validEmail) {
          setForm({
            ...form,
            email: {
              ...form.email,
              message: tError("invalidEmail"),
            },
          });
          return;
        }

        data = {
          companyName: form.fullName.value,
          email: form.email.value,
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

        if (!form.email.value) {
          setForm({
            ...form,
            email: {
              ...form.email,
              message: tError("inputField", { name: tError("fields") }),
            },
          });
          return;
        }

        validEmail = checkEmail(form.email.value);
        if (!validEmail) {
          setForm({
            ...form,
            email: {
              ...form.email,
              message: tError("invalidEmail"),
            },
          });
          return;
        }

        data = {
          fullName: form.fullName.value,
          email: form.email.value,
          isPasswordGenerated: true,
        };
    }

    // Check generate password manual by user or auto by server
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

    try {
      switch (selectFlatform) {
        case EPlatform.INVESTOR_WEB:
          await createInvestor(data as ICreateInvestor);
          break;

        case EPlatform.MERCHANT_WEB:
          await createMerchant(data as ICreateMerchant);
          break;

        default:
          await createAdmin(data as ICreateAdmin);
      }
      messageApi.success(tSuccess("create"));
      onCreate();
      onCloseModal();
    } catch (err) {
      const response = hanldeErrorAxios(err);
      messageApi.error(tError(response.message));

      if (response.statusCode === 409) {
        setMessage(tError("foundUser"));
      }

      messageApi.error(tError(MESSAGE_ERROR.TRY_AGAIN));
    }
  };

  return (
    <Fragment>
      <Modal
        title={
          <h4 className="lg:text-xl text-lg font-semibold text-primary-200">
            {t("createUser.title")}
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
        <div>
          <Radio.Group
            onChange={onSelectTypePlatform}
            name="platform"
            value={selectFlatform}
            className="py-2"
          >
            <Radio value={EPlatform.INVESTOR_WEB}>{t("investor")}</Radio>
            <Radio value={EPlatform.MERCHANT_WEB}>{t("merchant")}</Radio>
            <Radio value={EPlatform.ADMIN_WEB}>{t("admin")}</Radio>
          </Radio.Group>

          {/* Form create Investor */}
          {selectFlatform === EPlatform.INVESTOR_WEB && (
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
                  {t("createUser.phoneNumber")}
                </p>
                <InputSelectPhone
                  selectedCode={codeArea}
                  maxLength={10}
                  placeholder="xxxx - xxxx - xxxx"
                  name="phoneNumber"
                  value={form.phoneNumber.value}
                  onChange={onChangeForm}
                  onChangeCodeArea={onChangeCodeArea}
                  important={true}
                />
                {form.phoneNumber.message && (
                  <p className="text-sm text-red-200">
                    {form.phoneNumber.message}
                  </p>
                )}
              </div>
            </Fragment>
          )}

          {/* Form create Investor */}
          {selectFlatform === EPlatform.MERCHANT_WEB && (
            <Fragment>
              <div className="py-2">
                <p className="text-sm font-semibold min-w-[100px] w-fit whitespace-nowrap pb-1">
                  {t("createUser.companyName")}
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
                  name="email"
                  value={form.email.value}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    onChangeForm(e.target.value, e.target.name)
                  }
                  status={form.email.message ? "error" : ""}
                />

                {form.email.message && (
                  <p className="text-sm text-red-200">{form.email.message}</p>
                )}
              </div>
            </Fragment>
          )}

          {/* Form create Admin */}
          {selectFlatform === EPlatform.ADMIN_WEB && (
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
                  name="email"
                  value={form.email.value}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    onChangeForm(e.target.value, e.target.name)
                  }
                  status={form.email.message ? "error" : ""}
                />

                {form.email.message && (
                  <p className="text-sm text-red-200">{form.email.message}</p>
                )}
              </div>
            </Fragment>
          )}

          <div className="py-2">
            <p className="text-sm font-semibold min-w-[100px] w-fit whitespace-nowrap pb-1">
              {t("createUser.password")}
              <span className="text-red-200">*</span>
            </p>

            <Radio.Group onChange={onSelectTypeUpdate} value={selectTypeUpdate}>
              {selectFlatform === EPlatform.INVESTOR_WEB && (
                <Radio className="w-full" value={1}>
                  {t("createUser.sendToPhone")}
                </Radio>
              )}
              {selectFlatform !== EPlatform.INVESTOR_WEB && (
                <Radio className="w-full" value={1}>
                  {t("createUser.sendToEmail")}
                </Radio>
              )}
              <Radio className="w-full" value={2}>
                {t("createUser.createPassword")}
              </Radio>
            </Radio.Group>

            {selectTypeUpdate === 2 && (
              <div>
                <div className="py-2">
                  <p className="text-sm font-semibold min-w-[100px] w-fit whitespace-nowrap pb-1">
                    {t("createUser.password")}
                  </p>
                  <InputPassword
                    className="!py-2 !rounded-lg"
                    placeholder="*****"
                    name="password"
                    value={form.password.value}
                    onChange={onChangeForm}
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
                    {t("createUser.confirmPassword")}
                  </p>
                  <InputPassword
                    className="!py-2 !rounded-lg"
                    placeholder="*****"
                    name="confirmPassword"
                    value={form.confirmPassword.value}
                    onChange={onChangeForm}
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
            {message && <p className="text-sm text-red-200 py-2">{message}</p>}
          </div>
        </div>
      </Modal>

      {/* message antd */}
      {contextHolder}
    </Fragment>
  );
};

export default ModalCreatUser;
