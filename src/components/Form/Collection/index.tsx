import { Input, Select, message } from "antd";
import { useTranslations } from "next-intl";
import {
  useCallback,
  useEffect,
  useState,
  MouseEvent,
  Dispatch,
  SetStateAction,
} from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { UploadFile as UploadFileType } from "antd/es/upload";
import clsx from "clsx";

import UploadImage from "~/components/Image/Upload";
import UploadFile from "~/components/File/Upload";
import { ModalConfirm } from "~/components/Modal";

import {
  activeCollection,
  disableCollection,
  merchantReviewCollection,
} from "~/api-client/collection";

import {
  ICollection,
  ICreateCollection,
  IPagination,
  IProject,
  ISearchProject,
  ISearchStructure,
  IStructure,
} from "~/interface";
import { ECollectionStatus, EOrderType, EProductStatus } from "~/enum";
import { ETypeFile } from "~/enum/file";

import MESSAGE_ERROR from "~/commons/error";

// style component
import "./Collection.scss";
import { initPagination } from "~/commons/pagination";
import { getProjectStructure, getProjects } from "~/api-client/project";
import { formatBigNumber } from "~/helper/format";
import { enableNFT, merchantReviewNFT } from "~/api-client/NFT";
import hanldeErrorAxios from "~/helper/handleErrorAxios";

const { Option } = Select;
interface Props {
  collection?: ICollection | null;
  project?: IProject | null;
  unit?: IStructure | null;
  form: UseFormReturn<ICreateCollection, any, undefined>;
  fileNFT?: UploadFileType | null;
  isEdit?: boolean;
  canSelectProject?: boolean;
  canSelectUnit?: boolean;
  selectProject: { label: string; value: string };
  selectUnit: { label: string; value: string };
  isSubmit?: boolean;
  status?: ECollectionStatus | null;
  handleChangeStatus?: (value: ECollectionStatus) => void;
  setIsSubmit?: Dispatch<SetStateAction<boolean>>;
  onEdit?: () => void;
  onSelectProject: (data: { label: string; value: string }) => void;
  onSelectUnit: (data: { label: string; value: string }) => void;
  onSubmit?: (values: ICreateCollection) => void;
  onUploadImage?: (file: File | null) => void;
  onUploadCoverImage?: (file: File | null) => void;
  handleChangeNFTFile?: (file: UploadFileType) => void;
  hanldeRemoveNFTFile?: (file: UploadFileType | null) => void;
}

