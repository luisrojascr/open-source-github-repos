"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, Session, AuthError } from "@supabase/supabase-js";
import { supabase } from "./db";

type AuthState = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: AuthError | null;
};

type AuthContextType = AuthState & {
  signIn: (email: string, password: string) => Promise<Session>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initialState: AuthState = {
  user: null,
  session: null,
  isLoading: true,
  error: null,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [{ user, session, isLoading, error }, setState] =
    useState<AuthState>(initialState);

  useEffect(() => {
    // Initialize auth state
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setState((state) => ({
          ...state,
          session,
          user: session?.user ?? null,
          isLoading: false,
        }));
      } catch (error) {
        setState((state) => ({
          ...state,
          error: error as AuthError,
          isLoading: false,
        }));
      }
    };

    initializeAuth();

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setState((state) => ({
        ...state,
        session,
        user: session?.user ?? null,
        isLoading: false,
      }));
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuthError = (error: AuthError) => {
    setState((state) => ({ ...state, error, isLoading: false }));
    throw error;
  };

  const clearError = () => {
    setState((state) => ({ ...state, error: null }));
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Ensure session is set before returning
    if (data?.session) {
      setState((state) => ({
        ...state,
        session: data.session,
        user: data.session.user,
        isLoading: false,
      }));
      return data.session;
    }

    throw new Error("No session established");
  };

  const signUp = async (email: string, password: string) => {
    try {
      setState((state) => ({ ...state, isLoading: true, error: null }));
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) handleAuthError(error);
    } catch (error) {
      handleAuthError(error as AuthError);
    }
  };

  const signOut = async () => {
    try {
      setState((state) => ({ ...state, isLoading: true, error: null }));
      const { error } = await supabase.auth.signOut();
      if (error) handleAuthError(error);
    } catch (error) {
      handleAuthError(error as AuthError);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        signIn,
        signUp,
        signOut,
        isLoading,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access authentication context
 * @throws {Error} If used outside of AuthProvider
 * @returns {AuthContextType} Authentication context value
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
