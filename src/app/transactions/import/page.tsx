"use client";
import { useState } from "react";
import Papa from "papaparse";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Row = Record<string, string>;

export default function ImportTransactionsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function handleFile(file: File) {
    setMessage(null);
    Papa.parse<Row>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setRows(results.data.filter(Boolean));
      },
    });
  }

  async function handleSubmit() {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/transactions/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows }),
      });
      if (!res.ok) throw new Error("failed");
      setMessage("Imported successfully");
      setRows([]);
    } catch {
      setMessage("Import failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Import Transactions (CSV)</h1>
      <div className="flex items-center gap-3">
        <Input type="file" accept=".csv" onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }} />
        <Button onClick={handleSubmit} disabled={!rows.length || loading}>{loading ? "Importing..." : "Import"}</Button>
      </div>
      {message && <p className="text-sm">{message}</p>}
      {!!rows.length && (
        <div className="overflow-auto border rounded-md">
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                {Object.keys(rows[0]).map((k) => (
                  <th key={k} className="px-3 py-2 text-left border-b">{k}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 50).map((r, i) => (
                <tr key={i} className="odd:bg-neutral-50">
                  {Object.keys(rows[0]).map((k) => (
                    <td key={k} className="px-3 py-2 border-b">{r[k]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length > 50 && <div className="p-2 text-xs">Showing first 50 of {rows.length}</div>}
        </div>
      )}
    </div>
  );
}
