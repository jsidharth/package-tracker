// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import Axios from 'axios';

import { NPM_INFO_API } from './constants/api';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "package-tracker" is now active!');
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
    const fetchDependencyData = Axios.post(NPM_INFO_API, dependencies);
    const fetchDevDependencyData = Axios.post(NPM_INFO_API, devDependencies);
    const requestArray = [];
    if (dependencies.length) {
      requestArray.push(fetchDependencyData);
    }
    if (devDependencies.length) {
      requestArray.push(fetchDevDependencyData);
    }
    try {
      const response = await Promise.all(requestArray);
      if (requestArray.length === 2) {
        // dev and normal dependency present
      } else {
        if (dependencies.length) {
          // only dependency present
        } else {
          // only dev dependency present
        }
      }
    } catch (e) {
      console.log('API Error', e.response);
    }
  });
}

// this method is called when your extension is deactivated
export function deactivate() {}
