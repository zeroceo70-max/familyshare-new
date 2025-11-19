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
  const [msg, setMsg] = useState("");

  // Check session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    try {
      const { error } = isLogin
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

      if (error) throw error;
      if (!isLogin) setMsg("Check your email to confirm!");
    } catch (err: any) {
      setMsg(err.message);
    }
  };

  const handleSignOut = async () => {
    setMsg("Signing out...");
    await supabase.auth.signOut();
    // Force full reload to clear everything
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-3xl">
        Loading...
      </div>
    );
  }

  // LOGGED IN → Dashboard
  if (user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 text-center p-8">
        <h1 className="text-6xl font-bold mb-6">Welcome back!</h1>
        <p className="text-3xl text-green-600 mb-4">FamilyShare is LIVE</p>
        <p className="text-2xl mb-8">
          Logged in as <strong>{user.email}</strong>
        </p>
        {msg && <p className="mb-4 text-orange-600">{msg}</p>}
        <button
          onClick={handleSignOut}
          className="rounded-2xl bg-red-600 px-12 py-6 text-2xl font-bold text-white hover:bg-red-700"
        >
          Sign Out
        </button>
      </div>
    );
  }

  // LOGGED OUT → Beautiful Landing Page + Auth Form
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 p-6">
      <div className="w-full max-w-4xl text-center">
        <h1 className="mb-8 text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500">
          FamilyShare
        </h1>
        <p className="mb-12 text-3xl">
          The only family locator that requires{" "}
          <span className="font-bold text-blue-600">explicit consent</span> every time
        </p>

        <div className="mx-auto max-w-md rounded-3xl bg-white p-10 shadow-2xl">
          <h2 className="mb-8 text-4xl font-bold">
            {isLogin ? "Welcome Back" : "Join Free"}
          </h2>

          <form onSubmit={handleAuth} className="space-y-6">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-green-600 py-5 text-xl font-bold text-white"
            >
              {isLogin ? "Log In" : "Create Account"}
            </button>
          </form>

          {msg && <p className="mt-4 text-red-600">{msg}</p>}

          <button
            onClick={() => setIsLogin(!isLogin)}
            className="mt-6 text-blue-600 font-bold hover:underline"
          >
            {isLogin ? "No account? Sign up" : "Have account? Log in"}
          </button>
        </div>

        <p className="mt-20 text-lg text-gray-600">
          Built with love • 2025 • Zero surveillance
        </p>
      </div>
    </div>
  );
}
