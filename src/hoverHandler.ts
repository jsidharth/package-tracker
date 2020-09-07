import * as vscode from 'vscode';

export function hoverHandler(dependencies: any[]) {
  vscode.languages.registerHoverProvider('json', {
    provideHover(document, position, token) {
      const range = document.getWordRangeAtPosition(position);
      const word = document.getText(range);
      if (word) {
        const currDependency = dependencies.find((el) => el.name === word.replace(/"/g, ''));
        if (currDependency) {
          return new vscode.Hover({
            language: 'json',
            value: currDependency.name + 'is awesome',
          });
        }
      }
    },
  });
}
