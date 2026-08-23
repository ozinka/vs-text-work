const vscode = require('vscode');
const {
  nestedMarker,
  nextMarker,
  outdentedMarker,
  parseListItem,
  renumberFollowingNumberItems
} = require('./list-utils');

function formatDateTime(now = new Date()) {
  const pad = number => String(number).padStart(2, '0');
  return `${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

function findPreviousMarker(document, lineNumber, indent) {
  for (let index = lineNumber - 1; index >= 0; index -= 1) {
    const line = document.lineAt(index);
    if (line.isEmptyOrWhitespace) continue;
    const item = parseListItem(line.text);
    if (!item) continue;
    if (item.indent.length === indent.length) return item.marker;
    if (item.indent.length < indent.length) return null;
  }
  return null;
}

function indentationUnit(editor) {
  if (editor.options.insertSpaces === false) return '\t';
  return ' '.repeat(Number(editor.options.tabSize) || 4);
}

function insertDateTimeLine(editor, { before = false } = {}) {
  if (!editor) return;
  const cursor = editor.selection.active;
  const divider = `--- ✄ --------- ${formatDateTime()} -------------------`;
  const text = before ? `\n${divider}\n` : `${divider}\n`;

  editor.edit(edit => edit.insert(cursor, text)).then(() => {
    if (!before) return;
    const position = new vscode.Position(cursor.line, cursor.character);
    editor.selection = new vscode.Selection(position, position);
    editor.revealRange(new vscode.Range(position, position));
  });
}

function handleEnter() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;
  const cursor = editor.selection.active;
  const line = editor.document.lineAt(cursor.line);
  const item = parseListItem(line.text);
  if (!item) {
    vscode.commands.executeCommand('type', { source: 'keyboard', text: '\n' });
    return;
  }

  if (item.content.trim().length === 0) {
    editor.edit(edit => edit.replace(line.range, item.indent));
    return;
  }

  const previousMarker = findPreviousMarker(editor.document, cursor.line, item.indent);
  const marker = nextMarker(item.marker, previousMarker);
  const markerStart = item.indent.length;
  const followingItems = [];
  for (let index = cursor.line + 1; index < editor.document.lineCount; index += 1) {
    followingItems.push(parseListItem(editor.document.lineAt(index).text));
  }
  const renumberUpdates = /^\d+\.$/.test(marker)
    ? renumberFollowingNumberItems(followingItems, item.indent, Number.parseInt(marker, 10) + 1)
    : [];

  editor.edit(edit => {
    if (item.marker === '*') {
      edit.replace(new vscode.Range(cursor.line, markerStart, cursor.line, markerStart + 1), '•');
    }
    edit.insert(cursor, `\n${item.indent}${marker} `);
    for (const update of renumberUpdates) {
      const lineNumber = cursor.line + 1 + update.offset;
      const oldMarker = followingItems[update.offset].marker;
      edit.replace(
        new vscode.Range(lineNumber, item.indent.length, lineNumber, item.indent.length + oldMarker.length),
        update.marker
      );
    }
  });
}

function handleTab() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;
  const cursor = editor.selection.active;
  const line = editor.document.lineAt(cursor.line);
  const item = parseListItem(line.text);
  if (!item) {
    vscode.commands.executeCommand('tab');
    return;
  }

  const indent = indentationUnit(editor);
  editor.edit(edit => edit.replace(line.range, `${indent}${item.indent}${nestedMarker(item.marker)} ${item.content}`));
}

function handleShiftTab() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;
  const cursor = editor.selection.active;
  const line = editor.document.lineAt(cursor.line);
  const item = parseListItem(line.text);
  if (!item) {
    vscode.commands.executeCommand('outdent');
    return;
  }

  const unit = indentationUnit(editor);
  if (!item.indent.startsWith(unit)) {
    vscode.commands.executeCommand('outdent');
    return;
  }

  const indent = item.indent.slice(unit.length);
  const marker = outdentedMarker(item.marker, findPreviousMarker(editor.document, cursor.line, indent));
  editor.edit(edit => edit.replace(line.range, `${indent}${marker} ${item.content}`));
}

function activate(context) {
  const register = (command, callback) => vscode.commands.registerCommand(command, callback);
  context.subscriptions.push(
    register('textWork.insertDateTimeLineAfter', () => insertDateTimeLine(vscode.window.activeTextEditor)),
    register('textWork.insertDateTimeLineBefore', () => insertDateTimeLine(vscode.window.activeTextEditor, { before: true })),
    register('textWork.onEnter', handleEnter),
    register('textWork.onTab', handleTab),
    register('textWork.onShiftTab', handleShiftTab)
  );
}

function deactivate() {}

module.exports = { activate, deactivate, formatDateTime };
