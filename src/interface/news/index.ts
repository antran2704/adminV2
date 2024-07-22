import { IFile } from "../image";
import { ISearch } from "../paramater";

// External
interface INewsExternal {
  _id: string;
  thumbnail: string;
  title: string;
  description: string;
  link: string;
  isPublic: boolean;
  createdAt: string;
}

interface ICreateNewsExternal {
  link: string;
  isPublic: boolean;
}

type IUpdateNewsExternal = Pick<INewsExternal, "link" | "isPublic">;

interface INewsExternalTable {
  id: string;
  key: React.Key;
  thumbnail: string;
  title: string;
  description: string;
  path: string;
  status: boolean;
  createdAt: string;
}
// External

// Internal
interface INewsInternal {
  _id: string;
  thumbnail: IFile;
  title: string;
  description: string;
  tags: string[];
  content: string;
  isPublic: boolean;
  createdAt: string;
}

interface ICreateNewsInternal {
  title: string;
  thumbnail: string;
  description: string;
  tags: string[];
  content: string;
  isPublic: boolean;
}

interface IUpdateNewsInternal {
  title: string;
  description: string;
  tags: string[];
  content: string;
}

interface INewsInternalTable {
  id: string;
  key: React.Key;
  thumbnail: string;
  title: string;
  description: string;
  status: boolean;
  createdAt: string;
}

interface ISearchNews extends ISearch {
  isPublic?: string;
}

export type {
  INewsExternal,
  INewsExternalTable,
  ICreateNewsExternal,
  IUpdateNewsExternal,
  ISearchNews,
  INewsInternal,
  INewsInternalTable,
  ICreateNewsInternal,
  IUpdateNewsInternal,
};
