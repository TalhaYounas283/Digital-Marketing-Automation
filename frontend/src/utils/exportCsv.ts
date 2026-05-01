type Primitive = string | number | boolean | null | undefined;

const escapeCell = (value: Primitive): string => {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

const triggerDownload = (content: string, filename: string, mime: string) => {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export const exportToCsv = <T extends Record<string, Primitive>>(
  rows: T[],
  filename: string,
  columns?: { key: keyof T; label?: string }[],
): number => {
  if (!rows.length) {
    triggerDownload("", filename, "text/csv;charset=utf-8");
    return 0;
  }

  const cols =
    columns ??
    (Object.keys(rows[0]) as (keyof T)[]).map((key) => ({ key, label: String(key) }));

  const header = cols.map((c) => escapeCell(c.label ?? String(c.key))).join(",");
  const body = rows
    .map((row) => cols.map((c) => escapeCell(row[c.key])).join(","))
    .join("\n");

  triggerDownload(`${header}\n${body}\n`, filename, "text/csv;charset=utf-8");
  return rows.length;
};

export const exportToJson = <T>(data: T, filename: string): void => {
  triggerDownload(
    JSON.stringify(data, null, 2),
    filename,
    "application/json;charset=utf-8",
  );
};

export const stampedFilename = (base: string, extension: string): string => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${base}_${yyyy}-${mm}-${dd}.${extension}`;
};
