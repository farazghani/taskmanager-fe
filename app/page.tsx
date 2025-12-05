"use client";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center relative px-4 overflow-hidden">

      {/* Floating Background Blobs */}
      <div className="absolute -top-20 -left-20 w-60 h-60 bg-indigo-300 opacity-20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-300 opacity-20 rounded-full blur-3xl animate-pulse"></div>

      {/* Content */}
      <div className="text-center space-y-4 animate-fadeIn">
        
        {/* Title */}
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent animate-slideDown">
          TaskFlow
        </h1>

        {/* Subtitle */}
        <p className="text-slate-600 text-lg max-w-md mx-auto animate-fadeInSlow">
          Simplify your day. Track tasks. Boost productivity.
        </p>

        {/* Buttons */}
        <div className="mt-6 flex gap-4 justify-center animate-slideUp">
          <a
            href="/login"
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg shadow-lg hover:bg-indigo-700 hover:shadow-xl transition-all duration-300"
          >
            Login
          </a>

          <a
            href="/signup"
            className="border border-slate-300 px-6 py-2.5 text-slate-700 rounded-lg hover:bg-slate-100 hover:shadow-md transition-all duration-300"
          >
            Register
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 left-4 text-xs text-slate-500 animate-fadeInSlow">
        Created by <span className="font-medium text-slate-700">Faraz Ghani</span>
      </footer>

      {/* Keyframe Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInSlow {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes slideUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          0% { opacity: 0; transform: translateY(-20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.7s ease-out; }
        .animate-fadeInSlow { animation: fadeInSlow 1.4s ease-out; }
        .animate-slideUp { animation: slideUp 0.8s ease-out; }
        .animate-slideDown { animation: slideDown 0.8s ease-out; }
      `}</style>

    </main>
  );
}
