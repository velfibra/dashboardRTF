"use client";

import { useState } from "react";
import Header from "./Header";
import FiltersBar from "./FilterBar";
import MachineCard from "./MchineCard";
import LoadingState from "./LoadingState";
import { useZabbixData } from "@/hooks/useZabbixData";
import { DisplayRetificadora, Item } from "@/utils/types";
import { alertKeys, consumptionKeys, contractMap } from "@/utils/constants";

export default function DashboardZabbix() {
  const [showOnlyAlerts, setShowOnlyAlerts] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { data: resultData, error } = useZabbixData();

  if (error) return <p className="text-white">Erro ao carregar dados</p>;

  const rtfHosts = resultData.filter((h: any) => h.host.startsWith("RTF"));

  const machines: DisplayRetificadora[] = rtfHosts.map((h: any) => {
    const alerts = h.items.filter(
      (item: Item) =>
        (alertKeys.includes(item.key_) && item.lastvalue !== "0") ||
        (item.key_ === "ac.input" && Number(item.lastvalue) === 0)
    );

    const lastclock = Math.max(
      ...h.items.map((item: Item) => Number(item.lastclock))
    );

    const batteriesStatus = h.items.filter((i: Item) =>
      [
        "sts.bateria.1",
        "sts.bateria.2",
        "sts.bateria.3",
        "sts.bateria.4",
      ].includes(i.key_)
    );
    const batteriesAlert = batteriesStatus.some(
      (b: Item) => b.lastvalue !== "0"
    );

    const smrStatus = {
      online: Number(
        h.items.find((i: Item) => i.key_ === "smr.on")?.lastvalue || 0
      ),
      work: Number(
        h.items.find((i: Item) => i.key_ === "smr.work")?.lastvalue || 0
      ),
    };

    const dcVoltage = Math.round(
      Number(h.items.find((i: Item) => i.key_ === "volt.dc")?.lastvalue || 0)
    );
    const acVoltage = Math.round(
      Number(h.items.find((i: Item) => i.key_ === "ac.input")?.lastvalue || 0)
    );

    const socItems = h.items.filter((i: Item) =>
      i.key_.startsWith("socchannel")
    );
    const socAverage =
      socItems.reduce((sum: number, i: Item) => sum + Number(i.lastvalue), 0) /
      (socItems.length || 1);

    const totalConsumption = Math.round(
      Number(
        h.items.find((i: Item) => i.key_ === "current.output")?.lastvalue || 0
      )
    );

    const bankConsumption = h.items.filter((i: Item) =>
      consumptionKeys.includes(i.key_)
    );

    const cityRaw = h.name.replace("RTF-", "").trim().toUpperCase();
    const contract = contractMap[cityRaw];

    return {
      hostid: h.hostid,
      name: h.name,
      alerts,
      lastclock,
      batteriesStatus,
      batteriesAlert,
      smrStatus,
      dcVoltage,
      acVoltage,
      socAverage,
      totalConsumption,
      bankConsumption,
      contract,
    };
  });

  const filteredMachines = machines.filter(
    (m) =>
      (!showOnlyAlerts ||
        m.alerts.length > 0 ||
        m.batteriesAlert ||
        m.bankConsumption.some((b) => Number(b.lastvalue) > 0)) &&
      m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-2 min-h-screen bg-black/90">
      <div className="flex justify-around max-lg:flex-col">
        <Header />
        <FiltersBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          showOnlyAlerts={showOnlyAlerts}
          setShowOnlyAlerts={setShowOnlyAlerts}
        />
      </div>

      <div className="mt-10">
        {filteredMachines.length === 0 ? (
          <LoadingState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-1 w-[95%] mx-auto">
            {filteredMachines.map((m) => (
              <MachineCard key={m.hostid} m={m} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
