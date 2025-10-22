"use client";

import FiltersBar from "./FilterBar";
import Header from "./Header";

interface SwitchControlsProps {
  showOnlyAlerts: boolean;
  setShowOnlyAlerts: (v: boolean) => void;
  searchTerm: string;
  setSearchTerm: (v: string) => void;
}

export default function SwitchControls({
  showOnlyAlerts,
  setShowOnlyAlerts,
  searchTerm,
  setSearchTerm,
}: SwitchControlsProps) {
  return (
    <div className="">
      <div className="flex justify-around">
        <Header />
        <FiltersBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          showOnlyAlerts={showOnlyAlerts}
          setShowOnlyAlerts={setShowOnlyAlerts}
        />
      </div>
    </div>
  );
}
