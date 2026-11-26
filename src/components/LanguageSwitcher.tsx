'use client';

import {usePathname, useRouter} from '@/i18n/navigation';
import {useLocale} from 'next-intl';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchTo = (next: 'zh' | 'en') => {
    if (next === locale) return;
    router.replace(pathname, {locale: next});
  };

  return (
    <div className="flex items-center rounded-full border border-white/25 p-0.5 text-sm">
      <button
        onClick={() => switchTo('zh')}
        className={`min-h-11 min-w-11 rounded-full px-1 py-2 transition ${
          locale === 'zh' ? 'bg-accent text-white' : 'text-white/80 hover:text-white'
        }`}
      >
        中
      </button>
      <button
        onClick={() => switchTo('en')}
        className={`min-h-11 min-w-11 rounded-full px-1 py-2 transition ${
          locale === 'en' ? 'bg-accent text-white' : 'text-white/80 hover:text-white'
        }`}
      >
        EN
      </button>
    </div>
  );
}
