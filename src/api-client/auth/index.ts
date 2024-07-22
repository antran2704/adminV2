import AxiosClient from "~/config/axiosClient";

import { INTERNAL_PATH } from "~/config/constants";
import { IForgotPassword, ILogin, ISignup } from "~/interface";

const BASE_URL: string = process.env.NEXT_PUBLIC_API_ENDPOINT as string;

const login = async (body: ILogin) => {
  return await AxiosClient.post(
    BASE_URL + INTERNAL_PATH + "/user/sign-in",
    body,
  ).then((res) => res.data);
};

const signup = async (body: ISignup) => {
  return await AxiosClient.post(
    BASE_URL + INTERNAL_PATH + "/user/sign-up",
    body,
  ).then((res) => res.data);
};

const forgotPassword = async (email: string) => {
  return await AxiosClient.post(
    BASE_URL + INTERNAL_PATH + "/user/forgot-password",
    {
      email,
    },
  ).then((res) => res.data);
};

const isInForgotPassword = async (email: string) => {
  return await AxiosClient.post(
    BASE_URL + INTERNAL_PATH + "/user/is-in-forgotten-password-progress",
    {
      email,
    },
  ).then((res) => res.data);
};

const isExitUser = async (email: string) => {
  return await AxiosClient.post(BASE_URL + INTERNAL_PATH + "/user/is-exist", {
    email,
  }).then((res) => res.data);
};

const resetPassword = async (body: IForgotPassword) => {
  return await AxiosClient.post(
    BASE_URL + INTERNAL_PATH + "/user/reset-password",
    body,
  ).then((res) => res.data);
};

const logout = async () => {
  return await AxiosClient.post(BASE_URL + INTERNAL_PATH + "/user/revoke");
};

const getRefreshToken = async (accessToken: string, refreshToken: string) => {
  return await AxiosClient.post(
    BASE_URL + INTERNAL_PATH + "/user/refresh-token",
    {
      accessToken,
      refreshToken,
    },
  ).then((res) => res.data);
};

export {
  signup,
  login,
  getRefreshToken,
  isInForgotPassword,
  isExitUser,
  forgotPassword,
  resetPassword,
  logout,
};
