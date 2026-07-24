import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Sparkles, ArrowRight, Shield, TrendingDown, TreePine, Cpu } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const features = [
  { icon: TrendingDown, label: "AI Carbon Insights", desc: "Real-time predictive footprint analysis" },
  { icon: TreePine, label: "Environmental Impact", desc: "Trees, miles & gallons saved metrics" },
  { icon: Sparkles, label: "AI Sustainability Coach", desc: "Personalized Groq AI recommendations" },
  { icon: Cpu, label: "7-Day Forecasting", desc: "Exponential smoothing trend prediction" },
];

export const LoginPage: React.FC = () => {
  const { signInWithGoogle, signInWithApple, signInDemo, isLoading } = useAuth();
  const [loadingProvider, setLoadingProvider] = useState<"google" | "apple" | null>(null);

  const handleGoogle = async () => {
    setLoadingProvider("google");
    await signInWithGoogle();
    setLoadingProvider(null);
  };

  const handleApple = async () => {
    setLoadingProvider("apple");
    await signInWithApple();
    setLoadingProvider(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col lg:flex-row overflow-hidden">
      {/* ─── Left Panel: Branding & Features ─── */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-12 overflow-hidden">
        {/* Background ambient glows */}
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-[400px] h-[400px] bg-teal-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-emerald-400/5 rounded-full blur-2xl pointer-events-none" />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-xl shadow-emerald-500/30">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-2xl font-extrabold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              EcoSense
            </div>
            <div className="text-xs text-slate-400 font-medium tracking-wide">AI Personal Sustainability Assistant</div>
          </div>
        </div>

        {/* Hero Text */}
        <div className="relative z-10 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight">
              Your AI-powered
              <span className="block bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400 bg-clip-text text-transparent">
                sustainability coach
              </span>
            </h1>
            <p className="text-slate-400 text-base mt-4 max-w-md leading-relaxed">
              Log daily activities, calculate your carbon footprint, visualize trends, and receive personalized AI insights — all in one beautiful dashboard.
            </p>
          </motion.div>

          {/* Feature Cards */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            {features.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm hover:border-emerald-500/30 transition-all group"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 group-hover:bg-emerald-500/20 transition">
                    <f.icon className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <span className="text-xs font-bold text-slate-200">{f.label}</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom testimonial quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="relative z-10 p-4 rounded-2xl bg-slate-900/70 border border-slate-800/60 backdrop-blur-sm"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
              🌱
            </div>
            <div>
              <p className="text-xs text-slate-300 italic leading-relaxed">
                "EcoSense helped me reduce my carbon footprint by 34% in just 3 months with AI-guided habit changes."
              </p>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">— Community Sustainability Leader, San Francisco</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ─── Right Panel: Auth Form ─── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative">
        {/* Mobile background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm relative z-10"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xl font-extrabold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                EcoSense
              </div>
              <div className="text-xs text-slate-400">AI Sustainability Assistant</div>
            </div>
          </div>

          {/* Auth Card */}
          <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800/80 backdrop-blur-xl shadow-2xl">
            <div className="mb-8">
              <h2 className="text-2xl font-extrabold text-white">Welcome back</h2>
              <p className="text-sm text-slate-400 mt-1">Sign in to continue your sustainability journey</p>
            </div>

            <div className="space-y-3">
              {/* Google Sign In */}
              <motion.button
                whileHover={{ scale: 1.02 }}
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

              {/* Apple Sign In */}
              <motion.button
                whileHover={{ scale: 1.02 }}
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
              <span className="text-xs text-slate-500 font-medium">or</span>
              <div className="h-px flex-1 bg-slate-800" />
            </div>

            {/* Demo Access */}
            <button
              onClick={signInDemo}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border border-emerald-500/30 text-emerald-400 text-sm font-semibold hover:bg-emerald-500/10 transition-all duration-200 group"
            >
              <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Explore with Demo Account
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Privacy Note */}
            <div className="mt-6 flex items-start gap-2 p-3 rounded-xl bg-slate-950/60 border border-slate-800/60">
              <Shield className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-slate-500 leading-relaxed">
                We only access your basic profile information. Your activity data is stored locally and never shared.
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-slate-600 mt-6">
            By continuing, you agree to EcoSense's{" "}
            <span className="text-slate-400 hover:text-emerald-400 cursor-pointer transition">Terms of Service</span>{" "}
            and{" "}
            <span className="text-slate-400 hover:text-emerald-400 cursor-pointer transition">Privacy Policy</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
};
