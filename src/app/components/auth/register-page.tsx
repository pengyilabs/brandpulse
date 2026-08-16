import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/app/stores/auth-store';
import { Mail, Lock, Eye, EyeOff, UserPlus } from 'lucide-react';

interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
}

export function RegisterPage() {
  const { t } = useTranslation();
  const { user, initialized } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>();

  const password = watch('password');

  const onSubmit = async (data: RegisterForm) => {
    setError('');
    setSuccess('');
    setLoading(true);
    const { error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });
    setLoading(false);
    if (authError) {
      setError(authError.message);
    } else {
      setSuccess(t('auth.checkEmail'));
    }
  };

  if (initialized && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">{t('auth.registerTitle')}</h1>
          <p className="text-sm text-muted-foreground">{t('auth.registerDesc')}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-card border border-border rounded-2xl p-6 space-y-5">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg p-3">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm rounded-lg p-3">
              {success}
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
                {...register('password', {
                  required: t('auth.passwordRequired'),
                  minLength: { value: 6, message: t('auth.passwordMinLength') },
                })}
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

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">{t('auth.confirmPassword')}</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('confirmPassword', {
                  required: t('auth.confirmPasswordRequired'),
                  validate: (value) => value === password || t('auth.passwordsMismatch'),
                })}
                placeholder={t('auth.confirmPasswordPlaceholder')}
                className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            {errors.confirmPassword && <p className="text-xs text-destructive mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <UserPlus className="w-4 h-4" />
            {loading ? t('auth.creatingAccount') : t('auth.createAccount')}
          </button>

          <p className="text-center text-sm text-muted-foreground">
            {t('auth.alreadyHaveAccount')}{' '}
            <Link to="/login" className="text-primary hover:text-primary/80 transition-colors font-medium">
              {t('auth.signIn')}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}