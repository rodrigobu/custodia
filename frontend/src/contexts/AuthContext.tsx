import { createContext, useCallback, useEffect, useState, type ReactNode } from "react";
import { authService, type User, type LoginData, type RegisterData } from "../services/authService";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const tokens = authService.getStoredTokens();
    if (!tokens) {
      setLoading(false);
      return;
    }

    try {
      const userData = await authService.getMe(tokens.access);
      setUser(userData);
    } catch {
      try {
        const newTokens = await authService.refreshToken(tokens.refresh);
        authService.storeTokens(newTokens);
        const userData = await authService.getMe(newTokens.access);
        setUser(userData);
      } catch {
        authService.clearTokens();
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (data: LoginData) => {
    const result = await authService.login(data);
    authService.storeTokens(result.tokens);
    setUser(result.user);
  };

  const register = async (data: RegisterData) => {
    const result = await authService.register(data);
    authService.storeTokens(result.tokens);
    setUser(result.user);
  };

  const logout = () => {
    authService.clearTokens();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
