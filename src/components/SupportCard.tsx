'use client';

import {useLocale, useTranslations} from 'next-intl';

const SUPPORT_EMAIL = 'qfs.polyu2026@gmail.com';

export default function SupportCard({topic}: {topic: string}) {
  const locale = useLocale();
  const t = useTranslations('assignmentCenter');
  const zh = locale === 'zh';
  const subject = zh ? `QFS 答疑预约：${topic}` : `QFS support request: ${topic}`;
  const body = zh
    ? `你好，QFS 团队：\n\n我想预约「${topic}」的答疑。\n我不理解的位置或代码行：\n我已经尝试过的方法：\n我方便的时间：\n\n谢谢！`
    : `Hello QFS team,\n\nI would like help with “${topic}”.\nThe explanation or code line I do not understand:\nWhat I have tried:\nTimes I am available:\n\nThank you!`;
  const href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return (
    <aside className="mt-4 rounded-lg border border-accent/30 bg-accent-soft/40 p-4" aria-label={t('supportTitle')}>
      <h3 className="text-sm font-semibold text-navy">{t('supportTitle')}</h3>
      <p className="mt-1 text-sm leading-6 text-navy/70">{t('supportBody')}</p>
      <a
        href={href}
        className="mt-3 inline-flex min-h-11 cursor-pointer items-center rounded-full bg-navy px-4 py-2 text-sm font-medium text-white transition hover:bg-navy/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {t('supportCta')} ↗
      </a>
      <p className="mt-2 break-all text-xs text-navy/55">{SUPPORT_EMAIL}</p>
    </aside>
  );
}
