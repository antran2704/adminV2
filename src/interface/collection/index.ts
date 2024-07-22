import { ECollectionStatus } from "~/enum";
import { ISearch } from "../paramater";
import { IFile } from "../image";

interface ICollectionAction {
  id: string;
  status: ECollectionStatus;
}

interface ICollection {
  _id: string;
  projectId: string;
  projectName?: string;
  collectionName: string;
  collectionImage: IFile;
  collectionCoverImage: IFile;
  NFTsListFile: IFile;
  collectionDescription: string;
  quantityOfNFTs: number;
  collectionStatus: ECollectionStatus;
  mintedSource: string;
  isDraw: boolean;
  createdAt?: string;
  deletedAt?: string | null;
  // publicPrice: string;
  // publicDate: string;
}

type ICreateCollection = Omit<
  ICollection,
  | "_id"
  | "collectionStatus"
  | "createdAt"
  | "deletedAt"
  | "collectionCoverImage"
  | "collectionImage"
  | "NFTsListFile"
  | "isDraw"
> & {
  collectionImage: string;
  collectionCoverImage: string;
  currency: string;
  mintedSource: string;
  NFTsListFile: string;
};

type ICollectionTable = {
  coverImage: string;
  createdAt: string;
  deletedAt?: string | null;
  description: string;
  image: string;
  name: string;
  project: {
    name: string;
    id: string;
  };
  publicDate: string;
  publicPrice: string;
  quantityOfNFTs: number;
  _id: string;
  total: number;
  status: ECollectionStatus;
  key: React.Key;
  action: ICollectionAction;
};

type IUpdateCollection = Pick<
  ICollection,
  "collectionDescription" | "collectionName"
>;

interface ISearchCollection extends ISearch {
  projectId?: string;
  status: ECollectionStatus | null;
}

export type {
  ICollection,
  ICollectionTable,
  ICollectionAction,
  ICreateCollection,
  IUpdateCollection,
  ISearchCollection,
};
