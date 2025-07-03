
import type { DataConverter, UnitConverter, AnyConverter } from '@/lib/types';

// --- Data Format Converters ---

export const dataConverters: DataConverter[] = [
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

export const unitConverters: UnitConverter[] = [
    {
        id: 'length',
        name: 'Length',
        description: 'Convert between different units of length.',
        type: 'unit',
        defaultFrom: 'ft',
        defaultTo: 'm',
        units: [
            { id: 'm', name: 'Metre', toBase: v => v, fromBase: v => v },
            { id: 'km', name: 'Kilometre', toBase: v => v * 1000, fromBase: v => v / 1000 },
            { id: 'cm', name: 'Centimetre', toBase: v => v / 100, fromBase: v => v * 100 },
            { id: 'mm', name: 'Millimetre', toBase: v => v / 1000, fromBase: v => v * 1000 },
            { id: 'μm', name: 'Micrometre', toBase: v => v / 1e6, fromBase: v => v * 1e6 },
            { id: 'nm', name: 'Nanometre', toBase: v => v / 1e9, fromBase: v => v * 1e9 },
            { id: 'mi', name: 'Mile', toBase: v => v * 1609.34, fromBase: v => v / 1609.34 },
            { id: 'yd', name: 'Yard', toBase: v => v * 0.9144, fromBase: v => v / 0.9144 },
            { id: 'ft', name: 'Foot', toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
            { id: 'in', name: 'Inch', toBase: v => v * 0.0254, fromBase: v => v / 0.0254 },
            { id: 'ly', name: 'Light Year', toBase: v => v * 9.461e15, fromBase: v => v / 9.461e15 },
        ]
    },
    {
        id: 'temperature',
        name: 'Temperature',
        description: 'Convert between different units of temperature.',
        type: 'unit',
        defaultFrom: 'f',
        defaultTo: 'c',
        units: [
            { id: 'c', name: 'Celsius', toBase: v => v, fromBase: v => v },
            { id: 'f', name: 'Fahrenheit', toBase: v => (v - 32) * 5/9, fromBase: v => (v * 9/5) + 32 },
            { id: 'k', name: 'Kelvin', toBase: v => v - 273.15, fromBase: v => v + 273.15 },
        ]
    },
    {
        id: 'area',
        name: 'Area',
        description: 'Convert between different units of area.',
        type: 'unit',
        defaultFrom: 'sqft',
        defaultTo: 'sqm',
        units: [
            { id: 'sqm', name: 'Square Metre', toBase: v => v, fromBase: v => v },
            { id: 'sqkm', name: 'Square Kilometre', toBase: v => v * 1e6, fromBase: v => v / 1e6 },
            { id: 'sqcm', name: 'Square Centimetre', toBase: v => v * 1e-4, fromBase: v => v / 1e-4 },
            { id: 'sqmm', name: 'Square Millimetre', toBase: v => v * 1e-6, fromBase: v => v / 1e-6 },
            { id: 'sqμm', name: 'Square Micrometre', toBase: v => v * 1e-12, fromBase: v => v / 1e-12 },
            { id: 'ha', name: 'Hectare', toBase: v => v * 10000, fromBase: v => v / 10000 },
            { id: 'sqft', name: 'Square Foot', toBase: v => v * 0.092903, fromBase: v => v / 0.092903 },
            { id: 'sqin', name: 'Square Inch', toBase: v => v * 0.00064516, fromBase: v => v / 0.00064516 },
            { id: 'sqyd', name: 'Square Yard', toBase: v => v * 0.836127, fromBase: v => v / 0.836127 },
            { id: 'acre', name: 'Acre', toBase: v => v * 4046.86, fromBase: v => v / 4046.86 },
        ]
    },
    {
        id: 'volume',
        name: 'Volume',
        description: 'Convert between different units of volume.',
        type: 'unit',
        defaultFrom: 'l',
        defaultTo: 'us-gal',
        units: [
            { id: 'l', name: 'Litre', toBase: v => v, fromBase: v => v },
            { id: 'us-gal', name: 'US Gallon', toBase: v => v * 3.78541, fromBase: v => v / 3.78541 },
            { id: 'us-qt', name: 'US Quart', toBase: v => v * 0.946353, fromBase: v => v / 0.946353 },
            { id: 'us-pt', name: 'US Pint', toBase: v => v * 0.473176, fromBase: v => v / 0.473176 },
            { id: 'us-fl-oz', name: 'US Fluid Ounce', toBase: v => v * 0.0295735, fromBase: v => v / 0.0295735 },
            { id: 'us-tbsp', name: 'US Tablespoon', toBase: v => v * 0.0147868, fromBase: v => v / 0.0147868 },
            { id: 'us-tsp', name: 'US Teaspoon', toBase: v => v * 0.00492892, fromBase: v => v / 0.00492892 },
            { id: 'imp-gal', name: 'Imperial Gallon', toBase: v => v * 4.54609, fromBase: v => v / 4.54609 },
            { id: 'imp-qt', name: 'Imperial Quart', toBase: v => v * 1.13652, fromBase: v => v / 1.13652 },
            { id: 'imp-pt', name: 'Imperial Pint', toBase: v => v * 0.568261, fromBase: v => v / 0.568261 },
            { id: 'imp-fl-oz', name: 'Imperial Fluid Ounce', toBase: v => v * 0.0284131, fromBase: v => v / 0.0284131 },
            { id: 'imp-tbsp', name: 'Imperial Tablespoon', toBase: v => v * 0.0177582, fromBase: v => v / 0.0177582 },
            { id: 'imp-tsp', name: 'Imperial Teaspoon', toBase: v => v * 0.00591939, fromBase: v => v / 0.00591939 },
            { id: 'm3', name: 'Cubic Metre', toBase: v => v * 1000, fromBase: v => v / 1000 },
            { id: 'km3', name: 'Cubic Kilometre', toBase: v => v * 1e12, fromBase: v => v / 1e12 },
            { id: 'cm3', name: 'Cubic Centimetre', toBase: v => v / 1000, fromBase: v => v * 1000 },
            { id: 'mm3', name: 'Cubic Millimetre', toBase: v => v / 1e6, fromBase: v => v * 1e6 },
            { id: 'mi3', name: 'Cubic Mile', toBase: v => v * 4.168e9, fromBase: v => v / 4.168e9 },
            { id: 'yd3', name: 'Cubic Yard', toBase: v => v * 764.555, fromBase: v => v / 764.555 },
            { id: 'ft3', name: 'Cubic Foot', toBase: v => v * 28.3168, fromBase: v => v / 28.3168 },
            { id: 'in3', name: 'Cubic Inch', toBase: v => v * 0.0163871, fromBase: v => v / 0.0163871 },
        ]
    },
    {
        id: 'mass',
        name: 'Mass',
        description: 'Convert between different units of mass.',
        type: 'unit',
        defaultFrom: 'kg',
        defaultTo: 'lb',
        units: [
            { id: 'kg', name: 'Kilogram', toBase: v => v, fromBase: v => v },
            { id: 'g', name: 'Gram', toBase: v => v / 1000, fromBase: v => v * 1000 },
            { id: 'mg', name: 'Milligram', toBase: v => v / 1e6, fromBase: v => v * 1e6 },
            { id: 't', name: 'Metric Ton', toBase: v => v * 1000, fromBase: v => v / 1000 },
            { id: 'lb', name: 'Pound', toBase: v => v * 0.45359237, fromBase: v => v / 0.45359237 },
            { id: 'oz', name: 'Ounce', toBase: v => v * 0.0283495, fromBase: v => v / 0.0283495 },
            { id: 'long-ton', name: 'Long Ton', toBase: v => v * 1016.05, fromBase: v => v / 1016.05 },
            { id: 'short-ton', name: 'Short Ton', toBase: v => v * 907.185, fromBase: v => v / 907.185 },
            { id: 'ct', name: 'Carat', toBase: v => v * 0.0002, fromBase: v => v * 5000 },
            { id: 'amu', name: 'Atomic Mass Unit', toBase: v => v * 1.66054e-27, fromBase: v => v / 1.66054e-27 },
        ]
    },
    {
        id: 'time',
        name: 'Time',
        description: 'Convert between different units of time.',
        type: 'unit',
        defaultFrom: 'min',
        defaultTo: 'h',
        units: [
            { id: 's', name: 'Second', toBase: v => v, fromBase: v => v },
            { id: 'ms', name: 'Millisecond', toBase: v => v / 1000, fromBase: v => v * 1000 },
            { id: 'μs', name: 'Microsecond', toBase: v => v / 1e6, fromBase: v => v * 1e6 },
            { id: 'ns', name: 'Nanosecond', toBase: v => v / 1e9, fromBase: v => v * 1e9 },
            { id: 'ps', name: 'Picosecond', toBase: v => v / 1e12, fromBase: v => v * 1e12 },
            { id: 'min', name: 'Minute', toBase: v => v * 60, fromBase: v => v / 60 },
            { id: 'h', name: 'Hour', toBase: v => v * 3600, fromBase: v => v / 3600 },
            { id: 'd', name: 'Day', toBase: v => v * 86400, fromBase: v => v / 86400 },
            { id: 'wk', name: 'Week', toBase: v => v * 604800, fromBase: v => v / 604800 },
            { id: 'mo', name: 'Month', toBase: v => v * 2629800, fromBase: v => v / 2629800 }, // Average
            { id: 'yr', name: 'Year', toBase: v => v * 31557600, fromBase: v => v / 31557600 }, // Average
        ]
    }
];

export const allConverters: AnyConverter[] = [...unitConverters, ...dataConverters];
