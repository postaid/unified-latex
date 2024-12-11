/**
 * This is a test file to make sure that the unified-latex imports are working.
 */
const { getParser } = require("@vizex_ru/unified-latex-util-parse");
const { printRaw } = require("@vizex_ru/unified-latex-util-print-raw");
const { toString } = require("@vizex_ru/unified-latex-util-to-string");
// Test import to see if it works to import a specific rule
const {
    unifiedLatexLintPreferSetlength,
} = require("@vizex_ru/unified-latex-lint/rules/unified-latex-lint-prefer-setlength");
const { macros } = require("@vizex_ru/unified-latex-ctan/package/latex2e");

const content = String.raw`
\begin{env}
    $\mathbf x$
    \section{section title}
    this is an embedded source.
\end{env}
`;
const parser = getParser();
const parsedAst = parser.parse(content.toString());

console.log("Raw Print:");
console.log(printRaw(parsedAst), "\n");

console.log("Pretty Print:");
console.log(toString(parsedAst), "\n");
