<!-- DO NOT MODIFY -->
<!-- This file was autogenerated by build-docs.ts -->
<!-- Edit the docstring in index.ts and regenerate -->
<!-- rather than editing this file directly. -->
# unified-latex-util-to-string

## What is this?

Functions parse strings to a `unified-latex` Abstract Syntax Tree (AST).

## When should I use this?

If you have a string that you would like to parse to a `unified-latex` `Ast.Ast`, or
if you are building a plugin for `unified()` that manipulates LaTeX.

## Install

```bash
npm install @vizex_ru/unified-latex-util-to-string
```

This package contains both esm and commonjs exports. To explicitly access the esm export,
import the `.js` file. To explicitly access the commonjs export, import the `.cjs` file.

# Plugins

## `unifiedLatexStringCompiler`

Unified complier plugin that prints a LaTeX AST as a string.

### Usage

`unified().use(unifiedLatexStringCompiler[, options])`

#### options

```typescript
{ pretty?: boolean; printWidth?: number; useTabs?: boolean; forceNewlineEnding?: boolean; }
```

### Type

`Plugin<{ pretty?: boolean; printWidth?: number; useTabs?: boolean; forceNewlineEnding?: boolean; }[], Ast.Root, string>`

```typescript
function unifiedLatexStringCompiler(options: {
  pretty?: boolean;
  printWidth?: number;
  useTabs?: boolean;
  forceNewlineEnding?: boolean;
}): void;
```

# Functions

## `toString(ast)`

Convert an AST into a string, pretty-printing the result. If you want more control
over the formatting (e.g. spaces/tabs, etc.) use `unified().use(unifiedLatexStringCompiler, options)`
directly.

```typescript
function toString(ast: Ast.Ast): string;
```

**Parameters**

| Param | Type      |
| :---- | :-------- |
| ast   | `Ast.Ast` |

# Types

## `PluginOptions`

```typescript
export type PluginOptions =
    | {
          pretty?: boolean;
          printWidth?: number;
          useTabs?: boolean;
          /**
           * If true, formatted code always ends with a newline character.
           */
          forceNewlineEnding?: boolean;
      }
    | undefined;
```
