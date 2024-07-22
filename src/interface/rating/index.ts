import { ISearch } from "../paramater";

interface IRating {
  _id: string;
  rating: number;
  comment: string;
  NFTId: string;
  userId: string;
  merchantId: string;
  createdAt: string;
  shortName: string;
  merchantName: string;
  unitName: string;
  unitId: string;
}

interface IRatingTable {
  id: string;
  key: React.Key;
  comment: string;
  rating: number;
  merchant: {
    name: string;
    id: string;
  };
  user: {
    name: string;
    id: string;
  };
  unit: {
    name: string;
    id: string;
  };
  NFT: string;
  createdAt: string;
}

interface ISearchRating extends ISearch {
  rating?: string;
  fromDate?: string;
  toDate?: string;
}

export type { IRating, IRatingTable, ISearchRating };
