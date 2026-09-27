import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, UserProfile, StoreProfile } from '../types';
import { INITIAL_USER, MOCK_STORES } from '../data/mockData';
import { auth, googleProvider, isFirebaseConfigured } from '../config/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';

interface AuthContextType {
  role: UserRole;
  user: UserProfile | null;
  store: StoreProfile | null;
  adminName: string;
  isFirebaseActive: boolean;
  isAuthenticated: boolean;
  loginAsUser: (email?: string, password?: string) => Promise<void>;
  registerAsUser: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginAsStore: (storeId: string, email?: string, password?: string) => Promise<void>;
  loginStoreWithGoogle: (storeId: string) => Promise<void>;
  loginAsAdmin: (password: string) => boolean;
  logout: () => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const createDefaultProfile = (id: string, name: string, email: string, avatar?: string): UserProfile => ({
  id,
  name,
  email,
  role: 'USER',
  genderPreference: 'mens',
  wishlistProductIds: ['prod_m_01'],
  interestedProductIds: ['prod_m_01', 'prod_w_01'],
  joinedGroupIds: ['grp_101'],
  avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  createdAt: new Date().toISOString(),
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('USER');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [store, setStore] = useState<StoreProfile | null>(null);
  const [adminName] = useState<string>('Platform Admin');

  // Sync Firebase Auth state if configured
  useEffect(() => {
    if (!isFirebaseConfigured || !auth) return;

    const unsubscribe = onAuthStateChanged(auth, (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        setUser(
          createDefaultProfile(
            fbUser.uid,
            fbUser.displayName || fbUser.email?.split('@')[0] || 'Authenticated Shopper',
            fbUser.email || 'shopper@brandtogether.com',
            fbUser.photoURL || undefined
          )
        );
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const loginAsUser = async (email?: string, password?: string) => {
    if (isFirebaseConfigured && auth && email && password) {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      setRole('USER');
      setUser(
        createDefaultProfile(
          cred.user.uid,
          cred.user.displayName || cred.user.email?.split('@')[0] || 'Authenticated Shopper',
          cred.user.email || email,
          cred.user.photoURL || undefined
        )
      );
      setStore(null);
      return;
    }

    setRole('USER');
    setUser(INITIAL_USER);
    setStore(null);
  };

  const registerAsUser = async (email: string, password: string, name: string) => {
    if (isFirebaseConfigured && auth) {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      setRole('USER');
      setUser(createDefaultProfile(cred.user.uid, name, cred.user.email || email));
      setStore(null);
      return;
    }

    setRole('USER');
    setUser({ ...INITIAL_USER, name, email });
    setStore(null);
  };

  const loginWithGoogle = async () => {
    if (isFirebaseConfigured && auth && googleProvider) {
      const cred = await signInWithPopup(auth, googleProvider);
      setRole('USER');
      setUser(
        createDefaultProfile(
          cred.user.uid,
          cred.user.displayName || 'Google Shopper',
          cred.user.email || '',
          cred.user.photoURL || undefined
        )
      );
      setStore(null);
      return;
    }

    setRole('USER');
    setUser(
      createDefaultProfile(
        `user_google_${Date.now()}`,
        'Google User',
        'user.google@brandtogether.com'
      )
    );
    setStore(null);
  };

  const loginAsStore = async (storeId: string, email?: string, password?: string) => {
    const foundStore = MOCK_STORES.find((s) => s.id === storeId) || MOCK_STORES[0];

    if (isFirebaseConfigured && auth && email && password) {
      await signInWithEmailAndPassword(auth, email, password);
    }

    setRole('STORE');
    setStore(foundStore);
    setUser(null);
  };

  const loginStoreWithGoogle = async (storeId: string) => {
    if (isFirebaseConfigured && auth && googleProvider) {
      await signInWithPopup(auth, googleProvider);
    }

    const foundStore = MOCK_STORES.find((s) => s.id === storeId) || MOCK_STORES[0];
    setRole('STORE');
    setStore(foundStore);
    setUser(null);
  };

  const loginAsAdmin = (password: string): boolean => {
    const envAdminPass = import.meta.env.VITE_ADMIN_PASSWORD || 'adminPass123!';
    if (password === envAdminPass) {
      setRole('ADMIN');
      setUser(null);
      setStore(null);
      return true;
    }
    return false;
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      try {
        await firebaseSignOut(auth);
      } catch (err) {
        console.warn('Firebase signout warning:', err);
      }
    }
    setRole('USER');
    setUser(null);
    setStore(null);
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        user,
        store,
        adminName,
        isFirebaseActive: isFirebaseConfigured,
        isAuthenticated: !!user,
        loginAsUser,
        registerAsUser,
        loginWithGoogle,
        loginAsStore,
        loginStoreWithGoogle,
        loginAsAdmin,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
