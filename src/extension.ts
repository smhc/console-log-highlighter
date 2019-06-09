import * as vscode from "vscode";
import {
  commands,
  languages,
  CodeLensProvider,
  TextDocument,
  CodeLens,
  Command
} from "vscode";

class MyCodeLensProvider implements CodeLensProvider {
  async provideCodeLenses(document: TextDocument): Promise<CodeLens[]> {
    const sourceCode = document.getText();
    const regex = /(test_[a-zA-Z0-9]+)\&\(\) =/;
    const sourceCodeArr = sourceCode.split("\n");
    let codeLenses: vscode.CodeLens[] = [];

    for (let line = 0; line < sourceCodeArr.length; line++) {
      const match = sourceCodeArr[line].match(regex);
      if (match !== null && match.index !== undefined) {
        const range = new vscode.Range(
          new vscode.Position(line, match.index),
          new vscode.Position(line, match.index + match[1].length)
        );
        const c: Command = {
          command: "extension.runTest",
          title: ">> Run test",
          arguments: [match[1]],
        };
        const codeLens = new CodeLens(range, c);
        codeLenses.push(codeLens);
      }
    }
    return codeLenses;
  }
}

async function runTest(testName) {
  // TODO: exec epmtestharness testName task
  console.log('running test ' + testName);
}

export function activate(context: vscode.ExtensionContext) {
  // Register the command
  let commandDisposable = commands.registerCommand(
    "extension.runTest",
    runTest
  );

  let docSelector = {
    language: 'epm',
    scheme: 'file'
  }

  // Register our CodeLens provider
  let codeLensProviderDisposable = languages.registerCodeLensProvider(
    docSelector,
    new MyCodeLensProvider()
  );

  // Push the command and CodeLens provider to the context so it can be disposed of later
  context.subscriptions.push(commandDisposable);
  context.subscriptions.push(codeLensProviderDisposable);
}

export function deactivate() {}