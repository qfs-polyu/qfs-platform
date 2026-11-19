'use client';

import {useEffect, useState} from 'react';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {createClient} from '@/lib/supabase/browser';

export default function AuthButton() {
  const t = useTranslations('auth');
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({data}) => {
      setEmail(data.session?.user?.email ?? null);
      setLoading(false);
    });
    const {
      data: {subscription}
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
  };

  if (loading) {
    return <span className="text-xs text-white/50">…</span>;
  }

  if (!email) {
    return (
      <Link
        href="/auth"
        className="rounded-full bg-accent px-3.5 py-1.5 text-sm font-medium text-white transition hover:bg-accent/90"
      >
        {t('loginSignup')}
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span
        className="hidden max-w-36 truncate text-xs text-white/70 md:inline"
        title={email}
      >
        {email}
      </span>
      <button
        onClick={signOut}
        className="rounded-full border border-white/25 px-3 py-1.5 text-xs text-white/80 transition hover:text-white"
      >
        {t('logout')}
      </button>
    </div>
  );
}
