'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';
import {useRouter} from '@/i18n/navigation';
import {createClient} from '@/lib/supabase/browser';

type Mode = 'login' | 'signup';

const ALLOWED = ['@polyu.edu.hk', '@connect.polyu.hk'];

export default function AuthPage() {
  const t = useTranslations('auth');
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const validEmail = ALLOWED.some((s) => email.toLowerCase().endsWith(s));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setNotice('');
    if (mode === 'signup' && !validEmail) {
      setError(t('schoolEmailOnly'));
      return;
    }
    setBusy(true);
    const supabase = createClient();
    try {
      if (mode === 'signup') {
        const {error} = await supabase.auth.signUp({email, password});
        if (error) {
          setError(error.message);
        } else {
          setNotice(t('checkEmail'));
        }
      } else {
        const {error} = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) {
          setError(error.message);
        } else {
          router.push('/');
        }
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-bold">{t('title')}</h1>

      <div className="mt-6 flex rounded-full bg-navy/5 p-1 text-sm">
        {(['login', 'signup'] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              setError('');
              setNotice('');
            }}
            className={`flex-1 rounded-full py-1.5 transition ${
              mode === m ? 'bg-navy text-white' : 'text-navy/60'
            }`}
          >
            {t(m)}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="mt-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-navy/80">
            {t('email')}
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@connect.polyu.hk"
            className="mt-1 w-full rounded-lg border border-navy/15 px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-navy/80">
            {t('password')}
          </label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-navy/15 px-3 py-2 text-sm outline-none focus:border-accent"
          />
          {mode === 'signup' && (
            <p className="mt-1 text-xs text-navy/50">{t('passwordHint')}</p>
          )}
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
        {notice && (
          <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
            {notice}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-navy py-2.5 text-sm font-medium text-white transition hover:bg-navy/90 disabled:opacity-40"
        >
          {busy ? '…' : mode === 'login' ? t('login') : t('signup')}
        </button>
      </form>

      <p className="mt-4 text-center text-xs text-navy/50">
        {t('schoolEmailNote')}
      </p>
    </div>
  );
}
