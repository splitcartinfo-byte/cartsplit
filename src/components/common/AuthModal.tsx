import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePlatform } from '../../context/PlatformContext';
import { User, Store, ShieldCheck, X, Lock, Mail, Key, Sparkles, Building, Phone, MapPin, Tag, ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'user' | 'store' | 'admin';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'user',
}) => {
  const {
    role,
    user,
    store,
    isFirebaseActive,
    loginAsUser,
    registerAsUser,
    loginWithGoogle,
    loginAsStore,
    loginStoreWithGoogle,
    loginAsAdmin,
    logout,
  } = useAuth();
  const { stores, brands, registerStore, addBrand } = usePlatform();

  const [activeTab, setActiveTab] = useState<'user' | 'store' | 'admin'>(initialTab);
  const [userAuthMode, setUserAuthMode] = useState<'login' | 'register'>('login');
  
  // Store Auth & 2-Step Registration State
  const [storeAuthMode, setStoreAuthMode] = useState<'login' | 'register'>('login');
  const [storeRegStep, setStoreRegStep] = useState<1 | 2>(1);

  // User Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Store Registration Form fields
  const [storeEmail, setStoreEmail] = useState('');
  const [storePassword, setStorePassword] = useState('');
  const [storeNameInput, setStoreNameInput] = useState('');
  const [brandQuery, setBrandQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<{ id: string; name: string } | null>(null);
  const [brandRequested, setBrandRequested] = useState(false);
  const [storeAddressInput, setStoreAddressInput] = useState('');
  const [storePhoneInput, setStorePhoneInput] = useState('');
  const [selectedStoreId, setSelectedStoreId] = useState<string>(stores[0]?.id || '');

  // Admin login fields
  const [adminPassword, setAdminPassword] = useState<string>('');
  const [adminError, setAdminError] = useState<string>('');

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  // Filter approved brands for dropdown search
  const approvedBrands = brands.filter((b) => b.approvedByAdmin);
  const matchingBrands = approvedBrands.filter((b) =>
    b.name.toLowerCase().includes(brandQuery.toLowerCase())
  );

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      if (userAuthMode === 'register') {
        if (!name || !email || !password) {
          throw new Error('Please fill in all fields.');
        }
        await registerAsUser(email, password, name);
      } else {
        if (!email || !password) {
          await loginAsUser();
        } else {
          await loginAsUser(email, password);
        }
      }
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Check credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleAuth = async () => {
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      if (activeTab === 'store') {
        await loginStoreWithGoogle(selectedStoreId);
      } else {
        await loginWithGoogle();
      }
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Google Authentication failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStoreRegisterStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeEmail || !storePassword || storePassword.length < 6) {
      setErrorMsg('Enter a valid email and password (min 6 chars).');
      return;
    }
    setErrorMsg('');
    setStoreRegStep(2);
  };

  const handleRequestBrandForApproval = () => {
    if (!brandQuery.trim()) return;
    const newBrand = addBrand(brandQuery.trim(), false);
    setSelectedBrand({ id: newBrand.id, name: newBrand.name });
    setBrandRequested(true);
  };

  const handleStoreRegisterStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeNameInput.trim() || !storeAddressInput.trim()) {
      setErrorMsg('Store Name and Address are required.');
      return;
    }

    const createdStore = registerStore({
      name: storeNameInput,
      storeName: storeNameInput,
      email: storeEmail,
      ownerEmail: storeEmail,
      phone: storePhoneInput,
      address: storeAddressInput,
      brandId: selectedBrand?.id,
      brandName: selectedBrand?.name,
      status: 'PENDING',
      approved: false,
    });

    loginAsStore(createdStore.id, storeEmail, storePassword);
    onClose();
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAsAdmin(adminPassword);
    if (success) {
      setAdminError('');
      onClose();
    } else {
      setAdminError('Invalid Admin credentials.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="w-full max-w-md bg-white text-slate-900 border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-extrabold text-slate-900">
              {activeTab === 'user'
                ? 'Shopper Sign In / Register'
                : activeTab === 'store'
                ? 'Store Partner Portal'
                : 'Admin Operations Entry'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-900">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* SHOPPER TAB */}
          {activeTab === 'user' && (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl flex items-center gap-3">
                <User className="w-6 h-6 text-blue-600 shrink-0" />
                <div className="text-xs">
                  <p className="font-extrabold text-blue-900">Shopper Account</p>
                  <p className="text-blue-700">Browse offers, form shopping groups, & chat with members.</p>
                </div>
              </div>

              {user && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-1">
                  <p className="text-slate-500 font-bold">Authenticated As:</p>
                  <p className="font-extrabold text-slate-900 text-sm">{user.name}</p>
                  <p className="text-slate-600">{user.email}</p>
                </div>
              )}

              <form onSubmit={handleUserSubmit} className="space-y-3 text-xs">
                {userAuthMode === 'register' && (
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Full Name</label>
                    <input
                      type="text"
                      placeholder="Sumit Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="email"
                      placeholder="shopper@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Password</label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                </div>

                {errorMsg && <p className="text-rose-600 font-bold">{errorMsg}</p>}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl shadow-lg transition-all"
                >
                  {isSubmitting
                    ? 'Authenticating...'
                    : userAuthMode === 'register'
                    ? 'Create Account'
                    : email
                    ? 'Sign In with Email'
                    : 'Quick Demo Sign In'}
                </button>
              </form>

              <div className="pt-2 border-t border-slate-200 space-y-2">
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-xs flex items-center justify-center gap-2.5 shadow-sm transition-all"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <div className="flex items-center justify-between text-[11px] pt-1">
                  <button
                    type="button"
                    onClick={() => setUserAuthMode(userAuthMode === 'login' ? 'register' : 'login')}
                    className="text-slate-600 hover:text-slate-900 font-bold underline"
                  >
                    {userAuthMode === 'login' ? "Don't have an account? Register" : 'Already have an account? Sign In'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STORE OWNER TAB */}
          {activeTab === 'store' && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
                <Store className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-extrabold text-emerald-900">Store Owner Partner Portal</p>
                  <p className="text-emerald-700">Manage store offers, receive group visit alerts, & track status.</p>
                </div>
              </div>

              {/* Mode Toggle: Login vs Register */}
              <div className="flex border-b border-slate-200 pb-2 gap-4 font-bold">
                <button
                  onClick={() => setStoreAuthMode('login')}
                  className={`pb-1 border-b-2 transition-all ${
                    storeAuthMode === 'login' ? 'border-emerald-600 text-slate-900' : 'border-transparent text-slate-400'
                  }`}
                >
                  Store Login
                </button>
                <button
                  onClick={() => { setStoreAuthMode('register'); setStoreRegStep(1); }}
                  className={`pb-1 border-b-2 transition-all ${
                    storeAuthMode === 'register' ? 'border-emerald-600 text-slate-900' : 'border-transparent text-slate-400'
                  }`}
                >
                  Store Registration
                </button>
              </div>

              {/* STORE LOGIN FLOW */}
              {storeAuthMode === 'login' && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!storeEmail || !storePassword) {
                      setErrorMsg('Please enter store owner email and password.');
                      return;
                    }
                    const foundStore = stores.find((s) => s.ownerEmail === storeEmail || s.email === storeEmail) || stores[0];
                    if (foundStore) {
                      loginAsStore(foundStore.id, storeEmail, storePassword);
                      onClose();
                    } else {
                      setErrorMsg('No store registered with this email.');
                    }
                  }}
                  className="space-y-3"
                >
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Store Owner Email</label>
                    <input
                      type="email"
                      required
                      placeholder="storeowner@example.com"
                      value={storeEmail}
                      onChange={(e) => setStoreEmail(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Password</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={storePassword}
                      onChange={(e) => setStorePassword(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {errorMsg && <p className="text-rose-600 font-bold">{errorMsg}</p>}

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl shadow-lg transition-all"
                  >
                    Sign In to Store Dashboard
                  </button>

                  <div className="relative my-2">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-white px-2 text-slate-400 font-semibold">Or</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleAuth}
                    className="w-full py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-extrabold flex items-center justify-center gap-2.5 shadow-sm transition-all"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>Continue with Google</span>
                  </button>
                </form>
              )}

              {/* STORE 2-STEP REGISTRATION FLOW */}
              {storeAuthMode === 'register' && (
                <div>
                  {storeRegStep === 1 && (
                    <form onSubmit={handleStoreRegisterStep1} className="space-y-3">
                      <div className="p-2 bg-slate-100 rounded-lg text-[11px] font-bold text-slate-700">
                        Step 1 of 2: Create Store Manager Credentials
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Store Owner Email</label>
                        <input
                          type="email"
                          required
                          placeholder="storeowner@example.com"
                          value={storeEmail}
                          onChange={(e) => setStoreEmail(e.target.value)}
                          className="w-full p-2.5 border border-slate-300 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Password (min 6 chars)</label>
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          value={storePassword}
                          onChange={(e) => setStorePassword(e.target.value)}
                          className="w-full p-2.5 border border-slate-300 rounded-xl"
                        />
                      </div>
                      {errorMsg && <p className="text-rose-600 font-bold">{errorMsg}</p>}
                      <button
                        type="submit"
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl shadow-sm flex items-center justify-center gap-1.5"
                      >
                        <span>Next: Store Details</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <div className="relative my-2">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-slate-200" />
                        </div>
                        <div className="relative flex justify-center text-xs">
                          <span className="bg-white px-2 text-slate-400 font-semibold">Or</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleGoogleAuth}
                        className="w-full py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-extrabold flex items-center justify-center gap-2.5 shadow-sm transition-all"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                        </svg>
                        <span>Continue with Google</span>
                      </button>
                    </form>
                  )}

                  {storeRegStep === 2 && (
                    <form onSubmit={handleStoreRegisterStep2} className="space-y-3">
                      <div className="p-2 bg-slate-100 rounded-lg text-[11px] font-bold text-slate-700">
                        Step 2 of 2: Store Profile & Brand Details
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Store Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Nike Store Connaught Place"
                          value={storeNameInput}
                          onChange={(e) => setStoreNameInput(e.target.value)}
                          className="w-full p-2.5 border border-slate-300 rounded-xl"
                        />
                      </div>

                      {/* Brand Search & Dropdown */}
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Brand Search</label>
                        <input
                          type="text"
                          placeholder="Type brand name (e.g. Nike, Zara, Levi's)..."
                          value={brandQuery}
                          onChange={(e) => {
                            setBrandQuery(e.target.value);
                            setSelectedBrand(null);
                            setBrandRequested(false);
                          }}
                          className="w-full p-2.5 border border-slate-300 rounded-xl"
                        />

                        {/* Matching Brands Dropdown */}
                        {brandQuery && !selectedBrand && matchingBrands.length > 0 && (
                          <div className="mt-1 p-2 bg-white border border-slate-200 rounded-xl shadow-md max-h-32 overflow-y-auto space-y-1">
                            {matchingBrands.map((b) => (
                              <button
                                key={b.id}
                                type="button"
                                onClick={() => setSelectedBrand({ id: b.id, name: b.name })}
                                className="w-full text-left p-1.5 hover:bg-slate-100 rounded-lg text-xs font-bold text-slate-800"
                              >
                                {b.name}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Confirmed Brand Selection */}
                        {selectedBrand && (
                          <div className="mt-1 p-2 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-bold flex items-center justify-between">
                            <span>Selected Brand: {selectedBrand.name}</span>
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                          </div>
                        )}

                        {/* Yellow Alert Box: Brand Not Found -> Add for Approval */}
                        {brandQuery && !selectedBrand && matchingBrands.length === 0 && (
                          <div className="mt-2 p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl space-y-2">
                            <p className="font-bold">This brand was not found in approved list.</p>
                            {!brandRequested ? (
                              <button
                                type="button"
                                onClick={handleRequestBrandForApproval}
                                className="px-3 py-1.5 bg-amber-600 text-white font-bold rounded-lg text-xs shadow-xs"
                              >
                                Add "{brandQuery}" for Admin Approval
                              </button>
                            ) : (
                              <p className="text-emerald-700 font-bold">Brand submitted for approval!</p>
                            )}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Full Store Address</label>
                        <textarea
                          rows={2}
                          required
                          placeholder="Store address & landmark..."
                          value={storeAddressInput}
                          onChange={(e) => setStoreAddressInput(e.target.value)}
                          className="w-full p-2.5 border border-slate-300 rounded-xl"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Phone Number (Optional)</label>
                        <input
                          type="tel"
                          placeholder="+91 98765 43210"
                          value={storePhoneInput}
                          onChange={(e) => setStorePhoneInput(e.target.value)}
                          className="w-full p-2.5 border border-slate-300 rounded-xl"
                        />
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setStoreRegStep(1)}
                          className="px-4 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl shadow-sm"
                        >
                          Submit for Approval
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ADMIN TAB */}
          {activeTab === 'admin' && (
            <form onSubmit={handleAdminSubmit} className="space-y-4 text-xs">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-amber-600 shrink-0" />
                <div>
                  <p className="font-extrabold text-amber-900">Platform Operations Portal</p>
                  <p className="text-amber-700">Protected admin moderation & management area.</p>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Admin Passkey</label>
                <input
                  type="password"
                  placeholder="Enter secret passkey set in .env (e.g. adminPass123!)"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {adminError && <p className="text-rose-600 font-bold">{adminError}</p>}

              <button
                type="submit"
                className="w-full py-3.5 bg-amber-600 hover:bg-amber-500 text-white font-extrabold rounded-xl shadow-lg flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>Enter Admin Panel</span>
              </button>
            </form>
          )}

          {role !== 'USER' && (
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="w-full py-2.5 bg-slate-100 text-slate-600 hover:text-slate-900 font-bold rounded-xl text-xs"
            >
              Sign Out & Return to Guest Mode
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
