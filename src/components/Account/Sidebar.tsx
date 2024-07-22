"use client";

import { MouseEvent, useState, Fragment, useEffect } from "react";
import { Modal, Image, message, Input, Button } from "antd";

import { GoPencil } from "react-icons/go";

import UploadImage from "../Image/Upload";

import "./Account.scss";
import { presignedPutUrl } from "~/api-client/user";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { fetchUser } from "~/store/slice/user";
import { NO_IMAGE } from "~/commons/image";
import { ETypeFile } from "~/enum/file";
import { useTranslations } from "next-intl";
import MESSAGE_ERROR from "~/commons/error";

const SidebarAccount = () => {
  const tError = useTranslations("Error");
  const tCommon = useTranslations("Common");
  const tSuccess = useTranslations("Success");

  const { infoUser } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const [avartar, setAvartar] = useState<string>(NO_IMAGE);
  const [previewImage, setPreviewImage] = useState<string>(NO_IMAGE);
  const [fileImage, setFileImage] = useState<File | null>(null);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

  const onShowModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const onCancelModal = () => {
    onShowModal();
    if (previewImage !== avartar) {
      setAvartar(avartar);
      setPreviewImage(avartar);
    }
  };

  const handleChangeImage = (file: File | null) => {
    setFileImage(file);
  };

  // eslint-disable-next-line no-unused-vars
  const handleRemoveImage = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setPreviewImage(NO_IMAGE);
  };

  const onSubmit = async () => {
    // if (avartar === previewImage) {
    //   onShowModal();
    //   return;
    // }

    // if (shortName !== infoUser.shortName) {
    //   // change shortName
    //   await updateShortName(shortName);
    //   isChange = true;
    // }

    if (!fileImage) {
      // logic when user not upload image
    }
    setConfirmLoading(true);

    try {
      if (fileImage) {
        const fileName: string = infoUser.imageProfile
          ? infoUser.imageProfile.fileName
          : fileImage.lastModified.toString();

        const newUrl: string = await presignedPutUrl(fileName);

        await axios.put(newUrl, fileImage, {
          headers: {
            "Content-Type": fileImage.type,
          },
        });

        dispatch(fetchUser());
        message.success(tSuccess("ok"));
      }

      setFileImage(null);
      onShowModal();
    } catch (err) {
      if (!axios.isAxiosError(err)) return;
      message.error(tError(MESSAGE_ERROR.TRY_AGAIN));
    }

    setConfirmLoading(false);
  };

  useEffect(() => {
    if (infoUser._id && infoUser.imageProfile) {
      setAvartar(infoUser.imageProfile.url);
      setPreviewImage(infoUser.imageProfile.url);
    }
  }, [infoUser]);

  return (
    <Fragment>
      <div className="flex flex-col items-center">
        <div
          onClick={onShowModal}
          className="relative after:absolute after:top-0 after:bottom-0 after:left-0 after:right-0 after:bg-transparent after:border after:border-white after:rounded-full after:shadow-lg after:scale-105 after:z-0 cursor-pointer"
        >
          <img
            src={avartar}
            onError={(e) => (e.currentTarget.src = NO_IMAGE)}
            alt="avatar"
            title="avatar"
            loading="lazy"
            className="relative xl:w-[160px] xl:min-w-[160px] xl:h-[160px] md:w-[140px] md:min-w-[140px] md:h-[140px] w-[100px] min-w-[100px] h-[100px] object-cover object-center rounded-full z-[1]"
          />
        </div>

        {infoUser._id && (
          <Fragment>
            <div className="py-4">
              <h3 className="lg:text-2xl md:text-xl text-lg font-semibold text-center">
                {infoUser.username}
              </h3>
              <p className="md:text-sm text-xs text-neutral-300 text-center">
                Ngày tạo: 01/05/2024
              </p>
            </div>

            <Button
              icon={<GoPencil />}
              type={"default"}
              size="large"
              onClick={onShowModal}
              className="xl:w-full sm:w-1/2 w-full mx-auto"
            >
              {tCommon("edit")}
            </Button>
          </Fragment>
        )}
      </div>

      {/* Popup udpate info user */}
      <Modal
        title={
          <h4 className="text-lg font-semibold text-primary-200">
            Thay đổi thông tin
          </h4>
        }
        centered={true}
        open={isModalOpen}
        destroyOnClose={true}
        onCancel={onCancelModal}
        footer={
          <div className="flex items-center justify-center gap-10">
            <Button
              onClick={onCancelModal}
              type={"default"}
              size="large"
              className="md:w-1/3 w-1/2 md:text-xs shadow-md"
            >
              {tCommon("goBack")}
            </Button>
            <Button
              onClick={onSubmit}
              loading={confirmLoading}
              size="large"
              type="primary"
              className="md:w-1/3 w-1/2 shadow-md max-h-[42px]"
            >
              {tCommon("save")}
            </Button>
          </div>
        }
      >
        {/* Upload avatar */}
        <div>
          <div className="h-[300px] w-full">
            <UploadImage
              src={previewImage}
              onChangeImage={handleChangeImage}
              rules={[ETypeFile.JPEG, ETypeFile.PNG]}
            />
            {previewOpen && previewImage && (
              <Image
                wrapperStyle={{ display: "none" }}
                alt="preview"
                preview={{
                  visible: previewOpen,
                  onVisibleChange: (visible) => setPreviewOpen(visible),
                }}
                src={previewImage}
              />
            )}
          </div>

          <div className="py-4">
            <p className="text-sm font-semibold min-w-[100px] w-fit whitespace-nowrap pb-1">
              Biệt danh
            </p>
            <Input
              className="!py-2 !rounded-lg"
              placeholder="Nguyen Van A"
              name="name"
            />
          </div>
        </div>
      </Modal>
    </Fragment>
  );
};

export default SidebarAccount;
