"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.ok) {
      router.push("/dashboard");
    } else {
      setError("Invalid email or password");
    }
  }

  async function handleGoogle() {
    await signIn("google", { callbackUrl: "/dashboard" });
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Sign in</h1>
      <form onSubmit={handleCredentials} className="space-y-4">
        <div>
          <label className="text-sm mb-1 block">Email</label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="text-sm mb-1 block">Password</label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={loading}>{loading ? "Signing in..." : "Continue"}</Button>
      </form>
      <div className="h-px bg-neutral-200" />
      <Button variant="outline" onClick={handleGoogle}>Continue with Google</Button>
      <p className="text-xs text-neutral-500">
        Demo credentials: demo@cognicash.app / password123
      </p>
    </div>
  );
}
