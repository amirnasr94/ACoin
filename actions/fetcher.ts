"use server";

import type { SearchParams } from "next/dist/server/request/search-params";
import queryString from "query-string";

const BASE_URL = process.env.COINGECKO_BASE_URL;
const API_KEY = process.env.COINGECKO_API_KEY;

if (!BASE_URL) throw new Error("Could not get base url");
if (!API_KEY) throw new Error("Could not get Api key");

export async function fetcher<T>(
  endpoint: string,
  params?: SearchParams,
  revalidate: number = 60,
): Promise<T | undefined> {
  const url = queryString.stringifyUrl(
    {
      url: `${BASE_URL}/${endpoint}`,
      query: params,
    },
    { skipEmptyString: true, skipNull: true },
  );

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-cg-pro-api-key": API_KEY,
        "Content-Type": "application/json",
      } as Record<string, string>,
      next: { revalidate },
    });

    return await response.json();
  } catch (error) {
    throw new Error(`API ERROR ${error}`);
  }
}
