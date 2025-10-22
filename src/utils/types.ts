export interface Item {
  itemid: string;
  name: string;
  key_: string;
  lastvalue: string;
  lastclock: number;
}

export interface DisplayRetificadora {
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

export interface Host {
  hostid: string;
  host: string;
  name: string;
  items: Item[];
}

export interface DisplaySwitch {
  hostid: string;
  name: string;
  pingStatus: "UP" | "DOWN";
  loss: number;
  latency: number;
  lastclock: number;
}