const FormCollection = (props: Props) => {
  const {
    form,
    collection = null,
    project = null,
    unit = null,
    isEdit = true,
    canSelectProject = true,
    canSelectUnit = true,
    isSubmit = false,
    fileNFT = null,
    status,
    selectProject,
    selectUnit,
    setIsSubmit,
    handleChangeStatus,
    onSelectProject,
    onSelectUnit,
    onSubmit,
    onEdit,
    onUploadCoverImage,
    onUploadImage,
    handleChangeNFTFile,
    hanldeRemoveNFTFile,
  } = props;

  const t = useTranslations("CollectionPage");
  const tError = useTranslations("Error");
  const tSuccess = useTranslations("Success");
  const tCommon = useTranslations("Common");

  const {
    control,
    formState: { errors },
    getValues,
    setValue,
    handleSubmit,
  } = form;
  // List of project
  const [projects, setProjects] = useState<IProject[]>([]);

  // List of unit
  const [units, setUnits] = useState<IStructure[]>([]);

  // paramater for project
  const [paramaterProject, setParamaterProject] = useState<ISearchProject>({
    order: EOrderType.DESC,
    page: 1,
    take: 10,
    search: "",
    status: EProductStatus.ALL,
  });

  // paramater for project
  const [paramaterUnit, setParamaterUnit] = useState<ISearchStructure>({
    order: EOrderType.DESC,
    page: 1,
    take: 10,
    search: "",
    projectId: "",
    status: "AVAILABLE",
  });

  const [paginationProject, setPaginationProject] =
    useState<IPagination>(initPagination);

  const [paginationUnit, setPaginationUnit] =
    useState<IPagination>(initPagination);

  const [titleSelect, setTitleSelect] = useState<string>("");

  const [isOpenEnable, setIsOpenEnable] = useState<boolean>(false);
  const [isOpenDisable, setIsOpenDisable] = useState<boolean>(false);
  const [isOpenMerchant, setIsOpenMerchant] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();

  const onModalEnable = () => {
    setIsOpenEnable(!isOpenEnable);
  };

  const onModalDisable = () => {
    setIsOpenDisable(!isOpenDisable);
  };

  const onModalMerchant = () => {
    setIsOpenMerchant(!isOpenMerchant);
  };

  const onChangeStatus = (value: ECollectionStatus) => {
    if (!collection?._id) return;

    switch (value) {
      case ECollectionStatus.LISTED:
        onModalEnable();
        break;

      case ECollectionStatus.UNLISTED:
        onModalDisable();
        break;

      case ECollectionStatus.MERCHANT_REVIEW:
        onModalMerchant();
        break;
    }
  };

  const onChangeProject = (
    label: string,
    option: any,
    name: keyof ICreateCollection,
  ) => {
    form.setValue(name, option.key);

    setUnits([]);

    onSelectProject({ label, value: option.key });
  };

  const onChangeUnit = (
    label: string,
    option: any,
    name: keyof ICreateCollection,
  ) => {
    form.setValue(name, option.key);

    onSelectUnit({ label, value: option.key });
  };

  //   handle call api merchant review collection
  const handleMerchantReview = async (collectionId: string) => {
    if (!collectionId) return;

    try {
      await merchantReviewCollection(collectionId);
      merchantReviewNFT(collectionId);
      messageApi.success(tSuccess("ok"));

      if (handleChangeStatus) {
        handleChangeStatus(ECollectionStatus.ADMIN_REVIEW);
      }

      if (isEdit && onEdit) {
        onEdit();
      }

      setTitleSelect(t("pending"));
      onModalMerchant();
    } catch (error) {
      messageApi.error(tError(MESSAGE_ERROR.TRY_AGAIN));
    }
  };

  //   handle call api enable collection
  const handleEnable = async (collectionId: string) => {
    if (!collectionId) return;

    try {
      await activeCollection(collectionId);

      if (status === ECollectionStatus.ADMIN_REVIEW) {
        enableNFT(collectionId);
      }
      messageApi.success(tSuccess("ok"));

      if (handleChangeStatus) handleChangeStatus(ECollectionStatus.LISTED);

      if (isEdit && onEdit) {
        onEdit();
      }

      setTitleSelect(t("process"));
      onModalEnable();
    } catch (err) {
      const response = hanldeErrorAxios(err);
      messageApi.error(tError(response.message));
    }
  };

  //   handle call api disable collection
  const handleDisable = async (collectionId: string) => {
    try {
      await disableCollection(collectionId);
      messageApi.success(tSuccess("ok"));

      if (handleChangeStatus) handleChangeStatus(ECollectionStatus.UNLISTED);
      setTitleSelect(t("cancel"));
      onModalDisable();
    } catch (err) {
      const response = hanldeErrorAxios(err);
      messageApi.error(tError(response.message));
    }
  };

  // change publicPrice - quantityOfNFT
  // const onChangeTypeNumber = (
  //   value: string,
  //   name: "quantityOfNFTs" | "publicPrice"
  // ) => {
  //   const validNumber = Number(revertBigNumberToString(value));

  //   if (isNaN(validNumber)) return;

  //   if (errors[name]) {
  //     clearErrors(name);
  //   }

  //   setValue(name, validNumber.toString());
  // };

  // change public date
  // const onChangeDateTime = (dateStr: string, name: keyof ICollection) => {
  //   setValue(name, dateStr);
  // };

  // change projectCoverImage & projectImage
  const handleChangeImage = useCallback(
    async (file: File | null, name: "collectionImage") => {
      if (!file) {
        setValue(name, "");
      } else {
        setValue(name, file.lastModified.toString());
      }

      if (onUploadImage) {
        onUploadImage(file);
      }
    },
    [getValues("collectionImage")],
  );

  const handleChangeCoverImage = useCallback(
    async (file: File | null, name: "collectionCoverImage") => {
      if (!file) {
        setValue(name, "");
      } else {
        setValue(name, file.lastModified.toString());
      }

      if (onUploadCoverImage) {
        onUploadCoverImage(file);
      }
    },
    [getValues("collectionCoverImage")],
  );

  const handleGetProjects = async (query: ISearchProject) => {
    try {
      const payload = await getProjects(query);

      if (payload) {
        setProjects([...projects, ...payload.data]);
        setPaginationProject({
          total: payload.meta.itemCount,
          page: payload.meta.page,
          take: payload.meta.take,
          pageCount: payload.meta.pageCount,
        });
      }
    } catch (error) {
      return error;
    }
  };

  const handleGetUnits = async (projectId: string, query: ISearchStructure) => {
    try {
      const payload = await getProjectStructure(projectId, query);

      if (payload) {
        setUnits([...units, ...payload.data]);
        setPaginationUnit({
          total: payload.meta.itemCount,
          page: payload.meta.page,
          take: payload.meta.take,
          pageCount: payload.meta.pageCount,
        });
      }
    } catch (error) {
      return error;
    }
  };

  const onGetNextPageProject = () => {
    const nextPage: number = paramaterProject.page + 1;

    if (nextPage > (paginationProject.pageCount as number)) return;

    const newParam: ISearchProject = {
      ...paramaterProject,
      page: paramaterProject.page + 1,
    };

    handleGetProjects(newParam);
    setParamaterProject(newParam);
  };

  const onGetNextPageUnit = () => {
    const nextPage: number = paramaterUnit.page + 1;

    if (nextPage > (paginationUnit.pageCount as number)) return;

    const newParam: ISearchStructure = {
      ...paramaterUnit,
      page: paramaterUnit.page + 1,
    };

    handleGetUnits(selectProject.value, newParam);
    setParamaterUnit(newParam);
  };

  const handleScrollProject = (e: MouseEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const clientHeight = element.clientHeight;
    const scrollTop = element.scrollTop;
    if (clientHeight + scrollTop === element.scrollHeight) {
      onGetNextPageProject();
    }
  };

  const handleScrollUnit = (e: MouseEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const clientHeight = element.clientHeight;
    const scrollTop = element.scrollTop;
    if (clientHeight + scrollTop === element.scrollHeight) {
      onGetNextPageUnit();
    }
  };

  const handleSubmitCollection = () => {
    if (!isSubmit && !selectUnit.value) return;

    const newUnits = units.filter(
      (item: IStructure) => item._id !== selectUnit.value,
    );

    setUnits(newUnits);

    if (canSelectProject) {
      onSelectProject({ label: "", value: "" });
    }

    onSelectUnit({ label: "", value: "" });

    if (setIsSubmit) setIsSubmit(false);
  };

  useEffect(() => {
    if (status) {
      let currentTitleSelect: string;

      switch (status) {
        case ECollectionStatus.MERCHANT_REVIEW:
          currentTitleSelect = t("merchantReview");
          break;
        case ECollectionStatus.ADMIN_REVIEW:
          currentTitleSelect = t("pending");
          break;

        case ECollectionStatus.LISTED:
          currentTitleSelect = t("process");
          break;

        default:
          currentTitleSelect = t("cancel");
      }

      setTitleSelect(currentTitleSelect);
    }
  }, [status]);

  useEffect(() => {
    if (project && project._id) {
      onSelectProject({ label: project.projectName, value: project._id });
    }
  }, [project]);

  useEffect(() => {
    if (unit) {
      onSelectUnit({ label: unit.unitId, value: unit._id });
    }
  }, [unit]);

  useEffect(() => {
    if (selectProject.value) {
      const newParams: ISearchStructure = {
        ...paramaterUnit,
        projectId: selectProject.value as string,
      };

      setParamaterUnit(newParams);
      handleGetUnits(selectProject.value, newParams);
    }
  }, [selectProject]);

  useEffect(() => {
    if (!projects.length) {
      handleGetProjects(paramaterProject);
    }
  }, [canSelectProject]);

  useEffect(() => {
    if (isSubmit) {
      handleSubmitCollection();
    }
  }, [isSubmit]);

  return (
    <div>
      <div className="flex flex-col gap-5">
        {/* Name */}
        <div className="flex md:flex-row flex-col md:items-center md:gap-5 gap-2">
          <p className="text-sm min-w-[100px] w-fit whitespace-nowrap">
            {t("create.form.name")}
            <span className="text-red-200">*</span>
          </p>
          <div
            className={clsx("relative w-full", [
              errors.collectionName && "pb-2",
            ])}
          >
            <Controller
              name="collectionName"
              control={control}
              render={({ field }) => (
                <Input
                  className="!py-2 !rounded-lg"
                  placeholder="Nguyen Van A"
                  disabled={!isEdit}
                  status={errors.collectionName ? "error" : ""}
                  maxLength={255}
                  count={{ show: true, max: 255 }}
                  onPressEnter={onSubmit && handleSubmit(onSubmit)}
                  {...field}
                />
              )}
            />

            {errors.collectionName?.message && (
              <p className="absolute text-sm text-red-200">
                {errors.collectionName.message}
              </p>
            )}
          </div>
        </div>

        {/* Project */}
        <div className="w-full flex md:flex-row flex-col md:items-center md:gap-5 gap-2">
          <p className="text-sm min-w-[100px] w-fit whitespace-nowrap">
            {t("create.form.project")}
            <span className="text-red-200">*</span>
          </p>

          <div
            className={clsx("relative w-full", [errors.projectId && "pb-2"])}
          >
            <Controller
              name="projectId"
              control={control}
              render={({ field: { name, ref } }) => (
                <Select
                  showSearch
                  placeholder="Lựa chọn dự án"
                  className="w-full"
                  size="large"
                  status={errors.projectId ? "error" : ""}
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
                  options={projects.map((project: IProject) => ({
                    value: project.projectName,
                    label: project.projectName,
                    key: project._id,
                    name: "projectId",
                  }))}
                  onPopupScroll={handleScrollProject}
                  disabled={!canSelectProject}
                  onChange={(value, option) =>
                    onChangeProject(value, option, name)
                  }
                  value={selectProject.label}
                  ref={ref}
                />
              )}
            />

            {errors.projectId && (
              <p className="absolute text-sm text-red-200">
                {errors.projectId.message}
              </p>
            )}
          </div>
        </div>

        {/* Apartment */}
        <div className="w-full flex md:flex-row flex-col md:items-center md:gap-5 gap-2">
          <p className="text-sm min-w-[100px] w-fit whitespace-nowrap">
            {t("create.form.apartment")}
            <span className="text-red-200">*</span>
          </p>
          <div
            className={clsx("relative w-full", [errors.mintedSource && "pb-2"])}
          >
            <Controller
              name="mintedSource"
              control={control}
              render={({ field: { name, ref } }) => (
                <Select
                  showSearch
                  placeholder="Lựa chọn căn hộ"
                  className="w-full"
                  size="large"
                  status={errors.mintedSource ? "error" : ""}
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
                  options={units.map((unit: IStructure) => ({
                    value: unit.unitId,
                    label: unit.unitId,
                    key: unit._id,
                    name: "mintedSource",
                  }))}
                  onPopupScroll={handleScrollUnit}
                  disabled={!selectProject.value || !canSelectUnit}
                  onChange={(value, option) =>
                    onChangeUnit(value, option, name)
                  }
                  value={selectUnit.label}
                  ref={ref}
                />
              )}
            />

            {errors.mintedSource && (
              <p className="absolute text-sm text-red-200">
                {errors.mintedSource.message}
              </p>
            )}
          </div>
        </div>

        {/* Zone - Block - Floor */}
        {unit && (
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 md:gap-5 gap-2">
            <div className="flex md:flex-row flex-col md:items-center md:gap-5 gap-2">
              <p className="text-sm min-w-[100px] w-fit whitespace-nowrap">
                {t("create.form.area")}
              </p>
              <Input
                className="!py-2 !rounded-lg"
                value={unit?.zone}
                disabled={true}
              />
            </div>
            <div className="flex md:flex-row flex-col md:items-center md:gap-5 gap-2">
              <p className="text-sm w-fit whitespace-nowrap">
                {t("create.form.block")}
              </p>
              <Input
                className="!py-2 !rounded-lg"
                value={unit?.block}
                disabled={true}
              />
            </div>
            <div className="flex md:flex-row flex-col md:items-center md:gap-5 gap-2">
              <p className="text-sm  lg:min-w-fit min-w-[100px] w-fit whitespace-nowrap">
                {t("create.form.floor")}
              </p>
              <Input
                className="!py-2 !rounded-lg"
                value={unit?.floor}
                disabled={true}
              />
            </div>
          </div>
        )}

        {/* Thumbnail */}
        <div className="flex md:flex-row flex-col md:items-start md:gap-5 gap-2">
          <p className="text-sm min-w-[100px] w-fit whitespace-nowrap">
            {t("create.form.thumbnail")}
            <span className="text-red-200">*</span>
          </p>
          <div
            className={clsx("relative w-full", [
              errors.collectionImage && "pb-5",
            ])}
          >
            <div className="flex items-center gap-10">
              <div className="w-[160px] h-[160px] rounded-lg">
                <Controller
                  name="collectionImage"
                  control={control}
                  render={({ field }) => (
                    <div className="sm:w-[160px] w-full h-[160px] md:mx-0 mx-auto">
                      <Input
                        className="!absolute opacity-0 pointer-events-none"
                        {...field}
                      />
                      <div
                        className={clsx("w-full h-full", [
                          isEdit ? "block" : "hidden",
                        ])}
                      >
                        <UploadImage
                          src={field.value}
                          onChangeImage={(file: File | null) =>
                            handleChangeImage(file, "collectionImage")
                          }
                          rules={[ETypeFile.JPEG, ETypeFile.PNG]}
                        />
                      </div>

                      <img
                        src={field.value}
                        alt="thumbnail"
                        className={clsx(
                          "w-full h-full object-cover object-center rounded-lg",
                          [!isEdit ? "block" : "hidden"],
                        )}
                      />
                    </div>
                  )}
                />
              </div>
              <ul className="w-fit text-sm text-neutral-300 list-disc">
                <li>Tỉ lệ 16:9</li>
                <li>Kích thước tối đa 100MB</li>
                <li>Độ phân giải không quá 1280x1280</li>
                <li>Định dạng JPG, PNG, SVG</li>
                <li>Chọn từ thiết bị</li>
              </ul>
            </div>
            {errors.collectionImage && (
              <p className="absolute text-sm text-red-200">
                {errors.collectionImage.message}
              </p>
            )}
          </div>
        </div>

        {/* Avartar */}
        <div className="flex md:flex-row flex-col md:items-start md:gap-5 gap-2">
          <p className="text-sm min-w-[100px] w-fit whitespace-nowrap">
            {t("create.form.avartar")}
            <span className="text-red-200">*</span>
          </p>
          <div
            className={clsx("relative w-full", [
              errors.collectionImage && "pb-5",
            ])}
          >
            <div className="flex items-center gap-10">
              <div className="w-[160px] h-[160px] rounded-lg">
                <Controller
                  name="collectionCoverImage"
                  control={control}
                  render={({ field }) => (
                    <div className="sm:w-[160px] w-full h-[160px] md:mx-0 mx-auto">
                      <Input
                        className="!absolute opacity-0 pointer-events-none"
                        {...field}
                      />
                      <div
                        className={clsx("w-full h-full", [
                          isEdit ? "block" : "hidden",
                        ])}
                      >
                        <UploadImage
                          src={field.value}
                          onChangeImage={(file: File | null) =>
                            handleChangeCoverImage(file, "collectionCoverImage")
                          }
                          rules={[ETypeFile.JPEG, ETypeFile.PNG]}
                        />
                      </div>

                      <img
                        src={field.value}
                        alt="avartar"
                        className={clsx(
                          "w-full h-full object-cover object-center rounded-lg",
                          !isEdit ? "block" : "hidden",
                        )}
                      />
                    </div>
                  )}
                />
              </div>
              <ul className="w-fit text-sm text-neutral-300 list-disc">
                <li>Tỉ lệ 1:1</li>
                <li>Kích thước tối đa 100MB</li>
                <li>Độ phân giải không quá 1280x1280</li>
                <li>Định dạng JPG, PNG, SVG</li>
                <li>Chọn từ thiết bị</li>
              </ul>
            </div>
            {errors.collectionCoverImage && (
              <p className="absolute text-sm text-red-200">
                {errors.collectionCoverImage.message}
              </p>
            )}
          </div>
        </div>

        {/* description */}
        <div className="flex md:flex-row flex-col md:items-start md:gap-5 gap-2">
          <p className="text-sm min-w-[100px] w-fit whitespace-nowrap">
            {t("create.form.description")}
            <span className="text-red-200">*</span>
          </p>
          <div
            className={clsx("relative w-full", [
              errors.collectionDescription && "pb-2",
            ])}
          >
            <Controller
              name="collectionDescription"
              control={control}
              render={({ field }) => (
                <Input.TextArea
                  className="!py-2 !rounded-lg"
                  placeholder="Nhập mô tả dự án"
                  status={errors.collectionDescription ? "error" : ""}
                  disabled={!isEdit}
                  rows={4}
                  maxLength={500}
                  count={{ show: true, max: 500 }}
                  onPressEnter={onSubmit && handleSubmit(onSubmit)}
                  {...field}
                />
              )}
            />

            {errors.collectionDescription?.message && (
              <p className="absolute text-sm text-red-200">
                {errors.collectionDescription.message}
              </p>
            )}
          </div>
        </div>

        {/* NFT */}
        <div className="flex md:flex-row flex-col md:items-start md:gap-5 gap-2">
          <p className="text-sm min-w-[100px] w-fit whitespace-nowrap">
            {t("create.form.quantity")}
            <span className="text-red-200">*</span>
          </p>
          <div
            className={clsx("relative w-full", [errors.NFTsListFile && "pb-5"])}
          >
            <div className="flex md:flex-nowrap flex-wrap items-center  gap-2">
              <div className="md:w-6/12 w-full px-2 py-4 border rounded-xl">
                <Controller
                  name="NFTsListFile"
                  control={control}
                  render={({ field }) => (
                    <div className="w-full h-full">
                      <Input
                        className="!absolute opacity-0 pointer-events-none"
                        {...field}
                      />
                      <div className="w-full h-full">
                        <UploadFile
                          multiple={false}
                          data={fileNFT ? [fileNFT] : []}
                          onChangeFile={(
                            file: UploadFileType[] | UploadFileType | null,
                          ) =>
                            handleChangeNFTFile &&
                            handleChangeNFTFile(file as UploadFileType)
                          }
                          rules={[ETypeFile.EXCEL]}
                          onRemoveFile={(
                            file: UploadFileType[] | UploadFileType | null,
                          ) =>
                            hanldeRemoveNFTFile &&
                            hanldeRemoveNFTFile(file as UploadFileType)
                          }
                          disable={!isEdit || !!collection}
                        />
                      </div>
                    </div>
                  )}
                />
              </div>
              <ul className="w-fit text-sm text-neutral-300 list-disc md:pl-10 pl-5">
                <li>Kích thước tối đa 100MB</li>
                <li>Độ phân giải không quá 1280x1280</li>
                <li>Định dạng JPG, PNG, SVG</li>
              </ul>
            </div>
            {errors.NFTsListFile && (
              <p className="absolute text-sm text-red-200">
                {errors.NFTsListFile.message}
              </p>
            )}
          </div>
        </div>

        {/* Quantity */}
        {collection && (
          <div className="flex md:flex-row flex-col md:items-center md:gap-5 gap-2">
            <p className="text-sm min-w-[100px] w-fit whitespace-nowrap">
              {t("create.form.quantity")}
            </p>
            <div
              className={clsx("relative w-full", [
                errors.collectionImage && "pb-2",
              ])}
            >
              <Controller
                name="quantityOfNFTs"
                control={control}
                render={({ field: { ref, name } }) => (
                  <Input
                    className="!py-2 !rounded-lg"
                    placeholder="Số lượng..."
                    value={formatBigNumber(Number(collection.quantityOfNFTs))}
                    disabled={true}
                    status={errors.quantityOfNFTs ? "error" : ""}
                    ref={ref}
                    name={name}
                  />
                )}
              />
              {errors.quantityOfNFTs && (
                <p className="absolute text-sm text-red-200">
                  {errors.quantityOfNFTs.message}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Date */}
        {/* <div className="flex md:flex-row flex-col md:items-center md:gap-5 gap-2">
          <p className="text-sm min-w-[100px] w-fit whitespace-nowrap">
            {t("create.form.date")}
          </p>
          <div
            className={clsx("relative w-full", [
              errors.collectionImage && "pb-2",
            ])}
          >
            <Controller
              name="publicDate"
              control={control}
              render={({ field: { value, ref } }) => (
                <DatePicker
                  showTime
                  allowClear={false}
                  status={errors.publicDate ? "error" : ""}
                  format={DAY_DMH}
                  className="w-full !py-2 !px-3"
                  value={dayjs(value, DAY_DMH)}
                  onChange={(_, dateString: string | string[]) =>
                    onChangeDateTime(dateString as string, "publicDate")
                  }
                  disabled={disable}
                  ref={ref}
                />
              )}
            />
            {errors.publicDate && (
              <p className="absolute text-sm text-red-200">
                {errors.publicDate.message}
              </p>
            )}
          </div>
        </div> */}

        {/* Price */}
        {/* <div className="flex md:flex-row flex-col md:items-center md:gap-5 gap-2">
          <p className="text-sm min-w-[100px] w-fit whitespace-nowrap">
            {t("create.form.price")}
          </p>
          <div
            className={clsx("relative w-full", [
              errors.collectionImage && "pb-2",
            ])}
          >
            <Controller
              name="publicPrice"
              control={control}
              render={({ field: { value, ref, name } }) => (
                <Input
                  className="!py-2 !rounded-lg"
                  placeholder="Price of NFT"
                  value={formatBigNumber(Number(value))}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    onChangeTypeNumber(e.target.value, name)
                  }
                  disabled={disable}
                  status={errors.publicPrice ? "error" : ""}
                  ref={ref}
                  name={name}
                />
              )}
            />
            {errors.publicPrice && (
              <p className="absolute text-sm text-red-200">
                {errors.publicPrice.message}
              </p>
            )}
          </div>
        </div> */}

        {collection && collection._id && (
          <div className="w-full flex md:flex-row flex-col md:items-center md:gap-5 gap-2">
            <p className="text-sm min-w-[100px] w-fit whitespace-nowrap">
              {t("create.form.status")}
            </p>
            <Select
              onChange={onChangeStatus}
              value={titleSelect as ECollectionStatus}
              className="w-full"
              size="large"
              // disabled={disable}
            >
              {status === ECollectionStatus.MERCHANT_REVIEW && (
                <Option value={ECollectionStatus.MERCHANT_REVIEW}>
                  {t("request")}
                </Option>
              )}

              {status !== ECollectionStatus.MERCHANT_REVIEW &&
                status !== ECollectionStatus.UNLISTED && (
                  <Option value={ECollectionStatus.UNLISTED}>
                    {t("cancel")}
                  </Option>
                )}

              {status !== ECollectionStatus.MERCHANT_REVIEW &&
                status !== ECollectionStatus.LISTED && (
                  <Option value={ECollectionStatus.LISTED}>
                    {t("process")}
                  </Option>
                )}
            </Select>
          </div>
        )}

        {/* message Antd */}
        {contextHolder}
      </div>

      {/* Modal Active Collection */}
      <ModalConfirm
        title="Niêm yết bộ sưu tập"
        subtitle="Bạn muốn niêm yết bộ sưu tập này?"
        open={isOpenEnable}
        type="info"
        description="*Lưu ý: Niêm yết tất cả NFT của bộ sưu tập lên sàn"
        onCancel={onModalEnable}
        onOk={() => handleEnable(collection?._id as string)}
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

      {/* Modal Merchant review Collection */}
      <ModalConfirm
        title="Yêu cầu duyệt bộ sưu tập"
        subtitle="Bạn muốn yêu cầu duyệt bộ sưu tập này?"
        open={isOpenMerchant}
        type="info"
        onCancel={onModalMerchant}
        onOk={() => handleMerchantReview(collection?._id as string)}
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
        title="Hủy niêm yết bộ sưu tập"
        subtitle="Bạn muốn hủy niêm yết bộ sưu tập này?"
        open={isOpenDisable}
        type="danger"
        description="*Lưu ý: Hủy niêm yết tất cả các NFT của Bộ sưu tập, không thể thực hiện giao dịch"
        onCancel={onModalDisable}
        onOk={() => handleDisable(collection?._id as string)}
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
    </div>
  );
};

export default FormCollection;
