import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { LogOut, Menu, MapPin, Bell, Users, Shield } from "lucide-react";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setProfile linearized(null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const fetchProfile = async (id: string) => {
    const { data } = await supabase.from("profiles").select("*").eq("id", id).single();
    setProfile(data);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert("Check your email for confirmation link!");
      }
      setShowAuth(false);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
            FamilyShare
          </h1>
          {user ? (
            <div className="flex items-center gap-6">
              <span className="font-semibold text-lg">Welcome{profile?.first_name ? `, ${profile.first_name}` : ""}!</span>
              <button onClick={signOut} className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium">
                <LogOut size={22} /> Sign Out
              </button>
            </div>
          ) : (
            <div className="flex gap-6">
              <button onClick={() => { setIsLogin(true); setShowAuth(true); }} className="text-blue-600 font-bold text-lg hover:underline">
                Log In
              </button>
              <button onClick={() => { setIsLogin(false); setShowAuth(true); }} className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-3 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition">
                Sign Up Free
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Logged-out Landing */}
      {!user ? (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 pt-32 pb-20 text-center px-6">
          <h2 className="text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-500 mb-8">
            Safety Through Trust and Consent
          </h2>
          <p className="text-2xl text-gray-700 max-w-4xl mx-auto mb-12">
            FamilyShare is the privacy-first family safety app. Connect with your loved ones without compromising their privacy. No secret tracking, ever.
          </p>
          <button onClick={() => setShowAuth(true)} className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-16 py-6 rounded-2xl text-3xl font-bold shadow-2xl hover:shadow-3xl transition">
            Create Your Family Circle
          </button>

          <h3 className="text-5xl font-bold text-gray-800 mt-32 mb-16">
            Ethical Features Designed for Your Peace of Mind
          </h3>
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {[
              { title: "Consent-Based Sharing", icon: Shield },
              { title: "Polite Check-In Requests", icon: Bell },
              { title: "Public Safety Alerts", icon: MapPin },
              { title: "Supervised Accounts", icon: Users }
            ].map(({ title, icon: Icon }) => (
              <div key={title} className="bg-white p-12 rounded-3xl shadow-2xl hover:shadow-3xl transition text-left flex gap-6">
                <Icon size={48} className="text-blue-600 flex-shrink-0" />
                <div>
                  <h4 className="text-3xl font-bold text-blue-600 mb-3">{title}</h4>
                  <p className="text-xl text-gray-700">Full control, explicit consent, and transparency at every step.</p>
                </div>
              </div>
            ))}
          </div>
        </main>
      ) : (
        /* Logged-in Dashboard – coming in the next message */
        <div className="pt-32 text-center text-4xl font-bold text-green-600">
          Welcome to your Family Circle, {profile?.first_name || "User"}!<br />
          Real-time map + all features coming in 30 seconds…
        </div>
      )}

      {/* Auth Modal */}
      {showAuth && !user && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-10 max-w-md w-full shadow-2xl">
            <h2 className="text-4xl font-bold text-center mb-8">{isLogin ? "Welcome Back" : "Join FamilyShare"}</h2>
            <form onSubmit={handleAuth} className="space-y-6">
              <input required type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl text-lg focus:border-blue-500 outline-none" />
              <input required type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl text-lg focus:border-blue-500 outline-none" />
              <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-5 rounded-xl font-bold text-xl hover:shadow-xl transition">
                {isLogin ? "Log In" : "Create Account"}
              </button>
            </form>
            <button onClick={() => setShowAuth(false)} className="mt-6 text-gray-600 w-full text-center font-medium">
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
