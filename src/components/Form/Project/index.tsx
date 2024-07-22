import { Input, Select, Space, message } from "antd";
import { DefaultOptionType } from "antd/es/select";
import { UploadFile as UploadFileType } from "antd/es/upload";
import { useTranslations } from "next-intl";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import clsx from "clsx";
import { Controller, UseFormReturn } from "react-hook-form";

import { getDistricts, getProvinces, getWards } from "~/api-client/location";
import { activeProject, disableProject } from "~/api-client/project";
import { getListUser } from "~/api-client/permission";

import UploadFile from "~/components/File/Upload";
import UploadImage from "~/components/Image/Upload";
import ListTag from "~/components/ListTags";
import { ModalConfirm } from "~/components/Modal";

import { EOrderType, EPlatform, EProductStatus } from "~/enum";
import { ETypeFile } from "~/enum/file";
import {
  ICreateProject,
  ILocation,
  IParamaterListUser,
  IProject,
  IUser,
} from "~/interface";

import { formatBigNumber, revertBigNumberToString } from "~/helper/format";
import hanldeErrorAxios from "~/helper/handleErrorAxios";

const { Option } = Select;

const initMerchantParam: IParamaterListUser = {
  order: EOrderType.DESC,
  page: 1,
  platform: EPlatform.MERCHANT_WEB,
  search: "",
  take: 30,
};

interface Category {
  value: string;
  label: string;
}

const categories: Category[] = [
  { value: "Bất động sản", label: "Bất động sản" },
  { value: "Du lịch", label: "Du lịch" },
  { value: "Pháp lý", label: "Pháp lý" },
];

interface Props {
  data?: IProject | null;
  form: UseFormReturn<ICreateProject, any, undefined>;
  fileList?: UploadFileType[];
  fileListStructure?: UploadFileType | null;
  isEdit?: boolean;
  status?: EProductStatus | null;
  onEdit?: () => void;
  onSubmit?: (values: ICreateProject) => void;
  handleChangeStatus?: (value: EProductStatus) => void;
  handleChangeThumbnail: (file: File | null) => void;
  handleChangeDocumentStructure: (file: UploadFileType) => void;
  handleChangeDocumnent: (file: UploadFileType[]) => void;
  hanldeRemoveDocumnet?: (file: UploadFileType) => void;
  hanldeRemoveDocumnetStructure?: (file: UploadFileType | null) => void;
}

