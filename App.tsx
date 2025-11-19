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
  const [message, setMessage] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage("Check your email to confirm!");
      }
    } catch (error: any) {
      setMessage(error.message);
    }
  };

  const signOut = async () => {
    setMessage("Signing out...");
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      // Force redirect even if session lingers
      window.location.href = "/";
    } catch (error: any) {
      console.error("Sign out error:", error);
      setMessage("Forced logout — refreshing...");
      // Fallback: hard reload to clear any stale session
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    }
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center text-4xl">Loading...</div>;

  return user ? (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-10">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-8">Welcome back!</h1>
        <p className="text-3xl text-green-600 mb-4">FamilyShare is 100% LIVE</p>
        <p className="text-2xl mb-6">Logged in as <strong>{user.email}</strong></p>
        {message && <p className="text-xl mb-4 text-orange-600">{message}</p>}
        <button
          onClick={signOut}
          className="cursor-pointer bg-red-600 hover:bg-red-700 active:bg-red-800 text-white px-12 py-6 rounded-2xl text-2xl font-bold transition-all"
        >
          Sign Out
        </button>
      </div>
    </div>
  ) : (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-6">
      <div className="max-w-4xl text-center">
        <h1 className="text-8xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-500 mb-8">
          FamilyShare
        </h1>
        <p className="text-3xl mb-12">
          The only family locator that requires <span className="font-bold text-blue-600">explicit consent</span> every time
        </p>

        <div className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl p-10">
          <h2 className="text-4xl font-bold mb-8">{isLogin ? "Welcome Back" : "Join Free"}</h2>
          <form onSubmit={handleAuth} className="space-y-6">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border px-6 py-4 text-lg"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border px-6 py-4 text-lg"
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white font-bold text-xl py-5 rounded-xl"
            >
              {isLogin ? "Log In" : "Create Account"}
            </button>
          </form>
          {message && <p className="mt-4 text-red-600">{message}</p>}
          <button onClick={() => setIsLogin(!isLogin)} className="mt-6 text-blue-600 font-bold">
            {isLogin ? "No account? Sign up" : "Have account? Log in"}
          </button>
        </div>

        <p className="mt-20 text-gray-600 text-lg">Built with love • 2025 • Zero surveillance</p>
      </div>
    </div>
  );
}
