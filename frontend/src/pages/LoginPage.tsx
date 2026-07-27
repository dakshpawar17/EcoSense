import React from "react";
import { motion } from "framer-motion";
import { Leaf, Sparkles, Shield, TrendingDown, TreePine, Cpu } from "lucide-react";
import { LoginForm } from "../components/auth/LoginForm";

const features = [
  { icon: TrendingDown, label: "AI Carbon Insights", desc: "Real-time predictive footprint analysis" },
  { icon: TreePine, label: "Environmental Impact", desc: "Trees, miles & gallons saved metrics" },
  { icon: Sparkles, label: "AI Sustainability Coach", desc: "Personalized Groq AI recommendations" },
  { icon: Cpu, label: "7-Day Forecasting", desc: "Exponential smoothing trend prediction" },
];

export const LoginPage: React.FC = () => {
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
            <LoginForm />

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
