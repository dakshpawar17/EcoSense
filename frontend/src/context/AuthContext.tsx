import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  provider: "google" | "apple" | "demo";
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signInDemo: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

const DEMO_USERS = {
  google: {
    id: "google-user-001",
    name: "Alex Morgan",
    email: "alex.morgan@gmail.com",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=AlexMorgan&backgroundColor=b6e3f4",
    provider: "google" as const,
  },
  apple: {
    id: "apple-user-001",
    name: "Jamie Chen",
    email: "jamiechen@icloud.com",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=JamieChen&backgroundColor=c0aede",
    provider: "apple" as const,
  },
  demo: {
    id: "demo-user-001",
    name: "Demo Explorer",
    email: "demo@ecosense.ai",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=EcoDemo&backgroundColor=d1f4cc",
    provider: "demo" as const,
  },
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Restore session from localStorage
    const stored = localStorage.getItem("ecosense_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {}
    }
    setIsLoading(false);
  }, []);

  const persist = (u: AuthUser) => {
    localStorage.setItem("ecosense_user", JSON.stringify(u));
    setUser(u);
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    // Simulate OAuth redirect latency
    await new Promise((r) => setTimeout(r, 1200));
    persist(DEMO_USERS.google);
    setIsLoading(false);
  };

  const signInWithApple = async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    persist(DEMO_USERS.apple);
    setIsLoading(false);
  };

  const signInDemo = () => {
    persist(DEMO_USERS.demo);
  };

  const signOut = () => {
    localStorage.removeItem("ecosense_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signInWithGoogle, signInWithApple, signInDemo, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
