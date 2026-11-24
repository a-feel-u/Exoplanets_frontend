import { readFile, writeFile, mkdir } from 'node:fs/promises';

const source = process.argv[2] ?? new URL('./exoplanets-swagger.json', import.meta.url);
const swagger = /^https?:\/\//.test(String(source))
  ? await fetch(source).then((response) => {
      if (!response.ok) throw new Error(`Swagger HTTP ${response.status}`);
      return response.json();
    })
  : JSON.parse(await readFile(source, 'utf8'));

function definitionName(name) {
  return name.split('.').at(-1);
}

function typeOf(schema) {
  if (!schema) return 'unknown';
  const type = schemaType(schema);
  return schema['x-nullable'] ? `${type} | null` : type;
}

function schemaType(schema) {
  if (schema.$ref) return definitionName(schema.$ref.split('/').at(-1));
  if (schema.allOf) return schema.allOf.map(typeOf).join(' & ');
  if (schema.type === 'array') return `Array<${typeOf(schema.items)}>`;
  if (schema.additionalProperties) return `Record<string, ${typeOf(schema.additionalProperties)}>`;
  if (schema.properties) {
    const fields = Object.entries(schema.properties).map(([name, value]) =>
      `${name}${schema.required?.includes(name) ? '' : '?'}: ${typeOf(value)}`);
    return `{ ${fields.join('; ')} }`;
  }
  return { string: 'string', integer: 'number', number: 'number', boolean: 'boolean', file: 'File' }[schema.type] ?? 'unknown';
}

const lines = [
  '// Сгенерировано из Swagger командой npm run generate-api.',
  "import axios, { type AxiosRequestConfig } from 'axios';",
  '',
  ...Object.entries(swagger.definitions ?? {}).map(([name, schema]) =>
    `export type ${definitionName(name)} = ${typeOf(schema)};`),
  'const http = axios.create({ timeout: 60_000 });',
  '',
  'export const exoplanetsApi = {',
];

// У исходного Swagger нет operationId. Имена назначаются по маршруту и методу.
const exoplanetMethods = {
  'post /api/AddExoplanets': 'addDraftExoplanet',
  'delete /api/DeleteExoplanets/{id}': 'deleteExoplanet',
  'get /api/DraftExoplanets': 'getDraftExoplanet',
  'get /api/Exoplanets': 'getExoplanets',
  'get /api/Exoplanets/{id}': 'getExoplanet',
  'post /api/LikeExoplanets/{id}/like': 'likeExoplanet',
  'put /api/PublishExoplanets': 'publishExoplanet',
};

for (const [path, operations] of Object.entries(swagger.paths)) {
  for (const [method, operation] of Object.entries(operations)) {
    if (!operation.tags?.includes('Exoplanets')) continue;
    const name = exoplanetMethods[`${method} ${path}`];
    if (!name) throw new Error(`Неизвестный маршрут экзопланет: ${method} ${path}`);
    const params = operation.parameters ?? [];
    const pathParams = params.filter((param) => param.in === 'path');
    const query = params.filter((param) => param.in === 'query');
    const form = params.filter((param) => param.in === 'formData');
    const body = params.find((param) => param.in === 'body');
    const fields = (parameters) => parameters.map((param) =>
      `${param.name}${param.required ? '' : '?'}: ${typeOf(param)}`).join('; ');
    const args = pathParams.map((param) => `${param.name}: ${typeOf(param)}`);
    if (query.length) args.push(`query: { ${fields(query)} }`);
    if (form.length) args.push(`fields: { ${fields(form)} }`);
    if (body) args.push(`body: ${typeOf(body.schema)}`);
    args.push('config?: AxiosRequestConfig');
    lines.push(`  ${name}(${args.join(', ')}) {`);
    if (form.length) {
      lines.push('    const body = new FormData();');
      for (const { name: key, type } of form) {
        const value = type === 'file' ? `fields.${key}` : `String(fields.${key})`;
        lines.push(`    if (fields.${key} !== undefined) body.append('${key}', ${value});`);
      }
    }
    const url = pathParams.length ? '`' + path.replace(/{(\w+)}/g, '${$1}') + '`' : JSON.stringify(path);
    const options = query.length ? '{ ...config, params: query }' : 'config';
    const data = form.length || body ? 'body, ' : '';
    const success = Object.entries(operation.responses ?? {}).find(([code]) => code.startsWith('2'));
    const responseType = typeOf(success?.[1].schema);
    lines.push(`    return http.${method}<${responseType}>(${url}, ${data}${options});`, '  },');
  }
}
lines.push('};', '');
const directory = new URL('../src/api/', import.meta.url);
await mkdir(directory, { recursive: true });
await writeFile(new URL('Api.ts', directory), lines.join('\n'));
