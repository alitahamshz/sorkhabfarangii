export type QueryPrimitive = string | number | boolean | null | undefined;

export type ApiMeta = readonly unknown[] | Record<string, unknown>;

export type ApiResponse<TData, TMeta extends ApiMeta = readonly unknown[]> = {
  success: "true" | "false";
  statusCode: string;
  message: string;
  data: TData;
  meta: TMeta;
};

export type QueryValue = QueryPrimitive | readonly QueryPrimitive[];

export type QueryParams = Record<string, QueryValue>;

export type NextFetchOptions = {
  revalidate?: number | false;
  tags?: string[];
};

export type ApiRequestOptions<TBody = unknown> = Omit<RequestInit, "body"> & {
  body?: TBody;
  query?: QueryParams;
  timeoutMs?: number;
  next?: NextFetchOptions;
};

export type ApiClient = {
  request<TResponse, TBody = unknown>(
    path: string,
    options?: ApiRequestOptions<TBody>,
  ): Promise<TResponse>;
  get<TResponse>(
    path: string,
    options?: ApiRequestOptions<never>,
  ): Promise<TResponse>;
  post<TResponse, TBody = unknown>(
    path: string,
    body?: TBody,
    options?: ApiRequestOptions<TBody>,
  ): Promise<TResponse>;
  put<TResponse, TBody = unknown>(
    path: string,
    body?: TBody,
    options?: ApiRequestOptions<TBody>,
  ): Promise<TResponse>;
  patch<TResponse, TBody = unknown>(
    path: string,
    body?: TBody,
    options?: ApiRequestOptions<TBody>,
  ): Promise<TResponse>;
  delete<TResponse>(
    path: string,
    options?: ApiRequestOptions<never>,
  ): Promise<TResponse>;
};

export type ApiClientConfig = {
  baseUrl: string | (() => string);
  credentials?: RequestCredentials;
  defaultHeaders?: HeadersInit | (() => HeadersInit | Promise<HeadersInit>);
  timeoutMs?: number;
};
