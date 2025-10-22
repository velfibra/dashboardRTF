"use client";

import useSWR from "swr";
import { useState } from "react";
import Header from "./Header";
import SwitchControls from "./SwitchControls";
import SwitchGrid from "./SwitchGrid";
import { Host, DisplaySwitch } from "@/utils/types";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DashboardSwitch() {
  const [showOnlyAlerts, setShowOnlyAlerts] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: rawData,
    error,
    isLoading,
  } = useSWR("/api/zabbix-retificadoras", fetcher, {
    refreshInterval: 10000,
    fallbackData: { result: [] },
    keepPreviousData: true,
  });

  if (error) return <p className="text-white">Erro ao carregar dados</p>;

  const resultData = rawData?.result || [];

  // 🔍 Filtra apenas os switches
  const switchHosts: Host[] = resultData.filter((h: Host) =>
    h.host.startsWith("SW-MGMT-")
  );

  // 🧠 Mapeia dados tratados
  const switches: DisplaySwitch[] = switchHosts.map((h) => {
    const icmpPing = h.items.find((i) => i.key_ === "icmpping");
    const icmpLoss = h.items.find((i) => i.key_ === "icmppingloss");
    const icmpLatency = h.items.find((i) => i.key_ === "icmppingsec");

    const pingStatus = icmpPing?.lastvalue === "1" ? "UP" : "DOWN";
    const loss = icmpLoss ? Number(icmpLoss.lastvalue) : 0;
    const latency = icmpLatency ? Number(icmpLatency.lastvalue) : 0;

    const lastclock = Math.max(
      ...h.items.map((item) => Number(item.lastclock))
    );

    return {
      hostid: h.hostid,
      name: h.name,
      pingStatus,
      loss,
      latency,
      lastclock,
    };
  });

  // 🔎 Filtro
  const filteredSwitches = switches.filter(
    (s) =>
      (!showOnlyAlerts || s.pingStatus === "DOWN" || s.loss > 0) &&
      s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-2 min-h-screen bg-black/90">
      <SwitchControls
        showOnlyAlerts={showOnlyAlerts}
        setShowOnlyAlerts={setShowOnlyAlerts}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <SwitchGrid switches={filteredSwitches} isLoading={isLoading} />
    </div>
  );
}
