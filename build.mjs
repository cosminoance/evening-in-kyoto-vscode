// Builds themes/*.json from palette.json. Run with `npm run build` after changing a colour.
//
// The mapping follows ../evening-in-kyoto-nvim/lua/evening_in_kyoto/highlights.lua: each entry
// names the Neovim group it comes from. Where VS Code cannot do what Neovim does, the comment
// says what was done instead.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const palettes = JSON.parse(readFileSync(new URL('./palette.json', import.meta.url), 'utf8'));

// '#rrggbb' plus a two-digit hex alpha.
const alpha = (hex, a) => hex + a;
const none = '#00000000';

function workbench(p) {
  const shadow = p.type === 'dark' ? '#00000080' : '#00000026';
  return {
    // Normal
    'foreground': p.fg,
    'descriptionForeground': p.comment,
    'errorForeground': p.red,
    'icon.foreground': p.fg,
    'focusBorder': p.comment,
    'widget.shadow': shadow,
    'selection.background': p.bg_light,
    'textLink.foreground': p.blue, // @markup.link
    'textLink.activeForeground': p.cyan, // @markup.link.url
    'textBlockQuote.border': p.comment,
    'textPreformat.foreground': p.green, // @markup.raw
    'sash.hoverBorder': p.yellow,

    // Normal, CursorLine, Visual
    'editor.background': p.bg,
    'editor.foreground': p.fg,
    // Neovim draws CursorLine and Visual in the same colour and Visual wins. VS Code layers the
    // selection over the line highlight, so the line highlight is at half strength to keep a
    // selection on the cursor line visible.
    'editor.lineHighlightBackground': alpha(p.bg_light, '80'),
    'editor.lineHighlightBorder': none,
    'editor.selectionBackground': p.bg_light,
    'editor.inactiveSelectionBackground': alpha(p.bg_light, '80'),
    // LspReferenceText, LspReferenceRead, LspReferenceWrite
    'editor.selectionHighlightBackground': alpha(p.bg_light, '80'),
    'editor.wordHighlightBackground': p.bg_light,
    'editor.wordHighlightStrongBackground': p.bg_light,
    'editor.wordHighlightStrongBorder': p.comment,
    // Search, IncSearch. Neovim also recolours the text inside a match to the background colour;
    // VS Code keeps the syntax colour, so the match backgrounds are translucent to keep it
    // readable.
    'editor.findMatchBackground': alpha(p.orange, '80'),
    'editor.findMatchHighlightBackground': alpha(p.yellow, '4d'),
    'editor.findRangeHighlightBackground': alpha(p.bg_light, '80'),
    'editor.rangeHighlightBackground': alpha(p.bg_light, '80'),
    'editor.foldBackground': alpha(p.bg_light, '4d'), // Folded

    'editorCursor.foreground': p.fg_bright, // Cursor
    'editorLineNumber.foreground': p.comment, // LineNr
    'editorLineNumber.activeForeground': p.yellow, // CursorLineNr
    'editorGutter.background': p.bg, // SignColumn
    'editorWhitespace.foreground': p.bg_light, // Whitespace
    'editorIndentGuide.background1': p.bg_light,
    'editorIndentGuide.activeBackground1': p.comment,
    'editorRuler.foreground': p.bg_light, // ColorColumn
    'editorBracketMatch.background': none, // MatchParen
    'editorBracketMatch.border': p.yellow,
    'editorCodeLens.foreground': p.comment,
    'editorLink.activeForeground': p.blue,
    'editorGhostText.foreground': p.comment, // BlinkCmpGhostText
    'editorInlayHint.foreground': p.comment, // LspInlayHint
    'editorInlayHint.background': p.bg_dark,

    // DiagnosticUnderline*
    'editorError.foreground': p.red,
    'editorWarning.foreground': p.orange,
    'editorInfo.foreground': p.cyan,
    'editorHint.foreground': p.blue,
    'editorOverviewRuler.border': p.bg,
    'editorOverviewRuler.errorForeground': p.red,
    'editorOverviewRuler.warningForeground': p.orange,
    'editorOverviewRuler.infoForeground': p.cyan,
    'editorOverviewRuler.findMatchForeground': p.yellow,
    'minimap.findMatchHighlight': p.yellow,

    // NormalFloat, FloatBorder
    'editorWidget.background': p.bg_dark,
    'editorWidget.foreground': p.fg,
    'editorWidget.border': p.comment,
    'editorHoverWidget.background': p.bg_dark,
    'editorHoverWidget.border': p.comment,
    'notifications.background': p.bg_dark,
    'notifications.foreground': p.fg,
    'notifications.border': p.comment,
    'notificationCenterHeader.background': p.bg_dark,

    // Pmenu, PmenuSel, BlinkCmpLabelMatch
    'editorSuggestWidget.background': p.bg_dark,
    'editorSuggestWidget.foreground': p.fg,
    'editorSuggestWidget.border': p.comment,
    'editorSuggestWidget.selectedBackground': p.yellow,
    'editorSuggestWidget.selectedForeground': p.bg,
    'editorSuggestWidget.selectedIconForeground': p.bg,
    'editorSuggestWidget.highlightForeground': p.yellow,
    'editorSuggestWidget.focusHighlightForeground': p.bg,
    'menu.background': p.bg_dark,
    'menu.foreground': p.fg,
    'menu.border': p.comment,
    'menu.selectionBackground': p.yellow,
    'menu.selectionForeground': p.bg,
    'menu.separatorBackground': p.bg_light,

    // TelescopeNormal, TelescopePromptNormal, TelescopeSelection, TelescopeMatching
    'quickInput.background': p.bg_dark,
    'quickInput.foreground': p.fg,
    'quickInputTitle.background': p.bg_dark,
    'quickInputList.focusBackground': p.bg_light,
    'quickInputList.focusForeground': p.fg_bright,
    'quickInputList.focusIconForeground': p.fg_bright,
    'pickerGroup.foreground': p.yellow,
    'pickerGroup.border': p.bg_light,
    'input.background': p.bg_light,
    'input.foreground': p.fg,
    'input.border': none,
    'input.placeholderForeground': p.comment,
    'inputOption.activeBorder': p.yellow,
    'inputOption.activeBackground': alpha(p.yellow, '33'),
    'inputValidation.errorBorder': p.red,
    'inputValidation.warningBorder': p.orange,
    'inputValidation.infoBorder': p.cyan,
    'dropdown.background': p.bg_dark,
    'dropdown.foreground': p.fg,
    'dropdown.border': p.comment,

    // Lists in the side bar, Telescope's results and the quick input
    'list.activeSelectionBackground': p.bg_light,
    'list.activeSelectionForeground': p.fg_bright,
    'list.activeSelectionIconForeground': p.fg_bright,
    'list.inactiveSelectionBackground': p.bg_light,
    'list.inactiveSelectionForeground': p.fg,
    'list.hoverBackground': alpha(p.bg_light, '80'),
    'list.hoverForeground': p.fg,
    'list.focusOutline': p.comment,
    'list.highlightForeground': p.yellow,
    'list.focusHighlightForeground': p.yellow,
    'list.errorForeground': p.red,
    'list.warningForeground': p.orange,
    'tree.indentGuidesStroke': p.bg_light,

    // StatusLine, StatusLineNC, MiniStatuslineMode*
    'statusBar.background': p.bg_dark,
    'statusBar.foreground': p.fg,
    'statusBar.border': p.bg_dark,
    'statusBar.noFolderBackground': p.bg_dark,
    'statusBar.debuggingBackground': p.orange,
    'statusBar.debuggingForeground': p.bg,
    'statusBarItem.remoteBackground': p.green,
    'statusBarItem.remoteForeground': p.bg,
    'statusBarItem.hoverBackground': p.bg_light,
    'statusBarItem.errorBackground': p.red,
    'statusBarItem.errorForeground': p.bg,
    'statusBarItem.warningBackground': p.orange,
    'statusBarItem.warningForeground': p.bg,

    // TabLine, TabLineFill, TabLineSel
    'editorGroupHeader.tabsBackground': p.bg_dark,
    'editorGroupHeader.noTabsBackground': p.bg_dark,
    'editorGroup.border': p.bg_dark, // WinSeparator
    // Evening's active tab is a dark amber (amber mixed into the background) instead of
    // TabLineSel's bright yellow, so VS Code's coloured icons, warning and git names stay
    // readable on it. Morning's is a pale gold (gold mixed into its background) for the same reason.
    'tab.activeBackground': p.tab_bg,
    'tab.activeForeground': p.tab_fg,
    'tab.inactiveBackground': p.bg_dark,
    'tab.inactiveForeground': p.comment,
    'tab.unfocusedActiveBackground': p.bg_light,
    'tab.unfocusedActiveForeground': p.fg,
    'tab.border': p.bg_dark,
    'breadcrumb.foreground': p.comment,
    'breadcrumb.focusForeground': p.fg,
    'breadcrumb.activeSelectionForeground': p.yellow,
    'breadcrumbPicker.background': p.bg_dark,

    // No Neovim equivalent: the surfaces around the editor follow StatusLine (bg_dark), titles
    // follow Title (yellow), counts follow PmenuSel.
    'titleBar.activeBackground': p.bg_dark,
    'titleBar.activeForeground': p.fg,
    'titleBar.inactiveBackground': p.bg_dark,
    'titleBar.inactiveForeground': p.comment,
    'activityBar.background': p.bg_dark,
    'activityBar.foreground': p.fg,
    'activityBar.inactiveForeground': p.comment,
    'activityBar.activeBorder': p.yellow,
    'activityBar.border': p.bg_dark,
    'activityBarBadge.background': p.yellow,
    'activityBarBadge.foreground': p.bg,
    'badge.background': p.yellow,
    'badge.foreground': p.bg,
    'sideBar.background': p.bg_dark,
    'sideBar.foreground': p.fg,
    'sideBar.border': p.bg_dark,
    'sideBarTitle.foreground': p.yellow,
    'sideBarSectionHeader.background': p.bg_dark,
    'sideBarSectionHeader.foreground': p.fg,
    'sideBarSectionHeader.border': p.bg_light,
    'panel.background': p.bg,
    'panel.border': p.bg_light,
    'panelTitle.activeForeground': p.yellow,
    'panelTitle.activeBorder': p.yellow,
    'panelTitle.inactiveForeground': p.comment,
    'button.background': p.yellow,
    'button.foreground': p.bg,
    'button.hoverBackground': p.orange,
    'button.secondaryBackground': p.bg_light,
    'button.secondaryForeground': p.fg,
    'progressBar.background': p.yellow, // FidgetTitle
    'scrollbarSlider.background': alpha(p.comment, '66'), // PmenuThumb
    'scrollbarSlider.hoverBackground': alpha(p.comment, '99'),
    'scrollbarSlider.activeBackground': p.comment,
    'peekView.border': p.yellow,
    'peekViewEditor.background': p.bg_dark,
    'peekViewResult.background': p.bg_dark,
    'peekViewTitle.background': p.bg_dark,
    'peekViewEditor.matchHighlightBackground': alpha(p.yellow, '4d'),
    'peekViewResult.matchHighlightBackground': alpha(p.yellow, '4d'),
    'peekViewResult.selectionBackground': p.bg_light,
    'debugToolBar.background': p.bg_dark,

    // GitSigns*
    'gitDecoration.addedResourceForeground': p.green,
    'gitDecoration.modifiedResourceForeground': p.orange,
    'gitDecoration.deletedResourceForeground': p.red,
    'gitDecoration.untrackedResourceForeground': p.cyan,
    'gitDecoration.ignoredResourceForeground': p.comment,
    'gitDecoration.conflictingResourceForeground': p.magenta,
    'editorGutter.addedBackground': p.green,
    'editorGutter.modifiedBackground': p.orange,
    'editorGutter.deletedBackground': p.red,

    // DiffAdd, DiffDelete. Neovim colours the text; VS Code only tints the background.
    'diffEditor.insertedTextBackground': alpha(p.green, '33'),
    'diffEditor.removedTextBackground': alpha(p.red, '33'),
    'diffEditor.insertedLineBackground': alpha(p.green, '1a'),
    'diffEditor.removedLineBackground': alpha(p.red, '1a'),

    // terminal_color_0 to terminal_color_15
    'terminal.background': p.bg,
    'terminal.foreground': p.fg,
    'terminalCursor.foreground': p.fg_bright,
    'terminal.selectionBackground': p.bg_light,
    ...Object.fromEntries(
      Object.entries(p.terminal).map(([name, hex]) => [
        'terminal.ansi' + name[0].toUpperCase() + name.slice(1),
        hex,
      ]),
    ),
  };
}

