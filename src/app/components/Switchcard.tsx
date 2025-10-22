"use client";

import { DisplaySwitch } from "@/utils/types";

interface SwitchCardProps {
  data: DisplaySwitch;
}

export default function SwitchCard({ data }: SwitchCardProps) {
  const getCardColor = (s: DisplaySwitch) => {
    if (s.pingStatus === "DOWN")
      return "bg-gradient-to-br from-red-800 via-red-700 to-rose-600 text-white";
    if (s.loss > 0) return "bg-yellow-400 text-black";
    return "bg-gradient-to-br from-green-800 via-green-700 to-emerald-600 text-white";
  };

  return (
    <div
      className={`p-1 rounded shadow text-xs xl:hover:scale-110 duration-300 hover:cursor-pointer ${getCardColor(
        data
      )}`}
    >
      <h2 className="font-semibold text-center drop-shadow-[0_2px_3px_rgba(0,0,0,0.4)]">
        {data.name}
      </h2>
      <p className="text-center drop-shadow-[0_2px_3px_rgba(0,0,0,0.4)]">
        Status: {data.pingStatus === "UP" ? "🟢 UP" : "🔴 DOWN"}
      </p>
      <p className="text-center text-[10px]">
        Última atualização:{" "}
        {new Date(data.lastclock * 1000).toLocaleTimeString()}
      </p>

      <div className="mt-1 text-sm">
        <p>
          <strong>Perda de pacotes:</strong> {data.loss.toFixed(2)} %
        </p>
        <p>
          <strong>Latência:</strong>{" "}
          {data.latency ? `${(data.latency * 1000).toFixed(2)} ms` : "N/A"}
        </p>
      </div>
    </div>
  );
}
