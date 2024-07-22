import AxiosClient from "~/config/axiosClient";
import { INTERNAL_PATH } from "~/config/constants";

const BASE_URL: string = process.env.NEXT_PUBLIC_API_ENDPOINT as string;

const activeNews = async (newsId: string) => {
  return await AxiosClient.patch(
    BASE_URL + INTERNAL_PATH + `/news/registry/${newsId}/active`,
  ).then((res) => res.data);
};

const disableNews = async (newsId: string) => {
  return await AxiosClient.patch(
    BASE_URL + INTERNAL_PATH + `/news/registry/${newsId}/disable`,
  ).then((res) => res.data);
};

const deleteNews = async (newsId: string) => {
  return await AxiosClient.delete(
    BASE_URL + INTERNAL_PATH + `/news/registry/${newsId}`,
  ).then((res) => res.data);
};

export { activeNews, disableNews, deleteNews };
