import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";

// Matches: // COPY: path/to/file  |  # COPY: path/to/file  |  /* COPY: path/to/file */
const COPY_PATTERN = /^[\s]*(?:\/\/|#|\/\*)\s*COPY:\s*(.+?)(?:\s*\*\/)?$/;

// Matches: // TERM:  |  // TERM: my-terminal  |  # TERM:  |  /* TERM: name */
const TERM_PATTERN = /^[\s]*(?:\/\/|#|\/\*)\s*TERM:\s*(.*?)(?:\s*\*\/)?$/;

class TermMarkerCodeLensProvider implements vscode.CodeLensProvider {
  private _onDidChangeCodeLenses = new vscode.EventEmitter<void>();
  readonly onDidChangeCodeLenses = this._onDidChangeCodeLenses.event;

  provideCodeLenses(document: vscode.TextDocument): vscode.CodeLens[] {
    const lenses: vscode.CodeLens[] = [];
    for (let i = 0; i < document.lineCount; i++) {
      const match = TERM_PATTERN.exec(document.lineAt(i).text);
      if (match) {
        const terminalName = match[1].trim() || undefined;
        const range = new vscode.Range(i, 0, i, document.lineAt(i).text.length);
        lenses.push(
          new vscode.CodeLens(range, {
            title: `$(terminal) Run in Terminal${terminalName ? `: ${terminalName}` : ""}`,
            command: "copyMarkerToFile.runInTerminal",
            arguments: [document, i, terminalName],
          }),
        );
      }
    }
    return lenses;
  }
}

class CopyMarkerCodeLensProvider implements vscode.CodeLensProvider {
  private _onDidChangeCodeLenses = new vscode.EventEmitter<void>();
  readonly onDidChangeCodeLenses = this._onDidChangeCodeLenses.event;

  provideCodeLenses(document: vscode.TextDocument): vscode.CodeLens[] {
    const lenses: vscode.CodeLens[] = [];
    for (let i = 0; i < document.lineCount; i++) {
      const match = COPY_PATTERN.exec(document.lineAt(i).text);
      if (match) {
        const filePath = match[1].trim();
        const range = new vscode.Range(i, 0, i, document.lineAt(i).text.length);
        lenses.push(
          new vscode.CodeLens(range, {
            title: `$(file-add) Create / Update: ${filePath}`,
            command: "copyMarkerToFile.create",
            arguments: [document, i, filePath],
          }),
        );
      }
    }
    return lenses;
  }
}

/**
 * For markdown files: extract lines between the enclosing ``` fences,
 * skipping the COPY: marker line itself.
 * For other files: extract lines from the COPY: line + 1 until next COPY: or EOF.
 */
function extractContent(
  document: vscode.TextDocument,
  copyLineIndex: number,
): string | null {
  if (document.languageId === "markdown") {
    // Search backwards for opening fence
    let fenceStart = -1;
    for (let i = copyLineIndex - 1; i >= 0; i--) {
      if (/^\s*```/.test(document.lineAt(i).text)) {
        fenceStart = i;
        break;
      }
    }
    // Search forwards for closing fence
    let fenceEnd = -1;
    for (let i = copyLineIndex + 1; i < document.lineCount; i++) {
      if (/^\s*```/.test(document.lineAt(i).text)) {
        fenceEnd = i;
        break;
      }
    }
    if (fenceStart === -1 || fenceEnd === -1) return null;

    const lines: string[] = [];
    for (let i = fenceStart + 1; i < fenceEnd; i++) {
      if (i === copyLineIndex) continue; // skip the COPY: line
      lines.push(document.lineAt(i).text);
    }
    return lines.join("\n");
  }

  // Non-markdown: from the line after COPY: until next COPY: marker or EOF
  const lines: string[] = [];
  for (let i = copyLineIndex + 1; i < document.lineCount; i++) {
    if (COPY_PATTERN.exec(document.lineAt(i).text)) break;
    lines.push(document.lineAt(i).text);
  }
  return lines.join("\n").trim();
}

async function pickWorkspaceRoot(): Promise<string | undefined> {
  const folders = vscode.workspace.workspaceFolders;
  if (!folders || folders.length === 0) {
    vscode.window.showErrorMessage("No workspace folder open.");
    return undefined;
  }
  if (folders.length === 1) return folders[0].uri.fsPath;

  const picked = await vscode.window.showQuickPick(
    folders.map((f) => ({
      label: f.name,
      description: f.uri.fsPath,
      folder: f,
    })),
    { placeHolder: "Select workspace folder to create the file in" },
  );
  return picked?.folder.uri.fsPath;
}

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerCodeLensProvider(
      { pattern: "**/*" },
      new CopyMarkerCodeLensProvider(),
    ),
  );

  context.subscriptions.push(
    vscode.languages.registerCodeLensProvider(
      { pattern: "**/*" },
      new TermMarkerCodeLensProvider(),
    ),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "copyMarkerToFile.runInTerminal",
      async (
        document: vscode.TextDocument,
        lineIndex: number,
        terminalName: string | undefined,
      ) => {
        const content = extractContent(document, lineIndex);
        if (content === null) {
          vscode.window.showErrorMessage(
            "Could not find code block content for this TERM marker.",
          );
          return;
        }

        let terminal: vscode.Terminal | undefined;
        if (terminalName) {
          terminal = vscode.window.terminals.find((t) => t.name === terminalName);
        }
        if (!terminal) {
          terminal = terminalName
            ? vscode.window.createTerminal(terminalName)
            : vscode.window.activeTerminal ?? vscode.window.createTerminal();
        }

        terminal.show(true);
        terminal.sendText(content);
      },
    ),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "copyMarkerToFile.create",
      async (
        document: vscode.TextDocument,
        lineIndex: number,
        relativeFilePath: string,
      ) => {
        const content = extractContent(document, lineIndex);
        if (content === null) {
          vscode.window.showErrorMessage(
            "Could not find code block content for this COPY marker.",
          );
          return;
        }

        const workspaceRoot = await pickWorkspaceRoot();
        if (!workspaceRoot) return;

        const absoluteFilePath = path.join(workspaceRoot, relativeFilePath);
        const fileExists = fs.existsSync(absoluteFilePath);

        if (fileExists) {
          const action = await vscode.window.showWarningMessage(
            `File already exists: ${relativeFilePath}`,
            { modal: true },
            "Update",
            "Cancel",
          );
          if (action !== "Update") return;
        }

        fs.mkdirSync(path.dirname(absoluteFilePath), { recursive: true });
        fs.writeFileSync(absoluteFilePath, content + "\n", "utf8");

        await vscode.window.showTextDocument(vscode.Uri.file(absoluteFilePath));
        vscode.window.showInformationMessage(
          `${fileExists ? "Updated" : "Created"}: ${relativeFilePath}`,
        );
      },
    ),
  );
}

export function deactivate() {}
