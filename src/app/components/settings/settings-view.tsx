import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/app/stores/auth-store';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Separator } from '@/app/components/ui/separator';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/app/components/ui/alert-dialog';
import { User, Mail, Key, AlertTriangle, LogOut, CheckCircle, XCircle } from 'lucide-react';

export function SettingsView() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, signOut } = useAuthStore();

  // Profile state
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState('');

  // Email state
  const [newEmail, setNewEmail] = useState('');
  const [emailSaving, setEmailSaving] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [emailError, setEmailError] = useState('');

  // Password state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.user_metadata?.name || '');
      setAvatarUrl(user.user_metadata?.avatar_url || '');
    }
  }, [user]);

  const handleSaveProfile = async () => {
    setProfileSaving(true);
    setProfileSuccess(false);
    setProfileError('');
    try {
      const { error } = await supabase.auth.updateUser({
        data: { name, avatar_url: avatarUrl },
      });
      if (error) throw error;
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err: any) {
      setProfileError(err.message || t('settings.profile.error'));
    } finally {
      setProfileSaving(false);
    }
  };

  const handleUpdateEmail = async () => {
    setEmailSaving(true);
    setEmailSuccess(false);
    setEmailError('');
    try {
      const { error } = await supabase.auth.updateUser({
        email: newEmail,
      });
      if (error) throw error;
      setEmailSuccess(true);
      setNewEmail('');
      setTimeout(() => setEmailSuccess(false), 5000);
    } catch (err: any) {
      setEmailError(err.message || t('settings.email.error'));
    } finally {
      setEmailSaving(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordError(t('settings.password.mismatch'));
      return;
    }
    setPasswordSaving(true);
    setPasswordSuccess(false);
    setPasswordError('');
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      setPasswordSuccess(true);
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err: any) {
      setPasswordError(err.message || t('settings.password.error'));
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-foreground mb-2">{t('settings.title')}</h1>
          <p className="text-muted-foreground">{t('settings.description')}</p>
        </div>

        {/* ── Profile Section ── */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              <CardTitle>{t('settings.profile.title')}</CardTitle>
            </div>
            <CardDescription>{t('settings.profile.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('settings.profile.nameLabel')}</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('settings.profile.namePlaceholder')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="avatar">{t('settings.profile.avatarLabel')}</Label>
              <Input
                id="avatar"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder={t('settings.profile.avatarPlaceholder')}
              />
              {avatarUrl && (
                <div className="mt-2">
                  <img
                    src={avatarUrl}
                    alt="Avatar preview"
                    className="w-16 h-16 rounded-full object-cover border border-border"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={handleSaveProfile}
                disabled={profileSaving}
              >
                {profileSaving ? t('settings.saving') : t('settings.profile.save')}
              </Button>
              {profileSuccess && (
                <span className="flex items-center gap-1 text-sm text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  {t('settings.profile.saved')}
                </span>
              )}
              {profileError && (
                <span className="flex items-center gap-1 text-sm text-destructive">
                  <XCircle className="w-4 h-4" />
                  {profileError}
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ── Email Section ── */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              <CardTitle>{t('settings.email.title')}</CardTitle>
            </div>
            <CardDescription>{t('settings.email.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{t('settings.email.currentLabel')}</Label>
              <div className="p-2.5 bg-muted rounded-md text-sm text-muted-foreground">
                {user?.email || '—'}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="newEmail">{t('settings.email.newLabel')}</Label>
              <Input
                id="newEmail"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder={t('settings.email.newPlaceholder')}
              />
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={handleUpdateEmail}
                disabled={emailSaving || !newEmail}
              >
                {emailSaving ? t('settings.saving') : t('settings.email.save')}
              </Button>
              {emailSuccess && (
                <span className="flex items-center gap-1 text-sm text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  {t('settings.email.saved')}
                </span>
              )}
              {emailError && (
                <span className="flex items-center gap-1 text-sm text-destructive">
                  <XCircle className="w-4 h-4" />
                  {emailError}
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ── Password Section ── */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-primary" />
              <CardTitle>{t('settings.password.title')}</CardTitle>
            </div>
            <CardDescription>{t('settings.password.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">{t('settings.password.newLabel')}</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={t('settings.password.newPlaceholder')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t('settings.password.confirmLabel')}</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t('settings.password.confirmPlaceholder')}
              />
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={handleUpdatePassword}
                disabled={passwordSaving || !newPassword || !confirmPassword}
              >
                {passwordSaving ? t('settings.saving') : t('settings.password.save')}
              </Button>
              {passwordSuccess && (
                <span className="flex items-center gap-1 text-sm text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  {t('settings.password.saved')}
                </span>
              )}
              {passwordError && (
                <span className="flex items-center gap-1 text-sm text-destructive">
                  <XCircle className="w-4 h-4" />
                  {passwordError}
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ── Danger Zone ── */}
        <Card className="border-destructive/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <CardTitle className="text-destructive">{t('settings.danger.title')}</CardTitle>
            </div>
            <CardDescription>{t('settings.danger.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  {t('settings.danger.logout')}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('settings.danger.logoutConfirm')}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t('settings.danger.logoutDesc')}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLogout} className="bg-destructive hover:bg-destructive/90">
                    {t('settings.danger.logout')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}