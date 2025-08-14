import * as path from 'path';
import { Schema } from './types';

/**
 * 将路径参数转换为TypeScript类型
 */
export function pathToTypeName(apiPath: string): string {
  return apiPath
    .split('/')
    .filter(segment => segment && !segment.startsWith('{'))
    .map(segment => capitalize(segment))
    .join('');
}

/**
 * 首字母大写
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * 将OpenAPI schema转换为TypeScript类型
 */
export function schemaToTypeScript(schema: Schema, name?: string): string {
  if (schema.$ref) {
    const refName = schema.$ref.split('/').pop();
    return refName || 'any';
  }

  switch (schema.type) {
    case 'string':
      if (schema.enum) {
        return schema.enum.map(val => `'${val}'`).join(' | ');
      }
      return 'string';
    case 'number':
    case 'integer':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'array':
      if (schema.items) {
        return `Array<${schemaToTypeScript(schema.items)}>`;
      }
      return 'any[]';
    case 'object':
      if (schema.properties) {
        const props = Object.entries(schema.properties)
          .map(([key, propSchema]) => {
            const optional = !schema.required?.includes(key) ? '?' : '';
            return `  ${key}${optional}: ${schemaToTypeScript(propSchema as Schema)};`;
          })
          .join('\n');
        return `{\n${props}\n}`;
      }
      return 'Record<string, any>';
    default:
      return 'any';
  }
}

/**
 * 生成方法名
 */
export function generateMethodName(method: string, path: string, operationId?: string): string {
  if (operationId) {
    return operationId;
  }

  const pathParts = path
    .split('/')
    .filter(part => part && !part.startsWith('{'))
    .map(part => capitalize(part));

  return method.toLowerCase() + pathParts.join('');
}

/**
 * 确保目录存在
 */
export function ensureDir(dirPath: string): void {
  const fs = require('fs-extra');
  fs.ensureDirSync(dirPath);
}

/**
 * 获取相对路径
 */
export function getRelativePath(from: string, to: string): string {
  const relativePath = path.relative(from, to);
  return relativePath.startsWith('.') ? relativePath : `./${relativePath}`;
}