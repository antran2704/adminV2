import { EOrderType } from "~/enum";

interface IParameter {
  [k: string]: string;
}

interface ISearch {
  take: number;
  page: number;
  search: string;
  order: EOrderType;
}

export type { IParameter, ISearch };
