import * as Ast from "@vizex_ru/unified-latex-types";
import { match } from "@vizex_ru/unified-latex-util-match";

/**
 * Splits all multi-character strings into strings that are all single characters.
 */
export function splitStringsIntoSingleChars(nodes: Ast.Node[]): Ast.Node[] {
    return nodes.flatMap((node) =>
        match.anyString(node)
            ? (Array.from(node.content).map((c) => ({
                  type: "string",
                  content: c,
              })) as Ast.Node[])
            : node
    );
}
