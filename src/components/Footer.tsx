import {useTranslations} from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="mt-16 border-t border-navy/10 bg-surface">
      <div className="mx-auto max-w-5xl px-4 py-6 text-center text-xs leading-relaxed text-navy/70">
        <p className="mx-auto max-w-3xl">{t('disclaimer')}</p>
        <p className="mt-2 text-navy/50">{t('org')}</p>
      </div>
    </footer>
  );
}
