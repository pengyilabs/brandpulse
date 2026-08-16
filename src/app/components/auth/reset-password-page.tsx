import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { supabase } from '@/lib/supabase';
import { Lock, Eye, EyeOff, KeyRound, ArrowLeft } from 'lucide-react';

interface ResetPasswordForm {
  password: string;
  confirmPassword: string;
}

export function ResetPasswordPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasHash, setHasHash] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<ResetPasswordForm>();

  const password = watch('password');

  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes('type=recovery')) {
      setHasHash(true);
    }
  }, []);

  const onSubmit = async (data: ResetPasswordForm) => {
    setError('');
    setSuccess('');
    setLoading(true);
    const { error: authError } = await supabase.auth.updateUser({
      password: data.password,
    });
    setLoading(false);
    if (authError) {
      setError(authError.message);
    } else {
      setSuccess(t('auth.passwordUpdated'));
      setTimeout(() => navigate('/login'), 2000);
    }
  };

  if (!hasHash) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">{t('auth.invalidResetLink')}</h1>
          <p className="text-sm text-muted-foreground mb-6">{t('auth.invalidResetLinkDesc')}</p>
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {t('auth.backToLogin')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">{t('auth.resetPasswordTitle')}</h1>
          <p className="text-sm text-muted-foreground">{t('auth.resetPasswordDesc')}</p>
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

          {!success && (
            <>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">{t('auth.newPassword')}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', {
                      required: t('auth.passwordRequired'),
                      minLength: { value: 6, message: t('auth.passwordMinLength') },
                    })}
                    placeholder={t('auth.newPasswordPlaceholder')}
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
                <label className="block text-sm font-medium text-foreground mb-1.5">{t('auth.confirmNewPassword')}</label>
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
                <KeyRound className="w-4 h-4" />
                {loading ? t('auth.updatingPassword') : t('auth.updatePassword')}
              </button>
            </>
          )}

          <Link
            to="/login"
            className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {t('auth.backToLogin')}
          </Link>
        </form>
      </div>
    </div>
  );
}