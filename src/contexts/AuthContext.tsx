"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { User, AuthContextType } from "@/types";
import toast from "react-hot-toast";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const getUserData = async (
    firebaseUser: FirebaseUser
  ): Promise<User | null> => {
    try {
      const userDocRef = doc(db, "users", firebaseUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        return {
          id: firebaseUser.uid,
          email: firebaseUser.email!,
          displayName: userData.displayName || firebaseUser.displayName,
          role: userData.role || "user",
          createdAt: userData.createdAt?.toDate() || new Date(),
        };
      }

      return null;
    } catch (error) {
      console.warn("Could not get user data from Firestore:", error);
      // If offline or permission error, return basic user data
      if (
        error instanceof Error &&
        (error.message.includes("offline") ||
          error.message.includes("permissions"))
      ) {
        return {
          id: firebaseUser.uid,
          email: firebaseUser.email!,
          displayName: firebaseUser.displayName || "User",
          role: "user",
          createdAt: new Date(),
        };
      }
      return null;
    }
  };

  const createUserDocument = async (
    firebaseUser: FirebaseUser
  ): Promise<User> => {
    try {
      const userDocRef = doc(db, "users", firebaseUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // Create new user document
        const userData: Omit<User, "id"> = {
          email: firebaseUser.email!,
          displayName: firebaseUser.displayName || "User",
          role: "user",
          createdAt: new Date(),
        };

        await setDoc(userDocRef, userData);
        return {
          id: firebaseUser.uid,
          ...userData,
        };
      } else {
        // Return existing user data
        const userData = userDoc.data();
        return {
          id: firebaseUser.uid,
          email: firebaseUser.email!,
          displayName: userData.displayName || firebaseUser.displayName,
          role: userData.role || "user",
          createdAt: userData.createdAt?.toDate() || new Date(),
        };
      }
    } catch (error) {
      console.warn("Could not create/get user document:", error);
      // If offline or permission error, return basic user data without creating document
      if (
        error instanceof Error &&
        (error.message.includes("offline") ||
          error.message.includes("permissions"))
      ) {
        toast("You're connected! Some features may be limited.", {
          icon: "ℹ️",
        });
        return {
          id: firebaseUser.uid,
          email: firebaseUser.email!,
          displayName: firebaseUser.displayName || "User",
          role: "user",
          createdAt: new Date(),
        };
      }
      throw error;
    }
  };

  const signUp = async (
    email: string,
    password: string,
    displayName: string
  ) => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      // Update the user's display name
      await updateProfile(firebaseUser, { displayName });

      // Create user document in Firestore
      const userData: Omit<User, "id"> = {
        email: firebaseUser.email!,
        displayName,
        role: "user",
        createdAt: new Date(),
      };

      await setDoc(doc(db, "users", firebaseUser.uid), userData);

      const newUser: User = {
        id: firebaseUser.uid,
        ...userData,
      };

      setUser(newUser);
      toast.success("Account created successfully!");
    } catch (error) {
      console.error("Sign up error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create account";
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userData = await getUserData(userCredential.user);

      if (userData) {
        setUser(userData);
        toast.success("Signed in successfully!");
      } else {
        throw new Error("User data not found");
      }
    } catch (error) {
      console.error("Sign in error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to sign in";
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      provider.addScope("email");
      provider.addScope("profile");

      const result = await signInWithPopup(auth, provider);
      const userData = await createUserDocument(result.user);

      setUser(userData);
      toast.success("Signed in with Google successfully!");
    } catch (error) {
      console.error("Google sign in error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to sign in with Google";
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithFacebook = async () => {
    try {
      setLoading(true);
      const provider = new FacebookAuthProvider();
      provider.addScope("email");

      const result = await signInWithPopup(auth, provider);
      const userData = await createUserDocument(result.user);

      setUser(userData);
      toast.success("Signed in with Facebook successfully!");
    } catch (error) {
      console.error("Facebook sign in error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to sign in with Facebook";
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      toast.success("Signed out successfully!");
    } catch (error) {
      console.error("Sign out error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to sign out";
      toast.error(errorMessage);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userData = await getUserData(firebaseUser);
        setUser(userData);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithFacebook,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
