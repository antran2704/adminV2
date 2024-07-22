import * as XLSX from "xlsx";
import { ICreatNFTItem, ICreateCollection } from "~/interface";
import { convertToCamelCase } from "../format";
import { UseFormReturn } from "react-hook-form";

const getDataFileOfNft = (
  event: ProgressEvent<FileReader>,
  form: UseFormReturn<ICreateCollection>,
  name: keyof ICreateCollection,
) => {
  // uses the XLSX library to parse the Excel file
  const workbook = XLSX.read(event.target?.result, { type: "binary" });
  const keysOfExcel: string[] = workbook.SheetNames;

  const data: ICreatNFTItem[] = [];

  // check duplicate name
  const checkName = new Set<string[]>([]);

  // check valid data
  let isValid: boolean = true;

  // Formats the sheet data
  keysOfExcel.forEach((key) => {
    const sheet: XLSX.WorkSheet = workbook.Sheets[key];
    const sheetData: unknown[] = !!XLSX.utils.sheet_to_json(sheet).length
      ? XLSX.utils.sheet_to_json(sheet)
      : [];

    sheetData.forEach((sheet: any) => {
      if (!isValid) return;

      const payload: any = {} as ICreatNFTItem;

      for (const [key, value] of Object.entries(sheet)) {
        const newKey = convertToCamelCase(key, " ") as keyof ICreatNFTItem;
        payload[newKey] = value;
      }

      if (
        Object.keys(payload).length !== 3 ||
        !payload.name.toString() ||
        !payload.dividendRate.toString() ||
        !payload.description.toString()
      ) {
        form.setError(name, {
          message: "Dữ liệu không hợp lệ",
        });
        isValid = false;
        return;
      }

      // check duplicate name
      if (checkName.has(payload.name)) {
        form.setError(name, {
          message: "Có tên trùng nhau",
        });
        isValid = false;
        return;
      }

      // add name to set
      checkName.add(payload.name);
      data.push(payload);
    });

    if (data.length !== sheetData.length) return;
  });

  if (!isValid) return;

  const dividendRate: number = data.reduce(
    (acc, cur) => acc + cur.dividendRate,
    0,
  );

  if (dividendRate !== 100) {
    form.setError(name, {
      message: "Tỉ lệ không bằng 100",
    });
    return;
  }
  return data;
};

export { getDataFileOfNft };
