import Link from "next/link";
import { logout } from "./action";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000" />
      </div>

      <div className="relative text-center">
        {/* Logo / Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-linear-to-r from-cyan-500 to-purple-500 mb-8">
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>

        {/* Welcome text */}
        <h1 className="text-5xl font-bold text-white mb-4">Welcome</h1>
        <p className="text-xl text-gray-400 mb-10 max-w-md mx-auto">
          Get started by signing in to your account or creating a new one.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="px-8 py-3 bg-linear-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-105"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="px-8 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-200 transform hover:scale-105"
          >
            Create Account
          </Link>
        </div>

        <form action={logout} className="mt-6">
          <button
            type="submit"
            className="px-8 py-3 cursor-pointer bg-red-500/20 border border-red-500/30 text-red-400 font-semibold rounded-xl hover:bg-red-500/30 transition-all duration-200 transform hover:scale-105"
          >
            Log Out
          </button>
        </form>
      </div>
    </div>
  );
}
