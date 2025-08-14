# API Code Generator Project

This project generates TypeScript API client code from OpenAPI specifications.

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Add your OpenAPI specification**:
   - Place your OpenAPI spec file (`.yaml`, `.yml`, or `.json`) in the `specs/` directory
   - Replace or modify the example file `specs/example-api.yaml`

3. **Generate API code**:
   ```bash
   npm run generate
   ```

4. **Implement HTTP Client**:
   - Create `generated/src/http-client.ts` with your HTTP client implementation
   - The interface should match the expected HttpClient type

5. **Build the project**:
   ```bash
   npm run build
   ```

## CI/CD 自动化

本项目支持自动化的 CI/CD 流水线，当 OpenAPI 规范文件变更时自动生成和发布 API 客户端。

### 快速设置

1. **配置 npm 令牌**：在 GitHub 仓库设置中添加 `NPM_TOKEN` secret
2. **推送规范文件**：将 OpenAPI 规范文件放在 `specs/` 目录
3. **自动触发**：推送到主分支时自动执行构建和发布

### CI 脚本

```bash
# 构建并生成代码
npm run ci:build

# 发布生成的包
npm run ci:publish

# 完整的 CI 流程
npm run ci:full
```

详细配置请参考 [CI 设置指南](.github/CI_SETUP.md)。

## Project Structure

```
├── specs/                 # OpenAPI specification files
│   └── example-api.yaml   # Example API specification
├── src/                   # Source code
│   ├── generator.ts       # Main generator logic
│   ├── generate.ts        # Generation script
│   ├── types.ts          # Type definitions
│   └── utils.ts          # Utility functions
├── generated/            # Generated API code (created after running generate)
└── dist/                 # Compiled output
```

## HTTP Client Interface

You need to provide an HTTP client that implements this interface:

```typescript
interface HttpClient {
  get(url: string, options?: RequestInit): Promise<{ data: any }>;
  post(url: string, data?: any, options?: RequestInit): Promise<{ data: any }>;
  put(url: string, data?: any, options?: RequestInit): Promise<{ data: any }>;
  delete(url: string, options?: RequestInit): Promise<{ data: any }>;
  patch(url: string, data?: any, options?: RequestInit): Promise<{ data: any }>;
}
```

### Example HTTP Client Implementation

Create `generated/src/http-client.ts`:

```typescript
export interface HttpClient {
  get(url: string, options?: RequestInit): Promise<{ data: any }>;
  post(url: string, data?: any, options?: RequestInit): Promise<{ data: any }>;
  put(url: string, data?: any, options?: RequestInit): Promise<{ data: any }>;
  delete(url: string, options?: RequestInit): Promise<{ data: any }>;
  patch(url: string, data?: any, options?: RequestInit): Promise<{ data: any }>;
}

// Example implementation using fetch
export class FetchHttpClient implements HttpClient {
  async get(url: string, options?: RequestInit): Promise<{ data: any }> {
    const response = await fetch(url, { ...options, method: 'GET' });
    const data = await response.json();
    return { data };
  }

  async post(url: string, data?: any, options?: RequestInit): Promise<{ data: any }> {
    const response = await fetch(url, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    });
    const responseData = await response.json();
    return { data: responseData };
  }

  async put(url: string, data?: any, options?: RequestInit): Promise<{ data: any }> {
    const response = await fetch(url, {
      ...options,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    });
    const responseData = await response.json();
    return { data: responseData };
  }

  async delete(url: string, options?: RequestInit): Promise<{ data: any }> {
    const response = await fetch(url, { ...options, method: 'DELETE' });
    if (response.status === 204) {
      return { data: null };
    }
    const data = await response.json();
    return { data };
  }

  async patch(url: string, data?: any, options?: RequestInit): Promise<{ data: any }> {
    const response = await fetch(url, {
      ...options,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    });
    const responseData = await response.json();
    return { data: responseData };
  }
}
```

## Usage

After generation and building, you can use the API client:

```typescript
import { ApiClient } from './generated';
import { FetchHttpClient } from './generated/src/http-client';

const httpClient = new FetchHttpClient();
const apiClient = new ApiClient(httpClient, 'https://api.example.com/v1');

// Use the generated methods
const users = await apiClient.getUsers({ page: 1, limit: 10 });
const user = await apiClient.getUserById({ id: '123' });
const newUser = await apiClient.createUser({
  email: 'user@example.com',
  name: 'John Doe'
});
```

## Scripts

- `npm run build` - Build the project
- `npm run dev` - Build in watch mode
- `npm run generate` - Generate API code from OpenAPI spec

## Publishing

After generating and building your API client:

1. Update `package.json` with appropriate name, version, and metadata
2. Run `npm publish` to publish to npm
3. Or use the built code locally in your projects