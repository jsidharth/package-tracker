import * as vscode from 'vscode';

export function hoverHandler(dependencies: any[]) {
  vscode.languages.registerHoverProvider('json', {
    provideHover(document, position, token) {
      const range = document.getWordRangeAtPosition(position);
      const word = document.getText(range);
      if (word) {
        const currDependency = dependencies.find((el) => el.name === word.replace(/"/g, ''));
        if (currDependency) {
          vscode.CommentMode;
          return new vscode.Hover(
            'Some Markdown text with <span style="color:blue">some *blue* text</span>',
          );
        }
      }
    },
  });
}
