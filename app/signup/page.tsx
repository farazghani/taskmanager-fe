"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/api/api";

const RegisterPage = () => {
  const router = useRouter();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const detail = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password.trim()
      };
      if(!detail.name || !detail.email || !detail.password){
        setError("All fields are required");
        return;
      }
      
      const res = await API.post("/user/register", {
        name,
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      router.push("/tasks");
    } catch (err: any) {
      setError(err?.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm border border-slate-200">

        <h1 className="text-2xl font-semibold text-center mb-6 text-slate-800">Register</h1>

        {error && (
          <p className="bg-red-50 text-red-700 p-2 rounded mb-4 text-sm text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleRegister} className="space-y-4">

        <input type="text" placeholder="Full Name" value={name} required
          onChange={(e) => setName(e.target.value)}
          className=" w-full px-4 py-2.5  bg-slate-50 border border-slate-300 rounded-lg text-slate-800 placeholder:text-slate-400
            outline-none  focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition-all"/>

         <input type="text" placeholder="email" value={email}  required  onChange={(e) => setEmail(e.target.value)}
          className=" w-full px-4 py-2.5  bg-slate-50 border border-slate-300 rounded-lg text-slate-800 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition-all"/>

          <input type="password" placeholder="Password" value={password}required onChange={(e) => setPassword(e.target.value)}
            className=" w-full px-4 py-2.5  bg-slate-50 border border-slate-300 rounded-lg  text-slate-800 placeholder:text-slate-400 outline-none  focus:ring-2 focus:ring-indigo-300  focus:border-indigo-500 transition-all" />


          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Register
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <a href="/login" className="text-indigo-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
