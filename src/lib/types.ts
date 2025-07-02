export interface Converter {
  id: string;
  name: string;
  description: string;
  convert: (input: string) => Promise<string>;
}
