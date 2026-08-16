import { ApiError } from "./api-error";
import type {
  ApiClient,
  ApiClientConfig,
  ApiRequestOptions,
  QueryParams,
} from "./types";

const DEFAULT_TIMEOUT_MS = 15_000;

function joinUrl(baseUrl: string, path: string) {
  if (/^https?:\/\//i.test(path)) return path;
  return `${baseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

function targetsConfiguredApi(path: string, baseUrl: string) {
  if (!/^https?:\/\//i.test(path)) return true;
  try {
    return new URL(path).origin === new URL(baseUrl).origin;
  } catch {
    return false;
  }
}

function addQueryParams(url: string, query?: QueryParams) {
  if (!query) return url;

  const [pathname, currentQuery = ""] = url.split("?");
  const searchParams = new URLSearchParams(currentQuery);

  Object.entries(query).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== null && item !== undefined) {
          searchParams.append(key, String(item));
        }
      });
      return;
    }

    if (value !== null && value !== undefined) {
      searchParams.set(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `${pathname}?${queryString}` : pathname;
}

function isBodyAlreadySerializable(body: unknown): body is BodyInit {
  return (
    typeof body === "string" ||
    body instanceof Blob ||
    body instanceof FormData ||
    body instanceof URLSearchParams ||
    body instanceof ArrayBuffer ||
    ArrayBuffer.isView(body)
  );
}

function getErrorDetails(payload: unknown, status: number) {
  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    const message =
      typeof record.message === "string"
        ? record.message
        : typeof record.error === "string"
          ? record.error
          : `درخواست با خطای ${status} مواجه شد.`;
    const code = typeof record.code === "string" ? record.code : undefined;
    return { message, code };
  }

  return { message: `درخواست با خطای ${status} مواجه شد.` };
}

async function parseResponse(response: Response) {
  if (response.status === 204) return undefined;

  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) return response.json();

  const text = await response.text();
  return text.length > 0 ? text : undefined;
}

export function createApiClient(config: ApiClientConfig): ApiClient {
  async function request<TResponse, TBody = unknown>(
    path: string,
    options: ApiRequestOptions<TBody> = {},
  ): Promise<TResponse> {
    const {
      body,
      query,
      timeoutMs = config.timeoutMs ?? DEFAULT_TIMEOUT_MS,
      signal,
      headers: requestHeaders,
      ...requestInit
    } = options;

    const baseUrl =
      typeof config.baseUrl === "function" ? config.baseUrl() : config.baseUrl;
    const url = addQueryParams(joinUrl(baseUrl, path), query);
    const configuredHeaders =
      typeof config.defaultHeaders === "function"
        ? await config.defaultHeaders()
        : config.defaultHeaders;
    const headers = new Headers(configuredHeaders);
    new Headers(requestHeaders).forEach((value, key) => headers.set(key, value));

    if (
      !headers.has("authorization") &&
      config.getAccessToken &&
      targetsConfiguredApi(path, baseUrl)
    ) {
      const accessToken = await config.getAccessToken();
      if (accessToken) {
        const authorizationValue = /^Bearer\s/i.test(accessToken)
          ? accessToken
          : `Bearer ${accessToken}`;
        headers.set("authorization", authorizationValue);
      }
    }

    let requestBody: BodyInit | undefined;
    if (body !== undefined && body !== null) {
      if (isBodyAlreadySerializable(body)) {
        requestBody = body;
      } else {
        requestBody = JSON.stringify(body);
        if (!headers.has("content-type")) {
          headers.set("content-type", "application/json");
        }
      }
    }

    if (!headers.has("accept")) headers.set("accept", "application/json");

    const controller = new AbortController();
    const abortFromCaller = () => controller.abort(signal?.reason);
    if (signal?.aborted) abortFromCaller();
    signal?.addEventListener("abort", abortFromCaller, { once: true });
    const timeout = windowSafeSetTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...requestInit,
        body: requestBody,
        credentials: requestInit.credentials ?? config.credentials,
        headers,
        signal: controller.signal,
      });
      const payload = await parseResponse(response);

      if (!response.ok) {
        const { message, code } = getErrorDetails(payload, response.status);
        throw new ApiError({ message, status: response.status, code, data: payload });
      }

      return payload as TResponse;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      if (signal?.aborted) throw error;
      if (controller.signal.aborted) {
        throw new ApiError({
          message: "زمان پاسخ‌گویی وب‌سرویس به پایان رسید.",
          status: 408,
          code: "REQUEST_TIMEOUT",
        });
      }
      throw new ApiError({
        message: "ارتباط با وب‌سرویس برقرار نشد.",
        status: 0,
        code: "NETWORK_ERROR",
        data: error,
      });
    } finally {
      clearTimeout(timeout);
      signal?.removeEventListener("abort", abortFromCaller);
    }
  }

  return {
    request,
    get: (path, options) => request(path, { ...options, method: "GET" }),
    post: (path, body, options) =>
      request(path, { ...options, body, method: "POST" }),
    put: (path, body, options) =>
      request(path, { ...options, body, method: "PUT" }),
    patch: (path, body, options) =>
      request(path, { ...options, body, method: "PATCH" }),
    delete: (path, options) => request(path, { ...options, method: "DELETE" }),
  };
}

function windowSafeSetTimeout(callback: () => void, timeoutMs: number) {
  return globalThis.setTimeout(callback, timeoutMs);
}
