import qs from "qs";

import AxiosClient from "~/config/axiosClient";
import { INTERNAL_PATH } from "~/config/constants";
import { ISearchTransaction } from "~/interface/transaction";

const BASE_URL: string = process.env.NEXT_PUBLIC_API_ENDPOINT as string;

const getTransactions = async (paramater: ISearchTransaction) => {
  const parseParameters = qs.stringify(paramater, {
    filter: (_, value) => value || undefined,
  });

  return await AxiosClient.get(
    BASE_URL + INTERNAL_PATH + `/transactions?${parseParameters}`,
  ).then((res) => res.data);
};

const getTransaction = async (transactionId: string) => {
  return await AxiosClient.get(
    BASE_URL + INTERNAL_PATH + `/transactions/${transactionId}`,
  ).then((res) => res.data);
};

export { getTransactions, getTransaction };
