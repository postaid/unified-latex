<!-- DO NOT MODIFY -->
<!-- This file was autogenerated by build-docs.ts -->
<!-- Edit the docstring in index.ts and regenerate -->
<!-- rather than editing this file directly. -->
# unified-latex-util-packages

## What is this?

Functions for reporting on imported packages in a `unified-latex` Abstract Syntax Tree (AST).

## When should I use this?

If you are building a linter or some other system that needs to know which packages have been included
via `\usepackage{...}` or `\RequirePackage{...}`.

## Install

```bash
npm install @vizex_ru/unified-latex-util-packages
```

This package contains both esm and commonjs exports. To explicitly access the esm export,
import the `.js` file. To explicitly access the commonjs export, import the `.cjs` file.

# Functions

## `listPackages(tree)`

List all packages referenced via `\includepackage{...}` or `\RequirePackage{...}`

```typescript
function listPackages(tree: Ast.Ast): Ast.String[];
```

**Parameters**

| Param | Type      |
| :---- | :-------- |
| tree  | `Ast.Ast` |