const ProjectForm = (props: Props) => {
  const {
    data = null,
    fileList,
    fileListStructure = null,
    form,
    isEdit = true,
    status,
    onSubmit,
    handleChangeStatus,
    handleChangeDocumnent,
    handleChangeDocumentStructure,
    handleChangeThumbnail,
    hanldeRemoveDocumnet,
    hanldeRemoveDocumnetStructure,
  } = props;

  const tProjectPage = useTranslations("ProjectPage");
  const tCommon = useTranslations("Common");
  const tError = useTranslations("Error");
  const tSuccess = useTranslations("Success");

  // form control
  const {
    control,
    clearErrors,
    setValue,
    getValues,
    formState: { errors },
    handleSubmit,
  } = form;

  // list data of merchant
  const [listMerchants, setListMerchant] = useState<IUser[]>([]);

  const [titleSelect, setTitleSelect] = useState<string>("");

  // get list location
  const [provinces, setProvinces] = useState<ILocation[]>([]);
  const [districts, setDistricts] = useState<ILocation[]>([]);
  const [wards, setWards] = useState<ILocation[]>([]);

  const [isOpenEnable, setIsOpenEnable] = useState<boolean>(false);
  const [isOpenDisable, setIsOpenDisable] = useState<boolean>(false);

  const [messageApi, contextHolder] = message.useMessage();

  const onModalEnable = () => {
    setIsOpenEnable(!isOpenEnable);
  };

  const onModalDisable = () => {
    setIsOpenDisable(!isOpenDisable);
  };

  const onChangeStatus = (value: EProductStatus) => {
    if (!data || !data._id) return;

    switch (value) {
      case EProductStatus.ENABLE:
        // handleEnable(projectId as string);
        onModalEnable();
        break;

      case EProductStatus.DISABLE:
        // handleDisable(projectId as string);
        onModalDisable();
        break;
    }
  };

  const onChangeTypeNumber = (
    value: string,
    name: "quantityOfUnit" | "quantityOfFloor",
  ) => {
    const validNumber = Number(revertBigNumberToString(value));
    if (isNaN(validNumber)) return;

    if (errors[name]) {
      clearErrors(name);
    }

    setValue(name, validNumber);
  };

  const onChangeDocument = useCallback(
    (file: UploadFileType[] | UploadFileType | null) => {
      handleChangeDocumnent(file as UploadFileType[]);
    },
    [fileList],
  );

  const onRemoveDocumnent = useCallback(
    (file: UploadFileType | null) => {
      if (errors.projectDocument) {
        clearErrors("projectDocument");
      }

      if (hanldeRemoveDocumnet) {
        hanldeRemoveDocumnet(file as UploadFileType);
      }
    },
    [fileList, errors.projectDocument],
  );

  const onRemoveDocumnentStructure = useCallback(
    (file: UploadFileType | null) => {
      if (errors.assetStructure) {
        clearErrors("assetStructure");
      }

      if (hanldeRemoveDocumnetStructure) {
        hanldeRemoveDocumnetStructure(file as UploadFileType);
      }
    },
    [fileListStructure, errors.assetStructure],
  );

  //   handle call api enable project
  const handleEnable = async (projectId: string) => {
    if (!projectId) return;

    try {
      await activeProject(projectId);
      messageApi.success(tSuccess("ok"));

      if (handleChangeStatus) handleChangeStatus(EProductStatus.ENABLE);
      setTitleSelect(tProjectPage("process"));
      onModalEnable();
    } catch (err) {
      const response = hanldeErrorAxios(err);
      messageApi.error(tError(response.message));
    }
  };

  //   handle call api disable project
  const handleDisable = async (projectId: string) => {
    try {
      await disableProject(projectId);
      messageApi.success(tSuccess("ok"));

      if (handleChangeStatus) handleChangeStatus(EProductStatus.DISABLE);
      setTitleSelect(tProjectPage("cancel"));
      onModalDisable();
    } catch (err) {
      const response = hanldeErrorAxios(err);
      messageApi.error(tError(response.message));
    }
  };

  // on change form when select Provices - District - Ward
  const onSelectAddress = async (_: string, option: DefaultOptionType) => {
    const name: "addressProvince" | "addressDistrict" | "addressWard" =
      option.name;
    const value: string = option.value as string;
    const key: string = option.key as string;
    if (!name) return;

    if (name === "addressProvince") {
      const districtData: ILocation[] = await getDistricts(key);
      setDistricts(districtData);
      setWards([]);
      setValue("addressDistrict", "");
      setValue("addressWard", "");
    }

    if (name === "addressDistrict") {
      const wardData: ILocation[] = await getWards(key);
      setWards(wardData);
      setValue("addressWard", "");
    }

    setValue(name, value);
  };

  const handleGetDataAddress = async () => {
    const address: string[] = data?.projectAddress
      ? data.projectAddress.split(", ")
      : [];

    const provinceId = provinces.find(
      (item: ILocation) => item.name === address[2],
    );

    const districtData: ILocation[] = await getDistricts(
      provinceId?.locationId as string,
    );

    const districtId = districtData.find(
      (item: ILocation) => item.name === address[1],
    );

    const wardData: ILocation[] = await getWards(
      districtId?.locationId as string,
    );

    setDistricts(districtData);
    setWards(wardData);
  };

  const onChangeTags = useCallback(
    (tags: string[]) => {
      setValue("convenientServices", tags);
    },
    [getValues("convenientServices")],
  );

  // get list provinces
  const handleGetProvinces = async () => {
    try {
      const payload: ILocation[] = await getProvinces();
      setProvinces(payload);
    } catch (error) {
      return error;
    }
  };

  // get list merchant
  const handleGetMerchants = async (query: IParamaterListUser) => {
    try {
      const payload = await getListUser(query);

      if (payload) {
        const list: IUser[] = payload.data.map((item: IUser) => ({
          ...item,
          key: item._id,
          action: item._id,
          username: item.username,
          fullName: item.fullName,
          disabledAccount: { status: item.disabledAccount, userId: item._id },
        }));
        setListMerchant(list);
      }
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    handleGetMerchants(initMerchantParam);
    handleGetProvinces();
  }, []);

  useEffect(() => {
    if (data && data._id) {
      const currentTitleSelect: string =
        data.projectStatus === EProductStatus.ENABLE
          ? tProjectPage("process")
          : data.projectStatus === EProductStatus.DISABLE
            ? tProjectPage("cancel")
            : tProjectPage("pending");

      // setStatus(data.projectStatus);
      setTitleSelect(currentTitleSelect);
    }
  }, [data]);

  // get ward and district if have provinces
  useEffect(() => {
    if (data?._id && !!provinces.length) {
      handleGetDataAddress();
    }
  }, [data, provinces]);

  return (
    <div className="flex items-start justify-between xl:flex-row flex-col-reverse py-5 gap-5">
      <div className="xl:w-8/12 w-full flex flex-col gap-5">
        {/* name */}
        <div className="flex md:flex-row flex-col md:items-center md:gap-5 gap-2">
          <p className="text-sm min-w-[100px] w-fit whitespace-nowrap">
            {tProjectPage("create.form.name")}
            <span className="text-red-200">*</span>
          </p>
          <div
            className={clsx("relative w-full", [errors.projectName && "pb-2"])}
          >
            <Controller
              name="projectName"
              control={control}
              render={({ field }) => (
                <Input
                  className="!py-2 !rounded-lg"
                  placeholder="Nguyen Van A"
                  status={errors.projectName ? "error" : ""}
                  onPressEnter={onSubmit && handleSubmit(onSubmit)}
                  disabled={!isEdit}
                  {...field}
                />
              )}
            />
            {errors.projectName?.message && (
              <p className="absolute text-sm text-red-200">
                {errors.projectName.message}
              </p>
            )}
          </div>
        </div>

        {/* thumbnail */}
        <div className="flex md:flex-row flex-col md:items-start md:gap-5 gap-2">
          <p className="text-sm min-w-[100px] w-fit whitespace-nowrap">
            {tProjectPage("create.form.thumbnail")}
            <span className="text-red-200">*</span>
          </p>
          <div
            className={clsx("relative w-full", [errors.projectImage && "pb-2"])}
          >
            <Controller
              name="projectImage"
              control={control}
              render={({ field }) => (
                <div className="relative sm:w-[160px] w-full h-[160px] md:mx-0 mx-auto">
                  <Input
                    className="!absolute opacity-0 pointer-events-none"
                    {...field}
                  />
                  <UploadImage
                    src={field.value}
                    className={clsx("absolute top-0 left-0 right-0 bottom-0", [
                      isEdit ? "z-10" : "opacity-0 pointer-events-none z-0",
                    ])}
                    rules={[ETypeFile.JPEG, ETypeFile.PNG]}
                    onChangeImage={handleChangeThumbnail}
                  />
                  <img
                    src={field.value}
                    alt="image"
                    className={clsx(
                      "absolute top-0 left-0 right-0 bottom-0 w-full h-full object-cover object-center rounded-lg",
                      [!isEdit ? "z-10" : "opacity-0 pointer-events-none z-0"],
                    )}
                  />
                </div>
              )}
            />
            {errors.projectImage && (
              <p className="absolute text-sm text-red-200">
                {errors.projectImage.message}
              </p>
            )}
          </div>
        </div>

        {/* merchant */}
        <div className="flex md:flex-row flex-col md:items-center md:gap-5 gap-2">
          <p className="text-sm min-w-[100px] w-fit whitespace-nowrap">
            {tProjectPage("create.form.merchant")}
            <span className="text-red-200">*</span>
          </p>
          <div
            className={clsx("relative w-full", [
              errors.projectMerchantId && "pb-2",
            ])}
          >
            <Controller
              name="projectMerchantId"
              control={control}
              render={({ field }) => (
                <Select
                  showSearch
                  placeholder="Chọn nhà phát hành"
                  className="w-full"
                  size="large"
                  status={errors.projectMerchantId ? "error" : ""}
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
                  options={listMerchants.map((merchant: IUser) => ({
                    value: merchant._id,
                    label: merchant.fullName,
                    key: merchant._id,
                    name: "projectMerchantId",
                  }))}
                  disabled={!isEdit}
                  {...field}
                />
              )}
            />

            {errors.projectMerchantId && (
              <p className="absolute text-sm text-red-200">
                {errors.projectMerchantId.message}
              </p>
            )}
          </div>
        </div>

        {/* description */}
        <div className="flex md:flex-row flex-col md:items-start md:gap-5 gap-2">
          <p className="text-sm min-w-[100px] w-fit whitespace-nowrap">
            {tProjectPage("create.form.description")}
            <span className="text-red-200">*</span>
          </p>
          <div
            className={clsx("relative w-full", [
              errors.projectDescription && "pb-2",
            ])}
          >
            <Controller
              name="projectDescription"
              control={control}
              render={({ field }) => (
                <Input.TextArea
                  className="!py-2 !rounded-lg"
                  placeholder="Nhập mô tả dự án"
                  rows={4}
                  status={errors.projectDescription ? "error" : ""}
                  onPressEnter={onSubmit && handleSubmit(onSubmit)}
                  disabled={!isEdit}
                  {...field}
                />
              )}
            />

            {errors.projectDescription && (
              <p className="absolute text-sm text-red-200">
                {errors.projectDescription.message}
              </p>
            )}
          </div>
        </div>

        {/* category */}
        <div className="flex md:flex-row flex-col md:items-center md:gap-5 gap-2">
          <p className="text-sm min-w-[100px] w-fit whitespace-nowrap">
            {tProjectPage("create.form.category")}
            <span className="text-red-200">*</span>
          </p>
          <div
            className={clsx("relative w-full", [
              errors.projectCategories && "pb-2",
            ])}
          >
            <Controller
              name="projectCategories"
              control={control}
              render={({ field }) => (
                <Select
                  showSearch
                  mode="multiple"
                  className="w-full"
                  size="large"
                  placeholder="Lựa chọn thư mục"
                  status={errors.projectCategories ? "error" : ""}
                  options={categories}
                  filterOption={(input, option) =>
                    ((option?.label as string).toLowerCase() ?? "").includes(
                      input.toLowerCase(),
                    )
                  }
                  filterSort={(optionA, optionB) =>
                    ((optionA?.label as string) ?? "")
                      .toLowerCase()
                      .localeCompare(
                        ((optionB?.label as string) ?? "").toLowerCase(),
                      )
                  }
                  optionRender={(option) => <Space>{option.data.label}</Space>}
                  disabled={!isEdit}
                  {...field}
                />
              )}
            />

            {errors.projectCategories && (
              <p className="absolute text-sm text-red-200">
                {errors.projectCategories.message}
              </p>
            )}
          </div>
        </div>

        {/* Address */}
        <div className="flex md:flex-row flex-col md:justify-between lg:items-center items-start gap-5">
          <p className="text-sm min-w-[100px] w-fit whitespace-nowrap">
            {tProjectPage("create.form.address")}
          </p>

          <div className="w-full grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
            <div className="w-full">
              <Controller
                name="addressProvince"
                control={control}
                render={({ field: { value, ref } }) => (
                  <Select
                    showSearch
                    onChange={onSelectAddress}
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
                      name: "addressProvince",
                    }))}
                    value={value ? value : null}
                    disabled={!isEdit}
                    ref={ref}
                  />
                )}
              />
            </div>
            <div className="w-full">
              <Controller
                name="addressDistrict"
                control={control}
                render={({ field: { value, ref } }) => (
                  <Select
                    showSearch
                    onChange={onSelectAddress}
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
                      name: "addressDistrict",
                    }))}
                    value={value ? value : null}
                    disabled={!isEdit || !districts.length}
                    ref={ref}
                  />
                )}
              />
            </div>
            <div className="w-full">
              <Controller
                name="addressWard"
                control={control}
                render={({ field: { value, ref } }) => (
                  <Select
                    showSearch
                    onChange={onSelectAddress}
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
                      name: "addressWard",
                    }))}
                    value={value ? value : null}
                    disabled={!isEdit || !wards.length}
                    ref={ref}
                  />
                )}
              />
            </div>
          </div>
        </div>

        {/* utilities */}
        <div className="flex md:flex-row flex-col md:items-center md:gap-5 gap-2">
          <p className="text-sm min-w-[100px] w-fit whitespace-nowrap">
            {tProjectPage("create.form.utilities")}
          </p>

          <div
            className={clsx("w-full p-2 border rounded-lg", [
              !isEdit && "opacity-80 pointer-events-none cursor-not-allowed",
            ])}
          >
            <div
              className={clsx("relative w-full", [
                errors.convenientServices && "pb-2",
              ])}
            >
              <Controller
                name="convenientServices"
                control={control}
                render={({ field: { value } }) => (
                  <ListTag data={value} onChange={onChangeTags} />
                )}
              />

              {errors.convenientServices && (
                <p className="absolute text-sm text-red-200">
                  {errors.convenientServices.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* floors - apartment */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 items-center justify-between gap-5">
          <div className="w-full flex md:flex-row flex-col md:items-center md:gap-5 gap-2">
            <p className="text-sm min-w-[100px] w-fit whitespace-nowrap">
              {tProjectPage("create.form.area")}
            </p>

            <div
              className={clsx("relative w-full", [
                errors.quantityOfFloor && "lg:pb-5 pb-2",
              ])}
            >
              <Controller
                name="quantityOfFloor"
                control={control}
                render={({ field: { value, ref, name } }) => (
                  <Input
                    className="!py-2 !rounded-lg"
                    placeholder="Nhập số phân khu"
                    value={formatBigNumber(value)}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      onChangeTypeNumber(e.target.value, name)
                    }
                    ref={ref}
                    name={name}
                    disabled={!isEdit}
                    onPressEnter={onSubmit && handleSubmit(onSubmit)}
                  />
                )}
              />

              {errors.quantityOfFloor && (
                <p className="absolute text-sm text-red-200">
                  {errors.quantityOfFloor.message}
                </p>
              )}
            </div>
          </div>
          <div className="w-full flex md:flex-row flex-col md:items-center md:gap-5 gap-2">
            <p className="text-sm min-w-[100px] whitespace-nowrap">
              {tProjectPage("create.form.block")}
            </p>
            <div
              className={clsx("relative w-full", [
                errors.quantityOfUnit && "lg:pb-5 pb-2",
              ])}
            >
              <Controller
                name="quantityOfUnit"
                control={control}
                render={({ field: { value, ref, name } }) => (
                  <Input
                    className="!py-2 !rounded-lg"
                    placeholder="Nhập số block"
                    value={formatBigNumber(value)}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      onChangeTypeNumber(e.target.value, name)
                    }
                    ref={ref}
                    name={name}
                    disabled={!isEdit}
                    onPressEnter={onSubmit && handleSubmit(onSubmit)}
                  />
                )}
              />

              {errors.quantityOfUnit && (
                <p className="absolute text-sm text-red-200">
                  {errors.quantityOfUnit.message}
                </p>
              )}
            </div>
          </div>
          <div className="w-full flex md:flex-row flex-col md:items-center md:gap-5 gap-2">
            <p className="text-sm min-w-[100px] w-fit whitespace-nowrap">
              {tProjectPage("create.form.floors")}
            </p>

            <div
              className={clsx("relative w-full", [
                errors.quantityOfFloor && "lg:pb-5 pb-2",
              ])}
            >
              <Controller
                name="quantityOfFloor"
                control={control}
                render={({ field: { value, ref, name } }) => (
                  <Input
                    className="!py-2 !rounded-lg"
                    placeholder="Nhập số tầng"
                    value={formatBigNumber(value)}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      onChangeTypeNumber(e.target.value, name)
                    }
                    ref={ref}
                    name={name}
                    disabled={!isEdit}
                    onPressEnter={onSubmit && handleSubmit(onSubmit)}
                  />
                )}
              />

              {errors.quantityOfFloor && (
                <p className="absolute text-sm text-red-200">
                  {errors.quantityOfFloor.message}
                </p>
              )}
            </div>
          </div>
          <div className="w-full flex md:flex-row flex-col md:items-center md:gap-5 gap-2">
            <p className="text-sm min-w-[100px] whitespace-nowrap">
              {tProjectPage("create.form.apartments")}
            </p>
            <div
              className={clsx("relative w-full", [
                errors.quantityOfUnit && "lg:pb-5 pb-2",
              ])}
            >
              <Controller
                name="quantityOfUnit"
                control={control}
                render={({ field: { value, ref, name } }) => (
                  <Input
                    className="!py-2 !rounded-lg"
                    placeholder="Nhập số căn"
                    value={formatBigNumber(value)}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      onChangeTypeNumber(e.target.value, name)
                    }
                    ref={ref}
                    name={name}
                    disabled={!isEdit}
                    onPressEnter={onSubmit && handleSubmit(onSubmit)}
                  />
                )}
              />

              {errors.quantityOfUnit && (
                <p className="absolute text-sm text-red-200">
                  {errors.quantityOfUnit.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* link website */}
        <div className="flex md:flex-row flex-col md:items-center md:gap-5 gap-2">
          <p className="text-sm min-w-[100px] w-fit whitespace-nowrap">
            {tProjectPage("create.form.link")}
          </p>
          <Controller
            name="projectWebsite"
            control={control}
            render={({ field }) => (
              <Input
                className="!py-2 !rounded-lg"
                placeholder="Nhập Link Website"
                onPressEnter={onSubmit && handleSubmit(onSubmit)}
                disabled={!isEdit}
                {...field}
              />
            )}
          />
        </div>

        {/* Document */}
        <div className="flex md:flex-row flex-col md:items-start gap-2">
          <p className="text-sm min-w-[100px] w-fit whitespace-nowrap">
            {tProjectPage("create.form.file")}
            <span className="text-red-200">*</span>
          </p>

          <div className="md:w-6/12 w-full">
            <div
              className={clsx(
                "relative w-full flex items-center justify-center px-2 py-4 border rounded-xl",
              )}
            >
              <Controller
                name="projectDocument"
                control={control}
                render={({ field }) => (
                  <div className="w-full md:mx-0 mx-auto">
                    <Input
                      className="!absolute opacity-0 pointer-events-none"
                      {...field}
                    />
                    <UploadFile
                      multiple={true}
                      data={fileList || []}
                      onChangeFile={onChangeDocument}
                      onRemoveFile={onRemoveDocumnent}
                      rules={[ETypeFile.PDF]}
                      disable={!isEdit}
                    />
                  </div>
                )}
              />
            </div>
            {errors.projectDocument && (
              <p className="text-sm text-red-200">
                {errors.projectDocument.message}
              </p>
            )}
          </div>

          <ul className="md:w-2/12 w-full text-sm text-neutral-300 list-disc pl-5">
            <li>Kích thước tối đa 100MB</li>
            <li>Định dạng pdf</li>
          </ul>
          {/* </div> */}
        </div>

        {/* Document Structure */}
        <div className="w-full flex md:flex-row flex-col md:items-start gap-2">
          <p className="text-sm min-w-[100px] w-fit whitespace-nowrap">
            {tProjectPage("create.form.fileStructure")}
            <span className="text-red-200">*</span>
          </p>

          <div className="md:w-6/12 w-full">
            <div
              className={clsx(
                "relative w-full flex items-center justify-center px-2 py-4 border rounded-xl",
              )}
            >
              <Controller
                name="assetStructure"
                control={control}
                render={({ field }) => (
                  <div className="w-full md:mx-0 mx-auto">
                    <Input
                      className="!absolute opacity-0 pointer-events-none"
                      {...field}
                    />
                    <UploadFile
                      multiple={false}
                      disable={!!data?._id}
                      data={fileListStructure ? [fileListStructure] : []}
                      onChangeFile={(
                        file: UploadFileType[] | UploadFileType | null,
                      ) =>
                        handleChangeDocumentStructure(file as UploadFileType)
                      }
                      rules={[ETypeFile.EXCEL]}
                      onRemoveFile={onRemoveDocumnentStructure}
                    />
                  </div>
                )}
              />
            </div>
            {errors.assetStructure && (
              <p className="text-sm text-red-200">
                {errors.assetStructure.message}
              </p>
            )}
          </div>

          <ul className="md:w-2/12 w-full text-sm text-neutral-300 list-disc pl-5">
            <li>Kích thước tối đa 100MB</li>
            <li>Định dạng .csv</li>
            <li>
              Định dạng template mẫu:
              <span className="text-primary-200">Cau_truc_tai_san.csv</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="xl:w-3/12 w-full">
        {status && data?._id && (
          <div className="w-full flex md:flex-row flex-col md:items-center md:gap-5 gap-2">
            <p className="text-sm min-w-[100px] w-fit whitespace-nowrap">
              {tProjectPage("create.form.status")}
            </p>

            <Select
              onChange={onChangeStatus}
              value={titleSelect as EProductStatus}
              className="w-full"
              size="large"
              disabled={!isEdit}
            >
              {status !== EProductStatus.DISABLE && (
                <Option value={EProductStatus.DISABLE}>
                  {tProjectPage("cancel")}
                </Option>
              )}

              {status !== EProductStatus.ENABLE && (
                <Option value={EProductStatus.ENABLE}>
                  {tProjectPage("process")}
                </Option>
              )}
            </Select>
          </div>
        )}
      </div>

      {/* Modal Active Collection */}
      <ModalConfirm
        title="Niêm yết dự án"
        subtitle="Bạn muốn niêm yết dự án này?"
        open={isOpenEnable}
        type="info"
        description="*Lưu ý: Niêm yết tất cả NFT của dự án lên sàn"
        onCancel={onModalEnable}
        onOk={() => handleEnable(data?._id as string)}
        okText={tCommon("confirm")}
        cancelText={tCommon("goBack")}
        okButtonProps={{
          size: "large",
          className: clsx("md:w-[100px] w-1/2 !bg-primary-200"),
        }}
        cancelButtonProps={{
          className: "md:w-[100px] w-1/2",
          size: "large",
        }}
        destroyOnClose={true}
      />

      {/* Modal Disable Collection */}
      <ModalConfirm
        title="Hủy niêm yết dự án"
        subtitle="Bạn muốn hủy niêm yết dự án này?"
        open={isOpenDisable}
        type="danger"
        description="*Lưu ý: Hủy niêm yết tất cả các NFT của Bộ sưu tập, không thể thực hiện giao dịch"
        onCancel={onModalDisable}
        onOk={() => handleDisable(data?._id as string)}
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

      {/* message Antd */}
      {contextHolder}
    </div>
  );
};

export default ProjectForm;
