import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react';
import { User } from '../types/user.types';
import { LoginRequest, SignupRequest } from '../types/auth.types';
import { AuthService } from '../services/authService';
import { UserService } from '../services/userService';
import { StorageService } from '../services/storageService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  signup: (data: SignupRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check auth status on app launch
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const storedToken = await StorageService.getToken();
      const storedUser = await StorageService.getUser();

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
        // Optionally refresh user data from server
        try {
          const freshUser = await UserService.getMyProfile();
          setUser(freshUser);
          await StorageService.saveUser(freshUser);
        } catch (error) {
          console.log('Could not refresh user data:', error);
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (data: LoginRequest) => {
    try {
      const response = await AuthService.login(data);
      const userToken = response.accessToken;
      const userRefreshToken = response.refreshToken;

      // Save both tokens
      await StorageService.saveToken(userToken);
      await StorageService.saveRefreshToken(userRefreshToken);
      setToken(userToken);

      // Fetch user profile
      const userProfile = await UserService.getMyProfile();
      await StorageService.saveUser(userProfile);
      setUser(userProfile);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (data: SignupRequest) => {
    try {
      await AuthService.signup(data);
      // After signup, automatically log in
      await login({
        mobileNumber: data.mobileNumber,
        password: data.password,
      });
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await StorageService.clearAll();
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      const freshUser = await UserService.getMyProfile();
      setUser(freshUser);
      await StorageService.saveUser(freshUser);
    } catch (error) {
      console.error('Error refreshing user:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        signup,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
