"use client";

import useSWR from "swr";
import { useState } from "react";
import Header from "./Header";

interface Item {
  itemid: string;
  name: string;
  key_: string;
  lastvalue: string;
  lastclock: number;
}

interface Host {
  hostid: string;
  host: string;
  name: string;
  items: Item[];
}

interface DisplaySwitch {
  hostid: string;
  name: string;
  pingStatus: "UP" | "DOWN";
  loss: number;
  latency: number;
  lastclock: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DashboardSwitch() {
  const [showOnlyAlerts, setShowOnlyAlerts] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: rawData,
    error,
    isLoading,
  } = useSWR(
    "/api/zabbix-retificadoras", // mesma rota
    fetcher,
    {
      refreshInterval: 10000,
      fallbackData: { result: [] },
      keepPreviousData: true,
    }
  );

  if (error) return <p className="text-white">Erro ao carregar dados</p>;

  const resultData = rawData?.result || [];

  // Filtra apenas os switches
  const switchHosts: Host[] = resultData.filter((h: Host) =>
    h.host.startsWith("SW-MGMT-")
  );

  const switches: DisplaySwitch[] = switchHosts.map((h) => {
    const icmpPing = h.items.find((i) => i.key_ === "icmpping");
    const icmpLoss = h.items.find((i) => i.key_ === "icmppingloss");
    const icmpLatency = h.items.find((i) => i.key_ === "icmppingsec");

    const pingStatus: "UP" | "DOWN" =
      icmpPing?.lastvalue === "1" ? "UP" : "DOWN";

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

  const filteredSwitches = switches.filter(
    (s) =>
      (!showOnlyAlerts || s.pingStatus === "DOWN" || s.loss > 0) &&
      s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCardColor = (s: DisplaySwitch) => {
    if (s.pingStatus === "DOWN")
      return "bg-gradient-to-br from-red-800 via-red-700 to-rose-600 text-white";
    if (s.loss > 0) return "bg-yellow-400 text-black";
    return "bg-gradient-to-br from-green-800 via-green-700 to-emerald-600 text-white";
  };

  return (
    <div className="p-2 min-h-screen bg-black/90">
      {/* Header e controles */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-2 gap-2 w-[90%] mx-auto">
        <Header />
        <input
          type="text"
          placeholder="Pesquisar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-2 py-1 rounded text-black bg-white text-sm w-full sm:w-64"
        />

        <label className="flex items-center space-x-2 text-white text-xs">
          <input
            type="checkbox"
            checked={showOnlyAlerts}
            onChange={() => setShowOnlyAlerts(!showOnlyAlerts)}
            className="accent-blue-500"
          />
          <span>Mostrar apenas alertas</span>
        </label>
      </div>

      {/* Conteúdo */}
      <div className="mt-10">
        {isLoading || filteredSwitches.length === 0 ? (
          <div className="flex justify-center items-center h-[60vh]">
            <div className="flex flex-col items-center text-white space-y-2">
              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Carregando dados...</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-1 w-[95%] mx-auto">
            {filteredSwitches.map((s) => (
              <div
                key={s.hostid}
                className={`p-1 rounded shadow text-xs xl:hover:scale-110 duration-300 hover:cursor-pointer ${getCardColor(
                  s
                )}`}
              >
                <h2 className="font-semibold text-center">{s.name}</h2>
                <p className="text-center">
                  Status: {s.pingStatus === "UP" ? "🟢 UP" : "🔴 DOWN"}
                </p>
                <p className="text-center text-[10px]">
                  Última atualização:{" "}
                  {new Date(s.lastclock * 1000).toLocaleTimeString()}
                </p>

                <div className="mt-1 text-sm">
                  <p>
                    <strong>Perda de pacotes:</strong> {s.loss.toFixed(2)} %
                  </p>
                  <p>
                    <strong>Latência:</strong>{" "}
                    {s.latency ? `${(s.latency * 1000).toFixed(2)} ms` : "N/A"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
