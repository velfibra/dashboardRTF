"use client";
import { ClientLinkCardProps } from "@/utils/types";

export default function ClientLinkCard({
  clientName,
  rotaA,
  rotaB,
}: ClientLinkCardProps) {
  const getStatus = (link?: typeof rotaA) => {
    if (!link) return "🟡 Sem dados";
    return Number(link.lastvalue) > 0 ? "🟢 ON" : "🔴 OFF";
  };

  const getRouteName = (itemName: string) => {
    // Extrai o nome da rota entre "- " e ":"
    const match = itemName.match(/- (.+?):/);
    return match ? match[1] : itemName;
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "…" : text;
  };

  const lastUpdate = Math.max(rotaA?.lastclock || 0, rotaB?.lastclock || 0);

  return (
    <div className="p-2 rounded shadow text-white text-xs xl:hover:scale-105 duration-300 hover:cursor-pointer bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500">
      <h2 className="font-semibold text-center text-lg drop-shadow-[0_2px_3px_rgba(0,0,0,0.4)] truncate">
        {truncateText(clientName, 20)}
      </h2>
      <div className="mt-2 space-y-1">
        {rotaA && (
          <p className="truncate">
            <strong>Rota A:</strong> {getStatus(rotaA)}
          </p>
        )}
        {rotaB && (
          <p className="truncate">
            <strong>Rota B:</strong> {getStatus(rotaB)}
          </p>
        )}
        {!rotaA && !rotaB && (
          <p className="text-gray-300 italic">Nenhuma rota encontrada</p>
        )}
      </div>
      <p className="text-[10px] mt-1">
        Última atualização:{" "}
        {lastUpdate
          ? new Date(lastUpdate * 1000).toLocaleTimeString()
          : "sem registro"}
      </p>
    </div>
  );
}
