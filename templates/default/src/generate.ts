#!/usr/bin/env node

import * as path from 'path';
import * as fs from 'fs-extra';
import chalk from 'chalk';
import { ApiGenerator } from './generator';

async function main() {
  try {
    console.log(chalk.blue('🚀 Starting API code generation...'));

    // 查找OpenAPI规范文件
    const specsDir = path.resolve(process.cwd(), 'specs');
    const specFiles = await fs.readdir(specsDir).catch(() => []);
    const specFile = specFiles.find(file => 
      file.endsWith('.yaml') || file.endsWith('.yml') || file.endsWith('.json')
    );

    if (!specFile) {
      console.log(chalk.red('❌ No OpenAPI spec file found in specs/ directory'));
      console.log(chalk.yellow('Please add a .yaml, .yml, or .json file to the specs/ directory'));
      process.exit(1);
    }

    const specPath = path.join(specsDir, specFile);
    console.log(chalk.blue(`📄 Using spec file: ${specFile}`));

    // 读取配置
    const packageJson = await fs.readJson(path.resolve(process.cwd(), 'package.json'));
    const config = {
      outputDir: path.resolve(process.cwd(), 'generated'),
      packageName: packageJson.name || 'api-client',
      httpClientImport: './http-client' // 用户需要提供HTTP客户端
    };

    // 创建生成器并生成代码
    const generator = new ApiGenerator(config);
    await generator.loadSpec(specPath);
    await generator.generate();

    console.log(chalk.green('✅ API code generation completed!'));
    console.log(chalk.yellow('\nNext steps:'));
    console.log(chalk.white('1. Implement the HttpClient interface in generated/src/http-client.ts'));
    console.log(chalk.white('2. Run npm run build to compile the generated code'));
    console.log(chalk.white('3. Publish to npm or use locally'));

  } catch (error) {
    console.error(chalk.red('❌ Generation failed:'), error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { main };