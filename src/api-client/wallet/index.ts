import qs from "qs";

import AxiosClient from "~/config/axiosClient";
import { INTERNAL_PATH } from "~/config/constants";
import { ISearchWallet } from "~/interface";

const BASE_URL: string = import.meta.env.VITE_API_ENDPOINT as string;

const getWallets = async (paramater: ISearchWallet) => {
  const parseParameters = qs.stringify(paramater, {
    filter: (_, value) => value || undefined,
  });

  return await AxiosClient.get(
    BASE_URL + INTERNAL_PATH + `/wallets?${parseParameters}`,
  ).then((res) => res.data);
};

const getWallet = async (walletId: string) => {
  return await AxiosClient.get(
    BASE_URL + INTERNAL_PATH + `/wallets/${walletId}`,
  ).then((res) => res.data);
};
export { getWallets, getWallet };
