"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <section className="px-6 py-20 sm:py-28 max-w-4xl mx-auto text-center">
        <p className="text-xs tracking-widest uppercase text-neutral-500 mb-3">Welcome to</p>
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight">Finmate AI</h1>
        <p className="mt-4 text-neutral-600 dark:text-neutral-300">
          Manage your money wisely with a personal AI that helps you stay on top of cash flow, spending, and savings.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link href="/signin"><Button>Sign in</Button></Link>
          <Button variant="outline" onClick={() => { try { (window as any).dispatchEvent(new Event("finmate:open-chat")); } catch {} }}>Chat with Finmate AI</Button>
        </div>
        <p className="mt-6 text-xs text-neutral-500">
          After you sign in, your dashboard will show insights, history, and tools.
        </p>
      </section>
    </div>
  );
}
