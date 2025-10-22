"use client";

import SwitchCard from "./Switchcard";
import { DisplaySwitch } from "@/utils/types";

interface SwitchGridProps {
  switches: DisplaySwitch[];
  isLoading: boolean;
}

export default function SwitchGrid({ switches, isLoading }: SwitchGridProps) {
  if (isLoading || switches.length === 0) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="flex flex-col items-center text-white space-y-2">
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Carregando dados...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-1 w-[95%] mx-auto mt-10">
      {switches.map((s) => (
        <SwitchCard key={s.hostid} data={s} />
      ))}
    </div>
  );
}
