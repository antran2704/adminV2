import { useTranslation } from "react-i18next";
import { ChangeEvent, useState } from "react";
import { Button, Input, message as messageAntd } from "antd";
import { Link, useNavigate } from "react-router-dom";
import clsx from "clsx";

import { InputPassword } from "~/components/Input";

import { IAuthToken, ILogin } from "~/interface";
import { login } from "~/api-client/auth";

import MESSAGE_ERROR from "~/commons/error";
import { checkFields, setAuthToken } from "~/helper/auth";
import hanldeErrorAxios from "~/helper/handleErrorAxios";
import { LOGO } from "~/commons/image";

const initFormData: ILogin = {
  username: "",
  password: "",
};

const LoginPage = () => {
  const { t } = useTranslation("LoginPage");
  const { t: tCommon } = useTranslation("Common");
  const { t: tError } = useTranslation("Error");
  const navigate = useNavigate();

  const [form, setForm] = useState<ILogin>(initFormData);
  const [message, setMessage] = useState<string | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

  const onChange = (value: string, name: string): void => {
    if (message) {
      setMessage(null);
    }

    setForm({ ...form, [name]: value });
  };

  const onSubmit = async () => {
    const validField: boolean = checkFields(form);
    if (!validField) {
      setMessage(tError("inputField", { name: tError("fields") }));
      return;
    }
    setLoading(true);

    const dataSend: ILogin = {
      username: form.username,
      password: form.password,
    };

    try {
      const payload: IAuthToken = await login(dataSend);

      if (!payload) {
        messageAntd.error(tError(MESSAGE_ERROR.TRY_AGAIN));
      }

      const { accessToken, refreshToken } = payload;
      setAuthToken("accessToken", accessToken);
      setAuthToken("refreshToken", refreshToken);

      navigate("/");
    } catch (err) {
      const response = hanldeErrorAxios(err);

      if (response.statusCode === 401) {
        setMessage(tError(response.message));
        setForm({ ...form, password: "" });
      }
    }

    setLoading(false);
  };

  return (
    <div className="w-full p-8">
      <Link to={"/"}>
        <img
          src={LOGO}
          className="w-[200px]"
          alt="NFT Trade"
          title="NFT Trade"
        />
      </Link>

      <h1 className="lg:text-3xl md:text-2xl text-xl font-bold text-[#0459DD] mb-3 mt-10">
        {t("title")}
      </h1>
      {/* Form */}
      <div
        className={clsx(
          { "opacity-40": loading },
          "w-full flex flex-col gap-3",
        )}
      >
        <div>
          <p className="text-base mb-2">
            User name
            <span className="text-red-200">*</span>
          </p>
          <Input
            className="!py-2 !rounded-lg"
            placeholder="Nhập user name..."
            name="username"
            value={form.username}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onChange(e.target.value, e.target.name)
            }
          />
        </div>
        <InputPassword
          name="password"
          title={tCommon("field.password")}
          isError={false}
          important={true}
          value={form.password}
          onChange={onChange}
          placeholder={tCommon("placeholder.password")}
          onPressEnter={onSubmit}
        />

        {message && <p className="text-sm text-red-200">{message}</p>}
      </div>

      <div className="mt-4">
        <Button
          size="large"
          type="primary"
          onClick={onSubmit}
          loading={loading}
          className="w-full !py-6 !flex items-center justify-center !bg-[#0459DD] !text-lg !font-semibold"
        >
          {t("title")}
        </Button>
      </div>

      <div className="flex justify-center items-center mt-10">
        <Link
          to={"/forgetPassword"}
          className="font-normal hover:underline text-[#0459DD] text-base"
        >
          {t("btn.forgetPassword")}
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
