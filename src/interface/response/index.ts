interface ErrorResponse {
  message: string;
  statusCode: number;
  path: string;
  timestamp: string;
}

interface IPaginationResponse {
  page: number;
  take: number;
  pageCount: number;
  itemCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

interface IResponseData<T> {
  data: T;
  meta: IPaginationResponse;
}

export type { ErrorResponse, IResponseData, IPaginationResponse };
