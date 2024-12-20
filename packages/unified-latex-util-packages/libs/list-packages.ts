import * as Ast from "@vizex_ru/unified-latex-types";
import { match } from "@vizex_ru/unified-latex-util-match";
import { visit } from "@vizex_ru/unified-latex-util-visit";
import { processCommaSeparatedList } from "./arguments";

const isUseOrRequirePackageMacro = match.createMacroMatcher([
    "usepackage",
    "RequirePackage",
]);

/**
 * List all packages referenced via `\includepackage{...}` or `\RequirePackage{...}`
 *
 * @param {Ast.Ast} tree
 * @returns {string[]}
 */
export function listPackages(tree: Ast.Ast): Ast.String[] {
    const ret: Ast.String[] = [];
    visit(
        tree,
        (node: Ast.Macro) => {
            if (node.content === "usepackage") {
                // The \usepackage macro has signature []{}
                const packages = processCommaSeparatedList(
                    node.args ? node.args[1].content : []
                );
                ret.push(...packages);
            }
            if (node.content === "RequirePackage") {
                // The \RequirePackage macro has signature []{}
                const packages = processCommaSeparatedList(
                    node.args ? node.args[1].content : []
                );
                ret.push(...packages);
            }
        },
        { test: isUseOrRequirePackageMacro }
    );

    return ret;
}
