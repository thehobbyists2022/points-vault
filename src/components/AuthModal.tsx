import React, { useState } from 'react';
import { Mail, Lock, LogIn, UserPlus, X, ShieldCheck, Cloud, Loader2, AlertCircle } from 'lucide-react';
import { signIn, signUp } from '../lib/supabase';
import { useAppStore } from '../store/useAppStore';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (userId: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const language = useAppStore(s => s.language);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const result = mode === 'signin'
        ? await signIn(email, password)
        : await signUp(email, password);

      if (result.error) {
        setError(result.error.message);
      } else if (result.data.user) {
        const userId = result.data.user.id;
        if (mode === 'signup') {
          setSuccessMsg(language === 'en'
            ? 'Account created! Check your email to verify, then sign in.'
            : '帳號已創建！請查看郵件完成驗證後登入。'
          );
        } else {
          onSuccess(userId);
          onClose();
        }
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="w-full max-w-md glass-panel rounded-3xl border border-slate-800 p-8 space-y-6 shadow-2xl bg-[#0b101d]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/30 rounded-xl">
              <Cloud className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {language === 'en' ? 'Sign In to Sync' : '登入啟用雲端同步'}
              </h3>
              <p className="text-xs text-slate-400">
                {language === 'en' ? 'Secure cloud backup across devices' : '跨設備安全備份與同步'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center bg-slate-950/80 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => { setMode('signin'); setError(null); }}
            className={`flex-1 flex items-center justify-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              mode === 'signin' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'Sign In' : '登入'}</span>
          </button>
          <button
            onClick={() => { setMode('signup'); setError(null); }}
            className={`flex-1 flex items-center justify-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              mode === 'signup' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'Create Account' : '創建帳號'}</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>Email</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>{language === 'en' ? 'Password' : '密碼'}</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Error / Success Messages */}
          {error && (
            <div className="flex items-center space-x-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {successMsg && (
            <div className="flex items-center space-x-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-60 text-white text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98]"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : mode === 'signin' ? (
              <>
                <Cloud className="w-4 h-4" />
                <span>{language === 'en' ? 'Sign In & Sync' : '登入並同步資料'}</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>{language === 'en' ? 'Create Account' : '創建帳號'}</span>
              </>
            )}
          </button>
        </form>

        {/* Skip Note */}
        <p className="text-center text-[11px] text-slate-600">
          {language === 'en'
            ? 'You can use PointsVault offline without signing in. Your data stays on this device.'
            : '不登入也可繼續使用，所有資料保存於本機。登入後可跨設備同步。'}
        </p>
      </div>
    </div>
  );
};
