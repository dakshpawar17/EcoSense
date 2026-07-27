import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Shield, Mail, Lock, LogIn, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface LoginFormProps {
  onSuccess?: () => void;
  showTitle?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, showTitle = true }) => {
  const { signInWithGoogle, signInWithApple, signInDemo, signInAdminDemo } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isCustomLoading, setIsCustomLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadingProvider, setLoadingProvider] = useState<"google" | "apple" | "email" | null>(null);

  const handleGoogle = async () => {
    setErrorMessage(null);
    setLoadingProvider("google");
    try {
      await signInWithGoogle();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to sign in with Google");
    } finally {
      setLoadingProvider(null);
    }
  };

  const handleApple = async () => {
    setErrorMessage(null);
    setLoadingProvider("apple");
    try {
      await signInWithApple();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to sign in with Apple");
    } finally {
      setLoadingProvider(null);
    }
  };

  const handleCustomEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage("Please enter your email address.");
      return;
    }
    setErrorMessage(null);
    setIsCustomLoading(true);
    setLoadingProvider("email");

    try {
      if (email.toLowerCase().includes("admin")) {
        await signInAdminDemo();
      } else {
        await signInDemo();
      }
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setErrorMessage(err.message || "Authentication failed.");
    } finally {
      setIsCustomLoading(false);
      setLoadingProvider(null);
    }
  };

  return (
    <div className="w-full space-y-6">
      {showTitle && (
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-white">Welcome back</h2>
          <p className="text-sm text-slate-400 mt-1">Sign in to continue your sustainability journey</p>
        </div>
      )}

      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-300 flex items-center gap-2"
        >
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </motion.div>
      )}

      {/* OAuth Social Login Buttons */}
      <div className="space-y-3">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGoogle}
          disabled={!!loadingProvider}
          className="relative w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-2xl bg-white text-slate-900 font-semibold text-sm hover:bg-slate-100 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <AnimatePresence mode="wait">
            {loadingProvider === "google" ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-5 h-5 border-2 border-slate-300 border-t-emerald-500 rounded-full animate-spin"
              />
            ) : (
              <motion.svg key="icon" className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </motion.svg>
            )}
          </AnimatePresence>
          <span>Continue with Google</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleApple}
          disabled={!!loadingProvider}
          className="relative w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-2xl bg-slate-950 text-white border border-slate-700/80 font-semibold text-sm hover:bg-slate-900 hover:border-slate-600 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <AnimatePresence mode="wait">
            {loadingProvider === "apple" ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-5 h-5 border-2 border-slate-600 border-t-white rounded-full animate-spin"
              />
            ) : (
              <motion.svg key="icon" className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.14-2.22 1.3-2.2 3.88.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.64M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </motion.svg>
            )}
          </AnimatePresence>
          <span>Continue with Apple</span>
        </motion.button>
      </div>

      {/* Divider */}
      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-800" />
        <span className="text-xs text-slate-500 font-medium">or login with email</span>
        <div className="h-px flex-1 bg-slate-800" />
      </div>

      {/* Email / Password Form */}
      <form onSubmit={handleCustomEmailLogin} className="space-y-3">
        <div className="relative">
          <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        <div className="relative">
          <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        <button
          type="submit"
          disabled={isCustomLoading}
          className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-sm hover:from-emerald-400 hover:to-teal-300 transition shadow-lg shadow-emerald-500/20 disabled:opacity-50"
        >
          <LogIn className="w-4 h-4" />
          {isCustomLoading ? "Signing In..." : "Sign In with Email"}
        </button>
      </form>

      {/* Demo Access Shortcuts */}
      <div className="pt-2 border-t border-slate-800/80 space-y-2">
        <div className="text-[11px] text-slate-500 font-semibold text-center mb-1">Quick Demo Access</div>
        <button
          type="button"
          onClick={async () => {
            await signInDemo();
            if (onSuccess) onSuccess();
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-emerald-500/30 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/10 transition group"
        >
          <Sparkles className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          Explore as Regular User
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </button>

        <button
          type="button"
          onClick={async () => {
            await signInAdminDemo();
            if (onSuccess) onSuccess();
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950/60 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition"
        >
          <Shield className="w-3.5 h-3.5 text-amber-400" />
          Sign In as System Admin
        </button>
      </div>
    </div>
  );
};
