import axios from "axios";
import { ErrorResponse } from "~/interface";

const hanldeErrorAxios = (
  err: unknown,
): Pick<ErrorResponse, "message" | "statusCode"> => {
  if (!axios.isAxiosError(err)) {
    return { message: "Internal Server", statusCode: 500 };
  }

  const response = err.response;

  if (!response) {
    return { message: "Internal Server", statusCode: 500 };
  }

  return response.data;
};

export default hanldeErrorAxios;
