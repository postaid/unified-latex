import { arg } from "@vizex_ru/unified-latex-builder";
import { Argument, ArgumentParser } from "@vizex_ru/unified-latex-types";
import { parse as parseArgspec } from "@vizex_ru/unified-latex-util-argspec";
import { Node } from "@vizex_ru/unified-latex-util-argspec/libs/argspec-types";
import { gobbleSingleArgument } from "@vizex_ru/unified-latex-util-arguments";
import { match } from "@vizex_ru/unified-latex-util-match";

const argSpecM = parseArgspec("m")[0];
const argSpecO = parseArgspec("o")[0];
const argSpecRDelim: { [delim: string]: Node } = {};

/**
 * This argument parser parses arguments in the form of
 * - [⟨key=value list⟩]⟨character⟩⟨source code⟩⟨same character⟩
 * - [⟨key=value list⟩]{⟨source code⟩}
 */
export const argumentParser: ArgumentParser = (nodes, startPos) => {
    const { argument: optionalArg, nodesRemoved: optionalArgNodesRemoved } =
        gobbleSingleArgument(nodes, argSpecO, startPos);

    let codeArg: Argument | Argument[] | null = null;
    let codeArgNodesRemoved: number = 0;
    const nextNode = nodes[startPos];
    if (match.group(nextNode)) {
        const mandatoryArg = gobbleSingleArgument(nodes, argSpecM, startPos);
        codeArg = mandatoryArg.argument;
        codeArgNodesRemoved = mandatoryArg.nodesRemoved;
    } else if (match.string(nextNode) && nextNode.content.length === 1) {
        const delim = nextNode.content;
        argSpecRDelim[delim] =
            argSpecRDelim[delim] || parseArgspec(`r${delim}${delim}`)[0];
        const delimArg = gobbleSingleArgument(
            nodes,
            argSpecRDelim[delim],
            startPos
        );
        codeArg = delimArg.argument;
        codeArgNodesRemoved = delimArg.nodesRemoved;
    }

    return {
        args: [optionalArg || arg(null), codeArg || arg(null)],
        nodesRemoved: optionalArgNodesRemoved + codeArgNodesRemoved,
    };
};
