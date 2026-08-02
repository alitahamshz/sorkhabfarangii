export class ApiError<TData = unknown> extends Error {
  readonly status: number;
  readonly code?: string;
  readonly data?: TData;

  constructor({
    message,
    status,
    code,
    data,
  }: {
    message: string;
    status: number;
    code?: string;
    data?: TData;
  }) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.data = data;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
