"use client";

import { Fragment, forwardRef, useEffect, useState } from "react";
import { Upload, UploadProps, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

import {
  UploadChangeParam,
  UploadFile as UploadFileType,
} from "antd/es/upload";

import { FileType } from "~/interface";
import { ETypeFile } from "~/enum/file";

import { checkFile } from "~/helper/image";
import { messageFile } from "~/commons/file";

import "./File.scss";

interface Props {
  data: UploadFileType[];
  multiple?: boolean;
  disable?: boolean;
  rules?: ETypeFile[];
  onChangeFile?: (file: UploadFileType[] | UploadFileType | null) => void;
  onRemoveFile?: (file: UploadFileType | null) => void;
  ref: any;
}
const UploadFile = (
  {
    onChangeFile,
    data,
    multiple = false,
    disable = false,
    rules = [],
    onRemoveFile,
  }: Props,
  ref: any,
) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [fileList, setFileList] = useState<UploadFileType[]>([]);
  const [file, setFile] = useState<UploadFileType | null>(null);

  const handleRemove = (file: UploadFileType) => {
    const newFileList: UploadFileType[] = fileList.filter(
      (item: UploadFileType) => item.uid !== file.uid,
    );
    setFileList(newFileList);

    if (onRemoveFile && multiple) {
      onRemoveFile(file);
    }

    if (onRemoveFile && !multiple) {
      onRemoveFile(null);
    }
  };

  const handleChange: UploadProps["onChange"] = async (
    info: UploadChangeParam<UploadFileType>,
  ) => {
    if (!info.file) return;
    const isValid = !!rules.length
      ? checkFile(info.file as FileType, rules)
      : true;

    if (!isValid) {
      messageApi.error(
        `You can upload only document like ${rules
          .map((rule: ETypeFile) => messageFile[rule])
          .join("/")}`,
      );
      return;
    }

    setFileList(info.fileList);

    if (info.file.status === "done" && info.file.uid !== file?.uid) {
      const fileOrigin: FileType = info.file.originFileObj as FileType;

      try {
        setFile(fileOrigin);

        // update link for new file
        const newFileList = fileList;
        newFileList[newFileList.length - 1] = {
          ...info.file,
          url: URL.createObjectURL(fileOrigin),
        };

        // setFileList(info.fileList);
        setFileList(newFileList);

        if (onChangeFile && multiple) {
          onChangeFile(info.fileList);
        }

        if (onChangeFile && !multiple) {
          onChangeFile(info.file);
        }
      } catch (error) {
        return error;
      }
    }
  };

  useEffect(() => {
    setFileList(data);
  }, [data]);

  // useEffect(() => {
  //   if(testRef.current) {
  //     console.log(testRef.current?.upload.uploader.fileInput.click());
  //   }
  // }, [testRef])

  return (
    <Fragment>
      <Upload
        disabled={disable}
        multiple={multiple}
        onRemove={(file: UploadFileType) => handleRemove(file)}
        onChange={handleChange}
        listType="picture"
        className="w-full h-full"
        fileList={fileList}
        ref={ref}
      >
        {!disable && multiple && (
          <button
            className="flex flex-col items-center justify-center px-6 py-3 border hover:border-primary-200
         hover:text-primary-200 border-dashed rounded-lg transition-all ease-linear duration-100 gap-2"
          >
            <UploadOutlined />
            Upload
          </button>
        )}

        {!disable && !multiple && !fileList.length && (
          <button
            className="flex flex-col items-center justify-center px-6 py-3 border hover:border-primary-200
         hover:text-primary-200 border-dashed rounded-lg transition-all ease-linear duration-100 gap-2"
          >
            <UploadOutlined />
            Upload
          </button>
        )}
      </Upload>
      {contextHolder}
    </Fragment>
  );
};

export default forwardRef(UploadFile);
