import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { supabase } from '@/lib/supabase';
import { Mail, ArrowLeft, Send } from 'lucide-react';

interface ForgotPasswordForm {
  email: string;
}

export function ForgotPasswordPage() {
  const { t } = useTranslation();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordForm>();

  const onSubmit = async (data: ForgotPasswordForm) => {
    setError('');
    setSuccess('');
    setLoading(true);
    const { error: authError } = await supabase.auth.resetPasswordForEmail(data.email);
    setLoading(false);
    if (authError) {
      setError(authError.message);
    } else {
      setSuccess(t('auth.passwordResetSent'));
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">{t('auth.forgotPasswordTitle')}</h1>
          <p className="text-sm text-muted-foreground">{t('auth.forgotPasswordDesc')}</p>
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

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {loading ? t('auth.sending') : t('auth.sendResetLink')}
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