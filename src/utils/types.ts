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
