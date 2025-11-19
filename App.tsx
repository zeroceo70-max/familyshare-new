import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    isLogin
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });
  };

  if (loading) return null; // Prevents flash of dashboard

  if (user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 text-center">
        <h1 className="mb-8 text-6xl font-bold">Welcome back!</h1>
        <p className="mb-4 text-3xl text-green-600">FamilyShare is LIVE</p>
        <p className="mb-10 text-2xl">Logged in as <strong>{user.email}</strong></p>
        <button
          onClick={() => supabase.auth.signOut()}
          className="rounded-2xl bg-red-600 px-12 py-6 text-2xl font-bold text-white hover:bg-red-700"
        >
          Sign Out
        </button>
      </div>
    );
  }

  // ←←← THIS IS YOUR LANDING PAGE (shows first)
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 p-6">
      <div className="w-full max-w-4xl text-center">
        <h1 className="mb-8 text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500">
          FamilyShare
        </h1>
        <p className="mb-12 text-3xl">
          The only family locator that requires <span className="font-bold text-blue-600">explicit consent</span> every time
        </p>

        <div className="mx-auto max-w-md rounded-3xl bg-white p-10 shadow-2xl">
          <h2 className="mb-8 text-4xl font-bold">{isLogin ? "Welcome Back" : "Join Free"}</h2>
          <form onSubmit={handleAuth} className="space-y-6">
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full rounded-xl border px-6 py-4 text-lg" />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full rounded-xl border px-6 py-4 text-lg" />
            <button type="submit" className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-green-600 py-5 text-xl font-bold text-white">
              {isLogin ? "Log In" : "Create Account"}
            </button>
          </form>
          <button onClick={() => setIsLogin(!isLogin)} className="mt-6 block text-blue-600 font-bold">
            {isLogin ? "No account? Sign up" : "Have account? Log in"}
          </button>
        </div>

        <p className="mt-20 text-lg text-gray-600">Built with love • 2025 • Zero surveillance</p>
      </div>
    </div>
  );
}
