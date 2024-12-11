import {
    MacroInfoRecord,
    EnvInfoRecord,
} from "@vizex_ru/unified-latex-types";
import { argumentParser } from "./libs/argument-parser";

export const macros: MacroInfoRecord = {
    lstset: { signature: "m" },
    lstinline: { argumentParser: argumentParser },
    lstinputlisting: { signature: "o m" },
    lstdefinestyle: { signature: "m m" },
    lstnewenvironment: { signature: "m o o m m" },
    lstMakeShortInline: { signature: "o m" },
    lstDeleteShortInline: { signature: "m" },
    lstdefineformat: { signature: "m m" },
    lstdefinelanguage: { signature: "o m o m o" },
    lstalias: { signature: "o m o m" },
    lstloadlanguages: { signature: "m" },
};

export const environments: EnvInfoRecord = {};
