import qs from "qs";
import AxiosClient from "~/config/axiosClient";
import { INTERNAL_PATH } from "~/config/constants";
import {
  ICreateNewsExternal,
  IUpdateNewsExternal,
  ISearchNews,
} from "~/interface";

const BASE_URL: string = process.env.NEXT_PUBLIC_API_ENDPOINT as string;

const getListNews = async (paramater: ISearchNews) => {
  const parseParameters = qs.stringify(paramater, {
    filter: (_, value) => value || undefined,
  });

  return await AxiosClient.get(
    BASE_URL + INTERNAL_PATH + `/news/outsource?${parseParameters}`,
  ).then((res) => res.data);
};

const creatNews = async (data: ICreateNewsExternal) => {
  return await AxiosClient.post(
    BASE_URL + INTERNAL_PATH + "/news/outsource",
    data,
  ).then((res) => res.data);
};

const getNews = async (newsId: string) => {
  return await AxiosClient.get(
    BASE_URL + INTERNAL_PATH + `/news/outsource/${newsId}`,
  ).then((res) => res.data);
};

const updateNews = async (newsId: string, data: IUpdateNewsExternal) => {
  return await AxiosClient.put(
    BASE_URL + INTERNAL_PATH + `/news/outsource/${newsId}`,
    data,
  ).then((res) => res.data);
};

export { getNews, getListNews, creatNews, updateNews };
