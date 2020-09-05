// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from "fs";
import * as Promise from "bluebird";
import axios from "axios";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "package-tracker" is now active!');
	fs.readFile(`${vscode.workspace.rootPath}/package.json`, (err, data) => {
		
		if (err) {
			console.error('package.json parsing failed');
		}
		//TODO: ADD ERROR CHECKS
		const parsedData = JSON.parse(data.toString());
		const dependencies = Object.keys(parsedData["dependencies"]);
		const fetchedDependencyData: any = [];

		Promise.mapSeries(dependencies, eachDependency => {
			return axios.get(`https://api.npms.io/v2/package/${eachDependency}`).then(response => {
				if(response.status === 200) {
					fetchedDependencyData.push({
						eachDependency: response.data
					});
				} else {
					console.error(`API to fetch dependecy details failed with ${response.status}: ${response.statusText}`);
				}
			}).catch(err => {
				//TODO: CHECK ERROR HANDLING
				console.error('Data fetch failed!!');
			});
		}).then(() => {
			console.log(fetchedDependencyData);
			
		});
		
	});
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('package-tracker.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		console.log("Hello");
		
		vscode.window.showInformationMessage('Hello World from package-tracker!');
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
