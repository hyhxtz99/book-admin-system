import type { WorkBook, WorkSheet } from "xlsx";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export type RowObject = Record<string, unknown>;

export async function exportToExcel(
  rows: RowObject[],
  options: { filename: string; sheetName?: string }
): Promise<void> {
  const sheetName = options.sheetName || "Sheet1";
  const worksheet: WorkSheet = XLSX.utils.json_to_sheet(rows);
  const workbook: WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([wbout], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, ensureXlsxExtension(options.filename));
}

export async function importFromExcel(file: File): Promise<RowObject[]> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const json = XLSX.utils.sheet_to_json<RowObject>(worksheet, { defval: "" });
  return json;
}

export function ensureXlsxExtension(filename: string): string {
  return filename.toLowerCase().endsWith(".xlsx") ? filename : `${filename}.xlsx`;
}




