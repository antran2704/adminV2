import { EWalletStatus, EWalletType } from "~/enum";
import { ISearch } from "../paramater";

interface IWallet {
  _id: string;
  userId: string;
  shortName: string;
  fullName: string;
  balance: number;
  currency: string;
  phoneNumber: string;
  status: EWalletStatus;
  type: EWalletType;
  createdAt: string;
}

interface IWalletTable {
  id: string;
  key: React.Key;
  owner: string;
  platform: EWalletType;
  status: string;
  createdAt: string;
}

interface ISearchWallet extends ISearch {
  status: EWalletStatus;
  walletObject: EWalletType;
  startDate?: string;
  endDate?: string;
}

export type { IWallet, IWalletTable, ISearchWallet };
