import { unified } from "unified";
import * as Ast from "@vizex_ru/unified-latex-types";
import {
    unifiedLatexAstComplier,
    unifiedLatexFromString,
} from "@vizex_ru/unified-latex-util-parse";
import {
    unifiedLatexStringCompiler,
    PluginOptions as StringCompilerPluginOptions,
} from "@vizex_ru/unified-latex-util-to-string";
/**
 * Use `unified()` to a string to an `Ast.Ast` and then pretty-print it.
 */
export const processLatexViaUnified = (
    options?: StringCompilerPluginOptions
) => {
    return unified()
        .use(
            unifiedLatexFromString,
            Object.assign({ environments: {}, macros: {} }, options)
        )
        .use(
            unifiedLatexStringCompiler,
            Object.assign({ pretty: true, forceNewlineEnding: true }, options)
        );
};

/**
 * Use `unified()` to a string to an `Ast.Ast` and then return it. This function
 * will not print/pretty-print the `Ast.Ast` back to a string.
 */
export const processLatexToAstViaUnified = () => {
    return unified().use(unifiedLatexFromString).use(unifiedLatexAstComplier);
};
