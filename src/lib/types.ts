
export interface DataConverter {
  id: string;
  name: string;
  description: string;
  type: 'data';
  convert: (input: string) => Promise<string>;
}

export interface Unit {
  id: string;
  name: string;
  toBase: (value: number) => number;
  fromBase: (value: number) => number;
}

export interface UnitConverter {
  id: string;
  name: string;
  description: string;
  type: 'unit';
  units: Unit[];
}

export type AnyConverter = DataConverter | UnitConverter;
