import { IconBriefcase, IconHome, IconMessage, IconUser } from '@tabler/icons-react';
import { useLocation } from 'wouter';
import { FloatingNav } from '@/components/ui/floating-navbar';
import { useLanguage } from '@/i18n/LanguageContext';

export function Navbar() {
  const { t } = useLanguage();
  const [location] = useLocation();
  const onHome = location === '/';

  const sectionLink = (hash: string) => (onHome ? hash : `/${hash}`);

  const navItems = [
    {
      name: t.nav.home,
      link: '/',
      icon: <IconHome className="h-4 w-4 text-neutral-500" />,
    },
    {
      name: t.nav.about,
      link: sectionLink('#about'),
      icon: <IconUser className="h-4 w-4 text-neutral-500" />,
    },
    {
      name: t.nav.work,
      link: sectionLink('#work'),
      icon: <IconBriefcase className="h-4 w-4 text-neutral-500" />,
    },
    {
      name: t.nav.contact,
      link: sectionLink('#contact'),
      icon: <IconMessage className="h-4 w-4 text-neutral-500" />,
    },
  ];

  return <FloatingNav navItems={navItems} />;
}
