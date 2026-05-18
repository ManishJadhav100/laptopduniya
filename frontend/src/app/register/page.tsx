"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { KeyRound, Loader2, Mail, User2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { isAuthenticated, isReady, register } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      router.replace("/dashboard");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to create your account right now.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.18),_transparent_36%),linear-gradient(180deg,#fbfcff_0%,#ffffff_45%,#f8fbfa_100%)]">
      <div className="site-shell flex min-h-screen items-center py-16">
        <div className="grid w-full gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-[0_18px_45px_rgba(0,0,0,0.05)] md:p-10">
            <div className="mb-8">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#10B981]">
                Create Account
              </p>
              <h1 className="mt-3 text-3xl font-black tracking-tight text-gray-900">
                Register to unlock the shortener dashboard
              </h1>
              <p className="mt-4 text-sm font-bold leading-relaxed text-gray-500">
                Every new account gets its own API key so the user can create
                short links from the site or through the backend
                endpoint.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Username
                </label>
                <div className="flex items-center rounded-2xl border-2 border-transparent bg-gray-50 px-5 focus-within:border-[#10B981] focus-within:bg-white">
                  <User2 size={18} className="text-gray-400" />
                  <input
                    required
                    type="text"
                    value={formData.username}
                    onChange={(event) =>
                      setFormData({ ...formData, username: event.target.value })
                    }
                    placeholder="linkcreator"
                    className="w-full bg-transparent px-4 py-5 text-sm font-bold outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Email
                </label>
                <div className="flex items-center rounded-2xl border-2 border-transparent bg-gray-50 px-5 focus-within:border-[#10B981] focus-within:bg-white">
                  <Mail size={18} className="text-gray-400" />
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(event) =>
                      setFormData({ ...formData, email: event.target.value })
                    }
                    placeholder="creator@example.com"
                    className="w-full bg-transparent px-4 py-5 text-sm font-bold outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Password
                  </label>
                  <div className="flex items-center rounded-2xl border-2 border-transparent bg-gray-50 px-5 focus-within:border-[#10B981] focus-within:bg-white">
                    <KeyRound size={18} className="text-gray-400" />
                    <input
                      required
                      type="password"
                      value={formData.password}
                      onChange={(event) =>
                        setFormData({ ...formData, password: event.target.value })
                      }
                      placeholder="Minimum 8 characters"
                      className="w-full bg-transparent px-4 py-5 text-sm font-bold outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Confirm Password
                  </label>
                  <div className="flex items-center rounded-2xl border-2 border-transparent bg-gray-50 px-5 focus-within:border-[#10B981] focus-within:bg-white">
                    <KeyRound size={18} className="text-gray-400" />
                    <input
                      required
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          confirmPassword: event.target.value,
                        })
                      }
                      placeholder="Repeat password"
                      className="w-full bg-transparent px-4 py-5 text-sm font-bold outline-none"
                    />
                  </div>
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
                {loading ? "Creating..." : "Register"}
              </button>
            </form>

            <p className="mt-6 text-sm font-bold text-gray-500">
              Already have an account?{" "}
              <Link href="/login" className="text-[#10B981]">
                Login here
              </Link>
            </p>
          </section>

          <section className="rounded-[2.5rem] bg-gray-900 p-10 text-white shadow-2xl">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-300">
              Included With Signup
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-tight">
              Personal API key, dashboard metrics, and owner-scoped links
            </h2>
            <div className="mt-8 grid gap-4">
              {[
                "JWT login keeps the shortener actions tied to the signed-in user.",
                "Dashboard highlights your top-performing short code and totals.",
                "API calls using your personal key automatically assign link ownership.",
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
        </div>
      </div>
    </div>
  );
}

