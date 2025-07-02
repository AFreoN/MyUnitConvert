
import type { DataConverter, UnitConverter, AnyConverter } from '@/lib/types';

// --- Data Format Converters ---

const dataConverters: DataConverter[] = [
    {
        id: 'json-to-yaml',
        name: 'JSON to YAML',
        description: 'Convert JSON data to YAML format.',
        type: 'data',
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
        type: 'data',
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
        type: 'data',
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
        type: 'data',
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
        type: 'data',
        convert: async (input) => encodeURIComponent(input),
    },
    {
        id: 'url-decode',
        name: 'URL Decode',
        description: 'Decode URL-encoded text.',
        type: 'data',
        convert: async (input) => {
            try {
                return decodeURIComponent(input);
            } catch (e) {
                return 'Invalid URL-encoded string.'
            }
        },
    },
];

// --- Unit Converters ---

const unitConverters: UnitConverter[] = [
    {
        id: 'length',
        name: 'Length',
        description: 'Convert between different units of length.',
        type: 'unit',
        units: [
            { id: 'm', name: 'Metre', toBase: v => v, fromBase: v => v },
            { id: 'km', name: 'Kilometre', toBase: v => v * 1000, fromBase: v => v / 1000 },
            { id: 'mi', name: 'Mile', toBase: v => v * 1609.34, fromBase: v => v / 1609.34 },
            { id: 'in', name: 'Inch', toBase: v => v * 0.0254, fromBase: v => v / 0.0254 },
            { id: 'ft', name: 'Foot', toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
        ]
    },
    {
        id: 'mass',
        name: 'Mass',
        description: 'Convert between different units of mass.',
        type: 'unit',
        units: [
            { id: 'kg', name: 'Kilogram', toBase: v => v, fromBase: v => v },
            { id: 'g', name: 'Gram', toBase: v => v / 1000, fromBase: v => v * 1000 },
            { id: 't', name: 'Tonne', toBase: v => v * 1000, fromBase: v => v / 1000 },
            { id: 'lb', name: 'Pound', toBase: v => v * 0.453592, fromBase: v => v / 0.453592 },
            { id: 'oz', name: 'Ounce', toBase: v => v * 0.0283495, fromBase: v => v / 0.0283495 },
        ]
    },
    {
        id: 'area',
        name: 'Area',
        description: 'Convert between different units of area.',
        type: 'unit',
        units: [
            { id: 'sqm', name: 'Square Metre', toBase: v => v, fromBase: v => v },
            { id: 'sqft', name: 'Square Foot', toBase: v => v * 0.092903, fromBase: v => v / 0.092903 },
            { id: 'acre', name: 'Acre', toBase: v => v * 4046.86, fromBase: v => v / 4046.86 },
            { id: 'ha', name: 'Hectare', toBase: v => v * 10000, fromBase: v => v / 10000 },
        ]
    },
    {
        id: 'volume',
        name: 'Volume',
        description: 'Convert between different units of volume.',
        type: 'unit',
        units: [
            { id: 'l', name: 'Litre', toBase: v => v, fromBase: v => v },
            { id: 'ml', name: 'Millilitre', toBase: v => v / 1000, fromBase: v => v * 1000 },
            { id: 'us-gal', name: 'US Gallon', toBase: v => v * 3.78541, fromBase: v => v / 3.78541 },
            { id: 'uk-gal', name: 'UK Gallon', toBase: v => v * 4.54609, fromBase: v => v / 4.54609 },
            { id: 'm3', name: 'Cubic Metre', toBase: v => v * 1000, fromBase: v => v / 1000 },
        ]
    },
    {
        id: 'temperature',
        name: 'Temperature',
        description: 'Convert between different units of temperature.',
        type: 'unit',
        units: [
            { id: 'c', name: 'Celsius', toBase: v => v, fromBase: v => v },
            { id: 'f', name: 'Fahrenheit', toBase: v => (v - 32) * 5/9, fromBase: v => (v * 9/5) + 32 },
            { id: 'k', name: 'Kelvin', toBase: v => v - 273.15, fromBase: v => v + 273.15 },
        ]
    }
];

export const allConverters: AnyConverter[] = [...dataConverters, ...unitConverters];
