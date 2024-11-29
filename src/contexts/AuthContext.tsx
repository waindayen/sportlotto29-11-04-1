import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserData, UserRole } from '../types/auth';

interface AuthContextType {
  currentUser: User | null;
  userData: UserData | null;
  login: (email: string, password: string) => Promise<UserData>;
  signup: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data() as UserData;
            setUserData(data);
          } else {
            const defaultUserData: UserData = {
              uid: user.uid,
              email: user.email!,
              role: 'externaluser'
            };
            await setDoc(doc(db, 'users', user.uid), defaultUserData);
            setUserData(defaultUserData);
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des données utilisateur:', error);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  async function signup(email: string, password: string, role: UserRole = 'externaluser') {
    setLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      const userData: UserData = {
        uid: user.uid,
        email: user.email!,
        role: role
      };
      await setDoc(doc(db, 'users', user.uid), userData);
      setUserData(userData);
      return userData;
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string): Promise<UserData> {
    setLoading(true);
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      let userData: UserData;
      
      if (!userDoc.exists()) {
        userData = {
          uid: user.uid,
          email: user.email!,
          role: 'externaluser'
        };
        await setDoc(doc(db, 'users', user.uid), userData);
      } else {
        userData = userDoc.data() as UserData;
      }
      
      setUserData(userData);
      return userData;
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    setLoading(true);
    try {
      await signOut(auth);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  }

  const value = {
    currentUser,
    userData,
    login,
    signup,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}