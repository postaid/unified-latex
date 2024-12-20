import { lintRule } from "unified-lint-rule";
import { m, s } from "@vizex_ru/unified-latex-builder";
import { printRaw } from "@vizex_ru/unified-latex-util-print-raw";
import * as Ast from "@vizex_ru/unified-latex-types";
import { match } from "@vizex_ru/unified-latex-util-match";
import { visit } from "@vizex_ru/unified-latex-util-visit";
import { hasParbreak } from "../../utils/has-parbreak";
import { trimEnd, trimStart } from "@vizex_ru/unified-latex-util-trim";
import { colorToTextcolorMacro } from "@vizex_ru/unified-latex-ctan/package/xcolor";
import {
    firstSignificantNode,
    replaceNodeDuringVisit,
    replaceStreamingCommand,
} from "@vizex_ru/unified-latex-util-replace";

const REPLACEMENTS: Record<
    string,
    (content: Ast.Node | Ast.Node[], originalMacro: Ast.Macro) => Ast.Macro
> = {
    color: colorToTextcolorMacro,
};

const isReplaceable = match.createMacroMatcher(REPLACEMENTS);

/**
 * Returns true if the `group` is a group that starts with one of the `REPLACEMENT` macros.
 */
function groupStartsWithMacroAndHasNoParbreak(
    group: Ast.Ast
): group is Ast.Group {
    if (!match.group(group)) {
        return false;
    }
    // Find the first non-whitespace non-comment node
    let firstNode: Ast.Node | null = firstSignificantNode(group.content);
    return isReplaceable(firstNode) && !hasParbreak(group.content);
}

type PluginOptions =
    | {
          /**
           * Whether or not to fix the lint
           *
           * @type {boolean}
           */
          fix?: boolean;
      }
    | undefined;

export const DESCRIPTION = `## Lint Rule

Prefer using fond color commands with arguments (e.g. \`\\textcolor{red}{foo bar}\`) over in-stream color commands
(e.g. \`{\\color{red} foo bar}\`) if the style does not apply for multiple paragraphs.
This rule is useful when parsing LaTeX into other tree structures (e.g., when converting from LaTeX to HTML). 


This rule flags any usage of \`${Object.keys(REPLACEMENTS)
    .map((r) => printRaw(m(r)))
    .join("` `")}\`
`;

export const unifiedLatexLintArgumentColorCommands = lintRule<
    Ast.Root,
    PluginOptions
>(
    { origin: "unified-latex-lint:argument-color-commands" },
    (tree, file, options) => {
        const lintedNodes = new Set();

        // We do two passes. First we deal with all the groups like `{\bfseries xxx}`
        // and then we replace all remaining streaming commands that appear in arrays.

        visit(
            tree,
            (group, info) => {
                const nodes = group.content;
                for (const node of nodes) {
                    if (isReplaceable(node) && !lintedNodes.has(node)) {
                        lintedNodes.add(node);
                        const macroName = node.content;
                        file.message(
                            `Replace "${printRaw(group)}" with "${printRaw(
                                REPLACEMENTS[macroName](s("..."), node)
                            )}"`,
                            node
                        );
                        break;
                    }
                }

                if (options?.fix) {
                    let fixed = replaceStreamingCommand(
                        group,
                        isReplaceable,
                        (content, command) => {
                            return REPLACEMENTS[command.content](
                                content,
                                command
                            );
                        }
                    );

                    // We cannot replace the node unless we can access the containing array.
                    if (!info.containingArray || info.index == null) {
                        return;
                    }

                    // `fixed` may consist of only whitespace. If this is the case,
                    // surrounding whitespace must trimmed before
                    // inserting the group's contents.
                    const prevToken = info.containingArray[info.index - 1];
                    const nextToken = info.containingArray[info.index + 1];
                    if (
                        match.whitespaceLike(prevToken) &&
                        match.whitespaceLike(fixed[0])
                    ) {
                        trimStart(fixed);
                    }
                    if (
                        match.whitespaceLike(nextToken) &&
                        match.whitespaceLike(fixed[fixed.length - 1])
                    ) {
                        trimEnd(fixed);
                    }
                    replaceNodeDuringVisit(fixed, info);
                }
            },
            { test: groupStartsWithMacroAndHasNoParbreak }
        );

        visit(
            tree,
            (nodes) => {
                if (hasParbreak(nodes)) {
                    return;
                }

                let hasReplaceableContent = false;
                for (const node of nodes) {
                    if (isReplaceable(node) && !lintedNodes.has(node)) {
                        lintedNodes.add(node);
                        hasReplaceableContent = true;
                        const macroName = node.content;
                        file.message(
                            `Replace "${printRaw(nodes)}" with "${printRaw(
                                REPLACEMENTS[macroName](s("..."), node)
                            )}"`,
                            node
                        );
                    }
                }

                if (hasReplaceableContent && options?.fix) {
                    // In an array replacements happen in-place
                    replaceStreamingCommand(
                        nodes,
                        isReplaceable,
                        (content, command) => {
                            return REPLACEMENTS[command.content](
                                content,
                                command
                            );
                        }
                    );
                }
            },
            { includeArrays: true, test: Array.isArray }
        );
    }
);
