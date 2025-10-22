import { DisplayRetificadora, Item } from "./types";
import { consumptionKeys } from "./constants";

export const getCardColor = (m: DisplayRetificadora) => {
  if (m.acVoltage === 0)
    return "bg-gradient-to-br from-red-800 via-red-700 to-rose-600 text-white";
  if (m.batteriesAlert) return "bg-yellow-400 text-black";
  if (m.bankConsumption.some((b) => Number(b.lastvalue) > 0))
    return "bg-yellow-500 text-black";
  return "bg-gradient-to-r from-green-700 via-green-600 to-green-500 text-white";
};

export const renderAlertValue = (item: Item) => {
  if (item.key_ === "ac.input" && Number(item.lastvalue) === 0)
    return "POP sem energia!";
  if (consumptionKeys.includes(item.key_) && Number(item.lastvalue) > 0)
    return `${item.lastvalue} A`;
  return item.lastvalue;
};
