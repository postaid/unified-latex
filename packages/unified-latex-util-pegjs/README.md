<!-- DO NOT MODIFY -->
<!-- This file was autogenerated by build-docs.ts -->
<!-- Edit the docstring in index.ts and regenerate -->
<!-- rather than editing this file directly. -->
# unified-latex-util-pegjs

## What is this?

Pegjs grammars to help parse strings into a `unified-latex` Abstract Syntax Tree (AST). Note,
because of the dynamic nature of LaTeX, to get a full AST with arguments attached to macros, etc.,
the tree is parsed multiple times.

Also included are functions to decorate a `Ast.Node[]` array so that Pegjs can process it as if it were
a string. This allows for complex second-pass parsing.

## When should I use this?

If you are building libraries to parse specific LaTeX syntax (e.g., to parse `tabular` environments or
`systeme` environments, etc.).

## Install

```bash
npm install @vizex_ru/unified-latex-util-pegjs
```

This package contains both esm and commonjs exports. To explicitly access the esm export,
import the `.js` file. To explicitly access the commonjs export, import the `.cjs` file.

# Functions

## `decorateArrayForPegjs(array)`

Pegjs operates on strings. However, strings and arrays are very similar!
This function adds `charAt`, `charCodeAt`, and `substring` methods to
`array` so that `array` can then be fed to a Pegjs generated parser.

```typescript
function decorateArrayForPegjs(array: any[]): StringlikeArray;
```

**Parameters**

| Param | Type    |
| :---- | :------ |
| array | `any[]` |

## `splitStringsIntoSingleChars(nodes)`

Splits all multi-character strings into strings that are all single characters.

```typescript
function splitStringsIntoSingleChars(nodes: Ast.Node[]): Ast.Node[];
```

**Parameters**

| Param | Type         |
| :---- | :----------- |
| nodes | `Ast.Node[]` |
