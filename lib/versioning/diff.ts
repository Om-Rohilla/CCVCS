import { DiffLine } from "@/lib/types";

const MAX_LINES = 500;

export const buildLineDiff = (beforeText: string, afterText: string) => {
  const before = beforeText.split(/\r?\n/);
  const after = afterText.split(/\r?\n/);
  const length = Math.max(before.length, after.length, 1);
  const lines: DiffLine[] = [];

  let added = 0;
  let removed = 0;
  let changed = 0;
  let unchanged = 0;

  for (let index = 0; index < Math.min(length, MAX_LINES); index += 1) {
    const beforeLine = before[index] ?? "";
    const afterLine = after[index] ?? "";

    if (!before[index] && after[index]) {
      added += 1;
      lines.push({
        lineNumber: index + 1,
        type: "added",
        before: "",
        after: afterLine,
      });
      continue;
    }

    if (before[index] && !after[index]) {
      removed += 1;
      lines.push({
        lineNumber: index + 1,
        type: "removed",
        before: beforeLine,
        after: "",
      });
      continue;
    }

    if (beforeLine !== afterLine) {
      changed += 1;
      lines.push({
        lineNumber: index + 1,
        type: "changed",
        before: beforeLine,
        after: afterLine,
      });
      continue;
    }

    unchanged += 1;
    lines.push({
      lineNumber: index + 1,
      type: "unchanged",
      before: beforeLine,
      after: afterLine,
    });
  }

  return {
    summary: { added, removed, changed, unchanged },
    lines,
    truncated: length > MAX_LINES,
  };
};
