import axios from "axios";
// import { NextRouter } from "next/router";
import { getRefreshToken } from "~/api-client/auth";
import { getAuthToken, removeAuthToken, setAuthToken } from "~/helper/auth";
import { IAuthToken } from "~/interface";
import { AppDispatch } from "~/store";
import { logoutUser } from "~/store/slice/user";
import jwt, { JwtPayload } from "jsonwebtoken";
import { INTERNAL_PATH } from "./constants";
import { message } from "antd";
import MESSAGE_ERROR from "~/commons/error";

let router: any;
let isRefreshToken: boolean = false;
let tError: any;
let dispatch: AppDispatch;

export const injectStore = (_dispatch: AppDispatch) => {
  dispatch = _dispatch;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const injectRouter = (_router: any) => {
  router = _router;
};

export const injectTranslate = (_tError: any) => {
  tError = _tError;
};

const AxiosClient = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, //timeout after 30 seconds
});

// list url don't need check accessToken or refreshToken
const SKIP_URL: string[] = [
  process.env.NEXT_PUBLIC_API_ENDPOINT + INTERNAL_PATH + "/user/sign-in",
  process.env.NEXT_PUBLIC_API_ENDPOINT + INTERNAL_PATH + "/user/sign-up",
  process.env.NEXT_PUBLIC_API_ENDPOINT +
    INTERNAL_PATH +
    "/user/forgot-password",
  process.env.NEXT_PUBLIC_API_ENDPOINT +
    INTERNAL_PATH +
    "/user/is-in-forgotten-password-progress",
  process.env.NEXT_PUBLIC_API_ENDPOINT + INTERNAL_PATH + "/user/is-exist",
  process.env.NEXT_PUBLIC_API_ENDPOINT + INTERNAL_PATH + "/user/reset-password",
];

// list error message need logout when token expried
const listError: string[] = [
  "INVALID_REFRESH_TOKEN",
  "Unauthorized",
  "REFRESH_TOKEN_EXPIRED",
];

AxiosClient.interceptors.request.use(
  async (config) => {
    const accessToken = getAuthToken("accessToken");
    const refreshToken = getAuthToken("refreshToken") as string;

    /**
     *  get uri of url request
     *  expample: internal/user/login
     **/
    const url: string = config.url as string;

    // controller for cancle request to server if refreshToken expried
    const controller = new AbortController();

    // check accesstoken already have on browser
    if (accessToken) {
      const decoded: JwtPayload = jwt.decode(accessToken) as JwtPayload;

      if (!decoded) {
        removeAuthToken();
        dispatch(logoutUser());
        router.push("/");

        controller.abort();
        return {
          ...config,
          signal: controller.signal,
        };
      }

      const accessTokenExp: number = decoded?.exp as number;
      const currentTime: number = Math.floor(new Date().getTime() / 1000) + 60;

      // check accessToken still live or was expried
      if (currentTime >= accessTokenExp && !isRefreshToken) {
        isRefreshToken = true;
        const refreshToken = getAuthToken("refreshToken") as string;

        try {
          const response: IAuthToken = await getRefreshToken(
            accessToken,
            refreshToken,
          );

          if (response) {
            setAuthToken("accessToken", response.accessToken);
            setAuthToken("refreshToken", response.refreshToken);

            // Retry the original request with the new token
            config.headers.Authorization = `Bearer ${response.accessToken}`;
            isRefreshToken = false;
            return config;
          }
        } catch (error) {
          controller.abort();

          return {
            ...config,
            signal: controller.signal,
          };
        }
      }

      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    if (!accessToken && SKIP_URL.includes(url)) return config;

    if ((!accessToken || !refreshToken) && !SKIP_URL.includes(url)) {
      removeAuthToken();
      dispatch(logoutUser());
      router.push("/login");

      controller.abort();

      return {
        ...config,
        signal: controller.signal,
      };
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Add a response interceptor
AxiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // If the error status is 401 and there is no originalRequest._retry flag,
    // it means the token has expired and we need to refresh it

    if (!error.response) {
      return Promise.reject(error);
    }

    if (
      error.response.status === 401 &&
      listError.includes(error.response.data.message) &&
      isRefreshToken
    ) {
      isRefreshToken = false;
      removeAuthToken();
      dispatch(logoutUser());
      router.push("/login");
    }

    if (
      error.response.status === 401 &&
      error.response.data.message === MESSAGE_ERROR.REFRESH_TOKEN_EXPIRED
    ) {
      message.error(tError(error.response.data.message));
    }

    return Promise.reject(error);
  },
);

export default AxiosClient;
