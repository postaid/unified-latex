import util from "util";
import * as Ast from "@vizex_ru/unified-latex-types";
import {
    findExpl3AndAtLetterRegionsInArray,
    reparseExpl3AndAtLetterRegions,
} from "../libs/special-regions";

import { strToNodesMinimal } from "../../test-common";
import { match } from "@vizex_ru/unified-latex-util-match";

/* eslint-env jest */

// Make console.log pretty-print by default
export const origLog = console.log;
console.log = (...args) => {
    origLog(...args.map((x) => util.inspect(x, false, 10, true)));
};

describe("unified-latex-utils-catcode", () => {
    it("Can find \\ExplSyntaxOn and \\makeatletter regions", () => {
        let parsed = strToNodesMinimal(
            "a b \\makeatletter c d \\makeatother e f"
        );
        let found = findExpl3AndAtLetterRegionsInArray(parsed);
        expect(found).toEqual({
            atLetterOnly: [{ end: 11, start: 4 }],
            both: [],
            explOnly: [],
        });

        parsed = strToNodesMinimal(
            "a b \\ExplSyntaxOn c d \\ExplSyntaxOff e f"
        );
        found = findExpl3AndAtLetterRegionsInArray(parsed);
        expect(found).toEqual({
            explOnly: [{ end: 11, start: 4 }],
            both: [],
            atLetterOnly: [],
        });

        parsed = strToNodesMinimal("a b c d \\ExplSyntaxOff e f");
        found = findExpl3AndAtLetterRegionsInArray(parsed);
        expect(found).toEqual({
            explOnly: [],
            both: [],
            atLetterOnly: [],
        });

        parsed = strToNodesMinimal(
            "a b \\makeatletter\\ExplSyntaxOn c d \\ExplSyntaxOff\\makeatother e f"
        );
        found = findExpl3AndAtLetterRegionsInArray(parsed);
        expect(found).toEqual({
            atLetterOnly: [],
            both: [{ end: 12, start: 5 }],
            explOnly: [],
        });

        parsed = strToNodesMinimal(
            "a b \\makeatletter\\ExplSyntaxOn c d \\makeatother\\ExplSyntaxOff e f"
        );
        found = findExpl3AndAtLetterRegionsInArray(parsed);
        expect(found).toEqual({
            atLetterOnly: [],
            both: [{ end: 12, start: 5 }],
            explOnly: [],
        });
    });
    it("Can reparse ExplSyntaxOn and \\makeatletter regions", () => {
        let matcher = match.createMacroMatcher(["c@b", "c_b", "c_b:N"]);

        let parsed: Ast.Node[];
        parsed = strToNodesMinimal(
            "a \\c@b b \\makeatletter \\c@b d \\makeatother e f"
        );
        expect(parsed.filter(matcher)).toHaveLength(0);
        reparseExpl3AndAtLetterRegions(parsed);
        expect(parsed.filter(matcher)).toHaveLength(1);

        parsed = strToNodesMinimal(
            "a \\c@b b \\ExplSyntaxOn\\makeatletter \\c_b d \\makeatother e f"
        );
        expect(parsed.filter(matcher)).toHaveLength(0);
        reparseExpl3AndAtLetterRegions(parsed);
        expect(parsed.filter(matcher)).toHaveLength(1);

        parsed = strToNodesMinimal(
            "a \\c@b b \\ExplSyntaxOn \\c@b \\c_b:N \\makeatletter \\c@b \\c_b d \\makeatother e f \\c@b x \\c_b"
        );
        expect(parsed.filter(matcher)).toHaveLength(0);
        reparseExpl3AndAtLetterRegions(parsed);
        expect(parsed.filter(matcher)).toHaveLength(4);
    });
});
