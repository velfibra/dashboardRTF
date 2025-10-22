import { DisplayRetificadora } from "@/utils/types";
import { getCardColor } from "@/utils/machineHelpers";

export default function MachineCard({ m }: { m: DisplayRetificadora }) {
  return (
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
        Última atualização: {new Date(m.lastclock * 1000).toLocaleTimeString()}
      </p>

      <div className="mt-1">
        <p>
          <strong>Baterias:</strong>{" "}
          {m.batteriesAlert ? (
            <span className="text-red-500">ALERTA! Alguma bateria ativada</span>
          ) : (
            "OK"
          )}
        </p>

        <p>
          <strong>SMR:</strong> Online {m.smrStatus.online} | Operando{" "}
          {m.smrStatus.work}
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
          <strong>SOC médio:</strong> {m.socAverage.toFixed(1)}%
          {m.bankConsumption.length > 0 && (
            <span className="ml-2 font-bold">
              Banco{" "}
              {m.bankConsumption
                .map((b, i) => `${i + 1}: ${Number(b.lastvalue).toFixed(2)} A`)
                .join(" | ")}
            </span>
          )}
        </p>

        <p>
          <strong>Consumo total:</strong> {m.totalConsumption} A
        </p>
      </div>
    </div>
  );
}
