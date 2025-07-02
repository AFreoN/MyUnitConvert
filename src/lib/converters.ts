import type { Converter } from '@/lib/types';

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
];
