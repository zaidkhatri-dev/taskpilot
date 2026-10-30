"use server";

import { clientConfig } from "@repo/config/client";
import { getCookie } from "../utils/cookie";
import { GetBoardsResponse } from "@repo/contracts/response/board";
import { handleNetworkError } from "../utils/network";

export async function getBoards() {
  try {
    const response = await fetch(`${clientConfig.NEXT_PUBLIC_API_URL}/boards`, {
      method: "GET",
      headers: {
        Cookie: `connect.sid=${(await getCookie("connect.sid"))?.value || ""}`,
      },
      credentials: "include",
      cache: "no-store",
    });

    const result: GetBoardsResponse = await response.json();
    return result;
  } catch (error) {
    return handleNetworkError(error);
  }
}
