import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <section className="px-6 py-16 sm:py-24 max-w-6xl mx-auto">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-xs tracking-widest uppercase text-neutral-500 mb-3">Financial Wellness</p>
            <h1 className="text-3xl sm:text-5xl font-bold leading-tight">
              68% of gig workers lack emergency savings.
            </h1>
            <p className="mt-4 text-neutral-600 dark:text-neutral-300">
              Cognicash helps you stabilize cash flow, reduce overspending, and build savings with
              personalized micro-actions and nudges.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/api/auth/signin"><Button>Sign in</Button></Link>
              <Link href="/transactions/import"><Button variant="outline">Import CSV</Button></Link>
            </div>
            <p className="mt-3 text-xs text-neutral-500">
              Based on Prospect Theory, Mental Accounting, and CFPB wellness metrics.
            </p>
          </div>
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Cashflow Forecast (30 days)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-24 bg-neutral-50 dark:bg-neutral-900 rounded-md flex items-center justify-center text-xs text-neutral-500">
                  Chart placeholder
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Top Micro-Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm list-disc pl-5 space-y-1">
                  <li>Move ₹200 to savings today (confidence 0.72)</li>
                  <li>Cap dining to ₹1,500/week (expected impact ₹600/mo)</li>
                  <li>Auto-pay utility bill to avoid late fees</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="px-6 pb-20 max-w-6xl mx-auto grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Private by Design</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-neutral-600 dark:text-neutral-300">
            Client-side analytics (TF.js) and on-device OCR where possible.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Explainable AI</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-neutral-600 dark:text-neutral-300">
            Every recommendation includes rationale, confidence, and expected impact.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Built for Irregular Income</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-neutral-600 dark:text-neutral-300">
            Tailored to gig and flexible workers with volatile cashflows.
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
