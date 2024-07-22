import { Button, Modal } from "antd";
import { useTranslations } from "next-intl";
import { Dispatch, Fragment, SetStateAction } from "react";
import FormCollection from "../Form/Collection";
import { ICollection, ICreateCollection, IProject } from "~/interface";
import { UseFormReturn } from "react-hook-form";
import { UploadFile as UploadFileType } from "antd/es/upload";

interface Props {
  loading?: boolean;
  collection?: ICollection | null;
  project?: IProject | null;
  form: UseFormReturn<ICreateCollection, any, undefined>;
  open: boolean;
  canSelectProject?: boolean;
  canSelectUnit?: boolean;
  fileNFT?: UploadFileType | null;
  selectProject: { label: string; value: string };
  selectUnit: { label: string; value: string };
  isSubmit?: boolean;
  setIsSubmit?: Dispatch<SetStateAction<boolean>>;
  onSelectProject: (data: { label: string; value: string }) => void;
  onSelectUnit: (data: { label: string; value: string }) => void;
  onUploadImage?: (file: File | null) => void;
  onUploadCoverImage?: (file: File | null) => void;
  onClose: () => void;
  onSubmit?: () => void;
  handleChangeNFTFile: (file: UploadFileType) => void;
  hanldeRemoveNFTFile: (file: UploadFileType | null) => void;
}

const PopupCollection = (props: Props) => {
  const {
    loading = false,
    open = false,
    canSelectProject = true,
    canSelectUnit = true,
    collection = null,
    project = null,
    form,
    fileNFT,
    selectProject,
    selectUnit,
    isSubmit = false,
    setIsSubmit,
    onSelectProject,
    onSelectUnit,
    onClose,
    onSubmit,
    onUploadCoverImage,
    onUploadImage,
    handleChangeNFTFile,
    hanldeRemoveNFTFile,
  } = props;

  const t = useTranslations("CollectionPage");
  const tCommon = useTranslations("Common");

  const onCloseModal = () => {
    onClose();
  };

  return (
    <Fragment>
      <Modal
        title={
          <h4 className="lg:text-xl text-lg font-semibold text-primary-200">
            {t("create.title")}
          </h4>
        }
        width={800}
        centered={true}
        open={open}
        onCancel={onCloseModal}
        destroyOnClose={false}
        className="scroll"
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
              className="md:w-[140px] w-1/2"
              type="primary"
              size="large"
              onClick={onSubmit}
              loading={loading}
            >
              {tCommon("confirm")}
            </Button>
          </div>
        }
      >
        <FormCollection
          collection={collection}
          project={project}
          form={form}
          fileNFT={fileNFT}
          canSelectProject={canSelectProject}
          canSelectUnit={canSelectUnit}
          isSubmit={isSubmit}
          setIsSubmit={setIsSubmit}
          onUploadCoverImage={onUploadCoverImage}
          onUploadImage={onUploadImage}
          selectProject={selectProject}
          selectUnit={selectUnit}
          onSelectProject={onSelectProject}
          onSelectUnit={onSelectUnit}
          handleChangeNFTFile={handleChangeNFTFile}
          hanldeRemoveNFTFile={hanldeRemoveNFTFile}
        />
      </Modal>
    </Fragment>
  );
};

export default PopupCollection;
