"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ManualTransactionPage() {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [type, setType] = useState<"income" | "expense">("expense");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/transactions/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, amount: Number(amount), date, type }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error("failed");
      setMessage("Saved transaction");
      setDescription("");
      setAmount("");
    } catch (e) {
      setMessage("Failed to save");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Add Transaction</h1>
      <div className="space-y-4">
        <div>
          <label className="text-sm mb-1 block">Description</label>
          <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g., Starbucks latte" />
        </div>
        <div>
          <label className="text-sm mb-1 block">Amount</label>
          <Input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g., -250" />
          <p className="text-xs text-neutral-500 mt-1">Use negative for expenses, positive for income.</p>
        </div>
        <div>
          <label className="text-sm mb-1 block">Date</label>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div>
          <label className="text-sm mb-1 block">Type</label>
          <div className="flex gap-3">
            <label className="text-sm flex items-center gap-1">
              <input type="radio" name="type" value="expense" checked={type === "expense"} onChange={() => setType("expense")} />
              Expense
            </label>
            <label className="text-sm flex items-center gap-1">
              <input type="radio" name="type" value="income" checked={type === "income"} onChange={() => setType("income")} />
              Income
            </label>
          </div>
        </div>
        <Button onClick={submit} disabled={loading || !description || !amount}>{loading ? "Saving..." : "Save"}</Button>
        {message && <p className="text-sm">{message}</p>}
      </div>
    </div>
  );
}
