import { GetProp, UploadProps } from "antd";

interface IFile {
  fileName: string;
  url: string;
}

interface ImagePayload {
  buffer: string;
  encoding: string;
  fieldname: string;
  mimetype: string;
  originalname: string;
  size: number;
}

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

export type { ImagePayload, FileType, IFile };
