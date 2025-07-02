import type { Converter } from '@/lib/types';

const numberParser = (input: string, convert: (val: number) => number) => {
  if (input.trim() === '') return '';
  const value = parseFloat(input);
  if (isNaN(value)) {
    return 'Invalid input: must be a number.';
  }
  const result = convert(value);

  // Avoid scientific notation for small/large numbers and fix precision
  if (Math.abs(result) < 1e-6 && result !== 0) {
      return result.toExponential(4);
  }
  // Smart precision for floating point numbers
  if (result.toString().includes('.')) {
    const integerPartLength = Math.trunc(result).toString().length;
    const precision = Math.max(0, 8 - integerPartLength);
    return result.toFixed(precision);
  }
  return result.toString();
};


export const converters: Converter[] = [
    {
        id: 'json-to-yaml',
        name: 'JSON to YAML',
        description: 'Convert JSON data to YAML format.',
        convert: async (input) => {
            try {
                if (!input.trim()) return '';
                const obj = JSON.parse(input);
                
                // This is a naive implementation for demonstration purposes.
                const toYaml = (data: any, level: number): string => {
                    const indentStr = '  '.repeat(level);
                    if (data === null) return 'null';
                    if (typeof data === 'string') return `${data}`;
                    if (typeof data === 'number' || typeof data === 'boolean') return String(data);
                    if (Array.isArray(data)) {
                        if (data.length === 0) return '[]';
                        return data.map(item => `\n${indentStr}- ${toYaml(item, level + 1).trimStart()}`).join('');
                    }
                    if (typeof data === 'object') {
                        if (Object.keys(data).length === 0) return '{}';
                        return Object.entries(data)
                            .map(([key, value]) => `\n${indentStr}${key}: ${toYaml(value, level + 1).trimStart()}`)
                            .join('');
                    }
                    return String(data);
                };
                return toYaml(obj, 0).trim();
            } catch (e) {
                if (e instanceof Error) return `# Invalid JSON: ${e.message}`;
                return '# Invalid JSON input';
            }
        },
    },
    {
        id: 'yaml-to-json',
        name: 'YAML to JSON',
        description: 'Convert YAML data to JSON format (basic).',
        convert: async (input) => {
            // This is a very basic mock, not a real parser.
            try {
                if (!input.trim()) return '';
                const lines = input.split('\n').filter(line => line.trim() && !line.trim().startsWith('#'));
                const obj: Record<string, any> = {};
                lines.forEach(line => {
                    const parts = line.split(':');
                    if (parts.length > 1) {
                        const key = parts[0].trim();
                        const value = parts.slice(1).join(':').trim();
                        obj[key] = value;
                    }
                });
                return JSON.stringify(obj, null, 2);
            } catch (e) {
                 if (e instanceof Error) return `{\n  "error": "Could not parse YAML: ${e.message}"\n}`;
                 return `{\n  "error": "Could not parse YAML"\n}`;
            }
        },
    },
    {
        id: 'base64-encode',
        name: 'Base64 Encode',
        description: 'Encode text to Base64.',
        convert: async (input) => {
            try {
                if (typeof window !== 'undefined') {
                    return window.btoa(unescape(encodeURIComponent(input)));
                }
                return Buffer.from(input).toString('base64');
            } catch (e) {
                return 'Error encoding to Base64.'
            }
        }
    },
    {
        id: 'base64-decode',
        name: 'Base64 Decode',
        description: 'Decode Base64 to text.',
        convert: async (input) => {
            try {
                if (typeof window !== 'undefined') {
                    return decodeURIComponent(escape(window.atob(input)));
                }
                return Buffer.from(input, 'base64').toString('utf-8');
            } catch (e) {
                return 'Invalid Base64 string.'
            }
        }
    },
    {
        id: 'url-encode',
        name: 'URL Encode',
        description: 'Encode text for use in URLs.',
        convert: async (input) => encodeURIComponent(input),
    },
    {
        id: 'url-decode',
        name: 'URL Decode',
        description: 'Decode URL-encoded text.',
        convert: async (input) => {
            try {
                return decodeURIComponent(input);
            } catch (e) {
                return 'Invalid URL-encoded string.'
            }
        },
    },

    // --- Unit Converters ---

    // Length / Distance
    {
        id: 'metre-to-kilometre',
        name: 'Metre to Kilometre',
        description: 'm → km',
        convert: async (input) => numberParser(input, (n) => n / 1000),
    },
    {
        id: 'kilometre-to-metre',
        name: 'Kilometre to Metre',
        description: 'km → m',
        convert: async (input) => numberParser(input, (n) => n * 1000),
    },
    {
        id: 'metre-to-foot',
        name: 'Metre to Foot',
        description: 'm → ft',
        convert: async (input) => numberParser(input, (n) => n * 3.28084),
    },
    {
        id: 'foot-to-metre',
        name: 'Foot to Metre',
        description: 'ft → m',
        convert: async (input) => numberParser(input, (n) => n / 3.28084),
    },
    {
        id: 'metre-to-inch',
        name: 'Metre to Inch',
        description: 'm → in',
        convert: async (input) => numberParser(input, (n) => n * 39.3701),
    },
    {
        id: 'inch-to-metre',
        name: 'Inch to Metre',
        description: 'in → m',
        convert: async (input) => numberParser(input, (n) => n / 39.3701),
    },
    {
        id: 'mile-to-kilometre',
        name: 'Mile to Kilometre',
        description: 'mi → km',
        convert: async (input) => numberParser(input, (n) => n * 1.60934),
    },
    {
        id: 'kilometre-to-mile',
        name: 'Kilometre to Mile',
        description: 'km → mi',
        convert: async (input) => numberParser(input, (n) => n / 1.60934),
    },

    // Area
    {
        id: 'sqmetre-to-sqfoot',
        name: 'Square Metre to Square Foot',
        description: 'm² → ft²',
        convert: async (input) => numberParser(input, (n) => n * 10.764),
    },
    {
        id: 'sqfoot-to-sqmetre',
        name: 'Square Foot to Square Metre',
        description: 'ft² → m²',
        convert: async (input) => numberParser(input, (n) => n / 10.764),
    },
    {
        id: 'acre-to-hectare',
        name: 'Acre to Hectare',
        description: 'ac → ha',
        convert: async (input) => numberParser(input, (n) => n / 2.471),
    },
    {
        id: 'hectare-to-acre',
        name: 'Hectare to Acre',
        description: 'ha → ac',
        convert: async (input) => numberParser(input, (n) => n * 2.471),
    },

    // Volume / Capacity
    {
        id: 'litre-to-millilitre',
        name: 'Litre to Millilitre',
        description: 'L → mL',
        convert: async (input) => numberParser(input, (n) => n * 1000),
    },
    {
        id: 'millilitre-to-litre',
        name: 'Millilitre to Litre',
        description: 'mL → L',
        convert: async (input) => numberParser(input, (n) => n / 1000),
    },
    {
        id: 'usgallon-to-litre',
        name: 'US Gallon to Litre',
        description: 'gal (US) → L',
        convert: async (input) => numberParser(input, (n) => n * 3.78541),
    },
    {
        id: 'litre-to-usgallon',
        name: 'Litre to US Gallon',
        description: 'L → gal (US)',
        convert: async (input) => numberParser(input, (n) => n / 3.78541),
    },

    // Mass / Weight
    {
        id: 'gram-to-kilogram',
        name: 'Gram to Kilogram',
        description: 'g → kg',
        convert: async (input) => numberParser(input, (n) => n / 1000),
    },
    {
        id: 'kilogram-to-gram',
        name: 'Kilogram to Gram',
        description: 'kg → g',
        convert: async (input) => numberParser(input, (n) => n * 1000),
    },
    {
        id: 'pound-to-kilogram',
        name: 'Pound to Kilogram',
        description: 'lb → kg',
        convert: async (input) => numberParser(input, (n) => n / 2.20462),
    },
    {
        id: 'kilogram-to-pound',
        name: 'Kilogram to Pound',
        description: 'kg → lb',
        convert: async (input) => numberParser(input, (n) => n * 2.20462),
    },
    {
        id: 'ounce-to-gram',
        name: 'Ounce to Gram',
        description: 'oz → g',
        convert: async (input) => numberParser(input, (n) => n * 28.3495),
    },
    {
        id: 'gram-to-ounce',
        name: 'Gram to Ounce',
        description: 'g → oz',
        convert: async (input) => numberParser(input, (n) => n / 28.3495),
    },

    // Temperature
    {
        id: 'celsius-to-fahrenheit',
        name: 'Celsius to Fahrenheit',
        description: '°C → °F',
        convert: async (input) => numberParser(input, (n) => (n * 9/5) + 32),
    },
    {
        id: 'fahrenheit-to-celsius',
        name: 'Fahrenheit to Celsius',
        description: '°F → °C',
        convert: async (input) => numberParser(input, (n) => (n - 32) * 5/9),
    },
    {
        id: 'celsius-to-kelvin',
        name: 'Celsius to Kelvin',
        description: '°C → K',
        convert: async (input) => numberParser(input, (n) => n + 273.15),
    },
    {
        id: 'kelvin-to-celsius',
        name: 'Kelvin to Celsius',
        description: 'K → °C',
        convert: async (input) => numberParser(input, (n) => n - 273.15),
    },
];