// TextMate scopes. A later rule wins over an earlier one when both match, so specific scopes
// come after general ones.
function tokens(p) {
  const rule = (name, scope, foreground, fontStyle) => ({
    name,
    scope,
    settings: { ...(foreground && { foreground }), ...(fontStyle !== undefined && { fontStyle }) },
  });
  return [
    rule('Delimiter, @punctuation', ['punctuation', 'meta.brace'], p.fg),
    rule('Identifier, @variable, @property', ['variable', 'variable.other', 'variable.other.property', 'variable.other.object.property', 'support.variable.property'], p.fg, ''),
    rule('@variable.parameter', ['variable.parameter'], p.fg, 'italic'),
    rule('@variable.builtin', ['variable.language'], p.red, 'italic'),

    rule('Comment', ['comment', 'punctuation.definition.comment', 'string.quoted.docstring'], p.comment, 'italic'),
    rule('String', ['string', 'string.regexp', 'punctuation.definition.string'], p.yellow),
    rule('@string.escape, @string.special', ['constant.character.escape', 'constant.other.placeholder'], p.blue),
    rule('@punctuation.special', ['punctuation.definition.template-expression', 'punctuation.section.embedded', 'punctuation.section.interpolation'], p.blue),

    rule('Constant, Number, Character', ['constant', 'constant.numeric', 'constant.character', 'constant.other', 'variable.other.constant', 'variable.other.enummember', 'support.constant', 'keyword.other.unit'], p.magenta, ''),
    rule('@constant.builtin', ['constant.language'], p.magenta, 'italic'),
    rule('Boolean', ['constant.language.boolean'], p.magenta, ''),

    rule('Function', ['entity.name.function', 'meta.function-call.generic', 'entity.name.function.macro', 'entity.name.function.preprocessor'], p.green, ''),
    rule('@function.builtin', ['support.function'], p.green, 'italic'),

    rule('Keyword', ['keyword', 'keyword.control', 'keyword.other', 'keyword.operator.new', 'keyword.operator.expression', 'keyword.operator.logical.python', 'storage.type', 'storage.modifier'], p.red, 'italic'),
    rule('Conditional, Repeat, Exception', ['keyword.control.conditional', 'keyword.control.loop', 'keyword.control.trycatch', 'keyword.control.exception', 'keyword.control.switch'], p.red, ''),
    rule('Include, Define, Macro', ['keyword.control.import', 'keyword.control.export', 'keyword.control.from', 'keyword.control.directive', 'keyword.other.import', 'keyword.other.use', 'meta.preprocessor punctuation.definition.directive'], p.red, ''),
    rule('Operator', ['keyword.operator', 'punctuation.accessor.optional', 'storage.type.function.arrow'], p.red, ''),
    rule('PreProc', ['meta.preprocessor', 'meta.preprocessor.string'], p.yellow),

    rule('Type', ['entity.name.type', 'entity.name.class', 'entity.other.inherited-class', 'entity.name.type.interface', 'support.type', 'support.class', 'storage.type.primitive', 'storage.type.built-in', 'storage.type.numeric.go', 'storage.type.string.go', 'storage.type.java', 'storage.type.cs'], p.cyan, 'italic'),
    rule('@module, @constructor', ['entity.name.namespace', 'entity.name.module', 'entity.name.type.module', 'entity.name.type.namespace', 'entity.name.function.constructor', 'new.expr entity.name.type'], p.cyan, ''),
    rule('@property, overriding Type for keys', ['support.type.property-name', 'meta.object-literal.key'], p.fg, ''),

    rule('@attribute', ['meta.decorator', 'punctuation.decorator', 'entity.name.function.decorator', 'meta.attribute', 'storage.type.annotation', 'punctuation.definition.annotation'], p.orange, 'italic'),
    rule('@tag', ['entity.name.tag'], p.red, ''),
    rule('@tag.attribute', ['entity.other.attribute-name'], p.orange, 'italic'),
    rule('@tag.delimiter', ['punctuation.definition.tag'], p.comment),

    rule('@markup.heading', ['markup.heading', 'entity.name.section', 'markup.heading punctuation.definition.heading'], p.yellow, 'bold'),
    rule('@markup.strong', ['markup.bold'], undefined, 'bold'),
    rule('@markup.italic', ['markup.italic'], undefined, 'italic'),
    rule('@markup.strikethrough', ['markup.strikethrough'], undefined, 'strikethrough'),
    rule('@markup.link', ['string.other.link', 'markup.underline.link.image'], p.blue, 'underline'),
    rule('@markup.link.url', ['markup.underline.link'], p.cyan, 'underline'),
    rule('@markup.raw', ['markup.inline.raw', 'markup.fenced_code', 'markup.raw'], p.green, ''),
    rule('@markup.list', ['punctuation.definition.list.begin', 'beginning.punctuation.definition.list'], p.red),
    rule('@markup.quote', ['markup.quote'], p.comment, 'italic'),

    rule('@diff.plus', ['markup.inserted', 'punctuation.definition.inserted'], p.green),
    rule('@diff.minus', ['markup.deleted', 'punctuation.definition.deleted'], p.red),
    rule('@diff.delta', ['markup.changed', 'punctuation.definition.changed', 'meta.diff.range'], p.orange),

    rule('Error', ['invalid', 'invalid.illegal'], p.red, 'bold'),
    rule('@lsp.mod.deprecated', ['invalid.deprecated'], undefined, 'strikethrough'),
  ];
}

