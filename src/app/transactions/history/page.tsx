"use client";
import { useEffect, useState } from "react";

type Item = {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: "income" | "expense";
  category?: string;
};

export default function HistoryPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/transactions/list", { cache: "no-store" });
        const data = await res.json();
        if (!res.ok || !data?.ok) throw new Error("failed");
        setItems(data.items || []);
      } catch (e) {
        setError("Failed to load history");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Transaction History</h1>
      {loading && <p className="text-sm">Loading...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!loading && !items.length && <p className="text-sm">No transactions yet.</p>}
      {!!items.length && (
        <div className="overflow-auto border rounded-md">
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="px-3 py-2 text-left border-b">Date</th>
                <th className="px-3 py-2 text-left border-b">Description</th>
                <th className="px-3 py-2 text-left border-b">Category</th>
                <th className="px-3 py-2 text-right border-b">Amount</th>
                <th className="px-3 py-2 text-left border-b">Type</th>
              </tr>
            </thead>
            <tbody>
              {items.map((t) => (
                <tr key={t.id} className="odd:bg-neutral-50">
                  <td className="px-3 py-2 border-b whitespace-nowrap">{t.date}</td>
                  <td className="px-3 py-2 border-b">{t.description}</td>
                  <td className="px-3 py-2 border-b">{t.category || "-"}</td>
                  <td className="px-3 py-2 border-b text-right">{t.amount.toLocaleString()}</td>
                  <td className="px-3 py-2 border-b">{t.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
