"use client";

interface FiltersBarProps {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  showOnlyAlerts: boolean;
  setShowOnlyAlerts: (v: boolean) => void;
}

export default function FiltersBar({
  searchTerm,
  setSearchTerm,
  showOnlyAlerts,
  setShowOnlyAlerts,
}: FiltersBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mb-2 gap-2 w-[90%] mx-auto">
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
  );
}
