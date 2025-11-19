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

  const signOut = () => supabase.auth.signOut();

  if (loading) return <div className="flex min-h-screen items-center justify-center text-4xl">Loading…</div>;

  return user ? (
    // LOGGED IN DASHBOARD
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-10">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-8">Welcome back!</h1>
        <p className="text-3xl text-green-600 mb-4">FamilyShare is 100% LIVE</p>
        <p className="text-2xl mb-10">Logged in as <strong>{user.email}</strong></p>
        <button onClick={signOut} className="bg-red-600 hover:bg-red-700 text-white px-12 py-6 rounded-2xl text-2xl font-bold">
          Sign Out
        </button>
      </div>
    </div>
  ) : (
    // GORGEOUS LANDING PAGE + LOGIN/SIGNUP
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-6">
      <div className="max-w-4xl text-center">
        <h1 className="text-8xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-500 mb-8">
          FamilyShare
        </h1>
        <p className="text-3xl mb-12">The only family locator that requires <span className="font-bold text-blue-600">explicit consent</span> every time</p>

        <div className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl p-10">
          <h2 className="text-4xl font-bold mb-8">{isLogin ? "Welcome Back" : "Join Free"}</h2>
          <form onSubmit={handleAuth} className="space-y-6">
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full rounded-xl border px-6 py-4 text-lg" />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full rounded-xl border px-6 py-4 text-lg" />
            <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white font-bold text-xl py-5 rounded-xl">
              {isLogin ? "Log In" : "Create Account"}
            </button>
          </form>
          <button onClick={() => setIsLogin(!isLogin)} className="mt-6 text-blue-600 font-bold">
            {isLogin ? "No account? Sign up" : "Have account? Log in"}
          </button>
        </div>

        <p className="mt-20 text-gray-600 text-lg">Built with love • 2025 • Zero surveillance</p>
      </div>
    </div>
  );
}
