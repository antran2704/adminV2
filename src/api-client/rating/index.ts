import qs from "qs";

import AxiosClient from "~/config/axiosClient";
import { INTERNAL_PATH } from "~/config/constants";
import { ISearchRating } from "~/interface";

const BASE_URL: string = process.env.NEXT_PUBLIC_API_ENDPOINT as string;

const getRatings = async (paramater: ISearchRating) => {
  const parseParameters = qs.stringify(paramater, {
    filter: (_, value) => value || undefined,
  });

  return await AxiosClient.get(
    BASE_URL + INTERNAL_PATH + `/ratings?${parseParameters}`,
  ).then((res) => res.data);
};

const getRating = async (ratingtId: string) => {
  return await AxiosClient.get(
    BASE_URL + INTERNAL_PATH + `/ratings/${ratingtId}`,
  ).then((res) => res.data);
};
export { getRatings, getRating };
