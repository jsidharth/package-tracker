// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import Axios from 'axios';

import { NPM_INFO_API } from './constants/api';
import { hoverHandler } from './hoverHandler';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated

  fs.readFile(`${vscode.workspace.rootPath}/package.json`, async (err, data) => {
    if (err) {
      console.error('package.json parsing failed');
      return;
    }
    //TODO: ADD ERROR CHECKS
    const parsedData = JSON.parse(data.toString()); // buffer to JSON
    const dependencies = parsedData.dependencies ? Object.keys(parsedData.dependencies) : [];
    const devDependencies = parsedData.devDependencies
      ? Object.keys(parsedData.devDependencies)
      : [];
    const allDependencies = dependencies.concat(devDependencies);
    try {
      const response = await Axios.post(NPM_INFO_API, allDependencies);
      const depData: any[] = [];
      allDependencies.map((el) => {
        if (response.data[el]) {
          const data = response.data[el];
          data.name = el;
          depData.push(data);
        }
      });
      hoverHandler(depData);
    } catch (e) {
      console.log('API Error', e);
    }
  });
}

// this method is called when your extension is deactivated
export function deactivate() {}