// The @lsp.type.* and @lsp.typemod.* groups.
function semantic(p) {
  const italic = (foreground) => ({ foreground, italic: true });
  return {
    'class': italic(p.cyan),
    'class.defaultLibrary': italic(p.cyan),
    'decorator': italic(p.orange),
    'enum': italic(p.cyan),
    'enumMember': p.magenta,
    'function': p.green,
    'function.defaultLibrary': italic(p.green),
    'interface': italic(p.cyan),
    'macro': p.green,
    'method': p.green,
    'namespace': p.cyan,
    'parameter': italic(p.fg),
    'property': p.fg,
    'struct': italic(p.cyan),
    'type': italic(p.cyan),
    'typeParameter': italic(p.cyan),
    'variable': p.fg,
    'variable.readonly': p.magenta,
    'variable.defaultLibrary': italic(p.red),
    '*.deprecated': { strikethrough: true },
  };
}

// Kyoto Icons: Seti's icons, all in the off-white (fg_bright). Seti's blue, cyan and violet
// icons clash with the yellow tab for protanomaly. Seti gives every icon two definitions, `_name`
// for dark themes and `_name_light` for light ones, so the first take Evening's fg_bright and the
// second Morning's.
function icons(dark, light) {
  const seti = JSON.parse(readFileSync(new URL('./icons/seti/vs-seti-icon-theme.json', import.meta.url), 'utf8'));
  delete seti.information_for_contributors;
  for (const [id, def] of Object.entries(seti.iconDefinitions)) {
    if (!def.fontColor) continue; // _todo, which takes the text colour
    def.fontColor = (id.endsWith('_light') ? light : dark).fg_bright;
  }
  seti.fonts[0].src[0].path = './seti.woff';
  return seti;
}

const byType = Object.fromEntries(Object.values(palettes).map((p) => [p.type, p]));
writeFileSync(
  new URL('./icons/kyoto-icon-theme.json', import.meta.url),
  JSON.stringify(icons(byType.dark, byType.light), null, 2) + '\n',
);
console.log('wrote icons/kyoto-icon-theme.json');

mkdirSync(new URL('./themes/', import.meta.url), { recursive: true });
for (const [name, p] of Object.entries(palettes)) {
  const theme = {
    $schema: 'vscode://schemas/color-theme',
    name,
    type: p.type,
    semanticHighlighting: true,
    colors: workbench(p),
    tokenColors: tokens(p),
    semanticTokenColors: semantic(p),
  };
  writeFileSync(new URL('./themes/' + p.file, import.meta.url), JSON.stringify(theme, null, 2) + '\n');
  console.log('wrote themes/' + p.file);
}
