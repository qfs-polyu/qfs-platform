'use client';

import {useTranslations} from 'next-intl';
import {Link, usePathname} from '@/i18n/navigation';
import LanguageSwitcher from './LanguageSwitcher';
import AuthButton from './AuthButton';

export default function Header() {
  const t = useTranslations('nav');
  const pathname = usePathname();

  const items = [
    {href: '/', label: t('home')},
    {href: '/learn', label: t('learn')},
    {href: '/assignments', label: t('assignments')},
    {href: '/leaderboard', label: t('leaderboard')}
  ];

  return (
    <header className="sticky top-0 z-40 bg-navy text-white shadow-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-6 px-4">
        <Link href="/" className="flex items-center gap-2 font-bold tracking-wide">
          <span className="flex h-7 w-7 items-center justify-center rounded bg-accent text-sm">
            Q
          </span>
          QFS
        </Link>
        <nav className="ml-auto flex items-center gap-1 text-sm md:gap-2">
          {items.map((item) => {
            const active =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3 py-1.5 transition ${
                  active
                    ? 'bg-white/15 font-medium'
                    : 'text-white/75 hover:bg-white/10 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-1 md:ml-3">
          <AuthButton />
        </div>
        <div className="ml-1 md:ml-2">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
