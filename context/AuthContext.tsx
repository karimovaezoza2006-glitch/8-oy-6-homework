"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

// 1️⃣ User type
export interface User {
  id: string;
  name: string;
  email: string;
  // kerak bo'lsa qo'shimcha field qo'shing
}

// 2️⃣ Context type
interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// 3️⃣ Context yaratish
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 4️⃣ Provider Props
interface AuthProviderProps {
  children: ReactNode;
}

// 5️⃣ Provider component
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // 6️⃣ LocalStorage dan yuklash
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (storedUser && storedUser !== "undefined")
        setUser(JSON.parse(storedUser) as User);
      if (storedToken) setToken(storedToken);
    } catch (error) {
      console.log("Storage parse error:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  }, []);

  // 7️⃣ Login
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/sign-in`,
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
        },
      );

      const userData: any = res.data.data;

      Cookies.set("token", userData.token);
      return true;
    } catch (err) {
      console.error("Login error:", err);
      return false;
    }
  };

  // 8️⃣ Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        loading,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 9️⃣ Custom hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
