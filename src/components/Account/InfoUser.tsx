"use client";

import { ChangeEvent, useEffect, useState } from "react";
import {
  DatePicker,
  Input,
  Select,
  Modal,
  message as messageAntd,
  Button,
} from "antd";
import { GoPencil } from "react-icons/go";
import dayjs from "dayjs";

import { DefaultOptionType } from "antd/es/select";
import { InputPassword } from "../Input";
import { checkPassword } from "~/helper/auth";
import { ILocation } from "~/interface";
import { changePassword, updateMe } from "~/api-client/user";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { fetchUser } from "~/store/slice/user";
import { useTranslations } from "next-intl";
import { getDistricts, getProvinces, getWards } from "~/api-client/location";
import { DAY_DMY } from "~/commons/format";
import MESSAGE_ERROR from "~/commons/error";
import hanldeErrorAxios from "~/helper/handleErrorAxios";

const { Option } = Select;
interface IAddress {
  city: string;
  district: string;
  ward: string;
  street: string;
}

interface IFormData {
  name: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  identify: string;
  address: IAddress;
  department: string;
  role: string;
}

interface IFormChangePassword {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const initData: IFormData = {
  name: "",
  dateOfBirth: "",
  email: "",
  phone: "",
  identify: "",
  address: {
    city: "",
    district: "",
    ward: "",
    street: "",
  },
  role: "",
  department: "",
};

const initChangePassword: IFormChangePassword = {
  confirmPassword: "",
  newPassword: "",
  oldPassword: "",
};

const InforUser = () => {
  const t = useTranslations("AccountPage");
  const tCommon = useTranslations("Common");
  const tError = useTranslations("Error");
  const tSuccess = useTranslations("Success");

  const { infoUser } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState<IFormData>(initData);
  const [formPassword, setFormPassword] =
    useState<IFormChangePassword>(initChangePassword);

  // get list location
  const [provinces, setProvinces] = useState<ILocation[]>([]);
  const [districts, setDistricts] = useState<ILocation[]>([]);
  const [wards, setWards] = useState<ILocation[]>([]);

  const [message, setMessage] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loadingForm, setLoadingForm] = useState<boolean>(false);

  const onChangePassword = (value: string, name: string): void => {
    if (message) {
      setMessage(null);
    }
    setFormPassword({ ...formPassword, [name]: value });
  };

  const handleChangeAddress = (e: ChangeEvent<HTMLInputElement>): void => {
    if (!e || !e.target) return;

    const name = e.target.name as keyof IFormData;
    const value: string = e.target.value;

    setFormData({
      ...formData,
      address: { ...formData.address, [name]: value },
    });
  };

  const handleChangeForm = (e: ChangeEvent<HTMLInputElement>): void => {
    if (!e || !e.target) return;

    const name = e.target.name as keyof IFormData;
    const value: string = e.target.value;

    setFormData({ ...formData, [name]: value });
  };

  const onChangeDate = (date: string, dateString: string | string[]): void => {
    setFormData({ ...formData, dateOfBirth: dateString as string });
  };

  const onSelectAddress = async (_: string, option: DefaultOptionType) => {
    const name: string = option.name as string;
    const value: string = option.value as string;
    const key: string = option.key as string;
    if (!name) return;

    if (name === "city") {
      const districtData: ILocation[] = await getDistricts(key);
      setDistricts(districtData);
      setWards([]);

      setFormData({
        ...formData,
        address: { city: value, district: "", ward: "", street: "" },
      });
    }

    if (name === "district") {
      const wardData: ILocation[] = await getWards(key);
      setWards(wardData);
      setFormData({
        ...formData,
        address: { ...formData.address, district: value, ward: "", street: "" },
      });
    }

    if (name === "ward") {
      setFormData({
        ...formData,
        address: { ...formData.address, ward: value, street: "" },
      });
    }
  };

