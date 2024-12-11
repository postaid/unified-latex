import { lints } from "@vizex_ru/unified-latex-lint";

export const availableLints = Object.fromEntries(
    Object.values(lints).map((lint) => [
        lint.name.replace(/^unified-latex-lint:/, ""),
        lint,
    ])
);
