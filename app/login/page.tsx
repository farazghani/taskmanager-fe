"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/api/api";

const LoginPage = () => {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await API.post("/user/login", { email, password });

      localStorage.setItem("token", res.data.token);
      router.push("/tasks");
    } catch (err: any) {
      setError(err?.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm border border-slate-200">

        <h1 className="text-2xl font-semibold text-center mb-6 text-slate-800">Login</h1>

        {error && (
          <p className="bg-red-50 text-red-700 p-2 rounded mb-4 text-sm text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">

         <input type="email"  placeholder="Enter your email" value={email} required onChange={(e) => setEmail(e.target.value)}
         className="  w-full px-4 py-2.5    border border-slate-300   rounded-lg   bg-slate-50  text-slate-800  placeholder:text-slate-400  focus:border-indigo-500  focus:ring-2 focus:ring-indigo-300 transition-all" />

        <input type="password"  placeholder="Enter your password" value={password}  required onChange={(e) => setPassword(e.target.value)}
        className="  w-full px-4 py-2.5   border border-slate-300   rounded-lg   bg-slate-50  text-slate-800  placeholder:text-slate-400  focus:border-indigo-500  focus:ring-2 focus:ring-indigo-300  transition-all " />


          <button
            type="submit"
            className="w-full bg-indigo-700 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-600">
          Don't have an account?{" "}
          <a href="/signup" className="text-indigo-600 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
