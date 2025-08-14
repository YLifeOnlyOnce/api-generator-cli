export interface OpenApiSpec {
  openapi: string;
  info: {
    title: string;
    version: string;
    description?: string;
  };
  servers?: Array<{
    url: string;
    description?: string;
  }>;
  paths: Record<string, any>;
  components?: {
    schemas?: Record<string, any>;
    parameters?: Record<string, any>;
    responses?: Record<string, any>;
  };
}

export interface ApiEndpoint {
  path: string;
  method: string;
  operationId?: string;
  summary?: string;
  description?: string;
  parameters?: Parameter[];
  requestBody?: RequestBody;
  responses: Record<string, Response>;
  tags?: string[];
}

export interface Parameter {
  name: string;
  in: 'query' | 'path' | 'header' | 'cookie';
  required?: boolean;
  schema: Schema;
  description?: string;
}

export interface RequestBody {
  required?: boolean;
  content: Record<string, {
    schema: Schema;
  }>;
}

export interface Response {
  description: string;
  content?: Record<string, {
    schema: Schema;
  }>;
}

export interface Schema {
  type?: string;
  format?: string;
  items?: Schema;
  properties?: Record<string, Schema>;
  required?: string[];
  $ref?: string;
  enum?: any[];
  description?: string;
}

export interface GeneratorConfig {
  outputDir: string;
  packageName: string;
  httpClientImport?: string;
  templateDir?: string;
}

export interface GeneratedFile {
  path: string;
  content: string;
}