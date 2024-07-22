import { ENftStatus } from "~/enum";
import { ISearch } from "../paramater";
import { IFile } from "../image";

interface INft {
  _id: string;
  nftName: string;
  collectionId: string;
  collectionName: string;
  projectName: string;
  merchantName: string;
  nftOwner: null | string;
  nftPrice: number;
  currency: string;
  nftStatus: ENftStatus;
  nftImage: IFile | null;
  createdAt: string;
  publicDate: string | null;
}

type INftTable = {
  key: React.Key;
  _id: string;
  name: string;
  image: string;
  collection: {
    name: string;
    id: string;
  };
  projectName: string;
  publicDate: string | null;
  owner: string;
  price: {
    valye: number;
    currency: string;
  };
  status: ENftStatus;
};

interface ICreatNFTItem {
  name: string;
  description: string;
  dividendRate: number;
}

interface ICreateNFTs {
  collectionId: string;
  NFTs: ICreatNFTItem[];
}

interface ISearchNft extends ISearch {
  collectionId?: string;
  status?: ENftStatus | null;
}

interface INftFile {
  id: string;
  name: string;
  price: number;
  date: string;
}

interface IPublicNft {
  nftId: string;
  publicPrice: number;
  publicDate: string;
  currency: string;
}

export type {
  INft,
  INftTable,
  ISearchNft,
  ICreateNFTs,
  ICreatNFTItem,
  INftFile,
  IPublicNft,
};
