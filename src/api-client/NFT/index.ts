import qs from "qs";
import AxiosClient from "~/config/axiosClient";
import { INTERNAL_PATH } from "~/config/constants";
import { ICreateNFTs, IPublicNft, ISearchNft } from "~/interface";

const BASE_URL: string = import.meta.env.VITE_API_ENDPOINT as string;

const getNFTs = async (paramater: ISearchNft) => {
  const parseParameters = qs.stringify(paramater, {
    filter: (_, value) => value || undefined,
  });

  return await AxiosClient.get(
    BASE_URL + INTERNAL_PATH + `/NFTs?${parseParameters}`,
  ).then((res) => res.data);
};

const getNFT = async (id: string) => {
  return await AxiosClient.get(BASE_URL + INTERNAL_PATH + `/NFTs/${id}`).then(
    (res) => res.data,
  );
};

const getNFTPreSignUrls = async (paramater: ISearchNft) => {
  const parseParameters = qs.stringify(paramater, {
    filter: (_, value) => value || undefined,
  });

  return await AxiosClient.get(
    BASE_URL +
      INTERNAL_PATH +
      `/NFTs/all-put-pre-signed-url?${parseParameters}`,
  ).then((res) => res.data);
};

const getNFTPreSignUrl = async (nftId: string) => {
  return await AxiosClient.get(
    BASE_URL + INTERNAL_PATH + `/NFTs/${nftId}/detail-pre-signed-url`,
  ).then((res) => res.data);
};

const createNFTs = async (payload: ICreateNFTs) => {
  return await AxiosClient.post(
    BASE_URL + INTERNAL_PATH + "/NFTs",
    payload,
  ).then((res) => res.data);
};

const merchantReviewNFT = async (collectionId: string) => {
  return await AxiosClient.patch(
    BASE_URL + INTERNAL_PATH + "/NFTs/merchant-review",
    { collectionId },
  ).then((res) => res.data);
};

const enableNFT = async (collectionId: string) => {
  return await AxiosClient.patch(BASE_URL + INTERNAL_PATH + "/NFTs/enable", {
    collectionId,
  }).then((res) => res.data);
};

const publicNFTs = async (payload: IPublicNft[]) => {
  return await AxiosClient.patch(
    BASE_URL + INTERNAL_PATH + "/NFTs/marketplace/public",
    { publicNFTs: payload },
  ).then((res) => res.data);
};

export {
  getNFTs,
  getNFT,
  createNFTs,
  publicNFTs,
  merchantReviewNFT,
  enableNFT,
  getNFTPreSignUrls,
  getNFTPreSignUrl,
};
