import React, { useMemo, useState } from 'react';
import { Link, router } from '@inertiajs/react';
import {
    ArrowRight,
    BookOpen,
    Compass,
    Home,
    MoonStar,
    RotateCcw,
    Search,
    Shuffle,
    Sparkles,
} from 'lucide-react';
import MainLayout from '@/Layouts/MainLayout';
import { Button } from '@/Components/ui/button';
import { SITE_LINKS, type SiteLink } from '@/Lib/siteLinks';
import {
    MuslimIcon,
    QuranIcon,
    QuranRadioIcon,
    RoznamaIcon,
    TransitIcon,
    MishwarIcon,
    CrossingsIcon,
    PopulationIcon,
    GamesIcon,
} from '@/Components/Icons/ProjectIcons';
import AyahMark from '@/Pages/Muslim/_components/ayah-mark/AyahMark';
import { useMuslimNav } from '@/Pages/Muslim/_lib/nav';
import { cn } from '@/lib/utils';

export type NotFoundSection = 'general' | 'transit' | 'games' | 'muslim';

interface NotFoundProps {
    status?: number;
    path?: string;
    section?: NotFoundSection;
}

function detectSectionFromPath(path: string): NotFoundSection {
    const clean = path.replace(/^\/+/, '').toLowerCase();
    if (clean === 'muslim' || clean.startsWith('muslim/')) return 'muslim';
    if (
        clean === 'games' ||
        clean.startsWith('games/') ||
        clean === 'guesswho' ||
        clean.startsWith('guesswho/')
    ) {
        return 'games';
    }
    if (
        clean === 'transit' ||
        clean.startsWith('transit/') ||
        clean === 'mishwar' ||
        clean.startsWith('mishwar/') ||
        clean === 'crossings' ||
        clean.startsWith('crossings/') ||
        clean === 'places' ||
        clean.startsWith('places/')
    ) {
        return 'transit';
    }
    return 'general';
}

const TRANSIT_LINES = [
    {
        code: 'T-01',
        href: '/transit',
        title: 'شبكة ترانزيت المدن',
        route: 'دمشق · حلب · حمص · اللاذقية',
        status: 'يعمل بانتظام',
        icon: TransitIcon,
    },
    {
        code: 'M-02',
        href: '/mishwar',
        title: 'دليل مشوار للأماكن',
        route: 'مطاعم · معالم · حدائق · مقاهي',
        status: 'مفتوح للزوار',
        icon: MishwarIcon,
    },
    {
        code: 'C-03',
        href: '/crossings',
        title: 'المنافذ الحدودية',
        route: 'حالة المعابر البرية والبحرية والجوية',
        status: 'تحديث يومي',
        icon: CrossingsIcon,
    },
    {
        code: 'A-04',
        href: '/atlas',
        title: 'أطلس السكان والمناخ',
        route: 'بيانات المحافظات والخرائط التفاعلية',
        status: 'متاح الآن',
        icon: PopulationIcon,
    },
];

const MUSLIM_TOOLS = [
    {
        href: '/muslim/prayer',
        title: 'مواقيت الصلاة',
        desc: 'المواقيت الدقيقة والعدّ التنازلي للصلاة القادمة في المحافظات السورية',
        icon: MuslimIcon,
    },
    {
        href: '/muslim/quran',
        title: 'قارئ القرآن الكريم',
        desc: 'مصحف المدينة النبوية برسم حفص مع التلاوات الصوتية والعلامات المرجعية',
        icon: QuranIcon,
    },
    {
        href: '/muslim/radio',
        title: 'إذاعة القرآن الكريم',
        desc: 'بث مباشر متواصل لتلاوات كبار القرّاء مع مؤقّت النوم',
        icon: QuranRadioIcon,
    },
];

