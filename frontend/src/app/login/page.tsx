"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, LockKeyhole, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isReady, login } = useAuth();
  const [formData, setFormData] = useState({
    login: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isReady && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isReady, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(formData);
      router.replace("/dashboard");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to log in right now.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_38%),linear-gradient(180deg,#f8fbfa_0%,#ffffff_52%,#f6f7fb_100%)]">
      <div className="site-shell flex min-h-screen items-center py-16">
        <div className="grid w-full gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-[2.5rem] bg-gray-900 p-10 text-white shadow-2xl">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-300">
              Account Access
            </p>
            <h1 className="mt-4 text-4xl font-black tracking-tight">
              Log in to manage your short links
            </h1>
            <p className="mt-5 max-w-xl text-sm font-bold leading-relaxed text-slate-300">
              Your dashboard shows every link you created, total views, active
              status, and the personal API key you can use with the AroLinks-style
              `/api` endpoint.
            </p>
            <div className="mt-8 grid gap-4">
              {[
                "Create links from the Shortener page after login.",
                "Use your API key to generate links from external tools.",
                "Track clicks, latest visit time, and top-performing links.",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-bold text-slate-200"
                >
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-[0_18px_45px_rgba(0,0,0,0.05)] md:p-10">
            <div className="mb-8">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#10B981]">
                Welcome Back
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-gray-900">
                Sign in with username or email
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Username or Email
                </label>
                <div className="flex items-center rounded-2xl border-2 border-transparent bg-gray-50 px-5 focus-within:border-[#10B981] focus-within:bg-white">
                  <Mail size={18} className="text-gray-400" />
                  <input
                    required
                    type="text"
                    value={formData.login}
                    onChange={(event) =>
                      setFormData({ ...formData, login: event.target.value })
                    }
                    placeholder="creator@example.com"
                    className="w-full bg-transparent px-4 py-5 text-sm font-bold outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Password
                </label>
                <div className="flex items-center rounded-2xl border-2 border-transparent bg-gray-50 px-5 focus-within:border-[#10B981] focus-within:bg-white">
                  <LockKeyhole size={18} className="text-gray-400" />
                  <input
                    required
                    type="password"
                    value={formData.password}
                    onChange={(event) =>
                      setFormData({ ...formData, password: event.target.value })
                    }
                    placeholder="Your password"
                    className="w-full bg-transparent px-4 py-5 text-sm font-bold outline-none"
                  />
                </div>
              </div>

              {error ? (
                <p className="text-[11px] font-black uppercase tracking-widest text-red-500">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gray-900 py-5 text-xs font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-black disabled:opacity-60"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : null}
                {loading ? "Signing In..." : "Login"}
              </button>
            </form>

            <p className="mt-6 text-sm font-bold text-gray-500">
              Need a new account?{" "}
              <Link href="/register" className="text-[#10B981]">
                Register here
              </Link>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

