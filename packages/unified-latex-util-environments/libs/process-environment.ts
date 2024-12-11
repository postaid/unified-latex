import * as Ast from "@vizex_ru/unified-latex-types";
import { EnvInfo, EnvInfoRecord } from "@vizex_ru/unified-latex-types";
import { updateRenderInfo } from "@vizex_ru/unified-latex-util-render-info";
import { gobbleArguments } from "@vizex_ru/unified-latex-util-arguments";
import { match } from "@vizex_ru/unified-latex-util-match";
import { visit } from "@vizex_ru/unified-latex-util-visit";
import { printRaw } from "@vizex_ru/unified-latex-util-print-raw";

/**
 * Performs any needed processing on the environment (as specified by `envInfo`)
 * including attaching arguments and possibly manipulating the environment's body.
 */
export function processEnvironment(envNode: Ast.Environment, envInfo: EnvInfo) {
    if (envInfo.signature && envNode.args == null) {
        const { args } = gobbleArguments(envNode.content, envInfo.signature);
        envNode.args = args;
    }

    updateRenderInfo(envNode, envInfo.renderInfo);
    if (typeof envInfo.processContent === "function") {
        envNode.content = envInfo.processContent(envNode.content);
    }
}

/**
 * Recursively search for and process the specified environments. Arguments are
 * consumed according to the `signature` specified. The body is processed
 * with the specified `processContent` function (if given). Any specified `renderInfo`
 * is attached to the environment node.
 */
export function processEnvironments(
    tree: Ast.Ast,
    environments: EnvInfoRecord
) {
    const isRelevantEnvironment = match.createEnvironmentMatcher(environments);

    visit(
        tree,
        {
            leave: (node) => {
                const envName = printRaw(node.env);
                const envInfo = environments[envName];
                if (!envInfo) {
                    throw new Error(
                        `Could not find environment info for environment "${envName}"`
                    );
                }
                processEnvironment(node, envInfo);
            },
        },
        { test: isRelevantEnvironment }
    );
}
