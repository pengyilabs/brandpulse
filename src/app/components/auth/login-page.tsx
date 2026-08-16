import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/app/stores/auth-store';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';

interface LoginForm {
  email: string;
  password: string;
}

export function LoginPage() {
  const { t } = useTranslation();
  const { user, initialized } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setError('');
    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    setLoading(false);
    if (authError) {
      setError(authError.message);
    }
  };

  if (initialized && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">{t('auth.loginTitle')}</h1>
          <p className="text-sm text-muted-foreground">{t('auth.loginDesc')}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-card border border-border rounded-2xl p-6 space-y-5">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg p-3">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">{t('auth.email')}</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                {...register('email', { required: t('auth.emailRequired') })}
                placeholder={t('auth.emailPlaceholder')}
                className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">{t('auth.password')}</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password', { required: t('auth.passwordRequired') })}
                placeholder={t('auth.passwordPlaceholder')}
                className="w-full pl-10 pr-10 py-2.5 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <LogIn className="w-4 h-4" />
            {loading ? t('auth.signingIn') : t('auth.signIn')}
          </button>

          <div className="flex items-center justify-between text-sm">
            <Link to="/forgot-password" className="text-muted-foreground hover:text-primary transition-colors">
              {t('auth.forgotPassword')}
            </Link>
            <Link to="/register" className="text-primary hover:text-primary/80 transition-colors font-medium">
              {t('auth.createAccount')}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}