import { message } from "antd";
import { messageFile } from "~/commons/file";
import { ETypeFile } from "~/enum/file";
import { FileType, ImagePayload } from "~/interface";

const convertBufferToBase64 = (image: ImagePayload): string => {
  const base64Image = Buffer.from(image.buffer, "base64");
  const dataUrl = `data:${image.mimetype};base64,${base64Image.toString(
    "base64",
  )}`;

  return dataUrl;
};

const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const checkImage = (file: FileType, rules: ETypeFile[]) => {
  const isJpgOrPng: boolean = !!rules.length
    ? rules.includes(file.type as ETypeFile)
    : true;

  if (!isJpgOrPng) {
    message.error(
      `You can only upload ${rules
        .map((rule: ETypeFile) => messageFile[rule])
        .join("/")} file!`,
    );
  }

  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};

const checkFile = (file: FileType, rules: ETypeFile[]) => {
  const isValid = rules.includes(file.type as ETypeFile);
  return isValid;
};

export { convertBufferToBase64, getBase64, checkImage, checkFile };
