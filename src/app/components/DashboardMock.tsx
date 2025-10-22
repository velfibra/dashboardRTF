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

interface DisplayRetificadora {
  hostid: string;
  name: string;
  alerts: Item[];
  lastclock: number;
  batteriesStatus: Item[];
  batteriesAlert: boolean;
  smrStatus: { online: number; work: number };
  dcVoltage: number;
  acVoltage: number;
  socAverage: number;
  totalConsumption: number;
  bankConsumption: Item[];
  contract?: string;
}

const alertKeys = [
  "sts.bateria.1",
  "sts.bateria.2",
  "sts.bateria.3",
  "sts.bateria.4",
  "alarm.volt.low",
  "alarm.volt.low.",
  "stsfumaca",
];

const consumptionKeys = ["dc.banco", "dc.banco2"];
const fetcher = (url: string) => fetch(url).then((res) => res.json());

// 🔗 Mapeamento POP -> Contrato (em uppercase para compatibilidade)
const contractMap: Record<string, string> = {
  BUJARU: "3033602986",
  "TOME-ACU": "3035768890",
  PALMARES: "3033655737",
  "OLHO DAGUA": "3035992218",
  LARANJAL: "3003033633253",
  "NOVA IPIXUNA": "3017013761",
  "BOM JESUS TO-PA": "3034668735",
  "VILA DO MARRECO": "3024222143",
  "IMPERATRIZ-A": "3023780304",
  "IMPERATRIZ-B": "3023780304",
  CASTANHAL: "3035762280",
  "S-MIGUEL": "3034987121",
  "NV-HORIZONTE": "3036340176",
  "PARAGOMINAS-01": "3034875722",
  ULIANOPOLIS: "3034951488",
  "CAJUAPARA-01": "3023835176",
  "GMA-PS-A1": "3000995150",
  "GMA-PS-A2": "3000995150",
  "GMA-PS-A3": "3000995150",
  "GMA-PS-B1": "3000995150",
  "GMA-PS-B2": "3000995150",
  "GMA-PS-B3": "3000995150",
  "CN6-PS-A1": "3015842717",
  "BEG-A1": "3016514917",
  "MCG-01": "3034500796",
  "MRB-01": "3035991416",
  "CQR-A1": "3031589028",
};

export default function DashboardZabbix() {
  const [showOnlyAlerts, setShowOnlyAlerts] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: rawData, error } = useSWR(
    "/api/zabbix-retificadoras",
    fetcher,
    {
      refreshInterval: 10000,
      fallbackData: { result: [] },
      keepPreviousData: true,
    }
  );

  if (error) return <p className="text-white">Erro ao carregar dados</p>;

  const resultData = rawData?.result || [];
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

    const batteriesStatus: Item[] = h.items.filter((item: Item) =>
      [
        "sts.bateria.1",
        "sts.bateria.2",
        "sts.bateria.3",
        "sts.bateria.4",
      ].includes(item.key_)
    );

    const batteriesAlert: boolean = batteriesStatus.some(
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

    // const acVoltage: number = 0;

    const socItems: Item[] = h.items.filter((i: Item) =>
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

    // 🔍 Extrai o nome da cidade do host (RTF-CIDADE)
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

  const getCardColor = (m: DisplayRetificadora) => {
    if (m.acVoltage === 0)
      return "bg-gradient-to-br from-red-800 via-red-700 to-rose-600 text-white"; // queda de energia
    if (m.batteriesAlert) return "bg-yellow-400 text-black"; // bateria ativada
    if (m.bankConsumption.some((b) => Number(b.lastvalue) > 0))
      return "bg-yellow-500 text-black"; // consumo banco
    return "bg-gradient-to-r from-green-700 via-green-600 to-green-500 text-white"; // normal
  };

  const renderAlertValue = (item: Item) => {
    if (item.key_ === "ac.input" && Number(item.lastvalue) === 0)
      return "POP sem energia!";
    if (consumptionKeys.includes(item.key_) && Number(item.lastvalue) > 0)
      return `${item.lastvalue} A`;
    return item.lastvalue;
  };

  return (
    <div className="p-2 min-h-screen bg-black/90">
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

      <div className="mt-10 ">
        {filteredMachines.length === 0 ? (
          <div className="flex justify-center items-center h-[60vh]">
            <div className="flex flex-col items-center text-white space-y-2">
              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Carregando dados...</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-1 w-[95%] mx-auto">
            {filteredMachines.map((m) => (
              <div
                key={m.hostid}
                className={`p-1 rounded shadow text-white text-xs xl:hover:scale-110 duration-300 hover:cursor-pointer ${getCardColor(
                  m
                )}`}
              >
                <h2 className="font-semibold text-center text-lg drop-shadow-[0_2px_3px_rgba(0,0,0,0.4)]">
                  {m.name}
                </h2>
                <p className="text-center drop-shadow-[0_2px_3px_rgba(0,0,0,0.4)]">
                  Status:{" "}
                  {m.acVoltage === 0 ? (
                    <div className="flex flex-col">
                      <span className="text-red-300 font-bold drop-shadow-[0_2px_3px_rgba(0,0,0,0.4)]">
                        ⚠️ Queda de energia
                      </span>
                      <span className="ml-1 text-white text-xs font-semibold drop-shadow-[0_2px_3px_rgba(0,0,0,0.4)]">
                        ( Conta contrato: {m.contract})
                      </span>
                    </div>
                  ) : m.alerts.length === 0 &&
                    !m.batteriesAlert &&
                    !m.bankConsumption.some((b) => Number(b.lastvalue) > 0) ? (
                    "OK"
                  ) : m.alerts.length > 0 ? (
                    "ALERTA!"
                  ) : m.batteriesAlert ? (
                    "ALERTA BATERIA!"
                  ) : (
                    "ALERTA BANCO EM USO!"
                  )}
                </p>

                <p className="text-center text-[11px]">
                  Última atualização:{" "}
                  {new Date(m.lastclock * 1000).toLocaleTimeString()}
                </p>

                <div className="mt-1">
                  <p>
                    <strong>Baterias:</strong>{" "}
                    {m.batteriesAlert ? (
                      <span className="text-red-500">
                        ALERTA! Alguma bateria ativada
                      </span>
                    ) : (
                      "OK"
                    )}
                    <p>
                      <strong>SMR:</strong> Online {m.smrStatus.online} |
                      Operando {m.smrStatus.work}
                    </p>
                  </p>
                  <div className="flex ">
                    <p>
                      <strong>Entrada AC:</strong> {m.acVoltage} V
                    </p>
                    <p className="ml-5">
                      <strong>Voltagem DC:</strong> {m.dcVoltage} V
                    </p>
                  </div>

                  <p>
                    <strong>SOC médio:</strong> {m.socAverage.toFixed(1)}%{" "}
                    {m.bankConsumption.length > 0 && (
                      <span className="ml-2 font-bold">
                        Banco{" "}
                        {m.bankConsumption
                          .map(
                            (b, i) =>
                              `${i + 1}: ${Number(b.lastvalue).toFixed(2)} A`
                          )
                          .join(" | ")}
                      </span>
                    )}
                  </p>

                  <p>
                    <strong>Consumo total:</strong> {m.totalConsumption} A
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
