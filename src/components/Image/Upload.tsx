import { MouseEvent, memo, useEffect, useState } from "react";
import { Image, Upload, UploadProps } from "antd";
import { RcFile, UploadChangeParam, UploadFile } from "antd/es/upload";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import clsx from "clsx";
import { AiOutlineExpand } from "react-icons/ai";
import { RiDeleteBin6Line } from "react-icons/ri";

import { FileType } from "~/interface";
import { ETypeFile } from "~/enum/file";

import { NO_IMAGE } from "~/commons/image";
import { checkImage, getBase64 } from "~/helper/image";

import { ModalConfirm } from "../Modal";

import "./Image.scss";
import { useTranslations } from "next-intl";

interface Props {
  src?: string;
  className?: string;
  rules: ETypeFile[];
  onChangeImage: (file: File | null) => void;
}

const UploadImage = (props: Props) => {
  const { src = "", rules = [], className, onChangeImage } = props;

  const tCommon = useTranslations("Common");

  const [previewImage, setPreviewImage] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [canDelete, setCanDelete] = useState(false);

  const onShowModal = () => {
    setShowModal(!showModal);
  };

  const onRemoveImage = async () => {
    if (canDelete) {
      setLoadingDelete(true);

      try {
        // await removeImage(src as string);
        setLoadingDelete(false);
      } catch (error) {
        setLoadingDelete(false);
        return;
      }
    }

    setPreviewImage(NO_IMAGE);
    onChangeImage(null);
    onShowModal();
  };

  const handlePreview = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setPreviewOpen(true);
  };

  const handleRemoveImage = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onShowModal();
  };

  const handleChangeImage: UploadProps["onChange"] = (
    info: UploadChangeParam<UploadFile>,
  ) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }

    if (info.file.status === "done") {
      getBase64(info.file.originFileObj as FileType, (url) => {
        setLoading(false);
        setPreviewImage(url);
      });

      onChangeImage(info.file.originFileObj as File);
    }
  };

  useEffect(() => {
    // if (src && !previewImage) {
    setPreviewImage(src);
    setCanDelete(true);
    // }
  }, [src]);

  return (
    <div className={clsx("w-full h-full", className)}>
      <Upload
        name="avatar"
        listType="picture-card"
        rootClassName={clsx("relative w-full h-full", {
          uploaded: !!previewImage,
        })}
        className="avatar-uploader"
        showUploadList={false}
        beforeUpload={(file: RcFile) => checkImage(file, rules)}
        onChange={handleChangeImage}
      >
        {previewImage && (
          <div className="w-full h-full rounded-lg overflow-hidden">
            <img
              src={previewImage}
              alt="avatar"
              className="w-full h-full object-cover object-center"
            />

            {previewImage !== NO_IMAGE && (
              <div className="absolute bottom-2 right-2 flex items-center gap-2 z-10">
                <button
                  onClick={handlePreview}
                  className="flex items-center justify-center w-8 h-8 bg-black/40 text-white opacity-80 hover:opacity-100 rounded-full transition-all ease-linear duration-100"
                >
                  <AiOutlineExpand className="w-5 h-5 min-w-5" />
                </button>
                <button
                  onClick={handleRemoveImage}
                  className="flex items-center justify-center w-8 h-8 bg-black/40 text-white opacity-80 hover:opacity-100 rounded-full transition-all ease-linear duration-100"
                >
                  <RiDeleteBin6Line className="w-5 h-5 min-w-5" />
                </button>
              </div>
            )}
          </div>
        )}

        {!previewImage && (
          <button style={{ border: 0, background: "none" }} type="button">
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
          </button>
        )}
      </Upload>
      {previewOpen && previewImage && (
        <Image
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
          }}
          src={previewImage}
        />
      )}

      {/* Modal Disable Collection */}
      <ModalConfirm
        title="Xóa ảnh"
        subtitle="Bạn muốn xóa ảnh này không?"
        open={showModal}
        type="danger"
        confirmLoading={loadingDelete}
        onCancel={onShowModal}
        onOk={onRemoveImage}
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

export default memo(UploadImage);
