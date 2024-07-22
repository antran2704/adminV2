import { EOrderType, EPlatform } from "~/enum";
import { IFile, ImagePayload } from "../image";

interface IAdmin {
  _id: string | null;
  idCard: string;
  email: string;
  fullName: string;
  username: string;
  address: string;
  phoneNumber: string;
  dateOfBirth: string;
  imageProfile: IFile | null;
  roles: string;
  gender: boolean;
}

// type IInfoAdmin = Omit<IAdmin, "imageProfile"> & {
//   imageProfile: string;
// };

type IUpdateInfoAdmin = Omit<IAdmin, "imageProfile" | "_id" | "roles"> & {
  interesting: string[];
  address: string;
};

interface IParamaterListUser {
  take: number;
  page: number;
  search: string;
  order: EOrderType;
  platform: EPlatform | null;
}

type IUser = Pick<
  IAdmin,
  | "_id"
  | "email"
  | "dateOfBirth"
  | "fullName"
  | "phoneNumber"
  | "roles"
  | "username"
> & {
  companyName: string;
  createdAt: string;
  updatedAt: string;
  disabledAccount: boolean;
};

interface ICreateUser {
  // platform: EPlatform;
  email: string;
  companyName: string;
  phoneNumber: string;
  fullName: string;
  isPasswordGenerated: boolean;
  password?: string;
}

type ICreateInvestor = Omit<ICreateUser, "email" | "companyName">;
type ICreateMerchant = Omit<ICreateUser, "phoneNumber" | "fullName">;
type ICreateAdmin = Omit<ICreateUser, "phoneNumber" | "companyName">;

type IUpdateUser = Pick<ICreateUser, "isPasswordGenerated" | "password"> & {
  username: string;
  fullname: string;
};

export type {
  IAdmin,
  // IInfoAdmin,
  IUpdateInfoAdmin,
  IUpdateUser,
  IUser,
  IParamaterListUser,
  ICreateAdmin,
  ICreateInvestor,
  ICreateMerchant,
};
