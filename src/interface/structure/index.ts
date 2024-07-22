import { ISearch } from "../paramater";

interface IZone {
  key: string;
  zoneId: string;
  zoneName: string;
}

interface IBlock {
  key: string;
  zoneId: string;
  blockId: string;
  blockName: string;
}

interface IFloor {
  key: string;
  floorId: string;
  blockId: string;
  floorName: string;
}

interface IUnit {
  key: string;
  unitId: string;
  floor: string;
  unitName: string;
}

interface ICreateStructureItem {
  zone: string;
  block: string;
  floor: string;
  unitId: string;
}

interface ICreateStructure {
  [key: string]: ICreateStructureItem[];
}

interface IStructure {
  _id: string;
  unitId: string;
  floor: string;
  block: string;
  zone: string;
  minted: boolean;
}

type ITableStructure = IStructure & {
  key: string;
};

interface ISearchStructure extends ISearch {
  projectId?: string;
  status: "ALL" | "MINTED" | "AVAILABLE";
}

export type {
  IBlock,
  IFloor,
  IUnit,
  IZone,
  ICreateStructure,
  ICreateStructureItem,
  IStructure,
  ITableStructure,
  ISearchStructure,
};