export default function NotFound({ path = '/404', section }: NotFoundProps) {
    const resolvedSection: NotFoundSection = useMemo(() => {
        if (typeof window !== 'undefined') {
            const override = new URLSearchParams(window.location.search).get('section');
            if (
                override === 'general' ||
                override === 'transit' ||
                override === 'games' ||
                override === 'muslim'
            ) {
                return override;
            }
        }
        return section ?? detectSectionFromPath(path);
    }, [path, section]);

    const goBack = () => {
        if (typeof window !== 'undefined' && window.history.length > 1) {
            window.history.back();
        } else {
            router.visit('/');
        }
    };

    return (
        <MainLayout>
            <div className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden bg-background text-foreground pb-16">
                {resolvedSection === 'muslim' && <MuslimCornerVariant path={path} onBack={goBack} />}
                {resolvedSection === 'transit' && <TransitRouteVariant path={path} onBack={goBack} />}
                {resolvedSection === 'games' && <GameTableVariant path={path} onBack={goBack} />}
                {resolvedSection === 'general' && <DigitalDiwanVariant path={path} onBack={goBack} />}
            </div>
        </MainLayout>
    );
}

/* ============================================================================
   1. MUSLIM CORNER (`/muslim/*`): محراب المصحف الشريف ولطيفة الصفحة ٤٠٤
   ============================================================================ */
