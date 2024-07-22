import qs from "qs";
import AxiosClient from "~/config/axiosClient";
import { INTERNAL_PATH } from "~/config/constants";
import { EPlatform } from "~/enum";
import {
  ICreateAdmin,
  ICreateInvestor,
  ICreateMerchant,
  IParamaterListUser,
  IUpdateUser,
} from "~/interface";

const BASE_URL: string = process.env.NEXT_PUBLIC_API_ENDPOINT as string;

const getListUser = async (paramater: IParamaterListUser) => {
  const parseParameters = qs.stringify(paramater, {
    filter: (_, value) => value || undefined,
  });

  return await AxiosClient.get(
    BASE_URL + INTERNAL_PATH + `/users?${parseParameters}`,
  ).then((res) => res.data);
};

const getInfoUser = async (user_id: string, platform: EPlatform) => {
  return await AxiosClient.get(
    BASE_URL + INTERNAL_PATH + `/users/${user_id}/${platform}`,
  ).then((res) => res.data);
};

const createInvestor = async (data: ICreateInvestor) => {
  return await AxiosClient.post(
    BASE_URL + INTERNAL_PATH + "/user/erp-create-user-for-investor-app",
    data,
  );
};

const createMerchant = async (data: ICreateMerchant) => {
  return await AxiosClient.post(
    BASE_URL + INTERNAL_PATH + "/user/erp-create-user-for-merchant-app",
    data,
  );
};

const createAdmin = async (data: ICreateAdmin) => {
  return await AxiosClient.post(
    BASE_URL + INTERNAL_PATH + "/user/erp-create-user-for-admin-app",
    data,
  );
};

const updateInfoUser = async (
  user_id: string,
  data: IUpdateUser,
  platform: EPlatform,
) => {
  return await AxiosClient.post(
    BASE_URL +
      INTERNAL_PATH +
      `/users/${user_id}/${platform}/system-admin-update-user-info`,
    data,
  ).then((res) => res.data);
};

const resetPasswordUser = async (
  user_id: string,
  data: Omit<IUpdateUser, "phoneNumber">,
  platform: EPlatform,
) => {
  return await AxiosClient.post(
    BASE_URL +
      INTERNAL_PATH +
      `/users/${user_id}/${platform}/system-admin-reset-password`,
    data,
  ).then((res) => res.data);
};

const disableUser = async (user_id: string, platform: EPlatform) => {
  return await AxiosClient.post(
    BASE_URL + INTERNAL_PATH + `/users/${user_id}/${platform}/disable`,
  ).then((res) => res.data);
};

const enableUser = async (user_id: string, platform: EPlatform) => {
  return await AxiosClient.post(
    BASE_URL + INTERNAL_PATH + `/users/${user_id}/${platform}/enable`,
  ).then((res) => res.data);
};

const deleteUser = async (user_id: string, platform: EPlatform) => {
  return await AxiosClient.delete(
    BASE_URL + INTERNAL_PATH + `/users/${user_id}/${platform}/delete`,
  ).then((res) => res.data);
};

const updateAvartar = async (file: FormData) => {
  return await AxiosClient.put(
    BASE_URL + INTERNAL_PATH + "/user/upload-image",
    file,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  ).then((res) => res.data);
};

export {
  getListUser,
  getInfoUser,
  // createUser,
  createInvestor,
  createMerchant,
  createAdmin,
  updateInfoUser,
  resetPasswordUser,
  updateAvartar,
  disableUser,
  enableUser,
  deleteUser,
};
