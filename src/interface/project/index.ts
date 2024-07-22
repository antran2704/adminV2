import { EProductStatus } from "~/enum";
import { ISearch } from "../paramater";
import { IFile } from "../image";

interface IProjectName {
  name: string;
  thumbnail: string;
}

interface IProjectAction {
  id: string;
  status: EProductStatus;
}

interface IProject {
  _id: string | null;
  projectName: string;
  projectImage: IFile;
  merchantId: string;
  merchantName: string;
  minted: boolean;
  projectDescription: string;
  projectCategories: string[];
  projectAddress: string;
  projectDocument: IFile[];
  assetStructure: IFile;
  quantityOfFloor: number;
  quantityOfUnit: number;
  projectWebsite: string;
  convenientServices: string[];
  projectStatus: EProductStatus;
  createdAt?: string;
  deletedAt?: string | null;
}

type ICreateProject = Omit<
  IProject,
  | "_id"
  | "projectStatus"
  | "merchantId"
  | "createdAt"
  | "deletedAt"
  | "projectAddress"
  | "merchantName"
  | "assetStructure"
  | "projectImage"
  | "projectDocument"
  | "minted"
> & {
  projectMerchantId: string;
  addressWard: string;
  addressDistrict: string;
  addressProvince: string;
  assetStructure: string;
  projectImage: string;
  projectDocument: string[];
};

type IUpdateProject = Omit<
  IProject,
  | "_id"
  | "createdAt"
  | "deletedAt"
  | "merchantId"
  | "projectAddress"
  | "merchantName"
  | "assetStructure"
  | "projectImage"
  | "projectDocument"
  | "projectStatus"
  | "minted"
> & {
  projectId: string;
  projectMerchantId: string;
  addressWard: string;
  addressDistrict: string;
  addressProvince: string;
};

interface DataTableProject {
  projectId: string;
  description: string;
  merchantName: string;
  merchant: string;
  quantityOfFloor: number;
  quantityOfUnit: number;
  categories: string[];
  collection: number;
  info: IProjectName;
  key: React.Key;
  status: EProductStatus;
  action: IProjectAction;
}

interface ISearchProject extends ISearch {
  dependedEntityId?: string;
  status: EProductStatus | null;
}

export type {
  IProjectAction,
  IProject,
  IProjectName,
  DataTableProject,
  ICreateProject,
  ISearchProject,
  IUpdateProject,
};