  const onSelect = (key: string, option: DefaultOptionType) => {
    const name: string = option.name as string;
    const value: string = option.value as string;
    if (!name) return;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const onShowModal = () => {
    if (isModalOpen) {
      setFormPassword(initChangePassword);
      setMessage(null);
    }

    setIsModalOpen(!isModalOpen);
  };

  const handleGetProvinces = async () => {
    try {
      const payload: ILocation[] = await getProvinces();
      setProvinces(payload);
    } catch (error) {
      return error;
    }
  };

  const onSubmitChangePassword = async () => {
    const inValidPassword = checkPassword(formPassword.newPassword);

    if (inValidPassword) {
      setMessage(inValidPassword);
      return;
    }

    if (formPassword.newPassword !== formPassword.confirmPassword) {
      setMessage(tError(MESSAGE_ERROR.CONFIRM_PASSWORD_INCORRECT));
      return;
    }

    // setLoading(true);

    try {
      await changePassword(
        formPassword.oldPassword,
        formPassword.newPassword,
      ).then((res) => res);

      onShowModal();
      messageAntd.success(tSuccess("ok"));
      setFormPassword(initChangePassword);
    } catch (err) {
      const response = hanldeErrorAxios(err);

      if (response.statusCode === 404) {
        setMessage("Mật khẩu không đúng");
      }
    }

    // setLoading(false);
  };

  const onSubmitUpdateInfo = async () => {
    if (!infoUser._id) return;
    setLoadingForm(true);

    let dataSend = {
      email: formData.email,
      fullName: formData.name,
      username: infoUser.username,
      phoneNumber: formData.phone,
      addressWard: "",
      addressDistrict: "",
      addressProvince: "",
      dateOfBirth: formData.dateOfBirth,
      gender: true,
      idCard: formData.identify,
      interesting: [],
    };

    if (
      formData.address.city &&
      formData.address.district &&
      formData.address.ward
    ) {
      dataSend = {
        ...dataSend,
        addressWard: formData.address.ward,
        addressDistrict: formData.address.district,
        addressProvince: formData.address.city,
      };
    }

    try {
      await updateMe(dataSend);
      await dispatch(fetchUser());
      messageAntd.success(tSuccess("ok"));
    } catch (error) {
      messageAntd.error(tError(MESSAGE_ERROR.TRY_AGAIN));
    }
    setLoadingForm(false);
  };

  const handleGetData = async () => {
    let province = formData.address.city;
    let district = formData.address.district;
    let ward = formData.address.ward;

    if (infoUser.address && !province) {
      const address = infoUser.address.split(",");
      province = address[2].trim();
      district = address[1].trim();
      ward = address[0].trim();
      const provinceId = provinces.find(
        (item: ILocation) => item.name === province,
      );

      const districtData: ILocation[] = await getDistricts(
        provinceId?.locationId as string,
      );

      const districtId = districtData.find(
        (item: ILocation) => item.name === district,
      );

      const wardData: ILocation[] = await getWards(
        districtId?.locationId as string,
      );

      setDistricts(districtData);
      setWards(wardData);
    }

    const data: IFormData = {
      name: infoUser.fullName,
      phone: infoUser.phoneNumber,
      dateOfBirth: infoUser.dateOfBirth
        ? infoUser.dateOfBirth
        : new Date().toLocaleDateString("en-GB"),
      identify: infoUser.idCard,
      email: infoUser.email,
      department: "",
      role: "",
      address: {
        city: province,
        district: district,
        ward: ward,
        street: "",
      },
    };

    setFormData(data);
  };

  useEffect(() => {
    if (infoUser._id) {
      handleGetData();
    }
  }, [infoUser]);

  useEffect(() => {
    handleGetProvinces();
  }, []);

  return (
    <div>
      <div className="flex flex-col py-2 gap-5">
        {/* Name */}
        <div className="flex md:flex-row flex-col md:items-center md:gap-5 gap-2">
          <p className="text-sm min-w-[100px] w-fit whitespace-nowrap">
            {t("form.name")}
          </p>
          <Input
            className="!py-2 !rounded-lg"
            placeholder="Nguyen Van A"
            name="name"
            value={formData.name}
            onChange={handleChangeForm}
          />
        </div>

        {/* Birthday - Identify */}
        <div className="flex md:flex-row flex-col md:justify-between md:items-center gap-5">
          <div className="lg:w-4/12 md:w-6/12 w-full flex md:flex-row flex-col md:items-center md:gap-5 gap-2">
            <p className="text-sm min-w-[100px] w-fit whitespace-nowrap">
              {t("form.birthday")}
            </p>
            <DatePicker
              size="large"
              className="w-full !py-2 !rounded-lg"
              name="dateOfBirth"
              inputReadOnly
              allowClear={false}
              format={DAY_DMY}
              onChange={onChangeDate}
              value={dayjs(formData.dateOfBirth, DAY_DMY) as any}
              placeholder="Chọn ngày sinh"
            />
          </div>
          <div className="lg:w-4/12 md:w-6/12 w-full flex md:flex-row flex-col md:items-center md:gap-5 gap-2">
            <p className="text-sm min-w-[100px] w-fit whitespace-nowrap">
              {t("form.identify")}
            </p>
            <Input
              className="w-full !py-2 !rounded-lg"
              placeholder="CMND/CCCD..."
              name="identify"
              value={formData.identify}
            />
          </div>
        </div>

        {/* Phone - Email */}
        <div className="flex md:flex-row flex-col md:justify-between md:items-center gap-5">
          <div className="lg:w-4/12 md:w-6/12 w-full flex md:flex-row flex-col md:items-center md:gap-5 gap-2">
            <p className="text-sm min-w-[100px] w-fit whitespace-nowrap">
              {t("form.phone")}
            </p>
            <Input
              className="!py-2 !rounded-lg"
              placeholder="Số điện thoại..."
              name="phone"
              value={formData.phone}
              onChange={handleChangeForm}
            />
          </div>
          <div className="lg:w-4/12 md:w-6/12 w-full flex md:flex-row flex-col md:items-center md:gap-5 gap-2">
            <p className="text-sm min-w-[100px] w-fit whitespace-nowrap">
              {t("form.email")}
            </p>
            <Input
              className="w-full !py-2 !rounded-lg"
              placeholder="example@gmail.com"
              name="email"
              value={formData.email}
              onChange={handleChangeForm}
            />
          </div>
        </div>

        {/* Address */}
        <div className="flex md:flex-row flex-col md:justify-between lg:items-center items-start gap-5">
          <p className="text-sm min-w-[100px] w-fit whitespace-nowrap">
            {t("form.address")}
          </p>

          <div className="w-full grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-5">
            <div className="w-full">
              <Select
                showSearch
                onChange={onSelectAddress}
                value={formData.address.city || null}
                className="w-full"
                placeholder="Thành phố"
                size="large"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label.toLowerCase() ?? "").includes(
                    input.toLowerCase(),
                  )
                }
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? "").toLowerCase())
                }
                options={provinces.map((province: ILocation) => ({
                  value: province.name,
                  label: province.name,
                  key: province.locationId,
                  name: "city",
                }))}
              />
            </div>
            <div className="w-full">
              <Select
                showSearch
                onChange={onSelectAddress}
                value={formData.address.district || null}
                className="w-full"
                placeholder="Quận"
                size="large"
                filterOption={(input, option) =>
                  (option?.label.toLowerCase() ?? "").includes(
                    input.toLowerCase(),
                  )
                }
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? "").toLowerCase())
                }
                options={districts.map((district: ILocation) => ({
                  value: district.name,
                  label: district.name,
                  key: district.locationId,
                  name: "district",
                }))}
              />
            </div>
            <div className="w-full">
              <Select
                showSearch
                onChange={onSelectAddress}
                value={formData.address.ward || null}
                className="w-full"
                placeholder="Phường"
                size="large"
                filterOption={(input, option) =>
                  (option?.label.toLowerCase() ?? "").includes(
                    input.toLowerCase(),
                  )
                }
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? "").toLowerCase())
                }
                options={wards.map((ward: ILocation) => ({
                  value: ward.name,
                  label: ward.name,
                  key: ward.locationId,
                  name: "ward",
                }))}
              />
            </div>
            <div className="w-full">
              <Input
                className="!py-2 !rounded-lg"
                placeholder="Địa chỉ..."
                name="street"
                value={formData.address.street}
                onChange={handleChangeAddress}
              />
            </div>
          </div>
        </div>

        {/* Department - Role */}
        <div className="flex md:flex-row flex-col md:justify-between md:items-center gap-5">
          <div className="lg:w-4/12 md:w-6/12 w-full flex md:flex-row flex-col md:items-center md:gap-5 gap-2">
            <p className="text-sm min-w-[100px] w-fit whitespace-nowrap">
              {t("form.department")}
            </p>
            <Select
              onChange={onSelect}
              defaultValue="Nam"
              className="w-full"
              size="large"
            >
              <Option value="Nam" name="department">
                Nam
              </Option>
              <Option value="Nữ" name="department">
                Nữ
              </Option>
            </Select>
          </div>
          <div className="lg:w-4/12 md:w-6/12 w-full flex md:flex-row flex-col md:items-center md:gap-5 gap-2">
            <p className="text-sm min-w-[100px] w-fit whitespace-nowrap">
              {t("form.role")}
            </p>
            <Select
              onChange={onSelect}
              defaultValue="Kinh doanh"
              className="w-full"
              size="large"
            >
              <Option value="Kinh doanh" name="role">
                Kinh doanh
              </Option>
              <Option value="Kinh doanh 2" name="role">
                Kinh doanh 2
              </Option>
            </Select>
          </div>
        </div>

        <div className="flex md:flex-row flex-col md:items-center md:gap-5 gap-2">
          <p className="text-sm whitespace-nowrap">
            {" "}
            {t("form.changePassword")}
          </p>
          <Button
            content={t("form.changePassword")}
            icon={<GoPencil />}
            onClick={onShowModal}
            type={"default"}
            className="sm:w-fit w-full px-6 gap-2"
          />
        </div>
      </div>

      <div className="flex items-center justify-end pt-5 gap-5">
        <Button size="large" type={"default"} href="/" className="w-[170px]">
          {tCommon("goBack")}
        </Button>
        <Button
          size="large"
          type="primary"
          onClick={onSubmitUpdateInfo}
          loading={loadingForm}
          className="w-[170px]"
        >
          {tCommon("save")}
        </Button>
      </div>

      <Modal
        title={
          <h4 className="text-lg font-semibold text-primary-200">
            Thay đổi mật khẩu
          </h4>
        }
        centered={true}
        open={isModalOpen}
        onCancel={onShowModal}
        destroyOnClose={true}
        footer={
          <div className="flex items-center justify-center gap-10">
            <Button
              content="Trở về"
              onClick={onShowModal}
              type={"default"}
              className="md:w-1/3 w-1/2 md:text-xs shadow-md"
            />
            <Button
              content="Lưu"
              onClick={onSubmitChangePassword}
              className="md:w-1/3 w-1/2 md:text-xs shadow-md"
            />
          </div>
        }
      >
        {/* Form change password */}
        <div>
          <div className="py-2">
            <p className="text-sm font-semibold min-w-[100px] w-fit whitespace-nowrap pb-1">
              Mật khẩu hiện tại
            </p>
            <InputPassword
              className="!py-2 !rounded-lg"
              placeholder="*****"
              onChange={onChangePassword}
              value={formPassword.oldPassword}
              name="oldPassword"
            />
          </div>
          <div className="py-2">
            <p className="text-sm font-semibold min-w-[100px] w-fit whitespace-nowrap pb-1">
              Mật khẩu mới
            </p>
            <InputPassword
              className="!py-2 !rounded-lg"
              placeholder="*****"
              name="newPassword"
              onChange={onChangePassword}
              value={formPassword.newPassword}
            />
          </div>
          <div className="py-2">
            <p className="text-sm font-semibold min-w-[100px] w-fit whitespace-nowrap pb-1">
              Xác nhận lại mật khẩu
            </p>
            <InputPassword
              className="!py-2 !rounded-lg"
              placeholder="*****"
              name="confirmPassword"
              onChange={onChangePassword}
              value={formPassword.confirmPassword}
            />
          </div>
          {message && <p className="text-sm text-red-200">{message}</p>}
        </div>
      </Modal>
    </div>
  );
};

export default InforUser;
