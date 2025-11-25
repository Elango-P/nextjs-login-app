"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../utils/supabaseClient";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    // 1️⃣ Create user in Supabase Auth
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    // 2️⃣ Insert into your custom users table
    await supabase.from("users").insert({
      id: data.user.id,
      full_name: name,
      role: "user",
    });

    router.push("/login");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="p-10 bg-white rounded-2xl shadow-xl w-96">
        <h1 className="text-3xl font-bold text-center mb-6">Sign Up</h1>

        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <label>Full Name</label>
            <input
              type="text"
              className="w-full mt-1 px-3 py-2 border rounded-md"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label>Email</label>
            <input
              type="email"
              className="w-full mt-1 px-3 py-2 border rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label>Password</label>
            <input
              type="password"
              className="w-full mt-1 px-3 py-2 border rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-red-500 mb-2">{error}</p>}

          <button className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700">
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}
