import * as Ast from "@vizex_ru/unified-latex-types";
import { match } from "@vizex_ru/unified-latex-util-match";
import { replaceNode } from "@vizex_ru/unified-latex-util-replace";

/**
 * Returns a new AST with all comments removed. Care is taken to preserve whitespace.
 * For example
 * ```
 * x%
 * y
 * ```
 * becomes `xy` but
 * ```
 * x %
 * y
 * ```
 * becomes `x y`
 */
export function deleteComments(ast: Ast.Ast) {
    return replaceNode(ast, (node) => {
        if (!match.comment(node)) {
            return;
        }

        if (node.leadingWhitespace) {
            return { type: "whitespace" };
        }

        return null;
    });
}
