import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  // Auth form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.session.user.id)
          .single();
        setProfile(profile);
      }
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(async (_, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        setProfile(profile);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await supabase.auth.signInWithPassword({ email, password });
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (data.user) {
          await supabase.from("profiles").insert({
            id: data.user.id,
            first_name: firstName,
            last_name: lastName,
            date_of_birth: dob,
          });
        }
      }
      setShowAuth(false);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const signOut = () => supabase.auth.signOut();

  if (loading) return null;

  return (
    <>
      {/* Header */}
      <header className="absolute top-0 right-0 p-6">
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-lg font-medium">
              Welcome, {profile?.first_name || "User"}!
            </span>
            <button
              onClick={signOut}
              className="rounded-lg bg-red-600 px-5 py-2 text-white font-medium hover:bg-red-700"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="flex gap-4">
            <button
              onClick={() => { setIsLogin(true); setShowAuth(true); }}
              className="text-blue-600 font-medium hover:underline"
            >
              Log In
            </button>
            <button
              onClick={() => { setIsLogin(false); setShowAuth(true); }}
              className="rounded-lg bg-blue-600 px-6 py-2 text-white font-medium hover:bg-blue-700"
            >
              Sign Up Free
            </button>
          </div>
        )}
      </header>

      {/* Main Landing Page */}
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 px-6 text-center">
        <h1 className="mb-8 text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500">
          FamilyShare
        </h1>
        <p className="mb-12 text-4xl font-bold text-gray-800">
          Safety Through Trust and Consent
        </p>
        <p className="mb-12 max-w-3xl text-xl text-gray-700">
          FamilyShare is the privacy-first family safety app. Connect with your loved ones without compromising their privacy. No secret tracking, ever.
        </p>

        <button className="mb-16 rounded-xl bg-gradient-to-r from-blue-600 to-green-600 px-10 py-5 text-2xl font-bold text-white shadow-xl hover:shadow-2xl">
          Create Your Family Circle
        </button>

        <h2 className="mb-12 text-4xl font-bold text-gray-800">
          Ethical Features Designed for Your Peace of Mind
        </h2>

        <div className="grid max-w-5xl grid-cols-1 gap-10 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-10 shadow-lg">
            <h3 className="mb-4 text-2xl font-bold text-blue-600">Consent-Based Sharing</h3>
            <p className="text-gray-700">
              Create private Family Circles where every member must accept an invitation. You control who sees your location, and for how long.
            </p>
          </div>
          <div className="rounded-2xl bg-white p-10 shadow-lg">
            <h3 className="mb-4 text-2xl font-bold text-green-600">Polite Check-In Requests</h3>
            <p className="text-gray-700">
              Ask a family member to share their location once or for an hour. They must explicitly approve each request.
            </p>
          </div>
          <div className="rounded-2xl bg-white p-10 shadow-lg">
            <h3 className="mb-4 text-2xl font-bold text-purple-600">Public Safety Alerts</h3>
            <p className="text-gray-700">
              Post and view community alerts for missing persons or pets. Help keep your neighborhood safe together.
            </p>
          </div>
          <div className="rounded-2xl bg-white p-10 shadow-lg">
            <h3 className="mb-4 text-2xl font-bold text-orange-600">Supervised Accounts</h3>
            <p className="text-gray-700">
              For minors under 18, create a supervised account with parental controls, always with the child's active consent and awareness.
            </p>
          </div>
        </div>

        <footer className="mt-20 text-gray-600">
          © 2025 FamilyShare. All Rights Reserved. Your privacy is our priority.
        </footer>
      </main>

      {/* Auth Modal */}
      {showAuth && !user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-2xl">
            <h2 className="mb-8 text-3xl font-bold text-center">
              {isLogin ? "Welcome Back" : "Create Your Account"}
            </h2>
            <form onSubmit={handleAuth} className="space-y-5">
              {!isLogin && (
                <>
                  <input placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} required className="w-full rounded-xl border px-5 py-3" />
                  <input placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} required className="w-full rounded-xl border px-5 py-3" />
                  <input type="date" placeholder="Date of Birth" value={dob} onChange={e => setDob(e.target.value)} required className="w-full rounded-xl border px-5 py-3" />
                </>
              )}
              <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full rounded-xl border px-5 py-3" />
              <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full rounded-xl border px-5 py-3" />
              <button type="submit" className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-green-600 py-4 text-xl font-bold text-white">
                {isLogin ? "Log In" : "Create Account"}
              </button>
            </form>
            <button onClick={() => setShowAuth(false)} className="mt-6 w-full text-gray-600">
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
