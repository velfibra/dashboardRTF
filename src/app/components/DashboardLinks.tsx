"use client";
import useSWR from "swr";
import { useState } from "react";
import FiltersBar from "./FilterBar";
import ClientLinkCard from "./ClientLinkCard";
import { InterfaceLink } from "@/utils/types";
import Header from "./Header";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface DisplayClientLink {
  clientName: string;
  rotaA?: InterfaceLink;
  rotaB?: InterfaceLink;
}

interface DisplaySwitch {
  switchName: string;
  clients: DisplayClientLink[];
}

// 🔧 Função que normaliza nomes para comparação
const normalizeName = (name: string): string =>
  name
    .toLowerCase()
    .replace(/_/g, "-")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/rota-[ab]$/, "")
    .replace(/-?via-[ab]$/, "")
    .replace(/-+$/, "")
    .trim();

export default function DashboardClientLinks() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showOnlyAlerts, setShowOnlyAlerts] = useState(false);

  const { data: rawData } = useSWR("/api/zabbix-retificadoras", fetcher, {
    refreshInterval: 10000,
    fallbackData: { result: [] },
    keepPreviousData: true,
  });

  const resultData = rawData?.result || [];

  const switches: DisplaySwitch[] = resultData.map((sw: any) => {
    const switchName = sw.name;

    const cliItems = sw.items.filter((i: InterfaceLink) =>
      /CLI[-_]/.test(i.name)
    );

    const clientsMap: Record<string, DisplayClientLink> = {};

    cliItems.forEach((item: InterfaceLink) => {
      const match = item.name.match(/CLI[-_]([^:]+)/);
      const rawClientName = match ? match[1].trim() : "Desconhecido";
      const clientKey = normalizeName(rawClientName);

      if (!clientsMap[clientKey]) {
        clientsMap[clientKey] = { clientName: rawClientName };
      }

      if (item.name.includes("ROTA_A") || item.name.includes("VIA-A")) {
        clientsMap[clientKey].rotaA = item;
      } else if (item.name.includes("ROTA_B") || item.name.includes("VIA-B")) {
        clientsMap[clientKey].rotaB = item;
      } else {
        // Caso tenha só uma rota sem ROTA_A/ROTA_B definidos
        if (!clientsMap[clientKey].rotaA) {
          clientsMap[clientKey].rotaA = item;
        } else if (!clientsMap[clientKey].rotaB) {
          clientsMap[clientKey].rotaB = item;
        }
      }
    });

    return {
      switchName,
      clients: Object.values(clientsMap),
    };
  });

  // --- Filtro de busca e alertas ---
  const filteredSwitches = switches
    .map((sw) => ({
      ...sw,
      clients: sw.clients.filter(
        (c) =>
          normalizeName(c.clientName).includes(
            normalizeName(searchTerm || "")
          ) &&
          (!showOnlyAlerts ||
            Number(c.rotaA?.lastvalue || 1) === 0 ||
            Number(c.rotaB?.lastvalue || 1) === 0)
      ),
    }))
    .filter((sw) => sw.clients.length > 0);

  return (
    <div className="p-2 min-h-screen bg-black/90 text-white">
      <div className="flex max-lg:flex-col">
        <Header />
        <FiltersBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          showOnlyAlerts={showOnlyAlerts}
          setShowOnlyAlerts={setShowOnlyAlerts}
        />
      </div>

      <div className="mt-10">
        {filteredSwitches.length === 0 ? (
          <div className="flex justify-center items-center h-[60vh]">
            Carregando dados...
          </div>
        ) : (
          filteredSwitches.map((sw) => (
            <div key={sw.switchName} className="mb-8 w-[95%] mx-auto">
              <h2 className="text-xl font-semibold mb-2 border-b border-gray-700">
                {sw.switchName}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {sw.clients.map((c) => (
                  <ClientLinkCard
                    key={`${sw.switchName}-${normalizeName(c.clientName)}`}
                    clientName={c.clientName}
                    rotaA={c.rotaA}
                    rotaB={c.rotaB}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
