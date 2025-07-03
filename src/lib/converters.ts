
import { parse, stringify } from 'yaml';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';
import Papa from 'papaparse';
import type { DataConverter, UnitConverter, AnyConverter } from '@/lib/types';

// --- XML and CSV parsers ---
const xmlParser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
});
const xmlBuilder = new XMLBuilder({
    format: true,
    indentBy: '  ',
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
});


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
                return stringify(obj);
            } catch (e) {
                if (e instanceof Error) return `# Invalid JSON: ${e.message}`;
                return '# Invalid JSON input';
            }
        },
    },
    {
        id: 'yaml-to-json',
        name: 'YAML to JSON',
        description: 'Convert YAML data to JSON format.',
        type: 'data',
        convert: async (input) => {
            try {
                if (!input.trim()) return '';
                const obj = parse(input);
                return JSON.stringify(obj, null, 2);
            } catch (e) {
                 if (e instanceof Error) return `{\n  "error": "Could not parse YAML: ${e.message}"\n}`;
                 return `{\n  "error": "Could not parse YAML"\n}`;
            }
        },
    },
    {
        id: 'json-to-xml',
        name: 'JSON to XML',
        description: 'Convert JSON data to XML format.',
        type: 'data',
        convert: async (input) => {
            try {
                if (!input.trim()) return '';
                const obj = JSON.parse(input);
                const rootKey = Object.keys(obj).length === 1 ? Object.keys(obj)[0] : 'root';
                const wrappedObj = rootKey === 'root' ? { root: obj } : obj;
                return xmlBuilder.build(wrappedObj);
            } catch (e) {
                if (e instanceof Error) return `<error>Invalid JSON: ${e.message}</error>`;
                return '<error>Invalid JSON input</error>';
            }
        },
    },
    {
        id: 'xml-to-json',
        name: 'XML to JSON',
        description: 'Convert XML data to JSON format.',
        type: 'data',
        convert: async (input) => {
            try {
                if (!input.trim()) return '';
                const obj = xmlParser.parse(input);
                return JSON.stringify(obj, null, 2);
            } catch (e) {
                if (e instanceof Error) return `{\n  "error": "Could not parse XML: ${e.message}"\n}`;
                return `{\n  "error": "Could not parse XML"\n}`;
            }
        },
    },
     {
        id: 'yaml-to-xml',
        name: 'YAML to XML',
        description: 'Convert YAML data to XML format.',
        type: 'data',
        convert: async (input) => {
            try {
                if (!input.trim()) return '';
                const obj = parse(input);
                const rootKey = Object.keys(obj).length === 1 ? Object.keys(obj)[0] : 'root';
                const wrappedObj = rootKey === 'root' ? { root: obj } : obj;
                return xmlBuilder.build(wrappedObj);
            } catch (e) {
                if (e instanceof Error) return `<error>Could not parse YAML: ${e.message}</error>`;
                return '<error>Could not parse YAML</error>';
            }
        },
    },
    {
        id: 'xml-to-yaml',
        name: 'XML to YAML',
        description: 'Convert XML data to YAML format.',
        type: 'data',
        convert: async (input) => {
            try {
                if (!input.trim()) return '';
                const obj = xmlParser.parse(input);
                return stringify(obj);
            } catch (e) {
                if (e instanceof Error) return `# Could not parse XML: ${e.message}`;
                return '# Could not parse XML';
            }
        },
    },
    {
        id: 'json-to-csv',
        name: 'JSON to CSV',
        description: 'Convert an array of JSON objects to CSV.',
        type: 'data',
        convert: async (input) => {
            try {
                if (!input.trim()) return '';
                const obj = JSON.parse(input);
                if (!Array.isArray(obj)) {
                    throw new Error("Input must be a JSON array of objects.");
                }
                return Papa.unparse(obj);
            } catch (e) {
                if (e instanceof Error) return `Error: ${e.message}`;
                return 'Error converting JSON to CSV.';
            }
        },
    },
    {
        id: 'csv-to-json',
        name: 'CSV to JSON',
        description: 'Convert CSV data to an array of JSON objects.',
        type: 'data',
        convert: async (input) => {
            return new Promise((resolve) => {
                if (!input.trim()) {
                    resolve('');
                    return;
                }
                Papa.parse(input, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (results) => {
                        if(results.errors.length) {
                            const errorMsg = results.errors.map(e => e.message).join(', ');
                            resolve(`{\n  "error": "Could not parse CSV: ${errorMsg}"\n}`);
                        } else {
                            resolve(JSON.stringify(results.data, null, 2));
                        }
                    },
                    error: (error) => {
                        resolve(`{\n  "error": "Could not parse CSV: ${error.message}"\n}`);
                    }
                });
            });
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
            { id: 'sqmi', name: 'Square Mile', toBase: v => v * 2.59e+6, fromBase: v => v / 2.59e+6 },
            { id: 'sqyd', name: 'Square Yard', toBase: v => v * 0.836127, fromBase: v => v / 0.836127 },
            { id: 'sqft', name: 'Square Foot', toBase: v => v * 0.092903, fromBase: v => v / 0.092903 },
            { id: 'sqin', name: 'Square Inch', toBase: v => v * 0.00064516, fromBase: v => v / 0.00064516 },
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
            { id: 'ml', name: 'Millilitre', toBase: v => v / 1000, fromBase: v => v * 1000 },
            { id: 'm3', name: 'Cubic Metre', toBase: v => v * 1000, fromBase: v => v / 1000 },
            { id: 'us-gal', name: 'US Gallon', toBase: v => v * 3.78541, fromBase: v => v / 3.78541 },
            { id: 'us-qt', name: 'US Quart', toBase: v => v * 0.946353, fromBase: v => v / 0.946353 },
            { id: 'us-pt', name: 'US Pint', toBase: v => v * 0.473176, fromBase: v => v / 0.473176 },
            { id: 'us-cup', name: 'US Cup', toBase: v => v * 0.24, fromBase: v => v / 0.24 },
            { id: 'us-fl-oz', name: 'US Fluid Ounce', toBase: v => v * 0.0295735, fromBase: v => v / 0.0295735 },
            { id: 'us-tbsp', name: 'US Tablespoon', toBase: v => v * 0.0147868, fromBase: v => v / 0.0147868 },
            { id: 'us-tsp', name: 'US Teaspoon', toBase: v => v * 0.00492892, fromBase: v => v / 0.00492892 },
            { id: 'imp-gal', name: 'Imperial Gallon', toBase: v => v * 4.54609, fromBase: v => v / 4.54609 },
            { id: 'imp-qt', name: 'Imperial Quart', toBase: v => v * 1.13652, fromBase: v => v / 1.13652 },
            { id: 'imp-pt', name: 'Imperial Pint', toBase: v => v * 0.568261, fromBase: v => v / 0.568261 },
            { id: 'imp-fl-oz', name: 'Imperial Fluid Ounce', toBase: v => v * 0.0284131, fromBase: v => v / 0.0284131 },
            { id: 'imp-tbsp', name: 'Imperial Tablespoon', toBase: v => v * 0.0177582, fromBase: v => v / 0.0177582 },
            { id: 'imp-tsp', name: 'Imperial Teaspoon', toBase: v => v * 0.00591939, fromBase: v => v / 0.00591939 },
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
            { id: 'ct', name: 'Carat', toBase: v => v * 0.0002, fromBase: v => v * 5000 },
            { id: 'long-ton', name: 'Long Ton', toBase: v => v * 1016.05, fromBase: v => v / 1016.05 },
            { id: 'short-ton', name: 'Short Ton', toBase: v => v * 907.185, fromBase: v => v / 907.185 },
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
    },
    {
        id: 'acceleration',
        name: 'Acceleration',
        description: 'Convert units of acceleration.',
        type: 'unit',
        defaultFrom: 'mps2',
        defaultTo: 'g',
        units: [
            { id: 'mps2', name: 'Metre/second²', toBase: v => v, fromBase: v => v },
            { id: 'g', name: 'Gravity (g)', toBase: v => v * 9.80665, fromBase: v => v / 9.80665 },
            { id: 'gal', name: 'Gal (cm/s²)', toBase: v => v / 100, fromBase: v => v * 100 },
            { id: 'mi-ps2', name: 'Mile/second²', toBase: v => v * 1609.34, fromBase: v => v / 1609.34 },
            { id: 'yd-ps2', name: 'Yard/second²', toBase: v => v * 0.9144, fromBase: v => v / 0.9144 },
            { id: 'ft-ps2', name: 'Foot/second²', toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
            { id: 'in-ps2', name: 'Inch/second²', toBase: v => v * 0.0254, fromBase: v => v / 0.0254 },
        ],
    },
    {
        id: 'angle',
        name: 'Angle',
        description: 'Convert units of angle.',
        type: 'unit',
        defaultFrom: 'deg',
        defaultTo: 'rad',
        units: [
            { id: 'rad', name: 'Radian', toBase: v => v, fromBase: v => v },
            { id: 'deg', name: 'Degree', toBase: v => v * (Math.PI / 180), fromBase: v => v * (180 / Math.PI) },
            { id: 'grad', name: 'Gradian', toBase: v => v * (Math.PI / 200), fromBase: v => v * (200 / Math.PI) },
            { id: 'arcmin', name: 'Arcminute', toBase: v => v * (Math.PI / 10800), fromBase: v => v * (10800 / Math.PI) },
            { id: 'arcsec', name: 'Arcsecond', toBase: v => v * (Math.PI / 648000), fromBase: v => v * (648000 / Math.PI) },
            { id: 'rev', name: 'Revolution', toBase: v => v * 2 * Math.PI, fromBase: v => v / (2 * Math.PI) },
        ],
    },
    {
        id: 'charge',
        name: 'Charge',
        description: 'Convert units of electric charge.',
        type: 'unit',
        defaultFrom: 'c',
        defaultTo: 'e',
        units: [
            { id: 'c', name: 'Coulomb', toBase: v => v, fromBase: v => v },
            { id: 'mc', name: 'Megacoulomb', toBase: v => v * 1e6, fromBase: v => v / 1e6 },
            { id: 'kc', name: 'Kilocoulomb', toBase: v => v * 1000, fromBase: v => v / 1000 },
            { id: 'mC', name: 'Millicoulomb', toBase: v => v / 1000, fromBase: v => v * 1000 },
            { id: 'μC', name: 'Microcoulomb', toBase: v => v / 1e6, fromBase: v => v * 1e6 },
            { id: 'nC', name: 'Nanocoulomb', toBase: v => v / 1e9, fromBase: v => v * 1e9 },
            { id: 'e', name: 'Elementary Charge', toBase: v => v * 1.602176634e-19, fromBase: v => v / 1.602176634e-19 },
            { id: 'a-s', name: 'Ampere-second', toBase: v => v, fromBase: v => v },
        ],
    },
    {
        id: 'data-storage',
        name: 'Data Storage',
        description: 'Convert units of digital information.',
        type: 'unit',
        defaultFrom: 'mib',
        defaultTo: 'mb',
        units: [
            { id: 'b', name: 'Byte', toBase: v => v, fromBase: v => v },
            { id: 'bit', name: 'Bit', toBase: v => v / 8, fromBase: v => v * 8 },
            { id: 'kb', name: 'Kilobyte (10³ B)', toBase: v => v * 1e3, fromBase: v => v / 1e3 },
            { id: 'kib', name: 'Kibibyte (2¹⁰ B)', toBase: v => v * 1024, fromBase: v => v / 1024 },
            { id: 'mb', name: 'Megabyte (10⁶ B)', toBase: v => v * 1e6, fromBase: v => v / 1e6 },
            { id: 'mib', name: 'Mebibyte (2²⁰ B)', toBase: v => v * Math.pow(1024, 2), fromBase: v => v / Math.pow(1024, 2) },
            { id: 'gb', name: 'Gigabyte (10⁹ B)', toBase: v => v * 1e9, fromBase: v => v / 1e9 },
            { id: 'gib', name: 'Gibibyte (2³⁰ B)', toBase: v => v * Math.pow(1024, 3), fromBase: v => v / Math.pow(1024, 3) },
            { id: 'tb', name: 'Terabyte (10¹² B)', toBase: v => v * 1e12, fromBase: v => v / 1e12 },
            { id: 'tib', name: 'Tebibyte (2⁴⁰ B)', toBase: v => v * Math.pow(1024, 4), fromBase: v => v / Math.pow(1024, 4) },
        ],
    },
    {
        id: 'density',
        name: 'Density',
        description: 'Convert units of mass density.',
        type: 'unit',
        defaultFrom: 'kg-pm3',
        defaultTo: 'lb-pft3',
        units: [
            { id: 'kg-pm3', name: 'Kilogram/metre³', toBase: v => v, fromBase: v => v },
            { id: 'g-pcm3', name: 'Gram/centimetre³', toBase: v => v * 1000, fromBase: v => v / 1000 },
            { id: 'lb-pft3', name: 'Pound/foot³', toBase: v => v * 16.0185, fromBase: v => v / 16.0185 },
            { id: 'oz-pin3', name: 'Ounce/inch³', toBase: v => v * 1729.99, fromBase: v => v / 1729.99 },
        ],
    },
    {
        id: 'energy',
        name: 'Energy',
        description: 'Convert units of energy, work, and heat.',
        type: 'unit',
        defaultFrom: 'kwh',
        defaultTo: 'btu',
        units: [
            { id: 'j', name: 'Joule', toBase: v => v, fromBase: v => v },
            { id: 'kj', name: 'Kilojoule', toBase: v => v * 1000, fromBase: v => v / 1000 },
            { id: 'cal', name: 'Calorie (thermo)', toBase: v => v * 4.184, fromBase: v => v / 4.184 },
            { id: 'kcal', name: 'Kilocalorie (Cal)', toBase: v => v * 4184, fromBase: v => v / 4184 },
            { id: 'wh', name: 'Watt-hour', toBase: v => v * 3600, fromBase: v => v / 3600 },
            { id: 'kwh', name: 'Kilowatt-hour', toBase: v => v * 3.6e6, fromBase: v => v / 3.6e6 },
            { id: 'ev', name: 'Electron-volt', toBase: v => v * 1.60218e-19, fromBase: v => v / 1.60218e-19 },
            { id: 'btu', name: 'BTU (IT)', toBase: v => v * 1055.06, fromBase: v => v / 1055.06 },
            { id: 'ft-lb', name: 'Foot-pound', toBase: v => v * 1.35582, fromBase: v => v / 1.35582 },
        ],
    },
    {
        id: 'flow-volume',
        name: 'Volume Flow Rate',
        description: 'Convert units of volume flow rate.',
        type: 'unit',
        defaultFrom: 'lpm',
        defaultTo: 'gpm-us',
        units: [
            { id: 'm3ps', name: 'Metre³/second', toBase: v => v, fromBase: v => v },
            { id: 'lps', name: 'Litre/second', toBase: v => v / 1000, fromBase: v => v * 1000 },
            { id: 'lpm', name: 'Litre/minute', toBase: v => v / 60000, fromBase: v => v * 60000 },
            { id: 'm3ph', name: 'Metre³/hour', toBase: v => v / 3600, fromBase: v => v * 3600 },
            { id: 'gpm-us', name: 'Gallon (US)/minute', toBase: v => v * 6.309e-5, fromBase: v => v / 6.309e-5 },
            { id: 'gpm-uk', name: 'Gallon (UK)/minute', toBase: v => v * 7.57682e-5, fromBase: v => v / 7.57682e-5 },
            { id: 'ft3ps', name: 'Foot³/second', toBase: v => v * 0.0283168, fromBase: v => v / 0.0283168 },
        ],
    },
    {
        id: 'force',
        name: 'Force',
        description: 'Convert units of force.',
        type: 'unit',
        defaultFrom: 'n',
        defaultTo: 'lbf',
        units: [
            { id: 'n', name: 'Newton', toBase: v => v, fromBase: v => v },
            { id: 'kn', name: 'Kilonewton', toBase: v => v * 1000, fromBase: v => v / 1000 },
            { id: 'gf', name: 'Gram-force', toBase: v => v * 0.00980665, fromBase: v => v / 0.00980665 },
            { id: 'kgf', name: 'Kilogram-force', toBase: v => v * 9.80665, fromBase: v => v / 9.80665 },
            { id: 'lbf', name: 'Pound-force', toBase: v => v * 4.44822, fromBase: v => v / 4.44822 },
            { id: 'pdl', name: 'Poundal', toBase: v => v * 0.138255, fromBase: v => v / 0.138255 },
        ],
    },
    {
        id: 'frequency',
        name: 'Frequency',
        description: 'Convert units of frequency.',
        type: 'unit',
        defaultFrom: 'mhz',
        defaultTo: 'ghz',
        units: [
            { id: 'hz', name: 'Hertz', toBase: v => v, fromBase: v => v },
            { id: 'khz', name: 'Kilohertz', toBase: v => v * 1e3, fromBase: v => v / 1e3 },
            { id: 'mhz', name: 'Megahertz', toBase: v => v * 1e6, fromBase: v => v / 1e6 },
            { id: 'ghz', name: 'Gigahertz', toBase: v => v * 1e9, fromBase: v => v / 1e9 },
            { id: 'thz', name: 'Terahertz', toBase: v => v * 1e12, fromBase: v => v / 1e12 },
            { id: 'rpm', name: 'Revolutions/minute', toBase: v => v / 60, fromBase: v => v * 60 },
        ],
    },
    {
        id: 'fuel-consumption',
        name: 'Fuel Consumption',
        description: 'Convert units of fuel consumption.',
        type: 'unit',
        defaultFrom: 'l-p100km',
        defaultTo: 'mpg-us',
        units: [
            { id: 'kml', name: 'Kilometre/Litre', toBase: v => v, fromBase: v => v },
            { id: 'l-p100km', name: 'Litre/100km', toBase: v => 100 / v, fromBase: v => 100 / v },
            { id: 'mpg-us', name: 'Mile/Gallon (US)', toBase: v => v * 0.425144, fromBase: v => v / 0.425144 },
            { id: 'mpg-uk', name: 'Mile/Gallon (UK)', toBase: v => v * 0.354006, fromBase: v => v / 0.354006 },
        ],
    },
    {
        id: 'power',
        name: 'Power',
        description: 'Convert units of power.',
        type: 'unit',
        defaultFrom: 'kw',
        defaultTo: 'hp',
        units: [
            { id: 'w', name: 'Watt', toBase: v => v, fromBase: v => v },
            { id: 'kw', name: 'Kilowatt', toBase: v => v * 1000, fromBase: v => v / 1000 },
            { id: 'mw', name: 'Megawatt', toBase: v => v * 1e6, fromBase: v => v / 1e6 },
            { id: 'hp', name: 'Horsepower (mech)', toBase: v => v * 745.7, fromBase: v => v / 745.7 },
            { id: 'hp-metric', name: 'Horsepower (metric)', toBase: v => v * 735.499, fromBase: v => v / 735.499 },
            { id: 'btu-ph', name: 'BTU/hour', toBase: v => v * 0.293071, fromBase: v => v / 0.293071 },
        ],
    },
    {
        id: 'pressure',
        name: 'Pressure',
        description: 'Convert units of pressure.',
        type: 'unit',
        defaultFrom: 'psi',
        defaultTo: 'bar',
        units: [
            { id: 'pa', name: 'Pascal', toBase: v => v, fromBase: v => v },
            { id: 'kpa', name: 'Kilopascal', toBase: v => v * 1000, fromBase: v => v / 1000 },
            { id: 'bar', name: 'Bar', toBase: v => v * 100000, fromBase: v => v / 100000 },
            { id: 'mbar', name: 'Millibar', toBase: v => v * 100, fromBase: v => v * 100 },
            { id: 'psi', name: 'PSI', toBase: v => v * 6894.76, fromBase: v => v / 6894.76 },
            { id: 'atm', name: 'Atmosphere (std)', toBase: v => v * 101325, fromBase: v => v / 101325 },
            { id: 'torr', name: 'Torr (mmHg)', toBase: v => v * 133.322, fromBase: v => v / 133.322 },
        ],
    },
    {
        id: 'speed',
        name: 'Speed',
        description: 'Convert units of speed.',
        type: 'unit',
        defaultFrom: 'kph',
        defaultTo: 'mph',
        units: [
            { id: 'mps', name: 'Metre/second', toBase: v => v, fromBase: v => v },
            { id: 'kph', name: 'Kilometre/hour', toBase: v => v / 3.6, fromBase: v => v * 3.6 },
            { id: 'mph', name: 'Mile/hour', toBase: v => v * 0.44704, fromBase: v => v / 0.44704 },
            { id: 'knot', name: 'Knot', toBase: v => v * 0.514444, fromBase: v => v / 0.514444 },
            { id: 'fps', name: 'Foot/second', toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
        ],
    },
    {
        id: 'torque',
        name: 'Torque',
        description: 'Convert units of torque.',
        type: 'unit',
        defaultFrom: 'nm',
        defaultTo: 'lb-ft',
        units: [
            { id: 'nm', name: 'Newton-metre', toBase: v => v, fromBase: v => v },
            { id: 'lb-ft', name: 'Pound-foot', toBase: v => v * 1.35582, fromBase: v => v / 1.35582 },
            { id: 'kg-m', name: 'Kilogram-metre', toBase: v => v * 9.80665, fromBase: v => v / 9.80665 },
            { id: 'n-cm', name: 'Newton-centimetre', toBase: v => v / 100, fromBase: v => v * 100 },
        ],
    },
    {
        id: 'current',
        name: 'Current',
        description: 'Convert units of electrical current.',
        type: 'unit',
        defaultFrom: 'a',
        defaultTo: 'ma',
        units: [
            { id: 'a', name: 'Ampere', toBase: v => v, fromBase: v => v },
            { id: 'ma', name: 'Milliampere', toBase: v => v / 1000, fromBase: v => v * 1000 },
            { id: 'ka', name: 'Kiloampere', toBase: v => v * 1000, fromBase: v => v / 1000 },
            { id: 'bi', name: 'Biot (abampere)', toBase: v => v * 10, fromBase: v => v / 10 },
        ]
    },
    {
        id: 'data-transfer',
        name: 'Data Transfer Rate',
        description: 'Convert units of data transfer speed.',
        type: 'unit',
        defaultFrom: 'mbps',
        defaultTo: 'kbps',
        units: [
            { id: 'bps', name: 'Bits per second', toBase: v => v, fromBase: v => v },
            { id: 'Bps', name: 'Bytes per second', toBase: v => v * 8, fromBase: v => v / 8 },
            { id: 'kbps', name: 'Kilobits per second', toBase: v => v * 1e3, fromBase: v => v / 1e3 },
            { id: 'kBps', name: 'Kilobytes per second', toBase: v => v * 8 * 1e3, fromBase: v => v / (8 * 1e3) },
            { id: 'mbps', name: 'Megabits per second', toBase: v => v * 1e6, fromBase: v => v / 1e6 },
            { id: 'mBps', name: 'Megabytes per second', toBase: v => v * 8 * 1e6, fromBase: v => v / (8 * 1e6) },
            { id: 'gbps', name: 'Gigabits per second', toBase: v => v * 1e9, fromBase: v => v / 1e9 },
            { id: 'gBps', name: 'Gigabytes per second', toBase: v => v * 8 * 1e9, fromBase: v => v / (8 * 1e9) },
            { id: 'tbps', name: 'Terabits per second', toBase: v => v * 1e12, fromBase: v => v / 1e12 },
            { id: 'tBps', name: 'Terabytes per second', toBase: v => v * 8 * 1e12, fromBase: v => v / (8 * 1e12) },
        ]
    },
    {
        id: 'digital-image-resolution',
        name: 'Digital Image Resolution',
        description: 'Convert units of image resolution.',
        type: 'unit',
        defaultFrom: 'dpi',
        defaultTo: 'dpcm',
        units: [
            { id: 'dpi', name: 'Dots per inch', toBase: v => v, fromBase: v => v },
            { id: 'dpcm', name: 'Dots per centimeter', toBase: v => v * 2.54, fromBase: v => v / 2.54 },
            { id: 'dpm', name: 'Dots per meter', toBase: v => v * 0.0254, fromBase: v => v / 0.0254 },
        ]
    },
    {
        id: 'luminance',
        name: 'Luminance',
        description: 'Convert units of luminance.',
        type: 'unit',
        defaultFrom: 'cd-pm2',
        defaultTo: 'ft-L',
        units: [
            { id: 'cd-pm2', name: 'Candela/square meter (Nit)', toBase: v => v, fromBase: v => v },
            { id: 'cd-pcm2', name: 'Candela/square centimeter (Stilb)', toBase: v => v * 10000, fromBase: v => v / 10000 },
            { id: 'cd-pft2', name: 'Candela/square foot', toBase: v => v * 10.7639, fromBase: v => v / 10.7639 },
            { id: 'ft-L', name: 'Foot-lambert', toBase: v => v * 3.42626, fromBase: v => v / 3.42626 },
            { id: 'L', name: 'Lambert', toBase: v => v * 3183.1, fromBase: v => v / 3183.1 },
        ]
    },
    {
        id: 'permeability',
        name: 'Permeability',
        description: 'Convert units of magnetic permeability.',
        type: 'unit',
        defaultFrom: 'h-pm',
        defaultTo: 'mu0',
        units: [
            { id: 'h-pm', name: 'Henry/meter', toBase: v => v, fromBase: v => v },
            { id: 'mu0', name: 'Vacuum Permeability (μ₀)', toBase: v => v * 4 * Math.PI * 1e-7, fromBase: v => v / (4 * Math.PI * 1e-7) },
            { id: 'N-pA2', name: 'Newton/square ampere', toBase: v => v, fromBase: v => v },
        ]
    },
    {
        id: 'radiation',
        name: 'Radiation Dose',
        description: 'Convert units of radiation dose. Assumes a quality factor of 1.',
        type: 'unit',
        defaultFrom: 'gy',
        defaultTo: 'sv',
        units: [
            { id: 'gy', name: 'Gray (Gy)', toBase: v => v, fromBase: v => v },
            { id: 'sv', name: 'Sievert (Sv)', toBase: v => v, fromBase: v => v },
            { id: 'rad', name: 'Rad', toBase: v => v / 100, fromBase: v => v * 100 },
            { id: 'rem', name: 'Rem', toBase: v => v / 100, fromBase: v => v * 100 },
        ]
    },
    {
        id: 'sound',
        name: 'Sound Level',
        description: 'Convert between sound pressure level units.',
        type: 'unit',
        defaultFrom: 'db-spl',
        defaultTo: 'pa',
        units: [
            { id: 'db-spl', name: 'Decibel (SPL)', toBase: v => 20e-6 * Math.pow(10, v / 20), fromBase: v => 20 * Math.log10(v / 20e-6) },
            { id: 'pa', name: 'Pascal (Pa)', toBase: v => v, fromBase: v => v },
        ]
    },
    {
        id: 'typography',
        name: 'Typography',
        description: 'Convert between typography units.',
        type: 'unit',
        defaultFrom: 'px',
        defaultTo: 'pt',
        units: [
            { id: 'pt', name: 'Point', toBase: v => v, fromBase: v => v },
            { id: 'px', name: 'Pixel', toBase: v => v * (72 / 96), fromBase: v => v * (96 / 72) },
            { id: 'in', name: 'Inch', toBase: v => v * 72, fromBase: v => v / 72 },
            { id: 'cm', name: 'Centimeter', toBase: v => v * (72 / 2.54), fromBase: v => v * (2.54 / 72) },
            { id: 'pc', name: 'Pica', toBase: v => v * 12, fromBase: v => v / 12 },
            { id: 'twip', name: 'Twip', toBase: v => v / 20, fromBase: v => v * 20 },
        ]
    },
    {
        id: 'inductance',
        name: 'Inductance',
        description: 'Convert units of electrical inductance.',
        type: 'unit',
        defaultFrom: 'h',
        defaultTo: 'mh',
        units: [
            { id: 'h', name: 'Henry', toBase: v => v, fromBase: v => v },
            { id: 'mh', name: 'Millihenry', toBase: v => v / 1e3, fromBase: v => v * 1e3 },
            { id: 'uh', name: 'Microhenry', toBase: v => v / 1e6, fromBase: v => v * 1e6 },
            { id: 'nh', name: 'Nanohenry', toBase: v => v / 1e9, fromBase: v => v * 1e9 },
        ]
    },
    {
        id: 'electric-conductance',
        name: 'Electric Conductance',
        description: 'Convert units of electrical conductance.',
        type: 'unit',
        defaultFrom: 's',
        defaultTo: 'ms',
        units: [
            { id: 's', name: 'Siemens', toBase: v => v, fromBase: v => v },
            { id: 'ms', name: 'Millisiemens', toBase: v => v / 1e3, fromBase: v => v * 1e3 },
            { id: 'us', name: 'Microsiemens', toBase: v => v / 1e6, fromBase: v => v * 1e6 },
            { id: 'mho', name: 'Mho', toBase: v => v, fromBase: v => v },
        ]
    },
];

export const allConverters: AnyConverter[] = [...unitConverters, ...dataConverters];
