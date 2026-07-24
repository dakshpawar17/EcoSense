import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { signInWithPopup, signOut as firebaseSignOut } from "firebase/auth";
import { auth, googleProvider, appleProvider } from "../config/firebase";
import { api } from "../services/api";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  provider: "google" | "apple" | "demo";
  role: "admin" | "user";
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signInDemo: () => Promise<void>;
  signInAdminDemo: () => Promise<void>;
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
    role: "user" as const,
  },
  apple: {
    id: "apple-user-001",
    name: "Jamie Chen",
    email: "jamiechen@icloud.com",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=JamieChen&backgroundColor=c0aede",
    provider: "apple" as const,
    role: "user" as const,
  },
  demo: {
    id: "demo-user-001",
    name: "Demo Explorer",
    email: "demo@ecosense.ai",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=EcoDemo&backgroundColor=d1f4cc",
    provider: "demo" as const,
    role: "user" as const,
  },
  admin: {
    id: "admin-user-001",
    name: "System Admin",
    email: "admin@ecosense.ai",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=EcoAdmin&backgroundColor=ffd5dc",
    provider: "demo" as const,
    role: "admin" as const,
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
        const parsed = JSON.parse(stored);
        setUser(parsed);
      } catch {}
    }
    setIsLoading(false);
  }, []);

  const syncAndPersistUser = async (baseUser: AuthUser): Promise<AuthUser> => {
    try {
      const response = await api.post("/auth/login", {
        email: baseUser.email,
        name: baseUser.name,
        avatar: baseUser.avatar,
        provider: baseUser.provider,
        role: baseUser.role,
      });

      if (response.data.success && response.data.user) {
        const syncedUser: AuthUser = {
          id: response.data.user.id || baseUser.id,
          name: response.data.user.name || baseUser.name,
          email: response.data.user.email || baseUser.email,
          avatar: response.data.user.avatar || baseUser.avatar,
          provider: (response.data.user.provider as any) || baseUser.provider,
          role: (response.data.user.role as any) || baseUser.role,
        };
        localStorage.setItem("ecosense_user", JSON.stringify(syncedUser));
        setUser(syncedUser);
        return syncedUser;
      }
    } catch (err) {
      console.warn("Backend user sync offline, saving locally:", err);
    }

    localStorage.setItem("ecosense_user", JSON.stringify(baseUser));
    setUser(baseUser);
    return baseUser;
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      const baseUser: AuthUser = {
        id: fbUser.uid,
        name: fbUser.displayName || "EcoSense User",
        email: fbUser.email || "user@ecosense.ai",
        avatar: fbUser.photoURL || DEMO_USERS.google.avatar,
        provider: "google",
        role: "user",
      };
      await syncAndPersistUser(baseUser);
    } catch (err: any) {
      console.warn("Firebase Google login popup note/fallback:", err.message);
      await syncAndPersistUser(DEMO_USERS.google);
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithApple = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, appleProvider);
      const fbUser = result.user;
      const baseUser: AuthUser = {
        id: fbUser.uid,
        name: fbUser.displayName || "Apple EcoSense User",
        email: fbUser.email || "apple@ecosense.ai",
        avatar: fbUser.photoURL || DEMO_USERS.apple.avatar,
        provider: "apple",
        role: "user",
      };
      await syncAndPersistUser(baseUser);
    } catch (err: any) {
      console.warn("Firebase Apple login popup note/fallback:", err.message);
      await syncAndPersistUser(DEMO_USERS.apple);
    } finally {
      setIsLoading(false);
    }
  };

  const signInDemo = async () => {
    setIsLoading(true);
    await syncAndPersistUser(DEMO_USERS.demo);
    setIsLoading(false);
  };

  const signInAdminDemo = async () => {
    setIsLoading(true);
    await syncAndPersistUser(DEMO_USERS.admin);
    setIsLoading(false);
  };

  const signOut = () => {
    try {
      firebaseSignOut(auth);
    } catch {}
    localStorage.removeItem("ecosense_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signInWithGoogle,
        signInWithApple,
        signInDemo,
        signInAdminDemo,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
