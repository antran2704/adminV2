import AxiosClient from "~/config/axiosClient";
import { INTERNAL_PATH } from "~/config/constants";
import { IUpdateInfoAdmin } from "~/interface";

const BASE_URL: string = import.meta.env.VITE_API_ENDPOINT as string;

const getMe = async () => {
  return await AxiosClient.get(BASE_URL + INTERNAL_PATH + "/user/me").then(
    (res) => res.data,
  );
};

const changePassword = async (oldPassword: string, newPassword: string) => {
  return await AxiosClient.post(
    BASE_URL + INTERNAL_PATH + "/user/change-password",
    {
      oldPassword,
      newPassword,
    },
  ).then((res) => res.data);
};

const updateMe = async (data: Partial<IUpdateInfoAdmin>) => {
  return await AxiosClient.put(
    BASE_URL + INTERNAL_PATH + "/user/update-user",
    data,
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

const updateImageProfile = async (imageProfile: string) => {
  return await AxiosClient.put(
    BASE_URL + INTERNAL_PATH + `/user/update-image-profile`,
    {
      imageProfile: imageProfile,
    },
  ).then((res) => res.data);
};

const presignedPutUrl = async (objectName: string) => {
  return await AxiosClient.get(
    BASE_URL + INTERNAL_PATH + `/user/presigned-put-url`,
    {
      params: { objectName: objectName },
    },
  ).then((res) => res.data);
};

export {
  getMe,
  changePassword,
  updateMe,
  updateAvartar,
  updateImageProfile,
  presignedPutUrl,
};
