import type React from 'react';
import { Code2 } from 'lucide-react';
import {
  SyOfficialIcon,
  RoznamaIcon,
  PhonebookIcon,
  SyIdIcon,
  PartyIcon,
  TierlistIcon,
  HouseIcon,
  CompassIcon,
  PrioritiesIcon,
  SitesIcon,
  PopulationIcon,
  GovAppsIcon,
  TransitIcon,
  JusticeIcon,
  CrossingsIcon,
  MishwarIcon,
  BoardIcon,
  MuslimIcon,
  GamesIcon,
  RecipesIcon,
  NewsIcon,
  AnswersIcon,
  CodexCommunityIcon,
} from '@/Components/Icons/ProjectIcons';

// Single source of truth for the site's tool links, shared by the homepage's
// app grid and the navbar's mega menu so the two can never drift apart (the way
// `GAMES` drives the games hub). Order here is the order both surfaces render;
// a tool becomes reachable by adding one entry here.
export interface SiteLink {
  href: string;
  text: string;
  icon?: React.ComponentType<{ className?: string }> | null;
  /** An image mark instead of an icon (favicon/logo/flag). */
  image?: string;
  /** The Syrian flag mark (uses the bundled flag SVG). */
  isFlag?: boolean;
  /** Leaves the site, so it opens in a new tab rather than routing. */
  external?: boolean;
  /** Belongs in the homepage's internal tools grid (vs the external section). */
  isInternal?: boolean;
}

export const SITE_LINKS: SiteLink[] = [
  { href: '/roznama', icon: RoznamaIcon, text: 'الروزنامة', isInternal: true },
  { href: '/muslim', icon: MuslimIcon, text: 'الركن الإسلامي', isInternal: true },
  { href: '/games', icon: GamesIcon, text: 'الألعاب', isInternal: true },
  { href: '/transit', icon: TransitIcon, text: 'ترانزيت', isInternal: true },
  { href: '/mishwar', icon: MishwarIcon, text: 'مشوار', isInternal: true },
  { href: '/board', icon: BoardIcon, text: 'لوح', isInternal: true },
  { href: '/compass', icon: CompassIcon, text: 'البوصلة السياسية', isInternal: true },
  { href: '/tierlist', icon: TierlistIcon, text: 'تقييم الحكومة', isInternal: true },
  { href: '/priorities', icon: PrioritiesIcon, text: 'أولويات سوريا', isInternal: true },
  { href: '/crossings', icon: CrossingsIcon, text: 'المنافذ الحدودية', isInternal: true },
  { href: 'https://food.syrian.zone', icon: RecipesIcon, text: 'وصفاتنا', external: true, isInternal: true },
  { href: 'https://answers.syrian.zone', icon: AnswersIcon, text: 'إجابات سوريا', external: true, isInternal: true },
  { href: '/syofficial', icon: SyOfficialIcon, text: 'الحسابات الرسمية', isInternal: true },
  { href: '/phonebook', icon: PhonebookIcon, text: 'دليل الهاتف', isInternal: true },
  { href: '/sites', icon: SitesIcon, text: 'دليل المواقع', isInternal: true },
  { href: '/syrian-contributors', icon: Code2, text: 'المساهمون', isInternal: true },
  { href: '/govapps', icon: GovAppsIcon, text: 'تطبيقات الحكومة', isInternal: true },
  { href: '/party', icon: PartyIcon, text: 'دليل الأحزاب', isInternal: true },
  { href: '/house', icon: HouseIcon, text: 'المجلس التشريعي', isInternal: true },
  { href: '/justice', icon: JusticeIcon, text: 'العدالة الانتقالية', isInternal: true },
  { href: '/syid', icon: SyIdIcon, text: 'الهوية البصرية', isInternal: true },
  { href: '/atlas', icon: PopulationIcon, text: 'أطلس', isInternal: true },
  { href: 'https://discord.gg/NqE8849VzA', icon: CodexCommunityIcon, text: 'مجتمع كوديكس', external: true, isInternal: true },
  { href: 'https://chromewebstore.google.com/detail/syrian-flag-replacer/dngipobppehfhfggmbdiiiodgcibdeog', icon: null, image: '/flag-replacer/1f1f8-1f1fe.svg', text: 'مبدل العلم', external: true, isInternal: true },
  { href: 'https://joory.chat', icon: null, image: 'https://joory.chat/favicon.svg', text: 'جوري AI', external: true },
  { href: 'https://jard.chat', icon: null, image: 'https://jard.chat/images/logo-light.svg', text: 'جرد', external: true },
  { href: 'https://news.jard.chat', icon: NewsIcon, text: 'أخبار سوريا', external: true },
];
