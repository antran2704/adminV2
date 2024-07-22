import { ETransactionStatus, ETransactionType } from "~/enum";
import { ISearch } from "../paramater";

interface ITransaction {
  _id: string;
  userId: string;
  nftId: string;
  amount: number;
  status: ETransactionStatus;
  transactionType: ETransactionType;
  transactionDescription: string;
  transactionMethod: string;
  transactionFee: number;
  currency: string;
  fromSource: string;
  toDestination: string;
  transactionDate: string;
  createdAt: string;
}

interface ITableTransaction {
  id: string;
  key: React.Key;
  type: ETransactionType;
  from: string;
  to: string;
  total: {
    value: number;
    type: ETransactionType;
  };
  fee: number;
  description: string;
  createdAt: string;
}

interface ISearchTransaction extends ISearch {
  walletId: string;
  status: ETransactionStatus;
  transactionType: ETransactionType;
  startDate?: string;
  endDate?: string;
}

export type { ITransaction, ITableTransaction, ISearchTransaction };
