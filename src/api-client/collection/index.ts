import qs from "qs";

import AxiosClient from "~/config/axiosClient";

import { INTERNAL_PATH } from "~/config/constants";
import {
  ICreateCollection,
  ISearchCollection,
  IUpdateCollection,
} from "~/interface";

const BASE_URL: string = import.meta.env.VITE_API_ENDPOINT as string;

const getCollections = async (paramater: ISearchCollection) => {
  const parseParameters = qs.stringify(paramater, {
    filter: (_, value) => value || undefined,
  });

  return await AxiosClient.get(
    BASE_URL + INTERNAL_PATH + `/collections?${parseParameters}`,
  ).then((res) => res.data);
};

const getCollection = async (collectionId: string) => {
  return await AxiosClient.get(
    BASE_URL + INTERNAL_PATH + `/collections/${collectionId}`,
  ).then((res) => res.data);
};

const updateCollection = async (
  collectionId: string,
  body: IUpdateCollection,
) => {
  return await AxiosClient.put(
    BASE_URL + INTERNAL_PATH + `/collections/${collectionId}`,
    body,
  ).then((res) => res.data);
};

const createCollection = async (body: ICreateCollection) => {
  return await AxiosClient.post(
    BASE_URL + INTERNAL_PATH + "/collections",
    body,
  ).then((res) => res.data);
};

const activeCollection = async (collectionId: string) => {
  return await AxiosClient.patch(
    BASE_URL + INTERNAL_PATH + `/collections/${collectionId}/enable`,
  ).then((res) => res.data);
};

const disableCollection = async (collectionId: string) => {
  return await AxiosClient.patch(
    BASE_URL + INTERNAL_PATH + `/collections/${collectionId}/disable`,
  ).then((res) => res.data);
};

const deleteCollection = async (collectionId: string) => {
  return await AxiosClient.delete(
    BASE_URL + INTERNAL_PATH + `/collections/${collectionId}`,
  ).then((res) => res.data);
};

const merchantReviewCollection = async (collectionId: string) => {
  return await AxiosClient.patch(
    BASE_URL + INTERNAL_PATH + `/collections/${collectionId}/merchant-review`,
  ).then((res) => res.data);
};

const getPresignedUrlCollection = async (params: {
  objectName: string;
  projectId: string;
  collectionId: string;
}) => {
  return await AxiosClient.get(
    BASE_URL + INTERNAL_PATH + "/collections/pre-signed-put-url",
    {
      params,
    },
  ).then((res) => res.data);
};

export {
  createCollection,
  getCollections,
  getCollection,
  updateCollection,
  activeCollection,
  disableCollection,
  deleteCollection,
  merchantReviewCollection,
  getPresignedUrlCollection,
};
