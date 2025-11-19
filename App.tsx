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
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      await supabase.auth.signInWithPassword({ email, password });
    } else {
      await supabase.auth.signUp({ email, password });
    }
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center text-4xl">Loading…</div>;

  return user ? (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-10 text-center">
      <h1 className="text-6xl font-bold">Welcome!</h1>
      <p className="mt-6 text-3xl text-green-600">FamilyShare is LIVE</p>
      <p className="mt-4 text-2xl">Logged in as: <strong>{user.email}</strong></p>
      <button onClick={() => supabase.auth.signOut()} className="mt-10 rounded-xl bg-red-600 px-12 py-6 text-2xl font-bold text-white hover:bg-red-700">
        Sign Out
      </button>
    </div>
  ) : (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 p-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-2xl">
        <h1 className="mb-8 text-center text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500">
          FamilyShare
        </h1>
        <form onSubmit={handleAuth} className="space-y-6">
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full rounded-xl border px-6 py-4 text-lg" />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full rounded-xl border px-6 py-4 text-lg" />
          <button type="submit" className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-green-600 py-5 text-xl font-bold text-white">
            {isLogin ? "Log In" : "Sign Up Free"}
          </button>
        </form>
        <button onClick={() => setIsLogin(!isLogin)} className="mt-6 block w-full text-center text-blue-600 font-bold">
          {isLogin ? "No account? Sign up" : "Have account? Log in"}
        </button>
      </div>
    </div>
  );
}
