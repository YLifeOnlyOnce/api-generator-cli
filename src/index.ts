#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import * as fs from 'fs-extra';
import * as path from 'path';

const program = new Command();

program
  .name('api-gen')
  .description('CLI tool for generating API code projects')
  .version('1.0.0');

program
  .command('create <project-name>')
  .description('Create a new API project')
  .option('-t, --template <template>', 'Template to use', 'default')
  .action(async (projectName: string, options: { template: string }) => {
    try {
      console.log(chalk.blue(`Creating API project: ${projectName}`));
      
      const targetDir = path.resolve(process.cwd(), projectName);
      const templateDir = path.resolve(__dirname, '../templates', options.template);
      
      // Check if target directory already exists
      if (await fs.pathExists(targetDir)) {
        console.log(chalk.red(`Directory ${projectName} already exists!`));
        process.exit(1);
      }
      
      // Check if template exists
      if (!(await fs.pathExists(templateDir))) {
        console.log(chalk.red(`Template ${options.template} not found!`));
        process.exit(1);
      }
      
      // Copy template to target directory
      await fs.copy(templateDir, targetDir);
      
      // Update package.json with project name
      const packageJsonPath = path.join(targetDir, 'package.json');
      if (await fs.pathExists(packageJsonPath)) {
        const packageJson = await fs.readJson(packageJsonPath);
        packageJson.name = projectName;
        await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
      }
      
      console.log(chalk.green(`✅ Project ${projectName} created successfully!`));
      console.log(chalk.yellow(`\nNext steps:`));
      console.log(chalk.white(`  cd ${projectName}`));
      console.log(chalk.white(`  npm install`));
      console.log(chalk.white(`  npm run build`));
      
    } catch (error) {
      console.error(chalk.red('Error creating project:'), error);
      process.exit(1);
    }
  });

program
  .command('list-templates')
  .description('List available templates')
  .action(async () => {
    try {
      const templatesDir = path.resolve(__dirname, '../templates');
      const templates = await fs.readdir(templatesDir);
      
      console.log(chalk.blue('Available templates:'));
      templates.forEach(template => {
        console.log(chalk.white(`  - ${template}`));
      });
    } catch (error) {
      console.error(chalk.red('Error listing templates:'), error);
    }
  });

program.parse();

export default program;