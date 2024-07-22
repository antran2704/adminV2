import { ETypeFile } from "~/enum/file";

const messageFile: { [k: string]: string } = {
  [ETypeFile.PDF]: "PDF",
  [ETypeFile.EXCEL]: "EXCEL",
  [ETypeFile.PNG]: "PNG",
  [ETypeFile.JPEG]: "JPEG",
};

export { messageFile };
