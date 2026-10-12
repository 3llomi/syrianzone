import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { BarChart3, ExternalLink, Sparkles } from 'lucide-react';
import MainLayout from '@/Layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { CompassIcon, TierlistIcon } from '@/Components/Icons/ProjectIcons';

export default function Stats() {
    const embedUrl = "https://datastudio.google.com/embed/reporting/65f1f763-c5ab-4841-bfba-bd7403d76645/page/KGHXF";

    return (
        <MainLayout>
            <Head>
                <title>إحصائيات المنصة</title>
                <meta name="description" content="إحصائيات وتقارير تفاعلية حول المنصة وزوارها والنشاط العام في المساحة السورية." />
            </Head>

            <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl min-h-screen text-foreground">
                {/* Page Header */}
                <div className="text-center mb-8 space-y-4">
                    <div className="inline-flex p-3 bg-primary/10 rounded-full text-primary mb-2">
                        <BarChart3 className="w-10 h-10" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">إحصائيات المنصة</h1>
                    <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base">
                        تقارير وإحصائيات تفاعلية حول التفاعل والنشاط في المساحة السورية
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                        <Button asChild variant="outline" className="gap-2">
                            <Link href="/tierlist/leaderboard">
                                <TierlistIcon className="h-4 w-4" />
                                إحصائيات تير ليست الحكومة
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="gap-2">
                            <Link href="/compass/stats">
                                <CompassIcon className="h-4 w-4" />
                                إحصاءات بوصلة سوريا
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="space-y-6" dir="rtl">
                        <Card className="border-border bg-card/50 backdrop-blur-sm">
                            <CardHeader className="flex flex-row items-center justify-between gap-4">
                                <div>
                                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                                        <Sparkles className="w-5 h-5 text-primary" />
                                        تقرير الإحصائيات التفاعلي
                                    </CardTitle>
                                    <CardDescription>
                                        بيانات مباشرة ومحدّثة تعكس التفاعل وحركة الزوار عبر أدوات المنصة
                                    </CardDescription>
                                </div>
                                <Button asChild variant="outline" size="sm" className="gap-2 shrink-0">
                                    <a href={embedUrl} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="w-4 h-4" />
                                        <span>فتح في نافذة جديدة</span>
                                    </a>
                                </Button>
                            </CardHeader>
                            <CardContent className="p-2 md:p-4">
                                <div className="relative w-full rounded-xl overflow-hidden border border-border/60 bg-background shadow-inner">
                                    <iframe
                                        src={embedUrl}
                                        width="100%"
                                        height="750"
                                        frameBorder="0"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                                        className="w-full min-h-[600px] md:min-h-[750px] rounded-xl"
                                        title="Syrian Zone Analytics Report"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                </div>
            </div>
        </MainLayout>
    );
}
