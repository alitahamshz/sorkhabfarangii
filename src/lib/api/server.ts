import "server-only";

import { getServerSession } from "@/features/auth/server/session";
import { createApiClient } from "./request";

const DEFAULT_SERVER_API_URL = "http://localhost:5050/api";

export const serverApi = createApiClient({
  baseUrl: () => process.env.API_BASE_URL ?? DEFAULT_SERVER_API_URL,
  getAccessToken: async () => (await getServerSession())?.accessToken,
});
