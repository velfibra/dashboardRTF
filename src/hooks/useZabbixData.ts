"use client";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useZabbixData() {
  const { data, error } = useSWR("/api/zabbix-retificadoras", fetcher, {
    refreshInterval: 10000,
    fallbackData: { result: [] },
    keepPreviousData: true,
  });

  return { data: data?.result || [], error };
}