function MuslimCornerVariant({ path, onBack }: { path: string; onBack: () => void }) {
    const setTargetAyah = useMuslimNav((s) => s.setTargetAyah);

    return (
        <section className="mx-auto max-w-4xl px-4 pt-8 sm:pt-12">
            <div className="relative overflow-hidden rounded-3xl border border-emerald-500/25 bg-card p-6 sm:p-10 shadow-lg">
                {/* Soft Emerald & Gold radial backdrop */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full opacity-20 blur-3xl"
                    style={{
                        background:
                            'radial-gradient(circle, #10b981 0%, #f59e0b 55%, transparent 75%)',
                    }}
                />

                {/* Top Mihrab Arch + Ornate AyahMark Rosette with ٤٠٤ */}
                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        <MoonStar className="h-3.5 w-3.5" />
                        الركن الإسلامي · خطأ ٤٠٤
                    </div>

                    {/* Mihrab Frame */}
                    <div className="mt-5 flex flex-col items-center justify-center rounded-t-[4.5rem] rounded-b-2xl border border-amber-500/30 bg-gradient-to-b from-emerald-500/10 via-amber-500/5 to-transparent px-10 py-6 shadow-inner">
                        <div className="text-amber-600 dark:text-amber-400">
                            <AyahMark digits="٤٠٤" width={92} />
                        </div>
                        <span className="mt-2 text-xs font-bold tracking-wide text-muted-foreground">
                            الصفحة غير موجودة في هذا الباب
                        </span>
                    </div>

                    <h1 className="mt-5 text-2xl sm:text-4xl font-black text-foreground">
                        هذا الرابط غير موجود في الركن الإسلامي
                    </h1>
                    <p className="mt-2 max-w-xl text-sm sm:text-base leading-relaxed text-muted-foreground">
                        لم نعثر على المسار{' '}
                        <code
                            dir="ltr"
                            className="rounded bg-muted px-2 py-0.5 font-mono text-xs font-semibold text-foreground"
                        >
                            {path}
                        </code>{' '}
                        ضمن أدوات الركن الإسلامي، لكن يمكنك الانتقال مباشرة إلى مواقيت الصلاة أو المصحف الشريف أو الإذاعة.
                    </p>

                    {/* Quranic Page 404 Gem Card (Surah Ar-Rum, Page 404 of Madinah Mushaf) */}
                    <div className="mt-6 w-full max-w-2xl rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 sm:p-5 text-start">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="space-y-1">
                                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                                    <BookOpen className="h-3.5 w-3.5" />
                                    إشراقة من الصفحة (٤٠٤) في المصحف الشريف
                                </div>
                                <p className="text-sm font-bold text-foreground">
                                    تبدأ الصفحة ٤٠٤ من مصحف المدينة النبوية بمطلع سورة الروم (الجزء ٢١):
                                </p>
                                <p className="text-base sm:text-lg font-extrabold text-emerald-700 dark:text-emerald-300">
                                    ﴿ الم ۝ غُلِبَتِ الرُّومُ ۝ فِي أَدْنَى الْأَرْضِ وَهُم مِّن بَعْدِ غَلَبِهِمْ سَيَغْلِبُونَ ﴾
                                </p>
                            </div>
                            <Button
                                asChild
                                className="shrink-0 gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                            >
                                <Link
                                    href="/muslim/quran"
                                    onClick={() => setTargetAyah('30:1')}
                                >
                                    <QuranIcon className="h-5 w-5" />
                                    افتح ص ٤٠٤ بالمصحف
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Muslim Corner Tools Grid */}
                    <div className="mt-7 grid w-full grid-cols-1 gap-3 sm:grid-cols-3 text-start">
                        {MUSLIM_TOOLS.map((tool) => {
                            const Icon = tool.icon;
                            return (
                                <Link
                                    key={tool.href}
                                    href={tool.href}
                                    className="group flex flex-col justify-between rounded-2xl border border-border bg-background/60 p-4 transition-all hover:-translate-y-0.5 hover:border-emerald-500/50 hover:shadow-md"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 transition-transform group-hover:scale-110">
                                            <Icon className="h-7 w-7" />
                                        </div>
                                        <h2 className="font-bold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                                            {tool.title}
                                        </h2>
                                    </div>
                                    <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground">
                                        {tool.desc}
                                    </p>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Bottom Actions */}
                    <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                        <Button asChild size="lg" className="gap-2 rounded-xl font-bold">
                            <Link href="/muslim">
                                <MuslimIcon className="h-5 w-5" />
                                رئيسية الركن الإسلامي
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="gap-2 rounded-xl font-semibold">
                            <Link href="/">
                                <Home className="h-4 w-4" />
                                المساحة السورية
                            </Link>
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="lg"
                            onClick={onBack}
                            className="gap-2 rounded-xl"
                        >
                            <ArrowRight className="h-4 w-4" />
                            رجوع
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ============================================================================
   2. TRANSIT & MOBILITY (`/transit/*`, `/mishwar/*`, `/crossings/*`, `/places/*`)
   ============================================================================ */
function TransitRouteVariant({ path, onBack }: { path: string; onBack: () => void }) {
    return (
        <section className="mx-auto max-w-4xl px-4 pt-8 sm:pt-12">
            {/* Station Header Banner */}
            <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-lg">
                {/* Top Transit Sign Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-primary/10 px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                        <span className="inline-flex h-8 w-14 items-center justify-center rounded-lg bg-primary text-sm font-black text-primary-foreground shadow-sm">
                            404
                        </span>
                        <div>
                            <div className="text-xs font-bold text-primary">مركز انطلاق المساحة السورية</div>
                            <div className="text-sm font-extrabold text-foreground">
                                تنبيه مسار: محطة غير مسجّلة على الشبكة
                            </div>
                        </div>
                    </div>
                    <div
                        dir="ltr"
                        className="rounded-lg border border-border bg-background/80 px-3 py-1 font-mono text-xs font-semibold text-muted-foreground"
                    >
                        {path}
                    </div>
                </div>

                <div className="p-6 sm:p-8">
                    <div className="text-center sm:text-start">
                        <h1 className="text-2xl sm:text-3xl font-black text-foreground">
                            هذا السرفيس لا يمرّ من هنا!
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm sm:text-base text-muted-foreground">
                            يبدو أنك نزلت في محطة غير موجودة على خارطة المواصلات والأماكن. يمكنك معاينة المخطط أدناه للتحويل إلى أحد الخطوط العاملة.
                        </p>
                    </div>

                    {/* SVG Metro Route Map */}
                    <div className="my-7 overflow-hidden rounded-2xl border border-border/80 bg-muted/30 p-4 sm:p-6">
                        <svg viewBox="0 0 680 140" className="w-full h-auto" role="img" aria-label="مخطط مسار الخط 404">
                            {/* Main active green transit line (Right to Left for RTL) */}
                            <line
                                x1="620"
                                y1="55"
                                x2="250"
                                y2="55"
                                stroke="hsl(var(--primary))"
                                strokeWidth="6"
                                strokeLinecap="round"
                            />
                            {/* Dashed detour to 404 */}
                            <path
                                d="M 250 55 Q 170 55 140 95 L 70 95"
                                fill="none"
                                stroke="hsl(var(--destructive))"
                                strokeWidth="5"
                                strokeDasharray="10 8"
                                strokeLinecap="round"
                            />
                            {/* Continuation of main line faded */}
                            <line
                                x1="250"
                                y1="55"
                                x2="60"
                                y2="55"
                                stroke="hsl(var(--border))"
                                strokeWidth="4"
                                strokeLinecap="round"
                            />

                            {/* Station Nodes (RTL order: Damascus -> Homs -> Hama -> Aleppo) */}
                            {[
                                { x: 610, label: 'دمشق', sub: 'الرئيسية' },
                                { x: 490, label: 'حمص', sub: 'الروزنامة' },
                                { x: 370, label: 'حماة', sub: 'مشوار' },
                                { x: 250, label: 'حلب', sub: 'ترانزيت' },
                            ].map((st) => (
                                <g key={st.label}>
                                    <circle
                                        cx={st.x}
                                        cy="55"
                                        r="10"
                                        fill="hsl(var(--card))"
                                        stroke="hsl(var(--primary))"
                                        strokeWidth="4"
                                    />
                                    <text
                                        x={st.x}
                                        y="28"
                                        textAnchor="middle"
                                        className="fill-foreground text-[13px] font-bold"
                                    >
                                        {st.label}
                                    </text>
                                    <text
                                        x={st.x}
                                        y="84"
                                        textAnchor="middle"
                                        className="fill-muted-foreground text-[11px]"
                                    >
                                        {st.sub}
                                    </text>
                                </g>
                            ))}

                            {/* 404 Detour Node */}
                            <g>
                                <circle
                                    cx="75"
                                    cy="95"
                                    r="13"
                                    fill="hsl(var(--destructive))"
                                />
                                <text
                                    x="75"
                                    y="99"
                                    textAnchor="middle"
                                    className="fill-white text-[11px] font-black"
                                >
                                    404
                                </text>
                                <text
                                    x="75"
                                    y="126"
                                    textAnchor="middle"
                                    className="fill-foreground text-[12px] font-bold"
                                >
                                    محطة مفقودة
                                </text>
                            </g>
                        </svg>
                    </div>

                    {/* Transfer Lines Grid */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {TRANSIT_LINES.map((line) => {
                            const Icon = line.icon;
                            return (
                                <Link
                                    key={line.code}
                                    href={line.href}
                                    className="group flex items-center justify-between gap-3 rounded-2xl border border-border bg-background/60 p-3.5 transition-all hover:border-primary/50 hover:bg-accent/40"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                                            <Icon className="h-7 w-7" />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] font-bold text-muted-foreground">
                                                    {line.code}
                                                </span>
                                                <span className="truncate text-sm font-bold text-foreground group-hover:text-primary">
                                                    {line.title}
                                                </span>
                                            </div>
                                            <p className="mt-0.5 truncate text-xs text-muted-foreground">
                                                {line.route}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="shrink-0 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                                        {line.status}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Bottom Action Strip */}
                    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-5">
                        <div className="flex flex-wrap gap-2.5">
                            <Button asChild className="gap-2 rounded-xl font-bold">
                                <Link href="/transit">
                                    <TransitIcon className="h-5 w-5" />
                                    شبكة ترانزيت
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="gap-2 rounded-xl font-semibold">
                                <Link href="/">
                                    <Home className="h-4 w-4" />
                                    المحطة الرئيسية
                                </Link>
                            </Button>
                            <Button type="button" variant="ghost" onClick={onBack} className="gap-2 rounded-xl">
                                <RotateCcw className="h-4 w-4" />
                                رجوع
                            </Button>
                        </div>
                        <span className="text-xs text-muted-foreground">
                            الخط ٤٠٤ خارج الخدمة حالياً
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ============================================================================
   3. GAMES (`/games/*`, `/guesswho/*`): ورقة خارج اللعبة
   ============================================================================ */
function GameTableVariant({ path, onBack }: { path: string; onBack: () => void }) {
    const internalLinks = useMemo(
        () => SITE_LINKS.filter((l) => l.isInternal && !l.external),
        [],
    );
    const [flipped, setFlipped] = useState(false);
    const [drawnIndex, setDrawnIndex] = useState(0);

    const drawnTool: SiteLink = internalLinks[drawnIndex % internalLinks.length] ?? {
        href: '/',
        text: 'الرئيسية',
        icon: RoznamaIcon,
    };
    const DrawnIcon = drawnTool.icon;

    const dealRandomCard = () => {
        setFlipped(true);
        setDrawnIndex((prev) => (prev + 1 + Math.floor(Math.random() * (internalLinks.length - 1))) % internalLinks.length);
    };

    return (
        <section className="mx-auto flex max-w-4xl flex-col items-center px-4 pt-8 sm:pt-12 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                طاولة ألعاب المساحة السورية · خطأ ٤٠٤
            </div>

            <h1 className="mt-3 text-2xl sm:text-4xl font-black text-foreground">
                هذه الورقة خارج اللعبة!
            </h1>
            <p className="mt-2 max-w-lg text-sm sm:text-base text-muted-foreground">
                فتّشنا أوراق الطرنيب والتركس وقطع الـ 2048 ولم نعثر على الصفحة{' '}
                <code dir="ltr" className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
                    {path}
                </code>
                . اقلب الورقة الوسطى أو اختر لعبة من الصالة!
            </p>

            {/* 3-Card Hand Display (4 - 0/Joker - 4) */}
            <div
                dir="ltr"
                className="my-8 flex items-center justify-center gap-3 sm:gap-6 select-none"
            >
                {/* Left Card: 4 of Spades */}
                <div className="relative h-44 w-32 sm:h-56 sm:w-40 -rotate-6 rounded-2xl border border-amber-900/20 bg-[#fdfcf9] text-slate-900 shadow-xl transition-transform hover:-translate-y-2">
                    <div className="absolute top-3 left-3 flex flex-col items-center leading-none">
                        <span className="text-xl sm:text-2xl font-black">4</span>
                        <span className="text-lg">♠</span>
                    </div>
                    <div className="flex h-full flex-col items-center justify-center">
                        <span className="text-5xl sm:text-6xl font-black">٤</span>
                        <span className="mt-1 text-[11px] font-bold text-slate-500">طرنيب المساحة</span>
                    </div>
                    <div className="absolute bottom-3 right-3 flex flex-col items-center leading-none rotate-180">
                        <span className="text-xl sm:text-2xl font-black">4</span>
                        <span className="text-lg">♠</span>
                    </div>
                </div>

                {/* Middle Card: Interactive 0 / Random Tool Card */}
                <button
                    type="button"
                    onClick={() => setFlipped((f) => !f)}
                    aria-label="اقلب الورقة"
                    className={cn(
                        'group relative h-48 w-36 sm:h-60 sm:w-44 rounded-2xl shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-3',
                        flipped
                            ? 'border-2 border-primary bg-card text-card-foreground'
                            : 'sz-card--back',
                    )}
                >
                    {flipped ? (
                        <div dir="rtl" className="flex h-full flex-col items-center justify-between p-4">
                            <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-[11px] font-bold text-primary">
                                ورقة الحظ
                            </span>
                            <div className="flex flex-col items-center gap-2">
                                {DrawnIcon ? (
                                    <DrawnIcon className="h-14 w-14" />
                                ) : (
                                    <GamesIcon className="h-14 w-14" />
                                )}
                                <span className="text-base sm:text-lg font-extrabold text-foreground">
                                    {drawnTool.text}
                                </span>
                            </div>
                            <span className="text-[11px] text-muted-foreground">
                                اضغط «افتح الورقة» بالأسفل
                            </span>
                        </div>
                    ) : (
                        <div className="relative z-10 flex h-full flex-col items-center justify-between p-4 text-primary-foreground">
                            <span className="rounded-full bg-black/25 px-2.5 py-0.5 text-[10px] font-bold">
                                اضغط لقلب الورقة
                            </span>
                            <span className="text-6xl sm:text-7xl font-black drop-shadow">٠</span>
                            <span className="text-[11px] font-semibold opacity-90">
                                جوكر المساحة
                            </span>
                        </div>
                    )}
                </button>

                {/* Right Card: 4 of Hearts */}
                <div className="relative h-44 w-32 sm:h-56 sm:w-40 rotate-6 rounded-2xl border border-amber-900/20 bg-[#fdfcf9] text-[#c02626] shadow-xl transition-transform hover:-translate-y-2">
                    <div className="absolute top-3 left-3 flex flex-col items-center leading-none">
                        <span className="text-xl sm:text-2xl font-black">4</span>
                        <span className="text-lg">♥</span>
                    </div>
                    <div className="flex h-full flex-col items-center justify-center">
                        <span className="text-5xl sm:text-6xl font-black">٤</span>
                        <span className="mt-1 text-[11px] font-bold text-rose-700/70">كبة المحبة</span>
                    </div>
                    <div className="absolute bottom-3 right-3 flex flex-col items-center leading-none rotate-180">
                        <span className="text-xl sm:text-2xl font-black">4</span>
                        <span className="text-lg">♥</span>
                    </div>
                </div>
            </div>

            {/* Interactive Controls */}
            <div className="flex flex-wrap items-center justify-center gap-3">
                <Button asChild size="lg" className="gap-2 rounded-xl font-bold shadow-sm">
                    <Link href="/games">
                        <GamesIcon className="h-5 w-5" />
                        صالة الألعاب
                    </Link>
                </Button>
                <Button
                    type="button"
                    size="lg"
                    variant="outline"
                    onClick={dealRandomCard}
                    className="gap-2 rounded-xl font-bold"
                >
                    <Shuffle className="h-4 w-4" />
                    اسحب ورقة عشوائية
                </Button>
                {flipped && (
                    <Button asChild size="lg" variant="secondary" className="gap-2 rounded-xl font-bold">
                        <Link href={drawnTool.href}>
                            افتح «{drawnTool.text}»
                        </Link>
                    </Button>
                )}
                <Button type="button" size="lg" variant="ghost" onClick={onBack} className="gap-2 rounded-xl">
                    <ArrowRight className="h-4 w-4" />
                    رجوع
                </Button>
            </div>

            {/* Games Mini Strip */}
            <div className="mt-8 grid w-full max-w-2xl grid-cols-2 gap-2.5 sm:grid-cols-5">
                {[
                    { href: '/games/tarneeb', name: 'طرنيب', badge: 'ورق' },
                    { href: '/games/trix', name: 'تركس', badge: 'ورق' },
                    { href: '/games/solitare', name: 'سوليتير', badge: 'كلاسيك' },
                    { href: '/games/2048', name: '2048', badge: 'أرقام' },
                    { href: '/guesswho', name: 'احزر مين', badge: 'شخصيات' },
                ].map((game) => (
                    <Link
                        key={game.href}
                        href={game.href}
                        className="flex items-center justify-between rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm font-bold transition-colors hover:border-primary/50 hover:text-primary"
                    >
                        <span>{game.name}</span>
                        <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                            {game.badge}
                        </span>
                    </Link>
                ))}
            </div>
        </section>
    );
}

/* ============================================================================
   4. GENERAL (Default for all other paths): الديوان الرقمي (Blueprint & Search)
   ============================================================================ */
function DigitalDiwanVariant({ path, onBack }: { path: string; onBack: () => void }) {
    const [query, setQuery] = useState('');

    const internalTools = useMemo(
        () => SITE_LINKS.filter((l) => l.isInternal && !l.external),
        [],
    );

    const filteredTools = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return internalTools;
        return internalTools.filter(
            (item) =>
                item.text.toLowerCase().includes(q) ||
                item.href.toLowerCase().includes(q),
        );
    }, [internalTools, query]);

    return (
        <section className="mx-auto max-w-5xl px-4 pt-8 sm:pt-12">
            <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-sm">
                {/* Giant Architectural 404 Watermark */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none select-none absolute -top-8 left-4 text-[7rem] sm:text-[11rem] font-black leading-none tracking-tighter text-primary/10"
                >
                    404
                </div>

                <div className="relative z-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
                    {/* Right Column (RTL): Editorial Status & Actions */}
                    <div className="lg:col-span-5 text-start">
                        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-bold text-primary">
                            <span className="h-2 w-2 rounded-full bg-primary" />
                            الديوان الرقمي · رمز الحالة ٤٠٤
                        </div>

                        <h1 className="mt-4 text-2xl sm:text-4xl font-black leading-tight text-foreground">
                            العنوان غير مسجّل في فهرس المساحة
                        </h1>

                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                            لم نتمكن من العثور على وثيقة أو أداة تطابق المسار المطلوب. استخدم الفهرس الفوري للوصول المباشر إلى أي خدمة من خدمات المساحة السورية.
                        </p>

                        <div className="mt-4 rounded-xl border border-border bg-background/70 p-3">
                            <div className="text-[11px] font-semibold text-muted-foreground">
                                الرابط الذي تم طلبه:
                            </div>
                            <code
                                dir="ltr"
                                className="mt-1 block truncate font-mono text-xs font-bold text-foreground"
                            >
                                https://syrian.zone{path}
                            </code>
                        </div>

                        <div className="mt-6 flex flex-wrap gap-2.5">
                            <Button asChild className="gap-2 rounded-xl font-bold">
                                <Link href="/">
                                    <Home className="h-4 w-4" />
                                    الصفحة الرئيسية
                                </Link>
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onBack}
                                className="gap-2 rounded-xl font-semibold"
                            >
                                <ArrowRight className="h-4 w-4" />
                                رجوع
                            </Button>
                        </div>
                    </div>

                    {/* Left Column (RTL): Instant Tool Directory & Search */}
                    <div className="lg:col-span-7">
                        <div className="rounded-2xl border border-border bg-background/60 p-4 sm:p-5">
                            <div className="relative">
                                <Search className="pointer-events-none absolute top-1/2 start-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    type="search"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="ابحث في فهرس أدوات المساحة السورية (مثل: ترانزيت، قرآن، روزنامة...)"
                                    className="w-full rounded-xl border border-input bg-card py-2.5 ps-10 pe-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                            <div className="mt-4 grid max-h-72 grid-cols-2 gap-2 overflow-y-auto sm:grid-cols-3 sz-scroll pe-1">
                                {filteredTools.map((tool) => {
                                    const Icon = tool.icon;
                                    return (
                                        <Link
                                            key={tool.href}
                                            href={tool.href}
                                            className="group flex items-center gap-2.5 rounded-xl border border-border/60 bg-card p-2.5 text-start transition-all hover:border-primary/50 hover:bg-accent/40"
                                        >
                                            {Icon ? (
                                                <Icon className="h-7 w-7 shrink-0 transition-transform group-hover:scale-110" />
                                            ) : (
                                                <Compass className="h-6 w-6 shrink-0 text-primary" />
                                            )}
                                            <div className="min-w-0">
                                                <div className="truncate text-xs font-bold text-foreground group-hover:text-primary">
                                                    {tool.text}
                                                </div>
                                                <div
                                                    dir="ltr"
                                                    className="truncate font-mono text-[10px] text-muted-foreground"
                                                >
                                                    {tool.href}
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                                {filteredTools.length === 0 && (
                                    <div className="col-span-full py-8 text-center text-xs text-muted-foreground">
                                        لا توجد أداة مطابقة لـ «{query}»
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
